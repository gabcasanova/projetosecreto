import { SHOWS } from './shows'

/*
 * Bairrolog's addresses, shaped like Fotolog's: the band's page is
 * www.bairrolog.com/futeboldebairro/, each photo has its own numbered
 * address under it, and the mosaic lists them all.
 */

const HOST = 'www.bairrolog.com'
export const USERNAME = 'futeboldebairro'
export const BAIRROLOG_URL = `http://${HOST}/${USERNAME}/`

/*
 * Fotolog showed one photo per post, so every photo of every show is a post,
 * newest show first and each show's photos in order. Post ids look like
 * Fotolog's long numbers: built from the show and photo so they never change.
 */
export const POSTS = SHOWS.flatMap((show) =>
  show.photos.map((photo, index) => ({
    id: String(31000000 + Number(show.id) * 1000 + index + 1),
    show,
    photo,
    // "foto 2 de 15" within its show
    position: index + 1,
  })),
)

export const links = {
  home: `/${USERNAME}/`,
  post: (post) => `/${USERNAME}/${post.id}/`,
  mosaic: `/${USERNAME}/mosaic/`,
}

export function findPost(id) {
  return POSTS.find((post) => post.id === id) ?? null
}
