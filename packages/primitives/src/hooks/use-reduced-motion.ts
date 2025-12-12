'use client'

import * as React from 'react'

/**
 * Media query for reduced motion preference
 */
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Hook to detect if user prefers reduced motion
 *
 * @description
 * Returns true if the user has enabled reduced motion in their system settings.
 * This should be used to disable or simplify animations for users who may
 * experience motion sickness or other vestibular disorders.
 *
 * The hook is reactive - it will update if the user changes their system preference.
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 *
 * const transition = prefersReducedMotion
 *   ? { duration: 0 }
 *   : { type: 'spring', stiffness: 400, damping: 30 }
 *
 * return <motion.div transition={transition} />
 * ```
 *
 * @see {@link https://www.joshwcomeau.com/react/prefers-reduced-motion/} Josh Comeau's guide
 * @see {@link https://www.w3.org/WAI/WCAG21/Techniques/css/C39} WCAG C39 technique
 *
 * @returns boolean - true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  // Default to no preference for SSR
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    // SSR safety check
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Modern browsers use addEventListener, older browsers use addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  return prefersReducedMotion
}

/**
 * Get reduced motion preference synchronously (for SSR/initial render)
 *
 * @description
 * Returns true if reduced motion is preferred. Safe to call during SSR
 * (returns false on server). Use this for initial render to avoid flash.
 *
 * @returns boolean - true if user prefers reduced motion
 */
export function getReducedMotionPreference(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}
