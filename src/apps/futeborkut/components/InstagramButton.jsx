import RetroInstagramIcon from '../../../components/streaming/RetroInstagramIcon'

/*
 * A band member's Instagram under their name, styled like a profile card
 * from the old Instagram app (the same look as the desktop's LINKS EXTERNOS
 * widget): the old camera icon, the handle in link blue and a glossy blue
 * "Seguir" button. It opens the real profile in a new browser tab, outside
 * the simulation. `instagram` is the handle ("itsmarcxii" or "@itsmarcxii")
 * or a full profile URL.
 */
function InstagramButton({ instagram }) {
  const { url, handle } = instagramProfile(instagram)

  return (
    <a className="instabtn" href={url} target="_blank" rel="noopener noreferrer" title={`Abrir ${handle} no Instagram`}>
      <span className="instabtn-profile">
        <span className="instabtn-icon">
          <RetroInstagramIcon size={34} />
        </span>
        <span className="instabtn-text">
          <span className="instabtn-label">Instagram</span>
          <span className="instabtn-handle">{handle}</span>
        </span>
      </span>
      <span className="instabtn-follow">Seguir</span>
    </a>
  )
}

// "itsmarcxii", "@itsmarcxii" or "https://www.instagram.com/itsmarcxii/" -> the URL and "@itsmarcxii"
function instagramProfile(instagram) {
  const text = instagram.trim()
  const fromUrl = text.match(/instagram\.com\/([^/?#]+)/i)
  const name = (fromUrl ? fromUrl[1] : text).replace(/^@/, '')
  return { url: fromUrl ? text : `https://www.instagram.com/${name}/`, handle: `@${name}` }
}

export default InstagramButton
