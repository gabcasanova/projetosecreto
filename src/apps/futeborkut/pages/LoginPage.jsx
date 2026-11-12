import { albums, singles } from 'virtual:music-library'
import logo from '../assets/logo.svg'
import Link from '../components/Link'
import { links } from '../links'
import '../futeborkut.css'

/*
 * The logged-out front page, laid out like orkut's 2008 one. Instead of
 * the e-mail and password box there's a welcome for the band's fans and a
 * single button that goes in as the visitor.
 */

// Tilted snapshots under the logo; the band's CD covers stand in for the members' photos
const SNAPSHOTS = [...albums, ...singles].map((release) => release.cover).filter(Boolean).slice(0, 3)

function LoginPage({ navigate }) {
  return (
    <div className="futeborkut loginpage">
      <table className="logintable">
        <tbody>
          <tr>
            <td className="newMain">
              <img src={logo} alt="futeborkut" className="bigLogo" />
              {SNAPSHOTS.length > 0 && (
                <div className="collage">
                  {SNAPSHOTS.map((snapshot) => (
                    <img key={snapshot} src={snapshot} alt="" />
                  ))}
                </div>
              )}
              <div className="newText">
                <span className="magenta">Conheça</span> os integrantes do Futebol de Bairro
                <br />
                <span className="magenta">Deixe</span> recados e depoimentos para a banda
                <br />
                <span className="magenta">Participe</span> da comunidade oficial e encontre outros fãs
              </div>
            </td>
            <td style={{ width: 10 }} />
            <td className="newGaia">
              <div className="welcomebox">
                <div className="intro">
                  Bem-vindo(a) ao <span className="brand">futeborkut</span>
                </div>
                <div className="tagline">
                  A rede social dos fãs do Futebol de Bairro. Veja os perfis da banda, as fotos e os recados da
                  galera.
                </div>
                <button type="button" className="enter" onClick={() => navigate(links.home)}>
                  Clique aqui para entrar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="loginfooter">
        ©2008 futeborkut - <Link href={links.footer('about')}>Sobre o futeborkut</Link> -{' '}
        <Link href={links.footer('safety')}>Centro de segurança</Link> -{' '}
        <Link href={links.footer('privacy')}>Privacidade</Link> - <Link href={links.footer('terms')}>Termos</Link>
      </div>
    </div>
  )
}

export default LoginPage
