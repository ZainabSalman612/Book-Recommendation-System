/**
 * Build Open Library cover URL from cover_i or precomputed coverImage.
 * @see https://openlibrary.org/dev/docs/api/covers
 */
export function getBookCoverUrl(book) {
  if (!book) return null

  if (book.coverImage) return book.coverImage

  const coverId = book.cover_i ?? book.coverId ?? book.cover_id
  if (coverId != null && coverId !== '' && Number.isFinite(Number(coverId))) {
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
  }

  const isbn = book.isbn?.[0] ?? book.first_isbn
  if (isbn) {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
  }

  return null
}
