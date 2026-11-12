import { useContext } from 'react'
import { BrowserContext } from './browserContext'

/**
 * A link inside a simulated web page. It opens `href` in the same browser
 * window (adding to its history), and while hovered, the status bar shows
 * where it goes, as in IE. `href` can be absolute or relative to the page.
 */
function BrowserLink({ href, children, ...props }) {
  const browser = useContext(BrowserContext)

  function handleClick(event) {
    event.preventDefault()
    browser.navigate(href)
  }

  return (
    <a
      href={browser.resolve(href)}
      onClick={handleClick}
      onPointerEnter={() => browser.setHoveredLink(browser.resolve(href))}
      onPointerLeave={() => browser.setHoveredLink(null)}
      {...props}
    >
      {children}
    </a>
  )
}

export default BrowserLink
