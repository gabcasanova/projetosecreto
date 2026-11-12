import Link from './Link'
import { links } from '../links'
import { PersonPhoto } from './Photos'
import RichText from './RichText'

/*
 * One row of a scrapbook, testimonials list or forum topic: the author's
 * framed photo, "Name: text", then the date and any actions underneath.
 * `index` alternates the row colours; `checkbox` is the bulk-delete box.
 */
function MessageItem({ message, index, date, actions, checkbox, small = false }) {
  const { from } = message
  const className = [
    'listitem',
    index % 2 === 0 ? 'listlight' : 'listdark',
    checkbox ? 'with-check' : '',
    small ? 'small' : '',
  ].join(' ')

  return (
    <div className={className}>
      {checkbox && <div className="listitemchk">{checkbox}</div>}
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
          {actions}
        </div>
      </div>
    </div>
  )
}

export default MessageItem
