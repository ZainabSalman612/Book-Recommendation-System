import { useState, useEffect } from 'react'
import { getBookDetails, findSimilarBooks } from '../services/bookApi'
import { getBookCoverUrl } from '../utils/coverImage'
import '../styles/BookDetailsModal.css'

export default function BookDetailsModal({ book, onClose, onFindSimilar }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [findingSimilar, setFindingSimilar] = useState(false)

  useEffect(() => {
    const loadDetails = async () => {
      try {
        if (book.id) {
          const data = await getBookDetails(book.id)
          setDetails(data)
        } else {
          setDetails(book)
        }
      } catch (err) {
        setError('Failed to load book details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadDetails()
  }, [book])

  const handleFindSimilar = async () => {
    if (!book.id) return

    setFindingSimilar(true)
    try {
      const similarBooks = await findSimilarBooks(book.id)
      onFindSimilar(similarBooks)
    } catch (err) {
      setError('Failed to find similar books: ' + err.message)
    } finally {
      setFindingSimilar(false)
    }
  }

  const displayDetails = details || book
  const coverUrl = getBookCoverUrl(displayDetails)
  const [coverFailed, setCoverFailed] = useState(false)

  useEffect(() => {
    setCoverFailed(false)
  }, [coverUrl])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>

        <div className="modal-header">
          <div className="modal-cover-wrap">
            {coverUrl && !coverFailed ? (
              <img
                src={coverUrl}
                alt={`${displayDetails.title} cover`}
                className="modal-cover"
                onError={() => setCoverFailed(true)}
              />
            ) : (
              <div className="modal-cover-placeholder" aria-hidden="true">
                <svg className="placeholder-svg-book" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.5rem', height: '1.5rem', color: 'var(--cover-placeholder-icon)' }}>
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="modal-title-section">
            <h2>{displayDetails.title}</h2>
            {(displayDetails.author || displayDetails.authors?.[0]) && (
              <p className="modal-author">by {displayDetails.author || displayDetails.authors?.[0]}</p>
            )}

            <div className="modal-metadata-grid">
              {displayDetails.firstPublishYear && (
                <div className="modal-info">
                  <strong>First Published:</strong> <span>{displayDetails.firstPublishYear}</span>
                </div>
              )}

              {(displayDetails.editionCount > 0 || displayDetails.editions > 0) && (
                <div className="modal-info">
                  <strong>Editions:</strong> <span>{displayDetails.editionCount || displayDetails.editions}</span>
                </div>
              )}
            </div>

            {displayDetails.subjects && displayDetails.subjects.length > 0 && (
              <div className="modal-subjects-wrap">
                <div className="subjects-list">
                  {displayDetails.subjects.slice(0, 4).map((subject, idx) => (
                    <span key={idx} className="subject-badge">{subject}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-body">
          {/* Synopsis Section */}
          <div className="modal-section">
            <h3>Synopsis</h3>
            {loading ? (
              <div className="description-skeleton">
                <div className="skeleton-line" style={{ width: '100%' }}></div>
                <div className="skeleton-line" style={{ width: '92%' }}></div>
                <div className="skeleton-line" style={{ width: '78%' }}></div>
              </div>
            ) : error ? (
              <p className="no-description error-desc">Failed to load synopsis from database. Please check connection.</p>
            ) : displayDetails.description ? (
              <p>{displayDetails.description}</p>
            ) : (
              <p className="no-description">No synopsis available for this work.</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          {book.id && (
            <button 
              className="similar-btn"
              onClick={handleFindSimilar}
              disabled={findingSimilar || loading}
            >
              {findingSimilar ? 'Finding Similar Books...' : 'Find Similar Books'}
            </button>
          )}
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
