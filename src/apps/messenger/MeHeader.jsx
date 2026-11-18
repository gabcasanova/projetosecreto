import { useState } from 'react'
import { DropdownButton } from '../../components/menu/Menu'
import toggleIcon from './assets/icon-updown-16x15.png'
import logo from './assets/logo-msn-50x21.png'
import mailIcon from './assets/icon-mail.png'
import dpShadow from './assets/dp-shadow-50x5.png'
import { useMessenger } from './messengerContext'
import { Caret, DisplayPicture } from './MsnParts'
import { MY_STATUSES, myStatusInfo } from './statuses'

const PERSONAL_MESSAGE_PLACEHOLDER = '<Digite uma mensagem pessoal>'

/*
 * The top of the contact list: the msn logo, and "you" — your display
 * picture, name, status (which you can change) and personal message (which
 * you can edit in place). The round button folds the "you" part away.
 */
function MeHeader() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="msn-me">
      <div className="msn-me-caption">
        <button
          type="button"
          className={`msn-toggle ${collapsed ? 'selected' : ''}`}
          title={collapsed ? 'Mostrar a área pessoal' : 'Ocultar a área pessoal'}
          aria-label={collapsed ? 'Mostrar a área pessoal' : 'Ocultar a área pessoal'}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((current) => !current)}
        >
          <img src={toggleIcon} alt="" />
        </button>
        <img src={logo} alt="msn" className="msn-me-logo" />
        <span className="msn-me-brand">Messenger</span>
      </div>
      {!collapsed && <MeArea />}
    </div>
  )
}

function MeArea() {
  const { me, openPictureDialog } = useMessenger()

  return (
    <div className="msn-me-area">
      {/* Clicking your picture lets you pick another one, as in MSN */}
      <button type="button" className="msn-me-picture" title="Alterar a imagem de exibição" onClick={openPictureDialog}>
        <DisplayPicture src={me.picture} width={48} alt="Sua imagem de exibição" />
        <img src={dpShadow} alt="" className="msn-me-picture-shadow" />
      </button>
      <StatusChooser />
      <PersonalMessage />
      <div className="msn-me-bar">
        <button type="button" className="msn-flat-button msn-me-mail" title="Ir para a caixa de entrada" aria-label="Caixa de entrada" disabled>
          <img src={mailIcon} alt="" />
        </button>
      </div>
    </div>
  )
}

// Your name and "(Online) ▾": clicking it drops down the list of statuses
function StatusChooser() {
  const { me, setMyStatus } = useMessenger()
  const status = myStatusInfo(me.status)

  const items = MY_STATUSES.map((option) => ({
    label: option.label,
    icon: myStatusInfo(option.id).icon,
    action: () => setMyStatus(option.id),
  }))

  return (
    <div className="msn-status-chooser">
      <DropdownButton items={items} className="msn-status-button" title="Alterar o seu status">
        <span className="msn-me-name">{me.name}</span>
        <span className="msn-me-status">({status.label})</span>
        <Caret />
      </DropdownButton>
    </div>
  )
}

/*
 * The personal message under your name. Grey placeholder until you click it;
 * then it turns into a little text box. Enter or clicking away keeps the
 * text, Esc throws it away.
 */
function PersonalMessage() {
  const { me, setMyPersonalMessage } = useMessenger()
  const [draft, setDraft] = useState(null)
  const editing = draft !== null

  function finish(save) {
    if (!editing) return
    if (save) setMyPersonalMessage(draft.trim())
    setDraft(null)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') finish(true)
    if (event.key === 'Escape') finish(false)
  }

  return (
    <div className={`msn-psm ${editing ? 'editing' : ''}`}>
      {editing ? (
        <input
          className="msn-psm-input"
          value={draft}
          maxLength={128}
          autoFocus
          aria-label="Mensagem pessoal"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => finish(true)}
        />
      ) : (
        <button
          type="button"
          className={`msn-psm-text ${me.personalMessage ? '' : 'empty'}`}
          title="Digite uma mensagem pessoal para que os seus contatos a vejam"
          onClick={() => setDraft(me.personalMessage)}
        >
          {me.personalMessage || PERSONAL_MESSAGE_PLACEHOLDER}
        </button>
      )}
      <span className="msn-psm-caret">
        <Caret />
      </span>
    </div>
  )
}

export default MeHeader
