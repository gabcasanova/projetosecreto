import Link from './Link'

/*
 * orkut's white rounded box. Small boxes have an h2 title with an optional
 * count link, "amigos (12)"; the main box of a page has an h1 and a
 * breadcrumb instead (see TitleModule). `footer` is the row of links under
 * the divider at the bottom ("ver todos").
 */
function Module({ title, count, countHref, footer, children }) {
  return (
    <div className="module">
      {title && (
        <h2>
          {title}
          {count !== undefined && (
            <span className="headernote">
              {' '}
              {countHref ? <Link href={countHref}>({count})</Link> : `(${count})`}
            </span>
          )}
        </h2>
      )}
      <div className="boxmid">
        {children}
        {footer && (
          <>
            <div className="listdivi" />
            <div className="parabtns">{footer}</div>
          </>
        )}
      </div>
    </div>
  )
}

/** The page's main box, headed by a big title and the breadcrumb under it. */
export function TitleModule({ title, aside, breadcrumb, children }) {
  return (
    <div className="module">
      <h1>
        {title}
        {aside}
      </h1>
      {breadcrumb && <div className="breadcrumb">{breadcrumb}</div>}
      {children}
    </div>
  )
}

/** "Marcio > depoimentos": each step but the last is a link. */
export function Breadcrumb({ steps }) {
  return steps.map((step, index) => (
    <span key={index}>
      {index > 0 && ' > '}
      {step.href ? <Link href={step.href}>{step.label}</Link> : step.label}
    </span>
  ))
}

export default Module
