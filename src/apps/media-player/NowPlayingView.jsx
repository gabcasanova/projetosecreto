import listPaneHideIcon from '../../assets/wmp/list-pane-hide.png'
import listPaneShowIcon from '../../assets/wmp/list-pane-show.png'
import { formatTime } from './formatTime'
import { albumArtTransitionName } from './viewTransition'
import Visualizer from './Visualizer'

function NowPlayingView({ player, visualization, listPaneOpen, onToggleListPane, onPlayAll, onGoToLibrary }) {
  if (!player.current) {
    return <EmptyNowPlaying onPlayAll={onPlayAll} onGoToLibrary={onGoToLibrary} />
  }

  const { track, album } = player.current

  return (
    <div className="flex h-full">
      <div className="relative min-w-0 flex-1">
        <Visualizer analyser={player.analyser} isPlaying={player.isPlaying} visualization={visualization} />

        {/* WMP briefly names the visualization when it changes; re-keyed so the fade restarts */}
        <p key={visualization.id} className="wmp-visualization-name absolute top-3 left-4">
          {visualization.name}
        </p>

        {/* Re-keyed per song so the fade-out animation restarts on every track change */}
        <div key={track.url} className="wmp-track-info absolute bottom-4 left-4">
          <p className="text-base text-white">{track.title}</p>
          <p className="text-[#a9bedb]">{album.artist}</p>
          <p className="text-[#a9bedb]">{album.title}</p>
        </div>

        {!listPaneOpen && (
          <button type="button" aria-label="Show list" className="absolute top-2 right-2" onClick={onToggleListPane}>
            <img src={listPaneShowIcon} alt="" />
          </button>
        )}
      </div>

      {listPaneOpen && <ListPane player={player} onHide={onToggleListPane} />}
    </div>
  )
}

// The pane on the right: album art, album title, and the songs in the queue
function ListPane({ player, onHide }) {
  const { album } = player.current

  return (
    <aside className="wmp-list-pane flex w-[200px] shrink-0 flex-col">
      <div className="relative flex flex-col items-center px-3 pt-3 pb-2">
        <button type="button" aria-label="Hide list" className="absolute top-2 right-2" onClick={onHide}>
          <img src={listPaneHideIcon} alt="" />
        </button>
        <img
          src={album.cover}
          alt=""
          className="wmp-list-pane-art size-[132px] object-cover"
          // Shares its name with the library tile, so the cover glides here when an album starts
          style={{ viewTransitionName: albumArtTransitionName(album) }}
        />
        <RatingStars />
        <p className="wmp-list-pane-album text-center">{album.title}</p>
      </div>

      <div className="wmp-list-pane-header flex items-center gap-1 px-2">
        Now Playing <span className="text-[8px]">▼</span>
      </div>

      <ol className="min-h-0 flex-1 overflow-y-auto py-1">
        {player.queue.map(({ track }, index) => (
          <li key={track.url}>
            <button
              type="button"
              className={`wmp-list-pane-song flex w-full items-center gap-2 px-2 ${
                index === player.currentIndex ? 'current' : ''
              }`}
              onDoubleClick={() => player.playQueueIndex(index)}
              title="Double-click to play"
            >
              <span className="min-w-0 flex-1 truncate text-left">{track.title}</span>
              <span className="wmp-list-pane-duration">{formatTime(track.duration)}</span>
            </button>
          </li>
        ))}
      </ol>
    </aside>
  )
}

// WMP's five empty rating stars; purely decorative here
function RatingStars() {
  return (
    <div className="mt-2 flex gap-px" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width="12" height="12" viewBox="0 0 12 12">
          <path
            d="M6 .8l1.5 3.4 3.7.3-2.8 2.4.9 3.6L6 8.6 2.7 10.5l.9-3.6L.8 4.5l3.7-.3z"
            fill="#f4f6fa"
            stroke="#a7b1c2"
            strokeWidth="0.8"
          />
        </svg>
      ))}
    </div>
  )
}

// What WMP shows in Now Playing before anything has been played
function EmptyNowPlaying({ onPlayAll, onGoToLibrary }) {
  return (
    <div className="wmp-now-playing-empty flex h-full flex-col items-center justify-center gap-2">
      <button type="button" className="wmp-empty-link" onClick={onPlayAll}>
        <span className="text-[10px]">▶</span> Play all music
      </button>
      <button type="button" className="wmp-empty-link" onClick={onGoToLibrary}>
        <span className="text-[10px]">▤</span> Go to library
      </button>
    </div>
  )
}

export default NowPlayingView
