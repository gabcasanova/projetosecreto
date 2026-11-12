import * as THREE from 'three'

// Pixels per millimetre for textures drawn on a canvas
const PIXELS_PER_MM = 12

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

  context.fillStyle = '#eef1f6'
  context.font = `${Math.round(canvas.height * 0.5)}px Georgia, 'Times New Roman', serif`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(title, canvas.width / 2, canvas.height / 2)

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
