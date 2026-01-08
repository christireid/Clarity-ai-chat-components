/**
 * useDashboardComposer Hook Tests
 *
 * Tests for the multi-source dashboard data composer including:
 * - Multiple source fetching
 * - Parallel vs sequential loading
 * - Error aggregation
 * - Loading progress
 * - Stale data handling
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDashboardComposer, createDataSource, } from '../use-dashboard-composer';
beforeEach(() => {
    vi.useFakeTimers();
});
afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
});
describe('useDashboardComposer', () => {
    describe('basic functionality', () => {
        it('should fetch all sources on mount', async () => {
            const fetcher1 = vi.fn().mockResolvedValue({ metric: 1 });
            const fetcher2 = vi.fn().mockResolvedValue({ metric: 2 });
            const { result } = renderHook(() => useDashboardComposer({
                sources: [
                    { key: 'source1', fetcher: fetcher1 },
                    { key: 'source2', fetcher: fetcher2 },
                ],
            }));
            expect(result.current.isLoading).toBe(true);
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            expect(fetcher1).toHaveBeenCalledTimes(1);
            expect(fetcher2).toHaveBeenCalledTimes(1);
            expect(result.current.sources.source1.data).toEqual({ metric: 1 });
            expect(result.current.sources.source2.data).toEqual({ metric: 2 });
            expect(result.current.isLoading).toBe(false);
            expect(result.current.isReady).toBe(true);
        });
        it('should not fetch on mount when fetchOnMount is false', async () => {
            const fetcher = vi.fn().mockResolvedValue({ metric: 1 });
            const { result } = renderHook(() => useDashboardComposer({
                sources: [{ key: 'source1', fetcher }],
                fetchOnMount: false,
            }));
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            expect(fetcher).not.toHaveBeenCalled();
            expect(result.current.isLoading).toBe(false);
        });
    });
    describe('loading states', () => {
        it('should track loading progress', async () => {
            let resolve1;
            let resolve2;
            const fetcher1 = vi.fn().mockImplementation(() => new Promise((r) => {
                resolve1 = r;
            }));
            const fetcher2 = vi.fn().mockImplementation(() => new Promise((r) => {
                resolve2 = r;
            }));
            const { result } = renderHook(() => useDashboardComposer({
                sources: [
                    { key: 'source1', fetcher: fetcher1 },
                    { key: 'source2', fetcher: fetcher2 },
                ],
            }));
            // Both loading - 0% progress
            expect(result.current.loadingProgress).toBe(0);
            // Resolve first source
            await act(async () => {
                resolve1({ metric: 1 });
                await vi.runAllTimersAsync();
            });
            // 50% progress
            expect(result.current.loadingProgress).toBe(50);
            // Resolve second source
            await act(async () => {
                resolve2({ metric: 2 });
                await vi.runAllTimersAsync();
            });
            // 100% progress
            expect(result.current.loadingProgress).toBe(100);
        });
        it('should set isLoading based on required sources', async () => {
            let resolveRequired;
            let resolveOptional;
            const requiredFetcher = vi.fn().mockImplementation(() => new Promise((r) => {
                resolveRequired = r;
            }));
            const optionalFetcher = vi.fn().mockImplementation(() => new Promise((r) => {
                resolveOptional = r;
            }));
            const { result } = renderHook(() => useDashboardComposer({
                sources: [
                    { key: 'required', fetcher: requiredFetcher, required: true },
                    { key: 'optional', fetcher: optionalFetcher, required: false },
                ],
            }));
            expect(result.current.isLoading).toBe(true);
            // Resolve only the required source
            await act(async () => {
                resolveRequired({ metric: 1 });
                await vi.runAllTimersAsync();
            });
            // isLoading should be false since required source is loaded
            expect(result.current.isLoading).toBe(false);
            // But isReady should be false since optional is still loading
            expect(result.current.isReady).toBe(false);
            // Resolve optional source
            await act(async () => {
                resolveOptional({ metric: 2 });
                await vi.runAllTimersAsync();
            });
            expect(result.current.isReady).toBe(true);
        });
    });
    describe('error handling', () => {
        it('should aggregate errors from multiple sources', async () => {
            const error1 = new Error('Source 1 failed');
            const error2 = new Error('Source 2 failed');
            const fetcher1 = vi.fn().mockRejectedValue(error1);
            const fetcher2 = vi.fn().mockRejectedValue(error2);
            const { result } = renderHook(() => useDashboardComposer({
                sources: [
                    { key: 'source1', fetcher: fetcher1, maxRetries: 0 },
                    { key: 'source2', fetcher: fetcher2, maxRetries: 0 },
                ],
            }));
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            expect(result.current.errors).toHaveLength(2);
            expect(result.current.errors[0]).toEqual({
                key: 'source1',
                error: error1,
            });
            expect(result.current.errors[1]).toEqual({
                key: 'source2',
                error: error2,
            });
            expect(result.current.hasError).toBe(true);
        });
        it('should set hasError based on required sources only', async () => {
            const fetcher1 = vi.fn().mockResolvedValue({ metric: 1 });
            const fetcher2 = vi.fn().mockRejectedValue(new Error('Failed'));
            const { result } = renderHook(() => useDashboardComposer({
                sources: [
                    { key: 'required', fetcher: fetcher1, required: true },
                    {
                        key: 'optional',
                        fetcher: fetcher2,
                        required: false,
                        maxRetries: 0,
                    },
                ],
            }));
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            // hasError should be false since only optional failed
            expect(result.current.hasError).toBe(false);
            // But errors array should still contain the error
            expect(result.current.errors).toHaveLength(1);
        });
        it('should call onError callback for each failed source', async () => {
            const onError = vi.fn();
            const error = new Error('Failed');
            const fetcher = vi.fn().mockRejectedValue(error);
            renderHook(() => useDashboardComposer({
                sources: [{ key: 'source1', fetcher, maxRetries: 0 }],
                onError,
            }));
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            expect(onError).toHaveBeenCalledWith('source1', error);
        });
    });
    describe('retry logic', () => {
        it('should retry failed sources with exponential backoff', async () => {
            const fetcher = vi.fn().mockRejectedValue(new Error('Failed'));
            renderHook(() => useDashboardComposer({
                sources: [{ key: 'source1', fetcher, maxRetries: 2 }],
            }));
            // Initial fetch
            await act(async () => {
                await vi.advanceTimersByTimeAsync(0);
            });
            expect(fetcher).toHaveBeenCalledTimes(1);
            // First retry after 1000ms
            await act(async () => {
                await vi.advanceTimersByTimeAsync(1000);
            });
            expect(fetcher).toHaveBeenCalledTimes(2);
            // Second retry after 2000ms
            await act(async () => {
                await vi.advanceTimersByTimeAsync(2000);
            });
            expect(fetcher).toHaveBeenCalledTimes(3); // Initial + 2 retries
        });
    });
    describe('refetch', () => {
        it('should refetch all sources with refetchAll', async () => {
            const fetcher1 = vi.fn().mockResolvedValue({ metric: 1 });
            const fetcher2 = vi.fn().mockResolvedValue({ metric: 2 });
            const { result } = renderHook(() => useDashboardComposer({
                sources: [
                    { key: 'source1', fetcher: fetcher1 },
                    { key: 'source2', fetcher: fetcher2 },
                ],
            }));
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            expect(fetcher1).toHaveBeenCalledTimes(1);
            expect(fetcher2).toHaveBeenCalledTimes(1);
            await act(async () => {
                result.current.refetchAll();
                await vi.runAllTimersAsync();
            });
            expect(fetcher1).toHaveBeenCalledTimes(2);
            expect(fetcher2).toHaveBeenCalledTimes(2);
        });
        it('should refetch single source with refetch', async () => {
            const fetcher1 = vi.fn().mockResolvedValue({ metric: 1 });
            const fetcher2 = vi.fn().mockResolvedValue({ metric: 2 });
            const { result } = renderHook(() => useDashboardComposer({
                sources: [
                    { key: 'source1', fetcher: fetcher1 },
                    { key: 'source2', fetcher: fetcher2 },
                ],
            }));
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            await act(async () => {
                result.current.refetch('source1');
                await vi.runAllTimersAsync();
            });
            expect(fetcher1).toHaveBeenCalledTimes(2);
            expect(fetcher2).toHaveBeenCalledTimes(1);
        });
    });
    describe('invalidation', () => {
        it('should invalidate all sources with invalidateAll', async () => {
            const fetcher1 = vi.fn().mockResolvedValue({ metric: 1 });
            const fetcher2 = vi.fn().mockResolvedValue({ metric: 2 });
            const { result } = renderHook(() => useDashboardComposer({
                sources: [
                    { key: 'source1', fetcher: fetcher1 },
                    { key: 'source2', fetcher: fetcher2 },
                ],
            }));
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            expect(result.current.isStale).toBe(false);
            act(() => {
                result.current.invalidateAll();
            });
            expect(result.current.isStale).toBe(true);
            expect(result.current.sources.source1.isStale).toBe(true);
            expect(result.current.sources.source2.isStale).toBe(true);
        });
        it('should invalidate single source', async () => {
            const fetcher1 = vi.fn().mockResolvedValue({ metric: 1 });
            const fetcher2 = vi.fn().mockResolvedValue({ metric: 2 });
            const { result } = renderHook(() => useDashboardComposer({
                sources: [
                    { key: 'source1', fetcher: fetcher1 },
                    { key: 'source2', fetcher: fetcher2 },
                ],
            }));
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            act(() => {
                result.current.invalidate('source1');
            });
            expect(result.current.sources.source1.isStale).toBe(true);
            expect(result.current.sources.source2.isStale).toBe(false);
        });
    });
    describe('reset', () => {
        it('should reset all sources to initial state', async () => {
            const fetcher = vi.fn().mockResolvedValue({ metric: 1 });
            const { result } = renderHook(() => useDashboardComposer({
                sources: [{ key: 'source1', fetcher }],
            }));
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            expect(result.current.sources.source1.data).toEqual({ metric: 1 });
            act(() => {
                result.current.reset();
            });
            expect(result.current.sources.source1.data).toBe(null);
            expect(result.current.sources.source1.isLoading).toBe(false);
            expect(result.current.sources.source1.error).toBe(null);
        });
    });
    describe('stale time', () => {
        it('should mark sources as stale after staleTime', async () => {
            const fetcher = vi.fn().mockResolvedValue({ metric: 1 });
            const { result } = renderHook(() => useDashboardComposer({
                sources: [{ key: 'source1', fetcher, staleTime: 5000 }],
            }));
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            expect(result.current.sources.source1.isStale).toBe(false);
            await act(async () => {
                await vi.advanceTimersByTimeAsync(5000);
            });
            expect(result.current.sources.source1.isStale).toBe(true);
        });
    });
    describe('sequential vs parallel', () => {
        it('should fetch in parallel by default', async () => {
            const callOrder = [];
            const fetcher1 = vi.fn().mockImplementation(async () => {
                callOrder.push('start1');
                await new Promise((r) => setTimeout(r, 100));
                callOrder.push('end1');
                return { metric: 1 };
            });
            const fetcher2 = vi.fn().mockImplementation(async () => {
                callOrder.push('start2');
                await new Promise((r) => setTimeout(r, 50));
                callOrder.push('end2');
                return { metric: 2 };
            });
            renderHook(() => useDashboardComposer({
                sources: [
                    { key: 'source1', fetcher: fetcher1 },
                    { key: 'source2', fetcher: fetcher2 },
                ],
                parallel: true,
            }));
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            // Both should start before either ends
            expect(callOrder[0]).toBe('start1');
            expect(callOrder[1]).toBe('start2');
        });
        it('should fetch sequentially when parallel is false', async () => {
            const callOrder = [];
            const fetcher1 = vi.fn().mockImplementation(async () => {
                callOrder.push('start1');
                await new Promise((r) => setTimeout(r, 100));
                callOrder.push('end1');
                return { metric: 1 };
            });
            const fetcher2 = vi.fn().mockImplementation(async () => {
                callOrder.push('start2');
                await new Promise((r) => setTimeout(r, 50));
                callOrder.push('end2');
                return { metric: 2 };
            });
            renderHook(() => useDashboardComposer({
                sources: [
                    { key: 'source1', fetcher: fetcher1 },
                    { key: 'source2', fetcher: fetcher2 },
                ],
                parallel: false,
            }));
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            // First should complete before second starts
            expect(callOrder.indexOf('end1')).toBeLessThan(callOrder.indexOf('start2'));
        });
    });
    describe('onAllSuccess callback', () => {
        it('should call onAllSuccess when all sources succeed', async () => {
            const onAllSuccess = vi.fn();
            const fetcher1 = vi.fn().mockResolvedValue({ metric: 1 });
            const fetcher2 = vi.fn().mockResolvedValue({ metric: 2 });
            renderHook(() => useDashboardComposer({
                sources: [
                    { key: 'source1', fetcher: fetcher1 },
                    { key: 'source2', fetcher: fetcher2 },
                ],
                onAllSuccess,
            }));
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            expect(onAllSuccess).toHaveBeenCalledWith({
                source1: { metric: 1 },
                source2: { metric: 2 },
            });
        });
        it('should not call onAllSuccess if any source fails', async () => {
            const onAllSuccess = vi.fn();
            const fetcher1 = vi.fn().mockResolvedValue({ metric: 1 });
            const fetcher2 = vi.fn().mockRejectedValue(new Error('Failed'));
            renderHook(() => useDashboardComposer({
                sources: [
                    { key: 'source1', fetcher: fetcher1 },
                    { key: 'source2', fetcher: fetcher2, maxRetries: 0 },
                ],
                onAllSuccess,
            }));
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            expect(onAllSuccess).not.toHaveBeenCalled();
        });
    });
});
describe('createDataSource', () => {
    it('should create a properly typed data source config', () => {
        const fetcher = async () => ({ value: 42 });
        const source = createDataSource('mySource', fetcher, {
            required: true,
            staleTime: 10000,
            maxRetries: 5,
        });
        expect(source).toEqual({
            key: 'mySource',
            fetcher,
            required: true,
            staleTime: 10000,
            maxRetries: 5,
        });
    });
    it('should work with default options', () => {
        const fetcher = async () => ({ value: 42 });
        const source = createDataSource('mySource', fetcher);
        expect(source).toEqual({
            key: 'mySource',
            fetcher,
        });
    });
});
//# sourceMappingURL=use-dashboard-composer.test.js.map