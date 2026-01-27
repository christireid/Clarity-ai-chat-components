import { getIsMac } from './platform-detection'

/**
 * Shortcut Display Formatting
 */

/**
 * Format a key pattern for display
 */
export function formatShortcutDisplay(
  pattern: string,
  platform?: 'mac' | 'windows'
): string {
  const effectivePlatform = platform ?? (getIsMac() ? 'mac' : 'windows')
  const symbols: Record<string, { mac: string; windows: string }> = {
    mod: { mac: '⌘', windows: 'Ctrl' },
    ctrl: { mac: '⌃', windows: 'Ctrl' },
    alt: { mac: '⌥', windows: 'Alt' },
    shift: { mac: '⇧', windows: 'Shift' },
    meta: { mac: '⌘', windows: 'Win' },
    enter: { mac: '↵', windows: '↵' },
    return: { mac: '↵', windows: '↵' },
    escape: { mac: 'Esc', windows: 'Esc' },
    esc: { mac: 'Esc', windows: 'Esc' },
    backspace: { mac: '⌫', windows: '⌫' },
    delete: { mac: '⌦', windows: 'Del' },
    tab: { mac: '⇥', windows: 'Tab' },
    space: { mac: '␣', windows: 'Space' },
    arrowup: { mac: '↑', windows: '↑' },
    arrowdown: { mac: '↓', windows: '↓' },
    arrowleft: { mac: '←', windows: '←' },
    arrowright: { mac: '→', windows: '→' },
    up: { mac: '↑', windows: '↑' },
    down: { mac: '↓', windows: '↓' },
    left: { mac: '←', windows: '←' },
    right: { mac: '→', windows: '→' },
    home: { mac: '↖', windows: 'Home' },
    end: { mac: '↘', windows: 'End' },
    pageup: { mac: '⇞', windows: 'PgUp' },
    pagedown: { mac: '⇟', windows: 'PgDn' },
  }

  // Handle sequence patterns (e.g., 'g i')
  if (pattern.includes(' ')) {
    return pattern
      .split(' ')
      .map((p) => formatShortcutDisplay(p, effectivePlatform))
      .join(' ')
  }

  const parts = pattern.split('+')
  const formatted = parts.map((part) => {
    const lower = part.toLowerCase()
    if (symbols[lower]) {
      return symbols[lower][effectivePlatform]
    }
    return part.charAt(0).toUpperCase() + part.slice(1)
  })

  return effectivePlatform === 'mac' ? formatted.join('') : formatted.join('+')
}
