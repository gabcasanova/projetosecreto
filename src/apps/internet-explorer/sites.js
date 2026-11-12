/*
 * Helpers for the sites the browser can show (see InternetExplorer.jsx for
 * what a site looks like).
 */

// The page at `url`, from the site's fixed `pages` or its own `findPage` (for addresses like
// "Profile.aspx?uid=3", where one component serves many URLs). Null if the site has no such page.
export function findPage(site, url) {
  return site.pages?.[url] ?? site.findPage?.(url) ?? null
}

/*
 * Joins several sites into one "internet", so a single browser can visit any
 * of them. The home page is the first site's, unless another is given, and
 * the favourites of every site are listed together.
 */
export function combineSites(sites, { homeUrl = sites[0].homeUrl } = {}) {
  return {
    homeUrl,
    findPage(url) {
      for (const site of sites) {
        const page = findPage(site, url)
        if (page) return page
      }
      return null
    },
    favorites: sites.flatMap((site) => site.favorites ?? []),
  }
}
