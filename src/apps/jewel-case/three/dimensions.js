/*
 * Real-world sizes of a standard CD jewel case, its disc and paper parts,
 * in millimetres (the 3D scene uses 1 unit = 1 mm).
 *
 * The case is centered on the origin: x runs from the spine (left) to the
 * opening edge (right), y is up, and +z points out of the front cover.
 */

export const CASE = {
  width: 142,
  height: 125,
  depth: 10.4,
  // Clear plastic wall thickness
  wall: 1.2,
}

// The lid is the front slab of the case (about a third of its depth), right of the base's hinge strip
export const LID = {
  depth: 3.6,
  // Hinge arms reach over the strip to pins at the spine, at the top and bottom
  armHeight: 7,
}

// Clear raised strip along the spine that belongs to the base; the lid closes next to it
export const HINGE_STRIP = {
  width: 9,
}

export const TRAY = {
  // Ribbed area along the hinge side of the black tray
  ribbedWidth: 20,
  ribSpacing: 2,
  hubRadius: 15,
  hubTeeth: 12,
}

export const BOOKLET = {
  size: 120,
  thickness: 0.6,
  // Gap between the booklet and the lid's opening edge
  margin: 1.5,
}

export const TRAY_CARD = {
  // The part of the back inlay you see through the bottom of the case
  visibleWidth: 138,
  visibleHeight: 118,
  spineWidth: 6.5,
}

// Radii of the zones on a CD, from the center out (Wikipedia, ECMA-130, disc printing templates)
export const DISC = {
  radius: 60,
  thickness: 1.2,
  holeRadius: 7.5,
  // Clear polycarbonate clamping area, ending in the raised stacking ring
  clearHubRadius: 16.5,
  stackingRingRadius: 17.5,
  // Bare mirror between the stacking ring and the printed label
  mirrorBandRadius: 23,
  labelOuterRadius: 58,
}

// Derived positions used by several parts
export const LAYOUT = {
  left: -CASE.width / 2,
  right: CASE.width / 2,
  top: CASE.height / 2,
  bottom: -CASE.height / 2,
  front: CASE.depth / 2,
  back: -CASE.depth / 2,
  // Where the lid's inner (hinge-side) edge sits, at the strip's edge
  lidLeft: -CASE.width / 2 + HINGE_STRIP.width,
  lidWidth: CASE.width - HINGE_STRIP.width,
  // The booklet and disc line up with each other, right of the hinge
  bookletCenterX: CASE.width / 2 - BOOKLET.margin - BOOKLET.size / 2,
}
