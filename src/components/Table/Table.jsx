import { useState, useMemo } from 'react';
import {
  ChevronsUpDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import './Table.css';

const ROWS_PER_PAGE = 5;
const STATUS_COLORS = {
  'Awaiting decision': 'table-status--awaiting',
  Approved: 'table-status--approved',
  Waitlisted: 'table-status--waitlisted',
  Rejected: 'table-status--rejected',
  Withdrawn: 'table-status--withdrawn',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function Table({ rows = [], loading = false, onViewApplicant }) {
  const [sortDir, setSortDir] = useState('asc');
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);

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
      setSelected(
        new Set(pageRows.map((_, i) => (page - 1) * ROWS_PER_PAGE + i)),
      );
    } else {
      setSelected(new Set());
    }
  };

  const toggleSelectRow = (idx) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const allOnPageSelected =
    pageRows.length > 0 &&
    pageRows.every((_, i) => selected.has((page - 1) * ROWS_PER_PAGE + i));

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
        <div className='table-empty' role='status'>
          <p>No applications found.</p>
          <p className='table-empty-hint'>
            Try adjusting your search or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className='table-wrapper'
      role='region'
      aria-label='Applications table'
    >
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
                  <ChevronsUpDown size={16} strokeWidth={2} aria-hidden />
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
                <span className='sr-only'>Action</span>
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
                  <td className='table-cell'>
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
                  <td className='table-cell'>
                    <span className='table-link'>{row.application}</span>
                  </td>
                  <td className='table-cell'>
                    {row.payment === 'paid' ? 'Paid' : 'Not Paid'}
                  </td>
                  <td className='table-cell'>
                    <span
                      className={`table-status ${STATUS_COLORS[row.currentStatus] || ''}`}
                    >
                      {row.currentStatus}
                    </span>
                  </td>
                  <td className='table-cell'>{formatDate(row.date)}</td>
                  <td className='table-cell table-cell--action'>
                    <button
                      type='button'
                      className='table-action-btn'
                      aria-label={`Actions for ${row.businessName}`}
                      aria-haspopup='true'
                    >
                      <MoreVertical size={18} strokeWidth={2} aria-hidden />
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
            <ChevronsUpDown size={16} strokeWidth={2} aria-hidden />
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
                    <MoreVertical size={18} strokeWidth={2} aria-hidden />
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
                    <span className={`table-status ${STATUS_COLORS[row.currentStatus] || ''}`}>
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
            {Array.from({ length: Math.min(9, totalPages) }, (_, i) => {
              let p;
              if (totalPages <= 9) p = i + 1;
              else if (page <= 5) p = i + 1;
              else if (page >= totalPages - 4) p = totalPages - 8 + i;
              else p = page - 4 + i;
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
            })}
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

export default Table;
