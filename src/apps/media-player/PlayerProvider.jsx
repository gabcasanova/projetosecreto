import { PlayerContext, PlayerUnloadContext } from './playerContext'
import usePlayer from './usePlayer'

/*
 * Keeps one music player for the whole desktop. Only the components that
 * read the player (usePlayerContext) re-render as the music plays; the rest
 * of the desktop is passed in as `children` and stays put.
 */
function PlayerProvider({ children }) {
  const player = usePlayer()
  return (
    <PlayerUnloadContext.Provider value={player.unload}>
      <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>
    </PlayerUnloadContext.Provider>
  )
}

export default PlayerProvider
