import aboutText from '../../assets/desktop/Sobre a Banda.txt?raw'
import { BAIRROLOG_URL, links, POSTS } from '../bairrolog/links'

/*
 * What the band's home page shows, taken from the rest of the computer so
 * it stays in step: the description from "Sobre a Banda.txt" on the
 * desktop, and photos from the shows (the same ones as on Bairrolog).
 */

/*
 * The text file is laid out for Notepad: a framed header, paragraphs
 * wrapped at ~68 columns, then the line-up between dashed lines. Here the
 * paragraphs are joined back into flowing text, and the line-up becomes
 * [{ name, role }].
 */
function parseAbout(text) {
  const lines = text.replace(/\r/g, '').split('\n')
  const headerEnd = lines.findLastIndex((line) => line.startsWith('====='))
  const lineUpStart = lines.findIndex((line, index) => index > headerEnd && line.startsWith('-----'))

  const paragraphs = lines
    .slice(headerEnd + 1, lineUpStart)
    .join('\n')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.split('\n').map((line) => line.trim()).join(' ').trim())
    .filter(Boolean)

  // "  Marcio .............. guitarra e voz"
  const lineUp = lines
    .slice(lineUpStart + 1)
    .map((line) => line.match(/^\s*(\S.*?)\s+\.{3,}\s+(.+)$/))
    .filter(Boolean)
    .map(([, name, role]) => ({ name, role: role.trim() }))

  return { paragraphs, lineUp }
}

export const ABOUT = parseAbout(aboutText)

/** A handful of show photos for the page (the first three of each show, newest first), each opening on Bairrolog */
export const SHOW_PHOTOS = POSTS.filter((post) => post.position <= 3).map((post) => ({
  id: post.id,
  thumb: post.photo.thumb,
  show: post.show,
  href: new URL(links.post(post), BAIRROLOG_URL).href,
}))
