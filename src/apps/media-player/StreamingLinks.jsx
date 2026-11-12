import { useId } from 'react'

/*
 * The streaming services a release can link to, in the order they're shown.
 * `key` matches the name used in a release's info.json "links".
 * Each icon is a glossy Frutiger Aero orb in the service's colours with a
 * white glyph of its logo on top.
 */
const SERVICES = [
  { key: 'spotify', name: 'Spotify', light: '#5cf08e', dark: '#0b7a34', Glyph: SpotifyGlyph },
  { key: 'deezer', name: 'Deezer', light: '#d08bff', dark: '#5410a3', Glyph: DeezerGlyph },
  { key: 'youtubemusic', name: 'YouTube Music', light: '#ff7a7a', dark: '#a50000', Glyph: YouTubeMusicGlyph },
  { key: 'applemusic', name: 'Apple Music', light: '#ff8fa2', dark: '#c7102f', Glyph: AppleMusicGlyph },
]

// A list of the release's links, one service per row; nothing at all if it has none
function StreamingLinks({ links }) {
  const available = SERVICES.filter((service) => links?.[service.key])
  if (available.length === 0) return null

  return (
    <div className="wmp-streaming-links">
      <p className="wmp-streaming-links-title">Ouvir em</p>
      <ul>
        {available.map((service) => (
          <li key={service.key}>
            <a
              href={links[service.key]}
              target="_blank"
              rel="noopener noreferrer"
              className="wmp-streaming-link flex items-center gap-2 px-1"
              title={`Ouvir no ${service.name}`}
            >
              <span className="wmp-streaming-link-icon">
                <AeroOrb light={service.light} dark={service.dark}>
                  <service.Glyph />
                </AeroOrb>
              </span>
              {service.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/*
 * The orb: a radial gradient body, a lighter glow pooling at the bottom
 * (light passing through the "glass"), the glyph, and a bright gloss
 * highlight over the top half.
 */
function AeroOrb({ light, dark, children }) {
  // Gradient ids are global in the page, so every orb needs its own
  const id = useId()
  const body = `${id}-body`
  const glow = `${id}-glow`
  const gloss = `${id}-gloss`

  return (
    <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
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

// Three widening arcs
function SpotifyGlyph() {
  return (
    <g fill="none" strokeLinecap="round">
      <path d="M8.6 12.6C13 11.2 18.6 11.6 23.4 14.2" strokeWidth="2.4" />
      <path d="M9.4 16.7C13.2 15.6 17.6 16 21.5 18.1" strokeWidth="2" />
      <path d="M10.2 20.5C13.4 19.7 16.7 20 19.7 21.6" strokeWidth="1.6" />
    </g>
  )
}

// An equalizer of rising bars
function DeezerGlyph() {
  const bars = [4, 7, 10, 6, 12]
  return (
    <g stroke="none">
      {bars.map((height, index) => (
        <rect key={index} x={7.6 + index * 3.6} y={22.5 - height} width="2.6" height={height} rx="0.6" />
      ))}
    </g>
  )
}

// A play button inside a ring
function YouTubeMusicGlyph() {
  return (
    <>
      <circle cx="16" cy="16" r="7.4" fill="none" strokeWidth="1.8" />
      <path d="M14 12.6L19.6 16L14 19.4Z" stroke="none" />
    </>
  )
}

// A pair of beamed notes
function AppleMusicGlyph() {
  return (
    <g stroke="none">
      <path d="M12 21.2V11.4L21.6 9V19.4H20.2V12.4L13.4 14.1V21.2Z" />
      <ellipse cx="10.6" cy="21.4" rx="2.6" ry="2" transform="rotate(-18 10.6 21.4)" />
      <ellipse cx="18.8" cy="19.6" rx="2.6" ry="2" transform="rotate(-18 18.8 19.6)" />
    </g>
  )
}

export default StreamingLinks
