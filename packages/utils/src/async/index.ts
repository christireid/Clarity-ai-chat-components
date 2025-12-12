/**
 * Async Utilities
 *
 * Common async helpers including debounce, throttle, retry, and timeout utilities.
 *
 * @module @clarity-chat/utils/async
 *
 * @example
 * ```ts
 * import { debounce, throttle, retry, timeout } from '@clarity-chat/utils/async'
 *
 * const debouncedSearch = debounce(search, 300)
 * const throttledScroll = throttle(handleScroll, 100)
 * const result = await retry(() => fetchData(), { retries: 3 })
 * ```
 */

/**
 * Debounce a function
 *
 * Returns a function that delays invoking the provided function until after
 * `wait` milliseconds have elapsed since the last call.
 *
 * @param fn - Function to debounce
 * @param wait - Milliseconds to wait
 * @returns Debounced function with cancel and flush methods
 *
 * @example
 * ```ts
 * const debouncedSearch = debounce(async (query: string) => {
 *   const results = await searchAPI(query)
 *   setResults(results)
 * }, 300)
 *
 * // Called on each keystroke, but only executes after 300ms of no typing
 * input.addEventListener('input', (e) => debouncedSearch(e.target.value))
 *
 * // Cancel pending execution
 * debouncedSearch.cancel()
 *
 * // Execute immediately
 * debouncedSearch.flush()
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number
): T & { cancel: () => void; flush: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null

  const debounced = ((...args: Parameters<T>) => {
    lastArgs = args

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      timeoutId = null
      fn(...args)
    }, wait)
  }) as T & { cancel: () => void; flush: () => void }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    lastArgs = null
  }

  debounced.flush = () => {
    if (timeoutId && lastArgs) {
      clearTimeout(timeoutId)
      timeoutId = null
      fn(...lastArgs)
      lastArgs = null
    }
  }

  return debounced
}

/**
 * Throttle a function
 *
 * Returns a function that only invokes the provided function at most once
 * per `wait` milliseconds.
 *
 * @param fn - Function to throttle
 * @param wait - Milliseconds to wait between invocations
 * @param options - Options for leading/trailing edge invocation
 * @returns Throttled function with cancel method
 *
 * @example
 * ```ts
 * const throttledScroll = throttle((event: ScrollEvent) => {
 *   updateScrollPosition(event.target.scrollTop)
 * }, 100)
 *
 * window.addEventListener('scroll', throttledScroll)
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): T & { cancel: () => void } {
  const { leading = true, trailing = true } = options

  let lastInvokeTime = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null

  const throttled = ((...args: Parameters<T>) => {
    const now = Date.now()
    const timeSinceLastInvoke = now - lastInvokeTime

    lastArgs = args

    if (timeSinceLastInvoke >= wait && leading) {
      lastInvokeTime = now
      fn(...args)
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(() => {
        lastInvokeTime = Date.now()
        timeoutId = null
        if (lastArgs) {
          fn(...lastArgs)
        }
      }, wait - timeSinceLastInvoke)
    }
  }) as T & { cancel: () => void }

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    lastArgs = null
  }

  return throttled
}

/**
 * Options for retry function
 */
export interface RetryOptions {
  /** Number of retries (default: 3) */
  retries?: number
  /** Initial delay in ms (default: 1000) */
  delay?: number
  /** Multiply delay by this factor each retry (default: 2) */
  backoffFactor?: number
  /** Maximum delay in ms (default: 30000) */
  maxDelay?: number
  /** Function to determine if error should be retried */
  shouldRetry?: (error: Error, attempt: number) => boolean
  /** Callback on each retry attempt */
  onRetry?: (error: Error, attempt: number) => void
}

/**
 * Retry an async function with exponential backoff
 *
 * @param fn - Async function to retry
 * @param options - Retry options
 * @returns Result of successful invocation
 * @throws Last error if all retries fail
 *
 * @example
 * ```ts
 * const data = await retry(
 *   () => fetchData(),
 *   {
 *     retries: 3,
 *     delay: 1000,
 *     shouldRetry: (err) => err.status === 503,
 *     onRetry: (err, attempt) => console.log(`Retry ${attempt}`)
 *   }
 * )
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    retries = 3,
    delay = 1000,
    backoffFactor = 2,
    maxDelay = 30000,
    shouldRetry = () => true,
    onRetry,
  } = options

  let lastError: Error
  let currentDelay = delay

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === retries || !shouldRetry(lastError, attempt)) {
        throw lastError
      }

      onRetry?.(lastError, attempt + 1)

      await sleep(currentDelay)
      currentDelay = Math.min(currentDelay * backoffFactor, maxDelay)
    }
  }

  throw lastError!
}

/**
 * Wrap a promise with a timeout
 *
 * @param promise - Promise to wrap
 * @param ms - Timeout in milliseconds
 * @param message - Optional timeout error message
 * @returns Promise that rejects if timeout is reached
 *
 * @example
 * ```ts
 * try {
 *   const data = await timeout(fetchData(), 5000)
 * } catch (error) {
 *   if (error.name === 'TimeoutError') {
 *     console.log('Request timed out')
 *   }
 * }
 * ```
 */
export async function timeout<T>(
  promise: Promise<T>,
  ms: number,
  message?: string
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      const error = new Error(message || `Operation timed out after ${ms}ms`)
      error.name = 'TimeoutError'
      reject(error)
    }, ms)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    clearTimeout(timeoutId!)
  }
}

/**
 * Sleep for a specified duration
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the duration
 *
 * @example
 * ```ts
 * await sleep(1000) // Wait 1 second
 * console.log('Done waiting')
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Execute promises with concurrency limit
 *
 * @param tasks - Array of task functions that return promises
 * @param concurrency - Maximum concurrent tasks (default: 5)
 * @returns Array of results in order
 *
 * @example
 * ```ts
 * const urls = ['url1', 'url2', 'url3', ...]
 * const results = await pool(
 *   urls.map(url => () => fetch(url)),
 *   3 // Max 3 concurrent requests
 * )
 * ```
 */
export async function pool<T>(
  tasks: Array<() => Promise<T>>,
  concurrency = 5
): Promise<T[]> {
  // Handle edge cases
  if (tasks.length === 0) return []
  if (concurrency < 1) {
    throw new Error('Concurrency must be at least 1')
  }

  const results: T[] = []
  const executing: Promise<void>[] = []
  let index = 0

  const enqueue = async (): Promise<void> => {
    if (index >= tasks.length) return

    const taskIndex = index++
    const task = tasks[taskIndex]!

    const promise = task().then((result) => {
      results[taskIndex] = result
    })

    const executingPromise = promise.then(() => {
      executing.splice(executing.indexOf(executingPromise), 1)
    })

    executing.push(executingPromise)

    if (executing.length >= concurrency) {
      await Promise.race(executing)
    }

    await enqueue()
  }

  await enqueue()
  await Promise.all(executing)

  return results
}

/**
 * Create an AbortController with timeout
 *
 * @param ms - Timeout in milliseconds
 * @returns AbortController that aborts after timeout
 *
 * @example
 * ```ts
 * const controller = createAbortController(5000)
 *
 * const response = await fetch(url, { signal: controller.signal })
 * ```
 */
export function createAbortController(ms: number): AbortController {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), ms)

  // Clear timeout when aborted (manually or by timeout) to prevent timer leak
  controller.signal.addEventListener('abort', () => clearTimeout(timeoutId), {
    once: true,
  })

  return controller
}

/**
 * Wait until a condition is true
 *
 * @param condition - Function that returns boolean or Promise<boolean>
 * @param options - Polling options
 * @returns Promise that resolves when condition is true
 *
 * @example
 * ```ts
 * await waitUntil(
 *   () => document.querySelector('#loading') === null,
 *   { interval: 100, timeout: 5000 }
 * )
 * ```
 */
export async function waitUntil(
  condition: () => boolean | Promise<boolean>,
  options: { interval?: number; timeout?: number } = {}
): Promise<void> {
  const { interval = 100, timeout: timeoutMs = 10000 } = options
  const startTime = Date.now()

  while (true) {
    if (await condition()) {
      return
    }

    if (Date.now() - startTime >= timeoutMs) {
      throw new Error(`Condition not met within ${timeoutMs}ms`)
    }

    await sleep(interval)
  }
}
