import { useLayoutEffect, useRef } from 'react'

const DURATION_MS = 250

/**
 * Shrinks the window into its taskbar button when minimized and grows it back
 * out when restored, like XP does.
 *
 * The window never leaves the DOM: the shrink animation keeps its last frame
 * (fully transparent) for as long as the window stays minimized.
 */
function useMinimizeAnimation(windowRef, minimized, targetRef) {
  const isFirstRender = useRef(true)
  const minimizeAnimation = useRef(null)

  useLayoutEffect(() => {
    // Nothing to animate when the window first appears
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const windowElement = windowRef.current
    const target = targetRef.current
    if (!windowElement || !target) return

    const { normal, shrunk, hidden } = buildFrames(windowElement, target)

    if (minimized) {
      // Travel to the button while solid, then fade into it
      minimizeAnimation.current = windowElement.animate(
        [normal, { ...shrunk, offset: 0.7 }, hidden],
        { duration: getDuration(), easing: 'ease-in', fill: 'forwards' },
      )
    } else {
      // Mirror image: fade in over the button, then grow back into place.
      // The frames were measured above, before dropping the held minimized frame.
      minimizeAnimation.current?.cancel()
      windowElement.animate(
        [hidden, { ...shrunk, offset: 0.3 }, normal],
        { duration: getDuration(), easing: 'ease-out' },
      )
    }
  }, [minimized, windowRef, targetRef])
}

// The window in its normal place, squeezed over the taskbar button, and faded out there
function buildFrames(windowElement, target) {
  const from = getUntransformedRect(windowElement)
  const to = target.getBoundingClientRect()

  const shrunkTransform = [
    `translate(${to.left - from.left}px, ${to.top - from.top}px)`,
    `scale(${to.width / from.width}, ${to.height / from.height})`,
  ].join(' ')

  return {
    normal: { transformOrigin: 'top left', transform: 'none', opacity: 1 },
    shrunk: { transformOrigin: 'top left', transform: shrunkTransform, opacity: 1 },
    hidden: { transformOrigin: 'top left', transform: shrunkTransform, opacity: 0 },
  }
}

// getBoundingClientRect includes running transforms, but offset* values don't
function getUntransformedRect(element) {
  const parentRect = element.offsetParent.getBoundingClientRect()
  return {
    left: parentRect.left + element.offsetLeft,
    top: parentRect.top + element.offsetTop,
    width: element.offsetWidth,
    height: element.offsetHeight,
  }
}

function getDuration() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return reduceMotion ? 0 : DURATION_MS
}

export default useMinimizeAnimation
