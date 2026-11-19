import './retro-ads.css'

/*
 * Showing the old ads listed in ads.js: one at a time, or a column of them
 * down each side of a page. They don't lead anywhere.
 */

/** One ad, with the small "publicidade" label sites put over them */
export function RetroAd({ ad, className = '' }) {
  return (
    <div className={`retro-ad ${className}`} style={{ width: ad.width }}>
      <span className="retro-ad-label">publicidade</span>
      <img src={ad.src} alt="" width={ad.width} height={ad.height} draggable={false} />
    </div>
  )
}

/*
 * A page with a column of ads down each side, in the empty space left and
 * right of a fixed-width page. When the window is too narrow for them,
 * they simply don't show. `contentWidth` is the middle column's CSS width
 * (by default, whatever the page itself takes).
 */
export function WithSideAds({ left, right, contentWidth = 'auto', children }) {
  return (
    <div className="retro-ads-page" style={{ gridTemplateColumns: `minmax(0, 1fr) ${contentWidth} minmax(0, 1fr)` }}>
      <aside className="retro-ads-rail">
        {left.map((item) => (
          <RetroAd key={item.name} ad={item} />
        ))}
      </aside>
      <div className="retro-ads-content">{children}</div>
      <aside className="retro-ads-rail">
        {right.map((item) => (
          <RetroAd key={item.name} ad={item} />
        ))}
      </aside>
    </div>
  )
}
