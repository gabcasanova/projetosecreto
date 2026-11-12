import Link from '../components/Link'
import Layout from '../components/Layout'
import MessageItem from '../components/MessageItem'
import Module, { Breadcrumb, TitleModule } from '../components/Module'
import RichText from '../components/RichText'
import { CommunityGrid, Nothing, PeopleGrid } from '../components/ThumbGrid'
import { CommunityCard } from '../components/UserCard'
import { getCommunity, membersOf, VISITOR } from '../data/database'
import { formatForumDate, formatLongDate, formatNumber, formatScrapDate } from '../format'
import { links, queryParam } from '../links'
import { useNow } from '../useNow'
import ErrorPage from './ErrorPage'

/*
 * Community.aspx?cmm=... and its forum and members pages. Unknown
 * communities (and topics) get orkut's error page.
 */

// `after` holds the boxes under the main one
function CommunityFrame({ community, navigate, right, title, steps, after, children }) {
  return (
    <Layout navigate={navigate} left={<CommunityCard community={community} />} right={right}>
      <TitleModule
        title={title ?? community.name}
        breadcrumb={
          <Breadcrumb
            steps={[
              { label: 'Início', href: links.home },
              { label: 'Comunidades', href: links.communities(VISITOR.uid) },
              { label: community.category },
              ...(steps ?? [{ label: community.name }]),
            ]}
          />
        }
      >
        {children}
      </TitleModule>
      {after}
    </Layout>
  )
}

function communityFromUrl(url) {
  return getCommunity(queryParam(url, 'cmm'))
}

// ---------- The community's main page ----------

// The info list; fields the community doesn't have are left out
function infoRows(community) {
  const owner = community.owner
  const moderators = community.moderators.map((person, index) => (
    <span key={person.uid}>
      {index > 0 && ', '}
      <Link href={links.profile(person.uid)}>{person.name}</Link>
    </span>
  ))
  const rows = [
    { label: 'descrição:', value: community.description && <RichText text={community.description} /> },
    { label: 'idioma:', value: community.language ?? 'Português' },
    { label: 'categoria:', value: community.category },
    { label: 'dono:', value: owner && <Link href={links.profile(owner.uid)}>{owner.name}</Link> },
    { label: 'moderadores:', value: moderators.length > 0 && moderators },
    { label: 'tipo:', value: community.type ?? 'pública' },
    { label: 'privacidade do conteúdo:', value: community.contentPrivacy ?? 'aberto para não-membros' },
    { label: 'fórum:', value: community.forumType ?? 'não-anônimo' },
    { label: 'local:', value: community.location ?? 'Brasil' },
    { label: 'criado em:', value: community.created && formatLongDate(new Date(community.created)) },
    { label: 'membros:', value: formatNumber(community.members) },
  ]
  return rows.filter((row) => row.value)
}

export function CommunityPage({ url, navigate }) {
  const community = communityFromUrl(url)
  if (!community) return <ErrorPage navigate={navigate} />
  const members = membersOf(community)

  return (
    <CommunityFrame
      community={community}
      navigate={navigate}
      right={
        <>
          <Module
            title="membros"
            count={formatNumber(community.members)}
            countHref={links.communityMembers(community.cmm)}
            footer={<Link href={links.communityMembers(community.cmm)}>ver todos</Link>}
          >
            <PeopleGrid people={members.slice(0, 9)} />
          </Module>
          {community.related.length > 0 && (
            <Module title="comunidades relacionadas">
              <CommunityGrid communities={community.related} />
            </Module>
          )}
        </>
      }
      after={
        <>
          <ForumBox community={community} />
          {community.polls.length > 0 && <PollsBox community={community} />}
          <Module title="eventos">
            <Nothing>nenhum evento próximo</Nothing>
          </Module>
        </>
      }
    >
      <div className="boxmidlrg">
        {infoRows(community).map(({ label, value }, index) => (
          <div key={label} className={`listrow ${index % 2 === 0 ? 'listdark' : 'listlight'}`}>
            <div className="listfl">{label}</div>
            <div className="listp">{value}</div>
          </div>
        ))}
      </div>
    </CommunityFrame>
  )
}

const TOPICS_ON_PAGE = 5

function ForumTable({ community, topics }) {
  if (topics.length === 0) return <Nothing>nenhum tópico ainda</Nothing>
  return (
    <table className="forum">
      <thead>
        <tr>
          <th>tópico</th>
          <th className="num">postagens</th>
          <th className="last">último post</th>
        </tr>
      </thead>
      <tbody>
        {topics.map((topic, index) => (
          <tr key={topic.tid} className={index % 2 === 0 ? 'listdark' : 'listlight'}>
            <td>
              <Link href={links.communityTopic(community.cmm, topic.tid)}>{topic.title}</Link>
            </td>
            <td className="num">{topic.messages.length}</td>
            <td className="last dte">{topic.lastPost && formatForumDate(topic.lastPost)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// Most recently active topics first, as orkut listed them
function topicsByActivity(community) {
  return [...community.topics].sort((a, b) => (b.lastPost ?? 0) - (a.lastPost ?? 0))
}

function ForumBox({ community }) {
  return (
    <Module
      title="fórum"
      footer={
        <>
          <Link href={links.communityTopics(community.cmm)}>ver todos os tópicos</Link>{' '}
          <Link href={links.newTopic(community.cmm)} className="grabtn">
            novo tópico
          </Link>
        </>
      }
    >
      <ForumTable community={community} topics={topicsByActivity(community).slice(0, TOPICS_ON_PAGE)} />
    </Module>
  )
}

function PollsBox({ community }) {
  return (
    <Module title="enquetes">
      {community.polls.map((poll) => {
        const total = poll.options.reduce((sum, option) => sum + option.votes, 0)
        return (
          <div key={poll.question} className="poll">
            <div className="question">{poll.question}</div>
            <table>
              <tbody>
                {poll.options.map((option) => {
                  const percent = total ? Math.round((option.votes / total) * 100) : 0
                  return (
                    <tr key={option.text}>
                      <td>{option.text}</td>
                      <td>
                        <div className="percentbar">
                          <div style={{ width: `${percent}%` }} />
                        </div>
                      </td>
                      <td>
                        {percent}% ({formatNumber(option.votes)})
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      })}
    </Module>
  )
}

// ---------- Forum pages ----------

/** CommTopics.aspx?cmm=...: every topic. */
export function CommunityTopicsPage({ url, navigate }) {
  const community = communityFromUrl(url)
  if (!community) return <ErrorPage navigate={navigate} />

  return (
    <CommunityFrame
      community={community}
      navigate={navigate}
      title="fórum"
      steps={[{ label: community.name, href: links.community(community.cmm) }, { label: 'fórum' }]}
    >
      <div className="boxmidlrg">
        <ForumTable community={community} topics={topicsByActivity(community)} />
        <div className="listfooter">
          <Link href={links.newTopic(community.cmm)} className="grabtn">
            novo tópico
          </Link>
        </div>
      </div>
    </CommunityFrame>
  )
}

/** CommMsgs.aspx?cmm=...&tid=...: one topic's posts, oldest first. */
export function CommunityTopicPage({ url, navigate }) {
  const now = useNow()
  const community = communityFromUrl(url)
  const topic = community?.topics.find((candidate) => candidate.tid === queryParam(url, 'tid'))
  if (!topic) return <ErrorPage navigate={navigate} />

  return (
    <CommunityFrame
      community={community}
      navigate={navigate}
      title={topic.title}
      steps={[
        { label: community.name, href: links.community(community.cmm) },
        { label: 'fórum', href: links.communityTopics(community.cmm) },
        { label: topic.title },
      ]}
    >
      <div className="boxmidlrg">
        <div className="listheader sml">
          mostrando 1-{topic.messages.length} de {topic.messages.length}
        </div>
        {topic.messages.map((message, index) => (
          <MessageItem key={message.id} message={message} index={index} date={formatScrapDate(message.date, now)} />
        ))}
        <div className="listfooter">
          <Link href={links.newTopic(community.cmm)} className="grabtn">
            responder
          </Link>{' '}
          <Link href={links.communityTopics(community.cmm)}>voltar para o fórum</Link>
        </div>
      </div>
    </CommunityFrame>
  )
}

/** CommMembers.aspx?cmm=...: the members we know of. */
export function CommunityMembersPage({ url, navigate }) {
  const community = communityFromUrl(url)
  if (!community) return <ErrorPage navigate={navigate} />
  const members = membersOf(community)

  return (
    <CommunityFrame
      community={community}
      navigate={navigate}
      title={`membros (${formatNumber(community.members)})`}
      steps={[{ label: community.name, href: links.community(community.cmm) }, { label: 'membros' }]}
    >
      <div className="boxmidlrg">
        {members.length === 0 ? <Nothing /> : <PeopleGrid people={members} perRow={5} className="fullgrid" />}
      </div>
    </CommunityFrame>
  )
}
