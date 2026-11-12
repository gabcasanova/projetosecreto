import { albums as musicAlbums, singles as musicSingles } from 'virtual:music-library'
import { COMMUNITIES } from './communities'
import visitorData from './visitor.json'

/*
 * Everything the site shows, loaded once: the band members' profiles (one
 * folder each in ../profiles), the visitor's account and the communities.
 *
 * People show up in many places (friends, fans, scrap authors...). In the
 * data they are written as a plain name ("Ricardo"), as { name, friends }
 * or, for someone who has a real profile, as { uid, name }. Here they all
 * become "person" objects: { uid, name, photo, friendCount, account }, where
 * `account` is set only for people with a real profile (or the visitor).
 * People without a profile still get a stable made-up uid, so their links
 * lead to a "perfil privado" page instead of an error.
 */

const profileFiles = import.meta.glob('../profiles/*/profile.json', { eager: true, import: 'default' })
const profileImages = import.meta.glob('../profiles/*/*.{jpg,jpeg,png,gif,webp}', { eager: true, import: 'default' })

const accountsByUid = new Map()
const peopleByUid = new Map()
const communitiesByCmm = new Map()
const communitiesByName = new Map()

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
function uidForName(name) {
  const digits = String(hashString(name, 1)).padStart(10, '0') + String(hashString(name, 2)).padStart(10, '0')
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

function imagesInFolder(folder) {
  const images = {}
  for (const [path, url] of Object.entries(profileImages)) {
    if (folderOf(path) === folder) images[path.split('/').at(-1)] = url
  }
  return images
}

// The JSON as written, plus what the site needs. References to people are resolved later,
// once every account exists, so profiles can point at each other.
function createAccount(raw, { folder = null, isVisitor = false } = {}) {
  const images = folder ? imagesInFolder(folder) : {}
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
    social: raw.social ?? {},
    professional: raw.professional ?? {},
    personal: raw.personal ?? {},
    ratings: { trust: 0, cool: 0, sexy: 0, ...raw.ratings },
    videoCount: raw.videoCount ?? 0,
    albums: buildAlbums(raw.albums ?? [], images),
    // Filled in by resolveAccount()
    friends: [],
    fans: [],
    communities: [],
    scraps: [],
    testimonials: [],
    updates: [],
  }
}

for (const [path, raw] of Object.entries(profileFiles)) {
  const account = createAccount(raw, { folder: folderOf(path) })
  accountsByUid.set(account.uid, account)
}

/** The fan account the visitor is logged in as. */
export const VISITOR = createAccount(visitorData, { isVisitor: true })
accountsByUid.set(VISITOR.uid, VISITOR)

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
    // A getter, since friend lists are still being filled in when these are first made
    get friendCount() {
      return account.friends.length
    },
  }
}

/** Turns a person as written in the data ("Ricardo", { name, friends } or { uid, name }) into a person. */
export function resolvePerson(ref) {
  const { uid, name = 'Desconhecido', friends } = typeof ref === 'string' ? { name: ref } : ref
  const account = uid && accountsByUid.get(String(uid))
  if (account) return personOfAccount(account)

  const personUid = uid ? String(uid) : uidForName(name)
  // The first mention of someone wins, so their friend count is the same everywhere
  if (!peopleByUid.has(personUid)) {
    peopleByUid.set(personUid, {
      uid: personUid,
      name,
      photo: null,
      account: null,
      friendCount: friends ?? stableNumber(name, 40, 600),
    })
  }
  return peopleByUid.get(personUid)
}

// Scraps, testimonials and forum posts: newest first, each with an id for React and for deleting
function resolveMessages(messages) {
  return messages
    .map((message, index) => ({
      id: `seed-${index}`,
      from: resolvePerson(message.from),
      date: new Date(message.date),
      text: message.text,
    }))
    .sort((a, b) => b.date - a.date)
}

// ---------- Communities ----------

function createCommunity(data) {
  return {
    ...data,
    image: data.image ?? null,
    owner: data.owner ? resolvePerson(data.owner) : null,
    moderators: (data.moderators ?? []).map(resolvePerson),
    topics: (data.topics ?? []).map((topic, index) => {
      const messages = resolveMessages(topic.messages ?? []).reverse()
      return { tid: String(index + 1), title: topic.title, messages, lastPost: messages.at(-1)?.date ?? null }
    }),
    polls: data.polls ?? [],
    memberNames: data.memberNames ?? [],
    related: data.related ?? [],
  }
}

function addCommunity(community) {
  communitiesByCmm.set(community.cmm, community)
  communitiesByName.set(community.name, community)
  return community
}

// A community only known by name (a profile joined it, but it isn't in communities.js)
function communityNamed(name) {
  return (
    communitiesByName.get(name) ??
    addCommunity(createCommunity({ cmm: String(stableNumber(name, 100000, 9999999)), name, members: stableNumber(name, 3000, 80000), category: 'Outros' }))
  )
}

// ---------- Resolving everything ----------

// Friends first: the friend counts given there are the ones that stick
for (const account of accountsByUid.values()) {
  if (account.isVisitor) continue
  // Everyone in the band is friends with the visitor too
  account.friends = (account.raw.friends ?? []).map(resolvePerson)
}
for (const account of BAND_MEMBERS) account.friends.push(personOfAccount(VISITOR))
VISITOR.friends = BAND_MEMBERS.map(personOfAccount)

for (const data of COMMUNITIES) addCommunity(createCommunity(data))

for (const account of accountsByUid.values()) {
  account.fans = (account.raw.fans ?? []).map(resolvePerson)
  account.communities = (account.raw.communities ?? []).map(communityNamed)
  account.scraps = resolveMessages(account.raw.scraps ?? [])
  account.testimonials = resolveMessages(account.raw.testimonials ?? [])
  account.updates = (account.raw.updates ?? []).map((update) => ({ ...update, date: new Date(update.date) }))
}

// Related communities and community members can be people and communities mentioned nowhere else
for (const community of [...communitiesByCmm.values()]) {
  community.related = community.related.map(communityNamed)
  community.memberNames.forEach(resolvePerson)
}

// ---------- Lookups for the pages ----------

/** A band member's or the visitor's account, or undefined. */
export function getAccount(uid) {
  return uid ? accountsByUid.get(uid) : undefined
}

/** Someone mentioned on the site (friend, fan, scrap author...) without a profile of their own. */
export function getPersonWithoutProfile(uid) {
  return uid ? peopleByUid.get(uid) : undefined
}

export function getCommunity(cmm) {
  return cmm ? communitiesByCmm.get(cmm) : undefined
}

export { personOfAccount }

/** A profile's friends with the other band members first (the visitor stays at the end). */
export function friendsOf(account) {
  const isBandMember = (person) => Boolean(person.account && !person.account.isVisitor)
  return [...account.friends].sort((a, b) => Number(isBandMember(b)) - Number(isBandMember(a)))
}

/** The people shown in a community's members box: profiles that joined it, then its listed fans. */
export function membersOf(community) {
  const accounts = [...BAND_MEMBERS, VISITOR].filter((account) => account.communities.includes(community))
  return [...accounts.map(personOfAccount), ...community.memberNames.map(resolvePerson)]
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
