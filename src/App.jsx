import { useCallback, useMemo, useState } from 'react'
import PlayerProvider from './apps/media-player/PlayerProvider'
import BootScreen from './components/BootScreen'
import Desktop from './components/Desktop'
import WelcomeBox from './components/WelcomeBox'
import { DisplayScaleContext, SCALE_OPTIONS } from './hooks/displayScale'
import useStoredState from './hooks/useStoredState'
import { playSound } from './sounds/sounds'

/*
 * The computer's life: the boot screen, then just the wallpaper with the
 * welcome message (and XP's startup tune), and only after OK the desktop
 * itself starts (MSN signs in and everything else begins from that moment).
 * `stage` is 'boot', 'welcome' or 'running'.
 */
function App() {
  const [stage, setStage] = useState('boot')
  // Bumped when the computer "restarts" (after the virus's blue screen): a fresh desktop, a new MSN session
  const [bootCount, setBootCount] = useState(0)

  // On a first visit the browser holds sounds back until the visitor clicks something;
  // the tune then plays on that first click (usually the welcome box's OK)
  const showWelcome = useCallback(() => {
    setStage('welcome')
    playSound('xpStartup', { retryWithin: 60000 })
  }, [])

  const startDesktop = useCallback(() => setStage('running'), [])

  const reboot = useCallback(() => {
    setBootCount((count) => count + 1)
    setStage('boot')
  }, [])

  // How big the desktop is drawn, picked from the taskbar and remembered (see hooks/displayScale.js)
  const [storedScale, setScale] = useStoredState('display:scale', 1)
  const scale = SCALE_OPTIONS.includes(storedScale) ? storedScale : 1
  const displayScale = useMemo(() => ({ scale, setScale }), [scale, setScale])

  return (
    <PlayerProvider>
      <DisplayScaleContext.Provider value={displayScale}>
        {stage === 'running' && (
          // Zoomed as a whole. Percentage sizes aren't zoomed, so at 100% × 100% it still fills the screen exactly
          <div style={{ zoom: scale, width: '100%', height: '100%' }}>
            <Desktop key={bootCount} onReboot={reboot} />
          </div>
        )}
        {stage === 'welcome' && <WelcomeBox onOk={startDesktop} />}
        {stage === 'boot' && <BootScreen onDone={showWelcome} />}
      </DisplayScaleContext.Provider>
    </PlayerProvider>
  )
}

export default App
