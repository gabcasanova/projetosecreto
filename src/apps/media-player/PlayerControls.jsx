import { formatTime } from './formatTime'

// The bottom bar: seek bar, current song, and WMP's transport capsule
function PlayerControls({ player, onNextVisualization }) {
  const { current } = player
  const hasSong = Boolean(current)

  return (
    <footer>
      <Slider
        className="wmp-seek-bar"
        label="Posição"
        value={player.currentTime}
        max={player.duration || 1}
        disabled={!hasSong}
        onChange={player.seek}
      />

      <div className="wmp-controls-bar relative flex items-center">
        <div className="flex w-[140px] min-w-0 items-center gap-2 pl-2">
          {current && <img src={current.album.cover} alt="" className="size-8 shrink-0 border border-black object-cover" />}
          <div className="min-w-0">
            <p className="truncate text-[#e4e9f1]">{current?.track.title ?? ''}</p>
            <p className="text-[#8f9bb0]">{hasSong ? formatTime(player.currentTime) : ''}</p>
          </div>
        </div>

        <div className="wmp-capsule absolute left-1/2 -translate-x-1/2">
          <button
            type="button"
            aria-label="Aleatório"
            aria-pressed={player.shuffle}
            className={`wmp-small-button shuffle ${player.shuffle ? 'on' : ''}`}
            onClick={player.toggleShuffle}
          />
          <button
            type="button"
            aria-label="Repetir"
            aria-pressed={player.repeat}
            className={`wmp-small-button repeat ${player.repeat ? 'on' : ''}`}
            onClick={player.toggleRepeat}
          />
          <button
            type="button"
            aria-label="Parar"
            className="wmp-small-button stop"
            disabled={!hasSong}
            onClick={player.stop}
          />
          <button
            type="button"
            aria-label="Anterior"
            className="wmp-image-button wmp-skip-button previous"
            disabled={!hasSong}
            onClick={player.previous}
          />
          <button
            type="button"
            aria-label={player.isPlaying ? 'Pausar' : 'Reproduzir'}
            className={`wmp-image-button wmp-play-button ${player.isPlaying ? 'pause' : 'play'}`}
            disabled={!hasSong}
            onClick={player.togglePlay}
          />
          <button
            type="button"
            aria-label="Próximo"
            className="wmp-image-button wmp-skip-button next"
            disabled={!hasSong}
            onClick={player.next}
          />
          <button
            type="button"
            aria-label={player.muted ? 'Ativar som' : 'Sem áudio'}
            className={`wmp-small-button mute ${player.muted ? 'on' : ''}`}
            onClick={player.toggleMute}
          />
          <Slider
            className="wmp-volume-slider"
            label="Volume"
            value={player.muted ? 0 : player.volume}
            max={1}
            onChange={player.setVolume}
          />
        </div>

        <button
          type="button"
          aria-label="Próxima visualização"
          title="Próxima visualização"
          className="wmp-corner-button ml-auto mr-2"
          onClick={onNextVisualization}
        >
          <VisualizationIcon />
        </button>
      </div>
    </footer>
  )
}

// A range input whose filled part is painted through the --fill custom property
function Slider({ className, label, value, max, disabled, onChange }) {
  const fill = `${(Math.min(value, max) / max) * 100}%`
  return (
    <input
      type="range"
      aria-label={label}
      className={`wmp-slider ${className}`}
      style={{ '--fill': fill }}
      min={0}
      max={max}
      step="any"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  )
}

// White glyph in the style of the bar's other buttons: a little spectrum under a wave
function VisualizationIcon() {
  return (
    <svg width="17" height="15" viewBox="0 0 17 15" fill="none" aria-hidden="true">
      <path d="M1 6c2-4 4-4 6 0s4 4 6 0 3-3 3-3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M2 14v-3M5.5 14V9M9 14v-4M12.5 14V8M16 14v-2" stroke="#fff" strokeWidth="1.6" />
    </svg>
  )
}

export default PlayerControls
