import { AppleMusicGlyph, DeezerGlyph, SpotifyGlyph, YouTubeMusicGlyph } from './glyphs'

/*
 * The streaming services a release can link to, in the order they're shown.
 * `key` matches the name used in a release's info.json "links".
 * Each icon is a glossy Frutiger Aero orb in the service's colours with a
 * white glyph of its logo on top.
 */
export const SERVICES = [
  { key: 'spotify', name: 'Spotify', light: '#5cf08e', dark: '#0b7a34', Glyph: SpotifyGlyph },
  { key: 'deezer', name: 'Deezer', light: '#d08bff', dark: '#5410a3', Glyph: DeezerGlyph },
  { key: 'youtubemusic', name: 'YouTube Music', light: '#ff7a7a', dark: '#a50000', Glyph: YouTubeMusicGlyph },
  { key: 'applemusic', name: 'Apple Music', light: '#ff8fa2', dark: '#c7102f', Glyph: AppleMusicGlyph },
]
