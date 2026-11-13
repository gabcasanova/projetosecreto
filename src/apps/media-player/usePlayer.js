import { useCallback, useEffect, useRef, useState } from 'react'

// Pressing "previous" this far into a song restarts it instead of going back
const RESTART_THRESHOLD_SECONDS = 3

/**
 * Owns the <audio> element and the play queue. There's one for the whole
 * desktop (see PlayerProvider), shared by the Discografia window and the
 * media player widget.
 *
 * The queue is a list of { track, album } entries; `currentIndex` points at
 * the one that's loaded. An AnalyserNode is created on first play (browsers
 * only allow audio contexts after a user gesture) for the visualizer.
 */
function usePlayer() {
  const [audio] = useState(() => new Audio())
  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.8)
  const [muted, setMutedState] = useState(false)
  // Windows' own volume, from the speaker in the taskbar: it scales the player's volume and mutes everything
  const [masterVolume, setMasterVolume] = useState(1)
  const [masterMuted, setMasterMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [analyser, setAnalyser] = useState(null)
  const audioContext = useRef(null)

  const current = queue[currentIndex] ?? null

  // Mirror the audio element's state into React
  useEffect(() => {
    const handlers = {
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      timeupdate: () => setCurrentTime(audio.currentTime),
      loadedmetadata: () => setDuration(audio.duration),
    }
    for (const [event, handler] of Object.entries(handlers)) audio.addEventListener(event, handler)
    return () => {
      for (const [event, handler] of Object.entries(handlers)) audio.removeEventListener(event, handler)
    }
  }, [audio])

  // What actually comes out of the speakers: the player's volume within Windows' volume
  useEffect(() => {
    audio.volume = volume * masterVolume
    audio.muted = muted || masterMuted
  }, [audio, volume, muted, masterVolume, masterMuted])

  // Stop the music if the desktop itself goes away
  useEffect(() => {
    return () => {
      audio.pause()
      audio.removeAttribute('src')
      audioContext.current?.close()
      audioContext.current = null
    }
  }, [audio])

  // "ended" depends on the queue and the shuffle/repeat settings, so it's re-bound when they change
  useEffect(() => {
    function handleEnded() {
      const nextIndex = pickNextIndex()
      if (nextIndex === null) {
        setCurrentTime(0)
        return
      }
      loadAndPlay(queue, nextIndex)
    }
    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  })

  function ensureAnalyser() {
    if (audioContext.current) {
      audioContext.current.resume()
      return
    }
    const context = new AudioContext()
    const source = context.createMediaElementSource(audio)
    const analyserNode = context.createAnalyser()
    analyserNode.fftSize = 512
    analyserNode.smoothingTimeConstant = 0.8
    source.connect(analyserNode)
    analyserNode.connect(context.destination)
    audioContext.current = context
    setAnalyser(analyserNode)
  }

  function loadAndPlay(newQueue, index) {
    ensureAnalyser()
    setQueue(newQueue)
    setCurrentIndex(index)
    setCurrentTime(0)
    setDuration(newQueue[index].track.duration)
    audio.src = newQueue[index].track.url
    audio.play()
  }

  // Index of the song after the current one, or null when the queue is over
  function pickNextIndex() {
    if (queue.length === 0) return null
    if (shuffle && queue.length > 1) {
      let next = currentIndex
      while (next === currentIndex) next = Math.floor(Math.random() * queue.length)
      return next
    }
    if (currentIndex + 1 < queue.length) return currentIndex + 1
    return repeat ? 0 : null
  }

  function playAlbum(album, startIndex = 0) {
    const albumQueue = album.tracks.map((track) => ({ track, album }))
    loadAndPlay(albumQueue, startIndex)
  }

  function playAll(albums) {
    const everything = albums.flatMap((album) => album.tracks.map((track) => ({ track, album })))
    if (everything.length > 0) loadAndPlay(everything, 0)
  }

  // Jump to a song that's already in the queue (e.g. clicked in the list pane)
  function playQueueIndex(index) {
    if (queue[index]) loadAndPlay(queue, index)
  }

  function togglePlay() {
    if (!current) return
    ensureAnalyser()
    if (audio.paused) audio.play()
    else audio.pause()
  }

  function stop() {
    audio.pause()
    audio.currentTime = 0
    setCurrentTime(0)
  }

  function next() {
    const nextIndex = pickNextIndex()
    if (nextIndex !== null) loadAndPlay(queue, nextIndex)
  }

  function previous() {
    if (!current) return
    if (audio.currentTime > RESTART_THRESHOLD_SECONDS || currentIndex === 0) {
      audio.currentTime = 0
      return
    }
    loadAndPlay(queue, currentIndex - 1)
  }

  // Stops the music and empties the queue, as when the Discografia window is closed.
  // Stable, so the desktop can hold on to it without re-rendering as the music plays.
  const unload = useCallback(() => {
    audio.pause()
    audio.removeAttribute('src')
    setQueue([])
    setCurrentIndex(-1)
    setCurrentTime(0)
    setDuration(0)
  }, [audio])

  function seek(time) {
    audio.currentTime = time
    setCurrentTime(time)
  }

  // The audio element itself is updated by the effect above
  function setVolume(value) {
    setVolumeState(value)
    if (value > 0 && muted) setMutedState(false)
  }

  return {
    queue,
    currentIndex,
    current,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    shuffle,
    repeat,
    analyser,
    playAlbum,
    playAll,
    playQueueIndex,
    togglePlay,
    stop,
    next,
    previous,
    seek,
    setVolume,
    unload,
    toggleMute: () => setMutedState(!muted),
    masterVolume,
    masterMuted,
    setMasterVolume,
    toggleMasterMute: () => setMasterMuted((value) => !value),
    toggleShuffle: () => setShuffle((value) => !value),
    toggleRepeat: () => setRepeat((value) => !value),
  }
}

export default usePlayer
