/*
 * The site's addresses, shaped like the real orkut's ("Profile.aspx?uid=...").
 * Links are written from the site root, so BrowserLink keeps them on futeborkut.com.
 */

export const FUTEBORKUT_HOST = 'www.futeborkut.com'
export const FUTEBORKUT_URL = `http://${FUTEBORKUT_HOST}/`

export const links = {
  login: '/',
  home: '/Home.aspx',
  profile: (uid) => `/Profile.aspx?uid=${uid}`,
  scrapbook: (uid, page = 1) => `/Scrapbook.aspx?uid=${uid}${page > 1 ? `&pg=${page}` : ''}`,
  friends: (uid) => `/FriendsList.aspx?uid=${uid}`,
  communities: (uid) => `/ProfileC.aspx?uid=${uid}`,
  testimonials: (uid) => `/ProfileT.aspx?uid=${uid}`,
  fans: (uid) => `/ProfileF.aspx?uid=${uid}`,
  albums: (uid) => `/AlbumList.aspx?uid=${uid}`,
  album: (uid, aid) => `/AlbumView.aspx?uid=${uid}&aid=${aid}`,
  photo: (uid, aid, pid) => `/AlbumZoom.aspx?uid=${uid}&aid=${aid}&pid=${pid}`,
  community: (cmm) => `/Community.aspx?cmm=${cmm}`,
  communityTopics: (cmm) => `/CommTopics.aspx?cmm=${cmm}`,
  communityTopic: (cmm, tid) => `/CommMsgs.aspx?cmm=${cmm}&tid=${tid}`,
  communityMembers: (cmm) => `/CommMembers.aspx?cmm=${cmm}`,

  search: (query) => `/UniversalSearch.aspx?q=${encodeURIComponent(query)}`,

  // Pages the site doesn't have. Their links are drawn greyed out and go nowhere (see components/Link.jsx).
  videos: notBuilt,
  updates: notBuilt,
  editProfile: null,
  messages: null,
  settings: null,
  help: null,
  addFriend: notBuilt,
  profileAction: notBuilt,
  writeTestimonial: notBuilt,
  joinCommunity: notBuilt,
  leaveCommunity: notBuilt,
  communityPolls: notBuilt,
  communityEvents: notBuilt,
  newTopic: notBuilt,
  footer: notBuilt,
}

function notBuilt() {
  return null
}

/** A query-string value of the page's address ("uid", "cmm"...), or null. */
export function queryParam(url, name) {
  try {
    return new URL(url).searchParams.get(name)
  } catch {
    return null
  }
}
