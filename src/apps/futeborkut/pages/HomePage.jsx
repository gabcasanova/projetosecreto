import { useState } from 'react'
import Link from '../components/Link'
import iconBirthday from '../assets/icon-birthday.svg'
import Layout from '../components/Layout'
import Module, { TitleModule } from '../components/Module'
import { PersonPhoto } from '../components/Photos'
import { CommunitiesBox, FriendsBox, Nothing } from '../components/ThumbGrid'
import UserCard from '../components/UserCard'
import UserRatings from '../components/UserRatings'
import { BAND_MEMBERS, personOfAccount, VISITOR } from '../data/database'
import { FORTUNES } from '../data/fortunes'
import { daysUntilBirthday, formatBirthdayShort, formatShortDate } from '../format'
import { links } from '../links'
import { useNow } from '../useNow'

/** Home.aspx: the visitor's "Página inicial". */
function HomePage({ navigate }) {
  const visitor = personOfAccount(VISITOR)
  // A new fortune each time the page loads
  const [fortune] = useState(() => FORTUNES[Math.floor(Math.random() * FORTUNES.length)])

  return (
    <Layout
      navigate={navigate}
      left={<UserCard person={visitor} home />}
      right={
        <>
          <FriendsBox account={VISITOR} />
          <CommunitiesBox account={VISITOR} />
        </>
      }
    >
      <TitleModule title={`Bem-vindo(a), ${VISITOR.name}`}>
        <div className="fortune">
          <b>Sorte de hoje:</b> {fortune}
        </div>
        <div className="boxmidlrg">
          <UserRatings account={VISITOR} />
        </div>
      </TitleModule>
      <FriendUpdates />
      <RecentVisitors />
      <Birthdays />
    </Layout>
  )
}

const UPDATES_SHOWN = 6

// What the band members have been up to, newest first
function FriendUpdates() {
  const updates = BAND_MEMBERS.flatMap((account) =>
    account.updates.map((update) => ({ ...update, person: personOfAccount(account) })),
  ).sort((a, b) => b.date - a.date)

  return (
    <Module title="atualizações dos amigos" footer={<Link href={links.updates(VISITOR.uid)}>ver mais</Link>}>
      {updates.length === 0 && <Nothing>nenhuma atualização</Nothing>}
      {updates.slice(0, UPDATES_SHOWN).map((update, index) => (
        <div key={index} className={`listitem small ${index % 2 === 0 ? 'listlight' : 'listdark'}`}>
          <div className="listimg small">
            <Link href={links.profile(update.person.uid)}>
              <PersonPhoto person={update.person} />
            </Link>
          </div>
          <div className="listtext">
            <b>
              <Link href={links.profile(update.person.uid)}>{update.person.name}</Link>
            </b>{' '}
            {update.text}
            <div className="dte">{formatShortDate(update.date)}</div>
          </div>
        </div>
      ))}
    </Module>
  )
}

const VISITORS_SHOWN = 10

// The band members and their fans, as if they had all dropped by
function RecentVisitors() {
  const people = new Map()
  for (const account of BAND_MEMBERS) {
    people.set(account.uid, personOfAccount(account))
    for (const fan of account.fans) people.set(fan.uid, fan)
  }
  const visitors = [...people.values()].slice(0, VISITORS_SHOWN)

  return (
    <Module title="visitantes recentes">
      {visitors.length === 0 && <Nothing>nenhum visitante ainda</Nothing>}
      <div className="visitors">
        {visitors.map((person) => (
          <div key={person.uid} className="visitor">
            <Link href={links.profile(person.uid)}>
              <PersonPhoto person={person} />
            </Link>
            <Link href={links.profile(person.uid)}>{person.name}</Link>
          </div>
        ))}
      </div>
    </Module>
  )
}

function Birthdays() {
  const now = useNow()
  const upcoming = BAND_MEMBERS.filter((account) => account.social.birthday)
    .map((account) => ({ account, days: daysUntilBirthday(account.social.birthday, now) }))
    .sort((a, b) => a.days - b.days)
  const today = upcoming.filter((entry) => entry.days === 0)
  const next = upcoming.filter((entry) => entry.days > 0).slice(0, 5)

  return (
    <Module title="aniversários">
      <div className="birthday">
        {today.map(({ account }) => (
          <div key={account.uid}>
            <img src={iconBirthday} alt="" />
            Hoje é aniversário de{' '}
            <b>
              <Link href={links.profile(account.uid)}>{account.name}</Link>
            </b>
            !
          </div>
        ))}
        {next.length > 0 && (
          <div>
            <img src={iconBirthday} alt="" />
            próximos:{' '}
            {next.map(({ account }, index) => (
              <span key={account.uid}>
                {index > 0 && ', '}
                <Link href={links.profile(account.uid)}>{account.name}</Link> (
                {formatBirthdayShort(account.social.birthday)})
              </span>
            ))}
          </div>
        )}
        {upcoming.length === 0 && <span className="sml">nenhum aniversário próximo</span>}
      </div>
    </Module>
  )
}

export default HomePage
