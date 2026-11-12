import Link from './Link'

/*
 * "primeira | < anterior | próxima > | última", with "mostrando 1-10 de 14".
 * Pages count from 1; `hrefFor(page)` gives each page's address.
 */
function Pager({ page, pageCount, hrefFor, first, last, total }) {
  const steps = [
    { label: 'primeira', target: 1, enabled: page > 1 },
    { label: '< anterior', target: page - 1, enabled: page > 1 },
    { label: 'próxima >', target: page + 1, enabled: page < pageCount },
    { label: 'última', target: pageCount, enabled: page < pageCount },
  ]

  return (
    <div className="pager">
      {total > 0 && (
        <span className="showing">
          mostrando {first}-{last} de {total}
        </span>
      )}
      {steps.map((step, index) => (
        <span key={step.label}>
          {index > 0 && ' | '}
          {step.enabled ? (
            <Link href={hrefFor(step.target)}>{step.label}</Link>
          ) : (
            <span className="disabled">{step.label}</span>
          )}
        </span>
      ))}
    </div>
  )
}

export default Pager
