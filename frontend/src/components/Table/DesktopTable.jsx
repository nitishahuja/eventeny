import { ArrowUpDown, Ellipsis } from 'lucide-react';
import StatusDropdown from './StatusDropdown';
import { formatDate } from './tableUtils';

export default function DesktopTable({
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
  onRowStatusChange,
  openStatusRowKey,
  onOpenStatusRowChange,
}) {
  return (
    <div className='table-desktop table-scroll'>
      <table className='table' role='table' aria-label='Applications'>
        <thead>
          <tr>
            <th scope='col' className='table-cell table-cell--check'>
              <label className='table-check-label'>
                <input
                  type='checkbox'
                  checked={allOnPageSelected}
                  onChange={onToggleSelectAll}
                  aria-label='Select all rows on this page'
                  className='table-checkbox'
                />
              </label>
            </th>
            <th scope='col' className='table-cell table-cell--sortable'>
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
            </th>
            <th scope='col' className='table-cell'>
              Tag
            </th>
            <th scope='col' className='table-cell'>
              Application
            </th>
            <th scope='col' className='table-cell'>
              Payment
            </th>
            <th scope='col' className='table-cell'>
              Status
            </th>
            <th scope='col' className='table-cell'>
              Date
            </th>
            <th scope='col' className='table-cell table-cell--action'>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((row, i) => {
            const globalIdx = (page - 1) * rowsPerPage + i;
            const isSelected = selected.has(globalIdx);
            const isOpen = openStatusRowKey === row.businessName;
            return (
              <tr
                key={`${row.businessName}-${row.date}-${i}`}
                className={`${isSelected ? 'table-row--selected' : ''} ${
                  isOpen ? 'table-row--open' : ''
                }`}
              >
                <td className='table-cell table-cell--check'>
                  <label className='table-check-label'>
                    <input
                      type='checkbox'
                      checked={isSelected}
                      onChange={() => onToggleSelectRow(globalIdx)}
                      aria-label={`Select ${row.businessName}`}
                      className='table-checkbox'
                    />
                  </label>
                </td>
                <td className='table-cell table-cell--business'>
                  <div className='table-business'>
                    <img
                      src='/business-logo-placeholder.png'
                      alt=''
                      className='table-business-avatar'
                      width={32}
                      height={32}
                    />
                    <div className='table-business-text'>
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
                      <span className='table-business-applicant'>
                        Applicant Name
                      </span>
                    </div>
                  </div>
                </td>
                <td className='table-cell'>
                  <div className='table-tags'>
                    {row.tag.slice(0, 3).map((t) => (
                      <span key={t} className='table-tag'>
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className='table-cell table-cell--application'>
                  <span className='table-link table-link--application'>
                    {row.application}
                  </span>
                </td>
                <td className='table-cell'>
                  {row.payment === 'paid' ? 'Paid' : 'Not Paid'}
                </td>
                <td className='table-cell table-cell--status'>
                  <StatusDropdown
                    value={row.currentStatus}
                    onChange={(next) =>
                      onRowStatusChange?.(row.businessName, next)
                    }
                    onOpenChange={(open) =>
                      onOpenStatusRowChange?.(open ? row.businessName : null)
                    }
                  />
                </td>
                <td className='table-cell'>{formatDate(row.date)}</td>
                <td className='table-cell table-cell--action'>
                  <button
                    type='button'
                    className='table-action-btn'
                    aria-label={`Actions for ${row.businessName}`}
                    aria-haspopup='true'
                  >
                    <Ellipsis size={18} strokeWidth={2} aria-hidden />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

