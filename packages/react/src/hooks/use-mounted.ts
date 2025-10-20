import * as React from 'react'

/**
 * Track if component is currently mounted
 * Useful for preventing state updates after unmount
 * 
 * @example
 * ```tsx
 * const isMounted = useMounted()
 * 
 * useEffect(() => {
 *   async function fetchData() {
 *     const data = await api.get('/data')
 *     if (isMounted()) {
 *       setData(data)
 *     }
 *   }
 *   fetchData()
 * }, [])
 * ```
 */
export function useMounted(): () => boolean {
  const mountedRef = React.useRef(false)

  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return React.useCallback(() => mountedRef.current, [])
}
