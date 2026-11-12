/*
 * Turns what was typed in the address bar (or a link's href) into a full URL,
 * the way IE does: "www.site.com" becomes "http://www.site.com/", and
 * "/page" is read relative to the page that's open.
 */
export function resolveUrl(input, baseUrl) {
  const text = input.trim()
  if (!text) return null

  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(text)
  const isRelative = /^[/.?#]/.test(text)

  try {
    if (hasScheme) return new URL(text).href
    if (isRelative && baseUrl) return new URL(text, baseUrl).href
    return new URL(`http://${text}`).href
  } catch {
    // Not a URL at all; IE would still try it, and show its error page
    return text
  }
}
