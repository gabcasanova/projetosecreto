import { useState } from 'react'
import { formatTotalDuration } from './formatTime'
import { albumArtTransitionName } from './viewTransition'

// Album cover sizes (px) the zoom slider moves between
const MIN_COVER_SIZE = 110
const MAX_COVER_SIZE = 280
const DEFAULT_COVER_SIZE = 190
// Singles are shown smaller than albums, at this fraction of the album size
const SINGLE_COVER_SCALE = 0.6
// Delay between tiles floating in, so they arrive one after another
const ENTRANCE_STAGGER_MS = 45

function LibraryView({ albums, singles, currentReleaseId, onPlayRelease }) {
  const [coverSize, setCoverSize] = useState(DEFAULT_COVER_SIZE)
  const isEmpty = albums.length === 0 && singles.length === 0

  return (
    <div className="wmp-library flex h-full flex-col bg-white">
      <div className="wmp-library-toolbar flex shrink-0 items-center justify-end gap-2 px-3">
        <ZoomSlider value={coverSize} onChange={setCoverSize} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        <ReleaseSection
          title="Albums"
          releases={albums}
          coverSize={coverSize}
          firstTileIndex={0}
          currentReleaseId={currentReleaseId}
          onPlayRelease={onPlayRelease}
        />
        <ReleaseSection
          title="Singles"
          releases={singles}
          coverSize={Math.round(coverSize * SINGLE_COVER_SCALE)}
          // Continue the entrance stagger where the albums left off
          firstTileIndex={albums.length}
          currentReleaseId={currentReleaseId}
          onPlayRelease={onPlayRelease}
        />

        {isEmpty && <p className="mt-6 text-center text-[#6d6d6d]">No music found.</p>}
      </div>
    </div>
  )
}

// A heading ("Albums", "Singles") followed by its covers; hidden when there's nothing in it
function ReleaseSection({ title, releases, coverSize, firstTileIndex, currentReleaseId, onPlayRelease }) {
  if (releases.length === 0) return null

  return (
    <section>
      <h2 className="wmp-section-header">{title}</h2>
      {/* Releases arrive already sorted, highest folder number first, so no extra sorting here */}
      <div className="flex flex-wrap gap-x-3 gap-y-4">
        {releases.map((release, index) => (
          <ReleaseTile
            key={release.id}
            release={release}
            coverSize={coverSize}
            entranceDelay={(firstTileIndex + index) * ENTRANCE_STAGGER_MS}
            isPlaying={release.id === currentReleaseId}
            onPlay={() => onPlayRelease(release)}
          />
        ))}
      </div>
    </section>
  )
}

// Small squares on one end, a big square on the other, like Explorer's icon size slider
function ZoomSlider({ value, onChange }) {
  return (
    <label className="flex items-center gap-1.5 text-[#4c607a]">
      <span className="wmp-zoom-icon small" aria-hidden="true" />
      <input
        type="range"
        aria-label="Cover art size"
        className="wmp-zoom-slider"
        min={MIN_COVER_SIZE}
        max={MAX_COVER_SIZE}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="wmp-zoom-icon large" aria-hidden="true" />
    </label>
  )
}

function ReleaseTile({ release, coverSize, entranceDelay, isPlaying, onPlay }) {
  const totalDuration = release.tracks.reduce((total, track) => total + track.duration, 0)
  const songCount = release.tracks.length === 1 ? '1 song' : `${release.tracks.length} songs`

  return (
    <button
      type="button"
      className={`wmp-album-tile flex flex-col items-center gap-0.5 ${isPlaying ? 'playing' : ''}`}
      style={{ width: coverSize + 14, animationDelay: `${entranceDelay}ms` }}
      title={`${release.title}\n${release.artist} · ${release.year}\n${songCount}, ${formatTotalDuration(totalDuration)}`}
      onClick={onPlay}
    >
      <img
        src={release.cover}
        alt=""
        className="wmp-album-cover mb-1 object-cover"
        style={{ width: coverSize, height: coverSize, viewTransitionName: albumArtTransitionName(release) }}
      />
      <span className="line-clamp-2 w-full text-center leading-tight text-black">{release.title}</span>
      <span className="w-full truncate text-center text-[#6d6d6d]">{release.artist}</span>
      {release.year && <span className="w-full text-center text-[#8a8a8a]">{release.year}</span>}
    </button>
  )
}

export default LibraryView
