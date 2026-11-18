import ConversationHistory from './ConversationHistory'
import ConversationToolbar from './ConversationToolbar'
import MessageComposer from './MessageComposer'
import { useMessenger } from './messengerContext'
import { conversationMenus } from './msnMenus'
import { Caret, DisplayPicture, MsnMenuBar } from './MsnParts'
import './messenger.css'
import './conversation.css'

/*
 * An MSN Messenger 7.5 conversation window with one contact: toolbar band,
 * history, the box to type in, and both display pictures on the right.
 */
function Conversation({ contactId, closeWindow }) {
  const messenger = useMessenger()

  const contact = messenger.contacts.find((candidate) => candidate.id === contactId)
  const messages = messenger.conversationWith(contactId)
  if (!contact) return null

  // A nudge shakes the conversation window, like it did on the other end
  function nudge() {
    messenger.sendNudge(contactId)
    // Found through the DOM rather than a ref, since the menus (built while rendering) hold this function
    const windowElement = document.querySelector(`[data-conversation="${contactId}"]`)?.closest('[data-window]')
    if (!windowElement) return
    windowElement.classList.remove('msn-shaking')
    // Reading the layout restarts the animation if a shake is still going on
    void windowElement.offsetWidth
    windowElement.classList.add('msn-shaking')
    windowElement.addEventListener('animationend', () => windowElement.classList.remove('msn-shaking'), { once: true })
  }

  return (
    <div className="msn-window msn-cv" data-conversation={contactId}>
      <MsnMenuBar menus={conversationMenus(messenger, { nudge, closeWindow })} />
      <ConversationToolbar />
      <div className="msn-cv-body">
        <ConversationHistory
          contact={contact}
          myName={messenger.me.name}
          messages={messages}
          onLinkClick={messenger.clickVirusLink}
        />
        <MessageComposer
          status={lastReceivedNotice(messages)}
          onSend={(text) => messenger.sendMessage(contactId, text)}
          onNudge={nudge}
        />
        <div className="msn-cv-pictures">
          <div className="msn-cv-picture msn-cv-picture-contact">
            <DisplayPicture src={contact.picture} width={96} height={141} alt={contact.name} />
            <Caret />
          </div>
          {/* The little tab that slides the pictures panel in and out; just for show */}
          <span className="msn-cv-flyin" aria-hidden="true" />
          <button
            type="button"
            className="msn-cv-picture msn-cv-picture-mine"
            title="Alterar a imagem de exibição"
            onClick={messenger.openPictureDialog}
          >
            <DisplayPicture src={messenger.me.picture} width={96} alt={messenger.me.name} />
            <Caret />
          </button>
          <span className="msn-cv-webcam msn-inert-link">Obter uma webcam</span>
        </div>
      </div>
      <div className="msn-cv-footer">
        <span className="msn-cv-customize msn-inert-link">Clique aqui para personalizar o MSN Messenger</span>
      </div>
    </div>
  )
}

// "Última mensagem recebida às 21:04 em 13/11/2005." for the newest message from the contact
function lastReceivedNotice(messages) {
  const lastReceived = messages.findLast((message) => message.from !== 'me')
  if (!lastReceived) return ''
  const time = lastReceived.time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const date = lastReceived.time.toLocaleDateString('pt-BR')
  return `Última mensagem recebida às ${time} em ${date}.`
}

export default Conversation
