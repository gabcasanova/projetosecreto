import { createContext, useContext } from 'react'

/*
 * The MSN session shared by the contact list, the conversations, the tray
 * icon and the toasts (see MessengerProvider for what it holds).
 */
export const MessengerContext = createContext(null)

export function useMessenger() {
  return useContext(MessengerContext)
}
