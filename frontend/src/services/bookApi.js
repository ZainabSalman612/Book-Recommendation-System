import axios from 'axios'

const API_BASE = 'http://localhost:5000/api'

export async function searchBooks(query, type = 'title', limit = 20) {
  try {
    const response = await axios.get(`${API_BASE}/books/search`, {
      params: { q: query, type, limit },
      timeout: 10000
    })
    return {
      books: response.data.books || [],
      total: response.data.total || 0
    }
  } catch (error) {
    return {
      error: handleApiError(error),
      books: []
    }
  }
}

export async function getBookDetails(id) {
  try {
    const response = await axios.get(`${API_BASE}/books/details/${id}`, {
      timeout: 10000
    })
    return response.data
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

export async function findSimilarBooks(id) {
  try {
    const response = await axios.get(`${API_BASE}/books/similar/${id}`, {
      timeout: 10000
    })
    return {
      books: response.data.books || [],
      baseSubject: response.data.baseSubject || 'Related Books',
      message: response.data.message
    }
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

function handleApiError(error) {
  if (error.response?.status === 400) {
    return error.response.data?.error || 'Invalid request'
  }
  if (error.response?.status === 404) {
    return 'Book not found'
  }
  if (error.response?.status === 429) {
    return 'Too many requests. Please wait a moment and try again.'
  }
  if (error.response?.status === 504) {
    return 'Book API is temporarily slow. Please try again in a moment.'
  }
  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please check your connection and try again.'
  }
  if (error.message === 'Network Error') {
    return 'Network error. Please check your internet connection.'
  }
  if (error.message.includes('cannot reach')) {
    return 'Cannot connect to server. Make sure the backend is running on port 5000.'
  }
  return error.response?.data?.error || 'An error occurred. Please try again.'
}
