import { useEffect, useState } from 'react'
import windowsLogo from '../assets/xp/windows-logo.png'
import VolumeControl from './VolumeControl'

/**
 * `items` is one entry per open window: { id, title, icon, active }.
 * `buttonRef(id)` registers each button so windows can animate into it.
 */
function Taskbar({ items, onItemClick, buttonRef }) {
  return (
    <div className="xp-taskbar absolute inset-x-0 bottom-0 z-[1000] flex items-center">
      {/* No start menu yet, so the button only shows its hover/pressed states */}
      <button type="button" className="xp-start-button flex shrink-0 items-center gap-1.5 pl-2">
        <img src={windowsLogo} alt="" width={21} height={18} />
        <span className="xp-start-label">iniciar</span>
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-0.5 px-2">
        {items.map((item) => (
          <button
            key={item.id}
            ref={buttonRef(item.id)}
            type="button"
            className={`xp-taskbar-item flex w-40 min-w-0 items-center gap-1 px-1 text-white ${item.active ? '' : 'inactive'}`}
            onClick={() => onItemClick(item.id)}
          >
            {item.icon && <img src={item.icon} alt="" className="size-4 shrink-0" />}
            <span className="truncate">{item.title}</span>
          </button>
        ))}
      </div>

      <div className="xp-tray flex items-center gap-2 px-3 text-white">
        <VolumeControl />
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

  // Brazilian Portuguese XP shows a 24-hour clock: "15:07"
  return <span>{now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
}

export default Taskbar
