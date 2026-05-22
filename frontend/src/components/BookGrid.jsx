import BookCard from './BookCard'
import '../styles/BookGrid.css'

export default function BookGrid({ books, onSelectBook }) {
  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard 
          key={book.id || book.title} 
          book={book} 
          onSelect={onSelectBook}
        />
      ))}
    </div>
  )
}
