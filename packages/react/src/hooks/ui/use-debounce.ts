'use client'

import * as React from 'react'

/**
 * useDebounce - Low-Level Utility Hook
 * 
 * **Architecture Layer**: Low-Level (Primitives)
 * **Domain**: Utilities
 * 
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
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns The debounced value
 * 
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
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
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
  // Use ReturnType<typeof setTimeout> for cross-env typing (browser/node)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const callbackRef = React.useRef(callback)

  // Keep callback ref up to date without causing re-renders
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
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay]
  )
}

/**
 * Debounced callback with controls (cancel/flush)
 * Returns a stable object containing the debounced function and control methods.
 */
export function useDebouncedCallbackWithControls<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): {
  call: (...args: Parameters<T>) => void
  cancel: () => void
  flush: (...args: Parameters<T>) => void
} {
  const savedCallback = React.useRef(callback)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Use useLayoutEffect for synchronous callback ref updates (consistent with useDebouncedCallback)
  React.useLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  const cancel = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const call = React.useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        savedCallback.current(...args)
        timeoutRef.current = null
      }, delay)
    },
    [delay]
  )

  const flush = React.useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      savedCallback.current(...args)
    },
    []
  )

  return { call, cancel, flush }
}
