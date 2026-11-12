import { fadeTrails } from './shared'

const MAX_BUBBLES = 40

// Soft, glassy bubbles that drift upwards; louder music blows more and bigger ones
const ambience = {
  id: 'ambience',
  name: 'Ambiência',

  draw(context, frame, memory) {
    const { width, height, levels } = frame
    memory.bubbles ??= []

    fadeTrails(context, width, height, 'rgba(4, 16, 22, 0.25)')

    const spawnChance = 0.04 + levels.bass * 0.5
    if (memory.bubbles.length < MAX_BUBBLES && Math.random() < spawnChance) {
      memory.bubbles.push(createBubble(frame))
    }

    context.globalCompositeOperation = 'lighter'
    for (const bubble of memory.bubbles) {
      moveBubble(bubble, frame)
      paintBubble(context, bubble, frame)
    }
    memory.bubbles = memory.bubbles.filter((bubble) => bubble.life > 0)
  },
}

function createBubble({ width, height, levels, time }) {
  const smallestSide = Math.min(width, height)
  return {
    x: Math.random() * width,
    y: height * (0.5 + Math.random() * 0.6),
    radius: smallestSide * (0.04 + Math.random() * 0.1) * (0.7 + levels.bass),
    hue: (time * 20 + Math.random() * 120) % 360,
    driftX: (Math.random() - 0.5) * 0.6,
    riseSpeed: 0.3 + Math.random() * 0.8,
    life: 1,
  }
}

function moveBubble(bubble, { scale, levels }) {
  bubble.x += bubble.driftX * scale
  bubble.y -= bubble.riseSpeed * (1 + levels.mid * 2) * scale
  bubble.life -= 0.004
}

function paintBubble(context, bubble, { scale }) {
  const { x, y, radius, hue, life } = bubble

  // Lit from the upper left, like a glass marble
  const fill = context.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius)
  fill.addColorStop(0, `hsla(${hue}, 70%, 70%, ${0.25 * life})`)
  fill.addColorStop(1, `hsla(${hue}, 70%, 40%, ${0.05 * life})`)
  context.fillStyle = fill
  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2)
  context.fill()

  context.lineWidth = 1.5 * scale
  context.strokeStyle = `hsla(${hue}, 60%, 75%, ${0.35 * life})`
  context.stroke()
}

export default ambience
