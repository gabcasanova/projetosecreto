import { useId } from 'react'

/*
 * Instagram's first icon (2010–2016), redrawn: a chunky instant camera with
 * a dark leather top carrying a rainbow stripe and a little viewfinder, a
 * beige lower half and a big glassy lens, all glossy and skeuomorphic.
 */
function RetroInstagramIcon({ size = 64 }) {
  const id = useId()
  const gradient = (name) => `url(#${id}-${name})`

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-beige`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e9d6" />
          <stop offset="1" stopColor="#cdb48d" />
        </linearGradient>
        <linearGradient id={`${id}-leather`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6e4b31" />
          <stop offset="1" stopColor="#3b2617" />
        </linearGradient>
        <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f4f4" />
          <stop offset="0.5" stopColor="#a9a9a9" />
          <stop offset="1" stopColor="#5d5d5d" />
        </linearGradient>
        <radialGradient id={`${id}-glass`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#4f6a86" />
          <stop offset="0.45" stopColor="#1b2938" />
          <stop offset="1" stopColor="#05080c" />
        </radialGradient>
        <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-body`}>
          <rect x="4" y="4" width="56" height="56" rx="12" />
        </clipPath>
      </defs>

      <g clipPath={gradient('body')}>
        {/* Leather top and beige bottom, split by a dark seam */}
        <rect x="4" y="4" width="56" height="24" fill={gradient('leather')} />
        <rect x="4" y="28" width="56" height="32" fill={gradient('beige')} />
        <rect x="4" y="27.5" width="56" height="1.5" fill="#2b1a0f" opacity="0.6" />

        {/* The rainbow stripe */}
        {['#e2453c', '#f3c33c', '#5cb85c', '#3b7fc4'].map((color, index) => (
          <rect key={color} x={10 + index * 3.2} y="4" width="3.2" height="23.5" fill={color} />
        ))}

        {/* The top half's shine */}
        <rect x="4" y="4" width="56" height="16" fill={gradient('gloss')} />
      </g>
      <rect x="4.5" y="4.5" width="55" height="55" rx="11.5" fill="none" stroke="#2b1a0f" strokeOpacity="0.8" />

      {/* Viewfinder */}
      <rect x="43" y="10" width="11" height="8" rx="2" fill={gradient('glass')} stroke="#1e130b" />
      <rect x="44.5" y="11" width="5" height="2.5" rx="1" fill="#fff" opacity="0.45" />

      {/* The lens: metal ring, dark glass, reflections */}
      <circle cx="32" cy="36" r="15" fill={gradient('ring')} stroke="#3a3a3a" strokeWidth="0.8" />
      <circle cx="32" cy="36" r="11.5" fill="#1a1a1a" />
      <circle cx="32" cy="36" r="10" fill={gradient('glass')} />
      <circle cx="32" cy="36" r="5" fill="none" stroke="#3f5a75" strokeOpacity="0.6" />
      <path d="M24.5 33 A8.5 8.5 0 0 1 32 27.5" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
      <circle cx="36.5" cy="40.5" r="1.4" fill="#fff" opacity="0.5" />
    </svg>
  )
}

export default RetroInstagramIcon
