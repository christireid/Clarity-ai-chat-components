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

export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  cancel: () => void
  flush: () => void
  pending: () => boolean
}

export interface UseDebouncedCallbackOptions {
  /**
   * Execute immediately on first call (leading edge)
   * @default false
   */
  leading?: boolean
  /**
   * Maximum time to wait before forcing execution
   * @default undefined (no max wait)
   */
  maxWait?: number
}

/**
 * Debounce a callback function - creates a debounced version of the provided
 * callback that delays execution until after the specified delay has elapsed
 * since the last call.
 * 
 * **Features:**
 * - Manual cancel and flush methods
 * - Leading edge execution option
 * - Max wait option to guarantee eventual execution
 * - Pending state checking
 * - Proper cleanup on unmount
 * 
 * **Use Cases:**
 * - Form auto-save
 * - Resize handlers
 * - Scroll event handlers
 * - API calls triggered by user input
 * - Search-as-you-type
 * 
 * @template T - The callback function type
 * @param {T} callback - The function to debounce
 * @param {number} [delay=500] - Delay in milliseconds (default: 500ms)
 * @param {UseDebouncedCallbackOptions} [options] - Debounce options
 * @returns {DebouncedFunction<T>} Debounced function with cancel/flush/pending methods
 * @example
 * ```tsx
 * const debouncedSave = useDebouncedCallback(
 *   (value: string) => saveToAPI(value),
 *   1000
 * )
 * 
 * return (
 *   <>
 *     <input onChange={(e) => debouncedSave(e.target.value)} />
 *     <button onClick={() => debouncedSave.flush()}>Save Now</button>
 *     <button onClick={() => debouncedSave.cancel()}>Cancel Save</button>
 *     {debouncedSave.pending() && <Spinner />}
 *   </>
 * )
 * ```
 * 
 * @example
 * ```tsx
 * // With leading edge execution
 * const debouncedSearch = useDebouncedCallback(
 *   (query: string) => searchAPI(query),
 *   300,
 *   { leading: true, maxWait: 1000 }
 * )
 * // Executes immediately on first call, then debounces
 * // Guarantees execution at least every 1000ms
 * ```
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500,
  options: UseDebouncedCallbackOptions = {}
): DebouncedFunction<T> {
  const { leading = false, maxWait } = options
  
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const maxWaitTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const lastCallTimeRef = React.useRef<number>(0)
  const lastArgsRef = React.useRef<Parameters<T> | null>(null)
  const callbackRef = React.useRef(callback)
  const hasInvokedRef = React.useRef(false)

  // Keep callback ref updated
  React.useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (maxWaitTimeoutRef.current) {
        clearTimeout(maxWaitTimeoutRef.current)
      }
    }
  }, [])

  const cancel = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current)
      maxWaitTimeoutRef.current = null
    }
    lastArgsRef.current = null
    hasInvokedRef.current = false
  }, [])

  const flush = React.useCallback(() => {
    if (lastArgsRef.current) {
      cancel()
      callbackRef.current(...lastArgsRef.current)
      lastArgsRef.current = null
      hasInvokedRef.current = false
    }
  }, [cancel])

  const pending = React.useCallback(() => {
    return lastArgsRef.current !== null
  }, [])

  const invoke = React.useCallback(
    (...args: Parameters<T>) => {
      callbackRef.current(...args)
      lastArgsRef.current = null
      hasInvokedRef.current = false
      lastCallTimeRef.current = Date.now()
    },
    []
  )

  const debounced = React.useCallback(
    (...args: Parameters<T>) => {
      const currentTime = Date.now()
      lastArgsRef.current = args

      // Leading edge execution
      if (leading && !hasInvokedRef.current) {
        invoke(...args)
        hasInvokedRef.current = true
        lastCallTimeRef.current = currentTime
        return
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set up maxWait timeout if configured and not already set
      if (maxWait !== undefined && !maxWaitTimeoutRef.current) {
        maxWaitTimeoutRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            invoke(...lastArgsRef.current)
          }
          maxWaitTimeoutRef.current = null
        }, maxWait)
      }

      // Set up debounce timeout
      timeoutRef.current = setTimeout(() => {
        if (lastArgsRef.current) {
          invoke(...lastArgsRef.current)
        }
        timeoutRef.current = null
        
        // Clear maxWait timeout if it exists
        if (maxWaitTimeoutRef.current) {
          clearTimeout(maxWaitTimeoutRef.current)
          maxWaitTimeoutRef.current = null
        }
      }, delay)
    },
    [delay, leading, maxWait, invoke]
  )

  // Attach utility methods to the debounced function
  const debouncedWithMethods = debounced as DebouncedFunction<T>
  debouncedWithMethods.cancel = cancel
  debouncedWithMethods.flush = flush
  debouncedWithMethods.pending = pending

  return debouncedWithMethods
}
