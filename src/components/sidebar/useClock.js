import { useEffect, useState } from 'react'

/** The current time, updated every second (for the clock and calendar widgets). */
function useClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return now
}

export default useClock
