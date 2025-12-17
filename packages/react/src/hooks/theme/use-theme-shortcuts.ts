'use client'

import * as React from 'react'
import { useTheme } from '../theme/ThemeProvider'

/**
 * useThemeShortcuts - Enable keyboard shortcuts for theme switching
 *
 * **Default Shortcuts:**
 * - `Ctrl/Cmd + Shift + L` - Toggle between light and dark mode
 * - `Ctrl/Cmd + Shift + T` - Cycle through all theme modes (light → dark → system)
 * - `Ctrl/Cmd + Shift + 1` - Set light mode directly
 * - `Ctrl/Cmd + Shift + 2` - Set dark mode directly
 * - `Ctrl/Cmd + Shift + 3` - Set system mode directly
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
 *
 * @example
 * ```tsx
 * // Get all available shortcuts for display
 * const { shortcuts } = useThemeShortcuts()
 * // shortcuts.light = "Ctrl/Cmd + Shift + 1"
 * // shortcuts.dark = "Ctrl/Cmd + Shift + 2"
 * // shortcuts.system = "Ctrl/Cmd + Shift + 3"
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
   * Enable direct mode shortcuts (default: true)
   * Allows setting light (1), dark (2), or system (3) mode directly
   */
  enableDirectMode?: boolean

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
   * Key for light mode shortcut (default: '1')
   * Used with Ctrl/Cmd + Shift
   */
  lightKey?: string

  /**
   * Key for dark mode shortcut (default: '2')
   * Used with Ctrl/Cmd + Shift
   */
  darkKey?: string

  /**
   * Key for system mode shortcut (default: '3')
   * Used with Ctrl/Cmd + Shift
   */
  systemKey?: string

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
  onShortcut?: (
    action: 'toggle' | 'cycle' | 'direct',
    newMode: 'light' | 'dark' | 'system'
  ) => void
}

export function useThemeShortcuts(options: UseThemeShortcutsOptions = {}) {
  const {
    enableToggle = true,
    enableCycle = true,
    enableDirectMode = true,
    toggleKey = 'l',
    cycleKey = 't',
    lightKey = '1',
    darkKey = '2',
    systemKey = '3',
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

        const modes: ('light' | 'dark' | 'system')[] = [
          'light',
          'dark',
          'system',
        ]
        const currentIndex = modes.indexOf(theme.mode)
        const nextMode = modes[(currentIndex + 1) % modes.length] as
          | 'light'
          | 'dark'
          | 'system'

        setTheme({ mode: nextMode })
        onShortcut?.('cycle', nextMode)

        return
      }

      // Handle direct mode shortcuts
      if (enableDirectMode) {
        if (key === lightKey.toLowerCase()) {
          e.preventDefault()
          setTheme({ mode: 'light' })
          onShortcut?.('direct', 'light')
          return
        }

        if (key === darkKey.toLowerCase()) {
          e.preventDefault()
          setTheme({ mode: 'dark' })
          onShortcut?.('direct', 'dark')
          return
        }

        if (key === systemKey.toLowerCase()) {
          e.preventDefault()
          setTheme({ mode: 'system' })
          onShortcut?.('direct', 'system')
          return
        }
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
    enableDirectMode,
    toggleKey,
    cycleKey,
    lightKey,
    darkKey,
    systemKey,
    requireMeta,
    requireShift,
    onShortcut,
  ])

  // Helper to format shortcut string
  const formatShortcut = (key: string) => {
    if (requireMeta && requireShift) {
      return `Ctrl/Cmd + Shift + ${key.toUpperCase()}`
    } else if (requireMeta) {
      return `Ctrl/Cmd + ${key.toUpperCase()}`
    } else if (requireShift) {
      return `Shift + ${key.toUpperCase()}`
    }
    return key.toUpperCase()
  }

  // Return current theme info for convenience
  return {
    currentMode: mode,
    themeConfig: theme,
    shortcuts: {
      toggle: formatShortcut(toggleKey),
      cycle: formatShortcut(cycleKey),
      light: formatShortcut(lightKey),
      dark: formatShortcut(darkKey),
      system: formatShortcut(systemKey),
    },
  }
}

// Note: ThemeShortcutHint component moved to components/theme-shortcut-hint.tsx
// to avoid JSX in .ts file
