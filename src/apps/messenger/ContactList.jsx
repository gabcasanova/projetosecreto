import { useEffect } from 'react'
import addContactIcon from './assets/icon-add-contact.png'
import infoIcon from './assets/icon-info.png'
import backpackTab from './assets/tab-partner-backpack.png'
import eyeTab from './assets/tab-partner-eye.png'
import gratisTab from './assets/tab-partner-gratis.png'
import heartTab from './assets/tab-partner-heart.png'
import palmTab from './assets/tab-partner-palm.png'
import tTab from './assets/tab-partner-t.png'
import BuddyList from './BuddyList'
import MeHeader from './MeHeader'
import { useMessenger } from './messengerContext'
import { contactListMenus } from './msnMenus'
import { MsnMenuBar } from './MsnParts'
import { myStatusInfo } from './statuses'
import './messenger.css'
import './contact-list.css'

// The partner tabs down the left side (MSN's ad-supported tabs; they do nothing here)
const PARTNER_TABS = [
  { image: backpackTab, title: 'MSN Escola' },
  { image: palmTab, title: 'MSN Viagens' },
  { image: eyeTab, title: 'MSN Imagens' },
  { image: tTab, title: 'MSN Tabs' },
  { image: heartTab, title: 'MSN Namoro' },
  { image: gratisTab, title: 'Downloads grátis' },
]

/*
 * MSN Messenger 7.5's main window: the contact list. You're signed in from the
 * start; opening it the first time starts Marcio's countdown (see MessengerProvider).
 */
function ContactList({ closeWindow }) {
  const messenger = useMessenger()
  const { contactListOpened } = messenger

  useEffect(() => {
    contactListOpened()
    // Only when the window opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="msn-window msn-cl">
      <MsnMenuBar menus={contactListMenus(messenger, closeWindow)} />
      <MeHeader />
      <div className="msn-cl-panel">
        <TabStrip contactsIcon={myStatusInfo(messenger.me.status).tabIcon} />
        <div className="msn-cl-content">
          <InfoBar />
          <button type="button" className="msn-add-contact" disabled>
            <img src={addContactIcon} alt="" />
            <span>Adicionar um Contato</span>
          </button>
          <BuddyList contacts={messenger.contacts} onOpen={messenger.openConversation} />
        </div>
      </div>
    </div>
  )
}

// The tabs down the left: Contatos (always selected) and the partner tabs, greyed out since they do nothing
function TabStrip({ contactsIcon }) {
  return (
    <div className="msn-tabstrip" role="tablist" aria-orientation="vertical">
      <div className="msn-tab msn-tab-contacts" role="tab" aria-selected="true" title="Contatos">
        <img src={contactsIcon} alt="" />
      </div>
      {PARTNER_TABS.map((tab) => (
        <div key={tab.title} className="msn-tab msn-tab-partner" role="tab" aria-selected="false" aria-disabled="true" title={tab.title}>
          <img src={tab.image} alt="" />
        </div>
      ))}
    </div>
  )
}

// The yellow bar inviting you to the Customer Experience Improvement Program
function InfoBar() {
  return (
    <div className="msn-infobar">
      <img src={infoIcon} alt="" />
      <span className="msn-infobar-link msn-inert-link">
        Clique aqui para saber mais sobre o Programa de Aperfeiçoamento da Experiência do Usuário.
      </span>
    </div>
  )
}

export default ContactList
