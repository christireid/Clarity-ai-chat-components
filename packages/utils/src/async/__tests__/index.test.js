/**
 * Async Utilities Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, throttle, retry, timeout, sleep, pool, createAbortController, waitUntil, } from '../index.js';
describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    it('should delay function execution', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 100);
        debounced();
        expect(fn).not.toHaveBeenCalled();
        vi.advanceTimersByTime(50);
        expect(fn).not.toHaveBeenCalled();
        vi.advanceTimersByTime(50);
        expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should only execute once for rapid calls', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 100);
        debounced('call1');
        debounced('call2');
        debounced('call3');
        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith('call3');
    });
    it('should pass arguments correctly', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 100);
        debounced('arg1', 'arg2');
        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });
    it('should cancel pending execution', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 100);
        debounced();
        debounced.cancel();
        vi.advanceTimersByTime(100);
        expect(fn).not.toHaveBeenCalled();
    });
    it('should flush pending execution immediately', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 100);
        debounced('flushed');
        debounced.flush();
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith('flushed');
        // Should not execute again when timer expires
        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should not flush if no pending execution', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 100);
        debounced.flush();
        expect(fn).not.toHaveBeenCalled();
    });
    it('should reset timer on each call', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 100);
        debounced();
        vi.advanceTimersByTime(80);
        debounced();
        vi.advanceTimersByTime(80);
        debounced();
        expect(fn).not.toHaveBeenCalled();
        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(1);
    });
});
describe('throttle', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    it('should execute immediately on first call (leading edge)', () => {
        const fn = vi.fn();
        const throttled = throttle(fn, 100);
        throttled('first');
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith('first');
    });
    it('should throttle subsequent calls', () => {
        const fn = vi.fn();
        const throttled = throttle(fn, 100);
        throttled('first');
        throttled('second');
        throttled('third');
        expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should execute trailing call after wait', () => {
        const fn = vi.fn();
        const throttled = throttle(fn, 100);
        throttled('first');
        throttled('second');
        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenLastCalledWith('second');
    });
    it('should respect leading: false option', () => {
        const fn = vi.fn();
        const throttled = throttle(fn, 100, { leading: false });
        throttled('first');
        expect(fn).not.toHaveBeenCalled();
        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should respect trailing: false option', () => {
        const fn = vi.fn();
        const throttled = throttle(fn, 100, { trailing: false });
        throttled('first');
        throttled('second');
        throttled('third');
        expect(fn).toHaveBeenCalledTimes(1);
        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(1); // Still 1, no trailing
    });
    it('should cancel pending execution', () => {
        const fn = vi.fn();
        const throttled = throttle(fn, 100);
        throttled('first');
        throttled('second');
        throttled.cancel();
        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(1); // Only the leading call
    });
    it('should allow execution after wait period', () => {
        const fn = vi.fn();
        const throttled = throttle(fn, 100);
        throttled('first');
        vi.advanceTimersByTime(100);
        throttled('second');
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenLastCalledWith('second');
    });
});
describe('retry', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    it('should return result on first success', async () => {
        const fn = vi.fn().mockResolvedValue('success');
        const result = await retry(fn);
        expect(result).toBe('success');
        expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should retry on failure', async () => {
        const fn = vi
            .fn()
            .mockRejectedValueOnce(new Error('Fail 1'))
            .mockRejectedValueOnce(new Error('Fail 2'))
            .mockResolvedValue('success');
        const resultPromise = retry(fn, { delay: 100 });
        // Process retries
        await vi.advanceTimersByTimeAsync(100);
        await vi.advanceTimersByTimeAsync(200);
        const result = await resultPromise;
        expect(result).toBe('success');
        expect(fn).toHaveBeenCalledTimes(3);
    });
    it('should throw after all retries exhausted', async () => {
        const fn = vi.fn().mockRejectedValue(new Error('Always fails'));
        const resultPromise = retry(fn, { retries: 2, delay: 100 });
        // Attach rejection handler immediately to prevent unhandled rejection
        const rejectionPromise = expect(resultPromise).rejects.toThrow('Always fails');
        // Process all retries
        await vi.advanceTimersByTimeAsync(100);
        await vi.advanceTimersByTimeAsync(200);
        await vi.advanceTimersByTimeAsync(400);
        await rejectionPromise;
        expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
    it('should respect shouldRetry option', async () => {
        const fn = vi.fn().mockRejectedValue(new Error('Non-retryable'));
        const shouldRetry = vi.fn().mockReturnValue(false);
        await expect(retry(fn, { retries: 3, shouldRetry, delay: 100 })).rejects.toThrow('Non-retryable');
        expect(fn).toHaveBeenCalledTimes(1); // No retries
        expect(shouldRetry).toHaveBeenCalled();
    });
    it('should call onRetry callback', async () => {
        const fn = vi
            .fn()
            .mockRejectedValueOnce(new Error('Fail 1'))
            .mockResolvedValue('success');
        const onRetry = vi.fn();
        const resultPromise = retry(fn, { delay: 100, onRetry });
        await vi.advanceTimersByTimeAsync(100);
        await resultPromise;
        expect(onRetry).toHaveBeenCalledTimes(1);
        expect(onRetry).toHaveBeenCalledWith(expect.any(Error), 1);
    });
    it('should convert non-Error throws to Error', async () => {
        const fn = vi.fn().mockImplementation(() => {
            throw 'string error';
        });
        await expect(retry(fn, { retries: 0 })).rejects.toThrow('string error');
    });
});
describe('timeout', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    it('should return result if completed before timeout', async () => {
        const promise = new Promise((resolve) => {
            setTimeout(() => resolve('success'), 50);
        });
        const resultPromise = timeout(promise, 100);
        await vi.advanceTimersByTimeAsync(50);
        const result = await resultPromise;
        expect(result).toBe('success');
    });
    it('should reject with TimeoutError if exceeded', async () => {
        const promise = new Promise((resolve) => {
            setTimeout(() => resolve('too late'), 200);
        });
        const resultPromise = timeout(promise, 100);
        // Attach rejection handler immediately to prevent unhandled rejection
        const rejectionPromise = expect(resultPromise).rejects.toThrow('timed out');
        await vi.advanceTimersByTimeAsync(100);
        await rejectionPromise;
    });
    it('should include custom message in timeout error', async () => {
        const promise = new Promise(() => { });
        const resultPromise = timeout(promise, 100, 'Custom timeout message');
        // Attach rejection handler immediately to prevent unhandled rejection
        const rejectionPromise = expect(resultPromise).rejects.toThrow('Custom timeout message');
        await vi.advanceTimersByTimeAsync(100);
        await rejectionPromise;
    });
    it('should set error name to TimeoutError', async () => {
        const promise = new Promise(() => { });
        const resultPromise = timeout(promise, 100);
        // Attach rejection handler immediately to prevent unhandled rejection
        const rejectionPromise = expect(resultPromise).rejects.toMatchObject({
            name: 'TimeoutError',
        });
        await vi.advanceTimersByTimeAsync(100);
        await rejectionPromise;
    });
    it('should clear timeout on success', async () => {
        const promise = Promise.resolve('immediate');
        const result = await timeout(promise, 100);
        expect(result).toBe('immediate');
    });
});
describe('sleep', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    it('should resolve after specified duration', async () => {
        const promise = sleep(100);
        let resolved = false;
        promise.then(() => {
            resolved = true;
        });
        expect(resolved).toBe(false);
        await vi.advanceTimersByTimeAsync(100);
        expect(resolved).toBe(true);
    });
    it('should resolve with void', async () => {
        const promise = sleep(50);
        await vi.advanceTimersByTimeAsync(50);
        const result = await promise;
        expect(result).toBeUndefined();
    });
    it('should work with zero delay', async () => {
        // Use real timers for this test since sleep(0) should resolve immediately
        vi.useRealTimers();
        const result = await sleep(0);
        expect(result).toBeUndefined();
        vi.useFakeTimers(); // Restore for next test
    });
});
describe('pool', () => {
    // Pool tests use real timers to test actual concurrency
    it('should execute all tasks', async () => {
        const results = await pool([async () => 1, async () => 2, async () => 3]);
        expect(results).toEqual([1, 2, 3]);
    });
    it('should preserve order of results', async () => {
        const results = await pool([
            async () => {
                await new Promise((r) => setTimeout(r, 30));
                return 'slow';
            },
            async () => {
                await new Promise((r) => setTimeout(r, 10));
                return 'fast';
            },
            async () => 'immediate',
        ], 3);
        expect(results).toEqual(['slow', 'fast', 'immediate']);
    });
    it('should respect concurrency limit', async () => {
        let concurrent = 0;
        let maxConcurrent = 0;
        const tasks = Array(10)
            .fill(null)
            .map(() => async () => {
            concurrent++;
            maxConcurrent = Math.max(maxConcurrent, concurrent);
            await new Promise((r) => setTimeout(r, 10));
            concurrent--;
            return 1;
        });
        await pool(tasks, 3);
        expect(maxConcurrent).toBeLessThanOrEqual(3);
    });
    it('should handle empty task array', async () => {
        const results = await pool([]);
        expect(results).toEqual([]);
    });
    it('should propagate errors', async () => {
        const tasks = [
            async () => 'success',
            async () => {
                throw new Error('Task failed');
            },
        ];
        await expect(pool(tasks, 2)).rejects.toThrow('Task failed');
    });
    it('should throw error for invalid concurrency', async () => {
        const tasks = [async () => 1];
        await expect(pool(tasks, 0)).rejects.toThrow('Concurrency must be at least 1');
        await expect(pool(tasks, -1)).rejects.toThrow('Concurrency must be at least 1');
    });
});
describe('createAbortController', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    it('should create an AbortController', () => {
        const controller = createAbortController(1000);
        expect(controller).toBeInstanceOf(AbortController);
        expect(controller.signal.aborted).toBe(false);
    });
    it('should abort after timeout', async () => {
        const controller = createAbortController(100);
        expect(controller.signal.aborted).toBe(false);
        await vi.advanceTimersByTimeAsync(100);
        expect(controller.signal.aborted).toBe(true);
    });
    it('should not abort before timeout', async () => {
        const controller = createAbortController(100);
        await vi.advanceTimersByTimeAsync(50);
        expect(controller.signal.aborted).toBe(false);
    });
});
describe('waitUntil', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    it('should resolve immediately if condition is true', async () => {
        const result = await waitUntil(() => true);
        expect(result).toBeUndefined();
    });
    it('should wait until condition becomes true', async () => {
        let value = false;
        setTimeout(() => {
            value = true;
        }, 250);
        const promise = waitUntil(() => value, { interval: 100 });
        // Advance past the point where value becomes true
        await vi.advanceTimersByTimeAsync(300);
        await expect(promise).resolves.toBeUndefined();
    });
    it('should reject if timeout exceeded', async () => {
        const promise = waitUntil(() => false, { interval: 100, timeout: 500 });
        // Attach rejection handler immediately to prevent unhandled rejection
        const rejectionPromise = expect(promise).rejects.toThrow('Condition not met within 500ms');
        // Advance past timeout
        await vi.advanceTimersByTimeAsync(600);
        await rejectionPromise;
    });
    it('should work with async condition', async () => {
        let value = false;
        setTimeout(() => {
            value = true;
        }, 150);
        const promise = waitUntil(async () => value, { interval: 50 });
        await vi.advanceTimersByTimeAsync(200);
        await expect(promise).resolves.toBeUndefined();
    });
});
//# sourceMappingURL=index.test.js.map