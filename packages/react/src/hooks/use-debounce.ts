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

export interface DebounceOptions {
  /**
   * Invoke on the leading edge of the timeout
   * @default false
   */
  leading?: boolean
  /**
   * Invoke on the trailing edge of the timeout
   * @default true
   */
  trailing?: boolean
  /**
   * Maximum time function is allowed to be delayed before being invoked
   * (essentially throttles after maxWait ms)
   */
  maxWait?: number
}

export interface DebouncedFunc<T extends (...args: any[]) => any> {
  /**
   * Call the debounced function
   */
  (...args: Parameters<T>): void
  /**
   * Cancel any pending invocations
   */
  cancel: () => void
  /**
   * Immediately invoke any pending invocations
   */
  flush: () => void
  /**
   * Check if there's a pending invocation
   */
  pending: () => boolean
}

/**
 * Debounce a callback function - creates a debounced version of the provided
 * callback that delays execution until after the specified delay has elapsed
 * since the last call. Fixes stale closure issues and adds cancel/flush support.
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
 * @param {DebounceOptions} [options] - Debounce behavior options
 * @returns {DebouncedFunc<T>} Debounced function with cancel/flush methods
 * 
 * @example Basic usage
 * ```tsx
 * const debouncedSave = useDebouncedCallback(
 *   (value) => saveToAPI(value),
 *   1000
 * )
 * 
 * <input onChange={(e) => debouncedSave(e.target.value)} />
 * ```
 * 
 * @example With leading edge
 * ```tsx
 * const debouncedClick = useDebouncedCallback(
 *   handleClick,
 *   300,
 *   { leading: true, trailing: false }
 * )
 * // First click executes immediately, subsequent clicks within 300ms ignored
 * ```
 * 
 * @example With cancel/flush
 * ```tsx
 * const debouncedSave = useDebouncedCallback(save, 1000)
 * 
 * // Cancel pending save on unmount
 * useEffect(() => () => debouncedSave.cancel(), [])
 * 
 * // Force save immediately
 * <button onClick={debouncedSave.flush}>Save Now</button>
 * ```
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500,
  options: DebounceOptions = {}
): DebouncedFunc<T> {
  const {
    leading = false,
    trailing = true,
    maxWait,
  } = options

  // Store latest callback to avoid stale closures
  const callbackRef = React.useRef(callback)
  React.useLayoutEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Refs for timeout management
  const timeoutRef = React.useRef<NodeJS.Timeout>()
  const maxWaitTimeoutRef = React.useRef<NodeJS.Timeout>()
  const lastCallTimeRef = React.useRef<number>(0)
  const lastInvokeTimeRef = React.useRef<number>(0)
  const argsRef = React.useRef<Parameters<T>>()
  const leadingCalledRef = React.useRef(false)

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (maxWaitTimeoutRef.current) clearTimeout(maxWaitTimeoutRef.current)
    }
  }, [])

  const invokeFunc = React.useCallback((args: Parameters<T>) => {
    const time = Date.now()
    lastInvokeTimeRef.current = time
    leadingCalledRef.current = false
    
    try {
      return callbackRef.current(...args)
    } catch (error) {
      console.error('[useDebouncedCallback] Error in callback:', error)
      throw error
    }
  }, [])

  const shouldInvoke = React.useCallback(
    (time: number) => {
      const timeSinceLastCall = time - lastCallTimeRef.current
      const timeSinceLastInvoke = time - lastInvokeTimeRef.current

      // First call or called after delay
      return (
        lastCallTimeRef.current === 0 ||
        timeSinceLastCall >= delay ||
        timeSinceLastCall < 0 ||
        (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
      )
    },
    [delay, maxWait]
  )

  const trailingEdge = React.useCallback(() => {
    timeoutRef.current = undefined

    // Only invoke if we have args (there was a call)
    if (trailing && argsRef.current) {
      return invokeFunc(argsRef.current)
    }
    argsRef.current = undefined
    return undefined
  }, [trailing, invokeFunc])

  const timerExpired = React.useCallback(() => {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge()
    }
    // Restart timer with remaining time
    const timeSinceLastCall = time - lastCallTimeRef.current
    const remaining = delay - timeSinceLastCall
    timeoutRef.current = setTimeout(timerExpired, remaining)
  }, [shouldInvoke, trailingEdge, delay])

  const leadingEdge = React.useCallback(
    (args: Parameters<T>) => {
      lastInvokeTimeRef.current = Date.now()
      
      // Start the timer for trailing edge
      timeoutRef.current = setTimeout(timerExpired, delay)
      
      // Invoke on leading edge
      if (leading && !leadingCalledRef.current) {
        leadingCalledRef.current = true
        return invokeFunc(args)
      }
      return undefined
    },
    [leading, invokeFunc, delay, timerExpired]
  )

  const cancel = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current)
      maxWaitTimeoutRef.current = undefined
    }
    lastCallTimeRef.current = 0
    lastInvokeTimeRef.current = 0
    argsRef.current = undefined
    leadingCalledRef.current = false
  }, [])

  const flush = React.useCallback(() => {
    if (!timeoutRef.current) {
      return undefined
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
    if (argsRef.current) {
      return invokeFunc(argsRef.current)
    }
    return undefined
  }, [invokeFunc])

  const pending = React.useCallback(() => {
    return timeoutRef.current !== undefined
  }, [])

  const debounced = React.useCallback(
    (...args: Parameters<T>) => {
      const time = Date.now()
      const isInvoking = shouldInvoke(time)

      lastCallTimeRef.current = time
      argsRef.current = args

      if (isInvoking) {
        if (!timeoutRef.current && !leading) {
          // Start timer for trailing edge
          lastInvokeTimeRef.current = time
          timeoutRef.current = setTimeout(timerExpired, delay)
          return undefined
        }
        if (!timeoutRef.current) {
          return leadingEdge(args)
        }
        if (maxWait !== undefined) {
          // Handle maxWait
          timeoutRef.current = setTimeout(timerExpired, delay)
          return invokeFunc(args)
        }
      }

      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(timerExpired, delay)
      }

      return undefined
    },
    [shouldInvoke, leading, delay, maxWait, timerExpired, leadingEdge, invokeFunc]
  )

  // Return debounced function with utility methods
  const debouncedFunc = debounced as DebouncedFunc<T>
  debouncedFunc.cancel = cancel
  debouncedFunc.flush = flush
  debouncedFunc.pending = pending

  return debouncedFunc
}
