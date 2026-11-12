import { Fragment } from 'react'
import { SMILEYS } from '../smileys'

/*
 * Text the way orkut showed testimonials and forum posts: line breaks kept, BBCode-ish tags
 * ([b], [i], [u] and colours like [red]...[/red]) and smiley codes as images.
 * It builds React elements, never HTML, so nothing typed can inject markup.
 */

const COLORS = [
  'aqua', 'blue', 'fuchsia', 'gold', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive',
  'orange', 'pink', 'purple', 'red', 'silver', 'teal', 'violet', 'yellow',
]
const STYLE_TAGS = ['b', 'i', 'u']

const TAG_PATTERN = new RegExp(`\\[(/?)(${[...STYLE_TAGS, ...COLORS].join('|')})\\]`, 'gi')
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const SMILEY_PATTERN = new RegExp(`(${SMILEYS.map((smiley) => escapeRegExp(smiley.code)).join('|')})`, 'gi')

// Splits the text into a tree: { tag, children } nodes and plain strings
function parse(text) {
  const root = { tag: null, children: [] }
  const stack = [root]
  let lastIndex = 0

  for (const match of text.matchAll(TAG_PATTERN)) {
    const [whole, closing, rawTag] = match
    const tag = rawTag.toLowerCase()
    stack.at(-1).children.push(text.slice(lastIndex, match.index))
    lastIndex = match.index + whole.length

    if (!closing) {
      const node = { tag, children: [] }
      stack.at(-1).children.push(node)
      stack.push(node)
      continue
    }
    // A closing tag closes the matching open one (and anything left open inside it)
    const openIndex = stack.findLastIndex((node) => node.tag === tag)
    if (openIndex > 0) stack.length = openIndex
    else stack.at(-1).children.push(whole)
  }
  stack.at(-1).children.push(text.slice(lastIndex))
  return root.children
}

function smileyFor(code) {
  return SMILEYS.find((smiley) => smiley.code.toLowerCase() === code.toLowerCase())
}

// Plain text: smiley codes become images and line breaks become <br>
function renderText(text, key) {
  const lines = text.split('\n')
  return lines.map((line, lineIndex) => (
    <Fragment key={`${key}-${lineIndex}`}>
      {lineIndex > 0 && <br />}
      {line.split(SMILEY_PATTERN).map((part, partIndex) => {
        const smiley = partIndex % 2 === 1 && smileyFor(part)
        return smiley ? (
          <img key={partIndex} src={smiley.image} alt={smiley.code} title={smiley.label} className="smiley" />
        ) : (
          part
        )
      })}
    </Fragment>
  ))
}

function renderNodes(nodes, keyPrefix = 'n') {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`
    if (typeof node === 'string') return <Fragment key={key}>{renderText(node, key)}</Fragment>

    const children = renderNodes(node.children, key)
    if (node.tag === 'b') return <b key={key}>{children}</b>
    if (node.tag === 'i') return <i key={key}>{children}</i>
    if (node.tag === 'u') return <u key={key}>{children}</u>
    return (
      <span key={key} style={{ color: node.tag }}>
        {children}
      </span>
    )
  })
}

function RichText({ text }) {
  return <>{renderNodes(parse(text ?? ''))}</>
}

export default RichText
