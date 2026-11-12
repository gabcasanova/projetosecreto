/*
 * Dates and numbers written the way orkut wrote them in pt-BR.
 */

const SHORT_MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const MONTHS = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const pad = (number) => String(number).padStart(2, '0')

/** 6245118 -> "6.245.118" */
export function formatNumber(number) {
  return number.toLocaleString('pt-BR')
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

// "2½ horas atrás", "1 hora atrás", "5 minutos atrás"
function timeAgo(date, now) {
  const elapsed = Math.max(0, now - date)
  if (elapsed < MINUTE) return 'menos de 1 minuto atrás'
  if (elapsed < HOUR) {
    const minutes = Math.floor(elapsed / MINUTE)
    return minutes === 1 ? '1 minuto atrás' : `${minutes} minutos atrás`
  }
  // Whole and half hours, rounded down
  const halfHours = Math.floor(elapsed / (HOUR / 2))
  const hours = Math.floor(halfHours / 2)
  const half = halfHours % 2 === 1 ? '½' : ''
  return hours === 1 && !half ? '1 hora atrás' : `${hours}${half} horas atrás`
}

/**
 * A scrap's date: "19:06 (2½ horas atrás)" today, "8 jul (20 horas atrás)" in the
 * last day, "8 jul" earlier this year and "8/7/2007" before that.
 */
export function formatScrapDate(date, now = new Date()) {
  if (isSameDay(date, now)) return `${pad(date.getHours())}:${pad(date.getMinutes())} (${timeAgo(date, now)})`
  const dayAndMonth = `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`
  if (now - date < DAY) return `${dayAndMonth} (${timeAgo(date, now)})`
  if (date.getFullYear() === now.getFullYear()) return dayAndMonth
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

/** Testimonials and the updates feed: "12 nov", or "12/11/2006" in earlier years. */
export function formatShortDate(date, now = new Date()) {
  if (date.getFullYear() === now.getFullYear()) return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

/** Last post in a forum: the time if it was today, otherwise like formatShortDate. */
export function formatForumDate(date, now = new Date()) {
  if (isSameDay(date, now)) return `${pad(date.getHours())}:${pad(date.getMinutes())}`
  return formatShortDate(date, now)
}

/** Community creation date: "4 de outubro de 2005". */
export function formatLongDate(date) {
  return `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`
}

// Birthdays are "YYYY-MM-DD"; read them as calendar dates, not as UTC midnight
function parseBirthday(birthday) {
  const [year, month, day] = birthday.split('-').map(Number)
  return { year, month: month - 1, day }
}

/** Profile birthday: "Março 1" (month capitalised, no year). */
export function formatBirthday(birthday) {
  const { month, day } = parseBirthday(birthday)
  const name = MONTHS[month]
  return `${name[0].toUpperCase()}${name.slice(1)} ${day}`
}

/** Short birthday for lists: "1 mar". */
export function formatBirthdayShort(birthday) {
  const { month, day } = parseBirthday(birthday)
  return `${day} ${SHORT_MONTHS[month]}`
}

export function ageFrom(birthday, now = new Date()) {
  const { year, month, day } = parseBirthday(birthday)
  const hadBirthdayThisYear = now.getMonth() > month || (now.getMonth() === month && now.getDate() >= day)
  return now.getFullYear() - year - (hadBirthdayThisYear ? 0 : 1)
}

/** Days until the next birthday (0 means today). */
export function daysUntilBirthday(birthday, now = new Date()) {
  const { month, day } = parseBirthday(birthday)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  let next = new Date(now.getFullYear(), month, day)
  if (next < today) next = new Date(now.getFullYear() + 1, month, day)
  return Math.round((next - today) / DAY)
}
