import { useState, useMemo, memo } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import BulkActionsBar from './BulkActionsBar';
import DesktopTable from './DesktopTable';
import MobileCards from './MobileCards';
import Pagination from './Pagination';
import './Table.css';

const ROWS_PER_PAGE = 5;

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
  const [openStatusRowKey, setOpenStatusRowKey] = useState(null);

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

  const handleRowStatusChange = async (businessName, nextStatus) => {
    if (!businessName || !nextStatus || !onBulkStatusChange) return;
    await onBulkStatusChange([businessName], nextStatus);
  };

  if (loading) {
    return (
      <div
        className='table-wrapper'
        role='region'
        aria-label='Applications table'
      >
        <div className='table-frame'>
          <div className='table-loading' role='status' aria-live='polite'>
            <div className='table-loading-spinner' aria-hidden />
            <p>Loading applications…</p>
          </div>
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
        <div className='table-frame'>
          <div className='table-empty' role='status' aria-live='polite'>
            <p>No applications found.</p>
            <p className='table-empty-hint'>
              Try adjusting your search or filters.
            </p>
          </div>
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
      <div className='table-frame'>
        <span className='sr-only' aria-live='polite'>
          Showing {start} to {end} of {sortedRows.length} applications
        </span>

        {someSelected && (
          <BulkActionsBar
            selectedCount={selected.size}
            bulkStatus={bulkStatus}
            onBulkStatusChange={setBulkStatus}
            onApply={handleBulkChangeStatus}
            onClear={clearSelection}
          />
        )}

        <DesktopTable
          pageRows={pageRows}
          page={page}
          rowsPerPage={ROWS_PER_PAGE}
          selected={selected}
          allOnPageSelected={allOnPageSelected}
          sortDir={sortDir}
          onSort={handleSort}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectRow={toggleSelectRow}
          onViewApplicant={onViewApplicant}
          onRowStatusChange={handleRowStatusChange}
          openStatusRowKey={openStatusRowKey}
          onOpenStatusRowChange={setOpenStatusRowKey}
        />

        <MobileCards
          pageRows={pageRows}
          page={page}
          rowsPerPage={ROWS_PER_PAGE}
          selected={selected}
          allOnPageSelected={allOnPageSelected}
          sortDir={sortDir}
          onSort={handleSort}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectRow={toggleSelectRow}
          onViewApplicant={onViewApplicant}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          isMobile={isMobile}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default memo(Table);
