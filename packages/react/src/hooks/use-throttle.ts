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
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  React.useEffect(() => {
    const now = Date.now()
    const timeSinceLastRun = now - lastRan.current

    // Clear any existing timeout
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current)
    }

    // If enough time has passed, update immediately
    if (timeSinceLastRun >= delay) {
      setThrottledValue(value)
      lastRan.current = now
    } else {
      // Schedule update for remaining time
      const remainingTime = delay - timeSinceLastRun
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value)
        lastRan.current = Date.now()
      }, remainingTime)
    }

    return () => {
      if (timeoutRef.current !== undefined) {
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
  const lastRan = React.useRef<number>(0)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const callbackRef = React.useRef(callback)

  // Keep callback ref up to date
  React.useLayoutEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return React.useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      const timeSinceLastRun = now - lastRan.current

      // Clear any pending timeout
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }

      // If enough time has passed, execute immediately
      if (timeSinceLastRun >= delay) {
        callbackRef.current(...args)
        lastRan.current = now
      } else {
        // Schedule execution for remaining time
        const remainingTime = delay - timeSinceLastRun
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
