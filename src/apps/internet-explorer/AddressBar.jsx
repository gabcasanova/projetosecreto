import addressDropdownIcon from '../../assets/ie/address-dropdown.png'
import chevronIcon from '../../assets/ie/chevron.png'
import goIcon from '../../assets/ie/go.png'
import pageIcon from '../../assets/ie/page.png'
import { DropdownButton } from '../../components/menu/Menu'

/*
 * "Endereço" bar: type an address and press Enter (or Ir) to go there.
 * The drop-down lists the pages visited; "Links" holds the site's favourites.
 *
 * The browser re-mounts this bar whenever the page changes, so the text box
 * always starts out showing the current address.
 */
function AddressBar({ browser }) {
  function handleSubmit(event) {
    event.preventDefault()
    const address = new FormData(event.currentTarget).get('address')
    browser.navigate(address)
  }

  const visitedMenu = browser.visited.map((url) => ({ label: url, icon: pageIcon, action: () => browser.navigate(url) }))
  const linksMenu = browser.favorites.map(({ title, url }) => ({
    label: title,
    icon: pageIcon,
    action: () => browser.navigate(url),
  }))

  return (
    <form className="ie-addressbar" onSubmit={handleSubmit}>
      <label htmlFor={`${browser.id}-address`} className="ie-addressbar-label">
        Endereço
      </label>
      <div className="ie-address-box">
        <img src={pageIcon} alt="" className="ml-0.5 size-4 shrink-0" />
        <input
          id={`${browser.id}-address`}
          name="address"
          className="ie-address-input"
          defaultValue={browser.currentUrl}
          autoComplete="off"
          spellCheck={false}
          // Clicking into the address selects all of it, ready to type over
          onFocus={(event) => event.target.select()}
        />
        <DropdownButton items={visitedMenu} className="ie-address-dropdown" title="Endereços visitados" align="right">
          <img src={addressDropdownIcon} alt="" draggable={false} />
        </DropdownButton>
      </div>
      <button type="submit" className="ie-go" title={`Ir para "${browser.currentUrl}"`}>
        <img src={goIcon} alt="" draggable={false} />
        Ir
      </button>
      <span className="ie-addressbar-separator" aria-hidden="true" />
      <DropdownButton items={linksMenu} className="ie-links" title="Links" align="right">
        Links
        <img src={chevronIcon} alt="" draggable={false} />
      </DropdownButton>
    </form>
  )
}

export default AddressBar
