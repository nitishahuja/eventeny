import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Filters from './Filters';

vi.mock('../../hooks/useIsMobile', () => ({
  default: vi.fn(() => false),
}));

describe('Filters', () => {
  const defaultProps = {
    filters: { application: '', status: [], payment: [] },
    onChange: vi.fn(),
    applications: ['App A', 'App B'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the filter trigger button', () => {
    render(<Filters {...defaultProps} />);
    expect(screen.getByRole('button', { name: /filter results/i })).toBeInTheDocument();
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('trigger has correct aria attributes when closed', () => {
    render(<Filters {...defaultProps} />);
    const trigger = screen.getByRole('button', { name: /filter results/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    expect(trigger).toHaveAttribute('aria-controls', 'filters-panel');
  });

  it('opens panel when trigger is clicked', () => {
    render(<Filters {...defaultProps} />);
    const trigger = screen.getByRole('button', { name: /filter results/i });

    expect(screen.queryByRole('dialog', { name: /filter options/i })).not.toBeInTheDocument();

    fireEvent.click(trigger);

    expect(screen.getByRole('dialog', { name: /filter options/i })).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes panel when trigger is clicked again', () => {
    render(<Filters {...defaultProps} />);
    const trigger = screen.getByRole('button', { name: /filter results/i });

    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: /filter options/i })).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.queryByRole('dialog', { name: /filter options/i })).not.toBeInTheDocument();
  });

  it('closes panel when Escape is pressed', () => {
    render(<Filters {...defaultProps} />);
    const trigger = screen.getByRole('button', { name: /filter results/i });

    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: /filter options/i })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /filter options/i })).not.toBeInTheDocument();
  });

  it('closes panel when clicking outside', () => {
    render(
      <div>
        <div data-testid='outside'>Outside</div>
        <Filters {...defaultProps} />
      </div>,
    );
    const trigger = screen.getByRole('button', { name: /filter results/i });

    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: /filter options/i })).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('dialog', { name: /filter options/i })).not.toBeInTheDocument();
  });

  it('trigger has active class when panel is open', () => {
    render(<Filters {...defaultProps} />);
    const trigger = screen.getByRole('button', { name: /filter results/i });

    expect(trigger).not.toHaveClass('filters-trigger--active');
    fireEvent.click(trigger);
    expect(trigger).toHaveClass('filters-trigger--active');
  });

  it('calls onChange with status when status checkbox is checked', () => {
    render(<Filters {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /filter results/i }));

    const approvedCheckbox = screen.getByRole('checkbox', { name: /approved/i });
    fireEvent.click(approvedCheckbox);

    expect(defaultProps.onChange).toHaveBeenCalledWith({
      application: '',
      status: ['Approved'],
      payment: [],
    });
  });

  it('calls onChange removing status when status checkbox is unchecked', () => {
    render(
      <Filters
        {...defaultProps}
        filters={{ application: '', status: ['Approved'], payment: [] }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /filter results/i }));

    const approvedCheckbox = screen.getByRole('checkbox', { name: /approved/i });
    fireEvent.click(approvedCheckbox);

    expect(defaultProps.onChange).toHaveBeenCalledWith({
      application: '',
      status: [],
      payment: [],
    });
  });

  it('calls onChange with payment when payment checkbox is checked', () => {
    render(<Filters {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /filter results/i }));

    const paidCheckbox = screen.getByRole('checkbox', { name: /^paid$/i });
    fireEvent.click(paidCheckbox);

    expect(defaultProps.onChange).toHaveBeenCalledWith({
      application: '',
      status: [],
      payment: ['paid'],
    });
  });

  it('calls onChange removing payment when payment checkbox is unchecked', () => {
    render(
      <Filters
        {...defaultProps}
        filters={{ application: '', status: [], payment: ['paid'] }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /filter results/i }));

    const paidCheckbox = screen.getByRole('checkbox', { name: /^paid$/i });
    fireEvent.click(paidCheckbox);

    expect(defaultProps.onChange).toHaveBeenCalledWith({
      application: '',
      status: [],
      payment: [],
    });
  });

  it('calls onChange with application when application is selected from dropdown', () => {
    const onChange = vi.fn();
    render(<Filters {...defaultProps} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /filter results/i }));

    const appTrigger = screen.getByRole('button', { name: /application/i });
    fireEvent.click(appTrigger);

    fireEvent.click(screen.getByRole('button', { name: 'App A' }));

    expect(onChange).toHaveBeenCalledWith({
      application: 'App A',
      status: [],
      payment: [],
    });
  });

  it('shows Status and Payment sections in panel', () => {
    render(<Filters {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /filter results/i }));

    expect(screen.getByRole('heading', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Payment status' })).toBeInTheDocument();
  });

  it('shows all status options', () => {
    render(<Filters {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /filter results/i }));

    expect(screen.getByRole('checkbox', { name: /approved/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /waitlisted/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /withdrawn/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /awaiting decision/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /rejected/i })).toBeInTheDocument();
  });

  it('shows all payment options', () => {
    render(<Filters {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /filter results/i }));

    expect(screen.getByRole('checkbox', { name: /^paid$/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /not paid/i })).toBeInTheDocument();
  });

  it('works with empty applications list', () => {
    render(<Filters {...defaultProps} applications={[]} />);
    fireEvent.click(screen.getByRole('button', { name: /filter results/i }));

    expect(screen.getByRole('button', { name: /application/i })).toHaveTextContent(
      'All applications',
    );
  });
});
