import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useStoredState from '../../hooks/useStoredState'
import { playSound, setMsnMuted } from '../../sounds/sounds'
import { CONTACTS, ME, VIRUS_SENDER_ID } from './contacts'
import { displayPictureSrc } from './displayPictures'
import { MessengerContext } from './messengerContext'
import MessengerToasts from './MessengerToasts'
import PictureDialog from './PictureDialog'
import VirusAttack from './VirusAttack'

/*
 * The MSN session. Like the real one, MSN starts with the computer and stays
 * signed in, in the notification area, until the page is reloaded: contacts
 * sign in one by one (with a toast in the corner and MSN's sound) whether or
 * not its window is open, and messages keep arriving.
 *
 * The prank: a while after you first open MSN, Marcio sends a "photo of
 * you". Its conversation pops up; if you close MSN without clicking it, it
 * pops up again the next time MSN is opened. Clicking it starts the virus
 * (see VirusAttack): survive it and Marcio laughs at you, lose and the
 * computer crashes (`onCrash` reboots the desktop).
 *
 * `onOpenConversation(contactId)` and `onOpenContactList()` come from the
 * desktop, which owns the windows.
 */

// How long after you first open MSN Marcio sends the photo
const VIRUS_DELAY = 25000
// If Marcio is still offline by then, he signs in and sends it this long after
const VIRUS_SIGN_IN_GAP = 3000
// How long a toast stays up, and how long it takes to slide back down
const TOAST_DURATION = 5000
const TOAST_EXIT_DURATION = 300

const VIRUS_MESSAGE = 'kkkkkkkk olha essa foto sua :D :D'
const VIRUS_FILE = 'foto_praia.zip'
const VIRUS_PESTER = ['abre ai kkkkk', 'abre logo pô :P', 'ta com medo? kkkkk ;)']
const VIRUS_SURVIVED = 'kkkkkkkkkk calma era zoeira :D sobreviveu ein (H)'

let nextId = 0
const newId = () => `m${++nextId}`

function message(from, text, kind = 'text', extra = {}) {
  return { id: newId(), from, text, kind, time: new Date(), ...extra }
}

const contactById = (id) => CONTACTS.find((contact) => contact.id === id)

function MessengerProvider({ onOpenConversation, onOpenContactList, onCrash, children }) {
  const [myStatus, setMyStatus] = useState('online')
  const [myPersonalMessage, setMyPersonalMessage] = useState('')
  // The id of one of MSN's display pictures, kept between visits (null: futeborkut's photo, or the default buddy)
  const [myPicture, setMyPicture] = useStoredState('msn:displayPicture', null)
  // MSN's sounds on or off, kept between visits
  const [soundsOn, setSoundsOn] = useStoredState('msn:soundsOn', true)
  useEffect(() => {
    setMsnMuted(!soundsOn)
  }, [soundsOn])
  const [pictureDialogOpen, setPictureDialogOpen] = useState(false)
  const [statuses, setStatuses] = useState(() => Object.fromEntries(CONTACTS.map((contact) => [contact.id, 'offline'])))
  const [conversations, setConversations] = useState({})
  const [toasts, setToasts] = useState([])
  // 'idle' → 'scheduled' (MSN opened) → 'sent' → 'attack' (clicked) → 'survived' or 'crashed'
  const [virus, setVirus] = useState('idle')

  // The desktop's callbacks change every render; timers read the latest ones from here
  const desktop = useRef({ onOpenConversation, onOpenContactList, onCrash })
  useEffect(() => {
    desktop.current = { onOpenConversation, onOpenContactList, onCrash }
  })
  // Timers also need to know who's online right now
  const currentStatuses = useRef(statuses)
  useEffect(() => {
    currentStatuses.current = statuses
  })

  // One-off timers (toasts going away, Marcio's replies), all cancelled when the desktop goes away
  // so nothing pops up or plays a sound after a restart
  const pendingTimers = useRef(new Set())
  const later = useCallback((callback, delay) => {
    const timer = setTimeout(() => {
      pendingTimers.current.delete(timer)
      callback()
    }, delay)
    pendingTimers.current.add(timer)
  }, [])
  useEffect(() => {
    const timers = pendingTimers.current
    return () => timers.forEach(clearTimeout)
  }, [])

  const addMessages = useCallback((contactId, ...messages) => {
    setConversations((current) => ({ ...current, [contactId]: [...(current[contactId] ?? []), ...messages] }))
  }, [])

  // A toast slides away first (`leaving`), then it's gone
  const dismissToast = useCallback((id) => {
    setToasts((current) => current.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)))
    later(() => setToasts((current) => current.filter((other) => other.id !== id)), TOAST_EXIT_DURATION)
  }, [later])

  const showToast = useCallback(
    (toast) => {
      const id = newId()
      setToasts((current) => [...current.slice(-2), { ...toast, id, leaving: false }])
      later(() => dismissToast(id), TOAST_DURATION)
    },
    [dismissToast, later],
  )

  const openConversation = useCallback((contactId) => desktop.current.onOpenConversation(contactId), [])

  // A contact signs in: their status, their "oi" waiting in the conversation, the toast and the sound
  const signInContact = useCallback(
    (contact) => {
      setStatuses((current) => ({ ...current, [contact.id]: contact.status }))
      if (contact.greeting) addMessages(contact.id, message(contact.id, contact.greeting))
      showToast({ contactId: contact.id, picture: contact.picture, title: contact.name, text: 'acabou de entrar.' })
      playSound('msnOnline')
    },
    [addMessages, showToast],
  )

  // Contacts sign in one by one from the moment the computer starts
  useEffect(() => {
    const timers = CONTACTS.map((contact) =>
      setTimeout(() => {
        if (currentStatuses.current[contact.id] === 'offline') signInContact(contact)
      }, contact.signInAfter * 1000),
    )
    return () => timers.forEach(clearTimeout)
  }, [signInContact])

  // A message from a contact: in the conversation, with the toast and MSN's message sound
  const receiveMessages = useCallback(
    (contactId, ...messages) => {
      const contact = contactById(contactId)
      addMessages(contactId, ...messages)
      showToast({ contactId, picture: contact?.picture, title: `${contact?.name} diz:`, text: messages[0].text })
      playSound('msnMessage')
    },
    [addMessages, showToast],
  )

  // Marcio's "photo", a while after you first open MSN (signing him in first if he isn't yet)
  useEffect(() => {
    if (virus !== 'scheduled') return
    let sendTimer
    const timer = setTimeout(() => {
      const sender = contactById(VIRUS_SENDER_ID)
      const offline = currentStatuses.current[VIRUS_SENDER_ID] === 'offline'
      if (offline) signInContact(sender)
      sendTimer = setTimeout(
        () => {
          receiveMessages(VIRUS_SENDER_ID, message(VIRUS_SENDER_ID, VIRUS_MESSAGE), message(VIRUS_SENDER_ID, VIRUS_FILE, 'link'))
          setVirus('sent')
          openConversation(VIRUS_SENDER_ID)
        },
        offline ? VIRUS_SIGN_IN_GAP : 0,
      )
    }, VIRUS_DELAY)
    return () => {
      clearTimeout(timer)
      clearTimeout(sendTimer)
    }
  }, [virus, signInContact, receiveMessages, openConversation])

  const pesterCount = useRef(0)

  const session = useMemo(
    () => ({
      // MSN signs in with the computer
      signedIn: true,
      me: { ...ME, picture: displayPictureSrc(myPicture) ?? ME.picture, status: myStatus, personalMessage: myPersonalMessage },
      setMyStatus,
      soundsOn,
      toggleSounds: () => setSoundsOn((current) => !current),
      setMyPersonalMessage,
      openPictureDialog: () => setPictureDialogOpen(true),
      contacts: CONTACTS.map((contact) => ({ ...contact, status: statuses[contact.id] })),
      conversationWith: (contactId) => conversations[contactId] ?? [],
      virusState: virus,

      // The contact list window calls this when it opens: the first time starts Marcio's countdown,
      // and his unopened photo comes back if it was left behind
      contactListOpened() {
        setVirus((current) => (current === 'idle' ? 'scheduled' : current))
        if (virus === 'sent') openConversation(VIRUS_SENDER_ID)
      },
      openConversation,
      openContactList: () => desktop.current.onOpenContactList(),

      sendMessage(contactId, text) {
        addMessages(contactId, message('me', text))
        // Nobody answers, except Marcio insisting you open the photo
        if (contactId === VIRUS_SENDER_ID && virus === 'sent') {
          const reply = VIRUS_PESTER[pesterCount.current++ % VIRUS_PESTER.length]
          later(() => receiveMessages(VIRUS_SENDER_ID, message(VIRUS_SENDER_ID, reply)), 1800)
        }
      },
      sendNudge(contactId) {
        addMessages(contactId, message('me', 'Você acabou de chamar a atenção!', 'nudge'))
        playSound('msnNudge')
      },
      clickVirusLink() {
        if (virus === 'sent') setVirus('attack')
      },
      showToast,
    }),
    [
      myPicture,
      myStatus,
      myPersonalMessage,
      soundsOn,
      setSoundsOn,
      statuses,
      conversations,
      virus,
      openConversation,
      addMessages,
      receiveMessages,
      showToast,
      later,
    ],
  )

  function handleSurvived() {
    setVirus('survived')
    later(() => receiveMessages(VIRUS_SENDER_ID, message(VIRUS_SENDER_ID, VIRUS_SURVIVED)), 1500)
  }

  function handleCrashed() {
    setVirus('crashed')
    desktop.current.onCrash()
  }

  return (
    <MessengerContext.Provider value={session}>
      {children}
      <MessengerToasts toasts={toasts} onOpen={openConversation} onClose={dismissToast} />
      {pictureDialogOpen && (
        <PictureDialog
          current={myPicture}
          onChoose={(picture) => {
            setMyPicture(picture)
            setPictureDialogOpen(false)
          }}
          onCancel={() => setPictureDialogOpen(false)}
        />
      )}
      {virus === 'attack' && <VirusAttack fileName={VIRUS_FILE} onSurvived={handleSurvived} onCrashed={handleCrashed} />}
    </MessengerContext.Provider>
  )
}

export default MessengerProvider
