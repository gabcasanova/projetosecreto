import { fadeTrails } from './shared'

const SYMMETRY = 8
const RIBBON_POINTS = 64

// Spiralling, mirrored ribbons around a spectrum ring: a kaleidoscope that breathes with the bass
const alchemy = {
  id: 'alchemy',
  name: 'Alchemy',

  draw(context, frame) {
    const { width, height } = frame
    const center = { x: width / 2, y: height / 2 }
    const radius = Math.min(width, height) / 2

    fadeTrails(context, width, height, 'rgba(2, 5, 22, 0.13)')

    context.globalCompositeOperation = 'lighter'
    paintGlow(context, center, radius, frame)
    paintRibbons(context, center, radius, frame)
    if (frame.frequencies) paintSpectrumRing(context, center, radius, frame)
  },
}

function paintGlow(context, center, radius, { time, levels, width, height }) {
  const hue = (time * 15) % 360
  const glow = context.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius * (0.6 + levels.bass))
  glow.addColorStop(0, `hsla(${hue}, 90%, 55%, ${0.05 + levels.bass * 0.12})`)
  glow.addColorStop(1, 'hsla(0, 0%, 0%, 0)')
  context.fillStyle = glow
  context.fillRect(0, 0, width, height)
}

function paintRibbons(context, center, radius, { time, levels, scale }) {
  const reach = radius * (0.55 + levels.bass * 0.7)
  const twist = 2 + levels.mid * 4
  const squash = 0.55 + 0.45 * Math.sin(time * 0.35)

  context.lineWidth = (1 + levels.bass * 5) * scale
  context.lineCap = 'round'

  for (let arm = 0; arm < SYMMETRY; arm++) {
    const hue = (time * 40 + arm * (360 / SYMMETRY)) % 360
    // Additive blending turns overlaps white quickly, so keep each ribbon fairly faint
    context.strokeStyle = `hsla(${hue}, 95%, 58%, ${0.16 + levels.bass * 0.22})`

    context.save()
    context.translate(center.x, center.y)
    context.rotate((arm / SYMMETRY) * Math.PI * 2 + time * 0.15)

    for (const mirror of [1, -1]) {
      context.beginPath()
      for (let i = 0; i <= RIBBON_POINTS; i++) {
        const progress = i / RIBBON_POINTS
        const wobble = Math.sin(time * 1.3 + progress * 9) * levels.treble * 0.9
        const angle = progress * twist + time * 0.4 + wobble
        const distance = progress * reach
        const x = Math.cos(angle) * distance
        const y = Math.sin(angle) * distance * squash * mirror
        if (i === 0) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.stroke()
    }
    context.restore()
  }
}

// The raw spectrum bent into a circle of rays around the center
function paintSpectrumRing(context, center, radius, { time, frequencies, scale }) {
  const bins = 96
  const innerRadius = radius * 0.22
  context.lineWidth = 2 * scale

  for (let i = 0; i < bins; i++) {
    const value = frequencies[i + 2] / 255
    const angle = (i / bins) * Math.PI * 2 - time * 0.2
    const outerRadius = innerRadius + value * radius * 0.45
    const hue = (time * 30 + (i / bins) * 360) % 360

    context.strokeStyle = `hsla(${hue}, 100%, 65%, ${0.15 + value * 0.5})`
    context.beginPath()
    context.moveTo(center.x + Math.cos(angle) * innerRadius, center.y + Math.sin(angle) * innerRadius)
    context.lineTo(center.x + Math.cos(angle) * outerRadius, center.y + Math.sin(angle) * outerRadius)
    context.stroke()
  }
}

export default alchemy
