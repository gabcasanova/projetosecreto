import Taskbar from './Taskbar'
import Window from './Window'

const WINDOW_TITLE = 'Welcome'

function Desktop() {
  return (
    <div className="xp-desktop relative h-full w-full overflow-hidden">
      <Window title={WINDOW_TITLE} initialPosition={{ x: 120, y: 80 }} width={420}>
        <p>Welcome to Windows XP.</p>
        <p className="mt-2">Drag this window around by its title bar.</p>
      </Window>

      <Taskbar openWindowTitle={WINDOW_TITLE} />
    </div>
  )
}

export default Desktop
