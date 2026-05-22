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

        {loading && <div className="modal-loading">Loading...</div>}

        {!loading && (
          <>
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
                    <span className="placeholder-icon" />
                  </div>
                )}
              </div>
              <div className="modal-title-section">
                <h2>{displayDetails.title}</h2>
                <p className="modal-author">{displayDetails.author}</p>
              </div>
            </div>

            <div className="modal-body">
              {displayDetails.description && (
                <div className="modal-section">
                  <h3>Description</h3>
                  <p>{displayDetails.description}</p>
                </div>
              )}

              {displayDetails.subjects && displayDetails.subjects.length > 0 && (
                <div className="modal-section">
                  <h3>Subjects</h3>
                  <div className="subjects-list">
                    {displayDetails.subjects.map((subject, idx) => (
                      <span key={idx} className="subject-badge">{subject}</span>
                    ))}
                  </div>
                </div>
              )}

              {displayDetails.firstPublishYear && (
                <p className="modal-info">
                  <strong>First Published:</strong> {displayDetails.firstPublishYear}
                </p>
              )}

              {displayDetails.editions && (
                <p className="modal-info">
                  <strong>Editions:</strong> {displayDetails.editions}
                </p>
              )}

              {error && <p className="error-text">{error}</p>}
            </div>

            <div className="modal-footer">
              {book.id && (
                <button 
                  className="similar-btn"
                  onClick={handleFindSimilar}
                  disabled={findingSimilar}
                >
                  {findingSimilar ? 'Finding Similar Books...' : 'Find Similar Books 🔍'}
                </button>
              )}
              <button className="close-btn" onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
