import * as React from 'react'
import { ThemeContext } from './theme-context'
import { modernThemes } from './modern-presets'
import { useReducedMotion } from '@clarity-chat/primitives'
import type {
  ThemeContextValue,
  ThemeConfig,
  ThemePresetName,
  ThemeMode,
  ThemeAnimationSpeed,
} from './theme-types'
import type { ThemeProviderProps } from './ThemeProvider.props'
import { normalizeThemeInput } from './ThemeProvider.utils'
import { useThemeResolution } from './hooks/useThemeResolution'
import { useAccessibilityPreferences } from './hooks/useAccessibilityPreferences'
import {
  useThemePersistence,
  useThemeHydration,
} from './hooks/useThemePersistence'
import { useCrossTabSync } from './hooks/useCrossTabSync'

// Re-export types
export type {
  ThemeMode,
  ThemePresetName,
  ThemeConfig,
  ThemeAnimationSpeed,
} from './theme-types'
export type { ThemeProviderProps } from './ThemeProvider.props'

/**
 * ThemeProvider - Provides theme context to all Clarity Chat components
 *
 * Features:
 * - Light/Dark mode support
 * - System preference detection
 * - LocalStorage persistence
 * - CSS variable injection
 * - Real-time theme switching
 * - Cross-tab synchronization
 * - Accessibility preferences (high contrast, forced colors)
 *
 * @example
 * ```tsx
 * <ThemeProvider defaultTheme={{ mode: 'dark', radius: 8 }}>
 *   <ChatWindow />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme: defaultThemeInput,
  storageKey = 'clarity-chat-theme',
  enableCrossTabSync = true,
  crossTabSyncDebounce = 100,
  animationSpeed = 'normal',
}: ThemeProviderProps) {
  // Normalize the input to handle both ThemeConfig and CompleteThemeConfig
  const normalizedDefault = React.useMemo(
    () => normalizeThemeInput(defaultThemeInput),
    [defaultThemeInput]
  )

  // Initialize with defaults (SSR-safe)
  const [theme, setThemeState] = React.useState<ThemeConfig>(() => ({
    mode: 'system',
    ...normalizedDefault,
  }))

  // Check for reduced motion preference
  const prefersReducedMotion = useReducedMotion()

  // Hydrate from localStorage after mount (SSR-safe)
  const isHydrated = useThemeHydration(storageKey, setThemeState)

  // Resolve theme configuration and mode
  const { resolvedMode, resolvedTheme } = useThemeResolution(
    theme,
    prefersReducedMotion,
    animationSpeed
  )

  // Listen to accessibility preferences (high contrast, forced colors)
  useAccessibilityPreferences()

  // Persist theme to localStorage
  useThemePersistence({ storageKey, theme, isHydrated })

  // Cross-tab theme synchronization
  useCrossTabSync({
    storageKey,
    enableCrossTabSync,
    crossTabSyncDebounce,
    theme,
    isHydrated,
    setThemeState,
  })

  // Theme manipulation callbacks
  const setTheme = React.useCallback((newTheme: Partial<ThemeConfig>) => {
    setThemeState((prev) => ({ ...prev, ...newTheme }))
  }, [])

  const toggleMode = React.useCallback(() => {
    setThemeState((prev) => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light',
    }))
  }, [])

  const setPreset = React.useCallback((preset: ThemePresetName) => {
    setThemeState((prev) => ({ ...prev, preset }))
  }, [])

  // Available presets
  const availablePresets = React.useMemo(
    () => Object.keys(modernThemes) as ThemePresetName[],
    []
  )

  // Context value
  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      mode: resolvedMode,
      toggleMode,
      resolvedTheme,
      setPreset,
      availablePresets,
    }),
    [
      theme,
      setTheme,
      resolvedMode,
      toggleMode,
      resolvedTheme,
      setPreset,
      availablePresets,
    ]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * useTheme hook - Access theme context
 *
 * @example
 * ```tsx
 * const { mode, toggleMode, setPreset } = useTheme()
 *
 * // Toggle dark mode
 * <button onClick={toggleMode}>
 *   {mode === 'dark' ? 'Light' : 'Dark'}
 * </button>
 *
 * // Change preset
 * <button onClick={() => setPreset('vibrant')}>
 *   Vibrant Theme
 * </button>
 * ```
 */
export function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
