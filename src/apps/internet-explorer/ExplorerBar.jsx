import favoritesIcon from '../../assets/ie/favorites.png'
import historyIcon from '../../assets/ie/history.png'
import pageIcon from '../../assets/ie/page.png'

const PANES = {
  favorites: { title: 'Favoritos', icon: favoritesIcon, empty: 'Nenhum favorito.' },
  history: { title: 'Histórico', icon: historyIcon, empty: 'Nenhuma página visitada.' },
}

/*
 * The pane IE opens on the left for Favoritos or Histórico: a list of pages
 * to jump to. `pages` is a list of { title, url }.
 */
function ExplorerBar({ pane, pages, currentUrl, onNavigate, onClose }) {
  const { title, icon, empty } = PANES[pane]

  return (
    <aside className="ie-explorer-bar">
      <div className="ie-explorer-bar-header">
        <img src={icon} alt="" className="size-4" />
        <span className="flex-1">{title}</span>
        <button type="button" className="ie-explorer-bar-close" aria-label={`Fechar ${title}`} onClick={onClose}>
          ×
        </button>
      </div>
      <ul className="ie-explorer-bar-list">
        {pages.length === 0 && <li className="px-2 py-1 text-[#666]">{empty}</li>}
        {pages.map(({ title: pageTitle, url }) => (
          <li key={url}>
            <button
              type="button"
              className={`ie-explorer-bar-item ${url === currentUrl ? 'current' : ''}`}
              title={url}
              onClick={() => onNavigate(url)}
            >
              <img src={pageIcon} alt="" className="size-4 shrink-0" />
              <span className="truncate">{pageTitle}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default ExplorerBar
