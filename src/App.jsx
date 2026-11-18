import { useCallback, useState } from 'react'
import PlayerProvider from './apps/media-player/PlayerProvider'
import BootScreen from './components/BootScreen'
import Desktop from './components/Desktop'
import { playSound } from './sounds/sounds'

function App() {
  // XP's boot screen comes first; the desktop loads underneath it
  const [booting, setBooting] = useState(true)
  // Bumped when the computer "restarts" (after the virus's blue screen): a fresh desktop, a new MSN session
  const [bootCount, setBootCount] = useState(0)
  // The desktop appears with XP's startup tune. On the very first boot the browser may hold it back
  // until the visitor clicks something; it then plays on that first click, if it comes soon enough
  const finishBooting = useCallback(() => {
    setBooting(false)
    playSound('xpStartup', { retryWithin: 15000 })
  }, [])

  const reboot = useCallback(() => {
    setBootCount((count) => count + 1)
    setBooting(true)
  }, [])

  return (
    <PlayerProvider>
      <Desktop key={bootCount} onReboot={reboot} />
      {booting && <BootScreen onDone={finishBooting} />}
    </PlayerProvider>
  )
}

export default App
