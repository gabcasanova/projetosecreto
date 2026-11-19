import { albums, singles } from 'virtual:music-library'
import { MUSIC_SERVICES } from '../../components/sidebar/externalLinks'
import { BAIRROLOG_URL } from '../bairrolog/site'
import { FUTEBORKUT_URL } from '../futeborkut/links'
import BrowserLink from '../internet-explorer/BrowserLink'
import { ABOUT, SHOW_PHOTOS } from './content'
import { gif } from './gifs'
import './band-site.css'

/*
 * futeboldebairro.com.br: the band's own home page, the way a band made one
 * on GeoCities around 2000. Tiled background, rainbow titles, a scrolling
 * marquee, blinking NEW!s, spinning footballs and flames everywhere, a hit
 * counter and the guestbook button, all on purpose.
 */

// A GIF from the collection; missing ones are just left out
function Gif({ name, className = '', title }) {
  const src = gif(name)
  if (!src) return null
  return <img src={src} alt="" className={`geo-gif ${className}`} title={title} draggable={false} />
}

// A row of the same GIF, for borders made of footballs and the like
function GifRow({ name, count }) {
  return (
    <div className="geo-gifrow">
      {Array.from({ length: count }, (_, index) => (
        <Gif key={index} name={name} />
      ))}
    </div>
  )
}

function Divider() {
  return gif('divider') ? <Gif name="divider" className="geo-divider" /> : <hr className="geo-hr" />
}

// Text where every letter takes the next colour of the rainbow
function Rainbow({ children }) {
  return (
    <span className="geo-rainbow">
      {[...children].map((letter, index) => (
        <span key={index} style={{ '--n': index }}>
          {letter}
        </span>
      ))}
    </span>
  )
}

// A link to somewhere this simulated web doesn't have: still drawn as a link, going nowhere
function Dead({ children }) {
  return <span className="geo-dead">{children}</span>
}

/** http://www.futeboldebairro.com.br/ */
export function HomePage() {
  return (
    <Page>
      <div className="geo-top">
        <Gif name="soccer-ball" />
        <h1>
          <Rainbow>FUTEBOL DE BAIRRO</Rainbow>
        </h1>
        <Gif name="soccer-ball" />
      </div>
      <p className="geo-tagline">
        <Gif name="flames" className="geo-inline" /> ROCK TRISTE DIRETO DO RIO DE JANEIRO <Gif name="flames" className="geo-inline" />
      </p>
      <Gif name="welcome" className="geo-block" />

      {/* eslint-disable-next-line react/no-unknown-property */}
      <marquee className="geo-marquee" scrollamount="6">
        ⚽ BEM-VINDO À PÁGINA OFICIAL DO FUTEBOL DE BAIRRO!!! ⚽ ESCUTE NOSSA DISCOGRAFIA!!! ⚽ ASSINE O LIVRO DE VISITAS!!! ⚽
      </marquee>

      <GifRow name="soccer-small" count={9} />

      <table className="geo-table">
        <tbody>
          <tr>
            <td className="geo-menu">
              <h3>
                <Gif name="new" className="geo-inline" /> MENU
              </h3>
              <ul>
                <li>
                  <Gif name="bullet" className="geo-inline" />
                  <BrowserLink href="/discografia">Discografia</BrowserLink> <Gif name="new" className="geo-inline" />
                </li>
                <li>
                  <Gif name="bullet" className="geo-inline" />
                  <BrowserLink href={BAIRROLOG_URL}>Fotos dos shows</BrowserLink>
                </li>
                <li>
                  <Gif name="bullet" className="geo-inline" />
                  <BrowserLink href={FUTEBORKUT_URL}>Comunidade no futeborkut</BrowserLink>
                </li>
                <li>
                  <Gif name="bullet" className="geo-inline" />
                  <Dead>Livro de visitas</Dead>
                </li>
              </ul>
              <Gif name="trophy" className="geo-block" />
              <Gif name="music" className="geo-block" />
            </td>

            <td className="geo-main">
              <h2>
                <Gif name="soccer-kick" className="geo-inline" /> QUEM SOMOS <Gif name="soccer-kick" className="geo-inline geo-flip" />
              </h2>
              {ABOUT.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              <h2>
                <Gif name="guitar" className="geo-inline" /> FORMAÇÃO <Gif name="guitar" className="geo-inline geo-flip" />
              </h2>
              <table className="geo-lineup">
                <tbody>
                  {ABOUT.lineUp.map((member) => (
                    <tr key={member.name}>
                      <td>
                        <b>{member.name}</b>
                      </td>
                      <td>{member.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <Divider />

      <h2 className="geo-center">
        <Gif name="camera" className="geo-inline" /> <Rainbow>FOTOS DOS SHOWS</Rainbow> <Gif name="camera" className="geo-inline" />
      </h2>
      <p className="geo-center geo-blink">CLIQUE NAS FOTOS PARA VER MAIS NO BAIRROLOG!!!</p>
      <div className="geo-photos">
        {SHOW_PHOTOS.map((photo) => (
          <BrowserLink key={photo.id} href={photo.href} title={photo.show.title}>
            <img src={photo.thumb} alt={photo.show.title} width={110} height={110} loading="lazy" />
          </BrowserLink>
        ))}
      </div>

      <Divider />

      <div className="geo-center">
        <Gif name="goal" className="geo-block" />
        <h2>
          <Rainbow>OUÇA A BANDA</Rainbow>
        </h2>
        <p className="geo-services">
          {[
            ['Spotify', MUSIC_SERVICES.spotify],
            ['Deezer', MUSIC_SERVICES.deezer],
            ['YouTube Music', MUSIC_SERVICES.youtubemusic],
            ['Apple Music', MUSIC_SERVICES.applemusic],
          ].map(([name, url]) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer">
              [ {name} ]
            </a>
          ))}
        </p>
      </div>

      <Divider />

      <Footer />
    </Page>
  )
}

/** http://www.futeboldebairro.com.br/discografia */
export function DiscographyPage() {
  const releases = [...albums, ...singles]

  return (
    <Page>
      <div className="geo-top">
        <Gif name="music" />
        <h1>
          <Rainbow>DISCOGRAFIA</Rainbow>
        </h1>
        <Gif name="music" />
      </div>
      <GifRow name="soccer-small" count={9} />
      <table className="geo-table geo-releases">
        <tbody>
          {releases.map((release) => (
            <tr key={release.id}>
              <td>
                <img src={release.cover} alt="" width={90} height={90} />
              </td>
              <td>
                <b className="geo-release-title">{release.title}</b> ({release.year})
                <br />
                {release.type === 'single' ? 'Single' : 'Álbum'}{' '}
                {release === releases[0] && <Gif name="new" className="geo-inline" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="geo-center">
        <BrowserLink href="/">&lt;&lt; Voltar para a página inicial</BrowserLink>
      </p>
      <Divider />
      <Footer />
    </Page>
  )
}

// The tiled background and the page's centre column
function Page({ children }) {
  const background = gif('bg-tile')
  return (
    <div className="geo" style={background ? { backgroundImage: `url(${background})` } : undefined}>
      <div className="geo-page">{children}</div>
    </div>
  )
}

/*
 * The bottom of every page: under construction, the hit counter, the
 * guestbook and e-mail buttons, the "best viewed with" badge and the webring.
 */
function Footer() {
  return (
    <div className="geo-footer">
      <Gif name="under-construction" className="geo-block" />
      <p className="geo-blink">PÁGINA EM CONSTRUÇÃO!!! VOLTE SEMPRE!!!</p>

      <p>
        Você é o visitante número
        <br />
        <span className="geo-counter">
          {'0013372'.split('').map((digit, index) => (
            <span key={index}>{digit}</span>
          ))}
        </span>
      </p>

      <p className="geo-buttons">
        <Gif name="guestbook" title="Assine meu livro de visitas!" />
        <Gif name="email" title="Mande um e-mail!" />
      </p>

      <p className="geo-webring">
        [ <Dead>&lt;&lt; anterior</Dead> | <Dead>Web Ring do Rock Carioca</Dead> | <Dead>próximo &gt;&gt;</Dead> ]
      </p>

      <Gif name="ie-badge" className="geo-block" />
      <p className="geo-small">
        Melhor visualizado no Internet Explorer 6.0 em 800x600
        <br />© 2008 Futebol de Bairro - Todos os direitos reservados
      </p>
    </div>
  )
}
