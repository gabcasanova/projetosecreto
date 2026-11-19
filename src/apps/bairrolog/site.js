import { BAIRROLOG_URL, findPost, USERNAME } from './links'
import { ErrorPage, MosaicPage, PostPage } from './pages'

/*
 * bairrolog.com: the band's Fotolog, a gallery of their shows (see
 * shows.js). Addresses:
 *   /  and  /futeboldebairro/  -> the mosaic of every photo (the front page)
 *   /futeboldebairro/mosaic/   -> the same mosaic, at Fotolog's own address for it
 *   /futeboldebairro/31003001/ -> one photo
 * Anything else on this host gets Bairrolog's own "not found" page.
 */

export { BAIRROLOG_URL }

const HOSTS = ['www.bairrolog.com', 'bairrolog.com']
const TITLE = `Bairrolog - ${USERNAME}`

const MOSAIC = { title: TITLE, Content: MosaicPage }
const NOT_FOUND = { title: 'Bairrolog - página não encontrada', Content: ErrorPage }

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

  if (!user) return MOSAIC
  if (user !== USERNAME || rest.length > 0) return NOT_FOUND
  if (!part || part === 'mosaic') return MOSAIC

  const post = findPost(part)
  return post ? { title: `${TITLE} - ${post.show.title}`, Content: PostPage } : NOT_FOUND
}

const bairrolog = {
  homeUrl: BAIRROLOG_URL,
  findPage,
  favorites: [{ title: 'Bairrolog - futeboldebairro', url: BAIRROLOG_URL }],
}

export default bairrolog
