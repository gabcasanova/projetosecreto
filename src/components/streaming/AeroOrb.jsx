import { useId } from 'react'

/*
 * The orb: a radial gradient body, a lighter glow pooling at the bottom
 * (light passing through the "glass"), the glyph, and a bright gloss
 * highlight over the top half.
 */
function AeroOrb({ light, dark, size = 22, children }) {
  // Gradient ids are global in the page, so every orb needs its own
  const id = useId()
  const body = `${id}-body`
  const glow = `${id}-glow`
  const gloss = `${id}-gloss`

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <radialGradient id={body} cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
        <radialGradient id={glow} cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor={light} stopOpacity="0.95" />
          <stop offset="100%" stopColor={light} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={gloss} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      <circle cx="16" cy="16" r="14.5" fill={`url(#${body})`} stroke={dark} strokeOpacity="0.7" />
      <ellipse cx="16" cy="25" rx="11" ry="6" fill={`url(#${glow})`} />
      <g fill="#fff" stroke="#fff" style={{ filter: 'drop-shadow(0 1px 0.6px rgb(0 0 0 / 0.35))' }}>
        {children}
      </g>
      <ellipse cx="16" cy="9.5" rx="10.5" ry="6.5" fill={`url(#${gloss})`} />
    </svg>
  )
}

export default AeroOrb
