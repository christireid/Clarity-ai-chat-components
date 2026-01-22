'use client'

import { useEffect, useState } from 'react'
import type { UseWebGLAvailableReturn } from '../HeroParticles.types'

/**
 * Hook to detect WebGL availability
 * Performs a lightweight check for WebGL support
 *
 * @returns Object containing WebGL availability info
 *
 * @example
 * ```tsx
 * const { isAvailable, version, isChecked } = useWebGLAvailable()
 * if (isChecked && !isAvailable) {
 *   return <FallbackGradient />
 * }
 * ```
 */
export function useWebGLAvailable(): UseWebGLAvailableReturn {
  const [state, setState] = useState<UseWebGLAvailableReturn>({
    isAvailable: false,
    version: 0,
    isChecked: false,
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const checkWebGL = (): { available: boolean; version: 0 | 1 | 2 } => {
      try {
        const canvas = document.createElement('canvas')

        // Try WebGL2 first
        const gl2 =
          canvas.getContext('webgl2') ||
          canvas.getContext('experimental-webgl2')

        if (gl2) {
          return { available: true, version: 2 }
        }

        // Fall back to WebGL1
        const gl1 =
          canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

        if (gl1) {
          return { available: true, version: 1 }
        }

        return { available: false, version: 0 }
      } catch {
        return { available: false, version: 0 }
      }
    }

    const result = checkWebGL()
    setState({
      isAvailable: result.available,
      version: result.version,
      isChecked: true,
    })
  }, [])

  return state
}
