import Link from './Link'
import { links } from '../links'
import { PersonPhoto } from './Photos'
import RichText from './RichText'

/*
 * One row of a testimonials list or forum topic: the author's framed photo,
 * "Name: text", then the date underneath. `index` alternates the row colours.
 */
function MessageItem({ message, index, date, small = false }) {
  const { from } = message
  const className = ['listitem', index % 2 === 0 ? 'listlight' : 'listdark', small ? 'small' : ''].join(' ')

  return (
    <div className={className}>
      <div className={small ? 'listimg small' : 'listimg'}>
        <Link href={links.profile(from.uid)}>
          <PersonPhoto person={from} />
        </Link>
      </div>
      <div className="listtext">
        <div className="para">
          <b>
            <Link href={links.profile(from.uid)}>{from.name}</Link>
          </b>
          : <RichText text={message.text} />
        </div>
        <div className="itemactions">
          <span className="dte">{date}</span>
        </div>
      </div>
    </div>
  )
}

export default MessageItem
