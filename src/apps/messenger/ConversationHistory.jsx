import { useEffect, useRef } from 'react'
import scrollDownIcon from './assets/scroll-down.png'
import scrollUpIcon from './assets/scroll-up.png'
import EmoticonText from './EmoticonText'

// Made-up size for the fake file, as MSN showed next to every file sent
const LINK_FILE_SIZE = '(284 KB)'

/*
 * The upper pane of a conversation: the "Para:" bar with who you're talking
 * to, then the messages in MSN 7's format: "Fulano diz:" in grey, followed
 * by everything they said in a row, indented. Nudges get their own line.
 * It keeps scrolled to the newest message.
 */
function ConversationHistory({ contact, myName, messages, onLinkClick }) {
  const scrollerRef = useRef(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    scroller.scrollTop = scroller.scrollHeight
  }, [messages.length])

  const nameOf = (from) => (from === 'me' ? myName : contact.name)

  return (
    <div className="msn-history">
      <div className="msn-to-bar">
        <span className="msn-to-label">Para:</span>
        <span className="msn-to-contact">
          <b>{contact.name}</b> &lt;{contact.email}&gt;
        </span>
        {/* MSN's scroller for long lists of participants; there's only ever one here */}
        <span className="msn-to-scroll" aria-hidden="true">
          <img src={scrollUpIcon} alt="" />
          <img src={scrollDownIcon} alt="" />
        </span>
      </div>
      <div ref={scrollerRef} className="msn-history-messages msn-scroll" role="log" aria-label="Histórico da conversa">
        {groupMessages(messages).map((group) =>
          group.kind === 'nudge' ? (
            <NudgeLine key={group.id} fromMe={group.from === 'me'} name={nameOf(group.from)} />
          ) : (
            <div key={group.id} className="msn-message-group">
              <div className="msn-message-sender">{nameOf(group.from)} diz:</div>
              {group.messages.map((message) => (
                <div key={message.id} className="msn-message">
                  {message.kind === 'link' ? <FileLink name={message.text} onClick={onLinkClick} /> : <EmoticonText text={message.text} />}
                </div>
              ))}
            </div>
          ),
        )}
      </div>
    </div>
  )
}

function NudgeLine({ fromMe, name }) {
  return (
    <div className="msn-nudge-line">
      {fromMe ? 'Você acabou de chamar a atenção!' : `${name} chamou a sua atenção!`}
      <hr />
    </div>
  )
}

// A file someone sent: its name is a link (clicking it "opens" the file)
function FileLink({ name, onClick }) {
  return (
    <>
      <a
        href="#"
        className="msn-file-link"
        onClick={(event) => {
          event.preventDefault()
          onClick()
        }}
      >
        {name}
      </a>{' '}
      <span className="msn-file-size">{LINK_FILE_SIZE}</span>
    </>
  )
}

/*
 * Runs of messages from the same person share one "Fulano diz:" header;
 * a nudge always stands alone and breaks the run.
 */
function groupMessages(messages) {
  const groups = []
  for (const message of messages) {
    const last = groups.at(-1)
    if (message.kind === 'nudge') {
      groups.push({ id: message.id, kind: 'nudge', from: message.from })
    } else if (last && last.kind === 'messages' && last.from === message.from) {
      last.messages.push(message)
    } else {
      groups.push({ id: message.id, kind: 'messages', from: message.from, messages: [message] })
    }
  }
  return groups
}

export default ConversationHistory
