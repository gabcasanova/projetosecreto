/*
 * The animated GIF ads that filled the margins of 2000s sites: real ones,
 * rescued from GeoCities pages by the Internet Archive (GifCities), kept in
 * src/assets/ads with their size in the name ("..._160x600.gif").
 */
const files = import.meta.glob('../../assets/ads/*.gif', { eager: true, import: 'default' })

// "webshots-desktop-boring_160x600" -> its picture, width and height
function ad(name) {
  const [, width, height] = name.match(/_(\d+)x(\d+)$/)
  return { name, src: files[`../../assets/ads/${name}.gif`], width: Number(width), height: Number(height) }
}

export const ADS = {
  webshots: ad('webshots-desktop-boring_160x600'),
  napster: ad('napster-gazillion-tracks_160x600'),
  vanillaCoke: ad('vanilla-coke_160x600'),
  emoticons: ad('free-emoticons_120x600'),
  menInBlack: ad('men-in-black-2_120x600'),
  livrariaCultura: ad('livraria-cultura_125x125'),
  icq: ad('icq-people-find-people_125x125'),
  msnCeline: ad('msn-celine-dion-chat_468x60'),
  buscape: ad('buscape-celulares_468x60'),
  ieAlert: ad('urgent-alert-ie-not-optimized_250x250'),
}
