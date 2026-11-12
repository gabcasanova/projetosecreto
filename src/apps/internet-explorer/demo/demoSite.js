import { DiscographyPage, HomePage } from './DemoPages'

/*
 * A small example site for the browser, showing how apps describe theirs:
 * pages by address, each with a title and a component, plus favourites.
 */
const HOME_URL = 'http://www.futeboldebairro.com.br/'
const DISCOGRAPHY_URL = 'http://www.futeboldebairro.com.br/discografia'

const demoSite = {
  homeUrl: HOME_URL,
  pages: {
    [HOME_URL]: { title: 'Futebol de Bairro', Content: HomePage },
    [DISCOGRAPHY_URL]: { title: 'Discografia - Futebol de Bairro', Content: DiscographyPage },
  },
  favorites: [
    { title: 'Futebol de Bairro', url: HOME_URL },
    { title: 'Discografia', url: DISCOGRAPHY_URL },
  ],
}

export default demoSite
