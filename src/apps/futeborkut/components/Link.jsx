import BrowserLink from '../../internet-explorer/BrowserLink'

/**
 * A link on futeborkut. Links to pages the site doesn't have get a null
 * `href` (see links.js) and are drawn greyed out, going nowhere, instead
 * of leading to an error page.
 */
function Link({ href, className = '', children, ...props }) {
  if (href == null) {
    return (
      <span className={`deadlink ${className}`} aria-disabled="true">
        {children}
      </span>
    )
  }
  return (
    <BrowserLink href={href} className={className} {...props}>
      {children}
    </BrowserLink>
  )
}

export default Link
