import * as React from 'react'
import type { ThemeConfig } from '../theme-types'

interface UseCrossTabSyncProps {
  storageKey: string
  enableCrossTabSync: boolean
  crossTabSyncDebounce: number
  theme: ThemeConfig
  isHydrated: boolean
  setThemeState: React.Dispatch<React.SetStateAction<ThemeConfig>>
}

/**
 * Hook to handle cross-tab theme synchronization using BroadcastChannel
 */
export function useCrossTabSync({
  storageKey,
  enableCrossTabSync,
  crossTabSyncDebounce,
  theme,
  isHydrated,
  setThemeState,
}: UseCrossTabSyncProps) {
  const broadcastRef = React.useRef<BroadcastChannel | null>(null)
  const broadcastTimeoutRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null)

  // Listen for theme changes from other tabs
  React.useEffect(() => {
    if (!enableCrossTabSync || typeof window === 'undefined') return
    if (typeof BroadcastChannel === 'undefined') return // Not supported in older browsers

    const channelName = `${storageKey}-sync`
    let channel: BroadcastChannel | null = null

    try {
      channel = new BroadcastChannel(channelName)

      // Listen for theme changes from other tabs
      channel.onmessage = (event) => {
        if (event.data?.type === 'theme-change') {
          const newTheme = event.data.theme as Partial<ThemeConfig>
          setThemeState((prev) => ({ ...prev, ...newTheme }))
        }
      }
    } catch (error) {
      // BroadcastChannel may not be available in some environments
      if (process.env.NODE_ENV === 'development') {
        console.warn('Cross-tab theme sync not available:', error)
      }
    }

    return () => {
      channel?.close()
    }
  }, [storageKey, enableCrossTabSync, setThemeState])

  // Broadcast theme changes to other tabs with debouncing
  React.useEffect(() => {
    if (!enableCrossTabSync || typeof window === 'undefined') return
    if (typeof BroadcastChannel === 'undefined') {
      // Log warning in development only
      if (process.env['NODE_ENV'] === 'development') {
        console.warn(
          '[Clarity Chat] BroadcastChannel API not available. ' +
            'Cross-tab theme sync will fall back to localStorage-only persistence. ' +
            'Theme changes will sync on page reload but not in real-time.'
        )
      }
      return
    }
    if (!isHydrated) return // Don't broadcast until hydrated

    const channelName = `${storageKey}-sync`

    // Debounced broadcast function
    const broadcastTheme = () => {
      try {
        if (!broadcastRef.current) {
          broadcastRef.current = new BroadcastChannel(channelName)
        }

        // Broadcast the theme change
        broadcastRef.current.postMessage({
          type: 'theme-change',
          theme: {
            mode: theme.mode,
            preset: theme.preset,
            enableTransitions: theme.enableTransitions,
          },
        })
      } catch {
        // Silently fail if broadcast not available
      }
    }

    // Clear any pending broadcast
    if (broadcastTimeoutRef.current) {
      clearTimeout(broadcastTimeoutRef.current)
    }

    // Apply debouncing if configured
    if (crossTabSyncDebounce > 0) {
      broadcastTimeoutRef.current = setTimeout(
        broadcastTheme,
        crossTabSyncDebounce
      )
    } else {
      broadcastTheme()
    }

    return () => {
      // Don't close channel here - we want to keep broadcasting on changes
      // Clean up timeout on unmount
      if (broadcastTimeoutRef.current) {
        clearTimeout(broadcastTimeoutRef.current)
      }
    }
  }, [
    theme.mode,
    theme.preset,
    theme.enableTransitions,
    storageKey,
    enableCrossTabSync,
    crossTabSyncDebounce,
    isHydrated,
  ])

  // Cleanup broadcast channel on unmount
  React.useEffect(() => {
    return () => {
      broadcastRef.current?.close()
      broadcastRef.current = null
    }
  }, [])
}
