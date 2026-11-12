import { flushSync } from 'react-dom'

/**
 * Runs a React state update inside a View Transition, so the browser can
 * animate between the old and new screens (see the ::view-transition rules
 * in media-player.css). Browsers without the API, or users who prefer
 * reduced motion, simply get the update.
 */
export function withViewTransition(update) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduceMotion) {
    update()
    return
  }
  // flushSync makes React render right away, so the browser snapshots the finished new screen
  document.startViewTransition(() => flushSync(update))
}

/*
 * The library tile's cover and the Now Playing list pane's cover share this
 * name, so when an album starts the browser morphs one into the other.
 * Album ids look like "1-volume1"; the prefix keeps it a valid CSS identifier.
 */
export function albumArtTransitionName(album) {
  return `album-art-${album.id}`
}
