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

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value)
        lastRan.current = Date.now()
      }
    }, delay - (Date.now() - lastRan.current))

    return () => clearTimeout(timer)
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

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return React.useCallback(
    (...args: Parameters<T>) => {
      if (Date.now() - lastRan.current >= delay) {
        callback(...args)
        lastRan.current = Date.now()
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          callback(...args)
          lastRan.current = Date.now()
        }, delay - (Date.now() - lastRan.current))
      }
    },
    [callback, delay]
  )
}
