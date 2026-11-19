import { useEffect, useState } from 'react'
import { playSound } from '../../sounds/sounds'
import hostPicture from './host/silvio.webp'

// If the sound can't play (volume off), the mouth still flaps for about as long as the line lasts
const SILENT_LINE_DURATION = 1300

/*
 * The host popping up to ask "Posso perguntare? Posso perguê?". A cut-out photo talking
 * like South Park's Canadians: the picture is cut across the mouth, and
 * the top of the head flaps up and down over a dark gap while the line
 * plays (see show-do-futebas.css). It says its line once each time it
 * appears.
 */
function Host() {
  const [talking, setTalking] = useState(true)

  useEffect(() => {
    const audio = playSound('possoPerguntar')
    if (!audio) {
      const timer = setTimeout(() => setTalking(false), SILENT_LINE_DURATION)
      return () => clearTimeout(timer)
    }
    const stop = () => setTalking(false)
    audio.addEventListener('ended', stop)
    // Changing your mind (Não) or the clock running out cuts him off
    return () => {
      audio.removeEventListener('ended', stop)
      audio.pause()
    }
  }, [])

  return (
    <div className={`sf-host ${talking ? 'talking' : ''}`} aria-hidden="true">
      <span className="sf-host-mouth" />
      <img className="sf-host-bottom" src={hostPicture} alt="" draggable={false} />
      <img className="sf-host-top" src={hostPicture} alt="" draggable={false} />
      <span className="sf-host-speech">
        Posso perguntare?
        <br />
        Posso perguê?
      </span>
    </div>
  )
}

export default Host
