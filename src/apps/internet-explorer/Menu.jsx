import { useCallback, useRef, useState } from 'react'
import { isInert } from './menuItems'
import useDismiss from './useDismiss'

/*
 * XP-style menus. A menu is a list of items:
 *   { label, action, shortcut, checked, disabled, icon, items }
 * where `items` makes a submenu, or { separator: true } for a dividing line.
 * Items without an action are just for show and are greyed out.
 */

// The row of menus under the title bar: Arquivo, Editar, Exibir...
export function MenuBar({ menus }) {
  const [openIndex, setOpenIndex] = useState(null)
  const barRef = useRef(null)
  const close = useCallback(() => setOpenIndex(null), [])
  useDismiss(barRef, openIndex !== null, close)

  return (
    <div ref={barRef} className="ie-menubar" role="menubar">
      {menus.map((menu, index) => (
        <div key={menu.label} className="relative">
          <button
            type="button"
            role="menuitem"
            className={`ie-menubar-item ${openIndex === index ? 'open' : ''}`}
            // A menu where nothing works is greyed out as a whole
            disabled={menu.items.every(isInert)}
            onPointerDown={() => setOpenIndex((current) => (current === index ? null : index))}
            // Once a menu is open, sliding along the bar opens the others, as in Windows
            onPointerEnter={() => openIndex !== null && setOpenIndex(index)}
          >
            {menu.label}
          </button>
          {openIndex === index && <MenuList items={menu.items} onDone={close} />}
        </div>
      ))}
    </div>
  )
}

/**
 * A button that drops a menu down below itself, like the arrows next to
 * Voltar and Avançar. `children` is the button's own face.
 */
export function DropdownButton({ items, className, title, disabled, align = 'left', children }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(containerRef, open, close)

  return (
    <div ref={containerRef} className="relative flex">
      <button
        type="button"
        className={`${className} ${open ? 'open' : ''}`}
        title={title}
        aria-label={title}
        aria-haspopup="menu"
        disabled={disabled || items.every(isInert)}
        onClick={() => setOpen((current) => !current)}
      >
        {children}
      </button>
      {open && <MenuList items={items} onDone={close} className={align === 'right' ? 'right-0 left-auto' : ''} />}
    </div>
  )
}

// One popup list of menu items; submenus open to its right on hover
function MenuList({ items, onDone, className = '', submenu = false }) {
  const [openSubmenu, setOpenSubmenu] = useState(null)

  function choose(item) {
    if (isInert(item) || item.items) return
    item.action()
    onDone()
  }

  return (
    <ul className={`ie-menu ${submenu ? 'ie-submenu' : ''} ${className}`} role="menu">
      {items.map((item, index) =>
        item.separator ? (
          <li key={`separator-${index}`} className="ie-menu-separator" role="separator" />
        ) : (
          <li
            key={item.label}
            className="relative"
            // Greyed-out submenus stay shut
            onPointerEnter={() => setOpenSubmenu(item.items && !isInert(item) ? index : null)}
          >
            <button
              type="button"
              role="menuitem"
              className={`ie-menu-item ${openSubmenu === index ? 'open' : ''}`}
              disabled={isInert(item)}
              onClick={() => choose(item)}
            >
              <span className="ie-menu-check">
                {item.icon ? <img src={item.icon} alt="" className="size-4" /> : item.checked && <CheckMark />}
              </span>
              <span className="flex-1 truncate text-left">{item.label}</span>
              {item.shortcut && <span className="ie-menu-shortcut">{item.shortcut}</span>}
              {item.items && <span className="ie-menu-arrow" />}
            </button>
            {openSubmenu === index && item.items && <MenuList items={item.items} onDone={onDone} submenu />}
          </li>
        ),
      )}
    </ul>
  )
}

function CheckMark() {
  return (
    <svg width="7" height="7" viewBox="0 0 7 7" aria-hidden="true">
      <path d="M0 3L2 5L7 0V2L2 7L0 5Z" fill="currentColor" />
    </svg>
  )
}
