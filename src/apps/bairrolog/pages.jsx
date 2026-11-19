import bandLogo from '../../assets/futeboldebairroxp.png'
import { BAND_MEMBERS } from '../futeborkut/data/database'
import { FUTEBORKUT_URL } from '../futeborkut/links'
import BrowserLink from '../internet-explorer/BrowserLink'
import { links, POSTS, USERNAME, findPost } from './links'
import { SHOWS } from './shows'
import './bairrolog.css'

/*
 * Bairrolog's pages: one photo with its text and guestbook (PostPage), the
 * mosaic of every photo (MosaicPage) and the "not found" page. They share
 * Fotolog's frame: the header bar, the username, and the sidebar.
 */

// When the band "joined" Bairrolog: the day of its first show
const MEMBER_SINCE = SHOWS.at(-1)?.date ?? null
// How many of the latest photos the sidebar shows
const RECENT_COUNT = 9

/** /futeboldebairro/ and /futeboldebairro/<id>/: one photo */
export function PostPage({ url }) {
  const post = postFromUrl(url)
  if (!post) return <ErrorPage />

  const index = POSTS.indexOf(post)
  // The list runs newest first, so "older" is further down it
  const newer = POSTS[index - 1] ?? null
  const older = POSTS[index + 1] ?? null
  const { show } = post
  // The guestbook belongs to the show's first photo
  const comments = post.position === 1 ? show.comments : []

  return (
    <Frame>
      <article className="blog-post">
        <PostNavigation newer={newer} older={older} />
        <div className="blog-photo">
          <img src={post.photo.src} alt={`${show.title}, foto ${post.position}`} />
        </div>
        <PostNavigation newer={newer} older={older} />

        <h1 className="blog-title">{show.title}</h1>
        <p className="blog-meta">
          {show.place} · {longDate(show.date)} · foto {post.position} de {show.photos.length}
        </p>
        <p className="blog-desc">{show.desc}</p>

        <Guestbook comments={comments} />
      </article>
    </Frame>
  )
}

/** /futeboldebairro/mosaic/: every show's photos as small squares, newest first */
export function MosaicPage() {
  return (
    <Frame>
      <section className="blog-mosaic">
        <h1 className="blog-section-title">Mosaico</h1>
        {SHOWS.map((show) => (
          <div key={show.id} className="blog-mosaic-show">
            <h2>
              {show.title} <span>{shortDate(show.date)}</span>
            </h2>
            <div className="blog-mosaic-grid">
              {POSTS.filter((post) => post.show === show).map((post) => (
                <Thumbnail key={post.id} post={post} size={96} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </Frame>
  )
}

/** Any other address on bairrolog.com */
export function ErrorPage() {
  return (
    <Frame>
      <section className="blog-error">
        <h1 className="blog-section-title">Página não encontrada</h1>
        <p>A foto ou o fotolog que você procura não existe ou foi removido.</p>
        <p>
          <BrowserLink href={links.home}>Voltar para o fotolog de {USERNAME}</BrowserLink>
        </p>
      </section>
    </Frame>
  )
}

// "/futeboldebairro/31003001/" -> that post; "/futeboldebairro/" -> the newest
function postFromUrl(url) {
  const part = new URL(url).pathname.split('/').filter(Boolean)[1]
  return part ? findPost(part) : (POSTS[0] ?? null)
}

/*
 * Fotolog's page frame: the bar across the top with the logo and the site's
 * menu (only the band's own pages exist, so the rest is greyed out), the
 * username in big letters, then the page with the sidebar on the right.
 */
function Frame({ children }) {
  return (
    <div className="blog">
      <header className="blog-topbar">
        <BrowserLink href={links.home} className="blog-logo" title="Bairrolog">
          bairro<span>log</span>
        </BrowserLink>
        <nav className="blog-menu">
          <Dead>Página inicial</Dead>
          <Dead>Explorar</Dead>
          <Dead>Grupos</Dead>
          <Dead>Gold</Dead>
          <Dead>Entrar</Dead>
          <Dead>Cadastre-se</Dead>
        </nav>
      </header>

      <div className="blog-user">
        <BrowserLink href={links.home}>{USERNAME}</BrowserLink>
      </div>

      <div className="blog-columns">
        <main className="blog-main">{children}</main>
        <Sidebar />
      </div>

      <footer className="blog-footer">
        <Dead>Sobre o Bairrolog</Dead> · <Dead>Termos de uso</Dead> · <Dead>Privacidade</Dead> · <Dead>Ajuda</Dead>
        <br />© 2006 Bairrolog
      </footer>
    </div>
  )
}

function Sidebar() {
  const recent = POSTS.slice(0, RECENT_COUNT)

  return (
    <aside className="blog-side">
      <section className="blog-box blog-profile">
        <img src={bandLogo} alt="" className="blog-avatar" />
        <div>
          <b>{USERNAME}</b>
          <span className="blog-gold" title="Membro Gold">
            GOLD
          </span>
          <br />
          Futebol de Bairro
          <br />
          Rio de Janeiro, Brasil
        </div>
        <dl className="blog-stats">
          {MEMBER_SINCE && (
            <>
              <dt>membro desde</dt>
              <dd>{shortDate(MEMBER_SINCE)}</dd>
            </>
          )}
          <dt>fotos</dt>
          <dd>{POSTS.length}</dd>
          <dt>shows</dt>
          <dd>{SHOWS.length}</dd>
        </dl>
      </section>

      <section className="blog-box">
        <h3>Últimas fotos</h3>
        <div className="blog-thumbs">
          {recent.map((post) => (
            <Thumbnail key={post.id} post={post} size={56} />
          ))}
        </div>
        <BrowserLink href={links.mosaic} className="blog-more">
          ver mosaico completo »
        </BrowserLink>
      </section>

      <section className="blog-box">
        <h3>Shows</h3>
        <ul className="blog-archive">
          {SHOWS.map((show) => (
            <li key={show.id}>
              <BrowserLink href={links.post(POSTS.find((post) => post.show === show))}>{show.title}</BrowserLink>
              <span>{shortDate(show.date)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="blog-box">
        <h3>Amigos/Favoritos</h3>
        <div className="blog-friends">
          {BAND_MEMBERS.map((member) => (
            <BrowserLink
              key={member.uid}
              href={`${FUTEBORKUT_URL}Profile.aspx?uid=${member.uid}`}
              className="blog-friend"
              title={`Perfil de ${member.name} no futeborkut`}
            >
              {member.photo && <img src={member.photo} alt="" />}
              <span>{member.name.split(' ')[0].toLowerCase()}</span>
            </BrowserLink>
          ))}
        </div>
      </section>
    </aside>
  )
}

// « mais nova · mais antiga »: Fotolog's arrows between posts
function PostNavigation({ newer, older }) {
  return (
    <nav className="blog-nav">
      {newer ? <BrowserLink href={links.post(newer)}>« mais nova</BrowserLink> : <Dead>« mais nova</Dead>}
      <BrowserLink href={links.mosaic}>mosaico</BrowserLink>
      {older ? <BrowserLink href={links.post(older)}>mais antiga »</BrowserLink> : <Dead>mais antiga »</Dead>}
    </nav>
  )
}

/*
 * The guestbook under a photo. Signing it needs an account, which nobody
 * has here, so that link is greyed out.
 */
function Guestbook({ comments }) {
  return (
    <section className="blog-guestbook">
      <h2 className="blog-section-title">
        Livro de visitas <span>({comments.length})</span>
      </h2>
      {comments.length === 0 && <p className="blog-empty">Nenhum comentário nesta foto ainda.</p>}
      {comments.map((comment, index) => (
        <div key={index} className="blog-comment">
          <div className="blog-comment-head">
            <b>{comment.name}</b> {comment.date && <span>em {shortDate(comment.date)}</span>} disse:
          </div>
          <p>{comment.text}</p>
        </div>
      ))}
      <p className="blog-sign">
        <Dead>Assine o livro de visitas</Dead> (é preciso entrar no Bairrolog)
      </p>
    </section>
  )
}

function Thumbnail({ post, size }) {
  return (
    <BrowserLink href={links.post(post)} className="blog-thumb" title={`${post.show.title} (${post.position})`}>
      <img src={post.photo.src} alt="" width={size} height={size} loading="lazy" decoding="async" />
    </BrowserLink>
  )
}

// A link to a page Bairrolog doesn't have: grey and going nowhere
function Dead({ children }) {
  return (
    <span className="blog-dead" aria-disabled="true">
      {children}
    </span>
  )
}

// "sábado, 7 de novembro de 2026"
function longDate(date) {
  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

// "07/11/2026"
function shortDate(date) {
  return date.toLocaleDateString('pt-BR')
}
