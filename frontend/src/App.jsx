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
        <div className="header-background"></div>
        <div className="header-content">
          <div className="header-brand">
            <span className="header-logo" aria-hidden="true">📚</span>
            <div className="header-title-section">
              <h1>Book Finder</h1>
              <p className="header-tagline">Discover your next great read</p>
            </div>
          </div>
          <button
            type="button"
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={darkMode}
          >
            <span className="toggle-icon" aria-hidden="true">{darkMode ? '☀️' : '🌙'}</span>
            <span className="toggle-label">{darkMode ? 'Light' : 'Dark'}</span>
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
            <div className="empty-state-icon" aria-hidden="true">🔍</div>
            <h2 className="empty-state-title">Start exploring</h2>
            <p className="empty-state-text">Search by title, author, or subject to find your next read.</p>
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
