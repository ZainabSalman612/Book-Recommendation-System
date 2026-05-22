const express = require('express');
const axios = require('axios');
const { validateSearchInput, buildOpenLibraryQuery, formatBookResponse, getRandomBooks } = require('../utils/bookService');
const { getCoverImageUrl } = require('../utils/coverImage');

const router = express.Router();
const OPEN_LIBRARY_API = 'https://openlibrary.org';
const API_TIMEOUT = 5000; // Reduced from 8s to 5s
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const OPEN_LIBRARY_HEADERS = {
  'Accept-Encoding': 'gzip, deflate',
  'User-Agent': 'BookFinderProfessional/1.0.0 (contact: support@bookfinderpro.com)'
};

// Simple in-memory cache
const searchCache = new Map();
const detailsCache = new Map();

// Cache cleanup interval (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of searchCache) {
    if (now - value.timestamp > CACHE_DURATION) {
      searchCache.delete(key);
    }
  }
  for (const [key, value] of detailsCache) {
    if (now - value.timestamp > CACHE_DURATION) {
      detailsCache.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * GET /api/books/search
 * Query params: q, type (title/author/subject), limit (default 20), offset (default 0)
 */
router.get('/search', async (req, res) => {
  try {
    const { q, type = 'title', limit = 20, offset = 0 } = req.query;

    const validation = validateSearchInput(q, type, limit, offset);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const { limit: parsedLimit, offset: parsedOffset, query: trimmedQuery } = validation;

    const cacheKey = `${trimmedQuery}:${type}:${parsedLimit}:${parsedOffset}`;
    if (searchCache.has(cacheKey)) {
      const cached = searchCache.get(cacheKey);
      return res.json({ ...cached.data, cached: true });
    }

    const query = buildOpenLibraryQuery(trimmedQuery, type);
    const url = `${OPEN_LIBRARY_API}/search.json?${query}&limit=${parsedLimit}&offset=${parsedOffset}`;

    const response = await axios.get(url, { 
      timeout: API_TIMEOUT,
      headers: OPEN_LIBRARY_HEADERS
    });

    const total = response.data.numFound ?? 0;
    const docs = response.data.docs || [];
    const books = docs.map(doc => formatBookResponse(doc));

    const responseData = {
      books,
      total,
      offset: parsedOffset,
      limit: parsedLimit,
      hasMore: parsedOffset + books.length < total
    };

    if (books.length === 0) {
      responseData.message = 'No books found';
    }

    searchCache.set(cacheKey, { data: responseData, timestamp: Date.now() });
    
    res.json(responseData);
  } catch (error) {
    // Handle specific error types
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return res.status(504).json({ error: 'API request timeout. Please try again.' });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limited. Please try again in a moment.' });
    }
    if (error.message.includes('ECONNREFUSED')) {
      return res.status(503).json({ error: 'Open Library API is currently unavailable' });
    }
    res.status(500).json({ error: 'Failed to search books' });
  }
});

/**
 * GET /api/books/details/:id
 * Fetch detailed information about a specific book
 */
router.get('/details/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    // Check cache first
    if (detailsCache.has(id)) {
      const cached = detailsCache.get(id);
      return res.json({ ...cached.data, cached: true });
    }

    const url = `${OPEN_LIBRARY_API}/works/${id}.json`;
    const response = await axios.get(url, { 
      timeout: API_TIMEOUT,
      headers: OPEN_LIBRARY_HEADERS
    });

    const book = response.data;
    const coverImage = getCoverImageUrl(book, 'L');

    const details = {
      id: book.key?.replace('/works/', '') || id,
      title: book.title || 'Unknown Title',
      description: book.description?.value || book.description || null,
      subjects: book.subjects || [],
      editions: book.editions_count || 0,
      firstPublishYear: book.first_publish_date ? new Date(book.first_publish_date).getFullYear() : null,
      authors: book.authors?.map(a => a.name) || [],
      cover_i: book.covers?.[0] ?? null,
      coverImage
    };

    // Cache the result
    detailsCache.set(id, { data: details, timestamp: Date.now() });

    res.json(details);
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'API request timeout' });
    }
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(500).json({ error: 'Failed to fetch book details' });
  }
});

/**
 * GET /api/books/similar/:id
 * Find similar books based on subjects or author
 */
router.get('/similar/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    // Fetch the original book to get subjects/authors
    const url = `${OPEN_LIBRARY_API}/works/${id}.json`;
    const response = await axios.get(url, { timeout: API_TIMEOUT, headers: OPEN_LIBRARY_HEADERS });

    const book = response.data;
    const subjects = book.subjects?.slice(0, 3) || [];

    if (subjects.length === 0) {
      // If no subjects, return random books as fallback
      return res.json({ books: getRandomBooks(), message: 'No similar books found, showing random recommendations' });
    }

    // Search by primary subject
    const primarySubject = subjects[0];
    const searchUrl = `${OPEN_LIBRARY_API}/search.json?subject=${encodeURIComponent(primarySubject)}&limit=10`;

    const similarResponse = await axios.get(searchUrl, { timeout: API_TIMEOUT, headers: OPEN_LIBRARY_HEADERS });
    const similarBooks = similarResponse.data.docs
      .filter(doc => doc.key !== `/works/${id}`) // Exclude original book
      .slice(0, 5)
      .map(doc => formatBookResponse(doc));

    res.json({ books: similarBooks, baseSubject: primarySubject });
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'API request timeout' });
    }
    res.status(500).json({ error: 'Failed to find similar books' });
  }
});

module.exports = router;
