/*
 * Whether a menu item does nothing in the simulation: it's disabled, or has
 * no action, or is a submenu whose items all do nothing. Those are greyed
 * out, so it's clear what can be used.
 */
export function isInert(item) {
  if (item.separator) return true
  if (item.disabled) return true
  if (item.items) return item.items.every(isInert)
  return !item.action
}
