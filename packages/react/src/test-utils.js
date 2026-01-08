import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Test Utilities for @clarity-chat/react
 *
 * Provides common test wrappers and utilities for testing components
 * that require context providers (ToastProvider, ThemeProvider, etc.)
 */
import React, {} from 'react';
import { render, } from '@testing-library/react';
import { ToastProvider } from './components/ui/toast';
/**
 * Wrapper component that includes all necessary providers for testing.
 * Add additional providers here as needed.
 */
function AllProviders({ children }) {
    return (_jsx(ToastProvider, { position: "top-right", defaultDuration: 5000, children: children }));
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
function renderWithProviders(ui, options) {
    return render(ui, { wrapper: AllProviders, ...options });
}
function createWrapper(config = {}) {
    const { toastPosition = 'top-right', toastDuration = 5000 } = config;
    return function CustomWrapper({ children, }) {
        return (_jsx(ToastProvider, { position: toastPosition, defaultDuration: toastDuration, children: children }));
    };
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
export async function captureRejection(promise) {
    try {
        const value = await promise;
        return { value, resolved: true };
    }
    catch (error) {
        return { error: error, resolved: false };
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
export function capturePromise(promise) {
    return {
        promise: captureRejection(promise),
    };
}
export function createDeferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
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
export async function waitForTimer(ms, vi) {
    await vi.advanceTimersByTimeAsync(ms);
    // Flush any pending microtasks
    await Promise.resolve();
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
export function createAbortAwareMock(implementation) {
    return (_url, options) => {
        return new Promise((resolve, reject) => {
            if (options?.signal?.aborted) {
                reject(new DOMException('Aborted', 'AbortError'));
                return;
            }
            options?.signal?.addEventListener('abort', () => {
                reject(new DOMException('Aborted', 'AbortError'));
            });
            Promise.resolve(implementation()).then(resolve, reject);
        });
    };
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
export function createHangingMock() {
    return (_url, options) => {
        return new Promise((_, reject) => {
            if (options?.signal?.aborted) {
                reject(new DOMException('Aborted', 'AbortError'));
                return;
            }
            options?.signal?.addEventListener('abort', () => {
                reject(options.signal.reason || new DOMException('Aborted', 'AbortError'));
            });
            // Never resolves - simulates hanging request
        });
    };
}
// Re-export everything from @testing-library/react for convenience
export * from '@testing-library/react';
// Export custom utilities
export { renderWithProviders, createWrapper, AllProviders };
//# sourceMappingURL=test-utils.js.map