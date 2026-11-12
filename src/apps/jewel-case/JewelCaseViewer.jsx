import { useCallback, useEffect, useState } from 'react'
import Booklet from './Booklet'
import CaseLoading from './CaseLoading'
import JewelCaseScene from './three/JewelCaseScene'
import './jewel-case.css'

/**
 * A window showing an album's CD case in 3D.
 *
 * Drag to turn it around, scroll to zoom. Clicking the closed case opens
 * the lid, showing the disc and the booklet held inside the lid. From there,
 * clicking the booklet takes it out to read, and clicking the disc lifts it
 * out to look at from every side.
 */
function JewelCaseViewer({ release }) {
  // Re-keyed per album so opening another album starts with a fresh, closed case
  return <CaseStage key={release.id} release={release} />
}

function CaseStage({ release }) {
  // The 3D scene mounts a moment after the window appears, so the loading screen gets painted first
  const [sceneStarted, setSceneStarted] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const markSceneReady = useCallback(() => setSceneReady(true), [])
  const [lidOpen, setLidOpen] = useState(false)
  const [bookletOut, setBookletOut] = useState(false)
  const [discOut, setDiscOut] = useState(false)
  // Counts how often the booklet came out; a fresh booklet each time means it starts closed again
  const [timesBookletTakenOut, setTimesBookletTakenOut] = useState(0)
  // The booklet's first page is always the front cover, like a real CD booklet
  const bookletPages = release.booklet.length > 0 ? [release.cover, ...release.booklet] : []

  useEffect(() => {
    const timer = setTimeout(() => setSceneStarted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  function takeOutBooklet() {
    if (bookletPages.length === 0 || discOut) return
    setTimesBookletTakenOut((count) => count + 1)
    setBookletOut(true)
  }

  // One button at the bottom, putting back whatever is out (or closing the case once nothing is)
  const closeAction = bookletOut
    ? { label: 'Guardar o encarte', run: () => setBookletOut(false) }
    : discOut
      ? { label: 'Guardar o disco', run: () => setDiscOut(false) }
      : { label: 'Fechar o estojo', run: () => setLidOpen(false) }

  return (
    <div className={`jc-stage relative h-[600px] ${bookletOut ? 'booklet-out' : ''}`}>
      <div className="jc-canvas absolute inset-0">
        {sceneStarted && (
          <JewelCaseScene
            release={release}
            open={lidOpen}
            // While the booklet is out of the case, the lid shows empty
            bookletInside={!bookletOut}
            discOut={discOut}
            onCoverClick={() => setLidOpen(true)}
            onBookletClick={takeOutBooklet}
            onDiscClick={() => setDiscOut(true)}
            onReady={markSceneReady}
          />
        )}
      </div>

      {/* Covers the scene until its pictures are loaded and its shaders compiled */}
      {!sceneReady && <CaseLoading className="absolute inset-0 z-10" />}

      {bookletPages.length > 0 && (
        <Booklet key={timesBookletTakenOut} pages={bookletPages} visible={bookletOut} />
      )}

      {lidOpen && (
        <button
          type="button"
          className="jc-button absolute bottom-4 left-1/2 -translate-x-1/2"
          onClick={closeAction.run}
        >
          {closeAction.label}
        </button>
      )}
    </div>
  )
}

export default JewelCaseViewer
