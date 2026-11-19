/*
 * The animated GIFs that decorate the band's GeoCities-style page: real
 * ones, rescued from GeoCities by the Internet Archive (GifCities), kept in
 * src/assets/geocities. `gif('soccer-ball')` is that file's address, or null
 * if there's no such file (the page then just leaves it out).
 */
const files = import.meta.glob('../../assets/geocities/*.gif', { eager: true, import: 'default' })

export function gif(name) {
  return files[`../../assets/geocities/${name}.gif`] ?? null
}
