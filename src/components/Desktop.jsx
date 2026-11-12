import { lazy, Suspense, useRef, useState } from 'react'
import mediaPlayerIcon from '../assets/wmp/wmp-icon-48.png'
import mediaPlayerSmallIcon from '../assets/wmp/wmp-icon-16.png'
import jewelCaseIcon from '../assets/xp/icons/cd-audio.png'
import CaseLoading from '../apps/jewel-case/CaseLoading'
import MediaPlayer from '../apps/media-player/MediaPlayer'
import useWindowManager from '../hooks/useWindowManager'
import DesktopIcon from './DesktopIcon'
import Taskbar from './Taskbar'
import Window from './Window'

// The 3D CD case pulls in three.js, so it's only downloaded the first time a case is opened
const JewelCaseViewer = lazy(() => import('../apps/jewel-case/JewelCaseViewer'))

function WelcomeMessage() {
  return (
    <>
      <p>Bem-vindo ao Windows XP.</p>
      <p className="mt-2">Arraste esta janela pela barra de título.</p>
    </>
  )
}

/*
 * Everything that can be opened as a window. `title` can be a function of the
 * window's props, for windows that show something specific (like one album).
 */
const APPS = {
  welcome: {
    title: 'Bem-vindo',
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
  jewelCase: {
    title: 'Visualizador de CD',
    icon: jewelCaseIcon,
    bodyClassName: '',
    maximizable: true,
    // Shown while the viewer's code downloads; the viewer then keeps it up until its 3D scene is ready
    Loading: CaseLoading,
    initialPosition: { x: 80, y: 30 },
    width: 860,
    Content: JewelCaseViewer,
  },
}

function titleOf(id, props) {
  const { title } = APPS[id]
  return typeof title === 'function' ? title(props) : title
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

  const taskbarItems = windowManager.windows.map(({ id, minimized, props }) => ({
    id,
    title: titleOf(id, props),
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

      {windowManager.windows.map(({ id, minimized, props }) => {
        const app = APPS[id]
        return (
          <Window
            key={id}
            title={titleOf(id, props)}
            icon={app.smallIcon ?? app.icon}
            bodyClassName={app.bodyClassName}
            initialPosition={app.initialPosition}
            width={app.width}
            maximizable={app.maximizable}
            active={id === windowManager.activeId}
            minimized={minimized}
            zIndex={windowManager.zIndexOf(id)}
            onFocus={() => windowManager.focusWindow(id)}
            onMinimize={() => windowManager.minimizeWindow(id)}
            onClose={() => windowManager.closeWindow(id)}
            getTaskbarButton={() => taskbarButtons.current.get(id)}
          >
            {/* Apps get their window's props, plus a way to open other windows */}
            <Suspense fallback={app.Loading ? <app.Loading /> : null}>
              <app.Content {...props} openWindow={windowManager.openWindow} />
            </Suspense>
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
