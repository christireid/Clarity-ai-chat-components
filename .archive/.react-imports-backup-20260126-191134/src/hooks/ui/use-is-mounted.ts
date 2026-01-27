'use client'

import * as React from 'react'

/**
 * Track if component is currently mounted.
 *
 * This hook returns a ref that indicates whether the component is mounted.
 * Useful for async operations where you need to check if the component
 * is still mounted before updating state.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMounted = useIsMounted()
 *   const [data, setData] = useState(null)
 *
 *   useEffect(() => {
 *     fetchData().then(result => {
 *       if (isMounted.current) {
 *         setData(result)
 *       }
 *     })
 *   }, [])
 *
 *   return <div>{data}</div>
 * }
 * ```
 *
 * @returns A ref object with `current` property indicating mount state
 */
export function useIsMounted(): React.MutableRefObject<boolean> {
  const isMounted = React.useRef(false)

  React.useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  return isMounted
}
