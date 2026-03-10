import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Table from './Table';

const mockRows = [
  {
    businessName: 'Acme Corp',
    application: 'Event A',
    tag: ['VIP', 'Sponsor'],
    payment: 'paid',
    currentStatus: 'Approved',
    date: '2024-01-15',
  },
  {
    businessName: 'Beta Inc',
    application: 'Event B',
    tag: ['New'],
    payment: 'Not Paid',
    currentStatus: 'Awaiting decision',
    date: '2024-02-20',
  },
  {
    businessName: 'Gamma LLC',
    application: 'Event A',
    tag: [],
    payment: 'paid',
    currentStatus: 'Rejected',
    date: '2024-03-01',
  },
];

describe('Table', () => {
  it('shows loading state when loading is true', () => {
    render(<Table rows={[]} loading={true} />);
    expect(
      screen.getByRole('region', { name: /applications table/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('status', { name: undefined })).toHaveTextContent(
      'Loading applications…',
    );
  });

  it('shows empty state when rows is empty and not loading', () => {
    render(<Table rows={[]} loading={false} />);
    expect(screen.getByText('No applications found.')).toBeInTheDocument();
    expect(
      screen.getByText(/try adjusting your search or filters/i),
    ).toBeInTheDocument();
  });

  it('renders table with rows', () => {
    render(<Table rows={mockRows} />);
    const table = screen.getByRole('table', { name: /applications/i });
    expect(table).toBeInTheDocument();
    expect(within(table).getByText('Acme Corp')).toBeInTheDocument();
    expect(within(table).getByText('Beta Inc')).toBeInTheDocument();
    expect(within(table).getByText('Gamma LLC')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<Table rows={mockRows} />);
    const table = screen.getByRole('table', { name: /applications/i });
    expect(
      within(table).getByRole('columnheader', { name: /select all rows/i }),
    ).toBeInTheDocument();
    expect(
      within(table).getByRole('button', { name: /sort by business name/i }),
    ).toBeInTheDocument();
    expect(
      within(table).getByRole('columnheader', { name: 'Tag' }),
    ).toBeInTheDocument();
    expect(
      within(table).getByRole('columnheader', { name: 'Application' }),
    ).toBeInTheDocument();
    expect(
      within(table).getByRole('columnheader', { name: 'Payment' }),
    ).toBeInTheDocument();
    expect(
      within(table).getByRole('columnheader', { name: 'Status' }),
    ).toBeInTheDocument();
    expect(
      within(table).getByRole('columnheader', { name: 'Date' }),
    ).toBeInTheDocument();
  });

  it('shows results count for screen readers', () => {
    render(<Table rows={mockRows} />);
    const liveRegion = document.querySelector('.sr-only[aria-live="polite"]');
    expect(liveRegion).toHaveTextContent(/showing 1 to 3 of 3 applications/i);
  });

  it('sort button toggles aria-sort and re-sorts', () => {
    render(<Table rows={mockRows} />);
    const table = screen.getByRole('table', { name: /applications/i });
    const sortBtn = within(table).getByRole('button', {
      name: /sort by business name/i,
    });

    expect(sortBtn).toHaveAttribute('aria-sort', 'ascending');
    fireEvent.click(sortBtn);
    expect(sortBtn).toHaveAttribute('aria-sort', 'descending');

    const rows = within(table).getAllByRole('row').slice(1);
    expect(rows[0]).toHaveTextContent('Gamma LLC');
    expect(rows[2]).toHaveTextContent('Acme Corp');

    fireEvent.click(sortBtn);
    expect(sortBtn).toHaveAttribute('aria-sort', 'ascending');
  });

  it('select all checkbox selects all rows on page', () => {
    render(<Table rows={mockRows} />);
    const selectAll = screen.getAllByRole('checkbox', {
      name: /select all rows on this page/i,
    })[0];

    fireEvent.click(selectAll);
    expect(selectAll).toBeChecked();
    expect(
      screen.getAllByRole('checkbox', { name: /select acme corp/i })[0],
    ).toBeChecked();
    expect(
      screen.getAllByRole('checkbox', { name: /select beta inc/i })[0],
    ).toBeChecked();
    expect(
      screen.getAllByRole('checkbox', { name: /select gamma llc/i })[0],
    ).toBeChecked();
  });

  it('select all checkbox deselects all when clicked again', () => {
    render(<Table rows={mockRows} />);
    const selectAll = screen.getAllByRole('checkbox', {
      name: /select all rows on this page/i,
    })[0];

    fireEvent.click(selectAll);
    fireEvent.click(selectAll);
    expect(selectAll).not.toBeChecked();
    expect(
      screen.getAllByRole('checkbox', { name: /select acme corp/i })[0],
    ).not.toBeChecked();
  });

  it('row checkbox selects single row', () => {
    render(<Table rows={mockRows} />);
    const acmeCheckboxes = screen.getAllByRole('checkbox', {
      name: /select acme corp/i,
    });
    fireEvent.click(acmeCheckboxes[0]);
    expect(acmeCheckboxes[0]).toBeChecked();
  });

  it('shows bulk bar when rows are selected', () => {
    render(<Table rows={mockRows} />);
    fireEvent.click(
      screen.getAllByRole('checkbox', { name: /select acme corp/i })[0],
    );

    expect(
      screen.getByRole('toolbar', { name: /bulk actions/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/1 row selected/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /clear selection/i }),
    ).toBeInTheDocument();
  });

  it('shows bulk status actions when rows are selected', () => {
    render(<Table rows={mockRows} />);
    fireEvent.click(
      screen.getAllByRole('checkbox', { name: /select acme corp/i })[0],
    );

    expect(
      screen.getByRole('button', { name: /apply/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /bulk status/i }),
    ).toBeInTheDocument();
  });

  it('bulk actions call onBulkStatusChange with selected business names and status', () => {
    const onBulkStatusChange = vi.fn();
    render(<Table rows={mockRows} onBulkStatusChange={onBulkStatusChange} />);

    fireEvent.click(
      screen.getAllByRole('checkbox', { name: /select acme corp/i })[0],
    );

    fireEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(onBulkStatusChange).toHaveBeenCalledTimes(1);
    const [businessNames, status] = onBulkStatusChange.mock.calls[0];
    expect(businessNames).toEqual(['Acme Corp']);
    expect(status).toBe('Approved');
  });

  it('clear selection button clears selection and hides bulk bar', () => {
    render(<Table rows={mockRows} />);
    fireEvent.click(
      screen.getAllByRole('checkbox', { name: /select acme corp/i })[0],
    );
    expect(
      screen.getByRole('toolbar', { name: /bulk actions/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /clear selection/i }));
    expect(
      screen.queryByRole('toolbar', { name: /bulk actions/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('checkbox', { name: /select acme corp/i })[0],
    ).not.toBeChecked();
  });

  it('calls onViewApplicant when business name is clicked', () => {
    const onViewApplicant = vi.fn();
    render(<Table rows={mockRows} onViewApplicant={onViewApplicant} />);

    const table = screen.getByRole('table', { name: /applications/i });
    fireEvent.click(within(table).getByRole('button', { name: 'Acme Corp' }));
    expect(onViewApplicant).toHaveBeenCalledTimes(1);
    expect(onViewApplicant).toHaveBeenCalledWith(mockRows[0]);
  });

  it('calls onViewApplicant when business name receives Enter key', () => {
    const onViewApplicant = vi.fn();
    render(<Table rows={mockRows} onViewApplicant={onViewApplicant} />);

    const table = screen.getByRole('table', { name: /applications/i });
    const nameButton = within(table).getByRole('button', { name: 'Beta Inc' });
    nameButton.focus();
    fireEvent.keyDown(nameButton, { key: 'Enter' });
    expect(onViewApplicant).toHaveBeenCalledWith(mockRows[1]);
  });

  it('renders pagination', () => {
    render(<Table rows={mockRows} />);
    expect(
      screen.getByRole('navigation', { name: /table pagination/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /previous page/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /next page/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
  });

  it('previous page button is disabled on first page', () => {
    render(<Table rows={mockRows} />);
    expect(
      screen.getByRole('button', { name: /previous page/i }),
    ).toBeDisabled();
  });

  it('next page button is disabled on last page when few rows', () => {
    render(<Table rows={mockRows} />);
    expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
  });

  it('current page button has aria-current', () => {
    render(<Table rows={mockRows} />);
    const page1 = screen.getByRole('button', { name: 'Page 1' });
    expect(page1).toHaveAttribute('aria-current', 'page');
  });

  it('displays status with accessible label', () => {
    render(<Table rows={mockRows} />);
    expect(screen.getAllByText('Approved').length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByLabelText(/approved status/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('displays payment as Paid or Not Paid', () => {
    render(<Table rows={mockRows} />);
    expect(screen.getAllByText('Paid').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Not Paid').length).toBeGreaterThanOrEqual(1);
  });

  it('action button has aria-label per row', () => {
    render(<Table rows={mockRows} />);
    expect(
      screen.getAllByRole('button', { name: /actions for acme corp/i }).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByRole('button', { name: /actions for beta inc/i }).length,
    ).toBeGreaterThanOrEqual(1);
  });
});
