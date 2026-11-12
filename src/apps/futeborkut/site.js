import { getAccount, getCommunity, getPersonWithoutProfile } from './data/database'
import { FUTEBORKUT_URL, queryParam } from './links'
import { AlbumListPage, AlbumViewPage, AlbumZoomPage } from './pages/PhotoPages'
import {
  CommunityMembersPage,
  CommunityPage,
  CommunityTopicPage,
  CommunityTopicsPage,
} from './pages/CommunityPages'
import ErrorPage from './pages/ErrorPage'
import HomePage from './pages/HomePage'
import { CommunitiesPage, FansPage, FriendsPage, TestimonialsPage } from './pages/ListPages'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import ScrapbookPage from './pages/ScrapbookPage'
import SearchPage from './pages/SearchPage'

/*
 * futeborkut.com: the band's orkut. The front page is the login; every
 * other address is an orkut-style "Something.aspx?uid=..." page. Unknown
 * addresses on this host get orkut's own error page (not IE's), and other
 * hosts are left for the other sites.
 */

export { FUTEBORKUT_URL }

const HOSTS = ['www.futeborkut.com', 'futeborkut.com']
const TITLE_PREFIX = 'futeborkut - '
const ERROR_TITLE = 'Erro'

// The name of whoever the page's uid points to, for titles like "Perfil de Marcio"
function nameFromUid(url) {
  const uid = queryParam(url, 'uid')
  return getAccount(uid)?.name ?? getPersonWithoutProfile(uid)?.name ?? null
}

function communityName(url) {
  return getCommunity(queryParam(url, 'cmm'))?.name ?? null
}

// Titles for pages about someone: "Página de recados de Marcio"
const about = (label) => (url) => {
  const name = nameFromUid(url)
  return name ? `${label} de ${name}` : null
}

function albumTitle(url) {
  const account = getAccount(queryParam(url, 'uid'))
  return account?.albums.find((album) => album.aid === queryParam(url, 'aid'))?.title ?? null
}

function topicTitle(url) {
  const community = getCommunity(queryParam(url, 'cmm'))
  return community?.topics.find((topic) => topic.tid === queryParam(url, 'tid'))?.title ?? null
}

/*
 * Lower-case path (ASP.NET addresses ignored case) -> the page component and
 * its title. A title of null means the address points at nothing, so the
 * tab says "Erro" (the component shows the error page itself).
 */
const ROUTES = {
  '/': { Content: LoginPage, title: () => 'login' },
  '/home.aspx': { Content: HomePage, title: () => 'Página inicial' },
  '/profile.aspx': { Content: ProfilePage, title: about('Perfil') },
  '/scrapbook.aspx': { Content: ScrapbookPage, title: about('Página de recados') },
  '/friendslist.aspx': { Content: FriendsPage, title: about('Amigos') },
  '/profilec.aspx': { Content: CommunitiesPage, title: about('Comunidades') },
  '/profilet.aspx': { Content: TestimonialsPage, title: about('Depoimentos') },
  '/profilef.aspx': { Content: FansPage, title: about('Fãs') },
  '/albumlist.aspx': { Content: AlbumListPage, title: about('Álbuns') },
  '/albumview.aspx': { Content: AlbumViewPage, title: albumTitle },
  '/albumzoom.aspx': { Content: AlbumZoomPage, title: albumTitle },
  '/community.aspx': { Content: CommunityPage, title: communityName },
  '/commtopics.aspx': { Content: CommunityTopicsPage, title: (url) => communityName(url) && `${communityName(url)} - fórum` },
  '/commmsgs.aspx': { Content: CommunityTopicPage, title: topicTitle },
  '/commmembers.aspx': {
    Content: CommunityMembersPage,
    title: (url) => communityName(url) && `Membros de ${communityName(url)}`,
  },
  '/universalsearch.aspx': { Content: SearchPage, title: () => 'Pesquisa' },
}

const ERROR_PAGE = { title: TITLE_PREFIX + ERROR_TITLE, Content: ErrorPage }

function findPage(url) {
  let address
  try {
    address = new URL(url)
  } catch {
    return null
  }
  if (address.protocol !== 'http:' || !HOSTS.includes(address.hostname)) return null

  const route = ROUTES[address.pathname.toLowerCase()]
  if (!route) return ERROR_PAGE

  // A new object each time, but always the same component, so React keeps the page mounted
  const title = route.title(url) ?? ERROR_TITLE
  return { title: TITLE_PREFIX + title, Content: route.Content }
}

const futeborkut = {
  homeUrl: FUTEBORKUT_URL,
  findPage,
  favorites: [{ title: 'futeborkut', url: FUTEBORKUT_URL }],
}

export default futeborkut
