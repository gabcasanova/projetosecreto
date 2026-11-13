import { useEffect, useState } from 'react'

/**
 * Like useState, but remembered in the browser (localStorage) under `key`,
 * so it survives a reload. Storage can be missing or blocked (private
 * windows, cleared site data), so every access is guarded: the value then
 * simply isn't remembered.
 */
function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored === null ? initialValue : JSON.parse(stored)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Not remembered; it still applies until the page is left
    }
  }, [key, value])

  return [value, setValue]
}

export default useStoredState
