import { useState } from 'react'
import '../styles/BookCard.css'

export default function BookCard({ book, onSelect }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  const handleClick = () => {
    onSelect(book)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageFailed(true)
  }

  return (
    <div className="book-card" onClick={handleClick} role="button" tabIndex={0}>
      <div className="book-cover">
        {book.coverImage && !imageFailed ? (
          <img 
            src={book.coverImage} 
            alt={`${book.title} cover`}
            loading="lazy"
            className={`cover-image ${imageLoaded ? 'loaded' : 'loading'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : null}
        {(!book.coverImage || imageFailed || !imageLoaded) && (
          <div className="cover-placeholder">
            <span className="placeholder-text">📖</span>
            {!imageLoaded && book.coverImage && <span className="placeholder-loading">Loading...</span>}
          </div>
        )}
      </div>

      <div className="book-info">
        <h3 className="book-title" title={book.title}>{book.title}</h3>
        <p className="book-author">{book.author}</p>
        
        {book.firstPublishYear && (
          <p className="book-year">Published: {book.firstPublishYear}</p>
        )}

        {book.subjects && book.subjects.length > 0 && (
          <div className="book-subjects">
            {book.subjects.slice(0, 2).map((subject, idx) => (
              <span key={idx} className="subject-tag">{subject}</span>
            ))}
          </div>
        )}

        {book.editionCount > 0 && (
          <p className="book-editions">{book.editionCount} edition{book.editionCount !== 1 ? 's' : ''}</p>
        )}
      </div>
    </div>
  )
}
