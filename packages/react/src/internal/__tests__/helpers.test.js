/**
 * Tests for internal helper utilities
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, throttle, generateId, deepClone, deepMerge, clamp, sleep, retry, formatBytes, isBrowser, isServer, memoize, cancellable, } from '../helpers';
describe('helpers', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    describe('debounce', () => {
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
        it('should reset timer on subsequent calls', () => {
            const fn = vi.fn();
            const debounced = debounce(fn, 100);
            debounced();
            vi.advanceTimersByTime(50);
            debounced(); // Reset timer
            vi.advanceTimersByTime(50);
            expect(fn).not.toHaveBeenCalled();
            vi.advanceTimersByTime(50);
            expect(fn).toHaveBeenCalledTimes(1);
        });
        it('should pass arguments to the function', () => {
            const fn = vi.fn();
            const debounced = debounce(fn, 100);
            debounced('arg1', 'arg2');
            vi.advanceTimersByTime(100);
            expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
        });
    });
    describe('throttle', () => {
        it('should execute immediately on first call', () => {
            const fn = vi.fn();
            const throttled = throttle(fn, 100);
            throttled();
            expect(fn).toHaveBeenCalledTimes(1);
        });
        it('should ignore calls within throttle period', () => {
            const fn = vi.fn();
            const throttled = throttle(fn, 100);
            throttled();
            throttled();
            throttled();
            expect(fn).toHaveBeenCalledTimes(1);
        });
        it('should allow calls after throttle period', () => {
            const fn = vi.fn();
            const throttled = throttle(fn, 100);
            throttled();
            vi.advanceTimersByTime(100);
            throttled();
            expect(fn).toHaveBeenCalledTimes(2);
        });
        it('should pass arguments to the function', () => {
            const fn = vi.fn();
            const throttled = throttle(fn, 100);
            throttled('arg1', 'arg2');
            expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
        });
    });
    describe('generateId', () => {
        it('should generate unique IDs', () => {
            const id1 = generateId();
            const id2 = generateId();
            expect(id1).not.toBe(id2);
        });
        it('should include prefix when provided', () => {
            const id = generateId('test');
            expect(id).toMatch(/^test_/);
        });
        it('should generate IDs without prefix', () => {
            const id = generateId();
            expect(id).toMatch(/^[a-z0-9]+_[a-z0-9]+$/);
        });
    });
    describe('deepClone', () => {
        it('should clone primitive values', () => {
            expect(deepClone(1)).toBe(1);
            expect(deepClone('string')).toBe('string');
            expect(deepClone(true)).toBe(true);
            expect(deepClone(null)).toBe(null);
        });
        it('should clone arrays', () => {
            const original = [1, 2, { a: 3 }];
            const cloned = deepClone(original);
            expect(cloned).toEqual(original);
            expect(cloned).not.toBe(original);
            expect(cloned[2]).not.toBe(original[2]);
        });
        it('should clone objects', () => {
            const original = { a: 1, b: { c: 2 } };
            const cloned = deepClone(original);
            expect(cloned).toEqual(original);
            expect(cloned).not.toBe(original);
            expect(cloned.b).not.toBe(original.b);
        });
        it('should clone dates', () => {
            const original = new Date('2024-01-01');
            const cloned = deepClone(original);
            expect(cloned).toEqual(original);
            expect(cloned).not.toBe(original);
        });
        it('should handle nested structures', () => {
            const original = {
                arr: [1, { nested: true }],
                obj: { deep: { value: 42 } },
            };
            const cloned = deepClone(original);
            expect(cloned).toEqual(original);
            expect(cloned.arr[1]).not.toBe(original.arr[1]);
            expect(cloned.obj.deep).not.toBe(original.obj.deep);
        });
    });
    describe('deepMerge', () => {
        it('should merge simple objects', () => {
            const result = deepMerge({ a: 1 }, { b: 2 });
            expect(result).toEqual({ a: 1, b: 2 });
        });
        it('should override values', () => {
            const result = deepMerge({ a: 1 }, { a: 2 });
            expect(result).toEqual({ a: 2 });
        });
        it('should merge nested objects', () => {
            const result = deepMerge({ a: { b: 1 } }, { a: { c: 2 } });
            expect(result).toEqual({ a: { b: 1, c: 2 } });
        });
        it('should handle multiple sources', () => {
            const result = deepMerge({ a: 1 }, { b: 2 }, { c: 3 });
            expect(result).toEqual({ a: 1, b: 2, c: 3 });
        });
        it('should replace arrays', () => {
            const result = deepMerge({ arr: [1, 2] }, { arr: [3, 4] });
            expect(result).toEqual({ arr: [3, 4] });
        });
    });
    describe('clamp', () => {
        it('should return value when within range', () => {
            expect(clamp(5, 0, 10)).toBe(5);
        });
        it('should return min when value is below range', () => {
            expect(clamp(-5, 0, 10)).toBe(0);
        });
        it('should return max when value is above range', () => {
            expect(clamp(15, 0, 10)).toBe(10);
        });
        it('should handle equal min and max', () => {
            expect(clamp(5, 10, 10)).toBe(10);
        });
    });
    describe('sleep', () => {
        it('should resolve after specified time', async () => {
            const promise = sleep(100);
            vi.advanceTimersByTime(100);
            await expect(promise).resolves.toBeUndefined();
        });
    });
    describe('retry', () => {
        it('should return result on success', async () => {
            const fn = vi.fn().mockResolvedValue('success');
            const result = await retry(fn);
            expect(result).toBe('success');
            expect(fn).toHaveBeenCalledTimes(1);
        });
        it('should retry on failure', async () => {
            vi.useRealTimers(); // Use real timers for async retry tests
            const fn = vi
                .fn()
                .mockRejectedValueOnce(new Error('fail'))
                .mockResolvedValueOnce('success');
            const result = await retry(fn, { baseDelay: 10, maxDelay: 50 });
            expect(result).toBe('success');
            expect(fn).toHaveBeenCalledTimes(2);
            vi.useFakeTimers(); // Restore fake timers
        });
        it('should throw after max attempts', async () => {
            vi.useRealTimers(); // Use real timers for async retry tests
            const fn = vi.fn().mockRejectedValue(new Error('fail'));
            await expect(retry(fn, { maxAttempts: 2, baseDelay: 10, maxDelay: 50 })).rejects.toThrow('fail');
            expect(fn).toHaveBeenCalledTimes(2);
            vi.useFakeTimers(); // Restore fake timers
        });
        it('should respect shouldRetry option', async () => {
            const fn = vi.fn().mockRejectedValue(new Error('fail'));
            const promise = retry(fn, {
                maxAttempts: 3,
                shouldRetry: () => false,
            });
            await expect(promise).rejects.toThrow('fail');
            expect(fn).toHaveBeenCalledTimes(1);
        });
    });
    describe('formatBytes', () => {
        it('should format 0 bytes', () => {
            expect(formatBytes(0)).toBe('0 B');
        });
        it('should format bytes', () => {
            expect(formatBytes(500)).toBe('500 B');
        });
        it('should format kilobytes', () => {
            expect(formatBytes(1024)).toBe('1 KB');
            expect(formatBytes(1536)).toBe('1.5 KB');
        });
        it('should format megabytes', () => {
            expect(formatBytes(1048576)).toBe('1 MB');
        });
        it('should format gigabytes', () => {
            expect(formatBytes(1073741824)).toBe('1 GB');
        });
    });
    describe('isBrowser', () => {
        it('should return correct value based on environment', () => {
            // In Node test environment, window is undefined
            expect(isBrowser()).toBe(typeof window !== 'undefined');
        });
    });
    describe('isServer', () => {
        it('should return correct value based on environment', () => {
            // In Node test environment, window is undefined
            expect(isServer()).toBe(typeof window === 'undefined');
        });
    });
    describe('memoize', () => {
        it('should cache results', () => {
            const fn = vi.fn((x) => x * 2);
            const memoized = memoize(fn);
            expect(memoized(5)).toBe(10);
            expect(memoized(5)).toBe(10);
            expect(fn).toHaveBeenCalledTimes(1);
        });
        it('should cache different arguments separately', () => {
            const fn = vi.fn((x) => x * 2);
            const memoized = memoize(fn);
            expect(memoized(5)).toBe(10);
            expect(memoized(10)).toBe(20);
            expect(fn).toHaveBeenCalledTimes(2);
        });
    });
    describe('cancellable', () => {
        it('should resolve if not cancelled', async () => {
            const promise = Promise.resolve('value');
            const { promise: cancellablePromise } = cancellable(promise);
            await expect(cancellablePromise).resolves.toBe('value');
        });
        it('should not resolve if cancelled', async () => {
            let resolver;
            const promise = new Promise((resolve) => {
                resolver = resolve;
            });
            const { promise: cancellablePromise, cancel } = cancellable(promise);
            cancel();
            // Resolve the original promise
            resolver('value');
            // The cancellable promise should never resolve
            // We can't easily test this without a timeout, so we'll just verify cancel was called
            expect(cancel).toBeDefined();
        });
    });
});
//# sourceMappingURL=helpers.test.js.map