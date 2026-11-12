import { useRef, useState } from 'react'
import { SMILEYS } from '../smileys'
import RichText from './RichText'

// orkut cut scraps at 1024 characters
const MAX_LENGTH = 1024

/*
 * The "write a scrap" box at the top of a scrapbook: the text area, the
 * smiley buttons that type their code at the cursor, "postar recado" and a
 * preview of how the scrap will look.
 */
function ScrapForm({ onPost }) {
  const [text, setText] = useState('')
  const [previewing, setPreviewing] = useState(false)
  const textareaRef = useRef(null)

  function insertSmiley(code) {
    const textarea = textareaRef.current
    const start = textarea?.selectionStart ?? text.length
    const end = textarea?.selectionEnd ?? text.length
    const inserted = `${text.slice(0, start)}${code}${text.slice(end)}`.slice(0, MAX_LENGTH)
    setText(inserted)
    // Put the cursor back right after the smiley, once React has updated the text
    requestAnimationFrame(() => {
      textarea?.focus()
      textarea?.setSelectionRange(start + code.length, start + code.length)
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!text.trim()) return
    onPost(text.trim())
    setText('')
    setPreviewing(false)
  }

  return (
    <form className="scrapform" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        rows={6}
        value={text}
        maxLength={MAX_LENGTH}
        onChange={(event) => setText(event.target.value)}
        aria-label="escrever recado"
      />
      <div className="smileybar">
        {SMILEYS.map((smiley) => (
          <button
            key={smiley.code}
            type="button"
            title={smiley.label}
            aria-label={smiley.label}
            onClick={() => insertSmiley(smiley.code)}
          >
            <img src={smiley.image} alt="" />
          </button>
        ))}
        <span className="sml hint">você pode usar [b], [i], [u] e cores: [red]texto[/red]</span>
      </div>
      <button type="submit" className="grabtn" disabled={!text.trim()}>
        postar recado
      </button>{' '}
      <a
        href="#"
        className="sml"
        onClick={(event) => {
          event.preventDefault()
          setPreviewing((current) => !current)
        }}
      >
        {previewing ? 'ocultar' : 'visualizar'}
      </a>
      {previewing && (
        <div className="preview para">{text.trim() ? <RichText text={text} /> : <span className="sml">nada para visualizar</span>}</div>
      )}
    </form>
  )
}

export default ScrapForm
