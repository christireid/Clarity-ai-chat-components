import * as React from 'react'

/**
 * Throttle a value - only updates at most once per delay period.
 * Unlike debounce, throttle ensures the value updates at regular intervals
 * while the source value is changing.
 * 
 * **Use Cases:**
 * - Scroll position tracking
 * - Mouse move events
 * - Window resize handlers
 * - Real-time input with rate limiting
 * 
 * @template T - The type of value to throttle
 * @param {T} value - The value to throttle
 * @param {number} [delay=500] - Delay in milliseconds (default: 500ms)
 * @returns {T} The throttled value
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
 * ```
 */
export function useThrottle<T>(value: T, delay: number = 500): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value)
  const lastRan = React.useRef<number>(Date.now())
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    const now = Date.now()
    const timeSinceLastRun = now - lastRan.current

    // If enough time has passed, update immediately
    if (timeSinceLastRun >= delay) {
      setThrottledValue(value)
      lastRan.current = now
    } else {
      // Otherwise, schedule an update for the remaining time
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value)
        lastRan.current = Date.now()
      }, delay - timeSinceLastRun)
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
 * Throttle a callback function - creates a throttled version that executes
 * at most once per delay period, ensuring the last call is executed.
 * 
 * **Use Cases:**
 * - Resize handlers
 * - Scroll event handlers
 * - API calls with rate limiting
 * - Input handlers that need regular updates
 * 
 * @template T - The callback function type
 * @param {T} callback - The function to throttle
 * @param {number} [delay=500] - Delay in milliseconds (default: 500ms)
 * @returns {(...args: Parameters<T>) => void} Throttled version of the callback
 * @example
 * ```tsx
 * const throttledResize = useThrottledCallback(
 *   () => console.log('Resized!'),
 *   200
 * )
 * 
 * useEffect(() => {
 *   window.addEventListener('resize', throttledResize)
 *   return () => window.removeEventListener('resize', throttledResize)
 * }, [throttledResize])
 * ```
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const lastRan = React.useRef<number>(0)
  const timeoutRef = React.useRef<NodeJS.Timeout>()
  const savedCallback = React.useRef(callback)

  // Always use the latest callback
  React.useLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return React.useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      const timeSinceLastRun = now - lastRan.current

      if (timeSinceLastRun >= delay) {
        // Execute immediately if enough time has passed
        savedCallback.current(...args)
        lastRan.current = now
      } else {
        // Schedule execution for remaining time, canceling any pending execution
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        timeoutRef.current = setTimeout(() => {
          savedCallback.current(...args)
          lastRan.current = Date.now()
        }, delay - timeSinceLastRun)
      }
    },
    [delay]
  )
}
