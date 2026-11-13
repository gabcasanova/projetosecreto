// White glyphs of the services' logos, drawn on a 32×32 AeroOrb

// Three widening arcs
export function SpotifyGlyph() {
  return (
    <g fill="none" strokeLinecap="round">
      <path d="M8.6 12.6C13 11.2 18.6 11.6 23.4 14.2" strokeWidth="2.4" />
      <path d="M9.4 16.7C13.2 15.6 17.6 16 21.5 18.1" strokeWidth="2" />
      <path d="M10.2 20.5C13.4 19.7 16.7 20 19.7 21.6" strokeWidth="1.6" />
    </g>
  )
}

// An equalizer of rising bars
export function DeezerGlyph() {
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
export function YouTubeMusicGlyph() {
  return (
    <>
      <circle cx="16" cy="16" r="7.4" fill="none" strokeWidth="1.8" />
      <path d="M14 12.6L19.6 16L14 19.4Z" stroke="none" />
    </>
  )
}

// A pair of beamed notes
export function AppleMusicGlyph() {
  return (
    <g stroke="none">
      <path d="M12 21.2V11.4L21.6 9V19.4H20.2V12.4L13.4 14.1V21.2Z" />
      <ellipse cx="10.6" cy="21.4" rx="2.6" ry="2" transform="rotate(-18 10.6 21.4)" />
      <ellipse cx="18.8" cy="19.6" rx="2.6" ry="2" transform="rotate(-18 18.8 19.6)" />
    </g>
  )
}
