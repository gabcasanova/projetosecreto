import { everyone, VISITOR } from '../futeborkut/data/database'

/*
 * MSN's contacts: the band members and Casanova, with their names and
 * photos from futeborkut. This file only adds what MSN needs on top.
 *
 * Everyone starts offline. MSN signs you in when the computer starts, and
 * each contact signs in `signInAfter` seconds later (with the "acabou de
 * entrar." toast), showing `status` from then on: 'online', 'away'
 * (Ausente) or 'busy' (Ocupado).
 * - `greeting` arrives in their conversation when they sign in. They never
 *   answer what you write.
 * - `personalMessage` replaces the futeborkut status as the line under
 *   their name.
 */
const MSN_DETAILS = {
  // Says hi, then sends the "photo" a while after you first open MSN (see MessengerProvider)
  marcio: { status: 'online', signInAfter: 12, greeting: 'eae, beleza?' },
  casanova: { status: 'online', signInAfter: 22, personalMessage: '' },
  asafe: { status: 'away', signInAfter: 50, greeting: 'oii' },
  yuri: { status: 'busy', signInAfter: 85, greeting: 'salve!' },
}

export const VIRUS_SENDER_ID = 'marcio'

// "ana-clara" -> "ana_clara@hotmail.com": everyone had a Hotmail back then
function emailOf(id) {
  return `${id.replace(/-/g, '_')}@hotmail.com`
}

/** Every contact: { id, name, email, picture, status, signInAfter, personalMessage, greeting }. */
export const CONTACTS = everyone()
  .filter((person) => MSN_DETAILS[person.id])
  .map((person) => {
    const details = MSN_DETAILS[person.id]
    return {
      id: person.id,
      name: person.name,
      email: emailOf(person.id),
      picture: person.photo ?? null,
      status: details.status,
      signInAfter: details.signInAfter,
      personalMessage: details.personalMessage ?? person.account?.status ?? '',
      greeting: details.greeting ?? null,
    }
  })

/** Who you are on MSN: futeborkut's visitor. */
export const ME = {
  name: VISITOR.name,
  email: VISITOR.email ?? 'visitante@hotmail.com',
  picture: VISITOR.photo ?? null,
}
