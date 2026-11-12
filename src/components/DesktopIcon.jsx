// A desktop shortcut: single click selects it, double click opens the app
function DesktopIcon({ icon, label, selected, onSelect, onOpen }) {
  return (
    <button
      type="button"
      className="flex w-[76px] flex-col items-center gap-1 p-1 outline-none"
      onPointerDown={(event) => {
        // Keep the desktop's own click handler from clearing the selection we're about to make
        event.stopPropagation()
        onSelect()
      }}
      onDoubleClick={onOpen}
    >
      <img
        src={icon}
        alt=""
        className={`size-12 ${selected ? 'opacity-70 [filter:sepia(1)_hue-rotate(180deg)_saturate(4)]' : ''}`}
      />
      <span
        // XP breaks a name that is one long word, rather than letting it spill out
        className={`px-0.5 text-center leading-tight text-white [overflow-wrap:anywhere] ${
          selected ? 'bg-[#316ac5]' : '[text-shadow:1px_1px_1px_black]'
        }`}
      >
        {label}
      </span>
    </button>
  )
}

export default DesktopIcon
