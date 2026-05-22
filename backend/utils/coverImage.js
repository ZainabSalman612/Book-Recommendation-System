/**
 * Resolve Open Library cover URL from search/work document fields.
 */
function getCoverImageUrl(doc, size = 'M') {
  if (!doc) return null

  const coverId =
    doc.cover_i ??
    doc.cover_id ??
    (Array.isArray(doc.covers) && doc.covers.length > 0 ? doc.covers[0] : null)

  if (coverId != null && coverId !== '' && Number.isFinite(Number(coverId))) {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
  }

  const isbn = doc.isbn?.[0] ?? doc.first_isbn
  if (isbn) {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`
  }

  const oclc = doc.oclc_numbers?.[0]
  if (oclc) {
    return `https://covers.openlibrary.org/b/oclc/${oclc}-${size}.jpg`
  }

  return null
}

function getCoverId(doc) {
  if (!doc) return null
  const id = doc.cover_i ?? doc.cover_id ?? doc.covers?.[0]
  if (id != null && id !== '' && Number.isFinite(Number(id))) {
    return Number(id)
  }
  return null
}

module.exports = { getCoverImageUrl, getCoverId }
