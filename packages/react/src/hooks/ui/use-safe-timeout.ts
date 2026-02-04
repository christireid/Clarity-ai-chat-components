'use client'

import { useCallback, useEffect, useRef } from 'react'

/**
 * Return type for useSafeTimeout hook
 */
export interface UseSafeTimeoutReturn {
  /**
   * Set a timeout that will be automatically cleaned up on unmount
   * @param callback - Function to execute after delay
   * @param delay - Delay in milliseconds
   * @returns Timeout ID that can be used to clear the timeout
   */
  setSafeTimeout: (
    callback: () => void,
    delay: number
  ) => ReturnType<typeof setTimeout>

  /**
   * Clear a specific timeout by ID
   * @param id - Timeout ID returned from setSafeTimeout
   */
  clearSafeTimeout: (id: ReturnType<typeof setTimeout>) => void

  /**
   * Clear all active timeouts
   */
  clearAllTimeouts: () => void
}

/**
 * Hook for managing timeouts with automatic cleanup on unmount
 *
 * This hook solves the common memory leak pattern where setTimeout callbacks
 * fire after a component unmounts, potentially causing "setState on unmounted
 * component" warnings or other issues.
 *
 * @returns Object with setSafeTimeout, clearSafeTimeout, and clearAllTimeouts functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { setSafeTimeout, clearSafeTimeout } = useSafeTimeout()
 *
 *   const handleClick = () => {
 *     setSafeTimeout(() => {
 *       // This won't fire if component unmounts
 *       setShowMessage(false)
 *     }, 3000)
 *   }
 *
 *   return <button onClick={handleClick}>Show Message</button>
 * }
 * ```
 */
export function useSafeTimeout(): UseSafeTimeoutReturn {
  const timeoutIds = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  const setSafeTimeout = useCallback((callback: () => void, delay: number) => {
    const id = setTimeout(() => {
      timeoutIds.current.delete(id)
      callback()
    }, delay)
    timeoutIds.current.add(id)
    return id
  }, [])

  const clearSafeTimeout = useCallback((id: ReturnType<typeof setTimeout>) => {
    clearTimeout(id)
    timeoutIds.current.delete(id)
  }, [])

  const clearAllTimeouts = useCallback(() => {
    timeoutIds.current.forEach(clearTimeout)
    timeoutIds.current.clear()
  }, [])

  // Cleanup all timeouts on unmount
  useEffect(() => {
    const currentIds = timeoutIds.current
    return () => {
      currentIds.forEach(clearTimeout)
      currentIds.clear()
    }
  }, [])

  return { setSafeTimeout, clearSafeTimeout, clearAllTimeouts }
}

/**
 * Return type for useSafeInterval hook
 */
export interface UseSafeIntervalReturn {
  /**
   * Set an interval that will be automatically cleaned up on unmount
   * @param callback - Function to execute repeatedly
   * @param delay - Interval delay in milliseconds
   * @returns Interval ID that can be used to clear the interval
   */
  setSafeInterval: (
    callback: () => void,
    delay: number
  ) => ReturnType<typeof setInterval>

  /**
   * Clear a specific interval by ID
   * @param id - Interval ID returned from setSafeInterval
   */
  clearSafeInterval: (id: ReturnType<typeof setInterval>) => void

  /**
   * Clear all active intervals
   */
  clearAllIntervals: () => void
}

/**
 * Hook for managing intervals with automatic cleanup on unmount
 *
 * @returns Object with setSafeInterval, clearSafeInterval, and clearAllIntervals functions
 *
 * @example
 * ```tsx
 * function PollingComponent() {
 *   const { setSafeInterval } = useSafeInterval()
 *
 *   useEffect(() => {
 *     setSafeInterval(() => {
 *       // This won't fire after unmount
 *       fetchData()
 *     }, 5000)
 *   }, [setSafeInterval])
 * }
 * ```
 */
export function useSafeInterval(): UseSafeIntervalReturn {
  const intervalIds = useRef<Set<ReturnType<typeof setInterval>>>(new Set())

  const setSafeInterval = useCallback((callback: () => void, delay: number) => {
    const id = setInterval(callback, delay)
    intervalIds.current.add(id)
    return id
  }, [])

  const clearSafeInterval = useCallback(
    (id: ReturnType<typeof setInterval>) => {
      clearInterval(id)
      intervalIds.current.delete(id)
    },
    []
  )

  const clearAllIntervals = useCallback(() => {
    intervalIds.current.forEach(clearInterval)
    intervalIds.current.clear()
  }, [])

  // Cleanup all intervals on unmount
  useEffect(() => {
    const currentIds = intervalIds.current
    return () => {
      currentIds.forEach(clearInterval)
      currentIds.clear()
    }
  }, [])

  return { setSafeInterval, clearSafeInterval, clearAllIntervals }
}

/**
 * Return type for useSafeAnimationFrame hook
 */
export interface UseSafeAnimationFrameReturn {
  /**
   * Request an animation frame that will be automatically cleaned up on unmount
   * @param callback - Function to execute on next frame
   * @returns Frame ID that can be used to cancel
   */
  requestSafeAnimationFrame: (callback: FrameRequestCallback) => number

  /**
   * Cancel a specific animation frame by ID
   * @param id - Frame ID returned from requestSafeAnimationFrame
   */
  cancelSafeAnimationFrame: (id: number) => void

  /**
   * Cancel all pending animation frames
   */
  cancelAllAnimationFrames: () => void
}

/**
 * Hook for managing requestAnimationFrame with automatic cleanup on unmount
 *
 * @returns Object with requestSafeAnimationFrame, cancelSafeAnimationFrame, and cancelAllAnimationFrames
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const { requestSafeAnimationFrame } = useSafeAnimationFrame()
 *
 *   const animate = () => {
 *     // Animation logic
 *     requestSafeAnimationFrame(animate)
 *   }
 *
 *   useEffect(() => {
 *     requestSafeAnimationFrame(animate)
 *   }, [requestSafeAnimationFrame])
 * }
 * ```
 */
export function useSafeAnimationFrame(): UseSafeAnimationFrameReturn {
  const frameIds = useRef<Set<number>>(new Set())

  const requestSafeAnimationFrame = useCallback(
    (callback: FrameRequestCallback) => {
      const id = requestAnimationFrame((time) => {
        frameIds.current.delete(id)
        callback(time)
      })
      frameIds.current.add(id)
      return id
    },
    []
  )

  const cancelSafeAnimationFrame = useCallback((id: number) => {
    cancelAnimationFrame(id)
    frameIds.current.delete(id)
  }, [])

  const cancelAllAnimationFrames = useCallback(() => {
    frameIds.current.forEach(cancelAnimationFrame)
    frameIds.current.clear()
  }, [])

  // Cleanup all frames on unmount
  useEffect(() => {
    const currentIds = frameIds.current
    return () => {
      currentIds.forEach(cancelAnimationFrame)
      currentIds.clear()
    }
  }, [])

  return {
    requestSafeAnimationFrame,
    cancelSafeAnimationFrame,
    cancelAllAnimationFrames,
  }
}
