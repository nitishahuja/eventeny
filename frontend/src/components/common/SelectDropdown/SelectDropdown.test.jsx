import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectDropdown from './SelectDropdown';

describe('SelectDropdown', () => {
  const defaultProps = {
    options: ['Option A', 'Option B', 'Option C'],
    onChange: vi.fn(),
    placeholder: 'Choose one',
    ariaLabel: 'Select option',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders trigger with placeholder when value is empty', () => {
    render(<SelectDropdown {...defaultProps} value='' />);
    expect(screen.getByRole('button', { name: 'Select option' })).toHaveTextContent('Choose one');
  });

  it('renders trigger with selected value when value is set', () => {
    render(<SelectDropdown {...defaultProps} value='Option A' />);
    expect(screen.getByRole('button', { name: 'Select option' })).toHaveTextContent('Option A');
  });

  it('trigger has correct aria attributes when closed', () => {
    render(<SelectDropdown {...defaultProps} />);
    const trigger = screen.getByRole('button', { name: 'Select option' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('opens listbox when trigger is clicked', () => {
    render(<SelectDropdown {...defaultProps} />);
    const trigger = screen.getByRole('button', { name: 'Select option' });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    fireEvent.click(trigger);

    expect(screen.getByRole('listbox', { name: 'Select option' })).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes listbox when trigger is clicked again', () => {
    render(<SelectDropdown {...defaultProps} />);
    const trigger = screen.getByRole('button', { name: 'Select option' });

    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes listbox when clicking outside', () => {
    render(
      <div>
        <div data-testid='outside'>Outside</div>
        <SelectDropdown {...defaultProps} />
      </div>,
    );
    const trigger = screen.getByRole('button', { name: 'Select option' });

    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('calls onChange when option is selected', () => {
    render(<SelectDropdown {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select option' }));

    fireEvent.click(screen.getByRole('button', { name: 'Option B' }));

    expect(defaultProps.onChange).toHaveBeenCalledWith('Option B');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('calls onChange with empty string when placeholder option is clicked', () => {
    render(<SelectDropdown {...defaultProps} value='Option A' />);
    fireEvent.click(screen.getByRole('button', { name: 'Select option' }));

    fireEvent.click(screen.getByRole('button', { name: 'Choose one' }));

    expect(defaultProps.onChange).toHaveBeenCalledWith('');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows placeholder as first option in list', () => {
    render(<SelectDropdown {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select option' }));

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose one' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Option A' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Option B' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Option C' })).toBeInTheDocument();
  });

  it('uses custom ariaLabel prop', () => {
    render(<SelectDropdown {...defaultProps} ariaLabel='Application' />);
    expect(screen.getByRole('button', { name: 'Application' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Application' }));
    expect(screen.getByRole('listbox', { name: 'Application' })).toBeInTheDocument();
  });

  it('works with empty options', () => {
    render(<SelectDropdown {...defaultProps} options={[]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select option' }));

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose one' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Option A' })).not.toBeInTheDocument();
  });

  it('does not close when clicking inside the dropdown', () => {
    render(<SelectDropdown {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select option' }));

    const optionA = screen.getByRole('button', { name: 'Option A' });
    fireEvent.mouseDown(optionA);
    fireEvent.click(optionA);

    expect(defaultProps.onChange).toHaveBeenCalledWith('Option A');
  });
});
