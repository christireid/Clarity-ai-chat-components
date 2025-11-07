import * as React from 'react'

/**
 * Debounce a value - only updates after delay has passed since last change.
 * Useful for reducing the frequency of expensive operations like API calls or
 * heavy computations during rapid user input.
 * 
 * **Use Cases:**
 * - Search input with API calls
 * - Form validation
 * - Auto-save functionality
 * - Filtering large lists
 * 
 * @template T - The type of value to debounce
 * @param {T} value - The value to debounce
 * @param {number} [delay=500] - Delay in milliseconds (default: 500ms)
 * @returns {T} The debounced value
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearch = useDebounce(searchTerm, 500)
 * 
 * useEffect(() => {
 *   // Only fires 500ms after user stops typing
 *   searchAPI(debouncedSearch)
 * }, [debouncedSearch])
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

/**
 * Debounce a callback function - creates a debounced version of the provided
 * callback that delays execution until after the specified delay has elapsed
 * since the last call.
 * 
 * **Use Cases:**
 * - Form auto-save
 * - Resize handlers
 * - Scroll event handlers
 * - API calls triggered by user input
 * 
 * @template T - The callback function type
 * @param {T} callback - The function to debounce
 * @param {number} [delay=500] - Delay in milliseconds (default: 500ms)
 * @returns {(...args: Parameters<T>) => void} Debounced version of the callback
 * @example
 * ```tsx
 * const debouncedSave = useDebouncedCallback(
 *   (value) => saveToAPI(value),
 *   1000
 * )
 * 
 * <input onChange={(e) => debouncedSave(e.target.value)} />
 * ```
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        savedCallback.current(...args)
      }, delay)
    },
    [delay] // Only delay in deps - callback accessed via ref
  )
}
