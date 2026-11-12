import { CameraControls, ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import CameraControlsImpl from 'camera-controls'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { createBackdropTexture } from './backdrop'
import CaseBase, { TRAY_SURFACE } from './CaseBase'
import CaseLid from './CaseLid'
import CompactDisc from './CompactDisc'
import { CASE, DISC, LAYOUT } from './dimensions'

// Pointer movement (px) below which a press still counts as a click rather than a turn
const CLICK_TOLERANCE = 4

// Where the disc rests in the tray, and where it floats to when taken out (in front of the open case)
const DISC_IN_TRAY = [LAYOUT.bookletCenterX, 0, TRAY_SURFACE + 0.8 + DISC.thickness / 2]
const DISC_TAKEN_OUT = [LAYOUT.left, 0, 90]
// While the disc is out, the case drifts this far back, so it never blocks the view of the disc's underside
const CASE_RECEDE_DISTANCE = 700
const RECEDE_SPEED = 3

/*
 * Camera positions (all in mm): a three-quarter view of the closed case,
 * straight on for the open case (centered on the hinge so both halves fit),
 * and close up on the disc once it's taken out.
 */
const CLOSED_VIEW = { position: [190, 80, 360], target: [0, 0, 0] }
const OPEN_VIEW = { position: [LAYOUT.left, -40, 470], target: [LAYOUT.left, 0, 0] }
const DISC_VIEW = { position: [LAYOUT.left + 70, 50, 340], target: DISC_TAKEN_OUT }
const ZOOM_LIMITS = { min: 100, max: 800 }
const { ACTION } = CameraControlsImpl

/**
 * The 3D CD case: drag to turn the camera around it, scroll to zoom.
 * Clicking the closed case opens it. In the open case, clicking the booklet
 * calls `onBookletClick` and clicking the disc calls `onDiscClick`.
 * `onReady` fires once everything is loaded and compiled, so a loading screen can stay up until then.
 */
function JewelCaseScene({
  release,
  open,
  bookletInside,
  discOut,
  onCoverClick,
  onBookletClick,
  onDiscClick,
  onReady,
}) {
  const controls = useRef(null)
  // Whether the pointer is over something that can be clicked, to show the hand cursor
  const [overClickable, setOverClickable] = useState(false)
  // The backdrop is the scene's own background: clear plastic refracts it, so it has to be in the scene
  const backdrop = useMemo(() => createBackdropTexture(), [])

  // What a click on each part would do right now
  const lidClickable = !open || (bookletInside && release.booklet.length > 0 && !discOut)
  const discClickable = open && !discOut

  // Glide to a good view whenever the case opens or closes, or the disc comes out
  useEffect(() => {
    const view = discOut ? DISC_VIEW : open ? OPEN_VIEW : CLOSED_VIEW
    controls.current?.setLookAt(...view.position, ...view.target, true)
  }, [open, discOut])

  // r3f reports how far the pointer moved since pressing; a real drag isn't a click
  const isClick = (event) => event.delta <= CLICK_TOLERANCE

  function handleLidClick(event) {
    if (!isClick(event)) return
    event.stopPropagation()
    if (open) onBookletClick()
    else onCoverClick()
  }

  function handleDiscClick(event) {
    if (!isClick(event)) return
    event.stopPropagation()
    // With the lid closed the disc is out of reach; once out, it stays out until put back
    if (open && !discOut) onDiscClick()
  }

  // Pointer handlers for a part; the nearest part under the pointer decides the cursor
  function hoverHandlers(clickable) {
    return {
      onPointerOver: (event) => {
        event.stopPropagation()
        setOverClickable(clickable)
      },
      onPointerOut: () => setOverClickable(false),
    }
  }

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: CLOSED_VIEW.position, fov: 32, near: 1, far: 3000 }}
      gl={{ antialias: true }}
      // The hand cursor over clickable parts; otherwise the stage's grab cursor shows through
      style={{ cursor: overClickable ? 'pointer' : undefined }}
    >
      <primitive attach="background" object={backdrop} />
      <CameraControls
        ref={controls}
        minDistance={ZOOM_LIMITS.min}
        maxDistance={ZOOM_LIMITS.max}
        // Turn with the left button, zoom with the wheel, nothing else
        mouseButtons={{ left: ACTION.ROTATE, middle: ACTION.NONE, right: ACTION.NONE, wheel: ACTION.DOLLY }}
        touches={{ one: ACTION.TOUCH_ROTATE, two: ACTION.TOUCH_DOLLY, three: ACTION.NONE }}
        smoothTime={0.35}
        // A wheel notch zooms a little, not a lot
        dollySpeed={0.35}
      />

      <Lights />

      <Suspense fallback={null}>
        {/* The case stands upright, a little above the "floor" its shadow falls on */}
        <group>
          <Receding active={discOut}>
            <CaseBase release={release} discCenterX={LAYOUT.bookletCenterX} />
            <group onClick={handleLidClick} {...hoverHandlers(lidClickable)}>
              <CaseLid release={release} open={open} bookletInside={bookletInside} />
            </group>
          </Receding>
          <CompactDisc
            // The disc's own print if the album has one, otherwise the cover art
            labelImage={release.cdLabel ?? release.cover}
            restPosition={DISC_IN_TRAY}
            outPosition={DISC_TAKEN_OUT}
            out={discOut}
            onClick={handleDiscClick}
            {...hoverHandlers(discClickable)}
          />
        </group>
        {/* Only mounts once the textures above have loaded */}
        <ReadySignal onReady={onReady} />
      </Suspense>

      <ContactShadows
        position={[0, -CASE.height / 2 - 18, 0]}
        scale={420}
        blur={2.6}
        opacity={0.55}
        far={60}
        resolution={512}
      />
    </Canvas>
  )
}

// Eases its children backwards (away from the viewer) while `active`, and back again after
function Receding({ active, children }) {
  const group = useRef(null)

  useFrame((_, delta) => {
    const target = active ? -CASE_RECEDE_DISTANCE : 0
    const { position } = group.current
    position.z += (target - position.z) * (1 - Math.exp(-delta * RECEDE_SPEED))
  })

  return <group ref={group}>{children}</group>
}

/*
 * Compiles every shader without blocking the page (WebGL's parallel compile),
 * then reports that the scene is ready. Compiling on the first frame instead
 * would freeze the whole desktop for a moment.
 */
function ReadySignal({ onReady }) {
  const { gl, scene, camera } = useThree()

  useEffect(() => {
    let cancelled = false
    gl.compileAsync(scene, camera).then(() => {
      // Let one frame draw before revealing it, so the reveal never shows a blank canvas
      requestAnimationFrame(() => !cancelled && onReady?.())
    })
    return () => {
      cancelled = true
    }
  }, [gl, scene, camera, onReady])

  return null
}

/*
 * A softbox studio: big rectangular lights reflect in the plastic as the
 * long bright highlights you see on a real jewel case. No image files needed.
 */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[160, 260, 300]} intensity={2.4} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-260, 80, 160]} intensity={0.8} color="#cfe0ff" />
      {/* Every Lightformer faces the case (they aim at the origin by default) */}
      <Environment resolution={512}>
        {/* Narrow softboxes in front, high and low: crisp sheen bands across the lid, not a milky wash */}
        <Lightformer form="rect" intensity={3} position={[150, 340, 380]} scale={[700, 90, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[-200, -260, 380]} scale={[600, 60, 1]} />
        {/* Tall strips at the sides: the thin bright lines along the plastic edges */}
        <Lightformer form="rect" intensity={2} position={[-420, 0, 120]} scale={[40, 700, 1]} />
        <Lightformer form="rect" intensity={2} position={[420, 0, 120]} scale={[40, 700, 1]} />
        {/* A soft, wide glow where the viewer stands: the disc's mirror reflects this as silver.
            Clear plastic reflects only a few percent of it, so the lid stays crisp. */}
        <Lightformer form="rect" intensity={0.45} position={[0, 0, 650]} scale={[900, 700, 1]} />
        {/* The same on the far side, so the disc's data side shines silver when turned around */}
        <Lightformer form="rect" intensity={0.6} position={[0, 0, -650]} scale={[900, 700, 1]} />
        {/* A cool glow from behind, for the back of the case */}
        <Lightformer form="rect" color="#9fc4ff" intensity={2.5} position={[0, 120, -450]} scale={[600, 400, 1]} />
        <Lightformer form="rect" intensity={3} position={[0, 450, 0]} scale={[500, 500, 1]} />
      </Environment>
    </>
  )
}

export default JewelCaseScene
