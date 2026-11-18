import brandIcon from './assets/toast-brand-icon.png'
import EmoticonText from './EmoticonText'
import { DisplayPicture } from './MsnParts'
import './messenger.css'
import './toasts.css'

/*
 * MSN's little popups in the bottom-right corner ("Fulano / acabou de
 * entrar.", "Fulano diz: / …"). Each one slides up out of the taskbar,
 * newer ones stack above older ones, and they slide back down on their own
 * (`leaving`). Clicking one opens that conversation; × just closes it.
 * `toasts` are { id, contactId, picture, title, text, leaving }.
 */
function MessengerToasts({ toasts, onOpen, onClose }) {
  return (
    <div className="msn-toasts" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="msn-toast-slot">
          <Toast
            toast={toast}
            onOpen={() => {
              onOpen(toast.contactId)
              onClose(toast.id)
            }}
            onClose={() => onClose(toast.id)}
          />
        </div>
      ))}
    </div>
  )
}

function Toast({ toast, onOpen, onClose }) {
  return (
    <div className={`msn-window msn-toast ${toast.leaving ? 'leaving' : ''}`} role="status">
      <div className="msn-toast-header">
        <img src={brandIcon} alt="" />
        <span>MSN Messenger</span>
        <button type="button" className="msn-toast-close" title="Fechar" aria-label="Fechar" onClick={onClose} />
      </div>
      <div className="msn-toast-frame">
        <div className="msn-toast-options">
          <span className="msn-inert-link">Opções</span>
        </div>
        <button type="button" className="msn-toast-client" onClick={onOpen}>
          <DisplayPicture src={toast.picture} width={45} />
          <span className="msn-toast-text">
            <span className="msn-toast-line">{toast.title}</span>
            <span className="msn-toast-line">
              <EmoticonText text={toast.text} />
            </span>
          </span>
        </button>
        <div className="msn-toast-footer" />
      </div>
    </div>
  )
}

export default MessengerToasts
