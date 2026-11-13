import { albums, singles } from 'virtual:music-library'
import { usePlayerContext } from '../../apps/media-player/playerContext'
import { formatTime } from '../../apps/media-player/formatTime'
import wmpIcon from '../../assets/wmp/wmp-icon-16.png'

/*
 * WMP11's black mini player, controlling the same music as the Discografia
 * window. With nothing loaded, Reproduzir plays the whole discography.
 */
function MediaGadget({ onOpenPlayer }) {
  const player = usePlayerContext()
  const { current } = player
  const progress = player.duration ? player.currentTime / player.duration : 0

  function togglePlay() {
    if (current) player.togglePlay()
    else player.playAll([...albums, ...singles])
  }

  // Clicking the seek bar jumps to that point of the song
  function handleSeek(event) {
    if (!current) return
    const bar = event.currentTarget.getBoundingClientRect()
    player.seek(((event.clientX - bar.left) / bar.width) * player.duration)
  }

  return (
    <div className="media-gadget">
      <div className="media-now-playing">
        {current ? (
          <img src={current.album.cover} alt="" className="media-art" />
        ) : (
          <span className="media-art empty" />
        )}
        <div className="media-info">
          <p className="media-title">{current ? current.track.title : 'Nenhuma mídia'}</p>
          <p className="media-artist">{current ? current.album.artist : 'Futebol de Bairro'}</p>
          <p className="media-time">{current ? `${formatTime(player.currentTime)} / ${formatTime(player.duration)}` : ''}</p>
        </div>
      </div>

      <div className="media-seek" role="presentation" onClick={handleSeek}>
        <div className="media-seek-progress" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="media-toolbar">
        <button type="button" className="media-open" title="Abrir a Discografia" aria-label="Abrir a Discografia" onClick={onOpenPlayer}>
          <img src={wmpIcon} alt="" />
        </button>
        <div className="media-capsule">
          <button type="button" className="media-button stop" aria-label="Parar" title="Parar" disabled={!current} onClick={player.stop} />
          <button type="button" className="media-button previous" aria-label="Anterior" title="Anterior" disabled={!current} onClick={player.previous} />
          <button
            type="button"
            className={`media-play ${player.isPlaying ? 'pause' : 'play'}`}
            aria-label={player.isPlaying ? 'Pausar' : 'Reproduzir'}
            title={player.isPlaying ? 'Pausar' : 'Reproduzir'}
            onClick={togglePlay}
          />
          <button type="button" className="media-button next" aria-label="Próxima" title="Próxima" disabled={!current} onClick={player.next} />
        </div>
      </div>
    </div>
  )
}

export default MediaGadget
