import { useCallback, useReducer } from 'react'

// Pages take a random time to "load", between these (ms), like on a real connection
const FASTEST_LOAD = 150
const SLOWEST_LOAD = 600

function randomLoadDuration() {
  return FASTEST_LOAD + Math.random() * (SLOWEST_LOAD - FASTEST_LOAD)
}

/**
 * Where one browser window is, where it's been, and what it's loading.
 *
 * Going somewhere first becomes a pending load (with a random `duration`);
 * the current page stays up until `finishLoading` (when the progress bar is full), and only then does
 * the new page replace it, like a real browser. Parar drops the pending load.
 *
 * The window starts with nothing shown and the home page pending.
 */
function useBrowserNavigation(homeUrl) {
  const [state, dispatch] = useReducer(reducer, homeUrl, initialState)
  const { entries, index, visited, pending, loadCount } = state
  // Stable, so the browser's load timer doesn't restart on every render
  const finishLoading = useCallback(() => dispatch({ type: 'finish' }), [])
  // The duration is picked here rather than in the reducer, which has to stay pure
  const request = (details) => dispatch({ type: 'request', request: { ...details, duration: randomLoadDuration() } })

  return {
    currentUrl: entries[index] ?? null,
    pending,
    // Changes every time a load completes, so the page can re-mount (Atualizar shows a fresh copy)
    loadCount,
    // Nearest first, as in the Back and Forward buttons' drop-down lists
    backEntries: entries.slice(0, Math.max(index, 0)).reverse(),
    forwardEntries: entries.slice(index + 1),
    visited,
    canGoBack: index > 0,
    canGoForward: index < entries.length - 1,

    navigate: (url) => request({ type: 'navigate', url }),
    // -1 is Back, 1 is Forward, -3 is three pages back
    go: (offset) => {
      const url = entries[index + offset]
      if (url) request({ type: 'go', offset, url })
    },
    refresh: () => entries[index] && request({ type: 'refresh', url: entries[index] }),
    stop: () => dispatch({ type: 'stop' }),
    finishLoading,
  }
}

function initialState(homeUrl) {
  return {
    entries: [],
    index: -1,
    visited: [],
    pending: { type: 'navigate', url: homeUrl, id: 1, duration: randomLoadDuration() },
    requestCount: 1,
    loadCount: 0,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'request':
      // Each request gets its own id, so a new click restarts the load even for the same address
      return {
        ...state,
        pending: { ...action.request, id: state.requestCount + 1 },
        requestCount: state.requestCount + 1,
      }
    case 'stop':
      return { ...state, pending: null }
    case 'finish':
      return state.pending ? { ...applyRequest(state, state.pending), pending: null, loadCount: state.loadCount + 1 } : state
    default:
      throw new Error(`Unknown navigation action: ${action.type}`)
  }
}

// What a finished load does to the history list
function applyRequest(state, request) {
  const { entries, index, visited } = state

  if (request.type === 'go') {
    const target = index + request.offset
    return target >= 0 && target < entries.length ? { ...state, index: target } : state
  }

  if (request.type === 'navigate' && entries[index] !== request.url) {
    return {
      ...state,
      // Going somewhere new from the middle of the list drops the pages that were ahead
      entries: [...entries.slice(0, index + 1), request.url],
      index: index + 1,
      visited: visited.includes(request.url) ? visited : [...visited, request.url],
    }
  }

  // A refresh, or going to the page that's already open: same place, fresh copy
  return state
}

export default useBrowserNavigation
