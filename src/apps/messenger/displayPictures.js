/*
 * The display pictures that came with MSN Messenger, for the "Imagem de
 * exibição" dialog. Each one is `assets/dp-<id>.png`; the id is what gets
 * remembered in the browser, since the files' URLs change from build to build.
 */
const files = import.meta.glob('./assets/dp-*.png', { eager: true, import: 'default' })

// In the order MSN listed them
const PICTURE_IDS = [
  'default-msn',
  'beach-chairs',
  'chess-pieces',
  'dirt-bike',
  'friendly-dog',
  'orange-daisy',
  'palm-trees',
  'rocket-launch',
  'rubber-ducky',
  'running-horses',
  'skateboarder',
  'soccer-ball',
]

export const DISPLAY_PICTURES = PICTURE_IDS.map((id) => ({ id, src: files[`./assets/dp-${id}.png`] })).filter(
  (picture) => picture.src,
)

/** The picture's URL, or null when the id is unknown (or null). */
export function displayPictureSrc(id) {
  return DISPLAY_PICTURES.find((picture) => picture.id === id)?.src ?? null
}
