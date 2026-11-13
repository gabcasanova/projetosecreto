import useStoredState from '../../hooks/useStoredState'
import CalendarGadget from './CalendarGadget'
import ClockGadget from './ClockGadget'
import LinksGadget from './LinksGadget'
import MediaGadget from './MediaGadget'
import './sidebar.css'

/*
 * The widget column on the right of the desktop, after the Sidebar of
 * Windows "Longhorn" (build 4015): an opaque Luna-blue panel of tiles, each
 * with a white bold title, separated by soft ridges. The gadgets inside are
 * drawn after the ones that shipped with Vista's Sidebar.
 *
 * Each gadget folds up to its title bar when the title is clicked, and
 * opens again the same way; which ones are folded is remembered in the
 * browser. The whole sidebar can also slide away (`open`/`onToggle`): then
 * only a thin tab stays on the right edge, to bring it back.
 * `onOpenPlayer` opens the Discografia window (from the media player tile).
 *
 * Both stay mounted while folded, so the folding can be animated in CSS.
 */

// Every gadget, in the order they're stacked
const GADGETS = [
  { id: 'clock', title: 'Relógio', Gadget: ClockGadget },
  { id: 'calendar', title: 'Calendário', Gadget: CalendarGadget },
  { id: 'links', title: 'LINKS EXTERNOS', Gadget: LinksGadget, important: true },
  { id: 'media', title: 'Windows Media Player', Gadget: MediaGadget },
]

function Sidebar({ open, onToggle, onOpenPlayer }) {
  const [collapsedIds, setCollapsedIds] = useStoredState('desktop:collapsedGadgets', [])

  function toggleCollapsed(id) {
    setCollapsedIds((current) => (current.includes(id) ? current.filter((other) => other !== id) : [...current, id]))
  }

  return (
    <>
      <button
        type="button"
        className={`sidebar-tab ${open ? '' : 'shown'}`}
        title="Mostrar a barra lateral"
        aria-label="Mostrar a barra lateral"
        inert={open}
        onClick={onToggle}
      >
        <span className="sidebar-arrow show" />
      </button>

      <aside className={`sidebar ${open ? '' : 'folded'}`} aria-label="Barra lateral" inert={!open}>
        {/* Longhorn's thin strip over the tiles, with the button that slides the sidebar away */}
        <div className="sidebar-top">
          <button type="button" className="sidebar-top-button" title="Ocultar a barra lateral" aria-label="Ocultar a barra lateral" onClick={onToggle}>
            <span className="sidebar-arrow hide" />
          </button>
        </div>

        <div className="sidebar-tiles">
          {GADGETS.map(({ id, title, Gadget, important }) => (
            <Tile
              key={id}
              title={title}
              important={important}
              collapsed={collapsedIds.includes(id)}
              onToggle={() => toggleCollapsed(id)}
            >
              <Gadget onOpenPlayer={onOpenPlayer} />
            </Tile>
          ))}
        </div>
      </aside>
    </>
  )
}

// One tile of the panel: its title bar, which folds the gadget away and back, then the gadget
function Tile({ title, important = false, collapsed, onToggle, children }) {
  const classes = ['sidebar-tile', important ? 'important' : '', collapsed ? 'collapsed' : '']
  return (
    <section className={classes.join(' ')}>
      <h2 className="sidebar-tile-heading">
        <button
          type="button"
          className="sidebar-tile-header"
          aria-expanded={!collapsed}
          title={collapsed ? 'Expandir' : 'Recolher'}
          onClick={onToggle}
        >
          <span className="sidebar-tile-title">{title}</span>
          <span className="sidebar-tile-toggle" />
        </button>
      </h2>
      {/* The body's height slides between 0 and the gadget's own height */}
      <div className="sidebar-tile-body" inert={collapsed}>
        <div className="sidebar-tile-content">{children}</div>
      </div>
    </section>
  )
}

export default Sidebar
