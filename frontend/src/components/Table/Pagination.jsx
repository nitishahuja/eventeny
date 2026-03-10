import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  page,
  totalPages,
  isMobile,
  onPageChange,
}) {
  return (
    <nav className='table-pagination' aria-label='Table pagination'>
      <button
        type='button'
        className='table-pagination-btn'
        onClick={() => onPageChange(Math.max(1, page - 1))}
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
                onClick={() => onPageChange(p)}
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
              const startPage = Math.min(Math.max(1, page - 1), totalPages - 2);
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
              onClick={() => onPageChange(p)}
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
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label='Next page'
      >
        <ChevronRight size={18} strokeWidth={2} aria-hidden />
      </button>
    </nav>
  );
}

