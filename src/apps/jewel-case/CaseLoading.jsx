import './case-loading.css'

/**
 * What the CD viewer shows while it gets ready: first while its code
 * downloads, then while the 3D scene loads its pictures and compiles.
 * An XP-style marquee progress bar on the viewer's dark blue backdrop.
 *
 * Deliberately not part of the lazily loaded viewer code, so it can show
 * while that code is still on its way.
 */
function CaseLoading({ className = '' }) {
  return (
    <div className={`case-loading ${className}`} role="status">
      <p className="case-loading-text">Carregando o visualizador de CD...</p>
      <div className="case-loading-bar" aria-hidden="true">
        <div className="case-loading-blocks" />
      </div>
    </div>
  )
}

export default CaseLoading
