import { useRef, useState } from 'react'

const MIN_ZOOM = 1
const MAX_ZOOM = 4
// How strongly one wheel notch (~100 deltaY) zooms
const ZOOM_PER_WHEEL_UNIT = 0.0015

/**
 * Photo-viewer style navigation: the wheel zooms in and out around the
 * cursor, and dragging moves the picture around.
 *
 * Returns the CSS `transform` to apply to the content and the handlers for
 * the element that should catch the wheel and drags.
 */
function usePanZoom() {
  // Zoom and position change together, so they live in one state (trackpads send many wheel events at once)
  const [view, setView] = useState({ zoom: MIN_ZOOM, x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const drag = useRef(null)

  function handleWheel(event) {
    const bounds = event.currentTarget.getBoundingClientRect()
    // The cursor, measured from the middle of the view (where the content's transform origin is)
    const cursorX = event.clientX - (bounds.left + bounds.width / 2)
    const cursorY = event.clientY - (bounds.top + bounds.height / 2)
    const zoomFactor = Math.exp(-event.deltaY * ZOOM_PER_WHEEL_UNIT)

    setView((current) => {
      const zoom = clamp(current.zoom * zoomFactor, MIN_ZOOM, MAX_ZOOM)
      // Back to normal size: recenter, so the picture never ends up lost off to one side
      if (zoom === MIN_ZOOM) return { zoom, x: 0, y: 0 }
      // Keep the point under the cursor in place while zooming
      const ratio = zoom / current.zoom
      return {
        zoom,
        x: cursorX - (cursorX - current.x) * ratio,
        y: cursorY - (cursorY - current.y) * ratio,
      }
    })
  }

  function handlePointerDown(event) {
    // Buttons on top of the view keep working normally
    if (event.target.closest('button')) return
    drag.current = { x: event.clientX - view.x, y: event.clientY - view.y }
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event) {
    if (!drag.current) return
    const { x, y } = drag.current
    setView((current) => ({ ...current, x: event.clientX - x, y: event.clientY - y }))
  }

  function handlePointerUp() {
    drag.current = null
    setDragging(false)
  }

  return {
    dragging,
    transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
    handlers: {
      onWheel: handleWheel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
    },
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default usePanZoom
