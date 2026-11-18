import trayIcon from './assets/tray-online.png'
import { useMessenger } from './messengerContext'

// MSN's two buddies in the notification area, there once you've signed in; a click brings the contact list back
function MessengerTrayIcon() {
  const messenger = useMessenger()
  if (!messenger?.signedIn) return null

  return (
    <button type="button" className="xp-tray-icon" title="MSN Messenger - Online" aria-label="MSN Messenger" onClick={messenger.openContactList}>
      <img src={trayIcon} alt="" width={16} height={16} />
    </button>
  )
}

export default MessengerTrayIcon
