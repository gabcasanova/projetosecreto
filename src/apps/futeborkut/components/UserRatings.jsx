import Link from './Link'
import coolEmpty from '../assets/cool-empty.svg'
import coolFull from '../assets/cool-full.svg'
import coolHalf from '../assets/cool-half.svg'
import iconPhotos from '../assets/icon-photos.svg'
import iconVideos from '../assets/icon-videos.svg'
import sexyEmpty from '../assets/sexy-empty.svg'
import sexyFull from '../assets/sexy-full.svg'
import sexyHalf from '../assets/sexy-half.svg'
import star from '../assets/star.svg'
import trustEmpty from '../assets/trust-empty.svg'
import trustFull from '../assets/trust-full.svg'
import trustHalf from '../assets/trust-half.svg'
import { photoCount } from '../data/database'
import { formatNumber } from '../format'
import { links } from '../links'

/*
 * The row of counters and ratings under a profile's name:
 * fotos, vídeos, fãs, then confiável / legal / sexy as three icons each.
 */

const RATINGS = [
  { key: 'trust', label: 'confiável', icons: { full: trustFull, half: trustHalf, empty: trustEmpty } },
  { key: 'cool', label: 'legal', icons: { full: coolFull, half: coolHalf, empty: coolEmpty } },
  { key: 'sexy', label: 'sexy', icons: { full: sexyFull, half: sexyHalf, empty: sexyEmpty } },
]

// A 0-3 rating (halves allowed) as three icons: full, half or empty
function iconStates(value) {
  return [0, 1, 2].map((index) => {
    if (value >= index + 1) return 'full'
    if (value >= index + 0.5) return 'half'
    return 'empty'
  })
}

function Counter({ label, icon, value, href }) {
  return (
    <div className="rating">
      <Link href={href}>
        <span className="label">{label}</span>
        <img src={icon} alt="" className="count-icon" />
        <span className="value">{formatNumber(value)}</span>
      </Link>
    </div>
  )
}

function UserRatings({ account }) {
  const { uid } = account
  return (
    <div className="userratings">
      <Counter label="fotos" icon={iconPhotos} value={photoCount(account)} href={links.albums(uid)} />
      <Counter label="vídeos" icon={iconVideos} value={account.videoCount} href={links.videos(uid)} />
      <Counter label="fãs" icon={star} value={account.fans.length} href={links.fans(uid)} />
      {RATINGS.map((rating) => {
        const value = account.ratings[rating.key] ?? 0
        return (
          <div key={rating.key} className="rating" title={`${rating.label}: ${Math.round((value / 3) * 100)}%`}>
            <span className="label">{rating.label}</span>
            {iconStates(value).map((state, index) => (
              <img key={index} src={rating.icons[state]} alt="" className="rate-icon" />
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default UserRatings
