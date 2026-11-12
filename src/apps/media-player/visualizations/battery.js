import { fadeTrails, waveSample } from './shared'

const RING_POINTS = 96

/*
 * WMP's "Battery" look: every frame redraws the previous one slightly zoomed
 * and turned, so whatever is painted in the middle streams outwards into a
 * swirling tunnel.
 */
const battery = {
  id: 'battery',
  name: 'Bateria',

  draw(context, frame, memory) {
    const { width, height } = frame
    const buffer = getBuffer(memory, width, height)

    // Keep a copy of the last frame, then paint it back zoomed in and rotated
    buffer.context.clearRect(0, 0, width, height)
    buffer.context.drawImage(context.canvas, 0, 0)

    fadeTrails(context, width, height, '#020a08')
    zoomFeedback(context, buffer.canvas, frame)
    // Darken after the feedback too, or the loop keeps brightening until everything is grey-white
    fadeTrails(context, width, height, 'rgba(2, 10, 8, 0.08)')

    context.globalCompositeOperation = 'lighter'
    paintCore(context, frame)
    paintWaveRing(context, frame)
  },
}

function getBuffer(memory, width, height) {
  if (!memory.buffer || memory.buffer.canvas.width !== width || memory.buffer.canvas.height !== height) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    memory.buffer = { canvas, context: canvas.getContext('2d') }
  }
  return memory.buffer
}

function zoomFeedback(context, previousFrame, { width, height, levels, time }) {
  const zoom = 1.02 + levels.bass * 0.06
  const turn = 0.004 + levels.mid * 0.025 * Math.sin(time * 0.3)

  context.save()
  context.globalAlpha = 0.9
  context.translate(width / 2, height / 2)
  context.rotate(turn)
  context.scale(zoom, zoom)
  context.translate(-width / 2, -height / 2)
  context.drawImage(previousFrame, 0, 0)
  context.restore()
}

// A pale, spinning square in the middle that the tunnel streams out of
function paintCore(context, { width, height, time, levels, scale }) {
  const size = (10 + levels.bass * 40) * scale
  context.save()
  context.translate(width / 2, height / 2)
  context.rotate(time * 0.8)
  context.fillStyle = `hsla(${45 + levels.treble * 40}, 70%, 75%, ${0.2 + levels.bass * 0.3})`
  context.fillRect(-size / 2, -size / 2, size, size)
  context.restore()
}

// The waveform wrapped into a wobbling ring, in sea greens and teals
function paintWaveRing(context, frame) {
  const { width, height, time, levels, scale } = frame
  const radius = Math.min(width, height) * (0.06 + levels.bass * 0.08)

  context.lineWidth = 2 * scale
  context.strokeStyle = `hsla(${150 + Math.sin(time * 0.5) * 40}, 75%, 50%, 0.6)`
  context.beginPath()
  for (let i = 0; i <= RING_POINTS; i++) {
    const angle = (i / RING_POINTS) * Math.PI * 2
    const distance = radius * (1 + waveSample(frame, i, RING_POINTS) * 0.8)
    const x = width / 2 + Math.cos(angle) * distance
    const y = height / 2 + Math.sin(angle) * distance
    if (i === 0) context.moveTo(x, y)
    else context.lineTo(x, y)
  }
  context.stroke()
}

export default battery
