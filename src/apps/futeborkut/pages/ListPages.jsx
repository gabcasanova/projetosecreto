import Link from '../components/Link'
import Layout from '../components/Layout'
import MessageItem from '../components/MessageItem'
import { Breadcrumb, TitleModule } from '../components/Module'
import Pager from '../components/Pager'
import { CommunityImage, PersonPhoto } from '../components/Photos'
import { Nothing, PeopleGrid } from '../components/ThumbGrid'
import UserCard from '../components/UserCard'
import { friendsOf, personOfAccount } from '../data/database'
import { formatNumber, formatShortDate } from '../format'
import { links, queryParam } from '../links'
import { paginate } from '../pagination'
import AccountGate from './AccountGate'

/*
 * The "see all" pages of a profile: amigos, comunidades, depoimentos and fãs.
 * They share one frame: the person's card on the left and a big box titled
 * "amigos (12)" with the breadcrumb "Marcio > amigos".
 */
function ListFrame({ account, navigate, title, count, children }) {
  return (
    <Layout navigate={navigate} left={<UserCard person={personOfAccount(account)} />}>
      <TitleModule
        title={`${title} (${formatNumber(count)})`}
        breadcrumb={<Breadcrumb steps={[{ label: account.name, href: links.profile(account.uid) }, { label: title }]} />}
      >
        <div className="boxmidlrg fulllist">{children}</div>
      </TitleModule>
    </Layout>
  )
}

// A list header with the pager, as on orkut's long lists
function PagedHeader({ pages, hrefFor }) {
  return (
    <div className="listheader">
      <Pager {...pages} hrefFor={hrefFor} />
    </div>
  )
}

const FRIENDS_PER_PAGE = 20

/** FriendsList.aspx?uid=... */
export function FriendsPage({ url, navigate }) {
  return (
    <AccountGate url={url} navigate={navigate}>
      {(account) => {
        const pages = paginate(friendsOf(account), queryParam(url, 'pg'), FRIENDS_PER_PAGE)
        const hrefFor = (page) => `${links.friends(account.uid)}&pg=${page}`
        return (
          <ListFrame account={account} navigate={navigate} title="amigos" count={pages.total}>
            <PagedHeader pages={pages} hrefFor={hrefFor} />
            {pages.total === 0 && <Nothing />}
            {pages.items.map((person, index) => (
              <div key={person.uid} className={`listitem ${index % 2 === 0 ? 'listlight' : 'listdark'}`}>
                <div className="listimg">
                  <Link href={links.profile(person.uid)}>
                    <PersonPhoto person={person} />
                  </Link>
                </div>
                <div className="listtext">
                  <b>
                    <Link href={links.profile(person.uid)}>{person.name}</Link>
                  </b>{' '}
                  <span className="sml">({formatNumber(person.friendCount)})</span>
                  <div className="sml">{placeOf(person)}</div>
                  <div className="sml">
                    <Link href={links.scrapbook(person.uid)}>recados</Link> |{' '}
                    <Link href={links.albums(person.uid)}>fotos</Link> |{' '}
                    <Link href={links.videos(person.uid)}>vídeos</Link>
                  </div>
                </div>
              </div>
            ))}
          </ListFrame>
        )
      }}
    </AccountGate>
  )
}

// People without a profile are, like everyone in the band, from São Paulo
function placeOf(person) {
  const account = person.account
  if (!account) return 'São Paulo, Brasil'
  return [account.city, account.country].filter(Boolean).join(', ')
}

/** ProfileC.aspx?uid=...: the communities someone joined. */
export function CommunitiesPage({ url, navigate }) {
  return (
    <AccountGate url={url} navigate={navigate}>
      {(account) => (
        <ListFrame account={account} navigate={navigate} title="comunidades" count={account.communities.length}>
          <div className="sml listheader">categoria: todas</div>
          {account.communities.length === 0 && <Nothing />}
          {account.communities.map((community, index) => (
            <div key={community.cmm} className={`listitem ${index % 2 === 0 ? 'listlight' : 'listdark'}`}>
              <div className="listimg">
                <Link href={links.community(community.cmm)}>
                  <CommunityImage community={community} />
                </Link>
              </div>
              <div className="listtext">
                <b>
                  <Link href={links.community(community.cmm)}>{community.name}</Link>
                </b>{' '}
                ({formatNumber(community.members)} membros)
                <div className="sml">{community.category}</div>
              </div>
            </div>
          ))}
        </ListFrame>
      )}
    </AccountGate>
  )
}

/** ProfileT.aspx?uid=...: testimonials. */
export function TestimonialsPage({ url, navigate }) {
  return (
    <AccountGate url={url} navigate={navigate}>
      {(account) => (
        <ListFrame account={account} navigate={navigate} title="depoimentos" count={account.testimonials.length}>
          {account.testimonials.length === 0 && <Nothing>nenhum depoimento ainda</Nothing>}
          {account.testimonials.map((testimonial, index) => (
            <MessageItem key={testimonial.id} message={testimonial} index={index} date={formatShortDate(testimonial.date)} />
          ))}
          {!account.isVisitor && (
            <div className="listfooter">
              <Link href={links.writeTestimonial(account.uid)} className="grabtn">
                criar depoimento
              </Link>
            </div>
          )}
        </ListFrame>
      )}
    </AccountGate>
  )
}

/** ProfileF.aspx?uid=...: fans, each with a star. */
export function FansPage({ url, navigate }) {
  return (
    <AccountGate url={url} navigate={navigate}>
      {(account) => (
        <ListFrame account={account} navigate={navigate} title="fãs" count={account.fans.length}>
          {account.fans.length === 0 ? (
            <Nothing>nenhum fã ainda</Nothing>
          ) : (
            <PeopleGrid people={account.fans} fans perRow={6} className="fullgrid" />
          )}
        </ListFrame>
      )}
    </AccountGate>
  )
}
