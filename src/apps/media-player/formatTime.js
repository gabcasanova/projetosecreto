// 75.4 -> "1:15"
export function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00'
  const whole = Math.floor(seconds)
  const minutes = Math.floor(whole / 60)
  const rest = String(whole % 60).padStart(2, '0')
  return `${minutes}:${rest}`
}

// 1447 -> "24 minutes", for album lengths
export function formatTotalDuration(seconds) {
  const minutes = Math.round(seconds / 60)
  return minutes === 1 ? '1 minute' : `${minutes} minutes`
}
