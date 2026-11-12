import { useRef, useState } from 'react'
import Taskbar from './Taskbar'
import Window from './Window'

const WINDOW_TITLE = 'Welcome'

function Desktop() {
  const [windowOpen, setWindowOpen] = useState(true)
  const [windowMinimized, setWindowMinimized] = useState(false)
  // The window animates into (and out of) this button when minimized
  const taskbarButtonRef = useRef(null)

  return (
    <div className="xp-desktop relative h-full w-full overflow-hidden">
      {windowOpen && (
        <Window
          title={WINDOW_TITLE}
          initialPosition={{ x: 120, y: 80 }}
          width={420}
          minimized={windowMinimized}
          onMinimize={() => setWindowMinimized(true)}
          onClose={() => setWindowOpen(false)}
          taskbarButtonRef={taskbarButtonRef}
        >
          <p>Welcome to Windows XP.</p>
          <p className="mt-2">Drag this window around by its title bar.</p>
        </Window>
      )}

      <Taskbar
        openWindowTitle={windowOpen ? WINDOW_TITLE : null}
        windowMinimized={windowMinimized}
        windowButtonRef={taskbarButtonRef}
        // Like XP, clicking the taskbar button minimizes a visible window and restores a minimized one
        onWindowButtonClick={() => setWindowMinimized((minimized) => !minimized)}
      />
    </div>
  )
}

export default Desktop
