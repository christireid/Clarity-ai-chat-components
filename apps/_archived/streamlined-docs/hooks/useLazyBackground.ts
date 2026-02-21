'use client'

import { useEffect, useState } from 'react'

interface LazyBackgroundOptions {
  minViewportWidth?: number
  checkReducedMotion?: boolean
  checkNetworkSpeed?: boolean
  delayMs?: number
}

/**
 * Hook to determine if a heavy background animation should be loaded
 *
 * Checks:
 * - Viewport size (skip on mobile)
 * - Reduced motion preference (accessibility)
 * - Network speed (skip on slow connections)
 * - Delayed loading (after initial render)
 *
 * @example
 * ```tsx
 * const shouldLoad = useLazyBackground({
 *   minViewportWidth: 768,
 *   checkReducedMotion: true,
 *   delayMs: 1000
 * })
 * ```
 */
export function useLazyBackground(options: LazyBackgroundOptions = {}) {
  const {
    minViewportWidth = 1024, // Desktop only - 1024px instead of 768px
    checkReducedMotion = true,
    checkNetworkSpeed = true,
    delayMs = 1000,
  } = options

  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Wait for initial render to complete
    const timer = setTimeout(() => {
      // Check viewport size
      if (window.innerWidth < minViewportWidth) {
        return
      }

      // Check reduced motion preference
      if (checkReducedMotion) {
        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches
        if (prefersReducedMotion) {
          return
        }
      }

      // Check network speed (if supported)
      if (checkNetworkSpeed && 'connection' in navigator) {
        const connection = (navigator as any).connection
        const effectiveType = connection?.effectiveType

        // Skip on slow connections
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          return
        }
      }

      // All checks passed - load the background
      setShouldLoad(true)
    }, delayMs)

    return () => clearTimeout(timer)
  }, [minViewportWidth, checkReducedMotion, checkNetworkSpeed, delayMs])

  return shouldLoad
}
