import * as React from 'react'

/**
 * Throttle a value - only updates at most once per delay period.
 * Ensures the value updates at most once per delay period, using a trailing
 * edge approach. Great for performance-critical updates like scroll or resize.
 * 
 * **Features:**
 * - Guaranteed execution interval
 * - Proper cleanup on unmount
 * - Memory efficient
 * - Accurate timing
 * 
 * **Use Cases:**
 * - Scroll position tracking
 * - Mouse movement
 * - Window resize
 * - Real-time metrics
 * 
 * @template T - Type of value to throttle
 * @param {T} value - Value to throttle
 * @param {number} [delay=500] - Minimum delay between updates in milliseconds
 * @returns {T} Throttled value
 * @example
 * ```tsx
 * const [scrollY, setScrollY] = useState(0)
 * const throttledScrollY = useThrottle(scrollY, 100)
 * 
 * useEffect(() => {
 *   const handleScroll = () => setScrollY(window.scrollY)
 *   window.addEventListener('scroll', handleScroll)
 *   return () => window.removeEventListener('scroll', handleScroll)
 * }, [])
 * 
 * // throttledScrollY updates at most every 100ms
 * return <div>Scroll: {throttledScrollY}px</div>
 * ```
 */
export function useThrottle<T>(value: T, delay: number = 500): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value)
  const lastRan = React.useRef<number>(Date.now())
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    const now = Date.now()
    const timeSinceLastRan = now - lastRan.current

    if (timeSinceLastRan >= delay) {
      // Enough time has passed, update immediately
      setThrottledValue(value)
      lastRan.current = now
    } else {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      // Schedule update for remaining time
      const remainingTime = Math.max(0, delay - timeSinceLastRan)
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value)
        lastRan.current = Date.now()
        timeoutRef.current = null
      }, remainingTime)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [value, delay])

  return throttledValue
}

export interface ThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  cancel: () => void
  flush: () => void
}

export interface UseThrottledCallbackOptions {
  /**
   * Execute on the leading edge (immediately on first call)
   * @default false
   */
  leading?: boolean
  /**
   * Execute on the trailing edge (after delay)
   * @default true
   */
  trailing?: boolean
}

/**
 * Throttle a callback function with leading/trailing edge control.
 * Returns a throttled function with cancel and flush capabilities.
 * 
 * **Features:**
 * - Leading and trailing edge execution options
 * - Manual cancel and flush methods
 * - Proper cleanup on unmount
 * - Accurate timing with no race conditions
 * 
 * **Use Cases:**
 * - Event handlers (scroll, resize, mouse)
 * - API calls on user interaction
 * - Animation frame updates
 * - Real-time validation
 * 
 * @template T - Callback function type
 * @param {T} callback - Function to throttle
 * @param {number} [delay=500] - Throttle delay in milliseconds
 * @param {UseThrottledCallbackOptions} [options] - Throttle options
 * @returns {ThrottledFunction<T>} Throttled function with cancel/flush methods
 * @example
 * ```tsx
 * const throttledResize = useThrottledCallback(
 *   (width: number) => console.log('Width:', width),
 *   200,
 *   { leading: true, trailing: true }
 * )
 * 
 * useEffect(() => {
 *   const handleResize = () => throttledResize(window.innerWidth)
 *   window.addEventListener('resize', handleResize)
 *   return () => {
 *     throttledResize.cancel() // Cancel pending calls
 *     window.removeEventListener('resize', handleResize)
 *   }
 * }, [throttledResize])
 * 
 * // Manual flush before unmount
 * return () => throttledResize.flush()
 * ```
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500,
  options: UseThrottledCallbackOptions = {}
): ThrottledFunction<T> {
  const { leading = false, trailing = true } = options
  
  const lastRan = React.useRef<number>(0)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const lastArgsRef = React.useRef<Parameters<T> | null>(null)
  const callbackRef = React.useRef(callback)

  // Keep callback ref updated
  React.useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  const cancel = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    lastArgsRef.current = null
  }, [])

  const flush = React.useCallback(() => {
    if (timeoutRef.current && lastArgsRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      callbackRef.current(...lastArgsRef.current)
      lastArgsRef.current = null
      lastRan.current = Date.now()
    }
  }, [])

  const throttled = React.useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      const timeSinceLastRan = now - lastRan.current

      // Store args for potential trailing call
      lastArgsRef.current = args

      if (timeSinceLastRan >= delay) {
        // Enough time passed - execute immediately if leading is true
        if (leading) {
          callbackRef.current(...args)
          lastRan.current = now
          lastArgsRef.current = null
        }
        
        // Set up trailing call if enabled and leading was executed
        if (trailing && leading) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          timeoutRef.current = setTimeout(() => {
            if (lastArgsRef.current) {
              callbackRef.current(...lastArgsRef.current)
              lastArgsRef.current = null
            }
            lastRan.current = Date.now()
            timeoutRef.current = null
          }, delay)
        }
        
        // If only trailing, just execute now
        if (trailing && !leading) {
          callbackRef.current(...args)
          lastRan.current = now
          lastArgsRef.current = null
        }
      } else {
        // Not enough time passed - schedule trailing call if enabled
        if (trailing) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          const remainingTime = Math.max(0, delay - timeSinceLastRan)
          timeoutRef.current = setTimeout(() => {
            if (lastArgsRef.current) {
              callbackRef.current(...lastArgsRef.current)
              lastArgsRef.current = null
            }
            lastRan.current = Date.now()
            timeoutRef.current = null
          }, remainingTime)
        }
      }
    },
    [delay, leading, trailing]
  )

  // Attach cancel and flush to the throttled function
  const throttledWithMethods = throttled as ThrottledFunction<T>
  throttledWithMethods.cancel = cancel
  throttledWithMethods.flush = flush

  return throttledWithMethods
}
