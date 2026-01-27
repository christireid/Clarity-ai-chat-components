import * as React from 'react'
import type { ThemeConfig } from '../theme-types'
import {
  getPersistablePreferences,
  parseStoredPreferences,
} from '../ThemeProvider.utils'

interface UseThemePersistenceProps {
  storageKey: string
  theme: ThemeConfig
  isHydrated: boolean
}

/**
 * Hook to handle theme persistence to localStorage
 */
export function useThemePersistence({
  storageKey,
  theme,
  isHydrated,
}: UseThemePersistenceProps) {
  // Save to localStorage (only persist user preferences, not full theme config)
  React.useEffect(() => {
    // Don't persist until hydrated to avoid overwriting with defaults
    if (!isHydrated) return

    if (typeof window !== 'undefined') {
      try {
        const toStore = getPersistablePreferences(theme)
        localStorage.setItem(storageKey, JSON.stringify(toStore))
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Failed to save theme to localStorage:', error)
        }
      }
    }
  }, [
    theme.mode,
    theme.preset,
    theme.enableTransitions,
    storageKey,
    isHydrated,
  ])
}

/**
 * Hook to hydrate theme from localStorage on mount
 */
export function useThemeHydration(
  storageKey: string,
  setThemeState: React.Dispatch<React.SetStateAction<ThemeConfig>>
) {
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    if (isHydrated) return

    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const persistedPreferences = parseStoredPreferences(stored)
        if (persistedPreferences) {
          setThemeState((prev) => ({ ...prev, ...persistedPreferences }))
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to load theme from localStorage:', error)
      }
    }

    setIsHydrated(true)
  }, [storageKey, isHydrated, setThemeState])

  return isHydrated
}
