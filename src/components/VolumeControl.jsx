import { useCallback, useId, useRef, useState } from 'react'
import { usePlayerContext } from '../apps/media-player/playerContext'
import useDismiss from './menu/useDismiss'

/*
 * The speaker in the notification area. A click opens XP's little Volume
 * popup above it: a vertical slider and "Sem áudio". It's Windows' master
 * volume, so it applies on top of the Discografia's own volume.
 */
function VolumeControl() {
  const player = usePlayerContext()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(containerRef, open, close)

  const percent = Math.round(player.masterVolume * 100)
  const label = player.masterMuted ? 'Volume: sem áudio' : `Volume: ${percent}%`

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
        <SpeakerIcon muted={player.masterMuted} />
      </button>
      {open && <VolumePopup player={player} />}
    </div>
  )
}

function VolumePopup({ player }) {
  const muteId = useId()
  return (
    <div className="xp-volume-popup" role="dialog" aria-label="Volume">
      <p>Volume</p>
      <input
        type="range"
        className="xp-volume-slider"
        min="0"
        max="1"
        step="0.01"
        value={player.masterVolume}
        onChange={(event) => player.setMasterVolume(Number(event.target.value))}
        aria-label="Volume"
        // Vertical, with the loudest at the top, like XP's trackbar
        style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
      />
      <label htmlFor={muteId} className="xp-volume-mute">
        <input id={muteId} type="checkbox" checked={player.masterMuted} onChange={player.toggleMasterMute} />
        Sem áudio
      </label>
    </div>
  )
}

// XP's grey loudspeaker; muted, it gets the red "no" sign
function SpeakerIcon({ muted }) {
  const id = useId()
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f4f4" />
          <stop offset="1" stopColor="#8d8d8d" />
        </linearGradient>
        <linearGradient id={`${id}-cone`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9d9d9" />
          <stop offset="1" stopColor="#5c5c5c" />
        </linearGradient>
      </defs>
      {/* The magnet box and the flaring cone */}
      <rect x="1.5" y="5.5" width="4" height="5" fill={`url(#${id}-body)`} stroke="#3c3c3c" />
      <path d="M5.5 5.5 L10.5 1.5 V14.5 L5.5 10.5 Z" fill={`url(#${id}-cone)`} stroke="#3c3c3c" strokeLinejoin="round" />
      {muted ? (
        <g>
          <circle cx="11" cy="11" r="4" fill="#fff" stroke="#c4000f" strokeWidth="1.6" />
          <line x1="8.4" y1="13.6" x2="13.6" y2="8.4" stroke="#c4000f" strokeWidth="1.6" />
        </g>
      ) : (
        <g fill="none" stroke="#fff" strokeLinecap="round" opacity="0.95">
          <path d="M12 6 Q13.4 8 12 10" />
          <path d="M13.6 4.4 Q15.8 8 13.6 11.6" />
        </g>
      )}
    </svg>
  )
}

export default VolumeControl
