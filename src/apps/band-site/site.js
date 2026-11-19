import { DiscographyPage, HomePage } from './pages'

/*
 * futeboldebairro.com.br: the band's own home page (Internet Explorer's
 * home page too), and its discography page.
 */
const HOME_URL = 'http://www.futeboldebairro.com.br/'
const DISCOGRAPHY_URL = 'http://www.futeboldebairro.com.br/discografia'

const bandSite = {
  homeUrl: HOME_URL,
  pages: {
    [HOME_URL]: { title: 'Futebol de Bairro - Página Oficial', Content: HomePage },
    [DISCOGRAPHY_URL]: { title: 'Discografia - Futebol de Bairro', Content: DiscographyPage },
  },
  favorites: [
    { title: 'Futebol de Bairro', url: HOME_URL },
    { title: 'Discografia', url: DISCOGRAPHY_URL },
  ],
}

export default bandSite
