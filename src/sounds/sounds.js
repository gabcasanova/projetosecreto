/*
 * The system's sound effects: Windows XP's and MSN's own sounds, files in
 * this folder named after how the code asks for them ("msnOnline.wav" is
 * playSound('msnOnline')). They follow the taskbar's volume control (see
 * setSoundVolume).
 */
const files = import.meta.glob('./*.{wav,mp3}', { eager: true, import: 'default' })

const SOUNDS = Object.fromEntries(
  Object.entries(files).map(([path, src]) => [path.replace(/^\.\/|\.\w+$/g, ''), src]),
)

// The master volume, 0 to 1 (0 when muted); kept in step by the player (usePlayer)
let masterVolume = 1

export function setSoundVolume(volume) {
  masterVolume = volume
}

// While the media player is playing, MSN keeps quiet so it doesn't talk over the music
let musicPlaying = false

export function setMusicPlaying(playing) {
  musicPlaying = playing
}

// MSN's own "Sons" switch (Ferramentas, or the MSN icon in the notification area)
let msnMuted = false

export function setMsnMuted(muted) {
  msnMuted = muted
}

/**
 * Plays one of the sounds. Browsers refuse to play anything before the
 * visitor has clicked or typed on the page; with `retryWithin` (ms) a sound
 * refused that way plays on the first click or key press instead, as long
 * as that comes within the given time.
 */
export function playSound(name, { retryWithin = 0 } = {}) {
  const src = SOUNDS[name]
  if (!src || masterVolume <= 0) return null
  if ((musicPlaying || msnMuted) && name.startsWith('msn')) return null

  const audio = new Audio(src)
  audio.volume = masterVolume
  audio.play().catch((error) => {
    if (error.name === 'NotAllowedError' && retryWithin > 0) playOnFirstInteraction(audio, retryWithin)
  })
  // Callers that need to know when it ends (or to stop it) get the audio element; null when nothing played
  return audio
}

function playOnFirstInteraction(audio, within) {
  const giveUpAt = Date.now() + within
  const events = ['pointerdown', 'keydown']

  function play() {
    events.forEach((event) => window.removeEventListener(event, play, true))
    if (Date.now() > giveUpAt) return
    audio.volume = masterVolume
    audio.play().catch(() => {})
  }

  events.forEach((event) => window.addEventListener(event, play, true))
}
