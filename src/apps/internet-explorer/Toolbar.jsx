import backIcon from '../../assets/ie/back.png'
import editIcon from '../../assets/ie/edit.png'
import favoritesIcon from '../../assets/ie/favorites.png'
import forwardIcon from '../../assets/ie/forward.png'
import historyIcon from '../../assets/ie/history.png'
import homeIcon from '../../assets/ie/home.png'
import mailIcon from '../../assets/ie/mail.png'
import messengerIcon from '../../assets/ie/messenger.png'
import printIcon from '../../assets/ie/print.png'
import refreshIcon from '../../assets/ie/refresh.png'
import searchIcon from '../../assets/ie/search.png'
import stopIcon from '../../assets/ie/stop.png'
import { DropdownButton } from '../../components/menu/Menu'
import { isInert } from '../../components/menu/menuItems'

/*
 * IE6's "Botões padrão" toolbar. Some icons fill their whole 32px image and
 * are drawn smaller, so they match the others (which have a margin built in).
 */
function Toolbar({ browser }) {
  const historyMenu = (entries, direction) =>
    entries.map((url, index) => ({
      label: browser.titleOf(url),
      action: () => browser.go(direction * (index + 1)),
    }))

  return (
    <div className="ie-toolbar">
      <SplitButton
        icon={backIcon}
        label="Voltar"
        showLabel
        disabled={!browser.canGoBack}
        onClick={() => browser.go(-1)}
        menuItems={historyMenu(browser.backEntries, -1)}
      />
      <SplitButton
        icon={forwardIcon}
        label="Avançar"
        disabled={!browser.canGoForward}
        onClick={() => browser.go(1)}
        menuItems={historyMenu(browser.forwardEntries, 1)}
      />
      <ToolbarButton icon={stopIcon} label="Parar" onClick={browser.stop} />
      <ToolbarButton icon={refreshIcon} label="Atualizar" onClick={browser.refresh} />
      <ToolbarButton icon={homeIcon} label="Página inicial" onClick={browser.goHome} />
      <Separator />
      <ToolbarButton icon={searchIcon} label="Pesquisar" showLabel small />
      <ToolbarButton
        icon={favoritesIcon}
        label="Favoritos"
        showLabel
        small
        pressed={browser.explorerBar === 'favorites'}
        onClick={() => browser.toggleExplorerBar('favorites')}
      />
      <ToolbarButton
        icon={historyIcon}
        label="Histórico"
        pressed={browser.explorerBar === 'history'}
        onClick={() => browser.toggleExplorerBar('history')}
      />
      <Separator />
      <SplitButton icon={mailIcon} label="Correio" menuItems={MAIL_MENU} />
      <ToolbarButton icon={printIcon} label="Imprimir" small />
      <ToolbarButton icon={editIcon} label="Editar" />
      <ToolbarButton icon={messengerIcon} label="Windows Messenger" />
    </div>
  )
}

// What IE6's mail button offers; only for show here
const MAIL_MENU = [
  { label: 'Ler email' },
  { label: 'Nova mensagem...' },
  { label: 'Enviar link...' },
  { label: 'Enviar página...' },
  { separator: true },
  { label: 'Ler notícias' },
]

// Buttons without an onClick do nothing here, so they're greyed out
function ToolbarButton({ icon, label, showLabel = false, small = false, pressed = false, disabled, onClick }) {
  return (
    <button
      type="button"
      className={`ie-tool ${pressed ? 'pressed' : ''}`}
      title={label}
      aria-label={label}
      aria-pressed={pressed || undefined}
      disabled={disabled || !onClick}
      onClick={onClick}
    >
      <ToolIcon icon={icon} small={small} />
      {showLabel && <span className="ie-tool-label">{label}</span>}
    </button>
  )
}

// A button with a drop-down arrow beside it, each half clickable on its own
function SplitButton({ icon, label, showLabel = false, disabled, onClick, menuItems }) {
  const buttonDisabled = disabled || !onClick
  const menuDisabled = disabled || menuItems.every(isInert)

  return (
    <div className={`ie-tool-split ${buttonDisabled && menuDisabled ? 'disabled' : ''}`}>
      <button
        type="button"
        className="ie-tool"
        title={label}
        aria-label={label}
        disabled={buttonDisabled}
        onClick={onClick}
      >
        <ToolIcon icon={icon} />
        {showLabel && <span className="ie-tool-label">{label}</span>}
      </button>
      <DropdownButton items={menuItems} className="ie-tool ie-tool-arrow" title={label} disabled={menuDisabled}>
        <span className="ie-tool-arrow-glyph" />
      </DropdownButton>
    </div>
  )
}

function ToolIcon({ icon, small = false }) {
  return <img src={icon} alt="" className={small ? 'ie-tool-icon small' : 'ie-tool-icon'} draggable={false} />
}

function Separator() {
  return <span className="ie-toolbar-separator" aria-hidden="true" />
}

export default Toolbar
