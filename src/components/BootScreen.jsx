import { useEffect, useState } from 'react'
import logo from '../assets/futeboldebairroxp.png'
import './boot-screen.css'

// How long the boot screen stays up, in ms (XP's lasted as long as the drivers took to load)
const BOOT_DURATION = 4500
// Then XP went black for a moment before the desktop came up
const BLACK_DURATION = 700

// XP drew its boot screen at 640×480 and the monitor stretched it
const STAGE_WIDTH = 640
const STAGE_HEIGHT = 480

/*
 * Windows XP's boot screen, laid out on XP's own 640×480 grid (measured
 * from an original screenshot) and scaled up to fill the window: the logo,
 * the rounded bar with three blue blocks jumping through it, and the
 * copyright line in the bottom-left corner. The bar's frame and blocks are
 * XP's own pixels, enlarged without smoothing.
 *
 * After BOOT_DURATION the screen goes black for a moment, as XP did, then
 * `onDone` removes it and shows the desktop that loaded underneath.
 */
function BootScreen({ onDone }) {
  const [phase, setPhase] = useState('boot')
  const scale = useStageScale()

  useEffect(() => {
    const toBlack = setTimeout(() => setPhase('black'), BOOT_DURATION)
    const done = setTimeout(onDone, BOOT_DURATION + BLACK_DURATION)
    return () => {
      clearTimeout(toBlack)
      clearTimeout(done)
    }
  }, [onDone])

  return (
    <div className="boot-screen" role="status" aria-label="Iniciando">
      {phase === 'boot' && (
        <div className="boot-stage" style={{ scale: String(scale) }}>
          <img src={logo} alt="Futebol de Bairro XP" className="boot-logo" draggable={false} />
          <div className="boot-bar" aria-hidden="true">
            <div className="boot-track">
              <div className="boot-blocks" />
            </div>
          </div>
          <p className="boot-copyright">Copyright © Futebol de Bairro</p>
        </div>
      )}
    </div>
  )
}

// How much the 640×480 stage is enlarged to fill the window, keeping its proportions
function useStageScale() {
  const [scale, setScale] = useState(fitScale)

  useEffect(() => {
    const update = () => setScale(fitScale())
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return scale
}

function fitScale() {
  return Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT)
}

export default BootScreen
