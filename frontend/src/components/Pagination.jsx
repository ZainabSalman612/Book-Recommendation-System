import { getPageNumbers } from '../utils/pagination'
import '../styles/Pagination.css'

export default function Pagination({
  currentPage,
  totalPages,
  totalResults,
  pageSize,
  loading,
  onPageChange
}) {
  if (totalResults === 0) return null

  const pageNumbers = getPageNumbers(currentPage, totalPages)
  const rangeStart = (currentPage - 1) * pageSize + 1
  const rangeEnd = Math.min(currentPage * pageSize, totalResults)

  return (
    <nav className="pagination" aria-label="Search results pages">
      <p className="pagination-status">
        Page <strong>{currentPage}</strong> of <strong>{totalPages.toLocaleString()}</strong>
        <span className="pagination-range">
          showing {rangeStart.toLocaleString()}–{rangeEnd.toLocaleString()} of{' '}
          {totalResults.toLocaleString()}
        </span>
      </p>

      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn pagination-prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
          aria-label="Previous page"
        >
          Previous
        </button>

        <ul className="pagination-pages" role="list">
          {pageNumbers.map((item, idx) =>
            item === 'ellipsis' ? (
              <li key={`ellipsis-${idx}`} className="pagination-ellipsis" aria-hidden="true">
                …
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  className={`pagination-page${item === currentPage ? ' active' : ''}`}
                  onClick={() => onPageChange(item)}
                  disabled={loading || item === currentPage}
                  aria-label={`Page ${item}`}
                  aria-current={item === currentPage ? 'page' : undefined}
                >
                  {item}
                </button>
              </li>
            )
          )}
        </ul>

        <button
          type="button"
          className="pagination-btn pagination-next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || loading}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </nav>
  )
}
