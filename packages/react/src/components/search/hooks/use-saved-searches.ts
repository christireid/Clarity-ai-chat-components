import * as React from 'react'
import type { SavedSearch } from '../types'
import { STORAGE_KEY_SAVED, STORAGE_KEY_RECENT } from '../constants'

/**
 * Hook to manage saved searches and recent searches
 */
export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = React.useState<SavedSearch[]>([])
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])

  // Load saved and recent searches from localStorage
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Validate saved searches structure
        if (
          Array.isArray(parsed) &&
          parsed.every(
            (s: unknown) =>
              typeof s === 'object' &&
              s !== null &&
              'id' in s &&
              'name' in s &&
              'filters' in s &&
              'createdAt' in s
          )
        ) {
          setSavedSearches(parsed as SavedSearch[])
        }
      }

      const recent = localStorage.getItem(STORAGE_KEY_RECENT)
      if (recent) {
        const parsed = JSON.parse(recent)
        // Validate recent searches structure
        if (
          Array.isArray(parsed) &&
          parsed.every((r: unknown) => typeof r === 'string')
        ) {
          setRecentSearches(parsed)
        }
      }
    } catch {
      // Silently fail - invalid data will use defaults
    }
  }, [])

  // Add to recent searches
  const addToRecent = React.useCallback((query: string) => {
    if (!query.trim()) return

    setRecentSearches((prev) => {
      const newRecent = [query, ...prev.filter((r) => r !== query)].slice(0, 10)
      try {
        localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(newRecent))
      } catch {
        // Silently fail
      }
      return newRecent
    })
  }, [])

  // Save a new search
  const saveSearch = React.useCallback((name: string, filters: SavedSearch['filters']) => {
    if (!name.trim()) return

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name,
      filters,
      createdAt: Date.now(),
    }

    setSavedSearches((prev) => {
      const newSaved = [newSearch, ...prev].slice(0, 20)
      try {
        localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(newSaved))
      } catch {
        // Silently fail
      }
      return newSaved
    })
  }, [])

  // Update last used timestamp
  const updateLastUsed = React.useCallback((id: string) => {
    setSavedSearches((prev) => {
      const updated = prev.map((s) =>
        s.id === id ? { ...s, lastUsed: Date.now() } : s
      )
      try {
        localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated))
      } catch {
        // Silently fail
      }
      return updated
    })
  }, [])

  // Delete a saved search
  const deleteSearch = React.useCallback((id: string) => {
    setSavedSearches((prev) => {
      const updated = prev.filter((s) => s.id !== id)
      try {
        localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated))
      } catch {
        // Silently fail
      }
      return updated
    })
  }, [])

  return {
    savedSearches,
    recentSearches,
    addToRecent,
    saveSearch,
    updateLastUsed,
    deleteSearch,
  }
}
