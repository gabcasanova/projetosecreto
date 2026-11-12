import Link from '../components/Link'
import Layout from '../components/Layout'
import { Breadcrumb, TitleModule } from '../components/Module'
import { Nothing } from '../components/ThumbGrid'
import UserCard from '../components/UserCard'
import { personOfAccount, photoCount } from '../data/database'
import { links, queryParam } from '../links'
import AccountGate from './AccountGate'
import ErrorPage from './ErrorPage'

/*
 * Photos: the album list (AlbumList.aspx), one album's thumbnails
 * (AlbumView.aspx) and a single photo (AlbumZoom.aspx).
 */

function PhotoFrame({ account, navigate, title, steps, children }) {
  return (
    <Layout navigate={navigate} left={<UserCard person={personOfAccount(account)} />}>
      <TitleModule
        title={title}
        breadcrumb={<Breadcrumb steps={[{ label: 'Início', href: links.home }, ...steps]} />}
      >
        <div className="boxmidlrg">{children}</div>
      </TitleModule>
    </Layout>
  )
}

const photosLabel = (count) => (count === 1 ? '1 foto' : `${count} fotos`)

/** AlbumList.aspx?uid=... */
export function AlbumListPage({ url, navigate }) {
  return (
    <AccountGate url={url} navigate={navigate}>
      {(account) => (
        <PhotoFrame
          account={account}
          navigate={navigate}
          title={`fotos (${photoCount(account)})`}
          steps={[{ label: account.name, href: links.profile(account.uid) }, { label: 'Álbuns' }]}
        >
          {account.albums.length === 0 && <Nothing>nenhum álbum ainda</Nothing>}
          <div className="albumgrid">
            {account.albums.map((album) => {
              const href = links.album(account.uid, album.aid)
              return (
                <div key={album.aid} className="albumbox">
                  <Link href={href}>
                    {album.photos[0] ? (
                      <img src={album.photos[0].url} alt={album.title} className="picthumb" />
                    ) : (
                      <span className="picthumb" />
                    )}
                  </Link>
                  <Link href={href}>{album.title}</Link>
                  <div className="sml">({photosLabel(album.photos.length)})</div>
                </div>
              )
            })}
          </div>
        </PhotoFrame>
      )}
    </AccountGate>
  )
}

function albumFromUrl(account, url) {
  return account.albums.find((album) => album.aid === queryParam(url, 'aid'))
}

/** AlbumView.aspx?uid=...&aid=... */
export function AlbumViewPage({ url, navigate }) {
  return (
    <AccountGate url={url} navigate={navigate}>
      {(account) => {
        const album = albumFromUrl(account, url)
        if (!album) return <ErrorPage navigate={navigate} />
        return (
          <PhotoFrame
            account={account}
            navigate={navigate}
            title={album.title}
            steps={[{ label: 'Álbuns', href: links.albums(account.uid) }, { label: album.title }]}
          >
            {album.description && <div className="nor listheader">{album.description}</div>}
            <div className="albumgrid">
              {album.photos.map((photo) => {
                const href = links.photo(account.uid, album.aid, photo.pid)
                return (
                  <div key={photo.pid} className="albumbox">
                    <Link href={href}>
                      <img src={photo.url} alt={photo.caption} className="picthumb" />
                    </Link>
                    <div className="sml">{photo.caption}</div>
                  </div>
                )
              })}
            </div>
          </PhotoFrame>
        )
      }}
    </AccountGate>
  )
}

/** AlbumZoom.aspx?uid=...&aid=...&pid=... */
export function AlbumZoomPage({ url, navigate }) {
  return (
    <AccountGate url={url} navigate={navigate}>
      {(account) => {
        const album = albumFromUrl(account, url)
        const index = album?.photos.findIndex((photo) => photo.pid === queryParam(url, 'pid')) ?? -1
        if (index < 0) return <ErrorPage navigate={navigate} />

        const photo = album.photos[index]
        const previous = album.photos[index - 1]
        const next = album.photos[index + 1]
        const photoHref = (target) => links.photo(account.uid, album.aid, target.pid)

        return (
          <PhotoFrame
            account={account}
            navigate={navigate}
            title={album.title}
            steps={[
              { label: 'Álbuns', href: links.albums(account.uid) },
              { label: album.title, href: links.album(account.uid, album.aid) },
              { label: photo.caption || `foto ${photo.pid}` },
            ]}
          >
            <div className="photonav">
              <span className="pager">
                {previous ? <Link href={photoHref(previous)}>&lt; anterior</Link> : <span className="disabled">&lt; anterior</span>}
                {' | '}
                {next ? <Link href={photoHref(next)}>próxima &gt;</Link> : <span className="disabled">próxima &gt;</span>}
              </span>
              <b>
                mostrando {index + 1} de {photosLabel(album.photos.length)}
              </b>
            </div>
            <div className="photoview">
              {/* Clicking the photo moves on, as orkut did */}
              {next ? (
                <Link href={photoHref(next)}>
                  <img src={photo.url} alt={photo.caption} className="bigphoto" />
                </Link>
              ) : (
                <img src={photo.url} alt={photo.caption} className="bigphoto" />
              )}
              <div>{photo.caption}</div>
              {index === 0 && <div className="sml">Esta foto é a capa do álbum.</div>}
              <div className="sml">
                <Link href={links.album(account.uid, album.aid)}>mostrar tudo</Link>
              </div>
            </div>
          </PhotoFrame>
        )
      }}
    </AccountGate>
  )
}
