'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to detect user's preference for reduced motion
 * Respects the prefers-reduced-motion media query
 * 
 * @returns boolean indicating if user prefers reduced motion
 * 
 * @example
 * ```tsx
 * const prefersReducedMotion = usePrefersReducedMotion()
 * if (prefersReducedMotion) {
 *   // Disable animations
 * }
 * ```
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    // Legacy browser fallback (IE11 and older)
    if ('addListener' in mediaQuery) {
      const legacyHandler = (mql: MediaQueryList) => {
        setPrefersReducedMotion(mql.matches)
      }
      // @ts-expect-error - Legacy API signature differs from modern API
      mediaQuery.addListener(legacyHandler)
      return () => {
        if ('removeListener' in mediaQuery) {
          // @ts-expect-error - Legacy API
          mediaQuery.removeListener(legacyHandler)
        }
      }
    }

    return () => {}
  }, [])

  return prefersReducedMotion
}
