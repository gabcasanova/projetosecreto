import { BAIRROLOG_URL, findPost, POSTS, USERNAME } from './links'
import { ErrorPage, MosaicPage, PostPage } from './pages'

/*
 * bairrolog.com: the band's Fotolog, a gallery of their shows (see
 * shows.js). Addresses:
 *   /                          -> the band's page (it's the only one there is)
 *   /futeboldebairro/          -> the newest photo
 *   /futeboldebairro/31003001/ -> one photo
 *   /futeboldebairro/mosaic/   -> every photo, as thumbnails
 * Anything else on this host gets Bairrolog's own "not found" page.
 */

export { BAIRROLOG_URL }

const HOSTS = ['www.bairrolog.com', 'bairrolog.com']
const TITLE = 'Bairrolog'

function findPage(url) {
  let address
  try {
    address = new URL(url)
  } catch {
    return null
  }
  if (address.protocol !== 'http:' || !HOSTS.includes(address.hostname)) return null

  // "/futeboldebairro/31003001/" -> ['futeboldebairro', '31003001']
  const [user, part, ...rest] = address.pathname.split('/').filter(Boolean)

  if (!user || (user === USERNAME && !part)) return newest()
  if (user !== USERNAME || rest.length > 0) return notFound()
  if (part === 'mosaic') return { title: `${TITLE} - ${USERNAME} - mosaico`, Content: MosaicPage }

  const post = findPost(part)
  if (!post) return notFound()
  return { title: `${TITLE} - ${USERNAME} - ${post.show.title}`, Content: PostPage }
}

function newest() {
  const latest = POSTS[0]
  return { title: `${TITLE} - ${USERNAME}${latest ? ` - ${latest.show.title}` : ''}`, Content: PostPage }
}

function notFound() {
  return { title: `${TITLE} - página não encontrada`, Content: ErrorPage }
}

const bairrolog = {
  homeUrl: BAIRROLOG_URL,
  findPage,
  favorites: [{ title: 'Bairrolog - futeboldebairro', url: BAIRROLOG_URL }],
}

export default bairrolog
