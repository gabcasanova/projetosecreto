import { useEffect, useRef, useState } from 'react'
import errorIcon from '../../assets/xp/xp-error-32.png'
import infoIcon from '../../assets/xp/xp-info-32.png'
import questionIcon from '../../assets/xp/xp-question-32.png'
import warningIcon from '../../assets/xp/xp-warning-32.png'
import { useDisplayScale } from '../../hooks/displayScale'
import { playSound } from '../../sounds/sounds'
import './virus.css'

/*
 * What happens when you open Marcio's "photo": XP message boxes start
 * popping up all over the desktop (errors, warnings, questions...), each
 * with its Windows sound, faster and faster. Close them all and you survive
 * (`onSurvived`). Let too many pile up and the computer gives up with XP's
 * blue screen, then restarts (`onCrashed`).
 */

const TOTAL_POPUPS = 40
// Too many open at once and Windows crashes
const CRASH_AT = 22
// The first box comes quickly, then they speed up
const FIRST_DELAY = 400
const START_INTERVAL = 700
const FASTEST_INTERVAL = 220
const SPEED_UP = 22
// Once it gets going, now and then two boxes come at once
const DOUBLE_FROM = 10
const DOUBLE_CHANCE = 0.35
// How long the blue screen stays before the restart
const BLUE_SCREEN_DURATION = 6000

const POPUP_WIDTH = 340
const POPUP_HEIGHT = 130

// XP's kinds of message box: their icon, and the sound XP's default sound scheme gave them
const KINDS = {
  error: { icon: errorIcon, sound: 'xpCriticalStop' },
  warning: { icon: warningIcon, sound: 'xpExclamation' },
  // "Asterisk" in XP's sound scheme, which used the file called Error
  info: { icon: infoIcon, sound: 'xpError' },
  question: { icon: questionIcon, sound: 'xpDing' },
}

function messageBoxes(fileName) {
  const program = fileName.replace(/\.zip$/, '.jpg.exe')
  return [
    { kind: 'error', title: program, text: `${program} não é um aplicativo Win32 válido.` },
    { kind: 'warning', title: 'Central de Segurança', text: 'Seu computador pode estar em risco. Nenhum antivírus foi encontrado.' },
    { kind: 'question', title: program, text: `Deseja permitir que ${program} faça alterações no computador?` },
    {
      kind: 'error',
      title: 'svchost.exe - Erro de aplicativo',
      text: 'A instrução em "0x7c911e58" fez referência à memória em "0x00000000". A memória não pôde ser "read".',
    },
    { kind: 'info', title: program, text: `Instalando ${program}... 37% concluído.` },
    { kind: 'warning', title: 'Memória virtual insuficiente', text: 'O Windows detectou que a memória virtual do sistema está baixa.' },
    { kind: 'error', title: 'Windows Explorer', text: 'O Windows Explorer encontrou um problema e precisa ser fechado.' },
    { kind: 'question', title: 'Confirmar exclusão', text: 'Tem certeza de que deseja excluir todos os arquivos de "Meus documentos"?' },
    { kind: 'info', title: 'MSN Messenger', text: `${fileName} foi enviado para todos os seus contatos.` },
    { kind: 'warning', title: 'Espaço em disco insuficiente', text: 'Você está ficando sem espaço em disco no Disco local (C:).' },
    { kind: 'error', title: 'Erro', text: `Não foi possível abrir ${fileName}: o arquivo está corrompido.` },
    { kind: 'question', title: 'Internet Explorer', text: 'Deseja definir "www.fotospraia.com.br" como sua página inicial?' },
    { kind: 'info', title: 'Windows Update', text: 'Novas atualizações estão prontas para serem instaladas no computador.' },
    { kind: 'error', title: 'Erro fatal', text: 'Erro 0x0000007B: dispositivo de inicialização inacessível.' },
    { kind: 'warning', title: program, text: 'Foram encontrados 3.481 vírus no seu computador. Clique em OK para removê-los.' },
  ]
}

function VirusAttack({ fileName, onSurvived, onCrashed }) {
  const [popups, setPopups] = useState([])
  // The screen's size in the desktop's own (possibly zoomed) pixels, so the boxes land on screen
  const { scale } = useDisplayScale()
  const [spawned, setSpawned] = useState(0)
  const boxes = useRef(messageBoxes(fileName))
  const finished = useRef(false)
  // Too many open at once and Windows gives up (the boxes are gone behind the blue screen, so it stays)
  const blueScreen = popups.length >= CRASH_AT
  // The provider's callbacks change as it re-renders; the timers below use the latest ones
  const callbacks = useRef({ onSurvived, onCrashed })
  useEffect(() => {
    callbacks.current = { onSurvived, onCrashed }
  })

  // Pop a new box (or two) after a while, quicker each time, until all of them are out
  useEffect(() => {
    if (blueScreen || spawned >= TOTAL_POPUPS) return
    const delay = spawned === 0 ? FIRST_DELAY : Math.max(FASTEST_INTERVAL, START_INTERVAL - spawned * SPEED_UP)
    const timer = setTimeout(() => {
      const count = spawned >= DOUBLE_FROM && Math.random() < DOUBLE_CHANCE ? 2 : 1
      const newPopups = Array.from({ length: count }, (_, offset) => {
        const id = spawned + offset
        return {
          id,
          ...boxes.current[id % boxes.current.length],
          x: Math.random() * Math.max(0, window.innerWidth / scale - POPUP_WIDTH - 260),
          y: Math.random() * Math.max(0, window.innerHeight / scale - POPUP_HEIGHT - 60),
        }
      })
      setPopups((current) => [...current, ...newPopups])
      setSpawned((current) => current + count)
      playSound(KINDS[newPopups[0].kind].sound)
    }, delay)
    return () => clearTimeout(timer)
  }, [spawned, blueScreen, scale])

  // All out and all closed: survived
  useEffect(() => {
    if (finished.current) return
    if (spawned >= TOTAL_POPUPS && popups.length === 0) {
      finished.current = true
      callbacks.current.onSurvived()
    }
  }, [popups.length, spawned])

  // The blue screen stays a few seconds, then the computer restarts
  useEffect(() => {
    if (!blueScreen) return
    const timer = setTimeout(() => callbacks.current.onCrashed(), BLUE_SCREEN_DURATION)
    return () => clearTimeout(timer)
  }, [blueScreen])

  if (blueScreen) return <BlueScreen />

  function close(id) {
    setPopups((current) => current.filter((popup) => popup.id !== id))
  }

  return (
    <div className="virus-layer">
      {popups.map((popup, index) => (
        <MessageBox key={popup.id} popup={popup} zIndex={index} onClose={() => close(popup.id)} />
      ))}
    </div>
  )
}

// One XP message box: title bar with just the close button, the kind's icon, the message and its buttons
function MessageBox({ popup, zIndex, onClose }) {
  // Questions get Sim / Não; whichever you press, the box just closes
  const buttons = popup.kind === 'question' ? ['Sim', 'Não'] : ['OK']

  return (
    <div className="virus-box" role="alertdialog" aria-label={popup.title} style={{ left: popup.x, top: popup.y, zIndex }}>
      <div className="xp-titlebar flex items-center justify-between">
        <span className="xp-title truncate">{popup.title}</span>
        <button type="button" aria-label="Fechar" className="xp-caption-button close" onClick={onClose} />
      </div>
      <div className="xp-frame">
        <div className="virus-box-body">
          <div className="virus-box-message">
            <img src={KINDS[popup.kind].icon} alt="" width={32} height={32} />
            <p>{popup.text}</p>
          </div>
          <div className="virus-box-buttons">
            {buttons.map((label) => (
              <button key={label} type="button" className="xp-push-button" onClick={onClose}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// XP's "stop error" screen, in Portuguese
function BlueScreen() {
  return (
    <div className="virus-bsod" role="alert">
      <p>Foi detectado um problema e o Windows foi desligado para evitar danos ao computador.</p>
      <p>FOTO_PRAIA_ZIP_NAO_E_UMA_FOTO</p>
      <p>
        Se esta for a primeira vez que você vê esta tela de erro de parada, reinicie o computador. Se esta tela aparecer
        novamente, siga estas etapas:
      </p>
      <p>
        Verifique se nenhum contato do MSN está mandando arquivos suspeitos. Se estiver, peça a ele para parar. Desconfie
        de fotos suas que você não lembra de ter tirado.
      </p>
      <p>Informações técnicas:</p>
      <p>*** STOP: 0x0000008E (0xC0000005, 0xBF8A2F1C, 0xEE6D3B70, 0x00000000)</p>
      <p>
        Iniciando o despejo da memória física
        <br />
        Despejo da memória física concluído.
        <br />
        Contate o administrador do sistema ou o grupo de suporte técnico para obter mais assistência.
      </p>
    </div>
  )
}

export default VirusAttack
