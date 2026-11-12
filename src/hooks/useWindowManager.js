import { useRef, useState } from 'react'

/**
 * Keeps track of which windows are open, minimized and on top.
 *
 * Each window has its own `id` and the `appId` of the app it shows. Most
 * apps have a single window whose id is the app id (`openWindow`); apps
 * like Internet Explorer can have several (`openNewWindow`), each getting a
 * fresh id and a `cascade` number, so it can sit a little below and right
 * of the ones before it.
 *
 * `windows` stays in the order they were opened (that's the taskbar order),
 * while `stack` holds the same ids from bottom to top for z-ordering.
 * Each window can carry `props` for its app, e.g. which album a CD case shows.
 */
function useWindowManager(initiallyOpen = []) {
  const [windows, setWindows] = useState(() =>
    initiallyOpen.map((appId) => ({ id: appId, appId, minimized: false, props: {}, cascade: 0 })),
  )
  const [stack, setStack] = useState(initiallyOpen)
  const instanceCount = useRef(0)

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

  // Opens an app's one window; if it's already open, restores it and swaps in the new props
  function openWindow(appId, props = {}) {
    const id = appId
    setWindows((current) =>
      current.some((window) => window.id === id)
        ? current.map((window) => (window.id === id ? { ...window, minimized: false, props } : window))
        : [...current, { id, appId, minimized: false, props, cascade: 0 }],
    )
    bringToFront(id)
  }

  // Opens another window of an app that can have several
  function openNewWindow(appId, props = {}) {
    instanceCount.current += 1
    const id = `${appId}-${instanceCount.current}`
    setWindows((current) => {
      const cascade = current.filter((window) => window.appId === appId).length
      return [...current, { id, appId, minimized: false, props, cascade }]
    })
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
    openNewWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    toggleFromTaskbar,
  }
}

export default useWindowManager
