'use client'

import { useState, useEffect, useCallback } from 'react'
import { useMounted } from './useMounted'

/**
 * Hook for persisting state to localStorage with SSR safety and cross-tab sync
 *
 * @param key - localStorage key
 * @param defaultValue - default value when no stored value exists
 * @returns [value, setValue] tuple similar to useState
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = usePersistedState('theme', 'light')
 * ```
 */
export function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const mounted = useMounted()
  const [value, setValue] = useState<T>(defaultValue)

  // Load from localStorage after mount (SSR safe)
  useEffect(() => {
    if (!mounted) return

    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        setValue(JSON.parse(stored))
      }
    } catch {
      // Silently fail - localStorage may be unavailable
    }
  }, [mounted, key])

  // Persist to localStorage when value changes
  useEffect(() => {
    if (!mounted) return

    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Silently fail - localStorage may be full or unavailable
    }
  }, [mounted, key, value])

  // Cross-tab sync via storage event
  useEffect(() => {
    if (!mounted) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue))
        } catch {
          // Ignore parse errors
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [mounted, key])

  // Wrapped setter that handles function updates
  const setPersistedValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(prev)
        : newValue
      return resolved
    })
  }, [])

  return [value, setPersistedValue, mounted]
}
