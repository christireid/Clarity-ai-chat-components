import * as React from 'react'

/**
 * Get previous value of state or prop
 * 
 * @example
 * ```tsx
 * const [count, setCount] = useState(0)
 * const prevCount = usePrevious(count)
 * 
 * return (
 *   <div>
 *     <p>Current: {count}</p>
 *     <p>Previous: {prevCount}</p>
 *     <button onClick={() => setCount(count + 1)}>Increment</button>
 *   </div>
 * )
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = React.useRef<T>()

  React.useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
