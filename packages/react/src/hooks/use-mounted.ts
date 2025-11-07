import * as React from 'react'

/**
 * Track if component is currently mounted.
 * Useful for preventing state updates after unmount.
 * 
 * **Use Cases:**
 * - Preventing state updates in async callbacks after unmount
 * - Conditional cleanup logic
 * - Avoiding memory leaks from stale closures
 * 
 * @returns {boolean} True if component is mounted, false otherwise
 * @example
 * ```tsx
 * const isMounted = useMounted()
 * 
 * useEffect(() => {
 *   async function fetchData() {
 *     const data = await api.get('/data')
 *     if (isMounted) {
 *       setData(data)
 *     }
 *   }
 *   fetchData()
 * }, [isMounted])
 * ```
 * 
 * @example
 * ```tsx
 * // Alternative: use the callback version for ref-based checks
 * const getIsMounted = useMountedRef()
 * 
 * useEffect(() => {
 *   async function fetchData() {
 *     const data = await api.get('/data')
 *     if (getIsMounted()) {
 *       setData(data)
 *     }
 *   }
 *   fetchData()
 * }, [])
 * ```
 */
export function useMounted(): boolean {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  return isMounted
}

/**
 * Track if component is currently mounted using a ref.
 * Returns a function that can be called to check mount status.
 * Useful when you need to check mount status in callbacks that don't
 * have access to the boolean value.
 * 
 * @returns {() => boolean} Function that returns true if component is mounted
 */
export function useMountedRef(): () => boolean {
  const mountedRef = React.useRef(false)

  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return React.useCallback(() => mountedRef.current, [])
}
