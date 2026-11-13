import RetroInstagramIcon from '../streaming/RetroInstagramIcon'
import { SERVICES } from '../streaming/services'
import { INSTAGRAM, MUSIC_SERVICES } from './externalLinks'

/*
 * The band's pages, in a navy card on the panel: a big glossy Instagram
 * button, then a glossy button per music service with its name. They open
 * in a new tab of the real browser, outside the simulated desktop.
 */
function LinksGadget() {
  return (
    <div className="links-gadget">
      <a className="links-instagram" href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" title="Abrir no Instagram">
        {/* Instagram's old camera icon, which fits the glossy era better than today's logo */}
        <span className="links-instagram-icon">
          <RetroInstagramIcon size={62} />
        </span>
        <span className="links-instagram-text">
          <span className="links-instagram-name">Instagram</span>
          <span className="links-instagram-handle">{INSTAGRAM.handle}</span>
          <span className="links-instagram-follow">Seguir</span>
        </span>
      </a>

      <p className="links-caption">Ouça a banda em:</p>
      <ul className="links-services">
        {SERVICES.map((service) => (
          <li key={service.key}>
            <a
              className="links-service"
              href={MUSIC_SERVICES[service.key]}
              target="_blank"
              rel="noopener noreferrer"
              title={`Abrir no ${service.name}`}
              style={{ '--light': service.light, '--dark': service.dark }}
            >
              <Glyph Shape={service.Glyph} size={24} />
              <span className="links-service-name">{service.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

// A service's white logo glyph on its own (the glyphs are drawn on a 32×32 grid)
function Glyph({ Shape, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="links-glyph">
      <g fill="#fff" stroke="#fff">
        <Shape />
      </g>
    </svg>
  )
}

export default LinksGadget
