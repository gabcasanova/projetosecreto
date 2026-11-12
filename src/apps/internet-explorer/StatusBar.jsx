import pageIcon from '../../assets/ie/page.png'
import internetZoneIcon from '../../assets/ie/zone-internet.png'

/*
 * The bottom bar: what's happening (or where the hovered link goes) on the
 * left, a progress bar while a page "loads", a row of empty panes, and the
 * security zone on the right.
 */
function StatusBar({ browser }) {
  let text = 'Concluído'
  if (browser.hoveredLink) text = browser.hoveredLink
  else if (browser.loading) text = `Abrindo página ${browser.loadingUrl}...`

  return (
    <div className="ie-statusbar">
      <div className="ie-status-main">
        <img src={pageIcon} alt="" className="size-4 shrink-0" />
        <span className="truncate">{text}</span>
      </div>
      <div className="ie-status-pane ie-status-progress-pane">
        {/* Re-keyed per load so the fill animation starts over; it fills in exactly the load's duration */}
        {browser.loading && (
          <div
            key={browser.loadId}
            className="ie-status-progress"
            style={{ animationDuration: `${browser.loadDuration}ms` }}
          />
        )}
      </div>
      <div className="ie-status-pane w-[22px]" />
      <div className="ie-status-pane w-[22px]" />
      <div className="ie-status-pane w-[22px]" />
      <div className="ie-status-pane ie-status-zone">
        <img src={internetZoneIcon} alt="" className="size-4" />
        Internet
      </div>
    </div>
  )
}

export default StatusBar
