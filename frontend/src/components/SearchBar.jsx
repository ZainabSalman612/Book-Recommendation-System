import { useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import '../styles/SearchBar.css'

export default function SearchBar({ onSearch, recentSearches = [] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('title')
  const [showRecent, setShowRecent] = useState(false)
  const debouncedValue = useDebounce(searchTerm, 300)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchTerm, searchType)
      setShowRecent(false)
    }
  }

  const handleRecentClick = (recent) => {
    const [term, typeMatch] = recent.match(/^(.*?)\s*\(([^)]+)\)$/)?.slice(1) || [recent, 'title']
    setSearchTerm(term)
    setSearchType(typeMatch)
    setShowRecent(false)
    onSearch(term, typeMatch)
  }

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-inputs">
          <input
            type="text"
            placeholder="Search books by title, author name, or subject..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setShowRecent(true)
            }}
            onFocus={() => setShowRecent(true)}
            className="search-input"
            aria-label="Book search input"
          />

          <select 
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-type-select"
            aria-label="Search type"
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="subject">Subject</option>
          </select>

          <button type="submit" className="search-button">
            Search
          </button>
        </div>

        {showRecent && searchTerm === '' && recentSearches.length > 0 && (
          <div className="recent-searches">
            <p className="recent-label">Recent Searches:</p>
            {recentSearches.map((recent, idx) => (
              <button
                key={idx}
                type="button"
                className="recent-search-item"
                onClick={() => handleRecentClick(recent)}
              >
                {recent}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  )
}
