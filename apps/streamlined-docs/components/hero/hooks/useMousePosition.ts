'use client'

import { useCallback, useRef } from 'react'
import type { MousePosition, UseMousePositionReturn } from '../HeroParticles.types'

/**
 * Hook to track mouse position in Normalized Device Coordinates (NDC)
 * Converts screen coordinates to -1 to 1 range for Three.js
 *
 * @returns Object containing mouse ref and event handlers
 *
 * @example
 * ```tsx
 * const { mouseRef, handleMouseMove, handleMouseLeave } = useMousePosition()
 * return (
 *   <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
 *     <Canvas>
 *       <ParticleField mouseRef={mouseRef} />
 *     </Canvas>
 *   </div>
 * )
 * ```
 */
export function useMousePosition(): UseMousePositionReturn {
  const mouseRef = useRef<MousePosition>({
    x: 0,
    y: 0,
    isActive: false,
  })

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()

      // Convert to NDC (-1 to 1)
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      if (mouseRef.current) {
        mouseRef.current.x = x
        mouseRef.current.y = y
        mouseRef.current.isActive = true
      }
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    if (mouseRef.current) {
      mouseRef.current.isActive = false
    }
  }, [])

  return {
    mouseRef,
    handleMouseMove,
    handleMouseLeave,
  }
}
