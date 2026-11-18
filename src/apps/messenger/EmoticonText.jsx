import { splitEmoticons } from './emoticons'

/** A message's text with MSN's shortcuts (":-)", "(Y)"...) drawn as emoticons. */
function EmoticonText({ text }) {
  return splitEmoticons(text).map((part, index) =>
    typeof part === 'string' ? (
      part
    ) : (
      <img
        key={index}
        src={part.emoticon.src}
        // Copying the message gives back the shortcut, as in MSN
        alt={part.code}
        title={part.emoticon.label}
        className="msn-emoticon"
        width={19}
        height={19}
        draggable={false}
      />
    ),
  )
}

export default EmoticonText
