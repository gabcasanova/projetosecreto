import { useId } from 'react'

/*
 * A big glossy "web 2.0" button under a band member's name that opens their
 * real Instagram in a new browser tab (outside the simulation, like the
 * streaming links in Discografia). `instagram` is the handle ("itsmarcxii"
 * or "@itsmarcxii") or a full profile URL.
 */
function InstagramButton({ instagram }) {
  const { url, handle } = instagramProfile(instagram)

  return (
    <a className="instabtn" href={url} target="_blank" rel="noopener noreferrer" title={`Abrir ${handle} no Instagram`}>
      <InstagramGlyph />
      <span className="instabtn-text">
        <span className="instabtn-label">Instagram</span>
        <span className="instabtn-handle">{handle}</span>
      </span>
    </a>
  )
}

// "itsmarcxii", "@itsmarcxii" or "https://www.instagram.com/itsmarcxii/" -> the URL and "@itsmarcxii"
function instagramProfile(instagram) {
  const text = instagram.trim()
  const fromUrl = text.match(/instagram\.com\/([^/?#]+)/i)
  const name = (fromUrl ? fromUrl[1] : text).replace(/^@/, '')
  return { url: fromUrl ? text : `https://www.instagram.com/${name}/`, handle: `@${name}` }
}

// A white camera outline (rounded square, lens, flash dot) in a glossy orb, drawn like the era's icons
function InstagramGlyph() {
  const id = useId()
  return (
    <svg className="instabtn-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-orb`} cx="35%" cy="100%" r="110%">
          <stop offset="0" stopColor="#fdd65c" />
          <stop offset="0.3" stopColor="#f77737" />
          <stop offset="0.6" stopColor="#e1306c" />
          <stop offset="1" stopColor="#833ab4" />
        </radialGradient>
        <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="23" height="23" rx="6" fill={`url(#${id}-orb)`} stroke="#7a1f5c" />
      <rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2.8" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="15.6" cy="8.4" r="0.9" fill="#fff" />
      {/* The top-half shine every 2000s button had */}
      <path d="M2 6.5 Q2 1.5 7 1.5 H17 Q22 1.5 22 6.5 V9 Q12 12 2 9 Z" fill={`url(#${id}-gloss)`} />
    </svg>
  )
}

export default InstagramButton
