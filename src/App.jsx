import PlayerProvider from './apps/media-player/PlayerProvider'
import Desktop from './components/Desktop'

function App() {
  return (
    <PlayerProvider>
      <Desktop />
    </PlayerProvider>
  )
}

export default App
