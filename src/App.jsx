import { useCallback, useState } from 'react'
import PlayerProvider from './apps/media-player/PlayerProvider'
import BootScreen from './components/BootScreen'
import Desktop from './components/Desktop'

function App() {
  // XP's boot screen comes first; the desktop loads underneath it
  const [booting, setBooting] = useState(true)
  const finishBooting = useCallback(() => setBooting(false), [])

  return (
    <PlayerProvider>
      <Desktop />
      {booting && <BootScreen onDone={finishBooting} />}
    </PlayerProvider>
  )
}

export default App
