import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { parseFile } from 'music-metadata'

/**
 * Exposes the music folder as `virtual:music-library`, with two named
 * exports: `albums` and `singles`.
 *
 * Every release is a folder in src/assets/music/albums or .../singles containing:
 *   info.json            title, release date ("dd/mm/yyyy" or just "yyyy"), type and,
 *                        optionally, streaming links: { "spotify": url, "deezer": url, ... }
 *   songs/*.mp3          tagged songs; the tags give order, title and duration
 *   art/frontcover.jpg   cover art
 *   art/backcover.jpg    (optional) back of the CD case
 *   art/cdlabel.jpg      (optional) the print on the disc itself
 *   art/booklet1.jpg...  (optional) booklet pages, in order; the front cover is the booklet's first page
 *
 * Tags are read here, at build time, so the browser never has to download
 * the songs just to learn what's in them.
 */

const VIRTUAL_ID = 'virtual:music-library'
const RESOLVED_ID = '\0' + VIRTUAL_ID
const MUSIC_DIR = path.resolve('src/assets/music')
const ARTIST = 'Futebol de Bairro'

export default function musicLibrary() {
  return {
    name: 'music-library',

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    async load(id) {
      if (id !== RESOLVED_ID) return
      const albums = await readReleases('albums')
      const singles = await readReleases('singles')
      return generateModule({ albums, singles })
    },

    // Rebuild the library when songs or album info change during `npm run dev`
    configureServer(server) {
      server.watcher.add(MUSIC_DIR)
      const reload = (file) => {
        if (!file.startsWith(MUSIC_DIR)) return
        const module = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (module) {
          server.moduleGraph.invalidateModule(module)
          server.ws.send({ type: 'full-reload' })
        }
      }
      server.watcher.on('add', reload)
      server.watcher.on('change', reload)
      server.watcher.on('unlink', reload)
    },
  }
}

// `category` is the folder inside src/assets/music: "albums" or "singles"
async function readReleases(category) {
  const categoryDir = path.join(MUSIC_DIR, category)
  if (!existsSync(categoryDir)) return []

  const folders = readdirSync(categoryDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(byLeadingNumberDescending)

  return Promise.all(folders.map((folder) => readRelease(path.join(categoryDir, folder), category, folder)))
}

// Release folders are named "1-volume1", "2-...": the highest number (newest) comes first,
// and the numbers are compared as numbers so "10-..." comes before "9-..."
function byLeadingNumberDescending(a, b) {
  const numberOf = (name) => Number.parseInt(name, 10)
  const difference = numberOf(b) - numberOf(a)
  return Number.isNaN(difference) ? a.localeCompare(b) : difference || a.localeCompare(b)
}

async function readRelease(albumDir, category, folder) {
  const info = readAlbumInfo(albumDir)
  const songsDir = path.join(albumDir, 'songs')
  const songFiles = readdirSync(songsDir).filter((file) => file.toLowerCase().endsWith('.mp3'))
  const tracks = await Promise.all(songFiles.map((file) => readTrack(path.join(songsDir, file))))

  tracks.sort((a, b) => a.disc - b.disc || a.trackNumber - b.trackNumber)

  return {
    // Folder names can repeat between albums/ and singles/, so the category is part of the id
    id: `${category}-${folder}`,
    title: info.title ?? folder,
    artist: ARTIST,
    releaseDate: info.release ?? null,
    year: parseYear(info.release),
    type: info.type ?? 'album',
    links: info.links ?? {},
    coverPath: path.join(albumDir, 'art', 'frontcover.jpg'),
    backCoverPath: path.join(albumDir, 'art', 'backcover.jpg'),
    cdLabelPath: path.join(albumDir, 'art', 'cdlabel.jpg'),
    bookletPaths: findBookletPages(path.join(albumDir, 'art')),
    tracks,
  }
}

// art/booklet1.jpg, booklet2.jpg... in page order (booklet10 after booklet9)
function findBookletPages(artDir) {
  if (!existsSync(artDir)) return []
  const pageNumber = (file) => Number(file.match(/^booklet(\d+)\./i)[1])
  return readdirSync(artDir)
    .filter((file) => /^booklet\d+\.(jpe?g|png|webp)$/i.test(file))
    .sort((a, b) => pageNumber(a) - pageNumber(b))
    .map((file) => path.join(artDir, file))
}

// The spec puts info.json at the album root, but it currently lives in songs/, so accept both
function readAlbumInfo(albumDir) {
  const candidates = [path.join(albumDir, 'info.json'), path.join(albumDir, 'songs', 'info.json')]
  const infoPath = candidates.find((candidate) => existsSync(candidate))
  return infoPath ? JSON.parse(readFileSync(infoPath, 'utf-8')) : {}
}

async function readTrack(filePath) {
  const { common, format } = await parseFile(filePath, { skipCovers: true })
  return {
    filePath,
    title: common.title ?? path.basename(filePath, '.mp3'),
    trackNumber: common.track?.no ?? 0,
    disc: common.disk?.no ?? 1,
    duration: format.duration ?? 0,
  }
}

// "06/02/2026" -> 2026, "2025" -> 2025
function parseYear(releaseDate) {
  const year = releaseDate?.split('/').at(-1)
  return year ? Number(year) : null
}

/*
 * Covers and songs become real imports so Vite copies them into the build
 * and gives them hashed URLs, just like any other asset.
 */
function generateModule(releasesByCategory) {
  const imports = []
  let importCount = 0

  function importAsset(filePath) {
    const name = `asset${importCount++}`
    // Root-relative ("/src/assets/...") so it works the same on Windows and elsewhere
    const importPath = '/' + path.relative(process.cwd(), filePath).split(path.sep).join('/')
    imports.push(`import ${name} from ${JSON.stringify(importPath + '?url')}`)
    return name
  }

  function releaseSource(release) {
    const cover = existsSync(release.coverPath) ? importAsset(release.coverPath) : 'null'
    const backCover = existsSync(release.backCoverPath) ? importAsset(release.backCoverPath) : 'null'
    const cdLabel = existsSync(release.cdLabelPath) ? importAsset(release.cdLabelPath) : 'null'
    const booklet = release.bookletPaths.map(importAsset)
    const tracks = release.tracks.map((track) => {
      const { filePath, ...data } = track
      return `{ ...${JSON.stringify(data)}, url: ${importAsset(filePath)} }`
    })
    const data = {
      id: release.id,
      title: release.title,
      artist: release.artist,
      releaseDate: release.releaseDate,
      year: release.year,
      type: release.type,
      links: release.links,
    }
    return `{ ...${JSON.stringify(data)}, cover: ${cover}, backCover: ${backCover}, cdLabel: ${cdLabel}, booklet: [${booklet.join(', ')}], tracks: [${tracks.join(', ')}] }`
  }

  // One named export per category: `export const albums = [...]`, `export const singles = [...]`
  const exports = Object.entries(releasesByCategory).map(
    ([category, releases]) => `export const ${category} = [${releases.map(releaseSource).join(',\n')}]`,
  )

  return `${imports.join('\n')}\n\n${exports.join('\n\n')}\n`
}
