'use client'

import { useCallback, useEffect, useState } from 'react'
import { PARTICLE_COUNTS } from '../particle-config'
import type { UseResponsiveParticlesReturn } from '../HeroParticles.types'

/**
 * Hook to compute responsive particle count based on viewport
 * Automatically adjusts particle count for optimal performance on different devices
 *
 * @param customCount - Optional override for particle count
 * @returns Object containing computed particle count and device info
 *
 * @example
 * ```tsx
 * const { count, shouldRender, device } = useResponsiveParticles()
 * if (!shouldRender) return null
 * ```
 */
export function useResponsiveParticles(
  customCount?: number
): UseResponsiveParticlesReturn {
  const [state, setState] = useState<UseResponsiveParticlesReturn>({
    count: customCount ?? PARTICLE_COUNTS.desktop,
    shouldRender: false, // Start with false for SSR safety
    device: 'desktop',
  })

  const calculateConfig = useCallback((): UseResponsiveParticlesReturn => {
    if (typeof window === 'undefined') {
      return {
        count: customCount ?? PARTICLE_COUNTS.desktop,
        shouldRender: false,
        device: 'desktop',
      }
    }

    const width = window.innerWidth

    // Don't render on very small viewports
    if (width < PARTICLE_COUNTS.minViewportWidth) {
      return {
        count: 0,
        shouldRender: false,
        device: 'mobile',
      }
    }

    // Determine device category and particle count
    if (width >= 1024) {
      return {
        count: customCount ?? PARTICLE_COUNTS.desktop,
        shouldRender: true,
        device: 'desktop',
      }
    }

    if (width >= 768) {
      return {
        count: customCount ?? PARTICLE_COUNTS.tablet,
        shouldRender: true,
        device: 'tablet',
      }
    }

    return {
      count: customCount ?? PARTICLE_COUNTS.mobile,
      shouldRender: true,
      device: 'mobile',
    }
  }, [customCount])

  useEffect(() => {
    // Initial calculation
    setState(calculateConfig())

    // Debounced resize handler
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        setState(calculateConfig())
      }, 150)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [calculateConfig])

  return state
}
