import { useState } from 'react'

/** The time the page was opened: dates like "2½ horas atrás" are worked out from it. */
export function useNow() {
  const [now] = useState(() => new Date())
  return now
}
