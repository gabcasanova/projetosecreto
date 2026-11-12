import { useState } from 'react'
import Link from './Link'
import iconJoin from '../assets/icon-join.svg'
import iconMessages from '../assets/icon-messages.svg'
import iconPhotos from '../assets/icon-photos.svg'
import iconPoll from '../assets/icon-poll.svg'
import iconProfile from '../assets/icon-profile.svg'
import iconScraps from '../assets/icon-scraps.svg'
import iconSettings from '../assets/icon-settings.svg'
import iconTestimonials from '../assets/icon-testimonials.svg'
import iconUpdates from '../assets/icon-updates.svg'
import iconVideos from '../assets/icon-videos.svg'
import { VISITOR } from '../data/database'
import { formatNumber } from '../format'
import { links } from '../links'
import { CommunityImage, PersonPhoto } from './Photos'

/*
 * The left column: the person's photo and details, then the action links
 * and the links to their pages, each with its little icon.
 */

function LinkList({ items }) {
  return (
    <ul className="userbuttons">
      {items.map((item) => (
        // Links to pages the site doesn't have grey out their icon too
        <li key={item.label} className={item.href == null && !item.onClick ? 'dead' : undefined}>
          <span className="icon">{item.icon && <img src={item.icon} alt="" />}</span>
          {item.onClick ? (
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault()
                item.onClick()
              }}
            >
              {item.label}
            </a>
          ) : (
            <Link href={item.href}>{item.label}</Link>
          )}
        </li>
      ))}
    </ul>
  )
}

function Divider() {
  return <div className="userinfodivi" />
}

// "masculino, solteiro(a)" and "São Paulo, Brasil", skipping what the profile leaves empty
function detailLines(account) {
  if (!account) return []
  const first = [account.sex, account.social.relationship].filter(Boolean).join(', ')
  const second = [account.city, account.country].filter(Boolean).join(', ')
  return [first, second].filter(Boolean)
}

function sectionLinks(uid) {
  return [
    { label: 'perfil', icon: iconProfile, href: links.profile(uid) },
    { label: 'recados', icon: iconScraps, href: links.scrapbook(uid) },
    { label: 'fotos', icon: iconPhotos, href: links.albums(uid) },
    { label: 'vídeos', icon: iconVideos, href: links.videos(uid) },
    { label: 'depoimentos', icon: iconTestimonials, href: links.testimonials(uid) },
  ]
}

const MORE_ACTIONS = [
  'enviar mensagem',
  'enviar cantada',
  '+ favoritos',
  '+ paqueras',
  '+ gatos & gatas',
  'ignorar usuário',
  'denunciar abuso',
]

/** What can be done with the person shown: depends on whose card it is. */
function Actions({ person }) {
  const [showMore, setShowMore] = useState(false)

  if (person.account?.isVisitor) {
    return <LinkList items={[{ label: 'editar perfil', icon: iconTestimonials, href: links.editProfile }]} />
  }
  if (!person.account) {
    return <LinkList items={[{ label: 'adicionar como amigo', icon: iconProfile, href: links.addFriend(person.uid) }]} />
  }

  const items = [{ label: 'criar depoimento', icon: iconTestimonials, href: links.writeTestimonial(person.uid) }]
  if (showMore) {
    items.push(...MORE_ACTIONS.map((label) => ({ label, href: links.profileAction(person.uid) })))
    items.push({ label: '« menos', onClick: () => setShowMore(false) })
  } else {
    items.push({ label: 'mais »', onClick: () => setShowMore(true) })
  }
  return <LinkList items={items} />
}

/**
 * `home` is the visitor's own card on the home page, which also links to
 * messages and settings. `person` is anyone; profiles have `person.account`.
 */
function UserCard({ person, home = false }) {
  const account = person.account
  const lines = detailLines(account)
  const ownLinks = [
    { label: 'mensagens', icon: iconMessages, href: links.messages },
    { label: 'atualizações', icon: iconUpdates, href: links.updates(person.uid) },
    { label: 'configurações', icon: iconSettings, href: links.settings },
  ]

  return (
    <div className="module usercard">
      <div className="userimg">
        <Link href={links.profile(person.uid)}>
          <PersonPhoto person={person} />
        </Link>
      </div>
      <div className="userinfo">
        <div className="username">
          <Link href={links.profile(person.uid)}>{person.name}</Link>
        </div>
        {lines.length > 0 && (
          <div className="sml">
            {lines.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}
      </div>
      {!home && (
        <>
          <Divider />
          <Actions person={person} />
        </>
      )}
      <Divider />
      {home ? (
        <>
          <LinkList items={sectionLinks(person.uid)} />
          <Divider />
          <LinkList items={ownLinks} />
        </>
      ) : (
        <LinkList
          items={[...sectionLinks(person.uid), { label: 'atualizações', icon: iconUpdates, href: links.updates(person.uid) }]}
        />
      )}
    </div>
  )
}

/** The left column of community pages. */
export function CommunityCard({ community }) {
  const isMember = VISITOR.communities.includes(community)
  const items = [
    isMember
      ? { label: 'deixar comunidade', icon: iconJoin, href: links.leaveCommunity(community.cmm) }
      : { label: 'participar', icon: iconJoin, href: links.joinCommunity(community.cmm) },
    { label: 'fórum', icon: iconScraps, href: links.communityTopics(community.cmm) },
    { label: 'enquetes', icon: iconPoll, href: links.communityPolls(community.cmm) },
    { label: 'eventos', icon: iconUpdates, href: links.communityEvents(community.cmm) },
    { label: 'membros', icon: iconProfile, href: links.communityMembers(community.cmm) },
  ]

  return (
    <div className="module usercard">
      <div className="userimg">
        <Link href={links.community(community.cmm)}>
          <CommunityImage community={community} />
        </Link>
      </div>
      <div className="userinfo">
        <div className="username">
          <Link href={links.community(community.cmm)}>{community.name}</Link>
        </div>
        <div className="sml">({formatNumber(community.members)} membros)</div>
      </div>
      <Divider />
      <LinkList items={items} />
    </div>
  )
}

export default UserCard
