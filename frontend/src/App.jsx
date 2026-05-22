import { useState, useEffect, useRef } from 'react'
import SearchBar from './components/SearchBar'
import BookGrid from './components/BookGrid'
import BookDetailsModal from './components/BookDetailsModal'
import SimilarBooksModal from './components/SimilarBooksModal'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import { searchBooks, PAGE_SIZE } from './services/bookApi'
import { getTotalPages } from './utils/pagination'
import Pagination from './components/Pagination'
import './styles/App.css'

function App() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('title')
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBook, setSelectedBook] = useState(null)
  const [similarBooksData, setSimilarBooksData] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const resultsRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  const totalPages = getTotalPages(totalResults, PAGE_SIZE)

  const fetchPage = async (page, searchTerm, type, { saveRecent = false } = {}) => {
    const offset = (page - 1) * PAGE_SIZE
    const result = await searchBooks(searchTerm, type, { offset, limit: PAGE_SIZE })

    if (result.error) {
      setError(result.error)
      return false
    }

    if (result.books.length === 0 && page === 1) {
      setError(`No books found for "${searchTerm}". Try different keywords.`)
      setBooks([])
      setTotalResults(0)
      setCurrentPage(1)
      return false
    }

    setBooks(result.books)
    setTotalResults(result.total)
    setCurrentPage(page)
    setSearchQuery(searchTerm)
    setSearchType(type)
    setError(null)

    if (saveRecent) {
      const newSearch = `${searchTerm} (${type})`
      const updated = [newSearch, ...recentSearches.filter(s => s !== newSearch)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
    }

    return true
  }

  const handleSearch = async (searchTerm, type) => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term')
      return
    }

    setLoading(true)
    setError(null)
    setBooks([])
    setTotalResults(0)
    setCurrentPage(1)
    setSelectedBook(null)
    setSimilarBooksData(null)

    try {
      await fetchPage(1, searchTerm, type, { saveRecent: true })
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = async (page) => {
    if (!searchQuery || page < 1 || page > totalPages || page === currentPage) return
    if (pageLoading || loading) return

    setPageLoading(true)
    setError(null)

    try {
      const ok = await fetchPage(page, searchQuery, searchType)
      if (ok) {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } catch (err) {
      setError('Failed to load this page. Please try again.')
      console.error('Page change error:', err)
    } finally {
      setPageLoading(false)
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
            <div className="header-logo" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.25rem', height: '1.25rem', color: 'var(--primary-color)' }}>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
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
            <span className="toggle-icon" aria-hidden="true">
              {darkMode ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '0.95rem', height: '0.95rem' }}>
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '0.95rem', height: '0.95rem' }}>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </span>
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
            <div className="results-header" ref={resultsRef}>
              <h2>{totalResults.toLocaleString()} books found</h2>
            </div>
            <div className={pageLoading ? 'results-grid loading-page' : 'results-grid'}>
              <BookGrid books={books} onSelectBook={handleSelectBook} />
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalResults}
                pageSize={PAGE_SIZE}
                loading={pageLoading}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {!loading && books.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', color: 'var(--text-gray)', opacity: 0.65 }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
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
