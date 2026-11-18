import { useRef, useState } from 'react'
import EmoticonPicker from './EmoticonPicker'
import nudgeIcon from './assets/fmt-chamar-atencao.png'
import voiceClipIcon from './assets/fmt-clip-de-voz.png'
import fontIcon from './assets/fmt-fonte.png'
import packsIcon from './assets/fmt-pacotes.png'
import backgroundsIcon from './assets/fmt-planos-de-fundo.png'
import winksIcon from './assets/fmt-winks.png'
import inkPenIcon from './assets/tab-ink-pen.png'
import inkTextIcon from './assets/tab-ink-text-A.png'
import { Caret } from './MsnParts'

/*
 * The lower pane of a conversation: the format bar, the box you type in
 * with the Enviar button, and the status line underneath.
 * Enter sends, Shift+Enter starts a new line. Of the format bar only the
 * emoticons and "Chamar a atenção" (`onNudge`) work; the rest is greyed out.
 */
function MessageComposer({ status, onSend, onNudge }) {
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)
  const canSend = draft.trim() !== ''

  // An emoticon's shortcut goes where the cursor is, and typing carries on after it
  function insertEmoticon(code) {
    const input = inputRef.current
    const start = input.selectionStart
    const end = input.selectionEnd
    setDraft((current) => current.slice(0, start) + code + current.slice(end))
    requestAnimationFrame(() => {
      input.focus()
      input.setSelectionRange(start + code.length, start + code.length)
    })
  }

  function send() {
    if (!canSend) return
    onSend(draft.trim())
    setDraft('')
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return (
    <div className="msn-composer">
      <FormatBar onNudge={onNudge} onEmoticon={insertEmoticon} />
      <div className="msn-input-area">
        <textarea
          ref={inputRef}
          className="msn-input msn-scroll"
          value={draft}
          aria-label="Digite a sua mensagem"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="button" className="msn-send" disabled={!canSend} onClick={send}>
          Enviar
        </button>
      </div>
      <div className="msn-status-line">
        <span className="msn-status-text">{status}</span>
        <InkTabs />
      </div>
    </div>
  )
}

// `left` is where each button sits, as measured on MSN
const FORMAT_BUTTONS = [
  { id: 'font', icon: fontIcon, title: 'Alterar a fonte', left: 8 },
  { id: 'voiceClip', icon: voiceClipIcon, title: 'Gravar um clipe de voz', left: 76, label: 'Clipe de Voz' },
  { id: 'winks', icon: winksIcon, title: 'Enviar um wink', left: 158, caret: true },
  { id: 'backgrounds', icon: backgroundsIcon, title: 'Alterar o plano de fundo', left: 198, caret: true },
  { id: 'packs', icon: packsIcon, title: 'Pacotes', left: 238, caret: true },
]

// Where the emoticons button sits, between Fonte and Clipe de Voz
const EMOTICONS_LEFT = 34

function FormatBar({ onNudge, onEmoticon }) {
  return (
    <div className="msn-format-bar">
      <EmoticonPicker left={EMOTICONS_LEFT} onPick={onEmoticon} />
      {FORMAT_BUTTONS.map((button) => (
        <button
          key={button.id}
          type="button"
          className="msn-flat-button msn-format-button"
          style={{ left: button.left }}
          title={button.title}
          aria-label={button.title}
          disabled
        >
          <img src={button.icon} alt="" />
          {button.label && <span className="msn-format-label">{button.label}</span>}
          {button.caret && <Caret />}
        </button>
      ))}
      <button
        type="button"
        className="msn-flat-button msn-format-button msn-nudge-button"
        title="Chamar a atenção"
        aria-label="Chamar a atenção"
        onClick={onNudge}
      >
        <img src={nudgeIcon} alt="" />
      </button>
    </div>
  )
}

// Handwriting or text: MSN's two tabs at the right of the status line (text is the one in use)
function InkTabs() {
  return (
    <div className="msn-ink-tabs" aria-hidden="true">
      <span className="msn-ink-tab">
        <img src={inkPenIcon} alt="" />
      </span>
      <span className="msn-ink-tab selected">
        <img src={inkTextIcon} alt="" />
      </span>
    </div>
  )
}

export default MessageComposer
