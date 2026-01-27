import { getIsMac } from './platform-detection'

/**
 * Key Parsing and Matching
 */

/**
 * Parse a key string into normalized parts
 */
export function parseKeyString(keyString: string): {
  modifiers: Set<string>
  key: string
} {
  const parts = keyString.toLowerCase().split('+')
  const key = parts.pop() || ''
  const modifiers = new Set(parts)

  // Normalize 'mod' to platform-specific key
  if (modifiers.has('mod')) {
    modifiers.delete('mod')
    modifiers.add(getIsMac() ? 'meta' : 'ctrl')
  }

  return { modifiers, key }
}

/**
 * Check if a keyboard event matches a key pattern
 */
export function matchesKeyPattern(
  event: KeyboardEvent,
  pattern: string
): boolean {
  const { modifiers, key } = parseKeyString(pattern)

  // Check modifiers
  if (modifiers.has('ctrl') !== event.ctrlKey) return false
  if (modifiers.has('alt') !== event.altKey) return false
  if (modifiers.has('shift') !== event.shiftKey) return false
  if (modifiers.has('meta') !== event.metaKey) return false

  // Check key - handle special cases
  const eventKey = event.key.toLowerCase()
  const eventCode = event.code.toLowerCase()

  // Handle special keys
  const specialKeys: Record<string, string[]> = {
    space: [' ', 'space'],
    enter: ['enter', 'return'],
    escape: ['escape', 'esc'],
    tab: ['tab'],
    backspace: ['backspace'],
    delete: ['delete'],
    arrowup: ['arrowup', 'up'],
    arrowdown: ['arrowdown', 'down'],
    arrowleft: ['arrowleft', 'left'],
    arrowright: ['arrowright', 'right'],
    home: ['home'],
    end: ['end'],
    pageup: ['pageup'],
    pagedown: ['pagedown'],
  }

  // Check if key matches
  if (specialKeys[key]) {
    return specialKeys[key].includes(eventKey)
  }

  return (
    eventKey === key ||
    eventCode === `key${key}` ||
    eventCode === `digit${key}` ||
    // Handle symbols on number keys
    event.key === key
  )
}

/**
 * Check if event target is an input element
 */
export function isInputElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false
  const tagName = target.tagName.toUpperCase()
  return (
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName) ||
    target.isContentEditable
  )
}
