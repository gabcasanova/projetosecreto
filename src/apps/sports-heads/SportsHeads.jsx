import './sports-heads.css'

/*
 * Sports Heads: Football Championship, Mousebreaker's football game. It
 * isn't hosted here: the window shows the game as MiniJogos (Spil Games'
 * Brazilian portal) offers it for other sites to embed.
 */
const EMBED_URL = 'https://www.minijogos.com.br/embed/sports-heads-football-championship'

function SportsHeads() {
  return (
    <div className="sports-heads">
      <iframe
        src={EMBED_URL}
        title="Sports Heads: Football Championship"
        allow="autoplay; fullscreen; gamepad"
        allowFullScreen
      />
    </div>
  )
}

export default SportsHeads
