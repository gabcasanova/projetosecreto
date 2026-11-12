import { useMemo, useState } from 'react'
import { personOfAccount, VISITOR } from './data/database'
import { loadScrapbookChanges, saveScrapbookChanges } from './scrapStorage'

/*
 * A scrapbook as the visitor sees it: the scraps from the profile's data,
 * plus the ones the visitor wrote, minus the ones they deleted, newest first.
 */
export function useScrapbook(account) {
  const [changes, setChanges] = useState(() => loadScrapbookChanges(account.uid))

  const scraps = useMemo(() => {
    const visitor = personOfAccount(VISITOR)
    const written = changes.written.map((scrap) => ({
      id: scrap.id,
      from: visitor,
      date: new Date(scrap.date),
      text: scrap.text,
    }))
    const kept = account.scraps.filter((scrap) => !changes.deleted.includes(scrap.id))
    return [...written, ...kept].sort((a, b) => b.date - a.date)
  }, [account, changes])

  function update(newChanges) {
    setChanges(newChanges)
    saveScrapbookChanges(account.uid, newChanges)
  }

  function addScrap(text) {
    const scrap = { id: `visitor-${Date.now()}`, date: new Date().toISOString(), text }
    update({ ...changes, written: [...changes.written, scrap] })
  }

  // The visitor's own scraps go away for good; scraps from the data are remembered as deleted
  function deleteScraps(ids) {
    update({
      written: changes.written.filter((scrap) => !ids.includes(scrap.id)),
      deleted: [...changes.deleted, ...ids.filter((id) => id.startsWith('seed-'))],
    })
  }

  return { scraps, addScrap, deleteScraps }
}

/** How many scraps a scrapbook has, counting the visitor's changes (for counters). */
export function useScrapCount(account) {
  return useScrapbook(account).scraps.length
}
