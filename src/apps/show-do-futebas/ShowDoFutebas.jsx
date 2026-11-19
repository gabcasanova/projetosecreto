import { useEffect, useRef, useState } from 'react'
import { playSound } from '../../sounds/sounds'
import {
  createGame,
  formatPrize,
  HELPS,
  isSafeLevel,
  PRIZES,
  QUESTION_SECONDS,
  skipQuestion,
  stakes,
  twoWrongOptions,
} from './game'
import Host from './Host'
import './show-do-futebas.css'

const badges = import.meta.glob('./badges/*.png', { eager: true, import: 'default' })
const badgeOf = (club) => badges[`./badges/${club.id}.png`]

const LETTERS = ['A', 'B', 'C', 'D']
const QUESTION = { club: 'De qual clube é este escudo?', league: 'De qual liga é este escudo?' }
// How long the answer stays lit before the game moves on
const REVEAL_DURATION = 2200
// How long "Valendo..." stays up before the question: as long as the "valendo" sound
const ANNOUNCE_DURATION = 3400

/*
 * Show do Futebas: a prize quiz about Rio's football clubs. A badge comes
 * up with four names; pick the right one to climb the prize ladder. See
 * game.js for the rules.
 *
 * `phase` is 'intro', 'announcing' ("Valendo $Xib..." before each
 * question), 'playing', 'confirming' (an answer picked, "Posso
 * perguntar?"), 'revealing' (right or wrong, for a moment) or 'over'.
 * Each question has a clock (shorter the higher the prize) that keeps
 * running while you confirm; when it runs out, it counts as a wrong answer.
 */
function ShowDoFutebas() {
  const [phase, setPhase] = useState('intro')
  const [game, setGame] = useState(createGame)
  const [level, setLevel] = useState(0)
  const [selected, setSelected] = useState(null)
  const [helpsLeft, setHelpsLeft] = useState(HELPS)
  // Options hidden by "Eliminar 2", for the current question only
  const [hidden, setHidden] = useState([])
  const [result, setResult] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS[0])

  // The announce and reveal timers must not fire after the window is closed
  const stepTimer = useRef(null)
  useEffect(() => () => clearTimeout(stepTimer.current), [])

  const question = game.questions[level]

  // The clock ticks once a second while a question is open; the interval calls the latest `tick`
  const clockRunning = phase === 'playing' || phase === 'confirming'
  const tick = useRef(null)
  useEffect(() => {
    tick.current = () => (secondsLeft <= 1 ? timeUp() : setSecondsLeft(secondsLeft - 1))
  })
  useEffect(() => {
    if (!clockRunning) return
    const interval = setInterval(() => tick.current(), 1000)
    return () => clearInterval(interval)
  }, [clockRunning, level])

  function start() {
    setGame(createGame())
    setHelpsLeft(HELPS)
    setResult(null)
    beginQuestion(0)
  }

  // "Valendo $Xib ..." with the sound, then the question itself (and its clock)
  function beginQuestion(nextLevel) {
    setLevel(nextLevel)
    clearQuestionHelps()
    setSecondsLeft(QUESTION_SECONDS[nextLevel])
    setPhase('announcing')
    playSound('valendo')
    stepTimer.current = setTimeout(() => setPhase('playing'), ANNOUNCE_DURATION)
  }

  function clearQuestionHelps() {
    setSelected(null)
    setHidden([])
  }

  function finish(outcome, prize) {
    setResult({ outcome, prize, club: question.club })
    setPhase('over')
  }

  function confirmAnswer() {
    reveal(selected === question.club.name ? 'right' : 'wrong')
  }

  // Out of time: whatever was picked doesn't count, and the right answer lights up
  function timeUp() {
    setSecondsLeft(0)
    setSelected(null)
    reveal('timeout')
  }

  // Shows the answer for a moment, then moves on (or ends the game)
  function reveal(outcome) {
    setPhase('revealing')
    // Right: XP's ta-da. Wrong or out of time: the host laughs at you
    playSound(outcome === 'right' ? 'xpTada' : 'risada')

    stepTimer.current = setTimeout(() => {
      if (outcome !== 'right') return finish(outcome, stakes(level).wrong)
      if (level === PRIZES.length - 1) return finish('won', PRIZES[level])
      beginQuestion(level + 1)
    }, REVEAL_DURATION)
  }

  function takeHelp(help) {
    setHelpsLeft((current) => ({ ...current, [help]: current[help] - 1 }))
    if (help === 'skip') {
      setGame((current) => skipQuestion(current, level))
      clearQuestionHelps()
      // A new question gets its full time
      setSecondsLeft(QUESTION_SECONDS[level])
    }
    if (help === 'eliminate') setHidden(twoWrongOptions(question))
  }

  if (phase === 'intro') return <Intro onStart={start} />
  if (phase === 'over') return <GameOver result={result} onRestart={start} />

  const { wrong, stop, right } = stakes(level)
  const answering = phase === 'playing'

  if (phase === 'announcing') return <Announcement level={level} prize={right} />

  return (
    <div className="sf">
      <div className="sf-main">
        <header className="sf-header">
          <Logo small />
          <span className="sf-level">
            Pergunta {level + 1} de {PRIZES.length} · valando <b>{formatPrize(right)}</b>
          </span>
        </header>
        <Clock seconds={secondsLeft} total={QUESTION_SECONDS[level]} />

        <div className="sf-stage">
          <div className="sf-badge">
            <img src={badgeOf(question.club)} alt="Escudo" draggable={false} />
          </div>
          <div className="sf-question">
            <p className="sf-question-text">{QUESTION[question.club.kind]}</p>
            <ol className="sf-options">
              {question.options.map((option, index) => (
                <li key={option}>
                  <button
                    type="button"
                    className={`sf-option ${optionState(option, { phase, selected, question, hidden })}`}
                    disabled={!answering || hidden.includes(option)}
                    onClick={() => {
                      setSelected(option)
                      setPhase('confirming')
                    }}
                  >
                    <span className="sf-option-letter">{LETTERS[index]}</span>
                    <span className="sf-option-name">{hidden.includes(option) ? '' : option}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* The host pops up to ask; picking another answer brings him back for another go */}
        {phase === 'confirming' && <Host key={selected} />}

        {phase === 'confirming' ? (
          <div className="sf-confirm">
            <span>
              Você escolheu <b>{selected}</b>. Posso perguntare? Posso perguê?
            </span>
            <button type="button" className="sf-button sf-button-yes" onClick={confirmAnswer}>
              Sim
            </button>
            <button
              type="button"
              className="sf-button"
              onClick={() => {
                setSelected(null)
                setPhase('playing')
              }}
            >
              Não
            </button>
          </div>
        ) : (
          <footer className="sf-footer">
            <div className="sf-stakes">
              <Stake label="Errar" value={wrong} />
              <Stake label="Parar" value={stop} />
              <Stake label="Acertar" value={right} />
            </div>
            <div className="sf-helps">
              <HelpButton label="Pular" count={helpsLeft.skip} disabled={!answering} onClick={() => takeHelp('skip')} />
              <HelpButton
                label="Eliminar 2"
                count={helpsLeft.eliminate}
                // Once per question: after two are gone there's nothing left to take away
                disabled={!answering || hidden.length > 0}
                onClick={() => takeHelp('eliminate')}
              />
              <button
                type="button"
                className="sf-button sf-button-stop"
                disabled={!answering}
                onClick={() => finish('stopped', stop)}
              >
                Parar
              </button>
            </div>
          </footer>
        )}
      </div>

      <PrizeLadder level={level} />
    </div>
  )
}

// How an option looks right now: picked, or (while revealing) right or wrong
function optionState(option, { phase, selected, question, hidden }) {
  if (hidden.includes(option)) return 'eliminated'
  if (phase === 'revealing') {
    if (option === question.club.name) return 'right'
    if (option === selected) return 'wrong'
    return ''
  }
  return option === selected ? 'selected' : ''
}

// The time left for the question: a bar that empties, red for the last five seconds
function Clock({ seconds, total }) {
  return (
    <div className={`sf-clock ${seconds <= 5 ? 'urgent' : ''}`} role="timer" aria-label={`${seconds} segundos`}>
      <div className="sf-clock-track">
        <div className="sf-clock-fill" style={{ width: `${(seconds / total) * 100}%` }} />
      </div>
      <span className="sf-clock-seconds">{seconds}s</span>
    </div>
  )
}

function Logo({ small = false }) {
  return (
    <div className={`sf-logo ${small ? 'small' : ''}`} aria-label="Show do Futebas">
      <span className="sf-logo-top">Show do</span>
      <span className="sf-logo-bottom">Futebas</span>
    </div>
  )
}

function Stake({ label, value }) {
  return (
    <div className="sf-stake">
      <span className="sf-stake-value">{formatPrize(value)}</span>
      <span className="sf-stake-label">{label}</span>
    </div>
  )
}

function HelpButton({ label, count, disabled, onClick }) {
  return (
    <button type="button" className="sf-button sf-help" disabled={disabled || count === 0} onClick={onClick}>
      {label}
      <span className="sf-help-count">{count}</span>
    </button>
  )
}

// The prizes from the top down; the current one lit, the safe ones in white
function PrizeLadder({ level }) {
  return (
    <ol className="sf-ladder" aria-label="Prêmios">
      {PRIZES.map((prize, index) => (
        <li
          key={prize}
          className={`sf-rung ${index === level ? 'current' : ''} ${index < level ? 'won' : ''} ${isSafeLevel(index) ? 'safe' : ''}`}
        >
          <span className="sf-rung-number">{index + 1}</span>
          <span className="sf-rung-prize">{formatPrize(prize)}</span>
        </li>
      )).reverse()}
    </ol>
  )
}

// The title screen: the logo crashes in, a shine sweeps across it, then the subtitle and the button follow
function Intro({ onStart }) {
  return (
    <div className="sf sf-screen sf-intro">
      <div className="sf-intro-logo">
        <Logo />
      </div>
      <p className="sf-tagline">O quiz dos escudos do futebol carioca</p>
      <button type="button" className="sf-button sf-button-big sf-intro-start" onClick={onStart}>
        Começar
      </button>
      <p className="sf-credits">
        Escudos e nomes dos clubes e ligas: FERJ — Federação de Futebol do Estado do Rio de Janeiro
        <br />
        servicos.fferj.com.br/ClubesLigas
      </p>
    </div>
  )
}

// Before each question: "Valendo" and the prize, big, while the sound plays
function Announcement({ level, prize }) {
  return (
    <div className="sf sf-screen sf-announce">
      <span className="sf-announce-number">Pergunta {level + 1}</span>
      <span className="sf-announce-label">Valando</span>
      <span className="sf-announce-prize">{formatPrize(prize)}</span>
    </div>
  )
}

const OUTCOMES = {
  won: 'Você acertou todas!',
  stopped: 'Você parou.',
  wrong: 'Resposta errada!',
  timeout: 'O tempo acabou!',
}

function GameOver({ result, onRestart }) {
  return (
    <div className="sf sf-screen">
      <Logo />
      <p className="sf-outcome">{OUTCOMES[result.outcome]}</p>
      {(result.outcome === 'wrong' || result.outcome === 'timeout') && (
        <div className="sf-answer">
          <img src={badgeOf(result.club)} alt="" draggable={false} />
          <span>
            A resposta certa era <b>{result.club.name}</b>.
          </span>
        </div>
      )}
      <p className="sf-prize">
        Você leva <b>{formatPrize(result.prize)}</b>
      </p>
      <button type="button" className="sf-button sf-button-big" onClick={onRestart}>
        Jogar de novo
      </button>
    </div>
  )
}

export default ShowDoFutebas
