import { useState, useMemo, memo } from 'react';
import {
  ArrowUpDown,
  Ellipsis,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';
import SelectDropdown from '../common/SelectDropdown/SelectDropdown';
import './Table.css';

const ROWS_PER_PAGE = 5;
const STATUS_COLORS = {
  'Awaiting decision': 'table-status--awaiting',
  Approved: 'table-status--approved',
  Waitlisted: 'table-status--waitlisted',
  Rejected: 'table-status--rejected',
  Withdrawn: 'table-status--withdrawn',
};

const STATUS_OPTIONS = Object.keys(STATUS_COLORS);

function StatusDropdown({ value }) {
  const colorClass = STATUS_COLORS[value] || '';
  return (
    <SelectDropdown
      value={value}
      options={STATUS_OPTIONS}
      onChange={() => {}}
      placeholder='Change status'
      ariaLabel={`${value} status`}
      className='status-dropdown'
      triggerClassName={`table-status table-status-pill ${colorClass}`}
      disabled
    />
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function Table({
  rows = [],
  loading = false,
  onViewApplicant,
  onBulkStatusChange,
}) {
  const [sortDir, setSortDir] = useState('asc');
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const isMobile = useIsMobile();
  const [bulkStatus, setBulkStatus] = useState('Approved');

  const sortedRows = useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      const aVal = a.businessName ?? '';
      const bVal = b.businessName ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, {
        sensitivity: 'base',
      });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [rows, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / ROWS_PER_PAGE));
  const pageRows = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return sortedRows.slice(start, start + ROWS_PER_PAGE);
  }, [sortedRows, page]);

  const handleSort = () => {
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    setPage(1);
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      const next = new Set(
        pageRows.map((_, i) => (page - 1) * ROWS_PER_PAGE + i),
      );
      setSelected(next);
      if (next.size > 0) {
        const firstIdx = Math.min(...next);
        const firstRow = sortedRows[firstIdx];
        if (firstRow?.currentStatus) {
          setBulkStatus(firstRow.currentStatus);
        }
      }
    } else {
      setSelected(new Set());
    }
  };

  const toggleSelectRow = (idx) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);

      if (next.size > 0 && prev.size === 0) {
        const firstIdx = Math.min(...next);
        const firstRow = sortedRows[firstIdx];
        if (firstRow?.currentStatus) {
          setBulkStatus(firstRow.currentStatus);
        }
      }

      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const allOnPageSelected =
    pageRows.length > 0 &&
    pageRows.every((_, i) => selected.has((page - 1) * ROWS_PER_PAGE + i));
  const someSelected = selected.size > 0;

  const handleBulkChangeStatus = () => {
    if (!someSelected || !onBulkStatusChange) return;

    const businessNames = [];
    selected.forEach((idx) => {
      const row = sortedRows[idx];
      if (row?.businessName) {
        businessNames.push(row.businessName);
      }
    });

    if (!businessNames.length) return;

    onBulkStatusChange(businessNames, bulkStatus);
  };

  if (loading) {
    return (
      <div
        className='table-wrapper'
        role='region'
        aria-label='Applications table'
      >
        <div className='table-loading' role='status' aria-live='polite'>
          <div className='table-loading-spinner' aria-hidden />
          <p>Loading applications…</p>
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div
        className='table-wrapper'
        role='region'
        aria-label='Applications table'
      >
        <div className='table-empty' role='status' aria-live='polite'>
          <p>No applications found.</p>
          <p className='table-empty-hint'>
            Try adjusting your search or filters.
          </p>
        </div>
      </div>
    );
  }

  const start = (page - 1) * ROWS_PER_PAGE + 1;
  const end = Math.min(page * ROWS_PER_PAGE, sortedRows.length);

  return (
    <div
      className='table-wrapper'
      role='region'
      aria-label='Applications table'
    >
      <span className='sr-only' aria-live='polite'>
        Showing {start} to {end} of {sortedRows.length} applications
      </span>
      {someSelected && (
        <div
          className='table-bulk-bar'
          role='toolbar'
          aria-label='Bulk actions'
        >
          <span className='table-bulk-count'>
            {selected.size} {selected.size === 1 ? 'row' : 'rows'} selected
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
                onChange={setBulkStatus}
                placeholder='Change status'
                ariaLabel='Bulk status'
              />
              <button
                type='button'
                className='table-bulk-primary'
                onClick={handleBulkChangeStatus}
              >
                Apply
              </button>
            </div>
            <button
              type='button'
              className='table-bulk-clear'
              onClick={clearSelection}
              aria-label='Clear selection'
            >
              Clear selection
            </button>
          </div>
        </div>
      )}
      {/* Desktop: table layout */}
      <div className='table-desktop table-scroll'>
        <table className='table' role='table' aria-label='Applications'>
          <thead>
            <tr>
              <th scope='col' className='table-cell table-cell--check'>
                <label className='table-check-label'>
                  <input
                    type='checkbox'
                    checked={allOnPageSelected}
                    onChange={toggleSelectAll}
                    aria-label='Select all rows on this page'
                    className='table-checkbox'
                  />
                </label>
              </th>
              <th scope='col' className='table-cell table-cell--sortable'>
                <button
                  type='button'
                  className='table-sort-btn'
                  onClick={handleSort}
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
              const globalIdx = (page - 1) * ROWS_PER_PAGE + i;
              const isSelected = selected.has(globalIdx);
              return (
                <tr
                  key={`${row.businessName}-${row.date}-${i}`}
                  className={isSelected ? 'table-row--selected' : ''}
                >
                  <td className='table-cell table-cell--check'>
                    <label className='table-check-label'>
                      <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={() => toggleSelectRow(globalIdx)}
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
                    <StatusDropdown value={row.currentStatus} />
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

      {/* Mobile: stacked card layout */}
      <div className='table-cards'>
        <div className='table-cards-header'>
          <label className='table-check-label'>
            <input
              type='checkbox'
              checked={allOnPageSelected}
              onChange={toggleSelectAll}
              aria-label='Select all rows on this page'
              className='table-checkbox'
            />
          </label>
          <button
            type='button'
            className='table-sort-btn'
            onClick={handleSort}
            aria-sort={sortDir === 'asc' ? 'ascending' : 'descending'}
            aria-label={`Sort by Business name ${sortDir === 'asc' ? 'ascending' : 'descending'}`}
          >
            Business name
            <ArrowUpDown size={16} strokeWidth={2} aria-hidden />
          </button>
        </div>
        <div className='table-cards-list' role='list' aria-label='Applications'>
          {pageRows.map((row, i) => {
            const globalIdx = (page - 1) * ROWS_PER_PAGE + i;
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
                      onChange={() => toggleSelectRow(globalIdx)}
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
                      <span className='table-business-applicant'>
                        Applicant
                      </span>
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

      <nav className='table-pagination' aria-label='Table pagination'>
        <button
          type='button'
          className='table-pagination-btn'
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          aria-label='Previous page'
        >
          <ChevronLeft size={18} strokeWidth={2} aria-hidden />
        </button>
        <div
          className='table-pagination-pages'
          role='group'
          aria-label='Page numbers'
        >
          {(() => {
            if (totalPages <= 1) {
              const p = 1;
              return (
                <button
                  key={p}
                  type='button'
                  className={`table-pagination-page ${page === p ? 'table-pagination-page--active' : ''}`}
                  onClick={() => setPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={page === p ? 'page' : undefined}
                >
                  {p}
                </button>
              );
            }

            const pagesToRender = [];

            if (isMobile) {
              if (totalPages === 2) {
                pagesToRender.push(1, 2);
              } else {
                const startPage = Math.min(
                  Math.max(1, page - 1),
                  totalPages - 2,
                );
                pagesToRender.push(startPage, startPage + 1, startPage + 2);
              }
            } else {
              const windowSize = Math.min(9, totalPages);
              const halfWindow = Math.floor(windowSize / 2);
              let startPage = Math.max(1, page - halfWindow);
              let endPage = startPage + windowSize - 1;
              if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - windowSize + 1);
              }
              for (let p = startPage; p <= endPage; p += 1) {
                pagesToRender.push(p);
              }
            }

            return pagesToRender.map((p) => (
              <button
                key={p}
                type='button'
                className={`table-pagination-page ${page === p ? 'table-pagination-page--active' : ''}`}
                onClick={() => setPage(p)}
                aria-label={`Page ${p}`}
                aria-current={page === p ? 'page' : undefined}
              >
                {p}
              </button>
            ));
          })()}
        </div>
        <button
          type='button'
          className='table-pagination-btn'
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          aria-label='Next page'
        >
          <ChevronRight size={18} strokeWidth={2} aria-hidden />
        </button>
      </nav>
    </div>
  );
}

export default memo(Table);
