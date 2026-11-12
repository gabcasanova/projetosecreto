import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { BOOKLET, CASE, LAYOUT, LID } from './dimensions'
import { clearPlastic, clearPlate, paperEdge } from './materials'
import Slab from './Slab'
import { MAX_ANISOTROPY } from './textures'

const { wall } = CASE
const { left, right, top, bottom, front, lidLeft, bookletCenterX } = LAYOUT
const lidUnderside = front - LID.depth

/*
 * The lid turns on pins near the spine edge, halfway through its thickness.
 * Fully open (180°) it lies flat beside the base, the way a real case opens.
 */
const PIVOT = new THREE.Vector3(left + 2, 0, front - LID.depth / 2)
const OPEN_ANGLE = Math.PI
// How quickly the lid eases towards its target angle (higher is snappier)
const SWING_SPEED = 5

/**
 * The front of the case: a clear plastic tray holding the booklet under four
 * small tabs, with two hinge arms reaching over the base's hinge strip.
 */
function CaseLid({ release, open, bookletInside }) {
  const swing = useRef(null)

  useFrame((_, delta) => {
    const target = open ? -OPEN_ANGLE : 0
    const current = swing.current.rotation.y
    // Frame-rate independent easing towards the target angle
    swing.current.rotation.y = current + (target - current) * (1 - Math.exp(-delta * SWING_SPEED))
  })

  return (
    <group ref={swing} position={PIVOT}>
      {/* Everything inside is laid out in case coordinates, so shift back from the pivot */}
      <group position={PIVOT.clone().negate()}>
        <ClearLid />
        {bookletInside && <Booklet release={release} />}
      </group>
    </group>
  )
}

function ClearLid() {
  const lidWallBack = lidUnderside

  return (
    <group>
      {/* Front plate: thin, so the sharp kind of clear that doesn't blur the cover (see materials.js) */}
      <Slab from={[lidLeft, bottom, front - wall]} to={[right, top, front]} material={clearPlate} />
      {/* Walls: opening edge, top, bottom, and the short edge along the hinge strip */}
      <Slab from={[right - wall, bottom, lidWallBack]} to={[right, top, front - wall]} material={clearPlastic} />
      <Slab from={[lidLeft, top - wall, lidWallBack]} to={[right, top, front - wall]} material={clearPlastic} />
      <Slab from={[lidLeft, bottom, lidWallBack]} to={[right, bottom + wall, front - wall]} material={clearPlastic} />
      <Slab
        from={[lidLeft, bottom + LID.armHeight, lidWallBack]}
        to={[lidLeft + wall, top - LID.armHeight, front - wall]}
        material={clearPlastic}
      />

      <HingeArm atTop />
      <HingeArm atTop={false} />
      <BookletTabs />
    </group>
  )
}

// One of the two arms that reach from the lid over the hinge strip to the pin at the spine
function HingeArm({ atTop }) {
  const yFrom = atTop ? top - LID.armHeight : bottom
  const yTo = atTop ? top : bottom + LID.armHeight

  return (
    <group>
      <Slab from={[left + 1.6, yFrom, lidUnderside]} to={[lidLeft, yTo, front]} material={clearPlastic} />
      {/* The rounded knuckle around the pin */}
      <mesh position={[PIVOT.x, (yFrom + yTo) / 2, PIVOT.z]} material={clearPlastic} castShadow>
        <cylinderGeometry args={[LID.depth / 2, LID.depth / 2, LID.armHeight, 24]} />
      </mesh>
    </group>
  )
}

// Four little tabs over the booklet's top and bottom edges that keep it in the lid
const TAB = { width: 6, reach: 4, thickness: 0.8 }

function BookletTabs() {
  // Just behind the booklet, overlapping its edge
  const tabZ = front - wall - BOOKLET.thickness - 0.1 - TAB.thickness / 2
  const tabXs = [bookletCenterX - BOOKLET.size * 0.3, bookletCenterX + BOOKLET.size * 0.3]
  const tabYs = [BOOKLET.size / 2 - TAB.reach / 2, -BOOKLET.size / 2 + TAB.reach / 2]

  return (
    <group>
      {tabXs.flatMap((x) =>
        tabYs.map((y) => (
          <mesh key={`${x},${y}`} position={[x, y, tabZ]} material={clearPlastic}>
            <boxGeometry args={[TAB.width, TAB.reach, TAB.thickness]} />
          </mesh>
        )),
      )}
    </group>
  )
}

/**
 * The booklet, as a thin block of paper: the front cover facing out and its
 * last page facing into the case.
 */
function Booklet({ release }) {
  const lastPageImage = release.booklet.at(-1) ?? release.cover
  const [coverTexture, lastPageTexture] = useTexture([release.cover, lastPageImage])

  const materials = useMemo(() => {
    for (const texture of [coverTexture, lastPageTexture]) {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = MAX_ANISOTROPY
    }
    // Plain matte print: a varnish layer mirrored the studio lights into a white sheet at low angles
    const printed = (map) => new THREE.MeshPhysicalMaterial({ map, roughness: 0.55 })
    // Box faces in three.js order: +x, -x, +y, -y, +z (front), -z (back)
    return [paperEdge, paperEdge, paperEdge, paperEdge, printed(coverTexture), printed(lastPageTexture)]
  }, [coverTexture, lastPageTexture])

  return (
    <mesh
      position={[bookletCenterX, 0, front - wall - BOOKLET.thickness / 2 - 0.05]}
      material={materials}
      castShadow
    >
      <boxGeometry args={[BOOKLET.size, BOOKLET.size, BOOKLET.thickness]} />
    </mesh>
  )
}

export default CaseLid
