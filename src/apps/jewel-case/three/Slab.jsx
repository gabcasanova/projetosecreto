/**
 * A box given by two opposite corners ([x, y, z] in mm) instead of a center
 * and size, which keeps the case parts readable: "from the spine to the
 * hinge strip, top to bottom, back to front".
 */
function Slab({ from, to, material, ...props }) {
  const size = to.map((end, axis) => end - from[axis])
  const center = to.map((end, axis) => (end + from[axis]) / 2)

  return (
    <mesh position={center} material={material} castShadow receiveShadow {...props}>
      <boxGeometry args={size} />
    </mesh>
  )
}

export default Slab
