import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useThrottle, useThrottledCallback } from '../use-throttle';
describe('useThrottle', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    it('should return initial value immediately', () => {
        const { result } = renderHook(() => useThrottle('initial', 500));
        expect(result.current).toBe('initial');
    });
    it('should throttle value changes', async () => {
        const { result, rerender } = renderHook(({ value }) => useThrottle(value, 100), { initialProps: { value: 'first' } });
        expect(result.current).toBe('first');
        // Update value - this schedules a throttled update
        rerender({ value: 'second' });
        // Value is still first (update is scheduled)
        expect(result.current).toBe('first');
        // Quick successive updates - last one wins
        rerender({ value: 'third' });
        rerender({ value: 'fourth' });
        // Still first (all updates are throttled)
        expect(result.current).toBe('first');
        // Advance time to trigger throttled update
        await act(async () => {
            vi.advanceTimersByTime(100);
        });
        // Now it should be the last value
        expect(result.current).toBe('fourth');
    });
    it('should use default delay of 500ms', () => {
        const { result, rerender } = renderHook(({ value }) => useThrottle(value), {
            initialProps: { value: 'initial' },
        });
        // First update is scheduled (not immediate)
        rerender({ value: 'updated' });
        expect(result.current).toBe('initial');
        // Second update replaces the scheduled one
        rerender({ value: 'another' });
        expect(result.current).toBe('initial');
        // After 500ms (default delay), update should go through
        act(() => {
            vi.advanceTimersByTime(500);
        });
        expect(result.current).toBe('another');
    });
    it('should update immediately if enough time has passed', async () => {
        // Use real timers for this test
        vi.useRealTimers();
        const { result, rerender } = renderHook(({ value }) => useThrottle(value, 50), { initialProps: { value: 'first' } });
        expect(result.current).toBe('first');
        // Wait past throttle delay
        await new Promise((resolve) => setTimeout(resolve, 60));
        // After enough time has passed, this update goes through immediately
        rerender({ value: 'second' });
        // Wait for state update
        await waitFor(() => {
            expect(result.current).toBe('second');
        }, { timeout: 100 });
        // Restore fake timers for other tests
        vi.useFakeTimers();
    });
    it('should handle different value types', () => {
        // Initial value is always returned synchronously
        const initialObj = { foo: 'bar' };
        const { result: objResult } = renderHook(() => useThrottle(initialObj, 100));
        expect(objResult.current).toBe(initialObj);
        // Array
        const initialArr = [1, 2, 3];
        const { result: arrResult } = renderHook(() => useThrottle(initialArr, 100));
        expect(arrResult.current).toBe(initialArr);
        // Number
        const { result: numResult } = renderHook(() => useThrottle(42, 100));
        expect(numResult.current).toBe(42);
    });
    it('should cleanup timeout on unmount', () => {
        const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
        const { result, rerender, unmount } = renderHook(({ value }) => useThrottle(value, 100), { initialProps: { value: 'first' } });
        // Trigger a throttled update (schedules a timeout)
        rerender({ value: 'second' });
        rerender({ value: 'third' });
        // Unmount should clear the timeout
        unmount();
        expect(clearTimeoutSpy).toHaveBeenCalled();
    });
});
describe('useThrottledCallback', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    it('should execute callback immediately on first call', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useThrottledCallback(callback, 100));
        act(() => {
            result.current('first');
        });
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('first');
    });
    it('should throttle rapid callback executions', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useThrottledCallback(callback, 100));
        // First call executes immediately
        act(() => {
            result.current('first');
        });
        expect(callback).toHaveBeenCalledTimes(1);
        // Rapid subsequent calls are throttled
        act(() => {
            result.current('second');
            result.current('third');
            result.current('fourth');
        });
        // Should still be 1 call (the rest are throttled)
        expect(callback).toHaveBeenCalledTimes(1);
        // After delay, latest call should execute
        act(() => {
            vi.advanceTimersByTime(100);
        });
        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith('fourth');
    });
    it('should pass arguments correctly', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useThrottledCallback(callback, 100));
        act(() => {
            result.current('arg1', 'arg2', 123);
        });
        expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 123);
    });
    it('should use default delay of 500ms', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useThrottledCallback(callback));
        act(() => {
            result.current('first');
            result.current('second');
        });
        expect(callback).toHaveBeenCalledTimes(1);
        // At 250ms, should not have executed second call
        act(() => {
            vi.advanceTimersByTime(250);
        });
        expect(callback).toHaveBeenCalledTimes(1);
        // At 500ms, should execute
        act(() => {
            vi.advanceTimersByTime(250);
        });
        expect(callback).toHaveBeenCalledTimes(2);
    });
    it('should always use latest callback', () => {
        const callback1 = vi.fn();
        const callback2 = vi.fn();
        const { result, rerender } = renderHook(({ callback }) => useThrottledCallback(callback, 100), { initialProps: { callback: callback1 } });
        // First call uses callback1
        act(() => {
            result.current('test');
        });
        expect(callback1).toHaveBeenCalledTimes(1);
        // Update to callback2
        rerender({ callback: callback2 });
        // Trigger throttled call
        act(() => {
            result.current('throttled');
        });
        // Wait for throttle
        act(() => {
            vi.advanceTimersByTime(100);
        });
        // Should use callback2 for the throttled call
        expect(callback2).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledWith('throttled');
    });
    it('should cleanup timeout on unmount', () => {
        const callback = vi.fn();
        const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
        const { result, unmount } = renderHook(() => useThrottledCallback(callback, 100));
        // First call, then schedule a throttled call
        act(() => {
            result.current('first');
            result.current('second');
        });
        // Unmount should clear the pending timeout
        unmount();
        expect(clearTimeoutSpy).toHaveBeenCalled();
    });
    it('should return a stable function reference', () => {
        const callback = vi.fn();
        const { result, rerender } = renderHook(({ delay }) => useThrottledCallback(callback, delay), { initialProps: { delay: 100 } });
        const firstRef = result.current;
        // Rerender with same delay should return same reference
        rerender({ delay: 100 });
        expect(result.current).toBe(firstRef);
        // Rerender with different delay should return new reference
        rerender({ delay: 200 });
        expect(result.current).not.toBe(firstRef);
    });
});
//# sourceMappingURL=use-throttle.test.js.map