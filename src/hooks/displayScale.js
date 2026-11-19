import { createContext, useContext } from 'react'

/*
 * The screen's zoom, picked from the taskbar for big monitors (1 = 100%).
 * The whole desktop is drawn bigger with CSS `zoom` (see App.jsx). Pointer
 * events and window.innerWidth stay in real screen pixels, so code that
 * places things under the pointer divides by the scale to get back to the
 * desktop's own pixels.
 */
export const SCALE_OPTIONS = [1, 1.25, 1.5, 1.75, 2]

export const DisplayScaleContext = createContext({ scale: 1, setScale: () => {} })

/** { scale, setScale } */
export function useDisplayScale() {
  return useContext(DisplayScaleContext)
}
