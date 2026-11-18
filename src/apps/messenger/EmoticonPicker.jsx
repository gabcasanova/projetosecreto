import { useCallback, useRef, useState } from 'react'
import useDismiss from '../../components/menu/useDismiss'
import emoticonsIcon from './assets/fmt-emoticons.png'
import { EMOTICONS } from './emoticons'
import { Caret } from './MsnParts'

/*
 * The smiley button on the format bar and the grid of emoticons it drops
 * down. Picking one hands its shortcut to `onPick`, which types it into the
 * message; the shortcut becomes the picture once the message is sent.
 */
function EmoticonPicker({ left, onPick }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(containerRef, open, close)

  return (
    <div ref={containerRef} className="msn-emoticon-picker" style={{ left }}>
      <button
        type="button"
        className={`msn-flat-button msn-format-button ${open ? 'open' : ''}`}
        title="Selecionar um emoticon"
        aria-label="Selecionar um emoticon"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <img src={emoticonsIcon} alt="" />
        <Caret />
      </button>
      {open && (
        <div className="msn-emoticon-grid" role="dialog" aria-label="Emoticons">
          {EMOTICONS.map((emoticon) => (
            <button
              key={emoticon.id}
              type="button"
              className="msn-emoticon-option"
              title={`${emoticon.label} ${emoticon.codes[0]}`}
              aria-label={emoticon.label}
              onClick={() => {
                onPick(emoticon.codes[0])
                close()
              }}
            >
              <img src={emoticon.src} alt="" width={19} height={19} draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default EmoticonPicker
