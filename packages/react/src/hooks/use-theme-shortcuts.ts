'use client'

import * as React from 'react'
import { useTheme } from '../theme/ThemeProvider'

/**
 * useThemeShortcuts - Enable keyboard shortcuts for theme switching
 *
 * **Default Shortcuts:**
 * - `Ctrl/Cmd + Shift + L` - Toggle between light and dark mode
 * - `Ctrl/Cmd + Shift + T` - Cycle through all theme modes (light → dark → system)
 *
 * **Features:**
 * - Platform-aware (Cmd on Mac, Ctrl on Windows/Linux)
 * - Customizable shortcut keys
 * - Auto-cleanup on unmount
 * - Works globally across the app
 *
 * @example
 * ```tsx
 * function App() {
 *   // Enable default theme shortcuts
 *   useThemeShortcuts()
 *
 *   return <YourApp />
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom shortcut (Ctrl+K)
 * useThemeShortcuts({
 *   toggleKey: 'k',
 *   requireMeta: true,
 *   requireShift: false
 * })
 * ```
 */
export interface UseThemeShortcutsOptions {
  /**
   * Enable the toggle shortcut (default: true)
   * Toggles between light and dark mode
   */
  enableToggle?: boolean

  /**
   * Enable the cycle shortcut (default: true)
   * Cycles through all theme modes
   */
  enableCycle?: boolean

  /**
   * Key for toggle shortcut (default: 'l')
   * Used with Ctrl/Cmd + Shift
   */
  toggleKey?: string

  /**
   * Key for cycle shortcut (default: 't')
   * Used with Ctrl/Cmd + Shift
   */
  cycleKey?: string

  /**
   * Require Ctrl/Cmd key (default: true)
   */
  requireMeta?: boolean

  /**
   * Require Shift key (default: true)
   */
  requireShift?: boolean

  /**
   * Callback when shortcut is triggered
   */
  onShortcut?: (action: 'toggle' | 'cycle', newMode: 'light' | 'dark' | 'system') => void
}

export function useThemeShortcuts(options: UseThemeShortcutsOptions = {}) {
  const {
    enableToggle = true,
    enableCycle = true,
    toggleKey = 'l',
    cycleKey = 't',
    requireMeta = true,
    requireShift = true,
    onShortcut,
  } = options

  const { theme, setTheme, mode } = useTheme()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if meta/ctrl key is required and pressed
      const metaPressed = e.metaKey || e.ctrlKey
      if (requireMeta && !metaPressed) return

      // Check if shift key is required and pressed
      if (requireShift && !e.shiftKey) return

      // Normalize key to lowercase for comparison
      const key = e.key.toLowerCase()

      // Handle toggle shortcut (light <-> dark)
      if (enableToggle && key === toggleKey.toLowerCase()) {
        e.preventDefault()

        // Toggle between light and dark (ignore system)
        const newMode = mode === 'light' ? 'dark' : 'light'
        setTheme({ mode: newMode })
        onShortcut?.('toggle', newMode)

        return
      }

      // Handle cycle shortcut (light -> dark -> system -> light)
      if (enableCycle && key === cycleKey.toLowerCase()) {
        e.preventDefault()

        const modes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system']
        const currentIndex = modes.indexOf(theme.mode)
        const nextMode = modes[(currentIndex + 1) % modes.length] as 'light' | 'dark' | 'system'

        setTheme({ mode: nextMode })
        onShortcut?.('cycle', nextMode)

        return
      }
    }

    // Add global keyboard listener
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    mode,
    theme.mode,
    setTheme,
    enableToggle,
    enableCycle,
    toggleKey,
    cycleKey,
    requireMeta,
    requireShift,
    onShortcut,
  ])

  // Return current theme info for convenience
  return {
    currentMode: mode,
    themeConfig: theme,
    shortcuts: {
      toggle: requireMeta && requireShift
        ? `Ctrl/Cmd + Shift + ${toggleKey.toUpperCase()}`
        : requireMeta
          ? `Ctrl/Cmd + ${toggleKey.toUpperCase()}`
          : requireShift
            ? `Shift + ${toggleKey.toUpperCase()}`
            : toggleKey.toUpperCase(),
      cycle: requireMeta && requireShift
        ? `Ctrl/Cmd + Shift + ${cycleKey.toUpperCase()}`
        : requireMeta
          ? `Ctrl/Cmd + ${cycleKey.toUpperCase()}`
          : requireShift
            ? `Shift + ${cycleKey.toUpperCase()}`
            : cycleKey.toUpperCase(),
    },
  }
}

// Note: ThemeShortcutHint component moved to components/theme-shortcut-hint.tsx
// to avoid JSX in .ts file
