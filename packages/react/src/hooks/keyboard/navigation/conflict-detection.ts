import type { KeyboardShortcutConfig, ShortcutConflict } from './types'

/**
 * Shortcut Conflict Detection
 */

export function detectConflicts(
  shortcuts: Map<string, KeyboardShortcutConfig>
): ShortcutConflict[] {
  const keyMap = new Map<string, KeyboardShortcutConfig[]>()

  shortcuts.forEach((shortcut) => {
    const keys = Array.isArray(shortcut.keys) ? shortcut.keys : [shortcut.keys]
    keys.forEach((key) => {
      const normalized = key.toLowerCase()
      const existing = keyMap.get(normalized) || []
      // Only count as conflict if both are enabled and in same/no scope
      const conflicting = existing.filter(
        (s) =>
          s.enabled !== false &&
          shortcut.enabled !== false &&
          (s.scope === shortcut.scope || !s.scope || !shortcut.scope)
      )
      if (conflicting.length > 0) {
        keyMap.set(normalized, [...conflicting, shortcut])
      } else {
        keyMap.set(normalized, [shortcut])
      }
    })
  })

  const conflicts: ShortcutConflict[] = []
  keyMap.forEach((shortcuts, key) => {
    if (shortcuts.length > 1) {
      conflicts.push({ key, shortcuts })
    }
  })

  return conflicts
}
