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
    if (typeof window === 'undefined') {
      return () => {}
    }

    let cleanup: (() => void) | undefined

    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches)
      }

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
        cleanup = () => {
          mediaQuery.removeEventListener('change', handleChange)
        }
      } else if ('addListener' in mediaQuery) {
        // Legacy browser fallback (IE11 and older)
        const legacyHandler = (mql: MediaQueryList) => {
          setPrefersReducedMotion(mql.matches)
        }
        // @ts-expect-error - Legacy API signature differs from modern API
        mediaQuery.addListener(legacyHandler)
        cleanup = () => {
          if ('removeListener' in mediaQuery) {
            // @ts-expect-error - Legacy API
            mediaQuery.removeListener(legacyHandler)
          }
        }
      }
    } catch (error) {
      // If matchMedia fails, default to no reduced motion
      setPrefersReducedMotion(false)
    }

    // Always return a cleanup function
    return cleanup || (() => {})
  }, [])

  return prefersReducedMotion
}
