import { useRef, useState } from 'react'

// How much of the title bar must stay on screen so the window can always be grabbed again
const MIN_VISIBLE = 40
const TASKBAR_HEIGHT = 30

function Window({ title, initialPosition, width, children }) {
  const [position, setPosition] = useState(initialPosition)
  // Offset between the pointer and the window's top-left corner while dragging
  const dragOffset = useRef(null)

  function handlePointerDown(event) {
    // Let the caption buttons receive their own clicks
    if (event.target.closest('button')) return

    dragOffset.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event) {
    if (!dragOffset.current) return

    const maxX = window.innerWidth - MIN_VISIBLE
    const maxY = window.innerHeight - TASKBAR_HEIGHT - MIN_VISIBLE
    setPosition({
      x: clamp(event.clientX - dragOffset.current.x, MIN_VISIBLE - width, maxX),
      y: clamp(event.clientY - dragOffset.current.y, 0, maxY),
    })
  }

  function handlePointerUp() {
    dragOffset.current = null
  }

  return (
    <div
      className="absolute flex flex-col"
      style={{ left: position.x, top: position.y, width }}
    >
      <div
        className="xp-titlebar flex items-center justify-between"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <span className="xp-title truncate">{title}</span>
        {/* Decorative for now: closing and resizing aren't supported yet */}
        <div className="flex gap-0.5">
          <button type="button" aria-label="Minimize" className="xp-caption-button minimize" />
          <button type="button" aria-label="Maximize" className="xp-caption-button maximize" />
          <button type="button" aria-label="Close" className="xp-caption-button close" />
        </div>
      </div>
      <div className="xp-frame">
        <div className="bg-[#ece9d8] p-3">{children}</div>
      </div>
    </div>
  )
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default Window
