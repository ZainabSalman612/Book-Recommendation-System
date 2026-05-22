import { useState, useEffect, useRef } from 'react'
import { getBookCoverUrl } from '../utils/coverImage'
import '../styles/BookCard.css'

export default function BookCard({ book, onSelect }) {
  const coverUrl = getBookCoverUrl(book)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    setImageLoaded(false)
    setImageFailed(false)
  }, [coverUrl])

  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) {
      setImageLoaded(true)
    }
  }, [coverUrl])

  const handleClick = () => onSelect(book)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(book)
    }
  }

  const showImage = Boolean(coverUrl) && !imageFailed
  const showPlaceholder = !coverUrl || imageFailed || !imageLoaded

  return (
    <article
      className="book-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="book-cover">
        {showImage && (
          <img
            ref={imgRef}
            src={coverUrl}
            alt={`${book.title} cover`}
            loading="lazy"
            decoding="async"
            className={`cover-image ${imageLoaded ? 'loaded' : 'loading'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageFailed(true)}
          />
        )}
        {showPlaceholder && (
          <div
            className={`cover-placeholder ${coverUrl && !imageFailed ? 'cover-placeholder--loading' : ''}`}
            aria-hidden="true"
          >
            <svg className="placeholder-svg-book" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '2rem', height: '2rem', color: 'var(--cover-placeholder-icon)' }}>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            {coverUrl && !imageFailed && !imageLoaded && (
              <span className="placeholder-skeleton" />
            )}
          </div>
        )}
      </div>

      <div className="book-info">
        <h3 className="book-title" title={book.title}>{book.title}</h3>
        <p className="book-author">{book.author}</p>

        {book.firstPublishYear && (
          <p className="book-year">{book.firstPublishYear}</p>
        )}

        {book.subjects?.length > 0 && (
          <div className="book-subjects">
            {book.subjects.slice(0, 2).map((subject, idx) => (
              <span key={idx} className="subject-tag">{subject}</span>
            ))}
          </div>
        )}

        {book.editionCount > 0 && (
          <p className="book-editions">
            {book.editionCount} edition{book.editionCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </article>
  )
}
