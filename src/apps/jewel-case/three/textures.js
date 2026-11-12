import * as THREE from 'three'

// Pixels per millimetre for textures drawn on a canvas; the spine's lettering is tiny, so it needs plenty
const PIXELS_PER_MM = 32

// Sharpest texture filtering when artwork is seen at an angle (three.js caps it at what the GPU supports)
export const MAX_ANISOTROPY = 16

/**
 * The tray card's spine strip: the album title printed along it, as seen
 * through the case's spine edge. Drawn on a canvas so any title works.
 */
export function createSpineTexture(title, lengthMm, widthMm) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(lengthMm * PIXELS_PER_MM)
  canvas.height = Math.round(widthMm * PIXELS_PER_MM)
  const context = canvas.getContext('2d')

  context.fillStyle = '#111215'
  context.fillRect(0, 0, canvas.width, canvas.height)

  // Bold sans-serif capitals, like printed spines: thin serif type turns to mush at this size
  const text = title.toUpperCase()
  const margin = canvas.height * 0.6
  let fontSize = Math.round(canvas.height * 0.5)
  context.font = `bold ${fontSize}px Tahoma, 'Segoe UI', Arial, sans-serif`
  // Shrink long titles until they fit between the ends of the spine
  while (context.measureText(text).width > canvas.width - margin * 2 && fontSize > 8) {
    fontSize -= 2
    context.font = `bold ${fontSize}px Tahoma, 'Segoe UI', Arial, sans-serif`
  }
  context.fillStyle = '#eef1f6'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.letterSpacing = `${Math.round(fontSize * 0.08)}px`
  context.fillText(text, canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = MAX_ANISOTROPY
  return texture
}

/**
 * Crops a square image texture to fill a wider rectangle (e.g. the square
 * back cover on the wider back of the case). `focusY` picks which part of
 * the height survives: 0 = bottom, 1 = top.
 */
export function cropToAspect(texture, width, height, focusY = 0.5) {
  const visibleFraction = height / width
  texture.repeat.set(1, visibleFraction)
  texture.offset.set(0, (1 - visibleFraction) * focusY)
  return texture
}

/**
 * The colours of a CD's data side: silver, broken by two opposite fans of
 * rainbow (light diffracted by the spiral of pits), with faint rings from the
 * track. Used as the colour of a mirror-like metal, so the rainbow reflects.
 */
export function createDiscRainbowTexture() {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  const center = size / 2

  // Two rainbow fans facing each other, with silver in between
  const fans = context.createConicGradient(0, center, center)
  const spectrum = ['#c8ccd4', '#b48cff', '#5a8cff', '#46e0ff', '#5cff8a', '#ffe95a', '#ff9b4a', '#ff5a8c', '#c8ccd4']
  for (const half of [0, 0.5]) {
    spectrum.forEach((color, index) => {
      fans.addColorStop(half + (index / (spectrum.length - 1)) * 0.5, color)
    })
  }
  context.fillStyle = fans
  context.fillRect(0, 0, size, size)

  // Soften towards silver so the colours read as a sheen, not paint
  context.fillStyle = 'rgb(205 210 220 / 0.25)'
  context.fillRect(0, 0, size, size)

  // Faint concentric rings, like the track
  context.strokeStyle = 'rgb(255 255 255 / 0.08)'
  context.lineWidth = 1
  for (let radius = center * 0.3; radius < center; radius += 3) {
    context.beginPath()
    context.arc(center, center, radius, 0, Math.PI * 2)
    context.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = MAX_ANISOTROPY
  // Rotate around the middle of the disc
  texture.center.set(0.5, 0.5)
  return texture
}
