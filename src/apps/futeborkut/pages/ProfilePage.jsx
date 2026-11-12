import { useState } from 'react'
import Link from '../components/Link'
import Layout from '../components/Layout'
import MessageItem from '../components/MessageItem'
import Module, { Breadcrumb, TitleModule } from '../components/Module'
import RichText from '../components/RichText'
import { CommunitiesBox, FriendsBox } from '../components/ThumbGrid'
import UserCard from '../components/UserCard'
import UserRatings from '../components/UserRatings'
import { friendsOf, personOfAccount, VISITOR } from '../data/database'
import { PROFILE_TABS, SUMMARY_FIELD_COUNT } from '../data/fields'
import { ageFrom, formatBirthday, formatShortDate } from '../format'
import { links } from '../links'
import { useScrapCount } from '../useScrapbook'
import AccountGate from './AccountGate'

/** Profile.aspx?uid=...: the profile of a band member or the visitor. */
function ProfilePage({ url, navigate }) {
  return (
    <AccountGate url={url} navigate={navigate}>
      {(account) => <Profile key={account.uid} account={account} navigate={navigate} />}
    </AccountGate>
  )
}

function Profile({ account, navigate }) {
  const friends = friendsOf(account)
  const isOwn = account.isVisitor
  // On someone else's profile, the path shows how the visitor knows them
  const steps = isOwn ? [{ label: account.name }] : [{ label: VISITOR.name, href: links.profile(VISITOR.uid) }, { label: account.name }]

  return (
    <Layout
      navigate={navigate}
      left={<UserCard person={personOfAccount(account)} />}
      right={
        <>
          <FriendsBox account={account} friends={friends} />
          <CommunitiesBox account={account} />
        </>
      }
    >
      <TitleModule
        title={account.name}
        aside={account.status && <span className="statusmsg">{account.status}</span>}
        breadcrumb={<Breadcrumb steps={steps} />}
      >
        <div className="boxmidlrg">
          <ProfileRatings account={account} />
          <ProfileTabs account={account} />
        </div>
      </TitleModule>
      <TestimonialsBox account={account} />
    </Layout>
  )
}

// Its own component so the scrap counter can read the visitor's saved scraps
function ProfileRatings({ account }) {
  return <UserRatings account={account} scrapCount={useScrapCount(account)} />
}

// The value shown for a field, or null when the profile leaves it empty
function fieldValue(account, tabKey, fieldKey) {
  const section = account[tabKey]
  const birthday = account.social.birthday
  if (fieldKey === 'birthday') return birthday ? formatBirthday(birthday) : null
  if (fieldKey === 'age') return birthday ? String(ageFrom(birthday)) : null

  const value = section[fieldKey]
  if (!value) return null
  if (fieldKey === 'webPage') return <Link href={value}>{value}</Link>
  return <RichText text={value} />
}

function ProfileTabs({ account }) {
  const [tabKey, setTabKey] = useState('social')
  const [showAll, setShowAll] = useState(false)
  const tab = PROFILE_TABS.find((candidate) => candidate.key === tabKey)

  const rows = tab.fields
    .map(([key, label]) => ({ key, label, value: fieldValue(account, tabKey, key) }))
    .filter((row) => row.value)
  // The social tab starts as a summary; "ver perfil inteiro" shows the rest
  const isSummary = tabKey === 'social' && !showAll && rows.length > SUMMARY_FIELD_COUNT
  const visibleRows = isSummary ? rows.slice(0, SUMMARY_FIELD_COUNT) : rows

  return (
    <>
      <ul className="tabs">
        {PROFILE_TABS.map((candidate) => (
          <li key={candidate.key} className={candidate.key === tabKey ? 'selected' : ''}>
            <button type="button" onClick={() => setTabKey(candidate.key)}>
              {candidate.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="tabdivi" />

      {visibleRows.length === 0 && <div className="nothing">nada preenchido ainda</div>}
      {visibleRows.map((row, index) => (
        <div key={row.key} className={`listrow ${index % 2 === 0 ? 'listdark' : 'listlight'}`}>
          <div className="listfl">{row.label}</div>
          <div className="listp">{row.value}</div>
        </div>
      ))}

      <ProfileFooter account={account} isSummary={isSummary} onShowAll={() => setShowAll(true)} />
    </>
  )
}

// "editar perfil" on your own profile, "ver perfil inteiro" on a summary
function ProfileFooter({ account, isSummary, onShowAll }) {
  let link = null
  if (account.isVisitor) {
    link = <Link href={links.editProfile}>editar perfil</Link>
  } else if (isSummary) {
    link = (
      <a
        href="#"
        onClick={(event) => {
          event.preventDefault()
          onShowAll()
        }}
      >
        ver perfil inteiro
      </a>
    )
  }
  if (!link) return null

  return (
    <>
      <div className="listdivi" />
      <div className="parabtns">{link}</div>
    </>
  )
}

const TESTIMONIALS_ON_PROFILE = 3

function TestimonialsBox({ account }) {
  const { testimonials } = account
  if (!testimonials.length) return null

  return (
    <Module
      title="depoimentos"
      count={testimonials.length}
      countHref={links.testimonials(account.uid)}
      footer={<Link href={links.testimonials(account.uid)}>ver todos</Link>}
    >
      {testimonials.slice(0, TESTIMONIALS_ON_PROFILE).map((testimonial, index) => (
        <MessageItem
          key={testimonial.id}
          message={testimonial}
          index={index}
          date={formatShortDate(testimonial.date)}
          small
        />
      ))}
    </Module>
  )
}

export default ProfilePage
