import { createContext, useContext } from 'react'

// The music player shared by the Discografia window and the desktop widget
export const PlayerContext = createContext(null)

// Just the player's `unload`, which never changes: the desktop uses it without re-rendering on every tick
export const PlayerUnloadContext = createContext(() => {})

export function usePlayerContext() {
  return useContext(PlayerContext)
}

export function usePlayerUnload() {
  return useContext(PlayerUnloadContext)
}
