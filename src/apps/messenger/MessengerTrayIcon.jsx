import { useCallback, useRef, useState } from 'react'
import useDismiss from '../../components/menu/useDismiss'
import trayIcon from './assets/tray-online.png'
import { useMessenger } from './messengerContext'

/*
 * MSN's two buddies in the notification area, there once you've signed in.
 * A click brings the contact list back; a right-click opens a little menu
 * above it, with the sounds switch, so MSN can be silenced without opening it.
 */
function MessengerTrayIcon() {
  const messenger = useMessenger()
  const [menuOpen, setMenuOpen] = useState(false)
  const containerRef = useRef(null)
  const close = useCallback(() => setMenuOpen(false), [])
  useDismiss(containerRef, menuOpen, close)

  if (!messenger?.signedIn) return null

  const title = messenger.soundsOn ? 'MSN Messenger - Online' : 'MSN Messenger - Online (sons desligados)'

  return (
    <div ref={containerRef} className="relative flex">
      <button
        type="button"
        className="xp-tray-icon"
        title={title}
        aria-label="MSN Messenger"
        aria-haspopup="menu"
        onClick={messenger.openContactList}
        onContextMenu={(event) => {
          event.preventDefault()
          setMenuOpen((current) => !current)
        }}
      >
        <img src={trayIcon} alt="" width={16} height={16} />
      </button>
      {menuOpen && (
        <div className="xp-volume-popup xp-scale-popup" role="menu" aria-label="MSN Messenger">
          <p>MSN Messenger</p>
          <button
            type="button"
            className="xp-tray-menu-item"
            role="menuitem"
            onClick={() => {
              messenger.openContactList()
              close()
            }}
          >
            Abrir
          </button>
          <label className="xp-volume-mute">
            <input type="checkbox" checked={messenger.soundsOn} onChange={messenger.toggleSounds} />
            Sons
          </label>
        </div>
      )}
    </div>
  )
}

export default MessengerTrayIcon
