'use client'

import { useCallback, useRef, useEffect } from 'react'
import type { InteractionState, UseInteractionReturn } from '../HeroParticles.types'

/** Interpolation speed for smooth mouse following (lower = smoother) */
const INTERPOLATION_SPEED = 0.1

/** How long touch interaction remains active after touch end (ms) */
const TOUCH_FADE_DURATION = 500

/**
 * Hook to track mouse and touch interaction with smooth interpolation
 * Provides unified interaction handling for both desktop and mobile
 *
 * @returns Object containing interaction ref and event handlers
 *
 * @example
 * ```tsx
 * const { interactionRef, handleMouseMove, handleMouseLeave, handleTouchStart, handleTouchMove, handleTouchEnd } = useInteraction()
 * return (
 *   <div
 *     onMouseMove={handleMouseMove}
 *     onMouseLeave={handleMouseLeave}
 *     onTouchStart={handleTouchStart}
 *     onTouchMove={handleTouchMove}
 *     onTouchEnd={handleTouchEnd}
 *   >
 *     <Canvas>
 *       <ParticleField interactionRef={interactionRef} />
 *     </Canvas>
 *   </div>
 * )
 * ```
 */
export function useInteraction(): UseInteractionReturn {
  const interactionRef = useRef<InteractionState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isActive: false,
    source: 'none',
  })

  const touchFadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Smooth interpolation loop
  useEffect(() => {
    let isRunning = true

    const interpolate = () => {
      if (!isRunning) return

      const state = interactionRef.current
      if (state) {
        // Lerp current position towards target
        state.x += (state.targetX - state.x) * INTERPOLATION_SPEED
        state.y += (state.targetY - state.y) * INTERPOLATION_SPEED
      }

      animationFrameRef.current = requestAnimationFrame(interpolate)
    }

    interpolate()

    return () => {
      isRunning = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (touchFadeTimeoutRef.current) {
        clearTimeout(touchFadeTimeoutRef.current)
      }
    }
  }, [])

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()

      // Convert to NDC (-1 to 1)
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      if (interactionRef.current) {
        interactionRef.current.targetX = x
        interactionRef.current.targetY = y
        interactionRef.current.isActive = true
        interactionRef.current.source = 'mouse'
      }
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    if (interactionRef.current) {
      interactionRef.current.isActive = false
      interactionRef.current.source = 'none'
    }
  }, [])

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      // Clear any existing fade timeout
      if (touchFadeTimeoutRef.current) {
        clearTimeout(touchFadeTimeoutRef.current)
        touchFadeTimeoutRef.current = null
      }

      if (event.touches.length > 0) {
        const touch = event.touches[0]
        const rect = event.currentTarget.getBoundingClientRect()

        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1
        const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1

        if (interactionRef.current) {
          // Set both target and current for immediate response
          interactionRef.current.targetX = x
          interactionRef.current.targetY = y
          interactionRef.current.x = x
          interactionRef.current.y = y
          interactionRef.current.isActive = true
          interactionRef.current.source = 'touch'
        }
      }
    },
    []
  )

  const handleTouchMove = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0]
        const rect = event.currentTarget.getBoundingClientRect()

        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1
        const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1

        if (interactionRef.current) {
          interactionRef.current.targetX = x
          interactionRef.current.targetY = y
          interactionRef.current.isActive = true
          interactionRef.current.source = 'touch'
        }
      }
    },
    []
  )

  const handleTouchEnd = useCallback(() => {
    // Fade out touch interaction gradually
    touchFadeTimeoutRef.current = setTimeout(() => {
      if (interactionRef.current) {
        interactionRef.current.isActive = false
        interactionRef.current.source = 'none'
      }
    }, TOUCH_FADE_DURATION)
  }, [])

  return {
    interactionRef,
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
