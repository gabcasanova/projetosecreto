import { useEffect, useRef, useState } from 'react'
import { playSound } from '../../sounds/sounds'
import {
  createGame,
  crowdVote,
  formatPrize,
  HELPS,
  isSafeLevel,
  PRIZES,
  skipQuestion,
  stakes,
  twoWrongOptions,
} from './game'
import './show-do-futebas.css'

const badges = import.meta.glob('./badges/*.png', { eager: true, import: 'default' })
const badgeOf = (club) => badges[`./badges/${club.id}.png`]

const LETTERS = ['A', 'B', 'C', 'D']
const QUESTION = { club: 'De qual clube é este escudo?', league: 'De qual liga é este escudo?' }
// How long the answer stays lit before the game moves on
const REVEAL_DURATION = 2200

/*
 * Show do Futebas: a prize quiz about Rio's football clubs. A badge comes
 * up with four names; pick the right one to climb the prize ladder. See
 * game.js for the rules.
 *
 * `phase` is 'intro', 'playing', 'confirming' (an answer picked, "Está
 * certo disso?"), 'revealing' (right or wrong, for a moment) or 'over'.
 */
function ShowDoFutebas() {
  const [phase, setPhase] = useState('intro')
  const [game, setGame] = useState(createGame)
  const [level, setLevel] = useState(0)
  const [selected, setSelected] = useState(null)
  const [helpsLeft, setHelpsLeft] = useState(HELPS)
  // Options hidden by "Eliminar duas", and the crowd's vote, for the current question only
  const [hidden, setHidden] = useState([])
  const [vote, setVote] = useState(null)
  const [result, setResult] = useState(null)

  // The reveal timer must not fire after the window is closed
  const revealTimer = useRef(null)
  useEffect(() => () => clearTimeout(revealTimer.current), [])

  const question = game.questions[level]

  function start() {
    setGame(createGame())
    setLevel(0)
    setHelpsLeft(HELPS)
    clearQuestionHelps()
    setResult(null)
    setPhase('playing')
  }

  function clearQuestionHelps() {
    setSelected(null)
    setHidden([])
    setVote(null)
  }

  function finish(outcome, prize) {
    setResult({ outcome, prize, club: question.club })
    setPhase('over')
  }

  function confirmAnswer() {
    const right = selected === question.club.name
    setPhase('revealing')
    playSound(right ? 'xpTada' : 'xpChord')

    revealTimer.current = setTimeout(() => {
      if (!right) return finish('wrong', stakes(level).wrong)
      if (level === PRIZES.length - 1) return finish('won', PRIZES[level])
      setLevel(level + 1)
      clearQuestionHelps()
      setPhase('playing')
    }, REVEAL_DURATION)
  }

  function takeHelp(help) {
    setHelpsLeft((current) => ({ ...current, [help]: current[help] - 1 }))
    if (help === 'skip') {
      setGame((current) => skipQuestion(current, level))
      clearQuestionHelps()
    }
    if (help === 'eliminate') setHidden(twoWrongOptions(question))
    if (help === 'crowd') setVote(crowdVote(question, level, hidden))
  }

  if (phase === 'intro') return <Intro onStart={start} />
  if (phase === 'over') return <GameOver result={result} onRestart={start} />

  const { wrong, stop, right } = stakes(level)
  const answering = phase === 'playing'

  return (
    <div className="ep">
      <div className="sf-main">
        <header className="sf-header">
          <Logo small />
          <span className="sf-level">
            Pergunta {level + 1} de {PRIZES.length} · valendo <b>{formatPrize(right)}</b>
          </span>
        </header>

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
                    {vote && vote[option] !== undefined && (
                      <span className="sf-vote" title="Votos da torcida">
                        <span className="sf-vote-bar" style={{ width: `${vote[option]}%` }} />
                        <span className="sf-vote-label">{vote[option]}%</span>
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {phase === 'confirming' ? (
          <div className="sf-confirm">
            <span>
              Você escolheu <b>{selected}</b>. Está certo disso?
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
                disabled={!answering}
                onClick={() => takeHelp('eliminate')}
              />
              <HelpButton label="Torcida" count={helpsLeft.crowd} disabled={!answering} onClick={() => takeHelp('crowd')} />
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

function Intro({ onStart }) {
  return (
    <div className="ep sf-screen">
      <Logo />
      <p className="sf-tagline">O quiz dos escudos do futebol carioca</p>
      <ul className="sf-rules">
        <li>Um escudo aparece com quatro nomes. Só um é o do clube.</li>
        <li>
          São 12 perguntas, dos grandes da Série A até os amadores da capital e as ligas municipais. A última vale R$ 1
          milhão.
        </li>
        <li>Errou? Leva o último prêmio garantido ({formatPrize(PRIZES[3])} ou {formatPrize(PRIZES[7])}).</li>
        <li>Ajudas: pular a pergunta (2 vezes), eliminar duas alternativas e perguntar à torcida.</li>
      </ul>
      <button type="button" className="sf-button sf-button-big" onClick={onStart}>
        Começar
      </button>
      <p className="sf-credits">Escudos: Federação de Futebol do Estado do Rio de Janeiro</p>
    </div>
  )
}

const OUTCOMES = {
  won: 'Você acertou todas!',
  stopped: 'Você parou.',
  wrong: 'Resposta errada!',
}

function GameOver({ result, onRestart }) {
  return (
    <div className="ep sf-screen">
      <Logo />
      <p className="sf-outcome">{OUTCOMES[result.outcome]}</p>
      {result.outcome === 'wrong' && (
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
