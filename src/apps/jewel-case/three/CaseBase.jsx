import { useTexture } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import { CASE, LAYOUT, LID, TRAY, TRAY_CARD } from './dimensions'
import { blackTray, clearPlastic, clearPlate } from './materials'
import Slab from './Slab'
import { createSpineTexture, cropToAspect, MAX_ANISOTROPY } from './textures'

const { wall } = CASE
const { left, right, top, bottom, front, back, lidLeft } = LAYOUT
// The underside of the closed lid: the base's walls stop here, except at the spine
const lidUnderside = front - LID.depth
// Gap between the spine wall and the tray, where the back card's folded spine sits.
// Without it the tray's side covered half the printed spine and cut the lettering in half.
const SPINE_CARD_GAP = 0.4
// The tray's surface sits low enough for the hub and disc to fit under the lid
export const TRAY_SURFACE = lidUnderside - 2.6

/**
 * The bottom part of the case: a clear plastic shell holding the black tray,
 * with the back card (and its spine) behind the tray, and the raised clear
 * strip along the spine that the lid closes against.
 */
function CaseBase({ release, discCenterX }) {
  return (
    <group>
      <ClearShell />
      <BackCard image={release.backCover} />
      <SpineCard title={release.title} />
      <Tray discCenterX={discCenterX} />
    </group>
  )
}

function ClearShell() {
  return (
    <group>
      {/* Bottom of the case: a thin plate, so the sharp kind of clear (see materials.js) */}
      <Slab from={[left, bottom, back]} to={[right, top, back + wall]} material={clearPlate} />
      {/* Walls up to the lid */}
      <Slab from={[right - wall, bottom, back]} to={[right, top, lidUnderside]} material={clearPlastic} />
      <Slab from={[left, top - wall, back]} to={[right, top, lidUnderside]} material={clearPlastic} />
      <Slab from={[left, bottom, back]} to={[right, bottom + wall, lidUnderside]} material={clearPlastic} />
      {/* The spine wall runs the full depth */}
      <Slab from={[left, bottom, back]} to={[left + wall, top, front]} material={clearPlastic} />
      {/* The raised hinge strip, between the lid's two hinge arms */}
      <Slab
        from={[left, bottom + LID.armHeight, front - wall]}
        to={[lidLeft, top - LID.armHeight, front]}
        material={clearPlate}
      />
      <Slab
        from={[lidLeft - wall, bottom + LID.armHeight, lidUnderside]}
        to={[lidLeft, top - LID.armHeight, front]}
        material={clearPlastic}
      />
    </group>
  )
}

// The back inlay, printed side out, seen through the bottom of the case
function BackCard({ image }) {
  const texture = useTexture(image)
  const croppedTexture = useMemo(() => {
    const copy = texture.clone()
    copy.colorSpace = THREE.SRGBColorSpace
    copy.anisotropy = MAX_ANISOTROPY
    // The square artwork is wider than tall here, so trim a little top and bottom, mostly bottom
    return cropToAspect(copy, TRAY_CARD.visibleWidth, TRAY_CARD.visibleHeight, 0.35)
  }, [texture])

  return (
    <mesh position={[0, 0, back + wall + 0.05]} rotation-y={Math.PI}>
      <planeGeometry args={[TRAY_CARD.visibleWidth, TRAY_CARD.visibleHeight]} />
      <meshStandardMaterial map={croppedTexture} roughness={0.6} />
    </mesh>
  )
}

// The back inlay's fold along the spine, with the album title, seen through the spine wall.
// It fills the base's whole edge, from the bottom plate up to the lid, so nothing inside shows past it.
const SPINE_CARD_WIDTH = lidUnderside - (back + wall)

function SpineCard({ title }) {
  const texture = useMemo(() => createSpineTexture(title, TRAY_CARD.visibleHeight, SPINE_CARD_WIDTH), [title])
  const centerZ = back + wall + SPINE_CARD_WIDTH / 2

  return (
    // Face out of the spine, with the text running from top to bottom
    <group position={[left + wall + SPINE_CARD_GAP / 2, 0, centerZ]} rotation-y={-Math.PI / 2}>
      <mesh rotation-z={-Math.PI / 2}>
        <planeGeometry args={[TRAY_CARD.visibleHeight, SPINE_CARD_WIDTH]} />
        <meshStandardMaterial map={texture} roughness={0.6} />
      </mesh>
    </group>
  )
}

function Tray({ discCenterX }) {
  return (
    <group>
      <Slab
        from={[left + wall + SPINE_CARD_GAP, bottom + wall, back + wall + 0.3]}
        to={[right - wall, top - wall, TRAY_SURFACE]}
        material={blackTray}
      />
      <TrayRibs />
      <Hub centerX={discCenterX} />
    </group>
  )
}

// The ribbed grip along the hinge side of the tray
function TrayRibs() {
  const ribCount = Math.floor((CASE.height - 2 * wall) / TRAY.ribSpacing)
  const firstRibY = bottom + wall + TRAY.ribSpacing / 2

  return (
    <group>
      {Array.from({ length: ribCount }, (_, index) => (
        <Slab
          key={index}
          from={[left + wall + SPINE_CARD_GAP, firstRibY + index * TRAY.ribSpacing - 0.3, TRAY_SURFACE]}
          to={[left + TRAY.ribbedWidth, firstRibY + index * TRAY.ribSpacing + 0.3, TRAY_SURFACE + 0.5]}
          material={blackTray}
        />
      ))}
    </group>
  )
}

// The rosette in the middle of the tray that grips the disc by its hole
function Hub({ centerX }) {
  const teeth = Array.from({ length: TRAY.hubTeeth }, (_, index) => (index / TRAY.hubTeeth) * Math.PI * 2)

  return (
    <group position={[centerX, 0, TRAY_SURFACE]}>
      {/* The raised ring the disc rests on */}
      <mesh position-z={0.4} rotation-x={Math.PI / 2} material={blackTray} castShadow>
        <cylinderGeometry args={[TRAY.hubRadius, TRAY.hubRadius, 0.8, 48]} />
      </mesh>
      {/* Springy teeth that poke up through the disc's hole */}
      {teeth.map((angle) => (
        <mesh
          key={angle}
          position={[Math.cos(angle) * 5.2, Math.sin(angle) * 5.2, 1.6]}
          rotation-z={angle}
          material={blackTray}
        >
          <boxGeometry args={[3.6, 1.1, 2.4]} />
        </mesh>
      ))}
    </group>
  )
}

export default CaseBase
