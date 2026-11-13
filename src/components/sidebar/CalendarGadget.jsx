import { useState } from 'react'
import useClock from './useClock'

const WEEKDAY_LETTERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const RING_COUNT = 10

/*
 * Vista's Sidebar calendar. It starts as an orange tear-off page with
 * today's date; clicking the page turns it into a month grid (and back),
 * where the arrows move between months.
 */
function CalendarGadget() {
  const now = useClock()
  const [view, setView] = useState('day')
  // The month shown in the grid, as its first day; null means "the current month"
  const [shownMonth, setShownMonth] = useState(null)

  if (view === 'day') {
    return (
      <div className="calendar-gadget">
        <Rings />
        <button
          type="button"
          className="calendar-page"
          title="Mostrar o mês"
          onClick={() => {
            setShownMonth(null)
            setView('month')
          }}
        >
          <span className="calendar-page-month">{now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
          <span className="calendar-page-day">{now.getDate()}</span>
          <span className="calendar-page-weekday">{now.toLocaleDateString('pt-BR', { weekday: 'long' })}</span>
        </button>
      </div>
    )
  }

  const month = shownMonth ?? new Date(now.getFullYear(), now.getMonth(), 1)
  const moveMonth = (offset) => setShownMonth(new Date(month.getFullYear(), month.getMonth() + offset, 1))

  return (
    <div className="calendar-gadget">
      <div className="calendar-month">
        <div className="calendar-month-header">
          <button type="button" className="calendar-arrow previous" aria-label="Mês anterior" onClick={() => moveMonth(-1)} />
          <button type="button" className="calendar-month-title" title="Mostrar hoje" onClick={() => setView('day')}>
            {month.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '').replace(' de ', ' ')}
          </button>
          <button type="button" className="calendar-arrow next" aria-label="Próximo mês" onClick={() => moveMonth(1)} />
        </div>
        <MonthGrid month={month} today={now} />
      </div>
    </div>
  )
}

// The weekday letters, then six weeks starting on Sunday, as Brazilian calendars do
function MonthGrid({ month, today }) {
  const isCurrentMonth = month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth()
  // Start on the Sunday on or before the 1st
  const start = new Date(month.getFullYear(), month.getMonth(), 1 - month.getDay())
  const days = Array.from({ length: 42 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index))

  return (
    <table className="calendar-grid">
      <thead>
        <tr>
          {WEEKDAY_LETTERS.map((letter, index) => (
            <th key={index} className={isCurrentMonth && index === today.getDay() ? 'today' : ''}>
              {letter}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 6 }, (_, week) => (
          <tr key={week}>
            {days.slice(week * 7, week * 7 + 7).map((day) => {
              const classes = [
                day.getMonth() !== month.getMonth() ? 'other-month' : '',
                day.toDateString() === today.toDateString() ? 'today' : '',
              ]
              return (
                <td key={day.toISOString()} className={classes.join(' ')}>
                  {day.getDate()}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// The spiral binding over the top of the page
function Rings() {
  return (
    <svg className="calendar-rings" width="100%" viewBox="0 0 124 12" aria-hidden="true">
      {Array.from({ length: RING_COUNT }, (_, index) => {
        const x = 10 + index * 11.6
        return (
          <g key={index}>
            <rect x={x - 1.5} y="8" width="5" height="3" rx="1.5" fill="#3a1500" opacity="0.6" />
            <rect x={x} y="1" width="2" height="9" rx="1" fill="#fff" stroke="#9a9a9a" strokeWidth="0.6" />
          </g>
        )
      })}
    </svg>
  )
}

export default CalendarGadget
