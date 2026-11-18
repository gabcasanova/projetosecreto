import { useState } from 'react'
import collapseIcon from './assets/group-collapse.png'
import expandIcon from './assets/group-expand.png'
import { CONTACT_STATUS } from './statuses'

/*
 * The contacts, sorted by status as MSN does by default: an "Online (n)"
 * group (away and busy people included) and an "Offline (n)" group, each
 * in alphabetical order. Click selects a contact, double-click (or Enter)
 * opens a conversation with them. Groups fold with the +/- box.
 */
function BuddyList({ contacts, onOpen }) {
  const [selectedId, setSelectedId] = useState(null)
  const [foldedGroups, setFoldedGroups] = useState(() => new Set())

  const groups = groupByStatus(contacts)

  function toggleGroup(groupId) {
    setFoldedGroups((current) => {
      const next = new Set(current)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })
  }

  return (
    <div className="msn-buddylist msn-scroll" role="tree" aria-label="Contatos">
      {groups.map((group) => {
        const folded = foldedGroups.has(group.id)
        return (
          <div key={group.id} role="group">
            <button
              type="button"
              className="msn-group-header"
              aria-expanded={!folded}
              onClick={() => toggleGroup(group.id)}
            >
              <img src={folded ? expandIcon : collapseIcon} alt="" />
              <span>
                {group.label} ({group.contacts.length})
              </span>
            </button>
            {!folded &&
              group.contacts.map((contact) => (
                <BuddyRow
                  key={contact.id}
                  contact={contact}
                  selected={contact.id === selectedId}
                  onSelect={() => setSelectedId(contact.id)}
                  onOpen={() => onOpen(contact.id)}
                />
              ))}
          </div>
        )
      })}
    </div>
  )
}

// One contact: status buddy, name, then " (Ausente)" and their personal message in grey
function BuddyRow({ contact, selected, onSelect, onOpen }) {
  const status = CONTACT_STATUS[contact.status] ?? CONTACT_STATUS.offline

  return (
    <button
      type="button"
      role="treeitem"
      aria-selected={selected}
      className={`msn-buddy ${selected ? 'selected' : ''}`}
      onClick={onSelect}
      onFocus={onSelect}
      onDoubleClick={onOpen}
      onKeyDown={(event) => event.key === 'Enter' && onOpen()}
    >
      <img src={status.icon} alt="" className="msn-buddy-icon" />
      <span className="msn-buddy-text">
        {contact.name}
        {status.suffix && <span className="msn-buddy-status"> ({status.suffix})</span>}
        {contact.personalMessage && <span className="msn-buddy-psm"> - {contact.personalMessage}</span>}
      </span>
    </button>
  )
}

function groupByStatus(contacts) {
  const byName = (a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
  const online = contacts.filter((contact) => contact.status !== 'offline').sort(byName)
  const offline = contacts.filter((contact) => contact.status === 'offline').sort(byName)
  return [
    { id: 'online', label: 'Online', contacts: online },
    { id: 'offline', label: 'Offline', contacts: offline },
  ]
}

export default BuddyList
