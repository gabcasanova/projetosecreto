import { useId } from 'react'
import useClock from './useClock'

// The face is drawn on a 122px grid (Vista's size) and shown a little larger in the wider sidebar
const SIZE = 122
const DISPLAY_SIZE = 140
const CENTER = SIZE / 2
const NUMERAL_RADIUS = 38

/*
 * Vista's default Sidebar clock: a dark gunmetal bezel around a cream face
 * with all twelve numerals, dark tapered hands, a thin red second hand and
 * a glass highlight over the top.
 */
function ClockGadget() {
  const now = useClock()
  const id = useId()

  const seconds = now.getSeconds()
  const minutes = now.getMinutes() + seconds / 60
  const hours = (now.getHours() % 12) + minutes / 60
  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="clock-gadget">
      <svg width={DISPLAY_SIZE} height={DISPLAY_SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`São ${time}`}>
        <defs>
          <radialGradient id={`${id}-bezel`} cx="35%" cy="25%" r="80%">
            <stop offset="0" stopColor="#5b5a56" />
            <stop offset="0.45" stopColor="#2a2927" />
            <stop offset="1" stopColor="#1c1b1a" />
          </radialGradient>
          <linearGradient id={`${id}-face`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffdf4" />
            <stop offset="0.5" stopColor="#f7f5e6" />
            <stop offset="1" stopColor="#e6e3d3" />
          </linearGradient>
          <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <circle cx={CENTER} cy={CENTER} r={CENTER - 1} fill={`url(#${id}-bezel)`} />
        <circle cx={CENTER} cy={CENTER} r={51.5} fill="none" stroke="#a0a19b" strokeWidth="1.5" />
        <circle cx={CENTER} cy={CENTER} r={50.5} fill={`url(#${id}-face)`} />

        <Ticks />
        <Numerals />

        {/* Hour and minute hands taper from the hub; the second hand has a short tail */}
        <Hand angle={hours * 30} path="M -2.6 7 L -1.3 -26 L 1.3 -26 L 2.6 7 Z" />
        <Hand angle={minutes * 6} path="M -2.2 8 L -0.9 -40 L 0.9 -40 L 2.2 8 Z" />
        <g transform={`translate(${CENTER} ${CENTER}) rotate(${seconds * 6})`}>
          <line y1="11" y2="-44" stroke="#d40000" strokeWidth="1" />
        </g>
        <circle cx={CENTER} cy={CENTER} r="2.8" fill="#1a1a1a" />
        <circle cx={CENTER} cy={CENTER} r="1.2" fill="#d40000" />

        <ellipse cx={CENTER} cy={CENTER - 24} rx="40" ry="24" fill={`url(#${id}-glass)`} />
      </svg>
    </div>
  )
}

function Hand({ angle, path }) {
  return <path d={path} fill="#1a1a1a" transform={`translate(${CENTER} ${CENTER}) rotate(${angle})`} />
}

// 60 minute marks, longer and darker on the hours
function Ticks() {
  return Array.from({ length: 60 }, (_, index) => {
    const isHour = index % 5 === 0
    return (
      <line
        key={index}
        y1={-49}
        y2={isHour ? -43 : -46.5}
        stroke={isHour ? '#222' : '#777'}
        strokeWidth={isHour ? 1.6 : 0.8}
        transform={`translate(${CENTER} ${CENTER}) rotate(${index * 6})`}
      />
    )
  })
}

function Numerals() {
  return Array.from({ length: 12 }, (_, index) => {
    const hour = index + 1
    const angle = (hour * 30 * Math.PI) / 180
    return (
      <text
        key={hour}
        x={CENTER + NUMERAL_RADIUS * Math.sin(angle)}
        y={CENTER - NUMERAL_RADIUS * Math.cos(angle)}
        className="clock-numeral"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {hour}
      </text>
    )
  })
}

export default ClockGadget
