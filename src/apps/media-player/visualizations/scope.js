import { fadeTrails, waveSample } from './shared'

const POINTS = 256

// Two glowing oscilloscope traces of the raw waveform, one mirrored, cycling through colors
const scope = {
  id: 'scope',
  name: 'Osciloscópio',

  draw(context, frame) {
    const { width, height, time, levels, scale } = frame
    fadeTrails(context, width, height, 'rgba(0, 2, 10, 0.22)')

    context.globalCompositeOperation = 'lighter'
    context.lineWidth = (1.5 + levels.bass * 3) * scale
    context.shadowBlur = 14 * scale

    const traces = [
      { hue: (time * 50) % 360, direction: 1 },
      { hue: (time * 50 + 160) % 360, direction: -1 },
    ]
    for (const { hue, direction } of traces) {
      const color = `hsla(${hue}, 100%, 62%, 0.85)`
      context.strokeStyle = color
      context.shadowColor = color
      context.beginPath()
      for (let i = 0; i <= POINTS; i++) {
        const x = (i / POINTS) * width
        const y = height / 2 + waveSample(frame, i, POINTS) * height * 0.38 * direction
        if (i === 0) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.stroke()
    }

    context.shadowBlur = 0
  },
}

export default scope
