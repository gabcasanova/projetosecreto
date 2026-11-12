import * as THREE from 'three'

const WIDTH = 1600
const HEIGHT = 1000

/*
 * Soft ribbons of light, each a curve across the canvas: [start, control 1, control 2, end]
 * as fractions of the canvas size, plus how wide and bright the ribbon is.
 */
const RIBBONS = [
  { points: [[-0.1, 0.75], [0.25, 0.35], [0.6, 0.95], [1.1, 0.4]], width: 220, color: 'rgb(70 150 255 / 0.35)' },
  { points: [[-0.1, 0.55], [0.3, 0.2], [0.7, 0.7], [1.1, 0.15]], width: 140, color: 'rgb(110 200 255 / 0.3)' },
  { points: [[0.0, 1.0], [0.35, 0.6], [0.55, 0.55], [1.0, 0.85]], width: 260, color: 'rgb(40 110 230 / 0.35)' },
  { points: [[-0.1, 0.3], [0.4, 0.5], [0.65, 0.05], [1.1, 0.3]], width: 90, color: 'rgb(150 220 255 / 0.25)' },
]

/**
 * The backdrop behind the CD case, in the style of Windows Media Player 11's
 * "Now Playing" background: deep blue with soft, glowing streaks of light.
 * Painted on a canvas, so there's no image file to download.
 */
export function createBackdropTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const context = canvas.getContext('2d')

  paintBase(context)
  // Wide, very blurred ribbons first, then the same ribbons thinner and sharper on top for a silky core
  paintRibbons(context, { blur: 60, widthScale: 1 })
  paintRibbons(context, { blur: 14, widthScale: 0.25 })
  paintVignette(context)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function paintBase(context) {
  const sky = context.createLinearGradient(0, 0, 0, HEIGHT)
  sky.addColorStop(0, '#04102a')
  sky.addColorStop(0.55, '#0b2a5c')
  sky.addColorStop(1, '#030918')
  context.fillStyle = sky
  context.fillRect(0, 0, WIDTH, HEIGHT)

  // A soft pool of light where the case floats
  const glow = context.createRadialGradient(WIDTH / 2, HEIGHT * 0.45, 0, WIDTH / 2, HEIGHT * 0.45, WIDTH * 0.45)
  glow.addColorStop(0, 'rgb(60 130 220 / 0.35)')
  glow.addColorStop(1, 'rgb(60 130 220 / 0)')
  context.fillStyle = glow
  context.fillRect(0, 0, WIDTH, HEIGHT)
}

function paintRibbons(context, { blur, widthScale }) {
  context.save()
  context.globalCompositeOperation = 'lighter'
  context.filter = `blur(${blur}px)`
  context.lineCap = 'round'

  for (const ribbon of RIBBONS) {
    const [start, control1, control2, end] = ribbon.points.map(([x, y]) => [x * WIDTH, y * HEIGHT])
    context.strokeStyle = ribbon.color
    context.lineWidth = ribbon.width * widthScale
    context.beginPath()
    context.moveTo(...start)
    context.bezierCurveTo(...control1, ...control2, ...end)
    context.stroke()
  }
  context.restore()
}

// Darker corners keep the eye on the middle
function paintVignette(context) {
  const vignette = context.createRadialGradient(WIDTH / 2, HEIGHT / 2, HEIGHT * 0.35, WIDTH / 2, HEIGHT / 2, WIDTH * 0.75)
  vignette.addColorStop(0, 'rgb(0 0 0 / 0)')
  vignette.addColorStop(1, 'rgb(0 0 0 / 0.6)')
  context.fillStyle = vignette
  context.fillRect(0, 0, WIDTH, HEIGHT)
}
