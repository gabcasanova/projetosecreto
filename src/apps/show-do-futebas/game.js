import { CLUBS } from './clubs'

/*
 * The rules of Show do Futebas. Twelve badges, each worth more than the
 * last. Which club comes up has nothing to do with the prize: any club or
 * league can appear at any question. At every question you can:
 * - answer right and go on (and win the next prize),
 * - stop and keep what you have,
 * - or answer wrong and leave with the last safe prize.
 */

export const PRIZES = [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 300000, 500000, 1000000]

// Once one of these is won, it's yours even if you get a later one wrong
const SAFE_LEVELS = [3, 7]

// Seconds to answer each question: less and less time as the prize grows
export const QUESTION_SECONDS = [30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 11, 10]

// The help you get once per game
export const HELPS = { skip: 2, eliminate: 2 }

// The prizes are paid in xibiblhões, the show's own currency
const CURRENCY = '$Xib'

/** "$Xib 500", "$Xib 20 mil", "$Xib 1 milhão" */
export function formatPrize(value) {
  if (value >= 1000000) return `${CURRENCY} 1 milhão`
  if (value >= 1000) return `${CURRENCY} ${value / 1000} mil`
  return `${CURRENCY} ${value}`
}

/** True if `level` is one of the safe prizes */
export function isSafeLevel(level) {
  return SAFE_LEVELS.includes(level)
}

/** What's at stake at question `level` (0-based): wrong, stop and right */
export function stakes(level) {
  const won = level > 0 ? PRIZES[level - 1] : 0
  const safeLevel = SAFE_LEVELS.filter((safe) => safe < level).at(-1)
  return {
    wrong: safeLevel === undefined ? 0 : PRIZES[safeLevel],
    stop: won,
    right: PRIZES[level],
  }
}

function shuffle(items) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// One question: the club, and its name among the three wrong ones in random order
function makeQuestion(club) {
  return { club, options: shuffle([club.name, ...club.wrong]) }
}

/**
 * A new game: twelve questions drawn at random from every club and league,
 * plus the rest of the shuffled deck as spares for when you skip one.
 */
export function createGame() {
  const deck = shuffle(CLUBS).map(makeQuestion)
  return { questions: deck.slice(0, PRIZES.length), spares: deck.slice(PRIZES.length) }
}

/** The game with question `level` swapped for the next spare */
export function skipQuestion(game, level) {
  if (game.spares.length === 0) return game
  const questions = [...game.questions]
  questions[level] = game.spares[0]
  return { questions, spares: game.spares.slice(1) }
}

/** Two wrong answers to hide for "Eliminar duas" */
export function twoWrongOptions(question) {
  return shuffle(question.options.filter((option) => option !== question.club.name)).slice(0, 2)
}
