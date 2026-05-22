/**
 * Validate search input parameters
 */
function validateSearchInput(query, type, limit) {
  if (!query || typeof query !== 'string') {
    return { valid: false, error: 'Search query is required' };
  }

  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    return { valid: false, error: 'Search query cannot be empty' };
  }

  if (trimmedQuery.length > 200) {
    return { valid: false, error: 'Search query too long (max 200 characters)' };
  }

  const validTypes = ['title', 'author', 'subject'];
  if (!validTypes.includes(type)) {
    return { valid: false, error: `Invalid search type. Must be one of: ${validTypes.join(', ')}` };
  }

  const parsedLimit = parseInt(limit, 10);
  if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    return { valid: false, error: 'Limit must be between 1 and 100' };
  }

  return { valid: true };
}

/**
 * Build query string for Open Library API based on search type
 */
function buildOpenLibraryQuery(query, type) {
  const encodedQuery = encodeURIComponent(query.trim());

  switch (type) {
    case 'title':
      return `title=${encodedQuery}`;
    case 'author':
      return `author=${encodedQuery}`;
    case 'subject':
      return `subject=${encodedQuery}`;
    default:
      return `q=${encodedQuery}`;
  }
}

/**
 * Format raw Open Library book response to consistent structure
 * Handles missing/null fields gracefully (edge case: incomplete API responses)
 */
function formatBookResponse(doc) {
  // Handle missing key
  const id = doc.key?.replace('/works/', '') || null;

  // Handle cover image - try multiple strategies to get cover
  let coverImage = null;
  
  // Strategy 1: Try cover_i from search results (primary source)
  if (doc.cover_i) {
    coverImage = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
  }
  // Strategy 2: Try cover_id if Open Library returns it
  else if (doc.cover_id) {
    coverImage = `https://covers.openlibrary.org/b/id/${doc.cover_id}-M.jpg`;
  }
  // Strategy 3: Try covers array from detailed response
  else if (doc.covers && Array.isArray(doc.covers) && doc.covers.length > 0) {
    coverImage = `https://covers.openlibrary.org/b/id/${doc.covers[0]}-M.jpg`;
  }
  // Strategy 4: Try using ISBN if available
  else if (doc.isbn && doc.isbn.length > 0) {
    const isbn = doc.isbn[0];
    coverImage = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  }
  // Strategy 5: Try using first_isbn if available
  else if (doc.first_isbn) {
    coverImage = `https://covers.openlibrary.org/b/isbn/${doc.first_isbn}-M.jpg`;
  }
  // Strategy 6: Try OCLC/other identifiers
  else if (doc.oclc_numbers && doc.oclc_numbers.length > 0) {
    const oclc = doc.oclc_numbers[0];
    coverImage = `https://covers.openlibrary.org/b/oclc/${oclc}-M.jpg`;
  }

  // Parse first publish year safely
  let firstPublishYear = null;
  if (doc.first_publish_year) {
    firstPublishYear = parseInt(doc.first_publish_year, 10);
  } else if (doc.first_edition_date) {
    firstPublishYear = new Date(doc.first_edition_date).getFullYear();
  }

  return {
    id,
    title: doc.title || 'Unknown Title',
    author: doc.author_name?.[0] || doc.authors?.[0]?.name || 'Unknown Author',
    authorList: doc.author_name || [],
    firstPublishYear,
    subjects: doc.subject?.slice(0, 5) || [],
    coverImage,
    editionCount: doc.edition_count || 0,
    language: doc.language?.[0] || 'en'
  };
}

/**
 * Return random popular books as fallback recommendation
 */
function getRandomBooks() {
  const popularBooks = [
    { title: '1984', author: 'George Orwell', id: 'OL45883W' },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', id: 'OL45505W' },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', id: 'OL102749W' },
    { title: 'Pride and Prejudice', author: 'Jane Austen', id: 'OL45883W' },
    { title: 'The Catcher in the Rye', author: 'J.D. Salinger', id: 'OL27448W' }
  ];

  return popularBooks.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    firstPublishYear: null,
    subjects: [],
    coverImage: null,
    editionCount: 0
  }));
}

module.exports = {
  validateSearchInput,
  buildOpenLibraryQuery,
  formatBookResponse,
  getRandomBooks
};
