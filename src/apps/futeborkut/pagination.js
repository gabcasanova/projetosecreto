/** Splits `items` into pages; `page` comes from the address and may be anything. */
export function paginate(items, page, pageSize) {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const current = Math.min(Math.max(1, Number.parseInt(page, 10) || 1), pageCount)
  const start = (current - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)
  return {
    items: pageItems,
    page: current,
    pageCount,
    first: start + 1,
    last: start + pageItems.length,
    total: items.length,
  }
}
