import * as React from 'react'

/**
 * Throttle a value - only updates at most once per delay period
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
 * ```
 */
export function useThrottle<T>(value: T, delay: number = 500): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value)
  const lastRan = React.useRef<number>(Date.now())
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    const now = Date.now()
    const timeSinceLastRun = now - lastRan.current
    const remainingTime = delay - timeSinceLastRun

    // If enough time has passed, update immediately
    if (remainingTime <= 0) {
      setThrottledValue(value)
      lastRan.current = now
      return
    }

    // Otherwise, schedule update for remaining time
    timeoutRef.current = setTimeout(() => {
      setThrottledValue(value)
      lastRan.current = Date.now()
    }, remainingTime)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, delay])

  return throttledValue
}

/**
 * Throttle a callback function
 * 
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
  const lastRan = React.useRef<number>(Date.now())
  const timeoutRef = React.useRef<NodeJS.Timeout>()
  const callbackRef = React.useRef(callback)

  // Keep callback ref up to date
  React.useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Cleanup timeout on unmount
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
      const remainingTime = delay - timeSinceLastRun

      // If enough time has passed, execute immediately
      if (remainingTime <= 0) {
        callbackRef.current(...args)
        lastRan.current = now
        // Clear any pending timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = undefined
        }
      } else {
        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        // Schedule execution for remaining time
        timeoutRef.current = setTimeout(() => {
          callbackRef.current(...args)
          lastRan.current = Date.now()
          timeoutRef.current = undefined
        }, remainingTime)
      }
    },
    [delay]
  )
}
