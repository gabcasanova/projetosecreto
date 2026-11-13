import { lazy, Suspense, useRef, useState } from 'react'
import mediaPlayerIcon from '../assets/wmp/wmp-icon-48.png'
import mediaPlayerSmallIcon from '../assets/wmp/wmp-icon-16.png'
import internetExplorerSmallIcon from '../assets/ie/ie-32.png'
// The XP version of the icon (internet-explorer.png is the older 256-colour one)
import internetExplorerIcon from '../assets/xp/icons/internet-explorer-2.png'
import jewelCaseIcon from '../assets/xp/icons/cd-audio.png'
// XP's lined-page icon, used both for Notepad and for .txt files
import notepadIcon from '../assets/xp/icons/notepad-2.png'
import aboutTheBand from '../assets/desktop/Sobre a Banda.txt?raw'
import Notepad from '../apps/notepad/Notepad'
import futeborkutIcon from '../apps/futeborkut/assets/desktop-icon.svg'
import { FUTEBORKUT_URL } from '../apps/futeborkut/site'
import internet from '../internet'
import InternetExplorer from '../apps/internet-explorer/InternetExplorer'
import InternetExplorerSplash from '../apps/internet-explorer/Splash'
import CaseLoading from '../apps/jewel-case/CaseLoading'
import MediaPlayer from '../apps/media-player/MediaPlayer'
import { usePlayerUnload } from '../apps/media-player/playerContext'
import useStoredState from '../hooks/useStoredState'
import useWindowManager from '../hooks/useWindowManager'
import DesktopIcon from './DesktopIcon'
import Sidebar from './sidebar/Sidebar'
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
 * Apps can also change their title while open, with `setWindowTitle`.
 * An app with a `Splash` shows it in the middle of the screen for
 * `splashDuration` ms when launched, before its window opens.
 * `multipleWindows` apps open a new window every time they're launched.
 */
const APPS = {
  welcome: {
    title: 'Bem-vindo',
    initialPosition: { x: 120, y: 80 },
    width: 420,
    Content: WelcomeMessage,
  },
  mediaPlayer: {
    title: 'Discografia',
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
  internetExplorer: {
    title: 'Microsoft Internet Explorer',
    shortcutLabel: 'Internet Explorer',
    icon: internetExplorerIcon,
    smallIcon: internetExplorerSmallIcon,
    bodyClassName: '',
    maximizable: true,
    Splash: InternetExplorerSplash,
    splashDuration: 1800,
    multipleWindows: true,
    initialPosition: { x: 60, y: 20 },
    width: 800,
    // `url` in the window's props opens it on that page instead of the home page
    Content: (props) => <InternetExplorer site={internet} {...props} />,
  },
  notepad: {
    // Opened on a file: `fileName` and `text` come in the window's props
    title: ({ fileName = 'Sem título' }) => `${fileName} - Bloco de notas`,
    icon: notepadIcon,
    bodyClassName: '',
    maximizable: true,
    // Each file opens in its own window, as in XP
    multipleWindows: true,
    initialPosition: { x: 140, y: 60 },
    width: 560,
    Content: Notepad,
  },
}

function staticTitleOf(appId, props) {
  const { title } = APPS[appId]
  return typeof title === 'function' ? title(props) : title
}

/*
 * The icons on the desktop. A shortcut opens an app, optionally with props for its window.
 * Web shortcuts open Internet Explorer on a site, and carry IE's icon in the corner;
 * text files open in Notepad. Label and icon default to the app's own.
 */
const DESKTOP_SHORTCUTS = [
  { id: 'mediaPlayer', appId: 'mediaPlayer' },
  { id: 'internetExplorer', appId: 'internetExplorer' },
  webShortcut({ id: 'futeborkut', label: 'futeborkut', icon: futeborkutIcon, url: FUTEBORKUT_URL }),
  textFile({ id: 'aboutTheBand', fileName: 'Sobre a Banda', text: aboutTheBand }),
]

function webShortcut({ id, label, icon, url }) {
  return { id, appId: 'internetExplorer', props: { url }, label, icon, badge: internetExplorerIcon }
}

// A .txt file on the desktop; like XP's default, the name is shown without the extension
function textFile({ id, fileName, text }) {
  return { id, appId: 'notepad', props: { fileName, text }, label: fileName, icon: notepadIcon }
}
// How far each extra window of the same app is moved down and right
const CASCADE_STEP = 24

function Desktop() {
  const windowManager = useWindowManager(['welcome'])
  const unloadMusic = usePlayerUnload()
  const [selectedShortcut, setSelectedShortcut] = useState(null)
  // The widget sidebar can be folded away to a thin tab on the right edge (remembered across visits)
  const [sidebarOpen, setSidebarOpen] = useStoredState('desktop:sidebarOpen', true)
  // The app whose splash screen is up, if any
  const [splashAppId, setSplashAppId] = useState(null)
  // Taskbar buttons by window id; minimized windows animate into these
  const taskbarButtons = useRef(new Map())
  const taskbarRefCallbacks = useRef(new Map())
  // Titles set by the apps themselves (like a browser showing the page's title), by window id
  const [liveTitles, setLiveTitles] = useState({})
  // A cache that never changes identity (state, so render can read it, unlike a ref)
  const [windowControls] = useState(() => new Map())

  function titleOf({ id, appId, props }) {
    return liveTitles[id] ?? staticTitleOf(appId, props)
  }

  // Opens an app's window: a new one for apps that can have several, otherwise its only one.
  // Apps use this (as `openWindow`) to open other apps too.
  function openApp(appId, props) {
    if (APPS[appId].multipleWindows) windowManager.openNewWindow(appId, props)
    else windowManager.openWindow(appId, props)
  }

  // Opens an app from a shortcut. Apps with a splash show it first, unless they're already running.
  function launch(appId, props) {
    const app = APPS[appId]
    const running = windowManager.windows.some((window) => window.appId === appId)
    if (!app.Splash || running) {
      openApp(appId, props)
      return
    }
    // Double-clicking again while the splash is up doesn't start a second one
    if (splashAppId) return

    setSplashAppId(appId)
    setTimeout(() => {
      setSplashAppId(null)
      openApp(appId, props)
    }, app.splashDuration)
  }

  function closeApp(id) {
    // The music lives outside the Discografia window (the sidebar widget shares it), but stops with it
    if (windowManager.windows.find((window) => window.id === id)?.appId === 'mediaPlayer') unloadMusic()
    windowManager.closeWindow(id)
    setLiveTitles(({ [id]: _closed, ...others }) => others)
  }

  // What an app can do to its own window. Created once per window, so apps can use them in effects
  // without re-running them every render.
  function controlsFor(id) {
    if (!windowControls.has(id)) {
      windowControls.set(id, {
        setWindowTitle: (title) => setLiveTitles((current) => (current[id] === title ? current : { ...current, [id]: title })),
        // closeWindow only uses state updater functions, so this first render's copy stays correct
        closeWindow: () => closeApp(id),
      })
    }
    return windowControls.get(id)
  }

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

  const taskbarItems = windowManager.windows.map((window) => ({
    id: window.id,
    title: titleOf(window),
    icon: APPS[window.appId].smallIcon ?? APPS[window.appId].icon,
    active: window.id === windowManager.activeId && !window.minimized,
  }))

  const SplashScreen = splashAppId && APPS[splashAppId].Splash

  return (
    <div
      // XP's "working in background" cursor (arrow and hourglass) while an app starts
      className={`xp-desktop relative h-full w-full overflow-hidden ${splashAppId ? 'cursor-progress' : ''}`}
      // Folded, the sidebar is just its tab, and maximized windows take the space it left
      style={sidebarOpen ? undefined : { '--sidebar-width': 'var(--sidebar-tab-width)' }}
      onPointerDown={() => setSelectedShortcut(null)}
    >
      <div className="absolute top-2 left-2 flex flex-col gap-2">
        {DESKTOP_SHORTCUTS.map(({ id, appId, props, label, icon, badge }) => (
          <DesktopIcon
            key={id}
            icon={icon ?? APPS[appId].icon}
            badge={badge}
            label={label ?? APPS[appId].shortcutLabel ?? APPS[appId].title}
            selected={selectedShortcut === id}
            onSelect={() => setSelectedShortcut(id)}
            onOpen={() => launch(appId, props)}
          />
        ))}
      </div>

      {/* The widgets on the right; windows open over it */}
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((open) => !open)}
        onOpenPlayer={() => launch('mediaPlayer')}
      />

      {windowManager.windows.map((window) => {
        const { id, appId, minimized, props, cascade } = window
        const app = APPS[appId]
        return (
          <Window
            key={id}
            title={titleOf(window)}
            icon={app.smallIcon ?? app.icon}
            bodyClassName={app.bodyClassName}
            initialPosition={{
              x: app.initialPosition.x + cascade * CASCADE_STEP,
              y: app.initialPosition.y + cascade * CASCADE_STEP,
            }}
            width={app.width}
            maximizable={app.maximizable}
            active={id === windowManager.activeId}
            minimized={minimized}
            zIndex={windowManager.zIndexOf(id)}
            onFocus={() => windowManager.focusWindow(id)}
            onMinimize={() => windowManager.minimizeWindow(id)}
            onClose={() => closeApp(id)}
            getTaskbarButton={() => taskbarButtons.current.get(id)}
          >
            {/* Apps get their window's props, a way to open other windows, and control of their own */}
            <Suspense fallback={app.Loading ? <app.Loading /> : null}>
              <app.Content {...props} {...controlsFor(id)} openWindow={openApp} />
            </Suspense>
          </Window>
        )
      })}

      {SplashScreen && (
        // Above every window, but clicks pass through to the desktop around it
        <div className="pointer-events-none absolute inset-0" style={{ zIndex: windowManager.windows.length + 1 }}>
          <SplashScreen />
        </div>
      )}

      <Taskbar
        items={taskbarItems}
        onItemClick={windowManager.toggleFromTaskbar}
        buttonRef={registerTaskbarButton}
      />
    </div>
  )
}

export default Desktop
