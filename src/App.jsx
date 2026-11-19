import { useCallback, useState } from 'react'
import PlayerProvider from './apps/media-player/PlayerProvider'
import BootScreen from './components/BootScreen'
import Desktop from './components/Desktop'
import WelcomeBox from './components/WelcomeBox'
import { playSound } from './sounds/sounds'

/*
 * The computer's life: the boot screen, then just the wallpaper with the
 * welcome message, and only after OK the desktop itself starts (with XP's
 * startup tune; MSN signs in and everything else begins from that moment).
 * `stage` is 'boot', 'welcome' or 'running'.
 */
function App() {
  const [stage, setStage] = useState('boot')
  // Bumped when the computer "restarts" (after the virus's blue screen): a fresh desktop, a new MSN session
  const [bootCount, setBootCount] = useState(0)

  const showWelcome = useCallback(() => setStage('welcome'), [])

  const startDesktop = useCallback(() => {
    setStage('running')
    // Pressing OK is the visitor's first click, so the browser lets the sound play
    playSound('xpStartup')
  }, [])

  const reboot = useCallback(() => {
    setBootCount((count) => count + 1)
    setStage('boot')
  }, [])

  return (
    <PlayerProvider>
      {stage === 'running' && <Desktop key={bootCount} onReboot={reboot} />}
      {stage === 'welcome' && <WelcomeBox onOk={startDesktop} />}
      {stage === 'boot' && <BootScreen onDone={showWelcome} />}
    </PlayerProvider>
  )
}

export default App
