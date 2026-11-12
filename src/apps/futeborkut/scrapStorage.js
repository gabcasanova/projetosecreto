/*
 * The scraps the visitor writes (and the ones they delete from their own
 * scrapbook) are kept in localStorage, so they survive a reload. Storage can
 * be missing or blocked, so every access is guarded and the site simply
 * forgets them in that case.
 */

const STORAGE_KEY = 'futeborkut:scraps'

// { [uid]: { written: [{ id, date, text }], deleted: [id] } }
function readAll() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return stored && typeof stored === 'object' ? stored : {}
  } catch {
    return {}
  }
}

function writeAll(all) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // Not saved; the scrap still shows until the page is left
  }
}

/** What the visitor changed on one scrapbook: { written, deleted }. */
export function loadScrapbookChanges(uid) {
  const changes = readAll()[uid] ?? {}
  return {
    written: Array.isArray(changes.written) ? changes.written : [],
    deleted: Array.isArray(changes.deleted) ? changes.deleted : [],
  }
}

export function saveScrapbookChanges(uid, changes) {
  writeAll({ ...readAll(), [uid]: changes })
}
