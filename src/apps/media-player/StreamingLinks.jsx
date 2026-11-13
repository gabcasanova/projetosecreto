import AeroOrb from '../../components/streaming/AeroOrb'
import { SERVICES } from '../../components/streaming/services'

// A list of the release's links, one service per row; nothing at all if it has none
function StreamingLinks({ links }) {
  const available = SERVICES.filter((service) => links?.[service.key])
  if (available.length === 0) return null

  return (
    <div className="wmp-streaming-links">
      <p className="wmp-streaming-links-title">Ouvir em</p>
      <ul>
        {available.map((service) => (
          <li key={service.key}>
            <a
              href={links[service.key]}
              target="_blank"
              rel="noopener noreferrer"
              className="wmp-streaming-link flex items-center gap-2 px-1"
              title={`Ouvir no ${service.name}`}
            >
              <span className="wmp-streaming-link-icon">
                <AeroOrb light={service.light} dark={service.dark}>
                  <service.Glyph />
                </AeroOrb>
              </span>
              {service.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default StreamingLinks
