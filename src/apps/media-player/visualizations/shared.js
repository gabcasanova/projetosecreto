/*
 * Every visualization is { id, name, draw(context, frame, memory) }.
 *
 * `frame` holds what's needed to paint one frame:
 *   width, height   canvas size in device pixels
 *   scale           device pixel ratio, for line widths
 *   time            seconds since the page loaded
 *   levels          smoothed { bass, mid, treble } loudness, 0..1
 *   frequencies     Uint8Array spectrum, or null while paused
 *   waveform        Uint8Array of the raw wave (128 = silence), or null while paused
 *
 * `memory` is an empty object per visualization run, for anything a
 * visualization wants to keep between frames (particles, buffers...).
 */

// Darken the previous frame instead of clearing it, which leaves glowing trails
export function fadeTrails(context, width, height, color) {
  context.globalCompositeOperation = 'source-over'
  context.fillStyle = color
  context.fillRect(0, 0, width, height)
}

// Sample i of `count` from the waveform as -1..1, or a slow idle wave when there's no audio
export function waveSample(frame, i, count) {
  if (!frame.waveform) return Math.sin(i / count * Math.PI * 4 + frame.time * 2) * 0.05
  const index = Math.floor((i / count) * (frame.waveform.length - 1))
  return (frame.waveform[index] - 128) / 128
}
