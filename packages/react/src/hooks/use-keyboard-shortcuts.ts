import * as React from 'react'

export type KeyboardShortcut = {
  /**
   * Key combination (e.g., 'mod+k', 'ctrl+shift+f', 'escape')
   * Use 'mod' for Cmd on Mac, Ctrl on Windows/Linux
   */
  key: string
  /**
   * Callback when shortcut is triggered
   */
  callback: (event: KeyboardEvent) => void
  /**
   * Description for documentation
   */
  description?: string
  /**
   * Whether shortcut is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Prevent default browser behavior
   * @default true
   */
  preventDefault?: boolean
  /**
   * Enable in input elements
   * @default false
   */
  enableInInput?: boolean
}

/**
 * Register keyboard shortcuts with support for modifiers
 * 
 * @example
 * ```tsx
 * useKeyboardShortcuts([
 *   {
 *     key: 'mod+k',
 *     callback: () => setSearchOpen(true),
 *     description: 'Open search'
 *   },
 *   {
 *     key: 'escape',
 *     callback: () => setSearchOpen(false),
 *     description: 'Close search'
 *   },
 *   {
 *     key: 'mod+enter',
 *     callback: handleSubmit,
 *     description: 'Submit form',
 *     enableInInput: true
 *   }
 * ])
 * ```
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]): void {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if we're in an input element
      const target = event.target as HTMLElement
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      const isContentEditable = target.isContentEditable

      for (const shortcut of shortcuts) {
        const {
          key,
          callback,
          enabled = true,
          preventDefault = true,
          enableInInput = false,
        } = shortcut

        if (!enabled) continue
        if ((isInput || isContentEditable) && !enableInInput) continue

        if (matchesShortcut(event, key)) {
          if (preventDefault) {
            event.preventDefault()
          }
          callback(event)
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

/**
 * Check if keyboard event matches shortcut pattern
 */
function matchesShortcut(event: KeyboardEvent, pattern: string): boolean {
  const parts = pattern.toLowerCase().split('+')
  const key = parts.pop()!
  
  // Check modifiers
  const requiresMod = parts.includes('mod')
  const requiresCtrl = parts.includes('ctrl')
  const requiresAlt = parts.includes('alt')
  const requiresShift = parts.includes('shift')
  const requiresMeta = parts.includes('meta')

  // 'mod' is Cmd on Mac, Ctrl on Windows/Linux
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  const modKey = isMac ? event.metaKey : event.ctrlKey

  const modifierMatch =
    (!requiresMod || modKey) &&
    (!requiresCtrl || event.ctrlKey) &&
    (!requiresAlt || event.altKey) &&
    (!requiresShift || event.shiftKey) &&
    (!requiresMeta || event.metaKey)

  if (!modifierMatch) return false

  // Check key
  const eventKey = event.key.toLowerCase()
  return eventKey === key || event.code.toLowerCase() === key.toLowerCase()
}

/**
 * Hook for getting shortcut display string (e.g., '⌘K' on Mac, 'Ctrl+K' on Windows)
 * 
 * @example
 * ```tsx
 * const getShortcut = useShortcutDisplay()
 * 
 * return <kbd>{getShortcut('mod+k')}</kbd> // Shows ⌘K on Mac, Ctrl+K on Windows
 * ```
 */
export function useShortcutDisplay(): (pattern: string) => string {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)

  return React.useCallback(
    (pattern: string): string => {
      const parts = pattern.split('+').map((p) => {
        switch (p.toLowerCase()) {
          case 'mod':
            return isMac ? '⌘' : 'Ctrl'
          case 'ctrl':
            return isMac ? '⌃' : 'Ctrl'
          case 'alt':
            return isMac ? '⌥' : 'Alt'
          case 'shift':
            return isMac ? '⇧' : 'Shift'
          case 'meta':
            return isMac ? '⌘' : 'Win'
          case 'enter':
            return '↵'
          case 'escape':
            return 'Esc'
          case 'backspace':
            return '⌫'
          case 'delete':
            return 'Del'
          case 'arrowup':
            return '↑'
          case 'arrowdown':
            return '↓'
          case 'arrowleft':
            return '←'
          case 'arrowright':
            return '→'
          default:
            return p.charAt(0).toUpperCase() + p.slice(1)
        }
      })
      return parts.join(isMac ? '' : '+')
    },
    [isMac]
  )
}
