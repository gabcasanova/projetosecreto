import { ADS } from '../../components/retro-ads/ads'
import { RetroAd, WithSideAds } from '../../components/retro-ads/RetroAds'
import { INSTAGRAM, MUSIC_SERVICES } from '../../components/sidebar/externalLinks'
import { BAND_MEMBERS } from '../futeborkut/data/database'
import { FUTEBORKUT_URL } from '../futeborkut/links'
import BrowserLink from '../internet-explorer/BrowserLink'
import { links, POSTS, USERNAME, findPost } from './links'
import { SHOWS } from './shows'
import './bairrolog.css'

/*
 * Bairrolog's pages, laid out like a member's page on Fotolog in 2008
 * (rebuilt from archived captures): the search strip and menu across the
 * top, the member's title, then three columns on a photo's page (recent
 * photos, the photo with its guestbook, friends and links). The mosaic
 * of every photo is the front page.
 */

const TITLE = 'Futebol de Bairro'
const SUBTITLE = 'galeria de shows do futebol de bairro'
// How many of the neighbouring photos the left column shows, like Fotolog's "Fotos Recentes"
const RECENT_COUNT = 6
// The 2000s ads in the margins either side of the page
const LEFT_ADS = [ADS.emoticons, ADS.icq]
const RIGHT_ADS = [ADS.vanillaCoke, ADS.livrariaCultura]

/** /futeboldebairro/ and /futeboldebairro/mosaic/: every show's photos as squares, newest first */
export function MosaicPage() {
  return (
    <Frame>
      <div className="blog-mosaic">
        {SHOWS.map((show) => (
          <section key={show.id} className="blog-mosaic-show">
            <h3>
              {show.title}
              <span>
                {show.place} · {shortDate(show.date)} · {photosLabel(show.photos.length)}
              </span>
            </h3>
            <div className="blog-mosaic-grid">
              {POSTS.filter((post) => post.show === show).map((post) => (
                <BrowserLink key={post.id} href={links.post(post)} className="blog-thumb" title={post.show.title}>
                  <img src={post.photo.thumb} alt="" width={100} height={100} loading="lazy" decoding="async" />
                </BrowserLink>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Frame>
  )
}

/** /futeboldebairro/<id>/: one photo */
export function PostPage({ url }) {
  const post = findPost(new URL(url).pathname.split('/').filter(Boolean)[1])
  if (!post) return <ErrorPage />

  const index = POSTS.indexOf(post)
  // The list runs newest first: "Anterior" goes back to the newer one, "Próxima" on to the older
  const previous = POSTS[index - 1] ?? null
  const next = POSTS[index + 1] ?? null
  const { show } = post
  // The guestbook belongs to the show's first photo
  const comments = post.position === 1 ? show.comments : []

  return (
    <Frame>
      <div className="blog-wrapper">
        <RecentPhotos current={post} />

        <main className="blog-center">
          <div className="blog-mainphoto">
            <PhotoNavigation previous={previous} next={next} />
            <img src={post.photo.src} alt={`${show.title}, foto ${post.position}`} />
            <ul className="blog-phototools">
              <li>{shortDate(show.date)}</li>
              <li>Câmera: Não especificada</li>
            </ul>
            <ul className="blog-phototools">
              <li>
                <Dead>Enviar esta foto por e-mail</Dead>
              </li>
              <li>
                <BrowserLink href={links.post(post)}>Permalink</BrowserLink>
              </li>
            </ul>
          </div>

          <div className="blog-description">
            <h1>{show.title}</h1>
            <p className="blog-where">
              {show.place} · foto {post.position} de {show.photos.length}
            </p>
            <p>{show.desc}</p>
          </div>

          <Guestbook comments={comments} />
          <PhotoNavigation previous={previous} next={next} />
        </main>

        <aside className="blog-col blog-right">
          <h3>Amigos/Favoritos</h3>
          <div className="blog-sidethumbs">
            {BAND_MEMBERS.map((member) => (
              <div key={member.uid} className="blog-friend">
                <BrowserLink href={`${FUTEBORKUT_URL}Profile.aspx?uid=${member.uid}`} title={`${member.name} no futeborkut`}>
                  {member.photo && <img src={member.photo} alt="" width={100} height={100} />}
                </BrowserLink>
                <div className="blog-friend-name">{member.name.split(' ')[0].toLowerCase()}</div>
                <div>Rio de Janeiro, Brasil</div>
              </div>
            ))}
          </div>
          <div className="blog-divider" />

          <h3>Grupos Favoritos</h3>
          <p className="blog-note">{USERNAME} ainda não adicionou nenhum grupo.</p>
          <div className="blog-divider" />

          <h3>Links</h3>
          <ul className="blog-links">
            <ExternalLink href={INSTAGRAM.url}>Instagram</ExternalLink>
            <ExternalLink href={MUSIC_SERVICES.spotify}>Spotify</ExternalLink>
            <ExternalLink href={MUSIC_SERVICES.deezer}>Deezer</ExternalLink>
            <ExternalLink href={MUSIC_SERVICES.youtubemusic}>YouTube Music</ExternalLink>
            <ExternalLink href={MUSIC_SERVICES.applemusic}>Apple Music</ExternalLink>
          </ul>
        </aside>
      </div>
    </Frame>
  )
}

/** Any other address on bairrolog.com */
export function ErrorPage() {
  return (
    <Frame>
      <div className="blog-error">
        <h1>Página não encontrada</h1>
        <p>A foto ou o fotolog que você procura não existe ou foi removido.</p>
        <p>
          <BrowserLink href={links.home}>Voltar para {TITLE}</BrowserLink>
        </p>
      </div>
    </Frame>
  )
}

/*
 * Every page's frame: the search strip and the site menu (only the band's
 * own pages exist, so the rest is greyed out), the logo, the member's title
 * with its subtitle and place, the page itself, and the footer.
 */
function Frame({ children }) {
  return (
    <div className="blog">
      <WithSideAds left={LEFT_ADS} right={RIGHT_ADS}>
      <div className="blog-page">
        <div className="blog-hat">
          <div className="blog-search">
            <label>
              <input type="radio" name="blog-search" defaultChecked disabled /> Bairrolog
            </label>
            <label>
              <input type="radio" name="blog-search" disabled /> Web
            </label>
            <input type="text" disabled aria-label="Pesquisar" />
            <span className="blog-button blog-dead">Pesquisar</span>
          </div>
          <div className="blog-account">
            <Dead>Entre</Dead> | <Dead>Seja um membro!</Dead> | <Dead>Ajuda</Dead>
            <div className="blog-languages">
              <Dead>Deutsch</Dead> <Dead>English</Dead> <Dead>Español</Dead> <Dead>Français</Dead> <b>Português</b>{' '}
              <Dead>Svenska</Dead>
            </div>
          </div>
        </div>

        <div className="blog-header">
          <BrowserLink href={links.home} className="blog-logo" title="Bairrolog">
            <span className="blog-logo-square" />
            BAIRROLOG<sup>™</sup>
          </BrowserLink>
          {/* Fotolog's banner ad, beside the logo */}
          <RetroAd ad={ADS.msnCeline} />
        </div>

        <nav className="blog-homenav">
          <span>
            <Dead>Seja um membro!</Dead> » <Dead>Crie sua página</Dead> <Dead>Faça um tour</Dead>
          </span>
          <span>
            <Dead>Descubra</Dead> » <Dead>Votação</Dead> <Dead>Grupos</Dead> <Dead>Membros</Dead> <Dead>Gold Camera</Dead>{' '}
            <Dead>Classificados</Dead>
          </span>
        </nav>

        <div className="blog-title">
          <h2>
            <BrowserLink href={links.home}>{TITLE}</BrowserLink>
          </h2>
          <p className="blog-subtitle">{SUBTITLE}</p>
          <p className="blog-geo">
            <Dead>Sobre {USERNAME}</Dead> · Rio de Janeiro, RJ, Brasil
          </p>
        </div>

        {children}

        <footer className="blog-footer">
          <ul>
            {['Quem somos', 'Dúvidas', 'Política de Privacidade', 'Termos de Uso', 'Regras da Comunidade', 'Imprensa', 'Anunciantes', 'Contato'].map(
              (label) => (
                <li key={label}>
                  <Dead>{label}</Dead>
                </li>
              ),
            )}
          </ul>
          <p>© 2002-2008 Bairrolog, Inc. Bairrolog ® é uma marca registrada de Bairrolog, Inc.</p>
        </footer>
      </div>
      </WithSideAds>
    </div>
  )
}

// The left column: thumbnails of the photos around this one, with their dates; » marks the one open
function RecentPhotos({ current }) {
  const index = POSTS.indexOf(current)
  const start = Math.max(0, Math.min(index - Math.floor(RECENT_COUNT / 2), POSTS.length - RECENT_COUNT))
  const nearby = POSTS.slice(start, start + RECENT_COUNT)

  return (
    <aside className="blog-col blog-left">
      <h3>
        Fotos Recentes
        <br />
        de {USERNAME}
      </h3>
      <ul className="blog-recent">
        {nearby.map((post) => (
          <li key={post.id} className={post === current ? 'selected' : ''}>
            <BrowserLink href={links.post(post)} className="blog-thumb">
              <img src={post.photo.thumb} alt="" width={100} height={100} loading="lazy" decoding="async" />
            </BrowserLink>
            <p>
              {shortDate(post.show.date)}
              {post === current && ' »'}
            </p>
          </li>
        ))}
      </ul>
      <p className="blog-more">
        <BrowserLink href={links.mosaic}>Mais</BrowserLink>
      </p>
      <div className="blog-divider" />
      <p className="blog-feed">
        <Dead>RSS de {USERNAME}</Dead>
      </p>
    </aside>
  )
}

// « Anterior | Próxima »
function PhotoNavigation({ previous, next }) {
  return (
    <ul className="blog-photonav">
      <li>
        « {previous ? <BrowserLink href={links.post(previous)}>Anterior</BrowserLink> : <Dead>Anterior</Dead>}
      </li>
      <li>
        {next ? <BrowserLink href={links.post(next)}>Próxima</BrowserLink> : <Dead>Próxima</Dead>} »
      </li>
    </ul>
  )
}

/*
 * The guestbook under a photo. Only members could sign one, and nobody
 * here is a member, so it ends with Fotolog's own "sorry" note.
 */
function Guestbook({ comments }) {
  return (
    <div className="blog-guestbook">
      <h3>Mensagens do livro de visitas ({comments.length})</h3>
      {comments.map((comment, index) => (
        <div key={index} className="blog-comment">
          <p>
            <b>{comment.name}</b>
            {comment.date && <span className="blog-said"> disse em {shortDate(comment.date)}…</span>}
          </p>
          <p>{comment.text}</p>
        </div>
      ))}
      <div className="blog-nopost">
        Desculpe, mas somente membros do Bairrolog podem enviar comentários. <Dead>Faça o login</Dead> ou{' '}
        <Dead>crie sua conta agora</Dead> - é grátis!
      </div>
    </div>
  )
}

// A link out of the simulation, to the band's real pages, in a new tab of the real browser
function ExternalLink({ href, children }) {
  return (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </li>
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

const photosLabel = (count) => (count === 1 ? '1 foto' : `${count} fotos`)

// "07/11/26", as Fotolog wrote dates
function shortDate(date) {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
