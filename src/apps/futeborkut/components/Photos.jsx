import noPhotoCommunity from '../assets/no-photo-community.svg'
import noPhoto from '../assets/no-photo.svg'

// Pictures fall back to orkut's grey silhouettes when there's none

export function PersonPhoto({ person }) {
  return <img src={person.photo ?? noPhoto} alt={person.name} title={person.name} />
}

export function CommunityImage({ community }) {
  return <img src={community.image ?? noPhotoCommunity} alt={community.name} title={community.name} />
}
