import { useState } from 'react'
import Link from '../components/Link'
import iconDelete from '../assets/icon-delete.svg'
import iconReply from '../assets/icon-reply.svg'
import Layout from '../components/Layout'
import MessageItem from '../components/MessageItem'
import { Breadcrumb, TitleModule } from '../components/Module'
import Pager from '../components/Pager'
import ScrapForm from '../components/ScrapForm'
import { Nothing } from '../components/ThumbGrid'
import UserCard from '../components/UserCard'
import { personOfAccount } from '../data/database'
import { formatScrapDate } from '../format'
import { links, queryParam } from '../links'
import { paginate } from '../pagination'
import { useNow } from '../useNow'
import { useScrapbook } from '../useScrapbook'
import AccountGate from './AccountGate'

const SCRAPS_PER_PAGE = 10

/** Scrapbook.aspx?uid=...&pg=2: write scraps, read them ten at a time. */
function ScrapbookPage({ url, navigate }) {
  return (
    <AccountGate url={url} navigate={navigate}>
      {(account) => (
        <Scrapbook key={account.uid} account={account} page={queryParam(url, 'pg')} navigate={navigate} />
      )}
    </AccountGate>
  )
}

function Scrapbook({ account, page, navigate }) {
  const { scraps, addScrap, deleteScraps } = useScrapbook(account)
  const [selected, setSelected] = useState([])
  const isOwn = account.isVisitor
  const pages = paginate(scraps, page, SCRAPS_PER_PAGE)
  const now = useNow()

  function handlePost(text) {
    addScrap(text)
    // The new scrap is on the first page
    if (pages.page > 1) navigate(links.scrapbook(account.uid))
  }

  function handleDelete(ids) {
    deleteScraps(ids)
    setSelected((current) => current.filter((id) => !ids.includes(id)))
  }

  function toggleSelected(id) {
    setSelected((current) => (current.includes(id) ? current.filter((other) => other !== id) : [...current, id]))
  }

  const pager = (
    <Pager {...pages} hrefFor={(target) => links.scrapbook(account.uid, target)} />
  )

  return (
    <Layout navigate={navigate} left={<UserCard person={personOfAccount(account)} />}>
      <TitleModule
        title="Página de recados"
        breadcrumb={
          <Breadcrumb steps={[{ label: account.name, href: links.profile(account.uid) }, { label: 'página de recados' }]} />
        }
      >
        <div className="boxmidlrg">
          <ScrapForm onPost={handlePost} />
        </div>
      </TitleModule>

      <div className="module">
        <div className="boxmid">
          <div className="listheader">
            <span className="title">
              página de recados de {account.name} ({scraps.length})
            </span>
            {pager}
          </div>

          {scraps.length === 0 && <Nothing>nenhum recado ainda. Seja o primeiro a escrever!</Nothing>}
          {pages.items.map((scrap, index) => {
            // The visitor can delete what they wrote, and anything on their own scrapbook
            const canDelete = isOwn || scrap.from.account?.isVisitor
            const canReply = !scrap.from.account?.isVisitor
            return (
              <MessageItem
                key={scrap.id}
                message={scrap}
                index={index}
                date={formatScrapDate(scrap.date, now)}
                checkbox={
                  isOwn && (
                    <input
                      type="checkbox"
                      checked={selected.includes(scrap.id)}
                      onChange={() => toggleSelected(scrap.id)}
                      aria-label="selecionar recado"
                    />
                  )
                }
                actions={
                  <ScrapActions
                    replyHref={canReply ? links.scrapbook(scrap.from.uid) : null}
                    onDelete={canDelete ? () => handleDelete([scrap.id]) : null}
                  />
                }
              />
            )
          })}

          <div className="listfooter">
            {isOwn && scraps.length > 0 && (
              <button
                type="button"
                className="grabtn"
                disabled={selected.length === 0}
                onClick={() => handleDelete(selected)}
              >
                excluir recados selecionados
              </button>
            )}
            {pager}
          </div>
        </div>
      </div>
    </Layout>
  )
}

// "responder" and "excluir" after the date
function ScrapActions({ replyHref, onDelete }) {
  return (
    <>
      {replyHref && (
        <span className="action">
          <img src={iconReply} alt="" />
          <Link href={replyHref}>responder</Link>
        </span>
      )}
      {onDelete && (
        <span className="action">
          <img src={iconDelete} alt="" />
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault()
              onDelete()
            }}
          >
            excluir
          </a>
        </span>
      )}
    </>
  )
}

export default ScrapbookPage
