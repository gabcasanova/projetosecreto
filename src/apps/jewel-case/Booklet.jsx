import { useState } from 'react'
import usePanZoom from './usePanZoom'

/**
 * A CD booklet as a little book. Pages are printed two to a leaf (front and
 * back), and each leaf turns around the spine on its left.
 *
 * "Anterior" and "Próximo" turn the pages; the wheel zooms and dragging moves
 * the booklet around, like looking at a photo, so the small print is readable.
 * With an odd number of pages the last one has nothing printed on its back,
 * so it stays put as the final right-hand page instead of turning over onto
 * blank paper.
 */
function Booklet({ pages, visible }) {
  const leaves = pairUp(pages)
  const lastLeafHasBack = leaves.at(-1)[1] !== undefined
  // How many leaves can be turned at most
  const maxTurned = lastLeafHasBack ? leaves.length : leaves.length - 1
  // How many leaves have been turned over to the left
  const [turned, setTurned] = useState(0)
  // The leaf currently mid-turn is drawn above the rest so it never slips under them
  const [turningLeaf, setTurningLeaf] = useState(null)
  const view = usePanZoom()

  function turnForward() {
    setTurningLeaf(turned)
    setTurned(turned + 1)
  }

  function turnBack() {
    setTurningLeaf(turned - 1)
    setTurned(turned - 1)
  }

  // Closed, the cover sits alone on the right; fully turned, the last page sits alone on the left.
  // Shift the book so whatever is showing stays centered.
  const position = turned === 0 ? 'closed' : turned === leaves.length ? 'finished' : 'open'

  return (
    <div className={`jc-booklet-view ${visible ? 'visible' : ''} ${view.dragging ? 'dragging' : ''}`} {...view.handlers}>
      <div className="jc-booklet-zoom" style={{ transform: view.transform }}>
        <div className={`jc-booklet ${visible ? 'visible' : ''} ${position}`}>
          {leaves.map(([front, back], index) => {
            const isTurned = index < turned
            return (
              <div
                key={index}
                className={`jc-leaf ${isTurned ? 'turned' : ''}`}
                style={{ zIndex: leafZIndex(index, isTurned, turningLeaf, leaves.length) }}
                onTransitionEnd={() => setTurningLeaf(null)}
              >
                <div className="jc-page jc-page-front">
                  <img src={front} alt="" draggable={false} />
                </div>
                <div className="jc-page jc-page-back">{back && <img src={back} alt="" draggable={false} />}</div>
              </div>
            )
          })}
        </div>
      </div>

      <button type="button" className="jc-button absolute bottom-4 left-4" disabled={turned === 0} onClick={turnBack}>
        ◀ Anterior
      </button>
      <button
        type="button"
        className="jc-button absolute right-4 bottom-4"
        disabled={turned >= maxTurned}
        onClick={turnForward}
      >
        Próximo ▶
      </button>
    </div>
  )
}

// [a, b, c, d, e] -> [[a, b], [c, d], [e, undefined]]
function pairUp(pages) {
  const leaves = []
  for (let i = 0; i < pages.length; i += 2) leaves.push([pages[i], pages[i + 1]])
  return leaves
}

/*
 * Unturned leaves stack with the first one on top (it's the one you can see);
 * turned leaves stack with the most recently turned one on top.
 */
function leafZIndex(index, isTurned, turningLeaf, leafCount) {
  if (index === turningLeaf) return leafCount * 2
  return isTurned ? index + 1 : leafCount - index
}

export default Booklet
