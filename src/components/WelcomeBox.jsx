import infoIcon from '../assets/xp/xp-info-32.png'
import LinksGadget from './sidebar/LinksGadget'
import './welcome-box.css'

/*
 * What greets you once the computer has loaded: nothing but the wallpaper
 * and a Windows message box. The desktop only starts when you press OK
 * (that click is also what lets the browser play the startup sound).
 */
function WelcomeBox({ onOk }) {
  return (
    <div className="xp-desktop welcome-screen">
      <div className="welcome-box" role="alertdialog" aria-label="Futebol de Bairro">
        <div className="xp-titlebar flex items-center justify-between">
          <span className="xp-title truncate">Futebol de Bairro</span>
          <button type="button" aria-label="Fechar" className="xp-caption-button close" onClick={onOk} />
        </div>
        <div className="xp-frame">
          <div className="welcome-body">
            <div className="welcome-message">
              <img src={infoIcon} alt="" width={32} height={32} />
              <div>
                <h1 className="welcome-title">Futebol de Bairro</h1>
                <p>Seja bem-vindo ao site oficial do Futebol de Bairro!</p>
                <p>
                  Nesse site, você poderá conhecer tudo sobre a banda, escutar a discografia completa e se divertir com
                  várias atividades e easter-eggs.
                </p>
                <p>Mas, não se esqueça de seguir a banda no Instagram e em sua plataforma de música favorita!</p>
              </div>
            </div>
            <LinksGadget />
            <button type="button" className="xp-push-button welcome-ok" autoFocus onClick={onOk}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeBox
