/*
 * Bairrolog's content: the band's shows, read straight from the `fotos`
 * folder at the project root. Each show is a numbered folder with its
 * photos and an info.json:
 *
 *   fotos/3/info.json   { "title", "place", "date": "dd-mm-yy", "desc" }
 *   fotos/3/1.jpg, 2.jpg, ...
 *
 * info.json can also have "comments", the guestbook under the show's first
 * photo: [{ "name": "fulano", "date": "dd-mm-yy", "text": "..." }].
 *
 * A new show is just a new folder with the next number. Shows are listed
 * newest first (highest folder number first), photos in their number order.
 *
 * The originals can be huge, so `python scripts/miniaturas.py` makes light
 * copies next to them (_thumbs/ for the small squares, _web/ for the big
 * photo). Photos without them yet just use the original.
 */

const infos = import.meta.glob('/fotos/*/info.json', { eager: true, import: 'default' })
const pictures = import.meta.glob('/fotos/*/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
})
const thumbs = import.meta.glob('/fotos/*/_thumbs/*.webp', { eager: true, import: 'default' })
const webSized = import.meta.glob('/fotos/*/_web/*.webp', { eager: true, import: 'default' })

// "/fotos/12/3.jpg" -> { folder: 12, number: 3 }
function parsePath(path) {
  const [, folder, file] = path.match(/^\/fotos\/([^/]+)\/([^/]+)$/)
  return { folder, number: parseInt(file, 10) }
}

// "7-11-26" -> a Date (the folders use day-month-two-digit-year)
function parseDate(text) {
  const [day, month, year] = text.split('-').map(Number)
  return new Date(2000 + year, month - 1, day)
}

// "/fotos/3/7.jpg" -> its light copy in `versions` ("/fotos/3/_thumbs/7.webp"), if it's been made
function versionOf(versions, kind, path) {
  const [, folder, name] = path.match(/^\/fotos\/([^/]+)\/(.+)\.[^.]+$/)
  return versions[`/fotos/${folder}/${kind}/${name}.webp`] ?? null
}

function photosOf(folder) {
  return Object.entries(pictures)
    .map(([path, original]) => ({
      ...parsePath(path),
      src: versionOf(webSized, '_web', path) ?? original,
      thumb: versionOf(thumbs, '_thumbs', path) ?? original,
    }))
    .filter((picture) => picture.folder === folder)
    .sort((a, b) => a.number - b.number)
}

/** Every show, newest first: { id, title, place, date, desc, comments, photos: [{ id, src, thumb }] } */
export const SHOWS = Object.entries(infos)
  .map(([path, info]) => {
    const { folder } = parsePath(path)
    return {
      id: folder,
      title: info.title,
      place: info.place,
      date: parseDate(info.date),
      desc: info.desc,
      comments: (info.comments ?? []).map((comment) => ({
        ...comment,
        date: comment.date ? parseDate(comment.date) : null,
      })),
      photos: photosOf(folder).map((photo) => ({ id: `${folder}-${photo.number}`, src: photo.src, thumb: photo.thumb })),
    }
  })
  .filter((show) => show.photos.length > 0)
  .sort((a, b) => Number(b.id) - Number(a.id))

/** The show with this id, or null */
export function findShow(id) {
  return SHOWS.find((show) => show.id === id) ?? null
}
