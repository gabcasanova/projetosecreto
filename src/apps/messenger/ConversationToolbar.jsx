import activitiesIcon from './assets/toolbar-atividades.png'
import inviteIcon from './assets/toolbar-convidar.png'
import sendFilesIcon from './assets/toolbar-enviar-arquivos.png'
import gamesIcon from './assets/toolbar-jogos.png'
import videoIcon from './assets/toolbar-video.png'
import voiceIcon from './assets/toolbar-voz.png'
import blockIcon from './assets/icon-block-13.png'
import colorSchemeIcon from './assets/icon-colorscheme-13.png'
import toggleIcon from './assets/icon-updown-16x15.png'
import logo from './assets/logo-msn-50x21.png'

/*
 * The glossy band across the top of a conversation: the big buttons on the
 * left, and the msn logo with Bloquear / Esquema de cores on the right,
 * where the band sweeps down in a curve. None of the buttons do anything,
 * so they're all greyed out.
 * `width` is each button's box, so the icons land where MSN put them.
 */
const BUTTONS = [
  { label: 'Convidar', icon: inviteIcon, width: 54, title: 'Convidar alguém para esta conversa' },
  { label: 'Enviar Arquivos', icon: sendFilesIcon, width: 88, title: 'Enviar um arquivo ou foto' },
  { label: 'Vídeo', icon: videoIcon, width: 58, title: 'Iniciar ou parar uma Conversa com Vídeo' },
  { label: 'Voz', icon: voiceIcon, width: 30, title: 'Iniciar ou parar uma Conversa com Voz' },
  { label: 'Atividades', icon: activitiesIcon, width: 66, title: 'Ver uma lista de atividades' },
  { label: 'Jogos', icon: gamesIcon, width: 40, title: 'Ver uma lista de jogos' },
]

function ConversationToolbar() {
  return (
    <div className="msn-cv-band">
      <div className="msn-cv-band-main">
        <button type="button" className="msn-toggle msn-cv-band-toggle" title="Ocultar a barra de ferramentas" aria-label="Ocultar a barra de ferramentas" disabled>
          <img src={toggleIcon} alt="" />
        </button>
        <div className="msn-cv-tools">
          {BUTTONS.map((button) => (
            <button key={button.label} type="button" className="msn-cv-tool" style={{ width: button.width }} title={button.title} disabled>
              <img src={button.icon} alt="" />
              <span>{button.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="msn-cv-band-curve" />
      <div className="msn-cv-band-top" />
      <div className="msn-cv-band-tray" />
      <div className="msn-cv-band-tray-end" />
      <img src={logo} alt="msn" className="msn-cv-logo" />
      <button type="button" className="msn-round-button msn-cv-block" title="Bloquear" aria-label="Bloquear" disabled>
        <img src={blockIcon} alt="" />
      </button>
      <button type="button" className="msn-round-button msn-cv-colors" title="Esquema de cores" aria-label="Esquema de cores" disabled>
        <img src={colorSchemeIcon} alt="" />
      </button>
    </div>
  )
}

export default ConversationToolbar
