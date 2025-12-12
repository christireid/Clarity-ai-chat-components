'use client'

import * as React from 'react'

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

interface AnnouncerElement {
  polite: HTMLDivElement | null
  assertive: HTMLDivElement | null
}

function createAnnouncerElements(): AnnouncerElement {
  // Check for existing announcer
  const existingPolite = document.getElementById(
    'a11y-announcer-polite'
  ) as HTMLDivElement | null
  const existingAssertive = document.getElementById(
    'a11y-announcer-assertive'
  ) as HTMLDivElement | null

  if (existingPolite && existingAssertive) {
    return { polite: existingPolite, assertive: existingAssertive }
  }

  // Create container
  const container = document.createElement('div')
  container.id = 'a11y-announcer-root'
  container.setAttribute('aria-hidden', 'false')
  Object.assign(container.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  })

  // Create polite region
  const polite = document.createElement('div')
  polite.id = 'a11y-announcer-polite'
  polite.setAttribute('role', 'status')
  polite.setAttribute('aria-live', 'polite')
  polite.setAttribute('aria-atomic', 'true')

  // Create assertive region
  const assertive = document.createElement('div')
  assertive.id = 'a11y-announcer-assertive'
  assertive.setAttribute('role', 'alert')
  assertive.setAttribute('aria-live', 'assertive')
  assertive.setAttribute('aria-atomic', 'true')

  container.appendChild(polite)
  container.appendChild(assertive)
  document.body.appendChild(container)

  return { polite, assertive }
}

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

  // Announcer elements (singleton)
  const announcerRef = React.useRef<AnnouncerElement | null>(null)

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

  // Initialize announcer on mount
  React.useEffect(() => {
    announcerRef.current = createAnnouncerElements()

    return () => {
      // Cleanup on unmount (optional - could leave for other providers)
      const root = document.getElementById('a11y-announcer-root')
      if (root) {
        root.remove()
      }
      announcerRef.current = null
    }
  }, [])

  // Announce function
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
        if (!pending || !announcerRef.current) return

        const element = assertive
          ? announcerRef.current.assertive
          : announcerRef.current.polite

        if (element) {
          // Clear first to ensure re-announcement of same message
          element.textContent = ''

          // Use RAF to ensure DOM update
          requestAnimationFrame(() => {
            if (element) {
              element.textContent = pending.message
            }
          })

          // Add to queue for tracking
          setAnnouncementQueue((prev) => [...prev.slice(-9), pending.message])

          // Auto-clear after delay
          if (clearAfter > 0) {
            setTimeout(() => {
              if (element) {
                element.textContent = ''
              }
            }, clearAfter)
          }
        }

        pendingAnnouncementRef.current = null
      }, announceDebounce)
    },
    [announceDebounce]
  )

  // Clear announcements
  const clearAnnouncements = React.useCallback(() => {
    if (announcerRef.current) {
      if (announcerRef.current.polite) {
        announcerRef.current.polite.textContent = ''
      }
      if (announcerRef.current.assertive) {
        announcerRef.current.assertive.textContent = ''
      }
    }
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
