import SelectDropdown from '../common/SelectDropdown/SelectDropdown';

export default function BulkActionsBar({
  selectedCount,
  bulkStatus,
  onBulkStatusChange,
  onApply,
  onClear,
}) {
  return (
    <div className='table-bulk-bar' role='toolbar' aria-label='Bulk actions'>
      <span className='table-bulk-count'>
        {selectedCount} {selectedCount === 1 ? 'row' : 'rows'} selected
      </span>
      <div className='table-bulk-actions'>
        <div className='table-bulk-status'>
          <SelectDropdown
            value={bulkStatus}
            options={[
              'Approved',
              'Waitlisted',
              'Withdrawn',
              'Awaiting decision',
              'Rejected',
            ]}
            onChange={onBulkStatusChange}
            placeholder='Change status'
            ariaLabel='Bulk status'
          />
          <button
            type='button'
            className='table-bulk-primary'
            onClick={onApply}
          >
            Apply
          </button>
        </div>
        <button
          type='button'
          className='table-bulk-clear'
          onClick={onClear}
          aria-label='Clear selection'
        >
          Clear selection
        </button>
      </div>
    </div>
  );
}
