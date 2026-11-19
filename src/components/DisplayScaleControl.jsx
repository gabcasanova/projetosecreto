import { useCallback, useId, useRef, useState } from 'react'
import magnifierIcon from '../assets/xp/icons/magnifier.png'
import { SCALE_OPTIONS, useDisplayScale } from '../hooks/displayScale'
import useDismiss from './menu/useDismiss'

/*
 * The magnifying glass in the notification area: a click opens a small
 * popup above it to draw the whole desktop bigger (100% to 200%), for big
 * monitors. The choice is remembered between visits.
 */
function DisplayScaleControl() {
  const { scale, setScale } = useDisplayScale()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(containerRef, open, close)
  const name = useId()

  const label = `Tamanho da tela: ${percent(scale)}`

  return (
    <div ref={containerRef} className="relative flex">
      <button
        type="button"
        className="xp-tray-icon"
        title={label}
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <img src={magnifierIcon} alt="" width={16} height={16} draggable={false} />
      </button>
      {open && (
        <div className="xp-volume-popup xp-scale-popup" role="dialog" aria-label="Tamanho da tela">
          <p>Tamanho da tela</p>
          {SCALE_OPTIONS.map((option) => (
            <label key={option} className="xp-volume-mute">
              <input
                type="radio"
                name={name}
                checked={scale === option}
                onChange={() => setScale(option)}
              />
              {percent(option)}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

// 1.25 -> "125%"
function percent(scale) {
  return `${Math.round(scale * 100)}%`
}

export default DisplayScaleControl
