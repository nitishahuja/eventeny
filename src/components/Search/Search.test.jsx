import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Search from './Search';

describe('Search', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the search input with placeholder', () => {
    render(<Search />);
    const input = screen.getByPlaceholderText('Search by business, name, tag, etc');
    expect(input).toBeInTheDocument();
  });

  it('renders with initial value when provided', () => {
    render(<Search value='acme' onChange={() => {}} />);
    expect(screen.getByDisplayValue('acme')).toBeInTheDocument();
  });

  it('updates local value immediately when user types', () => {
    render(<Search onChange={() => {}} />);
    const input = screen.getByLabelText(/search by business name, tag, or application/i);

    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');
  });

  it('calls onChange after debounce delay', () => {
    const onChange = vi.fn();
    render(<Search onChange={onChange} />);
    const input = screen.getByLabelText(/search by business name, tag, or application/i);

    fireEvent.change(input, { target: { value: 'acme' } });
    expect(onChange).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(onChange).toHaveBeenCalledWith('acme');
  });

  it('does not call onChange before debounce completes', () => {
    const onChange = vi.fn();
    render(<Search onChange={onChange} />);
    const input = screen.getByLabelText(/search by business name, tag, or application/i);

    fireEvent.change(input, { target: { value: 'a' } });
    vi.advanceTimersByTime(200);
    expect(onChange).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('shows clear button only when input has value', () => {
    const { container } = render(<Search value='' onChange={() => {}} />);
    const clearBtn = container.querySelector('[aria-label="Clear search"]');
    expect(clearBtn).toBeInTheDocument();
    expect(clearBtn).toHaveAttribute('aria-hidden', 'true');
    expect(clearBtn).toHaveAttribute('tabindex', '-1');
  });

  it('shows clear button when input has value', () => {
    render(<Search value='test' onChange={() => {}} />);
    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    expect(clearBtn).toHaveAttribute('aria-hidden', 'false');
    expect(clearBtn).toHaveAttribute('tabindex', '0');
  });

  it('clears input and calls onChange when clear button is clicked', () => {
    const onChange = vi.fn();
    render(<Search value='test' onChange={onChange} />);

    const input = screen.getByLabelText(/search by business name, tag, or application/i);
    expect(input).toHaveValue('test');

    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearBtn);

    expect(input).toHaveValue('');
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('has accessible label associated with input', () => {
    render(<Search />);
    const label = screen.getByText(/search by business name, tag, or application/i);
    const input = screen.getByLabelText(/search by business name, tag, or application/i);
    expect(label).toHaveAttribute('for', 'search-input');
    expect(input).toHaveAttribute('id', 'search-input');
  });

  it('search group has role and aria-label', () => {
    render(<Search />);
    expect(screen.getByRole('group', { name: /search/i })).toBeInTheDocument();
  });

  it('works without onChange prop', () => {
    render(<Search />);
    const input = screen.getByLabelText(/search by business name, tag, or application/i);

    fireEvent.change(input, { target: { value: 'test' } });
    vi.advanceTimersByTime(300);
    expect(input).toHaveValue('test');
  });
});
