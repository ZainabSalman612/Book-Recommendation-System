import BookCard from './BookCard'
import '../styles/SimilarBooksModal.css'

export default function SimilarBooksModal({ books, baseSubject, onClose, onSelectBook }) {
  const handleBookSelect = (book) => {
    onSelectBook(book)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content similar-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>

        <div className="modal-header">
          <h2>Similar Books</h2>
          {baseSubject && <p className="base-subject">Based on: <strong>{baseSubject}</strong></p>}
        </div>

        <div className="similar-books-grid">
          {books.length > 0 ? (
            books.map((book) => (
              <BookCard 
                key={book.id || book.title} 
                book={book} 
                onSelect={handleBookSelect}
              />
            ))
          ) : (
            <p className="no-results">No similar books found</p>
          )}
        </div>

        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
