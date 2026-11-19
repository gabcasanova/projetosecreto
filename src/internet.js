import bairrolog from './apps/bairrolog/site'
import futeborkut from './apps/futeborkut/site'
import bandSite from './apps/band-site/site'
import { combineSites } from './apps/internet-explorer/sites'

// Every website the simulated Internet Explorer can visit. The band's site is the home page.
const internet = combineSites([bandSite, futeborkut, bairrolog])

export default internet
