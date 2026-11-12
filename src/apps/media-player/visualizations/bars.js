const BAR_COUNT = 48
const PEAK_FALL_SPEED = 0.6 // device pixels per frame, before scaling

// A classic spectrum analyzer: glassy bars on a reflective floor with slowly falling peak caps
const bars = {
  id: 'bars',
  name: 'Bars and Waves',

  draw(context, frame, memory) {
    const { width, height, scale } = frame
    const floor = height * 0.72
    const slot = width / BAR_COUNT
    const barWidth = slot * 0.72
    memory.peaks ??= new Array(BAR_COUNT).fill(0)

    paintBackground(context, width, height, floor)

    for (let i = 0; i < BAR_COUNT; i++) {
      const barHeight = barValue(frame, i) * floor * 0.85
      const x = i * slot + (slot - barWidth) / 2

      memory.peaks[i] = Math.max(barHeight, memory.peaks[i] - PEAK_FALL_SPEED * scale)

      paintBar(context, x, floor, barWidth, barHeight)
      paintReflection(context, x, floor, barWidth, barHeight)

      context.fillStyle = '#dff3ff'
      context.fillRect(x, floor - memory.peaks[i] - 3 * scale, barWidth, 2 * scale)
    }
  },
}

// Low frequencies get more bars than high ones, like the ear hears them
function barValue(frame, i) {
  if (!frame.frequencies) return 0.03 + 0.02 * Math.sin(frame.time * 2 + i * 0.4)
  const bin = Math.floor(Math.pow(i / BAR_COUNT, 1.6) * 180) + 1
  // Squash loud values a little so bars rarely hit the ceiling
  return Math.pow(frame.frequencies[bin] / 255, 1.4)
}

function paintBackground(context, width, height, floor) {
  context.globalCompositeOperation = 'source-over'
  const sky = context.createLinearGradient(0, 0, 0, height)
  sky.addColorStop(0, '#02061a')
  sky.addColorStop(floor / height, '#0a1f4a')
  sky.addColorStop(1, '#010309')
  context.fillStyle = sky
  context.fillRect(0, 0, width, height)
}

function paintBar(context, x, floor, barWidth, barHeight) {
  const gradient = context.createLinearGradient(0, floor - barHeight, 0, floor)
  gradient.addColorStop(0, '#7fe3ff')
  gradient.addColorStop(0.5, '#2c8ef0')
  gradient.addColorStop(1, '#0b3a8f')
  context.fillStyle = gradient
  context.fillRect(x, floor - barHeight, barWidth, barHeight)

  // Glassy highlight down the left side of each bar
  context.fillStyle = 'rgba(255, 255, 255, 0.18)'
  context.fillRect(x, floor - barHeight, barWidth * 0.35, barHeight)
}

function paintReflection(context, x, floor, barWidth, barHeight) {
  const reflectionHeight = barHeight * 0.35
  const gradient = context.createLinearGradient(0, floor, 0, floor + reflectionHeight)
  gradient.addColorStop(0, 'rgba(44, 142, 240, 0.35)')
  gradient.addColorStop(1, 'rgba(44, 142, 240, 0)')
  context.fillStyle = gradient
  context.fillRect(x, floor + 2, barWidth, reflectionHeight)
}

export default bars
