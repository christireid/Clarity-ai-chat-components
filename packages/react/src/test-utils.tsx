/**
 * Test Utilities for @clarity-chat/react
 *
 * Provides common test wrappers and utilities for testing components
 * that require context providers (ToastProvider, ThemeProvider, etc.)
 */

import React, { type ReactElement, type ReactNode } from 'react'
import {
  render,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react'
import { ToastProvider } from './components/toast'

/**
 * Props for the AllProviders wrapper component
 */
interface AllProvidersProps {
  children: ReactNode
}

/**
 * Wrapper component that includes all necessary providers for testing.
 * Add additional providers here as needed.
 */
function AllProviders({ children }: AllProvidersProps): ReactElement {
  return (
    <ToastProvider position="top-right" defaultDuration={5000}>
      {children}
    </ToastProvider>
  )
}

/**
 * Custom render function that wraps components with all necessary providers.
 * Use this instead of @testing-library/react's render for components that
 * require context (e.g., components using useToast).
 *
 * @example
 * ```tsx
 * import { renderWithProviders } from '../../test-utils'
 *
 * it('should render message', () => {
 *   const { getByText } = renderWithProviders(<Message message={mockMessage} />)
 *   expect(getByText('Hello')).toBeInTheDocument()
 * })
 * ```
 */
function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, { wrapper: AllProviders, ...options })
}

/**
 * Create a custom wrapper with specific provider configuration.
 * Useful for tests that need non-default provider settings.
 *
 * @example
 * ```tsx
 * const CustomWrapper = createWrapper({
 *   toastPosition: 'bottom-center',
 * })
 * render(<MyComponent />, { wrapper: CustomWrapper })
 * ```
 */
interface WrapperConfig {
  toastPosition?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  toastDuration?: number
}

function createWrapper(config: WrapperConfig = {}) {
  const { toastPosition = 'top-right', toastDuration = 5000 } = config

  return function CustomWrapper({
    children,
  }: {
    children: ReactNode
  }): ReactElement {
    return (
      <ToastProvider position={toastPosition} defaultDuration={toastDuration}>
        {children}
      </ToastProvider>
    )
  }
}

// =============================================================================
// Async Promise Utilities
// =============================================================================

/**
 * Result type for captured promise resolution/rejection
 */
export interface CapturedResult<T> {
  /** The resolved value (undefined if rejected) */
  value?: T
  /** The error if rejected (undefined if resolved) */
  error?: Error
  /** Whether the promise resolved successfully */
  resolved: boolean
}

/**
 * Captures a promise rejection without triggering unhandled rejection warnings.
 * Essential for testing error cases with fake timers.
 *
 * @example
 * ```ts
 * it('should timeout after 5 seconds', async () => {
 *   const result = await captureRejection(
 *     fetchWithTimeout('/api', { timeout: 5000 })
 *   )
 *   await vi.advanceTimersByTimeAsync(5001)
 *   expect(result.error).toBeInstanceOf(TimeoutError)
 * })
 * ```
 */
export async function captureRejection<T>(
  promise: Promise<T>
): Promise<CapturedResult<T>> {
  try {
    const value = await promise
    return { value, resolved: true }
  } catch (error) {
    return { error: error as Error, resolved: false }
  }
}

/**
 * Wraps a promise to capture its result without throwing.
 * Similar to captureRejection but returns immediately (doesn't await).
 * Useful when you need to advance timers before the promise settles.
 *
 * @example
 * ```ts
 * it('should handle abort', async () => {
 *   const captured = capturePromise(fetchWithTimeout('/api'))
 *   controller.abort()
 *   await vi.runAllTimersAsync()
 *   const result = await captured.promise
 *   expect(result.error?.name).toBe('AbortError')
 * })
 * ```
 */
export function capturePromise<T>(promise: Promise<T>): {
  promise: Promise<CapturedResult<T>>
} {
  return {
    promise: captureRejection(promise),
  }
}

/**
 * Creates a deferred promise that can be manually resolved or rejected.
 * Useful for controlling async flow in tests.
 *
 * @example
 * ```ts
 * it('should show loading state', async () => {
 *   const deferred = createDeferred<Response>()
 *   mockFetch.mockReturnValue(deferred.promise)
 *
 *   render(<MyComponent />)
 *   expect(screen.getByText('Loading...')).toBeInTheDocument()
 *
 *   deferred.resolve(new Response('OK'))
 *   await waitFor(() => {
 *     expect(screen.getByText('Done')).toBeInTheDocument()
 *   })
 * })
 * ```
 */
export interface Deferred<T> {
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: Error) => void
}

export function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: Error) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

/**
 * Waits for a specific number of milliseconds using fake timers.
 * Combines advanceTimersByTimeAsync with proper microtask flushing.
 *
 * @example
 * ```ts
 * it('should debounce calls', async () => {
 *   const callback = vi.fn()
 *   const debounced = debounce(callback, 100)
 *
 *   debounced()
 *   debounced()
 *   await waitForTimer(100)
 *
 *   expect(callback).toHaveBeenCalledTimes(1)
 * })
 * ```
 */
export async function waitForTimer(
  ms: number,
  vi: { advanceTimersByTimeAsync: (ms: number) => Promise<void> }
): Promise<void> {
  await vi.advanceTimersByTimeAsync(ms)
  // Flush any pending microtasks
  await Promise.resolve()
}

/**
 * Creates a mock fetch implementation that respects AbortSignal.
 * Use this instead of manually creating abort-aware mocks.
 *
 * @example
 * ```ts
 * beforeEach(() => {
 *   global.fetch = createAbortAwareMock(() => new Response('OK'))
 * })
 * ```
 */
export function createAbortAwareMock<T>(
  implementation: () => T | Promise<T>
): (url: string, options?: { signal?: AbortSignal }) => Promise<T> {
  return (_url: string, options?: { signal?: AbortSignal }) => {
    return new Promise((resolve, reject) => {
      if (options?.signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'))
        return
      }

      options?.signal?.addEventListener('abort', () => {
        reject(new DOMException('Aborted', 'AbortError'))
      })

      Promise.resolve(implementation()).then(resolve, reject)
    })
  }
}

/**
 * Creates a mock fetch that never resolves (hangs forever).
 * Useful for testing timeout behavior.
 *
 * @example
 * ```ts
 * it('should timeout', async () => {
 *   global.fetch = createHangingMock()
 *   const result = await captureRejection(fetchWithTimeout('/api', { timeout: 1000 }))
 *   await vi.advanceTimersByTimeAsync(1001)
 *   expect(result.error).toBeInstanceOf(TimeoutError)
 * })
 * ```
 */
export function createHangingMock(): (
  url: string,
  options?: { signal?: AbortSignal }
) => Promise<never> {
  return (_url: string, options?: { signal?: AbortSignal }) => {
    return new Promise((_, reject) => {
      if (options?.signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'))
        return
      }

      options?.signal?.addEventListener('abort', () => {
        reject(
          options.signal!.reason || new DOMException('Aborted', 'AbortError')
        )
      })

      // Never resolves - simulates hanging request
    })
  }
}

// Re-export everything from @testing-library/react for convenience
export * from '@testing-library/react'

// Export custom utilities
export { renderWithProviders, createWrapper, AllProviders }
