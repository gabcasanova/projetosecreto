import { albums, singles } from 'virtual:music-library'
import BrowserLink from '../BrowserLink'

// The example site's pages (see demoSite.js)

export function HomePage() {
  return (
    <div className="p-4">
      <h1 className="mb-3 text-3xl font-bold">Futebol de Bairro</h1>
      <p className="mb-3">Bem-vindo à página oficial!</p>
      <ul className="ml-6 list-disc">
        <li>
          <BrowserLink href="/discografia" className="text-[#0000ff] underline">
            Discografia
          </BrowserLink>
        </li>
        <li>
          {/* No such page: shows off IE's error page */}
          <BrowserLink href="/shows" className="text-[#0000ff] underline">
            Agenda de shows
          </BrowserLink>
        </li>
      </ul>
    </div>
  )
}

export function DiscographyPage() {
  const releases = [...albums, ...singles]

  return (
    <div className="p-4">
      <h1 className="mb-3 text-3xl font-bold">Discografia</h1>
      <table className="mb-4 border-collapse">
        <tbody>
          {releases.map((release) => (
            <tr key={release.id}>
              <td className="py-1 pr-3">
                <img src={release.cover} alt="" className="size-16 border border-black" />
              </td>
              <td>
                <b>{release.title}</b> ({release.year})
                <br />
                {release.type === 'single' ? 'Single' : 'Álbum'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <BrowserLink href="/" className="text-[#0000ff] underline">
        Voltar para a página inicial
      </BrowserLink>
    </div>
  )
}
