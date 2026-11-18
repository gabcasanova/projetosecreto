/*
 * MSN Messenger's emoticons, with the shortcuts that turned into them as
 * you typed (":-)", "(Y)"...). The pictures are MSN's own 19px ones, in
 * ./emoticons/<id>.png. Labels are what the picker shows on hover.
 */
const files = import.meta.glob('./emoticons/*.png', { eager: true, import: 'default' })

const LIST = [
  { id: 'smile', label: 'Sorriso', codes: [':-)', ':)'] },
  { id: 'open-mouthed-smile', label: 'Sorriso aberto', codes: [':-D', ':d'] },
  { id: 'winking-smile', label: 'Piscadela', codes: [';-)', ';)'] },
  { id: 'surprised-smile', label: 'Surpreso', codes: [':-O', ':o'] },
  { id: 'smile-with-tongue-out', label: 'Mostrando a língua', codes: [':-P', ':p'] },
  { id: 'hot-smile', label: 'Descolado', codes: ['(H)', '(h)'] },
  { id: 'angry-smile', label: 'Bravo', codes: [':-@', ':@'] },
  { id: 'embarrassed-smile', label: 'Envergonhado', codes: [':-$', ':$'] },
  { id: 'confused-smile', label: 'Confuso', codes: [':-S', ':s'] },
  { id: 'sad-smile', label: 'Triste', codes: [':-(', ':('] },
  { id: 'crying-face', label: 'Chorando', codes: [":'("] },
  { id: 'disappointed-smile', label: 'Decepcionado', codes: [':-|', ':|'] },
  { id: 'devil', label: 'Diabinho', codes: ['(6)'] },
  { id: 'angel', label: 'Anjo', codes: ['(A)', '(a)'] },
  { id: 'red-heart', label: 'Coração', codes: ['(L)', '(l)'] },
  { id: 'broken-heart', label: 'Coração partido', codes: ['(U)', '(u)'] },
  { id: 'messenger', label: 'Messenger', codes: ['(M)', '(m)'] },
  { id: 'cat-face', label: 'Gato', codes: ['(@)'] },
  { id: 'dog-face', label: 'Cachorro', codes: ['(&)'] },
  { id: 'sleeping-half-moon', label: 'Lua', codes: ['(S)'] },
  { id: 'star', label: 'Estrela', codes: ['(*)'] },
  { id: 'filmstrip', label: 'Filme', codes: ['(~)'] },
  { id: 'note', label: 'Nota musical', codes: ['(8)'] },
  { id: 'e-mail', label: 'Email', codes: ['(E)', '(e)'] },
  { id: 'red-rose', label: 'Rosa vermelha', codes: ['(F)', '(f)'] },
  { id: 'wilted-rose', label: 'Rosa murcha', codes: ['(W)', '(w)'] },
  { id: 'clock', label: 'Relógio', codes: ['(O)', '(o)'] },
  { id: 'red-lips', label: 'Beijo', codes: ['(K)', '(k)'] },
  { id: 'gift-with-a-bow', label: 'Presente', codes: ['(G)', '(g)'] },
  { id: 'birthday-cake', label: 'Bolo de aniversário', codes: ['(^)'] },
  { id: 'camera', label: 'Câmera', codes: ['(P)', '(p)'] },
  { id: 'light-bulb', label: 'Lâmpada', codes: ['(I)', '(i)'] },
  { id: 'coffee-cup', label: 'Xícara de café', codes: ['(C)', '(c)'] },
  { id: 'telephone-receiver', label: 'Telefone', codes: ['(T)', '(t)'] },
  { id: 'left-hug', label: 'Abraço (esquerda)', codes: ['({)'] },
  { id: 'right-hug', label: 'Abraço (direita)', codes: ['(})'] },
  { id: 'beer-mug', label: 'Caneca de cerveja', codes: ['(B)', '(b)'] },
  { id: 'martini-glass', label: 'Taça de martíni', codes: ['(D)', '(d)'] },
  { id: 'boy', label: 'Menino', codes: ['(Z)', '(z)'] },
  { id: 'girl', label: 'Menina', codes: ['(X)', '(x)'] },
  { id: 'thumbs-up', label: 'Positivo', codes: ['(Y)', '(y)'] },
  { id: 'thumbs-down', label: 'Negativo', codes: ['(N)', '(n)'] },
  { id: 'vampire-bat', label: 'Morcego', codes: [':-[', ':['] },
  { id: 'don-t-tell-anyone-smile', label: 'Não conte a ninguém', codes: [':-#'] },
  { id: 'baring-teeth-smile', label: 'Mostrando os dentes', codes: ['8o|'] },
  { id: 'nerd-smile', label: 'Nerd', codes: ['8-|'] },
  { id: 'sarcastic-smile', label: 'Sarcástico', codes: ['^o)'] },
  { id: 'secret-telling-smile', label: 'Segredo', codes: [':-*'] },
  { id: 'sick-smile', label: 'Doente', codes: ['+o('] },
  { id: 'snail', label: 'Caracol', codes: ['(sn)'] },
  { id: 'plate', label: 'Prato', codes: ['(pl)'] },
  { id: 'bowl', label: 'Tigela', codes: ['(||)'] },
  { id: 'pizza', label: 'Pizza', codes: ['(pi)'] },
  { id: 'soccer-ball', label: 'Bola de futebol', codes: ['(so)'] },
  { id: 'auto', label: 'Carro', codes: ['(au)'] },
  { id: 'airplane', label: 'Avião', codes: ['(ap)'] },
  { id: 'umbrella', label: 'Guarda-chuva', codes: ['(um)'] },
  { id: 'island-with-a-palm-tree', label: 'Ilha', codes: ['(ip)'] },
  { id: 'computer', label: 'Computador', codes: ['(co)'] },
  { id: 'mobile-phone', label: 'Celular', codes: ['(mp)'] },
  { id: 'storm-cloud', label: 'Tempestade', codes: ['(st)'] },
  { id: 'money', label: 'Dinheiro', codes: ['(mo)'] },
  { id: 'black-sheep', label: 'Ovelha negra', codes: ['(bah)'] },
  { id: 'i-don-t-know-smile', label: 'Não sei', codes: [':^)'] },
  { id: 'thinking-smile', label: 'Pensativo', codes: ['*-)'] },
  { id: 'lightning', label: 'Raio', codes: ['(li)'] },
  { id: 'party-smile', label: 'Festa', codes: ['<:o)'] },
  { id: 'eye-rolling-smile', label: 'Revirando os olhos', codes: ['8-)'] },
  { id: 'sleepy-smile', label: 'Com sono', codes: ['|-)'] },
]

export const EMOTICONS = LIST.map((emoticon) => ({ ...emoticon, src: files[`./emoticons/${emoticon.id}.png`] }))

// Shortcuts are matched ignoring case, as MSN did (":D" works like ":-D")
const BY_CODE = new Map(EMOTICONS.flatMap((emoticon) => emoticon.codes.map((code) => [code.toLowerCase(), emoticon])))

const escapeForRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Longest first, so "8o|" wins over a shorter shortcut hiding inside it
const CODES_PATTERN = new RegExp(
  [...BY_CODE.keys()]
    .sort((a, b) => b.length - a.length)
    .map(escapeForRegExp)
    .join('|'),
  'gi',
)

/**
 * Splits a message into text and emoticons, e.g.
 * ['oi ', { emoticon, code: ':)' }, ' tudo bem?']. Strings are plain text.
 */
export function splitEmoticons(text) {
  const parts = []
  let last = 0
  for (const match of text.matchAll(CODES_PATTERN)) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    parts.push({ emoticon: BY_CODE.get(match[0].toLowerCase()), code: match[0] })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}
