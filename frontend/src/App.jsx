import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import BookGrid from './components/BookGrid'
import BookDetailsModal from './components/BookDetailsModal'
import SimilarBooksModal from './components/SimilarBooksModal'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import { searchBooks } from './services/bookApi'
import './styles/App.css'

function App() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [similarBooksData, setSimilarBooksData] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])

  // Initialize recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  const handleSearch = async (searchTerm, searchType) => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term')
      return
    }

    setLoading(true)
    setError(null)
    setBooks([])
    setSelectedBook(null)
    setSimilarBooksData(null)

    try {
      const result = await searchBooks(searchTerm, searchType)

      if (result.error) {
        setError(result.error)
        setBooks([])
      } else if (result.books.length === 0) {
        setError(`No books found for "${searchTerm}". Try different keywords.`)
        setBooks([])
      } else {
        setBooks(result.books)
        // Add to recent searches
        const newSearch = `${searchTerm} (${searchType})`
        const updated = [newSearch, ...recentSearches.filter(s => s !== newSearch)].slice(0, 5)
        setRecentSearches(updated)
        localStorage.setItem('recentSearches', JSON.stringify(updated))
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectBook = (book) => {
    setSelectedBook(book)
    setSimilarBooksData(null)
  }

  const handleFindSimilar = (similarData) => {
    setSimilarBooksData(similarData)
  }

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <header className="header">
        <div className="header-content">
          <h1>📚 Book Finder</h1>
          <p>Discover your next great read</p>
          <button 
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="container">
        <SearchBar 
          onSearch={handleSearch} 
          recentSearches={recentSearches}
        />

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        {loading && <LoadingSpinner />}

        {!loading && books.length > 0 && (
          <>
            <div className="results-header">
              <h2>Found {books.length} book{books.length !== 1 ? 's' : ''}</h2>
            </div>
            <BookGrid books={books} onSelectBook={handleSelectBook} />
          </>
        )}

        {!loading && books.length === 0 && !error && (
          <div className="empty-state">
            <p>🔍 Search for books by title, author, or subject to get started</p>
          </div>
        )}
      </main>

      {selectedBook && (
        <BookDetailsModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)}
          onFindSimilar={handleFindSimilar}
        />
      )}

      {similarBooksData && (
        <SimilarBooksModal
          books={similarBooksData.books}
          baseSubject={similarBooksData.baseSubject}
          onClose={() => setSimilarBooksData(null)}
          onSelectBook={handleSelectBook}
        />
      )}
    </div>
  )
}

export default App
