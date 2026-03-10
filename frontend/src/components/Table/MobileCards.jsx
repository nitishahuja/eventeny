import { ArrowUpDown, Ellipsis } from 'lucide-react';
import { formatDate } from './tableUtils';

const STATUS_COLORS = {
  'Awaiting decision': 'table-status--awaiting',
  Approved: 'table-status--approved',
  Waitlisted: 'table-status--waitlisted',
  Rejected: 'table-status--rejected',
  Withdrawn: 'table-status--withdrawn',
};

export default function MobileCards({
  pageRows,
  page,
  rowsPerPage,
  selected,
  allOnPageSelected,
  sortDir,
  onSort,
  onToggleSelectAll,
  onToggleSelectRow,
  onViewApplicant,
}) {
  return (
    <div className='table-cards'>
      <div className='table-cards-header'>
        <label className='table-check-label'>
          <input
            type='checkbox'
            checked={allOnPageSelected}
            onChange={onToggleSelectAll}
            aria-label='Select all rows on this page'
            className='table-checkbox'
          />
        </label>
        <button
          type='button'
          className='table-sort-btn'
          onClick={onSort}
          aria-sort={sortDir === 'asc' ? 'ascending' : 'descending'}
          aria-label={`Sort by Business name ${sortDir === 'asc' ? 'ascending' : 'descending'}`}
        >
          Business name
          <ArrowUpDown size={16} strokeWidth={2} aria-hidden />
        </button>
      </div>
      <div className='table-cards-list' role='list' aria-label='Applications'>
        {pageRows.map((row, i) => {
          const globalIdx = (page - 1) * rowsPerPage + i;
          const isSelected = selected.has(globalIdx);
          return (
            <article
              key={`${row.businessName}-${row.date}-${i}`}
              className={`table-card ${isSelected ? 'table-row--selected' : ''}`}
              role='listitem'
            >
              <div className='table-card-row table-card-row--main'>
                <label className='table-check-label'>
                  <input
                    type='checkbox'
                    checked={isSelected}
                    onChange={() => onToggleSelectRow(globalIdx)}
                    aria-label={`Select ${row.businessName}`}
                    className='table-checkbox'
                  />
                </label>
                <div className='table-business'>
                  <img
                    src='/business-logo-placeholder.png'
                    alt=''
                    className='table-business-avatar'
                    width={32}
                    height={32}
                  />
                  <div>
                    <span
                      className='table-business-name'
                      onClick={() => onViewApplicant?.(row)}
                      role='button'
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onViewApplicant?.(row);
                        }
                      }}
                    >
                      {row.businessName}
                    </span>
                    <span className='table-business-applicant'>Applicant</span>
                  </div>
                </div>
                <button
                  type='button'
                  className='table-action-btn'
                  aria-label={`Actions for ${row.businessName}`}
                  aria-haspopup='true'
                >
                  <Ellipsis size={18} strokeWidth={2} aria-hidden />
                </button>
              </div>
              <div className='table-card-fields'>
                <div className='table-card-field'>
                  <div className='table-tags'>
                    {row.tag.slice(0, 2).map((t) => (
                      <span key={t} className='table-tag'>
                        {t}
                      </span>
                    ))}
                    {row.tag.length > 2 && (
                      <span className='table-tag'>+{row.tag.length - 2}</span>
                    )}
                  </div>
                </div>
                <div className='table-card-field'>
                  <span className='table-link'>{row.application}</span>
                  <span aria-hidden>•</span>
                  <span
                    className={`table-status ${STATUS_COLORS[row.currentStatus] || ''}`}
                    aria-label={`${row.currentStatus} status`}
                  >
                    {row.currentStatus}
                  </span>
                  <span aria-hidden>•</span>
                  <span>{formatDate(row.date)}</span>
                  {row.payment === 'paid' && (
                    <>
                      <span aria-hidden>•</span>
                      <span>Paid</span>
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

