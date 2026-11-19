import { useRef, useState } from 'react'
import { useDisplayScale } from '../hooks/displayScale'
import useMinimizeAnimation from '../hooks/useMinimizeAnimation'
import ResizeHandles from './ResizeHandles'

// How much of the title bar must stay on screen so the window can always be grabbed again
const MIN_VISIBLE = 40
const TASKBAR_HEIGHT = 30
// The smallest a window can be resized to, unless its app asks for more room
const MIN_WIDTH = 300
const MIN_HEIGHT = 200

// The classic beige dialog body; apps that draw their own content edge to edge pass '' instead
const DEFAULT_BODY_CLASS = 'bg-[#ece9d8] p-3'

function Window({
  title,
  icon,
  bodyClassName = DEFAULT_BODY_CLASS,
  initialPosition,
  width,
  // Only windows whose content can stretch to any size offer maximize, and can be resized
  maximizable = false,
  minWidth = MIN_WIDTH,
  minHeight = MIN_HEIGHT,
  // Content width ÷ height to keep while resizing (e.g. a game's screen); null resizes freely
  contentAspectRatio = null,
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
  const { scale } = useDisplayScale()
  const [maximized, setMaximized] = useState(false)
  // Where a proportional window goes when maximized (see largestProportionalRect)
  const [maximizedRect, setMaximizedRect] = useState(null)
  // Height starts out as whatever the content needs, until the window is resized
  const [size, setSize] = useState({ width, height: null })
  // Offset between the pointer and the window's top-left corner while dragging
  const dragOffset = useRef(null)
  const windowRef = useRef(null)
  const bodyRef = useRef(null)

  useMinimizeAnimation(windowRef, minimized, getTaskbarButton)

  function toggleMaximized() {
    if (!maximizable) return
    // Content with fixed proportions can't fill the whole screen: it gets the biggest box that fits, measured now
    if (!maximized && contentAspectRatio) setMaximizedRect(largestProportionalRect())
    setMaximized((current) => !current)
  }

  /*
   * The biggest window, keeping its content's proportions, that fits the
   * space a maximized window gets (above the taskbar, left of the sidebar),
   * centred across it.
   */
  function largestProportionalRect() {
    const desktop = windowRef.current.offsetParent
    const sidebar = parseFloat(getComputedStyle(desktop).getPropertyValue('--sidebar-width')) || 0
    const areaWidth = desktop.clientWidth - sidebar
    const areaHeight = desktop.clientHeight - TASKBAR_HEIGHT
    const frameWidth = windowRef.current.offsetWidth - bodyRef.current.offsetWidth
    const frameHeight = windowRef.current.offsetHeight - bodyRef.current.offsetHeight

    let height = areaHeight
    let width = (height - frameHeight) * contentAspectRatio + frameWidth
    if (width > areaWidth) {
      width = areaWidth
      height = (width - frameWidth) / contentAspectRatio + frameHeight
    }
    return { x: Math.round((areaWidth - width) / 2), width: Math.round(width), height: Math.round(height) }
  }

  function handlePointerDown(event) {
    // Let the caption buttons receive their own clicks; a maximized window can't be dragged
    if (event.target.closest('button') || maximized) return

    // The pointer reports real screen pixels; the window lives in the (possibly zoomed) desktop's
    dragOffset.current = {
      x: event.clientX / scale - position.x,
      y: event.clientY / scale - position.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event) {
    if (!dragOffset.current) return

    const maxX = window.innerWidth / scale - MIN_VISIBLE
    const maxY = window.innerHeight / scale - TASKBAR_HEIGHT - MIN_VISIBLE
    setPosition({
      x: clamp(event.clientX / scale - dragOffset.current.x, MIN_VISIBLE - size.width, maxX),
      y: clamp(event.clientY / scale - dragOffset.current.y, 0, maxY),
    })
  }

  function handlePointerUp() {
    dragOffset.current = null
  }

  // Where the window is now, for a resize to start from (its height may still be the content's own)
  function currentRect() {
    return { ...position, width: size.width, height: windowRef.current.offsetHeight }
  }

  function handleResize(rect) {
    const { x, y, width: newWidth, height } = contentAspectRatio ? keepAspectRatio(rect) : rect
    setPosition({ x, y })
    setSize({ width: newWidth, height })
  }

  /*
   * Bends a resize so the content keeps its proportions. Dragging a side
   * edge (or a corner) sets the width and the height follows; dragging the
   * top or bottom edge sets the height and the width follows. The window's
   * title bar and frame don't scale, so they're taken out of the sums, and
   * the edge opposite the one being dragged stays put.
   */
  function keepAspectRatio(rect) {
    const before = currentRect()
    const frameWidth = windowRef.current.offsetWidth - bodyRef.current.offsetWidth
    const frameHeight = windowRef.current.offsetHeight - bodyRef.current.offsetHeight

    if (rect.width !== before.width) {
      const height = Math.round((rect.width - frameWidth) / contentAspectRatio + frameHeight)
      // Dragging from the top: the bottom edge stays where it was
      const y = rect.y !== before.y ? before.y + before.height - height : rect.y
      return { ...rect, y, height }
    }
    const width = Math.round((rect.height - frameHeight) * contentAspectRatio + frameWidth)
    return { ...rect, width }
  }

  // Content stretches to fill the window once it has a set height
  const fillsWindow = maximized || size.height !== null

  return (
    <div
      ref={windowRef}
      // Lets an app find its own window, e.g. to shake it (MSN's nudge)
      data-window
      // A minimized window is invisible (see useMinimizeAnimation) but still in the page, so make it unclickable
      className={`absolute flex flex-col ${active ? '' : 'inactive-window'} ${fillsWindow ? 'window-fill' : ''}`}
      // Maximized, it fills the desktop above the taskbar and left of the sidebar; it remembers where it was for when it's restored
      style={
        maximized && maximizedRect
          ? { left: maximizedRect.x, top: 0, width: maximizedRect.width, height: maximizedRect.height, zIndex }
          : maximized
            ? { left: 0, top: 0, width: 'calc(100% - var(--sidebar-width, 0px))', height: `calc(100% - ${TASKBAR_HEIGHT}px)`, zIndex }
            : { left: position.x, top: position.y, width: size.width, height: size.height ?? undefined, zIndex }
      }
      inert={minimized}
      onPointerDownCapture={onFocus}
    >
      {maximizable && !maximized && (
        <ResizeHandles getRect={currentRect} onResize={handleResize} minWidth={minWidth} minHeight={minHeight} />
      )}
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
        <div ref={bodyRef} className={bodyClassName}>
          {children}
        </div>
      </div>
    </div>
  )
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default Window
