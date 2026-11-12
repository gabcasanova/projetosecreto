import { useRef, useState } from 'react'
import useMinimizeAnimation from '../hooks/useMinimizeAnimation'

// How much of the title bar must stay on screen so the window can always be grabbed again
const MIN_VISIBLE = 40
const TASKBAR_HEIGHT = 30

// The classic beige dialog body; apps that draw their own content edge to edge pass '' instead
const DEFAULT_BODY_CLASS = 'bg-[#ece9d8] p-3'

function Window({
  title,
  icon,
  bodyClassName = DEFAULT_BODY_CLASS,
  initialPosition,
  width,
  active,
  minimized,
  zIndex,
  onFocus,
  onMinimize,
  onClose,
  getTaskbarButton,
  children,
}) {
  const [position, setPosition] = useState(initialPosition)
  // Offset between the pointer and the window's top-left corner while dragging
  const dragOffset = useRef(null)
  const windowRef = useRef(null)

  useMinimizeAnimation(windowRef, minimized, getTaskbarButton)

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
      ref={windowRef}
      // A minimized window is invisible (see useMinimizeAnimation) but still in the page, so make it unclickable
      className={`absolute flex flex-col ${active ? '' : 'inactive-window'}`}
      style={{ left: position.x, top: position.y, width, zIndex }}
      inert={minimized}
      onPointerDownCapture={onFocus}
    >
      <div
        className="xp-titlebar flex items-center justify-between"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          {icon && <img src={icon} alt="" className="size-4 shrink-0" />}
          <span className="xp-title truncate">{title}</span>
        </div>
        <div className="flex shrink-0 gap-0.5">
          <button type="button" aria-label="Minimize" className="xp-caption-button minimize" onClick={onMinimize} />
          {/* Resizing isn't supported, so maximize stays disabled */}
          <button type="button" aria-label="Maximize" className="xp-caption-button maximize" disabled />
          <button type="button" aria-label="Close" className="xp-caption-button close" onClick={onClose} />
        </div>
      </div>
      <div className="xp-frame">
        <div className={bodyClassName}>{children}</div>
      </div>
    </div>
  )
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default Window
