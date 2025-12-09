/**
 * Fetch with Timeout Utility
 *
 * Wraps fetch with configurable timeout and AbortSignal support.
 * Essential for AI API calls that may hang indefinitely.
 */

export interface FetchWithTimeoutOptions extends Omit<RequestInit, 'signal'> {
  /** Timeout in milliseconds (default: 30000) */
  timeout?: number
  /** External AbortSignal for cancellation */
  signal?: AbortSignal
}

/**
 * Fetch wrapper with timeout support
 *
 * Creates an internal AbortController that triggers after the specified timeout.
 * Also respects an external AbortSignal if provided.
 *
 * @example
 * ```ts
 * // Basic usage with 30s timeout
 * const response = await fetchWithTimeout('/api/chat', {
 *   method: 'POST',
 *   timeout: 30000,
 *   body: JSON.stringify({ message: 'Hello' }),
 * })
 *
 * // With external AbortController
 * const controller = new AbortController()
 * const response = await fetchWithTimeout('/api/chat', {
 *   signal: controller.signal,
 *   timeout: 60000,
 * })
 * // Can cancel via controller.abort()
 * ```
 *
 * @throws {DOMException} AbortError if timeout is reached or signal is aborted
 * @throws {Error} TimeoutError with timeout value if timeout is reached
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeout = 30000, signal: externalSignal, ...fetchOptions } = options

  // Create internal controller for timeout
  const timeoutController = new AbortController()
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  // Combine external signal with timeout signal
  const combinedSignal = externalSignal
    ? combineAbortSignals(externalSignal, timeoutController.signal)
    : timeoutController.signal

  try {
    // Set timeout
    timeoutId = setTimeout(() => {
      timeoutController.abort(new Error(`Request timed out after ${timeout}ms`))
    }, timeout)

    const response = await fetch(url, {
      ...fetchOptions,
      signal: combinedSignal,
    })

    return response
  } catch (error) {
    // Check if it was our timeout
    if (error instanceof Error && error.message.includes('timed out')) {
      throw new TimeoutError(
        `Request to ${url} timed out after ${timeout}ms`,
        timeout
      )
    }
    throw error
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

/**
 * Combine multiple AbortSignals into one
 * Aborts when any of the provided signals abort
 */
function combineAbortSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController()

  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason)
      return controller.signal
    }

    signal.addEventListener('abort', () => controller.abort(signal.reason), {
      once: true,
    })
  }

  return controller.signal
}

/**
 * Timeout error with additional context
 */
export class TimeoutError extends Error {
  public readonly timeout: number

  constructor(message: string, timeout: number) {
    super(message)
    this.name = 'TimeoutError'
    this.timeout = timeout
  }
}

/**
 * Check if an error is a timeout error
 */
export function isTimeoutError(error: unknown): error is TimeoutError {
  return (
    error instanceof TimeoutError ||
    (error instanceof Error && error.name === 'TimeoutError')
  )
}

/**
 * Check if an error is an abort error
 */
export function isAbortError(error: unknown): error is DOMException {
  return error instanceof DOMException && error.name === 'AbortError'
}
