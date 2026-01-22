'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Configuration for adaptive quality system
 */
export interface AdaptiveQualityConfig {
  /** Target FPS to maintain (default: 55) */
  targetFps?: number
  /** Minimum quality level as percentage (default: 30) */
  minQuality?: number
  /** Quality reduction step as percentage (default: 10) */
  qualityStep?: number
  /** How often to measure FPS in ms (default: 1000) */
  measurementInterval?: number
  /** Quality level below which effects should be disabled (default: 50) */
  effectsDisableThreshold?: number
}

/**
 * Return type for useAdaptiveQuality hook
 */
export interface UseAdaptiveQualityReturn {
  /** Current quality level (0-100) */
  qualityLevel: number
  /** Current smoothed FPS */
  currentFps: number
  /** Whether effects should be disabled for performance */
  shouldDisableEffects: boolean
  /** Whether quality is currently recovering */
  isRecovering: boolean
}

/**
 * Hook for adaptive quality management based on real-time FPS
 * Automatically reduces quality when performance drops
 *
 * @param config - Configuration options
 * @returns Quality state
 *
 * @example
 * ```tsx
 * const { qualityLevel, shouldDisableEffects } = useAdaptiveQuality({
 *   targetFps: 55,
 *   minQuality: 30,
 * })
 * ```
 */
export function useAdaptiveQuality(
  config: AdaptiveQualityConfig = {}
): UseAdaptiveQualityReturn {
  const {
    targetFps = 55,
    minQuality = 30,
    qualityStep = 10,
    measurementInterval = 1000,
    effectsDisableThreshold = 50,
  } = config

  const [qualityLevel, setQualityLevel] = useState(100)
  const [currentFps, setCurrentFps] = useState(60)
  const [isRecovering, setIsRecovering] = useState(false)

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const goodFramesRef = useRef(0)
  const rafIdRef = useRef<number | null>(null)

  // FPS measurement loop
  useEffect(() => {
    let isRunning = true

    const measureFrame = (currentTime: number) => {
      if (!isRunning) return

      frameCountRef.current++

      const elapsed = currentTime - lastTimeRef.current

      if (elapsed >= measurementInterval) {
        const measuredFps = (frameCountRef.current / elapsed) * 1000
        setCurrentFps(Math.round(measuredFps))

        // Adjust quality based on FPS
        if (measuredFps < targetFps) {
          // Performance is suffering - reduce quality
          goodFramesRef.current = 0
          setIsRecovering(false)

          setQualityLevel((prev) => {
            const newQuality = Math.max(minQuality, prev - qualityStep)
            return newQuality
          })
        } else {
          // Performance is good - maybe recover
          goodFramesRef.current++

          if (goodFramesRef.current > 3) {
            // After 3 good measurement periods, try recovering
            setIsRecovering(true)

            setQualityLevel((prev) => {
              if (prev < 100) {
                return Math.min(100, prev + qualityStep / 2)
              }
              return prev
            })
          }
        }

        // Reset for next measurement
        frameCountRef.current = 0
        lastTimeRef.current = currentTime
      }

      rafIdRef.current = requestAnimationFrame(measureFrame)
    }

    rafIdRef.current = requestAnimationFrame(measureFrame)

    return () => {
      isRunning = false
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [targetFps, minQuality, qualityStep, measurementInterval])

  const shouldDisableEffects = qualityLevel < effectsDisableThreshold

  return {
    qualityLevel,
    currentFps,
    shouldDisableEffects,
    isRecovering,
  }
}
