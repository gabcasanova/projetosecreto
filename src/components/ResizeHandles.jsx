import { useRef } from 'react'

// Which way each handle moves the window's edges: -1 the left/top edge, 1 the right/bottom one
const HANDLES = [
  { name: 'n', x: 0, y: -1, className: 'top-0 right-3 left-3 h-1 cursor-ns-resize' },
  { name: 's', x: 0, y: 1, className: 'right-3 bottom-0 left-3 h-1 cursor-ns-resize' },
  { name: 'w', x: -1, y: 0, className: 'top-3 bottom-3 left-0 w-1 cursor-ew-resize' },
  { name: 'e', x: 1, y: 0, className: 'top-3 right-0 bottom-3 w-1 cursor-ew-resize' },
  { name: 'nw', x: -1, y: -1, className: 'top-0 left-0 size-3 cursor-nwse-resize' },
  { name: 'ne', x: 1, y: -1, className: 'top-0 right-0 size-3 cursor-nesw-resize' },
  { name: 'sw', x: -1, y: 1, className: 'bottom-0 left-0 size-3 cursor-nesw-resize' },
  { name: 'se', x: 1, y: 1, className: 'right-0 bottom-0 size-3 cursor-nwse-resize' },
]

/**
 * Invisible strips along a window's edges and corners that resize it by
 * dragging, like XP's window borders.
 *
 * `getRect` gives the window's current {x, y, width, height} when a drag
 * starts; `onResize` receives the new one as the pointer moves. The window
 * never gets smaller than `minWidth` × `minHeight`, and its top edge stays
 * on screen.
 */
function ResizeHandles({ getRect, onResize, minWidth, minHeight }) {
  // The pointer position and window rect when the drag started
  const drag = useRef(null)

  function handlePointerDown(event, handle) {
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { handle, pointerX: event.clientX, pointerY: event.clientY, rect: getRect() }
  }

  function handlePointerMove(event) {
    if (!drag.current) return
    const { handle, pointerX, pointerY, rect } = drag.current
    const horizontal = resizeAxis(rect.x, rect.width, event.clientX - pointerX, handle.x, minWidth, -Infinity)
    const vertical = resizeAxis(rect.y, rect.height, event.clientY - pointerY, handle.y, minHeight, 0)
    onResize({ x: horizontal.start, width: horizontal.size, y: vertical.start, height: vertical.size })
  }

  function handlePointerUp() {
    drag.current = null
  }

  return HANDLES.map((handle) => (
    <div
      key={handle.name}
      className={`absolute z-10 ${handle.className}`}
      onPointerDown={(event) => handlePointerDown(event, handle)}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  ))
}

/*
 * Moves one edge of a window along one axis by `delta` pixels.
 * direction 1 moves the far edge (size changes), -1 the near edge (start and
 * size change together, so the far edge stays put), 0 leaves the axis alone.
 */
function resizeAxis(start, size, delta, direction, minSize, minStart) {
  if (direction === 1) return { start, size: Math.max(size + delta, minSize) }
  if (direction === -1) {
    const end = start + size
    const newStart = Math.max(Math.min(start + delta, end - minSize), minStart)
    return { start: newStart, size: end - newStart }
  }
  return { start, size }
}

export default ResizeHandles
