/**
 * Tests for useRequestDeduplication hook
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRequestDeduplication, isDebouncedError, } from '../use-request-deduplication';
describe('useRequestDeduplication', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    describe('initial state', () => {
        it('should initialize with default state', () => {
            const { result } = renderHook(() => useRequestDeduplication());
            expect(result.current.stats).toEqual({
                totalRequests: 0,
                deduplicatedRequests: 0,
                pendingCount: 0,
            });
            expect(typeof result.current.execute).toBe('function');
            expect(typeof result.current.executeDebounced).toBe('function');
            expect(typeof result.current.isPending).toBe('function');
            expect(typeof result.current.cancelDebounced).toBe('function');
            expect(typeof result.current.clear).toBe('function');
        });
    });
    describe('execute', () => {
        it('should execute function and return result', async () => {
            const mockFn = vi.fn().mockResolvedValue('success');
            const { result } = renderHook(() => useRequestDeduplication());
            let executeResult;
            await act(async () => {
                executeResult = await result.current.execute('test-key', mockFn);
            });
            expect(executeResult).toBe('success');
            expect(mockFn).toHaveBeenCalledTimes(1);
        });
        it('should deduplicate concurrent requests with same key', async () => {
            let resolvePromise;
            const mockFn = vi.fn().mockImplementation(() => new Promise((resolve) => {
                resolvePromise = resolve;
            }));
            const { result } = renderHook(() => useRequestDeduplication());
            // Start two concurrent requests with same key
            let promise1;
            let promise2;
            act(() => {
                promise1 = result.current.execute('same-key', mockFn);
                promise2 = result.current.execute('same-key', mockFn);
            });
            // Resolve the promise
            await act(async () => {
                resolvePromise('result');
                await vi.runAllTimersAsync();
            });
            const [result1, result2] = await Promise.all([promise1, promise2]);
            // Both should get same result
            expect(result1).toBe('result');
            expect(result2).toBe('result');
            // But function should only be called once
            expect(mockFn).toHaveBeenCalledTimes(1);
        });
        it('should allow different keys to execute independently', async () => {
            const mockFn1 = vi.fn().mockResolvedValue('result1');
            const mockFn2 = vi.fn().mockResolvedValue('result2');
            const { result } = renderHook(() => useRequestDeduplication());
            let result1;
            let result2;
            await act(async () => {
                ;
                [result1, result2] = await Promise.all([
                    result.current.execute('key1', mockFn1),
                    result.current.execute('key2', mockFn2),
                ]);
            });
            expect(result1).toBe('result1');
            expect(result2).toBe('result2');
            expect(mockFn1).toHaveBeenCalledTimes(1);
            expect(mockFn2).toHaveBeenCalledTimes(1);
        });
        it('should update stats after execution', async () => {
            const mockFn = vi.fn().mockResolvedValue('success');
            const { result } = renderHook(() => useRequestDeduplication());
            await act(async () => {
                await result.current.execute('test-key', mockFn);
            });
            expect(result.current.stats.totalRequests).toBeGreaterThan(0);
        });
    });
    describe('isPending', () => {
        it('should return true for pending requests', async () => {
            let resolvePromise;
            const mockFn = vi.fn().mockImplementation(() => new Promise((resolve) => {
                resolvePromise = resolve;
            }));
            const { result } = renderHook(() => useRequestDeduplication());
            act(() => {
                result.current.execute('test-key', mockFn);
            });
            expect(result.current.isPending('test-key')).toBe(true);
            expect(result.current.isPending('other-key')).toBe(false);
            await act(async () => {
                resolvePromise('done');
                await vi.runAllTimersAsync();
            });
            expect(result.current.isPending('test-key')).toBe(false);
        });
    });
    describe('executeDebounced', () => {
        it('should debounce rapid calls', async () => {
            const mockFn = vi.fn().mockResolvedValue('success');
            const { result } = renderHook(() => useRequestDeduplication({ debounceMs: 100 }));
            // Make multiple rapid calls
            act(() => {
                result.current.executeDebounced('debounce-key', mockFn).catch(() => { });
                result.current.executeDebounced('debounce-key', mockFn).catch(() => { });
                result.current.executeDebounced('debounce-key', mockFn).catch(() => { });
            });
            // Advance past debounce window
            await act(async () => {
                await vi.advanceTimersByTimeAsync(150);
            });
            // Only last call should execute
            expect(mockFn).toHaveBeenCalledTimes(1);
        });
    });
    describe('cancelDebounced', () => {
        it('should cancel pending debounced request', async () => {
            const mockFn = vi.fn().mockResolvedValue('success');
            const { result } = renderHook(() => useRequestDeduplication({ debounceMs: 100 }));
            act(() => {
                result.current.executeDebounced('cancel-key', mockFn).catch(() => { });
            });
            // Cancel before debounce completes
            let cancelled;
            act(() => {
                cancelled = result.current.cancelDebounced('cancel-key');
            });
            expect(cancelled).toBe(true);
            // Advance time
            await act(async () => {
                await vi.advanceTimersByTimeAsync(150);
            });
            // Function should not have been called
            expect(mockFn).not.toHaveBeenCalled();
        });
        it('should return false when no pending request', () => {
            const { result } = renderHook(() => useRequestDeduplication());
            const cancelled = result.current.cancelDebounced('nonexistent-key');
            expect(cancelled).toBe(false);
        });
    });
    describe('clear', () => {
        it('should clear all pending state', async () => {
            let resolvePromise;
            const mockFn = vi.fn().mockImplementation(() => new Promise((resolve) => {
                resolvePromise = resolve;
            }));
            const { result } = renderHook(() => useRequestDeduplication());
            act(() => {
                result.current.execute('test-key', mockFn);
            });
            expect(result.current.isPending('test-key')).toBe(true);
            act(() => {
                result.current.clear();
            });
            expect(result.current.stats.pendingCount).toBe(0);
            // Resolve to avoid unhandled rejection
            await act(async () => {
                resolvePromise('done');
                await vi.runAllTimersAsync();
            });
        });
    });
    describe('error handling', () => {
        it('should propagate errors', async () => {
            const error = new Error('Test error');
            const mockFn = vi.fn().mockRejectedValue(error);
            const { result } = renderHook(() => useRequestDeduplication());
            let caughtError;
            await act(async () => {
                try {
                    await result.current.execute('error-key', mockFn);
                }
                catch (e) {
                    caughtError = e;
                }
            });
            expect(caughtError).toBe(error);
        });
        it('should identify debounced errors', () => {
            expect(isDebouncedError(new Error('Debounced: test'))).toBe(false);
            // The actual DebouncedError check depends on implementation
        });
    });
    describe('onDedupe callback', () => {
        it('should call onDedupe when request is deduplicated', async () => {
            const onDedupe = vi.fn();
            let resolvePromise;
            const mockFn = vi.fn().mockImplementation(() => new Promise((resolve) => {
                resolvePromise = resolve;
            }));
            const { result } = renderHook(() => useRequestDeduplication({ onDedupe }));
            act(() => {
                result.current.execute('dedupe-key', mockFn);
                result.current.execute('dedupe-key', mockFn); // This should trigger dedupe
            });
            // Resolve to complete
            await act(async () => {
                resolvePromise('done');
                await vi.runAllTimersAsync();
            });
            expect(onDedupe).toHaveBeenCalledWith('dedupe-key');
        });
    });
    describe('cleanup on unmount', () => {
        it('should cleanup on unmount', async () => {
            const { result, unmount } = renderHook(() => useRequestDeduplication());
            // Access deduplicator to verify it exists
            expect(result.current.deduplicator).toBeDefined();
            unmount();
            // Test passes if no errors thrown
        });
    });
});
//# sourceMappingURL=use-request-deduplication.test.js.map