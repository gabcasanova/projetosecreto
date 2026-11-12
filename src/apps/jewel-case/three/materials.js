import * as THREE from 'three'

/*
 * Shared materials, created once. Clear polystyrene uses real transmission
 * (light passing through and refracting) plus a clearcoat for the glossy
 * surface reflections that make a jewel case read as plastic.
 */

export const clearPlastic = new THREE.MeshPhysicalMaterial({
  color: '#ffffff',
  transmission: 1,
  roughness: 0.04,
  thickness: 1.2,
  ior: 1.59,
  clearcoat: 1,
  clearcoatRoughness: 0.03,
  // Reflections are what make clear plastic visible at all, so let them read strongly
  envMapIntensity: 1.2,
  // A hint of the slight blue-green tint thick clear plastic has
  attenuationColor: '#dcefff',
  attenuationDistance: 40,
})

/*
 * The big flat plates (the lid's front, the case's bottom) are too thin to bend
 * light visibly, and real transmission renders what's behind them through a
 * softer copy of the scene, which blurs the cover and back card. So instead:
 * black, additively blended plastic. It adds only its reflections and leaves
 * whatever is behind it perfectly sharp.
 */
export const clearPlate = new THREE.MeshPhysicalMaterial({
  color: '#000000',
  roughness: 0.03,
  clearcoat: 1,
  clearcoatRoughness: 0.02,
  envMapIntensity: 1.2,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
})

export const blackTray = new THREE.MeshStandardMaterial({
  color: '#0d0e10',
  roughness: 0.45,
  metalness: 0,
})

export const paperEdge = new THREE.MeshStandardMaterial({
  color: '#f2efe8',
  roughness: 0.9,
})

// The disc's mirror layer: metallic, with the rainbow sheen of the pits
export const discMirror = new THREE.MeshPhysicalMaterial({
  color: '#d9dde3',
  metalness: 1,
  roughness: 0.14,
  iridescence: 1,
  iridescenceIOR: 1.8,
  iridescenceThicknessRange: [180, 900],
})

// The clear polycarbonate ring around the hole
export const discClearHub = new THREE.MeshPhysicalMaterial({
  color: '#ffffff',
  transmission: 1,
  roughness: 0.08,
  thickness: 1.2,
  ior: 1.58,
})
