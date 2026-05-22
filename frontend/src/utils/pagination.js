/**
 * Build page numbers with ellipsis for large result sets.
 * @returns {(number|'ellipsis')[]}
 */
export function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 1) return [1]
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = new Set([
    1,
    totalPages,
    currentPage,
    currentPage - 1,
    currentPage + 1
  ])

  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b)

  const result = []
  let prev = 0
  for (const p of sorted) {
    if (p - prev > 1) result.push('ellipsis')
    result.push(p)
    prev = p
  }
  return result
}

export function getTotalPages(totalResults, pageSize) {
  return Math.max(1, Math.ceil(totalResults / pageSize))
}
