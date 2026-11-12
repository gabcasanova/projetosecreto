import { useEffect, useRef } from 'react'
import aboutFlag from '../../assets/ie/about-flag.png'
import aboutLogo from '../../assets/ie/about-logo.png'
import ieIcon from '../../assets/ie/ie-32.png'

/*
 * Ajuda > Sobre o Internet Explorer: a small XP dialog over the browser.
 * It's modal, so the browser can't be used until it's closed (OK, the close
 * button, Enter or Escape).
 */
function AboutDialog({ onClose }) {
  const okButton = useRef(null)

  // Like any Windows dialog, OK has the focus when it opens
  useEffect(() => {
    okButton.current?.focus()
  }, [])

  function handleKeyDown(event) {
    if (event.key === 'Escape' || event.key === 'Enter') {
      event.preventDefault()
      // Keep Escape from also reaching the browser (where it means Parar)
      event.stopPropagation()
      onClose()
    }
  }

  return (
    <div className="ie-modal-layer" onKeyDown={handleKeyDown}>
      <div className="ie-dialog" role="dialog" aria-modal="true" aria-labelledby="ie-about-title">
        <div className="xp-titlebar flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <img src={ieIcon} alt="" className="size-4" />
            <span id="ie-about-title" className="xp-title">
              Sobre o Internet Explorer
            </span>
          </div>
          <button type="button" aria-label="Fechar" className="xp-caption-button close" onClick={onClose} />
        </div>

        <div className="xp-frame">
          <div className="ie-about">
            <img src={aboutLogo} alt="Microsoft Internet Explorer" className="ie-about-logo" draggable={false} />

            <div className="ie-about-details">
              <p>Versão: 6.0.2900.2180.xpsp_sp2_rtm.040803-2158</p>
              <p>
                Força da codificação: 128 bits (<span className="underline">Informações sobre atualizações</span>)
              </p>
              <p>Identificação do produto: 55274-640-1011873-23081</p>
              <p>Versões de atualização: ; SP2;</p>

              <textarea className="ie-about-credits" readOnly value={CREDITS} aria-label="Créditos" />
            </div>

            <div className="ie-about-footer">
              <img src={aboutFlag} alt="" draggable={false} />
              <div className="flex-1">
                <p className="underline">Copyright ©1995-2004 Microsoft Corp.</p>
                <p className="mt-2 underline">Agradecimentos</p>
              </div>
              <button ref={okButton} type="button" className="ie-dialog-button" onClick={onClose}>
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CREDITS =
  'Baseado no NCSA Mosaic. O NCSA Mosaic(TM) foi desenvolvido no National Center for Supercomputing ' +
  'Applications da Universidade de Illinois em Urbana-Champaign.\n\n' +
  'Distribuído sob contrato de licenciamento com a Spyglass, Inc.\n\n' +
  'Contém software de segurança licenciado da RSA Data Security Inc.\n\n' +
  'Partes deste software são baseadas em parte no trabalho do Independent JPEG Group.'

export default AboutDialog
