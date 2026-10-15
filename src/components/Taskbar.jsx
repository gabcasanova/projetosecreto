import { useEffect, useState } from 'react'
import windowsLogo from '../assets/xp/windows-logo.png'

function Taskbar({ openWindowTitle }) {
  return (
    <div className="xp-taskbar absolute inset-x-0 bottom-0 z-20 flex items-center">
      {/* No start menu yet, so the button only shows its hover/pressed states */}
      <button type="button" className="xp-start-button flex shrink-0 items-center gap-1.5 pl-2">
        <img src={windowsLogo} alt="" width={21} height={18} />
        <span className="xp-start-label">start</span>
      </button>

      <div className="flex flex-1 items-center px-2">
        {openWindowTitle && (
          <div className="xp-taskbar-item flex w-40 items-center px-1 text-white">
            <span className="truncate">{openWindowTitle}</span>
          </div>
        )}
      </div>

      <div className="xp-tray flex items-center px-3 text-white">
        <Clock />
      </div>
    </div>
  )
}

function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // XP shows the time as "3:07 PM"
  return <span>{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
}

export default Taskbar
