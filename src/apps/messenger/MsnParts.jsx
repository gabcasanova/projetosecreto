import { MenuBar } from '../../components/menu/Menu'
import defaultPicture from './assets/dp-default-msn.png'

/*
 * Small pieces shared by MSN's windows.
 */

/**
 * MSN's own menu bar: the desktop's XP menus on MSN's grey strip. Every menu
 * opens, even where nothing inside works (those items are greyed out).
 */
export function MsnMenuBar({ menus }) {
  return (
    <div className="msn-menubar">
      <MenuBar menus={menus} inertMenusOpen />
    </div>
  )
}

/**
 * A display picture in MSN's rounded blue frame. Without a picture it shows
 * MSN's default green buddy.
 */
export function DisplayPicture({ src, width, height = width, className = '', alt = '' }) {
  return (
    <span className={`msn-dp-frame ${className}`}>
      <img src={src || defaultPicture} alt={alt} style={{ width, height }} draggable={false} />
    </span>
  )
}

// The little ▾ next to things that drop down a menu (MSN draws it with the Marlett font)
export function Caret({ className = '' }) {
  return <span className={`msn-caret ${className}`} aria-hidden="true" />
}
