import * as React from 'react'

/**
 * Track media query matches with SSR support and no hydration mismatches.
 * 
 * **Features:**
 * - Zero hydration warnings (uses useSyncExternalStore)
 * - SSR-safe (server returns false, client hydrates correctly)
 * - Automatic cleanup
 * - Modern API only (2025 browsers)
 * 
 * **Use Cases:**
 * - Responsive rendering
 * - Dark mode detection
 * - Reduced motion preferences
 * - Print media detection
 * - Portrait/landscape orientation
 * 
 * **SSR Behavior:**
 * Returns `false` on server, then synchronizes with actual media query
 * on client without causing hydration warnings.
 * 
 * @param {string} query - Media query string (e.g., '(max-width: 768px)')
 * @param {boolean} [serverFallback=false] - Fallback value for SSR (default: false)
 * @returns {boolean} Whether the media query matches
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * const isDark = useMediaQuery('(prefers-color-scheme: dark)')
 * const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
 * const isPrint = useMediaQuery('print')
 * 
 * return isMobile ? <MobileNav /> : <DesktopNav />
 * ```
 * 
 * @example
 * ```tsx
 * // With custom server fallback (useful for mobile-first SSR)
 * const isMobile = useMediaQuery('(max-width: 768px)', true)
 * // Server will render mobile version, avoiding layout shift
 * ```
 */
export function useMediaQuery(query: string, serverFallback: boolean = false): boolean {
  const getSnapshot = React.useCallback((): boolean => {
    if (typeof window === 'undefined') return serverFallback
    return window.matchMedia(query).matches
  }, [query, serverFallback])

  const getServerSnapshot = React.useCallback((): boolean => {
    return serverFallback
  }, [serverFallback])

  const subscribe = React.useCallback(
    (callback: () => void) => {
      if (typeof window === 'undefined') {
        // No-op on server
        return () => {}
      }

      const mediaQuery = window.matchMedia(query)
      
      // Use modern addEventListener API (supported in all 2025 browsers)
      mediaQuery.addEventListener('change', callback)
      
      return () => {
        mediaQuery.removeEventListener('change', callback)
      }
    },
    [query]
  )

  // Use useSyncExternalStore for SSR-safe, hydration-mismatch-free implementation
  const matches = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return matches
}

/**
 * Get current breakpoint based on Tailwind's defaults
 * 
 * @example
 * ```tsx
 * const breakpoint = useBreakpoint()
 * 
 * // Returns: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'base'
 * return breakpoint === 'md' ? <TabletView /> : <MobileView />
 * ```
 */
export function useBreakpoint(): 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' {
  const is2xl = useMediaQuery('(min-width: 1536px)')
  const isXl = useMediaQuery('(min-width: 1280px)')
  const isLg = useMediaQuery('(min-width: 1024px)')
  const isMd = useMediaQuery('(min-width: 768px)')
  const isSm = useMediaQuery('(min-width: 640px)')

  if (is2xl) return '2xl'
  if (isXl) return 'xl'
  if (isLg) return 'lg'
  if (isMd) return 'md'
  if (isSm) return 'sm'
  return 'base'
}
