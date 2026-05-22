import '../styles/BookCard.css'

export default function BookCard({ book, onSelect }) {
  const handleClick = () => {
    onSelect(book)
  }

  return (
    <div className="book-card" onClick={handleClick} role="button" tabIndex={0}>
      <div className="book-cover">
        {book.coverImage ? (
          <img 
            src={book.coverImage} 
            alt={`${book.title} cover`}
            loading="lazy"
            onError={(e) => {
              // Handle missing cover images gracefully (edge case)
              e.target.style.display = 'none'
              e.target.nextElementSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div className="cover-placeholder" style={book.coverImage ? { display: 'none' } : {}}>
          📖
        </div>
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
