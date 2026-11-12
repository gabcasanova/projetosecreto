import { albums as musicAlbums, singles as musicSingles } from 'virtual:music-library'
import peopleData from '../people/people.json'
import visitorData from './visitor.json'

/*
 * Everything the site shows, loaded once: the band members' profiles (one
 * folder each in ../profiles), the visitor's account, the other people
 * (../people) and the communities (one folder each in ../communities).
 *
 * Each community lists its members by person id in its own "members";
 * that's also the members count. A profile's communities are the ones
 * that list it.
 *
 * People show up in many places (fans, testimonial authors, communities...). In the
 * data they are always written as an id: a profile's folder name
 * ("marcio"), "visitante" for the visitor, or an id from people.json
 * ("juliana") for everyone without a profile. Here they all become "person"
 * objects: { uid, name, photo, friendCount, account }, where `account` is
 * set only for people with a real profile (or the visitor). People without
 * a profile still get a stable made-up uid, so their links lead to a
 * "perfil privado" page instead of an error.
 */

const VISITOR_ID = 'visitante'

const profileFiles = import.meta.glob('../profiles/*/profile.json', { eager: true, import: 'default' })
const profileImages = import.meta.glob('../profiles/*/*.{jpg,jpeg,png,gif,webp}', { eager: true, import: 'default' })
// A person's photo in ../people is named after their id, e.g. juliana.jpg
const peopleImages = import.meta.glob('../people/*.{jpg,jpeg,png,gif,webp}', { eager: true, import: 'default' })
const communityFiles = import.meta.glob('../communities/*/community.json', { eager: true, import: 'default' })
const communityImages = import.meta.glob('../communities/*/*.{jpg,jpeg,png,gif,webp}', { eager: true, import: 'default' })

const accountsByUid = new Map()
// The same accounts by the id the data uses for them ("marcio", "visitante")
const accountsById = new Map()
const peopleByUid = new Map()
const peopleById = new Map()
const communitiesByCmm = new Map()
const communitiesById = new Map()

// ---------- Made-up ids and numbers ----------

// FNV-1a: a small, stable string hash, so the same name always gets the same id
function hashString(text, seed = 0) {
  let hash = 2166136261 ^ seed
  for (const char of text) {
    hash ^= char.codePointAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

// orkut uids were long numbers, around 19-20 digits
function uidForId(id) {
  const digits = String(hashString(id, 1)).padStart(10, '0') + String(hashString(id, 2)).padStart(10, '0')
  return '1' + digits.slice(0, 18)
}

// A believable number between min and max that never changes for the same text
function stableNumber(text, min, max) {
  return min + (hashString(text, 7) % (max - min + 1))
}

// ---------- Photo albums ----------

const RELEASES = [...musicAlbums, ...musicSingles]

// Every picture of a CD from the music library, captioned as on a fan's album.
// The CD's name is left out of the captions when the album is all about that one CD.
function releasePhotos(title, { named }) {
  const release = RELEASES.find((candidate) => candidate.title === title)
  if (!release) return []
  const caption = (text) => (named ? `${release.title} - ${text}` : text)
  const photos = [
    { url: release.cover, caption: caption('capa') },
    { url: release.backCover, caption: caption('contracapa') },
    { url: release.cdLabel, caption: caption('cd') },
    ...release.booklet.map((url, index) => ({ url, caption: caption(`encarte (${index + 1})`) })),
  ]
  return photos.filter((photo) => photo.url)
}

// Albums from profile.json: pictures of the band's CDs and/or image files in the profile folder
function buildAlbums(albumsData, images) {
  return albumsData.map((album, index) => {
    const releases = album.fromReleases ?? []
    const fromReleases = releases.flatMap((title) => releasePhotos(title, { named: releases.length > 1 }))
    const fromFiles = (album.photos ?? [])
      .map((photo) => ({ url: images[photo.file], caption: photo.caption ?? '' }))
      .filter((photo) => photo.url)
    const photos = [...fromReleases, ...fromFiles].map((photo, photoIndex) => ({ ...photo, pid: String(photoIndex + 1) }))
    return { aid: String(index + 1), title: album.title, description: album.description ?? '', photos }
  })
}

// ---------- Accounts (band profiles + the visitor) ----------

function folderOf(path) {
  return path.split('/').at(-2)
}

// The images in one profile or community folder, by file name
function imagesInFolder(allImages, folder) {
  const images = {}
  for (const [path, url] of Object.entries(allImages)) {
    if (folderOf(path) === folder) images[path.split('/').at(-1)] = url
  }
  return images
}

// The JSON as written, plus what the site needs. References to people are resolved later,
// once every account exists, so profiles can point at each other.
function createAccount(raw, { folder = null, isVisitor = false } = {}) {
  const images = folder ? imagesInFolder(profileImages, folder) : {}
  return {
    raw,
    uid: String(raw.uid),
    name: raw.name,
    email: raw.email ?? null,
    isVisitor,
    photo: images['photo.jpg'] ?? images['photo.png'] ?? null,
    sex: raw.sex ?? '',
    city: raw.city ?? '',
    country: raw.country ?? '',
    status: raw.status ?? '',
    instagram: raw.instagram ?? null,
    social: raw.social ?? {},
    professional: raw.professional ?? {},
    personal: raw.personal ?? {},
    ratings: { trust: 0, cool: 0, sexy: 0, ...raw.ratings },
    videoCount: raw.videoCount ?? 0,
    albums: buildAlbums(raw.albums ?? [], images),
    // Only the visitor has a list of friends (the band); everyone else just a number of them
    friendCount: typeof raw.friends === 'number' ? raw.friends : stableNumber(String(raw.uid), 40, 600),
    // Filled in once every account exists
    friends: [],
    fans: [],
    communities: [],
    testimonials: [],
    updates: [],
  }
}

for (const [path, raw] of Object.entries(profileFiles)) {
  const folder = folderOf(path)
  const account = createAccount(raw, { folder })
  accountsByUid.set(account.uid, account)
  accountsById.set(folder, account)
}

/** The fan account the visitor is logged in as. */
export const VISITOR = createAccount(visitorData, { isVisitor: true })
accountsByUid.set(VISITOR.uid, VISITOR)
accountsById.set(VISITOR_ID, VISITOR)

/** The band members: one per profile folder, by name. */
export const BAND_MEMBERS = [...accountsByUid.values()]
  .filter((account) => !account.isVisitor)
  .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

// ---------- People ----------

function personOfAccount(account) {
  return {
    uid: account.uid,
    name: account.name,
    photo: account.photo,
    account,
    // A getter, since the visitor's friend list is filled in after these are first made
    get friendCount() {
      return account.isVisitor ? account.friends.length : account.friendCount
    },
  }
}

// Someone from people.json: { name, friends? }, with an optional photo named after their id
function createPerson(id, { name = id, friends } = {}) {
  const person = {
    uid: uidForId(id),
    name,
    photo: photoNamed(id),
    account: null,
    friendCount: friends ?? stableNumber(id, 40, 600),
  }
  peopleById.set(id, person)
  peopleByUid.set(person.uid, person)
  return person
}

function photoNamed(id) {
  for (const [path, url] of Object.entries(peopleImages)) {
    const fileName = path.split('/').at(-1)
    if (fileName.slice(0, fileName.lastIndexOf('.')) === id) return url
  }
  return null
}

for (const [id, data] of Object.entries(peopleData)) createPerson(id, data)

/** Turns a person's id as written in the data ("marcio", "juliana") into a person. */
function resolvePerson(id) {
  const account = accountsById.get(id)
  if (account) return personOfAccount(account)
  if (peopleById.has(id)) return peopleById.get(id)

  // A typo or someone missing from people.json: still shown (under their id), but worth fixing
  console.warn(`futeborkut: "${id}" não está em people/people.json nem em profiles/`)
  return createPerson(id)
}

// A date from the data: "2025-11-13" or "2025-11-13T21:04". A date without a time would be read
// as midnight UTC, which is the day before in Brazil, so it's read as local midnight instead.
function parseDate(text) {
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(text) ? `${text}T00:00` : text)
}

// Testimonials and forum posts: newest first, each with an id for React
function resolveMessages(messages) {
  return messages
    .map((message, index) => ({
      id: `seed-${index}`,
      from: resolvePerson(message.from),
      date: parseDate(message.date),
      text: message.text,
    }))
    .sort((a, b) => b.date - a.date)
}

// ---------- Communities ----------

// The community's picture: image.jpg (or .png...) in its folder, or a CD cover by release title
function communityImage(data, images) {
  const file = Object.keys(images).find((name) => name.startsWith('image.'))
  if (file) return images[file]
  return RELEASES.find((release) => release.title === data.imageFromRelease)?.cover ?? null
}

// community.json as written, plus what the pages need. The "members" ids become `memberPeople`,
// and `members` is their count, as the pages show it.
function createCommunity(id, data, images = {}) {
  const memberPeople = (data.members ?? []).map(resolvePerson)
  const community = {
    ...data,
    cmm: String(data.cmm ?? stableNumber(id, 100000, 9999999)),
    name: data.name ?? id,
    category: data.category ?? 'Outros',
    image: communityImage(data, images),
    owner: data.owner ? resolvePerson(data.owner) : null,
    moderators: (data.moderators ?? []).map(resolvePerson),
    topics: (data.topics ?? []).map((topic, index) => {
      const messages = resolveMessages(topic.messages ?? []).reverse()
      return { tid: String(index + 1), title: topic.title, messages, lastPost: messages.at(-1)?.date ?? null }
    }),
    polls: data.polls ?? [],
    created: data.created ? parseDate(data.created) : null,
    memberPeople,
    members: memberPeople.length,
  }
  communitiesByCmm.set(community.cmm, community)
  communitiesById.set(id, community)
  return community
}

// ---------- Resolving everything ----------

// The visitor is friends with the whole band
VISITOR.friends = BAND_MEMBERS.map(personOfAccount)

for (const [path, data] of Object.entries(communityFiles)) {
  const folder = folderOf(path)
  createCommunity(folder, data, imagesInFolder(communityImages, folder))
}

for (const account of accountsByUid.values()) {
  account.fans = (account.raw.fans ?? []).map(resolvePerson)
  // The communities that list this account among their members
  account.communities = [...communitiesById.values()].filter((community) =>
    community.memberPeople.some((person) => person.account === account),
  )
  account.testimonials = resolveMessages(account.raw.testimonials ?? [])
  account.updates = (account.raw.updates ?? []).map((update) => ({ ...update, date: parseDate(update.date) }))
}

// ---------- Lookups for the pages ----------

/** A band member's or the visitor's account, or undefined. */
export function getAccount(uid) {
  return uid ? accountsByUid.get(uid) : undefined
}

/** Someone mentioned on the site (fan, testimonial author...) without a profile of their own. */
export function getPersonWithoutProfile(uid) {
  return uid ? peopleByUid.get(uid) : undefined
}

export function getCommunity(cmm) {
  return cmm ? communitiesByCmm.get(cmm) : undefined
}

export { personOfAccount }

/** The people in a community, from its "members" list. */
export function membersOf(community) {
  return community.memberPeople
}

export function photoCount(account) {
  return account.albums.reduce((total, album) => total + album.photos.length, 0)
}

// Case- and accent-insensitive, so "jose" finds "José"
function normalize(text) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/** The header's search: people and communities whose name contains the query. */
export function search(query) {
  const wanted = normalize(query)
  const matches = (name) => normalize(name).includes(wanted)
  const people = [...[...accountsByUid.values()].map(personOfAccount), ...peopleByUid.values()]
  return {
    people: people.filter((person) => matches(person.name)),
    communities: [...communitiesByCmm.values()].filter((community) => matches(community.name)),
  }
}
