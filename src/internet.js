import bairrolog from './apps/bairrolog/site'
import futeborkut from './apps/futeborkut/site'
import demoSite from './apps/internet-explorer/demo/demoSite'
import { combineSites } from './apps/internet-explorer/sites'

// Every website the simulated Internet Explorer can visit. The band's site is the home page.
const internet = combineSites([demoSite, futeborkut, bairrolog])

export default internet
