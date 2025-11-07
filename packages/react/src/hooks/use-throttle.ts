import * as React from 'react'

export interface ThrottleOptions {
  /**
   * Invoke on the leading edge
   * @default true
   */
  leading?: boolean
  /**
   * Invoke on the trailing edge
   * @default true
   */
  trailing?: boolean
}

export interface ThrottledFunc<T extends (...args: any[]) => any> {
  /**
   * Call the throttled function
   */
  (...args: Parameters<T>): void
  /**
   * Cancel any pending invocations
   */
  cancel: () => void
  /**
   * Check if there's a pending invocation
   */
  pending: () => boolean
}

/**
 * Throttle a value - only updates at most once per delay period.
 * Ensures value updates are limited to a maximum frequency.
 * 
 * **How it works:**
 * - First change applies immediately
 * - Subsequent changes within delay period are ignored
 * - After delay period, next change applies immediately
 * 
 * **Use Cases:**
 * - Scroll position tracking
 * - Window resize handling
 * - Mouse movement tracking
 * - Real-time data updates
 * 
 * @template T - The type of value to throttle
 * @param {T} value - The value to throttle
 * @param {number} [delay=500] - Minimum time between updates in milliseconds
 * @returns {T} The throttled value
 * 
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
 * // throttledScrollY updates at most once per 100ms
 * ```
 */
export function useThrottle<T>(value: T, delay: number = 500): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value)
  const lastExecuted = React.useRef<number>(0)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    const now = Date.now()
    const timeSinceLastExecution = now - lastExecuted.current

    if (timeSinceLastExecution >= delay) {
      // Enough time has passed, update immediately
      setThrottledValue(value)
      lastExecuted.current = now
    } else {
      // Not enough time passed, schedule update for later
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      const remainingTime = delay - timeSinceLastExecution
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value)
        lastExecuted.current = Date.now()
      }, remainingTime)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, delay])

  return throttledValue
}

/**
 * Throttle a callback function - limits the frequency of function execution
 * to at most once per delay period. Fixes the previous implementation which
 * was actually a debounce.
 * 
 * **How it works:**
 * - First call executes immediately (leading edge)
 * - Subsequent calls within delay period are queued
 * - One final call executes after delay period (trailing edge)
 * 
 * **Use Cases:**
 * - Scroll event handlers
 * - Window resize handlers
 * - Button click spam prevention
 * - API rate limiting
 * 
 * @template T - The callback function type
 * @param {T} callback - The function to throttle
 * @param {number} [delay=500] - Minimum time between executions (default: 500ms)
 * @param {ThrottleOptions} [options] - Throttle behavior options
 * @returns {ThrottledFunc<T>} Throttled function with cancel method
 * 
 * @example Basic usage
 * ```tsx
 * const throttledResize = useThrottledCallback(
 *   () => console.log('Resized!'),
 *   200
 * )
 * 
 * useEffect(() => {
 *   window.addEventListener('resize', throttledResize)
 *   return () => {
 *     window.removeEventListener('resize', throttledResize)
 *     throttledResize.cancel()
 *   }
 * }, [throttledResize])
 * ```
 * 
 * @example With trailing edge disabled
 * ```tsx
 * const throttledClick = useThrottledCallback(
 *   handleClick,
 *   1000,
 *   { trailing: false }
 * )
 * // Only first click executes, subsequent clicks within 1s are ignored completely
 * ```
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500,
  options: ThrottleOptions = {}
): ThrottledFunc<T> {
  const { leading = true, trailing = true } = options

  // Store latest callback to avoid stale closures
  const callbackRef = React.useRef(callback)
  React.useLayoutEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const lastExecuted = React.useRef<number>(0)
  const timeoutRef = React.useRef<NodeJS.Timeout>()
  const lastArgsRef = React.useRef<Parameters<T>>()

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const cancel = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
    lastArgsRef.current = undefined
  }, [])

  const pending = React.useCallback(() => {
    return timeoutRef.current !== undefined
  }, [])

  const throttled = React.useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      const timeSinceLastExecution = now - lastExecuted.current

      lastArgsRef.current = args

      // Leading edge: execute immediately if enough time has passed
      if (timeSinceLastExecution >= delay) {
        if (leading) {
          try {
            callbackRef.current(...args)
          } catch (error) {
            console.error('[useThrottledCallback] Error in callback:', error)
            throw error
          }
        }
        lastExecuted.current = now
        lastArgsRef.current = undefined
        
        // Clear any pending trailing call
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = undefined
        }
      }
      // Trailing edge: schedule execution for later
      else if (trailing) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        const remainingTime = delay - timeSinceLastExecution
        timeoutRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            try {
              callbackRef.current(...lastArgsRef.current)
            } catch (error) {
              console.error('[useThrottledCallback] Error in callback:', error)
            }
          }
          lastExecuted.current = Date.now()
          timeoutRef.current = undefined
          lastArgsRef.current = undefined
        }, remainingTime)
      }
    },
    [delay, leading, trailing]
  )

  const throttledFunc = throttled as ThrottledFunc<T>
  throttledFunc.cancel = cancel
  throttledFunc.pending = pending

  return throttledFunc
}
