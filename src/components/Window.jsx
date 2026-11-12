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
  // Only windows whose content can stretch to any size offer maximize
  maximizable = false,
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
  const [maximized, setMaximized] = useState(false)
  // Offset between the pointer and the window's top-left corner while dragging
  const dragOffset = useRef(null)
  const windowRef = useRef(null)

  useMinimizeAnimation(windowRef, minimized, getTaskbarButton)

  function toggleMaximized() {
    if (maximizable) setMaximized((current) => !current)
  }

  function handlePointerDown(event) {
    // Let the caption buttons receive their own clicks; a maximized window can't be dragged
    if (event.target.closest('button') || maximized) return

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
      className={`absolute flex flex-col ${active ? '' : 'inactive-window'} ${maximized ? 'window-maximized' : ''}`}
      // Maximized, it fills the desktop above the taskbar; it remembers where it was for when it's restored
      style={
        maximized
          ? { left: 0, top: 0, width: '100%', height: `calc(100% - ${TASKBAR_HEIGHT}px)`, zIndex }
          : { left: position.x, top: position.y, width, zIndex }
      }
      inert={minimized}
      onPointerDownCapture={onFocus}
    >
      <div
        className="xp-titlebar flex items-center justify-between"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={(event) => !event.target.closest('button') && toggleMaximized()}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          {icon && <img src={icon} alt="" className="size-4 shrink-0" />}
          <span className="xp-title truncate">{title}</span>
        </div>
        <div className="flex shrink-0 gap-0.5">
          <button type="button" aria-label="Minimizar" className="xp-caption-button minimize" onClick={onMinimize} />
          <button
            type="button"
            aria-label={maximized ? 'Restaurar' : 'Maximizar'}
            className={`xp-caption-button ${maximized ? 'restore' : 'maximize'}`}
            disabled={!maximizable}
            onClick={toggleMaximized}
          />
          <button type="button" aria-label="Fechar" className="xp-caption-button close" onClick={onClose} />
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
