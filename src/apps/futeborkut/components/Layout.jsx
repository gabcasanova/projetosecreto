import { useState } from 'react'
import Link from './Link'
import logoHeader from '../assets/logo-header.svg'
import logo from '../assets/logo.svg'
import { VISITOR } from '../data/database'
import { links } from '../links'
import '../futeborkut.css'

/*
 * The frame of every logged-in page: the blue header, the columns and the
 * footer. `left` and `right` are the side columns; without `right` the
 * centre column runs to the right edge (orkut's "mboxfull").
 * `navigate` comes from the browser, for the search box.
 */
function Layout({ left, right, children, navigate }) {
  return (
    <div className="futeborkut">
      <Header navigate={navigate} />
      <div className="container">
        {left && <div className="lbox">{left}</div>}
        {right && <div className="rbox">{right}</div>}
        <div className={centreClass(left, right)}>{children}</div>
        <Footer />
      </div>
    </div>
  )
}

// Three columns, two (no right column), or just the centre (error pages)
function centreClass(left, right) {
  if (right) return 'mbox'
  return left ? 'mboxfull' : 'mboxalone'
}

const MENU = [
  { label: 'Início', href: links.home },
  { label: 'Perfil', href: links.profile(VISITOR.uid) },
  { label: 'Amigos', href: links.friends(VISITOR.uid) },
  { label: 'Comunidades', href: links.communities(VISITOR.uid) },
]

function Header({ navigate }) {
  return (
    <>
      <div className="header">
        <div className="headerin">
          <ul className="menu">
            <li className="logobg">
              <Link href={links.home} title="futeborkut">
                <img src={logoHeader} alt="futeborkut" className="header-logo" />
              </Link>
            </li>
            {MENU.map((item, index) => (
              <li key={item.href}>
                {index > 0 && <span className="sep">&nbsp;|&nbsp;</span>}
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <SearchBox navigate={navigate} />
          <ul className="login">
            <li className="useremail">{VISITOR.email}</li>
            <li>
              <span className="sep">&nbsp;|&nbsp;</span>
              <Link href={links.login}>Sair</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="headerbot" />
    </>
  )
}

function SearchBox({ navigate }) {
  const [query, setQuery] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (query.trim()) navigate(links.search(query.trim()))
  }

  return (
    <form className="mainsearch" onSubmit={handleSubmit} role="search">
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="pesquisa do futeborkut"
        aria-label="pesquisa do futeborkut"
      />
      <button type="submit" title="pesquisar" aria-label="pesquisar">
        <span className="magnifier" />
      </button>
    </form>
  )
}

const FOOTER_LINKS = [
  { label: 'Sobre o futeborkut', page: 'about' },
  { label: 'Blog', page: 'blog' },
  { label: 'Centro de segurança', page: 'safety' },
  { label: 'Privacidade', page: 'privacy' },
  { label: 'Termos de uso', page: 'terms' },
  { label: 'Ajuda', page: 'help' },
]

function Footer() {
  return (
    <div className="footer">
      <span className="txtfooter">© 2008 Futebol de Bairro</span>
      <img src={logo} alt="futeborkut" className="footer-logo" />
      {FOOTER_LINKS.map((item) => (
        <span key={item.page}>
          <span className="sep">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <Link href={links.footer(item.page)}>{item.label}</Link>
        </span>
      ))}
    </div>
  )
}

export default Layout
