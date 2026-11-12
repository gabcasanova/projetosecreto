import { useEffect, useRef } from 'react'

/**
 * Runs the animation loop for whichever visualization is selected
 * (see ./visualizations), feeding it the music's spectrum and waveform.
 *
 * `analyser` is a Web Audio AnalyserNode (or null before the first play).
 * When paused, the levels drift down to a gentle idle motion.
 */
function Visualizer({ analyser, isPlaying, visualization }) {
  const canvasRef = useRef(null)
  // Read inside the animation loop, so kept in a ref instead of restarting the loop
  const liveProps = useRef({ analyser, isPlaying, visualization })

  useEffect(() => {
    liveProps.current = { analyser, isPlaying, visualization }
  }, [analyser, isPlaying, visualization])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const levels = { bass: 0, mid: 0, treble: 0 }
    let frequencies = null
    let waveform = null
    let current = null
    let memory = {}
    let frame = 0

    const resizeObserver = new ResizeObserver(() => {
      const scale = window.devicePixelRatio || 1
      canvas.width = canvas.clientWidth * scale
      canvas.height = canvas.clientHeight * scale
    })
    resizeObserver.observe(canvas)

    function draw(timestamp) {
      const { analyser: node, isPlaying: playing, visualization: selected } = liveProps.current

      // A new visualization starts from a blank canvas and fresh memory
      if (selected !== current) {
        current = selected
        memory = {}
        context.globalCompositeOperation = 'source-over'
        context.fillStyle = '#020516'
        context.fillRect(0, 0, canvas.width, canvas.height)
      }

      if (node && playing) {
        if (frequencies?.length !== node.frequencyBinCount) frequencies = new Uint8Array(node.frequencyBinCount)
        if (waveform?.length !== node.fftSize) waveform = new Uint8Array(node.fftSize)
        node.getByteFrequencyData(frequencies)
        node.getByteTimeDomainData(waveform)
        smoothTowards(levels, measureLevels(frequencies))
      } else {
        smoothTowards(levels, { bass: 0.08, mid: 0.08, treble: 0.05 })
      }

      current.draw(
        context,
        {
          width: canvas.width,
          height: canvas.height,
          scale: window.devicePixelRatio || 1,
          time: timestamp / 1000,
          levels,
          frequencies: playing ? frequencies : null,
          waveform: playing ? waveform : null,
        },
        memory,
      )
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="block size-full bg-[#020516]" />
}

// Average loudness (0..1) of the low, middle and high parts of the spectrum
function measureLevels(frequencies) {
  const average = (from, to) => {
    let sum = 0
    for (let i = from; i < to; i++) sum += frequencies[i]
    return sum / (to - from) / 255
  }
  return { bass: average(1, 8), mid: average(8, 40), treble: average(40, 120) }
}

// Ease the drawn levels towards the measured ones so the motion doesn't jitter
function smoothTowards(levels, target) {
  for (const key of Object.keys(levels)) levels[key] += (target[key] - levels[key]) * 0.15
}

export default Visualizer
