import { CLUBS } from './clubs'

/*
 * The rules of Show do Futebas. Twelve badges, each worth more than the
 * last: the big clubs first, then the lower divisions, and for the last two
 * the capital's amateur clubs and the town leagues. At every question you can:
 * - answer right and go on (and win the next prize),
 * - stop and keep what you have,
 * - or answer wrong and leave with the last safe prize.
 */

export const PRIZES = [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 300000, 500000, 1000000]

// Once one of these is won, it's yours even if you get a later one wrong
const SAFE_LEVELS = [3, 7]

// Which clubs can come up at each question
const LEVELS = ['easy', 'easy', 'easy', 'easy', 'medium', 'medium', 'medium', 'medium', 'hard', 'hard', 'expert', 'expert']

// The help you get once per game
export const HELPS = { skip: 2, eliminate: 1, crowd: 1 }

/** "R$ 500", "R$ 20 mil", "R$ 1 milhão" */
export function formatPrize(value) {
  if (value >= 1000000) return 'R$ 1 milhão'
  if (value >= 1000) return `R$ ${value / 1000} mil`
  return `R$ ${value}`
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
 * A new game: one question per prize, plus spare questions of each level
 * for when you skip one.
 */
export function createGame() {
  const pools = {
    easy: shuffle(CLUBS.filter((club) => club.level === 'easy')),
    medium: shuffle(CLUBS.filter((club) => club.level === 'medium')),
    hard: shuffle(CLUBS.filter((club) => club.level === 'hard')),
    expert: shuffle(CLUBS.filter((club) => club.level === 'expert')),
  }
  return {
    questions: LEVELS.map((level) => makeQuestion(pools[level].pop())),
    spares: {
      easy: pools.easy.map(makeQuestion),
      medium: pools.medium.map(makeQuestion),
      hard: pools.hard.map(makeQuestion),
      expert: pools.expert.map(makeQuestion),
    },
  }
}

/** The game with question `level` swapped for a spare of the same level */
export function skipQuestion(game, level) {
  const pool = game.spares[LEVELS[level]]
  if (pool.length === 0) return game
  const questions = [...game.questions]
  questions[level] = pool[0]
  return { questions, spares: { ...game.spares, [LEVELS[level]]: pool.slice(1) } }
}

/** Two wrong answers to hide for "Eliminar duas" */
export function twoWrongOptions(question) {
  return shuffle(question.options.filter((option) => option !== question.club.name)).slice(0, 2)
}

/**
 * The crowd's vote, in percent per option. The crowd knows the big clubs
 * well and the small ones much less, so the right answer leads by less the
 * further you go (and at the top it may well not win).
 */
export function crowdVote(question, level, hidden) {
  const confidence = level < 4 ? 0.75 : level < 8 ? 0.5 : level < 10 ? 0.3 : 0.2
  const visible = question.options.filter((option) => !hidden.includes(option))
  const weights = visible.map((option) =>
    option === question.club.name ? confidence + Math.random() * 0.25 : Math.random() * (1 - confidence),
  )
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  const percents = weights.map((weight) => Math.round((weight / total) * 100))
  // Rounding can leave it at 99 or 101; the leader absorbs the difference
  const leader = percents.indexOf(Math.max(...percents))
  percents[leader] += 100 - percents.reduce((sum, percent) => sum + percent, 0)
  return Object.fromEntries(visible.map((option, index) => [option, percents[index]]))
}
