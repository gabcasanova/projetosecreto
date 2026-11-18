import { useState } from 'react'
import { DISPLAY_PICTURES, displayPictureSrc } from './displayPictures'
import { DisplayPicture } from './MsnParts'
import './picture-dialog.css'

/*
 * MSN's "Imagem de exibição" dialog: pick one of MSN's pictures from the
 * grid, see it on the right, then OK. Your own pictures and the webcam
 * aren't available here, so those buttons stay greyed out.
 * `current` is the id of the picture in use (see displayPictures.js).
 */
function PictureDialog({ current, onChoose, onCancel }) {
  const [selected, setSelected] = useState(current ?? DISPLAY_PICTURES[0].id)

  function handleKeyDown(event) {
    if (event.key === 'Escape') onCancel()
  }

  return (
    <div className="msn-picture-layer">
      <div className="msn-picture-dialog" role="dialog" aria-label="Imagem de exibição" onKeyDown={handleKeyDown}>
        <div className="xp-titlebar flex items-center justify-between">
          <span className="xp-title truncate">Imagem de exibição</span>
          <button type="button" aria-label="Fechar" className="xp-caption-button close" onClick={onCancel} />
        </div>
        <div className="xp-frame">
          <div className="msn-picture-body">
            <p>Selecione uma imagem para mostrar aos seus contatos nas conversas com você.</p>
            <div className="msn-picture-columns">
              <fieldset className="msn-picture-group">
                <legend>Minhas imagens de exibição</legend>
                <div className="msn-picture-grid" role="listbox" aria-label="Imagens de exibição">
                  {DISPLAY_PICTURES.map((picture) => (
                    <button
                      key={picture.id}
                      type="button"
                      role="option"
                      aria-selected={selected === picture.id}
                      className={`msn-picture-option ${selected === picture.id ? 'selected' : ''}`}
                      onClick={() => setSelected(picture.id)}
                      // Double-click picks it straight away, as in MSN
                      onDoubleClick={() => onChoose(picture.id)}
                    >
                      <img src={picture.src} alt="" draggable={false} />
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="msn-picture-side">
                <span>Visualização:</span>
                <DisplayPicture src={displayPictureSrc(selected)} width={96} />
                <button type="button" className="xp-push-button" disabled>
                  Procurar...
                </button>
                <button type="button" className="xp-push-button" disabled>
                  Webcam...
                </button>
                <button type="button" className="xp-push-button" disabled>
                  Remover
                </button>
              </div>
            </div>
            <div className="msn-picture-actions">
              <button type="button" className="xp-push-button" autoFocus onClick={() => onChoose(selected)}>
                OK
              </button>
              <button type="button" className="xp-push-button" onClick={onCancel}>
                Cancelar
              </button>
              <button type="button" className="xp-push-button" disabled>
                Ajuda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PictureDialog
