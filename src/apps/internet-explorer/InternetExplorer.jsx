import { useEffect, useId, useState } from 'react'
import windowsFlag from '../../assets/ie/windows-flag.png'
import AboutDialog from './AboutDialog'
import AddressBar from './AddressBar'
import { BrowserContext } from './browserContext'
import ErrorPage from './ErrorPage'
import ExplorerBar from './ExplorerBar'
import './internet-explorer.css'
import { MenuBar } from '../../components/menu/Menu'
import { buildMenus } from './menus'
import StatusBar from './StatusBar'
import Toolbar from './Toolbar'
import { findPage } from './sites'
import { resolveUrl } from './urls'
import useBrowserNavigation from './useBrowserNavigation'

const ERROR_PAGE_TITLE = 'Não é possível localizar o servidor'
const DEFAULT_BARS = { toolbar: true, addressBar: true, statusBar: true }

/**
 * Internet Explorer 6, as on Windows XP, showing a made-up website.
 *
 * Apps are built on it by describing their site:
 *
 *   const site = {
 *     homeUrl: 'http://www.exemplo.com.br/',
 *     pages: {
 *       'http://www.exemplo.com.br/': { title: 'Início', Content: HomePage },
 *       'http://www.exemplo.com.br/fotos': { title: 'Fotos', Content: PhotosPage },
 *     },
 *     // Optional: shown in the Favoritos menu, the Favoritos pane and under Links
 *     favorites: [{ title: 'Fotos', url: 'http://www.exemplo.com.br/fotos' }],
 *   }
 *
 * A site can also have `findPage(url)`, returning a page (or null) for
 * addresses that aren't listed, like "Profile.aspx?uid=3". Several sites can
 * be joined into one with `combineSites` (sites.js).
 *
 * Inside a page, <BrowserLink href="/fotos"> moves between pages. Pages also
 * get `navigate` and `url` as props. Any address without a page shows IE's
 * error page. `url` opens the browser somewhere other than the home page
 * (like a desktop shortcut to a site does). `bars` can hide the toolbar,
 * address bar or status bar.
 *
 * `setWindowTitle`, `closeWindow` and `openWindow` come from the desktop.
 */
function InternetExplorer({ site, url: startUrl, bars: initialBars = DEFAULT_BARS, setWindowTitle, closeWindow, openWindow }) {
  const id = useId()
  const navigation = useBrowserNavigation(startUrl ?? site.homeUrl)
  const [hoveredLink, setHoveredLink] = useState(null)
  const [explorerBar, setExplorerBar] = useState(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [bars, setBars] = useState({ ...DEFAULT_BARS, ...initialBars })

  const { currentUrl, pending, finishLoading } = navigation
  // Nothing is shown until the first page has loaded
  const page = currentUrl && pageAt(currentUrl)
  const loading = Boolean(pending)

  // Each load completes on its own when its time is up, as the progress bar fills
  // (unless Parar or another click replaces it)
  useEffect(() => {
    if (!pending) return
    const timer = setTimeout(() => {
      finishLoading()
      // The link under the pointer is gone with the old page
      setHoveredLink(null)
    }, pending.duration)
    return () => clearTimeout(timer)
  }, [pending, finishLoading])

  const pageTitle = !currentUrl ? null : (page?.title ?? ERROR_PAGE_TITLE)
  useEffect(() => {
    setWindowTitle?.(pageTitle ? `${pageTitle} - Microsoft Internet Explorer` : 'Microsoft Internet Explorer')
  }, [pageTitle, setWindowTitle])

  const resolve = (href) => resolveUrl(href, currentUrl)

  function pageAt(url) {
    return findPage(site, url) ?? (url === 'about:blank' ? BLANK_PAGE : null)
  }

  const browser = {
    id,
    currentUrl,
    loading,
    loadingUrl: pending?.url,
    loadId: pending?.id,
    loadDuration: pending?.duration,
    hoveredLink,
    explorerBar,
    bars,
    favorites: site.favorites ?? [],
    visited: navigation.visited,
    backEntries: navigation.backEntries,
    forwardEntries: navigation.forwardEntries,
    canGoBack: navigation.canGoBack,
    canGoForward: navigation.canGoForward,
    resolve,
    titleOf: (url) => pageAt(url)?.title ?? url,
    setHoveredLink,
    navigate(address) {
      const url = resolve(address)
      if (!url) return
      navigation.navigate(url)
      // The status bar shows the load now, not the link that was clicked
      setHoveredLink(null)
    },
    go: navigation.go,
    goHome: () => browser.navigate(site.homeUrl),
    refresh: navigation.refresh,
    stop: navigation.stop,
    toggleExplorerBar(pane) {
      setExplorerBar((current) => (current === pane ? null : pane))
    },
    toggleBar(name) {
      setBars((current) => ({ ...current, [name]: !current[name] }))
    },
    selectAll() {
      const content = document.getElementById(`${id}-content`)
      if (content) window.getSelection().selectAllChildren(content)
    },
    openAbout: () => setAboutOpen(true),
    // Arquivo > Novo > Janela: another IE window showing the same site
    newWindow: openWindow && (() => openWindow('internetExplorer')),
    closeWindow,
  }

  // IE's keyboard shortcuts, while focus is anywhere in this window
  function handleKeyDown(event) {
    if (event.target.closest('input')) return
    if (event.altKey && event.key === 'ArrowLeft') browser.go(-1)
    else if (event.altKey && event.key === 'ArrowRight') browser.go(1)
    else if (event.altKey && event.key === 'Home') browser.goHome()
    else if (event.key === 'F5') browser.refresh()
    else if (event.key === 'Escape') browser.stop()
    else return
    // Keep F5 and friends from acting on the real page
    event.preventDefault()
  }

  const explorerBarPages =
    explorerBar === 'favorites'
      ? browser.favorites
      : navigation.visited.map((url) => ({ title: browser.titleOf(url), url }))

  return (
    <BrowserContext.Provider value={browser}>
      <div className="ie-window" tabIndex={-1} onKeyDown={handleKeyDown}>
        <div className="ie-rebar">
          <div className="ie-menubar-row">
            <MenuBar menus={buildMenus(browser)} />
            {/* The Windows flag "throbber" at the end of the menu bar */}
            <img src={windowsFlag} alt="" className="ie-throbber" draggable={false} />
          </div>
          {bars.toolbar && <Toolbar browser={browser} />}
          {bars.addressBar && <AddressBar key={currentUrl} browser={browser} />}
        </div>

        <div className="ie-body">
          {explorerBar && (
            <ExplorerBar
              pane={explorerBar}
              pages={explorerBarPages}
              currentUrl={currentUrl}
              onNavigate={browser.navigate}
              onClose={() => setExplorerBar(null)}
            />
          )}
          {/* Re-keyed per finished load, so every page starts scrolled to the top and Atualizar re-mounts it */}
          <div key={navigation.loadCount} id={`${id}-content`} className="ie-content">
            {currentUrl &&
              (page ? (
                <page.Content url={currentUrl} navigate={browser.navigate} />
              ) : (
                <ErrorPage url={currentUrl} onRefresh={browser.refresh} />
              ))}
          </div>
        </div>

        {bars.statusBar && <StatusBar browser={browser} />}

        {aboutOpen && <AboutDialog onClose={() => setAboutOpen(false)} />}
      </div>
    </BrowserContext.Provider>
  )
}

const BLANK_PAGE = { title: 'about:blank', Content: () => null }

export default InternetExplorer
