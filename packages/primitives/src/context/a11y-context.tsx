'use client'

import * as React from 'react'
import {
  announce as ariaAnnounce,
  clearAnnouncement as ariaClearAnnouncement,
} from '../lib/aria'

// ============================================================================
// Types
// ============================================================================

export interface A11yContextValue {
  /**
   * Whether the user prefers reduced motion
   */
  prefersReducedMotion: boolean

  /**
   * Announce a message to screen readers via live region
   */
  announce: (message: string, options?: AnnounceOptions) => void

  /**
   * Clear any pending announcements
   */
  clearAnnouncements: () => void

  /**
   * Current announcement queue (for debugging/testing)
   */
  announcementQueue: string[]
}

export interface AnnounceOptions {
  /**
   * Use assertive (interrupts) or polite (waits) announcement
   * @default false (polite)
   */
  assertive?: boolean

  /**
   * Auto-clear the announcement after this many milliseconds
   * @default 1000
   */
  clearAfter?: number

  /**
   * Priority level for queuing (higher = announced first)
   * @default 0
   */
  priority?: number
}

export interface A11yProviderProps {
  children: React.ReactNode

  /**
   * Override reduced motion detection (useful for testing)
   */
  forceReducedMotion?: boolean

  /**
   * Debounce rapid announcements (ms)
   * @default 100
   */
  announceDebounce?: number
}

// ============================================================================
// Context
// ============================================================================

const A11yContext = React.createContext<A11yContextValue | null>(null)

/**
 * Hook to access accessibility context
 *
 * @example
 * ```tsx
 * const { prefersReducedMotion, announce } = useA11y()
 *
 * const handleClick = () => {
 *   announce('Item added to cart')
 * }
 * ```
 */
export function useA11y(): A11yContextValue {
  const context = React.useContext(A11yContext)

  if (!context) {
    // Return sensible defaults when used outside provider
    // This allows components to work without requiring provider wrapper
    return {
      prefersReducedMotion: false,
      announce: () => {},
      clearAnnouncements: () => {},
      announcementQueue: [],
    }
  }

  return context
}

/**
 * Hook that returns true if reduced motion is preferred
 * Can be used standalone or will use context if available
 */
export function useReducedMotionContext(): boolean {
  const context = React.useContext(A11yContext)

  // Always call useState and useEffect (React hooks rules)
  const [localPrefersReducedMotion, setLocalPrefersReducedMotion] =
    React.useState(false)

  React.useEffect(() => {
    // Skip if using context
    if (context) return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setLocalPrefersReducedMotion(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setLocalPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [context])

  // If in context, use context value; otherwise use local state
  if (context) {
    return context.prefersReducedMotion
  }

  return localPrefersReducedMotion
}

// ============================================================================
// Announcer Implementation
// ============================================================================
// Uses the shared aria.ts announcer for DOM manipulation
// A11yProvider adds debouncing and queue management on top

// ============================================================================
// Provider Component
// ============================================================================

/**
 * Accessibility Provider
 *
 * Provides centralized accessibility features:
 * - Reduced motion preference detection
 * - Screen reader announcements via live regions
 * - Announcement queue management
 *
 * @example
 * ```tsx
 * // Wrap your app
 * <A11yProvider>
 *   <App />
 * </A11yProvider>
 *
 * // In components
 * const { prefersReducedMotion, announce } = useA11y()
 * ```
 */
export function A11yProvider({
  children,
  forceReducedMotion,
  announceDebounce = 100,
}: A11yProviderProps) {
  // Reduced motion detection
  const [systemPrefersReducedMotion, setSystemPrefersReducedMotion] =
    React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setSystemPrefersReducedMotion(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setSystemPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const prefersReducedMotion = forceReducedMotion ?? systemPrefersReducedMotion

  // Announcement queue for tracking
  const [announcementQueue, setAnnouncementQueue] = React.useState<string[]>([])

  // Debounce timer ref
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const pendingAnnouncementRef = React.useRef<{
    message: string
    options?: AnnounceOptions
  } | null>(null)

  // Announce function - delegates to aria.ts with debouncing
  const announce = React.useCallback(
    (message: string, options?: AnnounceOptions) => {
      if (!message.trim()) return

      const { assertive = false, clearAfter = 1000 } = options || {}

      // Store pending announcement
      pendingAnnouncementRef.current = { message, options }

      // Clear existing debounce
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Debounce rapid announcements
      debounceTimerRef.current = setTimeout(() => {
        const pending = pendingAnnouncementRef.current
        if (!pending) return

        // Use shared aria.ts announcer for DOM manipulation
        ariaAnnounce(pending.message, {
          assertive,
          clearAfter: clearAfter > 0 ? clearAfter : undefined,
        })

        // Add to queue for tracking
        setAnnouncementQueue((prev) => [...prev.slice(-9), pending.message])

        pendingAnnouncementRef.current = null
      }, announceDebounce)
    },
    [announceDebounce]
  )

  // Clear announcements
  const clearAnnouncements = React.useCallback(() => {
    ariaClearAnnouncement()
    setAnnouncementQueue([])
  }, [])

  // Context value
  const value = React.useMemo<A11yContextValue>(
    () => ({
      prefersReducedMotion,
      announce,
      clearAnnouncements,
      announcementQueue,
    }),
    [prefersReducedMotion, announce, clearAnnouncements, announcementQueue]
  )

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>
}

A11yProvider.displayName = 'A11yProvider'

// ============================================================================
// Exports
// ============================================================================

export { A11yContext }
