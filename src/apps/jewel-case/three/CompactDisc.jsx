import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { DISC } from './dimensions'
import { discClearHub, discMirror } from './materials'
import { createDiscRainbowTexture, MAX_ANISOTROPY } from './textures'

const RADIAL_SEGMENTS = 128
// How quickly the disc eases between the tray and the viewer (higher is snappier).
// It rises faster than it slides, so it lifts clear of the tray before moving over.
const LIFT_SPEED = 6
const SLIDE_SPEED = 3

/**
 * A CD, label side up, built in rings like the real thing (from the middle):
 * the hole, a clear plastic hub with its stacking ring, a bare mirror band,
 * the printed label, and a thin mirror rim at the edge. The underside is the rainbow data side.
 *
 * It rests at `restPosition` in the tray; with `out` it floats over to
 * `outPosition` so it can be looked at from every side.
 */
function CompactDisc({ labelImage, restPosition, outPosition, out, onClick, ...pointerHandlers }) {
  const disc = useRef(null)
  const dataSide = useRef(null)
  const dataSideMaterial = useMemo(() => {
    const rainbow = createDiscRainbowTexture()
    return new THREE.MeshPhysicalMaterial({
      map: rainbow,
      metalness: 0.9,
      roughness: 0.15,
      iridescence: 1,
      iridescenceIOR: 1.5,
      iridescenceThicknessRange: [250, 650],
      envMapIntensity: 1.6,
      // A pure mirror goes black wherever it reflects darkness; a faint glow of the rainbow
      // keeps the colours visible from any angle, the way room light does on a real disc
      emissive: '#ffffff',
      emissiveMap: rainbow,
      emissiveIntensity: 0.35,
    })
  }, [])

  useFrame(({ camera }, delta) => {
    const [targetX, targetY, targetZ] = out ? outPosition : restPosition
    const { position } = disc.current
    // Frame-rate independent easing towards the target
    const slide = 1 - Math.exp(-delta * SLIDE_SPEED)
    const lift = 1 - Math.exp(-delta * LIFT_SPEED)
    position.x += (targetX - position.x) * slide
    position.y += (targetY - position.y) * slide
    position.z += (targetZ - position.z) * lift

    // On a real CD the rainbow swings round as you move around it; turn it with the viewing angle
    const viewAngle = Math.atan2(camera.position.x - position.x, camera.position.z - position.z)
    dataSide.current.material.map.rotation = viewAngle * 2
  })

  const labelTexture = useTexture(labelImage)
  const labelMaterial = useMemo(() => {
    const texture = labelTexture.clone()
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = MAX_ANISOTROPY
    // A printed label is matte, with a little shine from the varnish
    return new THREE.MeshPhysicalMaterial({ map: texture, roughness: 0.5, clearcoat: 0.4, clearcoatRoughness: 0.2 })
  }, [labelTexture])

  const halfThickness = DISC.thickness / 2

  return (
    <group ref={disc} position={restPosition} onClick={onClick} {...pointerHandlers}>
      <RingBody inner={DISC.holeRadius} outer={DISC.clearHubRadius} material={discClearHub} />
      <RingBody inner={DISC.clearHubRadius} outer={DISC.radius} material={discMirror} />

      {/* The stacking ring: a slightly raised lip at the edge of the clear hub */}
      <mesh position-z={halfThickness} material={discClearHub}>
        <torusGeometry args={[DISC.stackingRingRadius, 0.35, 8, RADIAL_SEGMENTS]} />
      </mesh>

      {/* The data side underneath: a rainbow mirror from the clear hub out to the edge */}
      <mesh ref={dataSide} position-z={-halfThickness - 0.02} rotation-y={Math.PI} material={dataSideMaterial}>
        <ringGeometry args={[DISC.clearHubRadius, DISC.radius - 0.4, RADIAL_SEGMENTS]} />
      </mesh>

      {/* The label's printed ink, just above the plastic */}
      <mesh position-z={halfThickness + 0.02} material={labelMaterial} receiveShadow>
        <ringGeometry args={[DISC.mirrorBandRadius, DISC.labelOuterRadius, RADIAL_SEGMENTS]} />
      </mesh>
    </group>
  )
}

/*
 * A flat ring with a real thickness, made by spinning its rectangular
 * cross-section around the disc's axis.
 */
function RingBody({ inner, outer, material }) {
  const halfThickness = DISC.thickness / 2
  const crossSection = useMemo(
    () => [
      new THREE.Vector2(inner, -halfThickness),
      new THREE.Vector2(outer, -halfThickness),
      new THREE.Vector2(outer, halfThickness),
      new THREE.Vector2(inner, halfThickness),
      new THREE.Vector2(inner, -halfThickness),
    ],
    [inner, outer, halfThickness],
  )

  return (
    // Lathe shapes spin around y; turn them so the disc lies flat, facing +z
    <mesh rotation-x={Math.PI / 2} material={material} castShadow receiveShadow>
      <latheGeometry args={[crossSection, RADIAL_SEGMENTS]} />
    </mesh>
  )
}

export default CompactDisc
