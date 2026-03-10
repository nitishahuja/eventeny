import SelectDropdown from '../common/SelectDropdown/SelectDropdown';

const STATUS_COLORS = {
  'Awaiting decision': 'table-status--awaiting',
  Approved: 'table-status--approved',
  Waitlisted: 'table-status--waitlisted',
  Rejected: 'table-status--rejected',
  Withdrawn: 'table-status--withdrawn',
};

const STATUS_OPTIONS = Object.keys(STATUS_COLORS);

export default function StatusDropdown({ value, onChange, onOpenChange }) {
  const colorClass = STATUS_COLORS[value] || '';

  return (
    <SelectDropdown
      value={value}
      options={STATUS_OPTIONS}
      onChange={onChange}
      ariaLabel={`${value} status`}
      className='status-dropdown'
      triggerClassName={`table-status table-status-pill ${colorClass}`}
      onOpenChange={onOpenChange}
      usePortal
    />
  );
}
