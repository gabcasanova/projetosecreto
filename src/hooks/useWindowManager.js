import { useState } from 'react'

/**
 * Keeps track of which windows are open, minimized and on top.
 *
 * `windows` stays in the order they were opened (that's the taskbar order),
 * while `stack` holds the same ids from bottom to top for z-ordering.
 * Each window can carry `props` for its app, e.g. which album a CD case shows.
 */
function useWindowManager(initiallyOpen = []) {
  const [windows, setWindows] = useState(() => initiallyOpen.map((id) => ({ id, minimized: false, props: {} })))
  const [stack, setStack] = useState(initiallyOpen)

  // The active window is the topmost one that isn't minimized
  const activeId = stack.findLast((id) => !isMinimized(id)) ?? null

  function isMinimized(id) {
    return windows.find((window) => window.id === id)?.minimized ?? false
  }

  function setMinimized(id, minimized) {
    setWindows((current) => current.map((window) => (window.id === id ? { ...window, minimized } : window)))
  }

  function bringToFront(id) {
    setStack((current) => [...current.filter((stackedId) => stackedId !== id), id])
  }

  // Opening a window that's already open restores it and swaps in the new props
  function openWindow(id, props = {}) {
    if (!windows.some((window) => window.id === id)) {
      setWindows((current) => [...current, { id, minimized: false, props }])
    } else {
      setWindows((current) =>
        current.map((window) => (window.id === id ? { ...window, minimized: false, props } : window)),
      )
    }
    bringToFront(id)
  }

  function closeWindow(id) {
    setWindows((current) => current.filter((window) => window.id !== id))
    setStack((current) => current.filter((stackedId) => stackedId !== id))
  }

  function minimizeWindow(id) {
    setMinimized(id, true)
  }

  function focusWindow(id) {
    if (stack.at(-1) !== id) bringToFront(id)
  }

  // Like XP: clicking the active window's taskbar button minimizes it, any other button restores and focuses
  function toggleFromTaskbar(id) {
    if (id === activeId) {
      minimizeWindow(id)
    } else {
      setMinimized(id, false)
      bringToFront(id)
    }
  }

  return {
    windows,
    activeId,
    zIndexOf: (id) => stack.indexOf(id) + 1,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    toggleFromTaskbar,
  }
}

export default useWindowManager
