import aboutLogo from '../../assets/ie/about-logo.png'
import './splash.css'

/*
 * The logo IE shows while it starts: a white square in the middle of the
 * screen, before the browser window appears. The desktop decides how long
 * it stays up (see `splashDuration` in Desktop.jsx).
 */
function Splash() {
  return (
    <div className="ie-splash" role="status" aria-label="Iniciando o Internet Explorer">
      <img src={aboutLogo} alt="Microsoft Internet Explorer" draggable={false} />
      <p className="ie-splash-copyright">Copyright ©1995-2004 Microsoft Corp.</p>
    </div>
  )
}

export default Splash
