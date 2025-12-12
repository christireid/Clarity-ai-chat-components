/**
 * Keyboard Shortcuts Hook
 *
 * Provides keyboard shortcuts for the playground:
 * - Cmd/Ctrl+S: Share
 * - Cmd/Ctrl+Enter: Run
 * - Cmd/Ctrl+K: Open template picker (future)
 * - Cmd/Ctrl+Shift+C: Copy code
 * - Escape: Close menus
 */

import { useEffect, useCallback } from 'react'

interface KeyboardShortcutsConfig {
  onShare?: () => void
  onRun?: () => void
  onCopy?: () => void
  onReset?: () => void
  onToggleTheme?: () => void
  onToggleConsole?: () => void
  onToggleSettings?: () => void
  onEscape?: () => void
  enabled?: boolean
}

export function useKeyboardShortcuts({
  onShare,
  onRun,
  onCopy,
  onReset,
  onToggleTheme,
  onToggleConsole,
  onToggleSettings,
  onEscape,
  enabled = true,
}: KeyboardShortcutsConfig) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      // Don't trigger shortcuts when typing in inputs/textareas (except Monaco editor)
      const target = event.target as HTMLElement | null

      // Skip if target is missing (can happen in test environments)
      if (!target) return

      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      // Allow shortcuts in Monaco editor (safely check for closest method)
      const isMonacoEditor =
        typeof target.closest === 'function'
          ? target.closest('.monaco-editor') !== null
          : false

      if (isInputField && !isMonacoEditor) return

      const isMod = event.metaKey || event.ctrlKey
      const isShift = event.shiftKey

      // Cmd/Ctrl+S: Share
      if (isMod && event.key === 's' && !isShift) {
        event.preventDefault()
        onShare?.()
        return
      }

      // Cmd/Ctrl+Enter: Run
      if (isMod && event.key === 'Enter') {
        event.preventDefault()
        onRun?.()
        return
      }

      // Cmd/Ctrl+Shift+C: Copy code
      if (isMod && isShift && event.key === 'C') {
        event.preventDefault()
        onCopy?.()
        return
      }

      // Cmd/Ctrl+Shift+R: Reset to template
      if (isMod && isShift && event.key === 'R') {
        event.preventDefault()
        onReset?.()
        return
      }

      // Cmd/Ctrl+Shift+D: Toggle dark mode
      if (isMod && isShift && event.key === 'D') {
        event.preventDefault()
        onToggleTheme?.()
        return
      }

      // Cmd/Ctrl+`: Toggle console
      if (isMod && event.key === '`') {
        event.preventDefault()
        onToggleConsole?.()
        return
      }

      // Cmd/Ctrl+,: Toggle settings
      if (isMod && event.key === ',') {
        event.preventDefault()
        onToggleSettings?.()
        return
      }

      // Escape: Close menus
      if (event.key === 'Escape') {
        onEscape?.()
        return
      }
    },
    [
      enabled,
      onShare,
      onRun,
      onCopy,
      onReset,
      onToggleTheme,
      onToggleConsole,
      onToggleSettings,
      onEscape,
    ]
  )

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, handleKeyDown])
}

// Keyboard shortcut descriptions for tooltips/help
export const KEYBOARD_SHORTCUTS = {
  share: { key: '⌘S', description: 'Share playground' },
  run: { key: '⌘Enter', description: 'Run code' },
  copy: { key: '⌘⇧C', description: 'Copy code' },
  reset: { key: '⌘⇧R', description: 'Reset to template' },
  theme: { key: '⌘⇧D', description: 'Toggle dark mode' },
  console: { key: '⌘`', description: 'Toggle console' },
  settings: { key: '⌘,', description: 'Toggle settings' },
} as const

export function getShortcutLabel(key: keyof typeof KEYBOARD_SHORTCUTS): string {
  const isMac =
    typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)
  const shortcut = KEYBOARD_SHORTCUTS[key]
  if (isMac) {
    return shortcut.key
  }
  // Convert Mac symbols to Windows/Linux equivalents
  return shortcut.key.replace('⌘', 'Ctrl+').replace('⇧', 'Shift+')
}
