import { Fragment, useState } from 'react'
import { albums, singles } from 'virtual:music-library'
import LibraryView from './LibraryView'
import NowPlayingView from './NowPlayingView'
import PlayerControls from './PlayerControls'
import { usePlayerContext } from './playerContext'
import { withViewTransition } from './viewTransition'
import VISUALIZATIONS from './visualizations'
import './media-player.css'

const TABS = [
  { id: 'library', label: 'Biblioteca' },
  { id: 'nowPlaying', label: 'Em execução' },
]

function MediaPlayer({ openWindow }) {
  const player = usePlayerContext()
  const navigation = useViewHistory('library')
  const [visualizationIndex, setVisualizationIndex] = useState(0)
  const [listPaneOpen, setListPaneOpen] = useState(true)

  // Every change of screen goes through a view transition (see media-player.css)
  function showView(view) {
    withViewTransition(() => navigation.goTo(view))
  }

  // Albums and singles play the same way: the whole release, from its first song
  function playRelease(release) {
    // Start the music outside the transition: browsers only allow audio straight after a click
    player.playAlbum(release)
    showView('nowPlaying')
  }

  function showNextVisualization() {
    withViewTransition(() => {
      setVisualizationIndex((index) => (index + 1) % VISUALIZATIONS.length)
      navigation.goTo('nowPlaying')
    })
  }

  // Releases with a back cover can be looked at as a 3D CD case in their own window
  function openCase(release) {
    openWindow('jewelCase', { release })
  }

  function toggleListPane() {
    withViewTransition(() => setListPaneOpen((open) => !open))
  }

  return (
    <div className="wmp flex h-[684px] flex-col">
      {/* Three columns with equal sides keep the tabs centered on the whole bar */}
      <nav className="wmp-navbar grid grid-cols-[1fr_auto_1fr] items-center px-1">
        <div className="flex">
          <button
            type="button"
            aria-label="Voltar"
            className="wmp-image-button wmp-history-button back"
            disabled={!navigation.canGoBack}
            onClick={() => withViewTransition(navigation.back)}
          />
          <button
            type="button"
            aria-label="Avançar"
            className="wmp-image-button wmp-history-button forward"
            disabled={!navigation.canGoForward}
            onClick={() => withViewTransition(navigation.forward)}
          />
        </div>

        <div className="flex items-center">
          {TABS.map((tab, index) => (
            <Fragment key={tab.id}>
              {index > 0 && <span className="wmp-navbar-separator" />}
              <button
                type="button"
                className={`wmp-tab ${navigation.view === tab.id ? 'active' : ''}`}
                onClick={() => showView(tab.id)}
              >
                {tab.label}
              </button>
            </Fragment>
          ))}
        </div>
      </nav>

      <main className="wmp-content min-h-0 flex-1">
        {navigation.view === 'library' ? (
          <LibraryView
            albums={albums}
            singles={singles}
            currentReleaseId={player.current?.album.id}
            onPlayRelease={playRelease}
          />
        ) : (
          <NowPlayingView
            player={player}
            visualization={VISUALIZATIONS[visualizationIndex]}
            listPaneOpen={listPaneOpen}
            onToggleListPane={toggleListPane}
            onOpenCase={openCase}
            onPlayAll={() => player.playAll([...albums, ...singles])}
            onGoToLibrary={() => showView('library')}
          />
        )}
      </main>

      <PlayerControls player={player} onNextVisualization={showNextVisualization} />
    </div>
  )
}

// Browser-style back/forward between the player's views
function useViewHistory(initialView) {
  const [history, setHistory] = useState([initialView])
  const [position, setPosition] = useState(0)

  function goTo(view) {
    if (view === history[position]) return
    // Going somewhere new drops any "forward" entries, like a browser does
    setHistory([...history.slice(0, position + 1), view])
    setPosition(position + 1)
  }

  return {
    view: history[position],
    canGoBack: position > 0,
    canGoForward: position < history.length - 1,
    goTo,
    back: () => setPosition(position - 1),
    forward: () => setPosition(position + 1),
  }
}

export default MediaPlayer
