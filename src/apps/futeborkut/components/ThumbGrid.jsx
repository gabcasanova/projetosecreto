import Link from './Link'
import star from '../assets/star.svg'
import { formatNumber } from '../format'
import { links } from '../links'
import Module from './Module'
import { CommunityImage, PersonPhoto } from './Photos'

/*
 * The thumbnail grids of the right column ("amigos (12)", "comunidades (25)")
 * and of the full lists. Each cell: picture, then "Name (count)".
 */
function ThumbGrid({ items, perRow, className }) {
  const rows = []
  for (let start = 0; start < items.length; start += perRow) rows.push(items.slice(start, start + perRow))

  return (
    <div className={className}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="gridrow">
          {row.map((item) => (
            <div key={item.key} className="thumbbox">
              <div className="thumb">
                <Link href={item.href}>{item.image}</Link>
              </div>
              <div className="uname">
                <Link href={item.href}>{item.name}</Link>
                {item.note}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/** People: "Ricardo (324)", or the name and a star for fans. */
export function PeopleGrid({ people, fans = false, perRow = 3, className = 'boxgrid' }) {
  const items = people.map((person) => ({
    key: person.uid,
    href: links.profile(person.uid),
    image: <PersonPhoto person={person} />,
    name: person.name,
    note: fans ? <img src={star} alt="fã" title="fã" className="star" /> : ` (${formatNumber(person.friendCount)})`,
  }))
  return <ThumbGrid items={items} perRow={perRow} className={className} />
}

/** Communities: "Eu odeio acordar cedo (6.245.118)". */
export function CommunityGrid({ communities, perRow = 3, className = 'boxgrid' }) {
  const items = communities.map((community) => ({
    key: community.cmm,
    href: links.community(community.cmm),
    image: <CommunityImage community={community} />,
    name: community.name,
    note: ` (${formatNumber(community.members)})`,
  }))
  return <ThumbGrid items={items} perRow={perRow} className={className} />
}

// The side boxes show at most 3 x 3
const MAX_IN_BOX = 9

/** The right column's "amigos (N)" box. */
export function FriendsBox({ account, friends }) {
  return (
    <Module
      title="amigos"
      count={friends.length}
      countHref={links.friends(account.uid)}
      footer={<Link href={links.friends(account.uid)}>ver todos</Link>}
    >
      {friends.length ? <PeopleGrid people={friends.slice(0, MAX_IN_BOX)} /> : <Nothing />}
    </Module>
  )
}

/** The right column's "comunidades (N)" box. */
export function CommunitiesBox({ account }) {
  const { communities } = account
  return (
    <Module
      title="comunidades"
      count={communities.length}
      countHref={links.communities(account.uid)}
      footer={<Link href={links.communities(account.uid)}>ver todas</Link>}
    >
      {communities.length ? <CommunityGrid communities={communities.slice(0, MAX_IN_BOX)} /> : <Nothing />}
    </Module>
  )
}

export function Nothing({ children = 'nenhum ainda' }) {
  return <div className="nothing">{children}</div>
}
