import awayIcon from './assets/status-away.png'
import busyIcon from './assets/status-busy.png'
import offlineIcon from './assets/status-offline.png'
import onlineIcon from './assets/status-online.png'
import tabAwayIcon from './assets/tab-icon-contacts-away.png'
import tabBusyIcon from './assets/tab-icon-contacts-busy.png'
import tabOfflineIcon from './assets/tab-icon-contacts-offline.png'
import tabOnlineIcon from './assets/tab-icon-contacts-online.png'

/*
 * MSN's statuses, with their 16px buddy icons and the words MSN 7.5 used
 * for them in Portuguese.
 */

// A contact's status: the icon in the list and the grey suffix after the name
export const CONTACT_STATUS = {
  online: { icon: onlineIcon, suffix: '' },
  away: { icon: awayIcon, suffix: 'Ausente' },
  busy: { icon: busyIcon, suffix: 'Ocupado' },
  offline: { icon: offlineIcon, suffix: 'Offline' },
}

// The big buddy on the Contatos tab follows your own status
const TAB_ICON = { online: tabOnlineIcon, away: tabAwayIcon, busy: tabBusyIcon, offline: tabOfflineIcon }

/*
 * The statuses you can pick for yourself, in the order of MSN's menu. Each
 * one looks like one of the four basic statuses (`look`).
 */
export const MY_STATUSES = [
  { id: 'online', label: 'Online', look: 'online' },
  { id: 'busy', label: 'Ocupado', look: 'busy' },
  { id: 'brb', label: 'Volto já', look: 'away' },
  { id: 'away', label: 'Ausente', look: 'away' },
  { id: 'phone', label: 'Ao telefone', look: 'busy' },
  { id: 'lunch', label: 'Saí para almoçar', look: 'away' },
  { id: 'appearOffline', label: 'Aparecer offline', look: 'offline' },
]

/** Label and icons for one of your statuses ('online' if it's unknown). */
export function myStatusInfo(statusId) {
  const status = MY_STATUSES.find((candidate) => candidate.id === statusId) ?? MY_STATUSES[0]
  return { ...status, icon: CONTACT_STATUS[status.look].icon, tabIcon: TAB_ICON[status.look] }
}
