import angry from './assets/smiley-angry.svg'
import bigSmile from './assets/smiley-bigsmile.svg'
import cool from './assets/smiley-cool.svg'
import funny from './assets/smiley-funny.svg'
import sad from './assets/smiley-sad.svg'
import smile from './assets/smiley-smile.svg'
import surprise from './assets/smiley-surprise.svg'
import wink from './assets/smiley-wink.svg'

// The scrap form's smileys, in orkut's order, with the codes they type and turn back into
export const SMILEYS = [
  { code: ':)', image: smile, label: 'sorriso' },
  { code: ';)', image: wink, label: 'piscadinha' },
  { code: ':D', image: bigSmile, label: 'risada' },
  { code: ':P', image: funny, label: 'língua' },
  { code: ':o', image: surprise, label: 'surpresa' },
  { code: ':(', image: sad, label: 'triste' },
  { code: ':x', image: angry, label: 'bravo' },
  { code: '8)', image: cool, label: 'óculos escuros' },
]
