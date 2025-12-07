/**
 * Tests for useProfiler hook
 * Tests React 19 useOptimistic functionality
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProfiler } from '../hooks/use-profiler';
import { getProfiler } from '../../performance';
// Mock the profiler
vi.mock('../../performance', () => ({
    getProfiler: vi.fn(() => ({
        getAllMetrics: vi.fn(() => []),
        start: vi.fn(),
        end: vi.fn(() => ({
            name: 'test-operation',
            startTime: 1000,
            endTime: 2000,
            duration: 1000,
        })),
        getMetrics: vi.fn(() => ({
            name: 'test-operation',
            startTime: 1000,
            endTime: 2000,
            duration: 1000,
        })),
        getSummary: vi.fn(() => ({
            totalOperations: 0,
            totalDuration: 0,
            avgDuration: 0,
        })),
        clear: vi.fn(),
        setEnabled: vi.fn(),
        enabled: false,
    })),
}));
describe('useProfiler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should initialize with empty metrics', () => {
        const { result } = renderHook(() => useProfiler());
        expect(result.current.metrics).toEqual([]);
        expect(result.current.enabled).toBe(false);
    });
    it('should start profiling and optimistically add metric', () => {
        const { result } = renderHook(() => useProfiler());
        const profiler = getProfiler();
        act(() => {
            result.current.start('test-operation', { trackMemory: true });
            expect(profiler.start).toHaveBeenCalledWith('test-operation', { trackMemory: true });
        });
        // Optimistic update should add metric immediately
        expect(result.current.metrics.length).toBeGreaterThan(0);
    });
    it('should end profiling and update metric', () => {
        const { result } = renderHook(() => useProfiler());
        const profiler = getProfiler();
        act(() => {
            result.current.end('test-operation', { custom: 'data' });
            expect(profiler.end).toHaveBeenCalledWith('test-operation', { custom: 'data' });
        });
    });
    it('should profile async function', async () => {
        const { result } = renderHook(() => useProfiler());
        await act(async () => {
            const { result: fnResult, metrics } = await result.current.profile('test-operation', async () => 'test-result');
            expect(fnResult).toBe('test-result');
            expect(metrics).toBeDefined();
        });
    });
    it('should clear metrics', () => {
        const { result } = renderHook(() => useProfiler());
        const profiler = getProfiler();
        act(() => {
            result.current.clear();
            expect(profiler.clear).toHaveBeenCalled();
        });
    });
    it('should toggle enabled state', () => {
        const { result } = renderHook(() => useProfiler());
        const profiler = getProfiler();
        act(() => {
            result.current.setEnabled(true);
            expect(profiler.setEnabled).toHaveBeenCalledWith(true);
        });
    });
});
//# sourceMappingURL=use-profiler.test.js.map