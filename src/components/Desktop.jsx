import { useRef, useState } from 'react'
import mediaPlayerIcon from '../assets/wmp/wmp-icon-48.png'
import mediaPlayerSmallIcon from '../assets/wmp/wmp-icon-16.png'
import MediaPlayer from '../apps/media-player/MediaPlayer'
import useWindowManager from '../hooks/useWindowManager'
import DesktopIcon from './DesktopIcon'
import Taskbar from './Taskbar'
import Window from './Window'

function WelcomeMessage() {
  return (
    <>
      <p>Welcome to Windows XP.</p>
      <p className="mt-2">Drag this window around by its title bar.</p>
    </>
  )
}

// Everything that can be opened as a window
const APPS = {
  welcome: {
    title: 'Welcome',
    initialPosition: { x: 120, y: 80 },
    width: 420,
    Content: WelcomeMessage,
  },
  mediaPlayer: {
    title: 'Windows Media Player',
    icon: mediaPlayerIcon,
    // Title bar and taskbar use the hand-tuned 16px version instead of a scaled-down 48px one
    smallIcon: mediaPlayerSmallIcon,
    bodyClassName: '',
    initialPosition: { x: 24, y: 6 },
    width: 980,
    Content: MediaPlayer,
  },
}

const DESKTOP_SHORTCUTS = ['mediaPlayer']

function Desktop() {
  const windowManager = useWindowManager(['welcome'])
  const [selectedShortcut, setSelectedShortcut] = useState(null)
  // Taskbar buttons by window id; minimized windows animate into these
  const taskbarButtons = useRef(new Map())
  const taskbarRefCallbacks = useRef(new Map())

  // One stable callback per window. A fresh callback each render would make React detach the button
  // and re-attach it after the window's layout effect has already looked for it.
  function registerTaskbarButton(id) {
    if (!taskbarRefCallbacks.current.has(id)) {
      taskbarRefCallbacks.current.set(id, (element) => {
        if (element) taskbarButtons.current.set(id, element)
        else taskbarButtons.current.delete(id)
      })
    }
    return taskbarRefCallbacks.current.get(id)
  }

  const taskbarItems = windowManager.windows.map(({ id, minimized }) => ({
    id,
    title: APPS[id].title,
    icon: APPS[id].smallIcon ?? APPS[id].icon,
    active: id === windowManager.activeId && !minimized,
  }))

  return (
    <div
      className="xp-desktop relative h-full w-full overflow-hidden"
      onPointerDown={() => setSelectedShortcut(null)}
    >
      <div className="absolute top-2 left-2 flex flex-col gap-2">
        {DESKTOP_SHORTCUTS.map((id) => (
          <DesktopIcon
            key={id}
            icon={APPS[id].icon}
            label={APPS[id].title}
            selected={selectedShortcut === id}
            onSelect={() => setSelectedShortcut(id)}
            onOpen={() => windowManager.openWindow(id)}
          />
        ))}
      </div>

      {windowManager.windows.map(({ id, minimized }) => {
        const app = APPS[id]
        return (
          <Window
            key={id}
            title={app.title}
            icon={app.smallIcon ?? app.icon}
            bodyClassName={app.bodyClassName}
            initialPosition={app.initialPosition}
            width={app.width}
            active={id === windowManager.activeId}
            minimized={minimized}
            zIndex={windowManager.zIndexOf(id)}
            onFocus={() => windowManager.focusWindow(id)}
            onMinimize={() => windowManager.minimizeWindow(id)}
            onClose={() => windowManager.closeWindow(id)}
            getTaskbarButton={() => taskbarButtons.current.get(id)}
          >
            <app.Content />
          </Window>
        )
      })}

      <Taskbar
        items={taskbarItems}
        onItemClick={windowManager.toggleFromTaskbar}
        buttonRef={registerTaskbarButton}
      />
    </div>
  )
}

export default Desktop
