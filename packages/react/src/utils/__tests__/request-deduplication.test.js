/**
 * Tests for Request Deduplication Utility
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RequestDeduplicator, DebouncedError, isDebouncedError, createMessageKey, createDeduplicator, } from '../request-deduplication';
describe('RequestDeduplicator', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    describe('pending deduplication', () => {
        it('should return same promise for concurrent requests', async () => {
            const deduper = new RequestDeduplicator({ strategy: 'pending' });
            let callCount = 0;
            const fn = () => {
                callCount++;
                return new Promise((resolve) => {
                    setTimeout(() => resolve('result'), 100);
                });
            };
            // Start two concurrent requests
            const promise1 = deduper.execute('key1', fn);
            const promise2 = deduper.execute('key1', fn);
            expect(promise1).toBe(promise2);
            await vi.advanceTimersByTimeAsync(100);
            const [result1, result2] = await Promise.all([promise1, promise2]);
            expect(result1).toBe('result');
            expect(result2).toBe('result');
            expect(callCount).toBe(1);
        });
        it('should not dedupe different keys', async () => {
            const deduper = new RequestDeduplicator({ strategy: 'pending' });
            let callCount = 0;
            const fn = () => {
                callCount++;
                return Promise.resolve('result');
            };
            const promise1 = deduper.execute('key1', fn);
            const promise2 = deduper.execute('key2', fn);
            await vi.runAllTimersAsync();
            await Promise.all([promise1, promise2]);
            expect(callCount).toBe(2);
        });
        it('should allow new request after previous completes', async () => {
            const deduper = new RequestDeduplicator({ strategy: 'pending' });
            let callCount = 0;
            const fn = () => {
                callCount++;
                return Promise.resolve('result');
            };
            await deduper.execute('key1', fn);
            await deduper.execute('key1', fn);
            expect(callCount).toBe(2);
        });
    });
    describe('debounce deduplication', () => {
        it('should reject requests within debounce window', async () => {
            const deduper = new RequestDeduplicator({
                strategy: 'debounce',
                debounceMs: 300,
            });
            const fn = () => Promise.resolve('result');
            // First request succeeds
            const result1 = await deduper.execute('key1', fn);
            expect(result1).toBe('result');
            // Second request within window should fail
            await expect(deduper.execute('key1', fn)).rejects.toThrow(DebouncedError);
        });
        it('should allow request after debounce window', async () => {
            const deduper = new RequestDeduplicator({
                strategy: 'debounce',
                debounceMs: 300,
            });
            const fn = () => Promise.resolve('result');
            await deduper.execute('key1', fn);
            await vi.advanceTimersByTimeAsync(301);
            const result2 = await deduper.execute('key1', fn);
            expect(result2).toBe('result');
        });
    });
    describe('both strategy', () => {
        it('should apply both pending and debounce deduplication', async () => {
            const deduper = new RequestDeduplicator({
                strategy: 'both',
                debounceMs: 300,
            });
            let callCount = 0;
            const fn = () => {
                callCount++;
                return new Promise((resolve) => {
                    setTimeout(() => resolve('result'), 100);
                });
            };
            // Start concurrent requests (pending deduplication)
            const promise1 = deduper.execute('key1', fn);
            const promise2 = deduper.execute('key1', fn);
            expect(promise1).toBe(promise2);
            await vi.advanceTimersByTimeAsync(100);
            await promise1;
            // Immediate retry (debounce)
            await expect(deduper.execute('key1', fn)).rejects.toThrow(DebouncedError);
            expect(callCount).toBe(1);
        });
    });
    describe('executeDebounced', () => {
        it('should wait for debounce window before executing', async () => {
            const deduper = new RequestDeduplicator({ debounceMs: 300 });
            let callCount = 0;
            const fn = () => {
                callCount++;
                return Promise.resolve('result');
            };
            const promise = deduper.executeDebounced('key1', fn);
            expect(callCount).toBe(0);
            await vi.advanceTimersByTimeAsync(300);
            const result = await promise;
            expect(result).toBe('result');
            expect(callCount).toBe(1);
        });
        it('should reset timer on repeated calls', async () => {
            const deduper = new RequestDeduplicator({ debounceMs: 300 });
            let callCount = 0;
            const fn = () => {
                callCount++;
                return Promise.resolve('result');
            };
            // First call
            deduper.executeDebounced('key1', fn);
            // Wait 200ms
            await vi.advanceTimersByTimeAsync(200);
            expect(callCount).toBe(0);
            // Second call resets timer
            const promise = deduper.executeDebounced('key1', fn);
            // Wait another 200ms (should not fire yet)
            await vi.advanceTimersByTimeAsync(200);
            expect(callCount).toBe(0);
            // Wait remaining 100ms
            await vi.advanceTimersByTimeAsync(100);
            const result = await promise;
            expect(result).toBe('result');
            expect(callCount).toBe(1);
        });
    });
    describe('isPending', () => {
        it('should return true while request is pending', async () => {
            const deduper = new RequestDeduplicator();
            const fn = () => new Promise((resolve) => {
                setTimeout(() => resolve('result'), 100);
            });
            const promise = deduper.execute('key1', fn);
            expect(deduper.isPending('key1')).toBe(true);
            await vi.advanceTimersByTimeAsync(100);
            await promise;
            expect(deduper.isPending('key1')).toBe(false);
        });
    });
    describe('cancelDebounced', () => {
        it('should cancel pending debounced request', async () => {
            const deduper = new RequestDeduplicator({ debounceMs: 300 });
            let called = false;
            const fn = () => {
                called = true;
                return Promise.resolve('result');
            };
            deduper.executeDebounced('key1', fn);
            const cancelled = deduper.cancelDebounced('key1');
            expect(cancelled).toBe(true);
            await vi.advanceTimersByTimeAsync(500);
            expect(called).toBe(false);
        });
        it('should return false if no pending debounce', () => {
            const deduper = new RequestDeduplicator();
            const cancelled = deduper.cancelDebounced('nonexistent');
            expect(cancelled).toBe(false);
        });
    });
    describe('getStats', () => {
        it('should track request statistics', async () => {
            const onDedupe = vi.fn();
            const deduper = new RequestDeduplicator({
                strategy: 'pending',
                onDedupe,
            });
            const fn = () => new Promise((resolve) => {
                setTimeout(() => resolve('result'), 100);
            });
            // Three concurrent requests to same key
            const p1 = deduper.execute('key1', fn);
            deduper.execute('key1', fn);
            deduper.execute('key1', fn);
            const stats = deduper.getStats();
            expect(stats.totalRequests).toBe(3);
            expect(stats.deduplicatedRequests).toBe(2);
            expect(stats.pendingCount).toBe(1);
            expect(onDedupe).toHaveBeenCalledTimes(2);
            await vi.advanceTimersByTimeAsync(100);
            await p1;
        });
    });
    describe('clear', () => {
        it('should clear all pending state', async () => {
            const deduper = new RequestDeduplicator({ debounceMs: 300 });
            // Create some pending state
            deduper.execute('key1', () => new Promise((resolve) => setTimeout(resolve, 100)));
            deduper.executeDebounced('key2', () => Promise.resolve());
            deduper.clear();
            expect(deduper.isPending('key1')).toBe(false);
            expect(deduper.cancelDebounced('key2')).toBe(false);
        });
    });
    describe('custom key generator', () => {
        it('should use custom key generator', async () => {
            const deduper = new RequestDeduplicator({
                generateKey: (key) => `custom-${key}`,
                strategy: 'pending',
            });
            let callCount = 0;
            const fn = () => {
                callCount++;
                return new Promise((resolve) => {
                    setTimeout(() => resolve('result'), 100);
                });
            };
            const p1 = deduper.execute('key1', fn);
            const p2 = deduper.execute('key1', fn);
            expect(p1).toBe(p2);
            await vi.advanceTimersByTimeAsync(100);
            await p1;
        });
    });
});
describe('DebouncedError', () => {
    it('should have correct properties', () => {
        const error = new DebouncedError('test-key', 300);
        expect(error.name).toBe('DebouncedError');
        expect(error.key).toBe('test-key');
        expect(error.debounceMs).toBe(300);
        expect(error.message).toContain('test-key');
        expect(error.message).toContain('300ms');
    });
});
describe('isDebouncedError', () => {
    it('should return true for DebouncedError', () => {
        const error = new DebouncedError('key', 300);
        expect(isDebouncedError(error)).toBe(true);
    });
    it('should return false for other errors', () => {
        const error = new Error('Not debounced');
        expect(isDebouncedError(error)).toBe(false);
    });
});
describe('createMessageKey', () => {
    it('should create key from last user message', () => {
        const messages = [
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi there!' },
            { role: 'user', content: 'How are you?' },
        ];
        const key = createMessageKey(messages);
        expect(key).toMatch(/^msg-[a-z0-9]+$/);
    });
    it('should create same key for same content', () => {
        const messages1 = [{ role: 'user', content: 'Hello' }];
        const messages2 = [{ role: 'user', content: 'Hello' }];
        const key1 = createMessageKey(messages1);
        const key2 = createMessageKey(messages2);
        expect(key1).toBe(key2);
    });
    it('should create different keys for different content', () => {
        const messages1 = [{ role: 'user', content: 'Hello' }];
        const messages2 = [{ role: 'user', content: 'Goodbye' }];
        const key1 = createMessageKey(messages1);
        const key2 = createMessageKey(messages2);
        expect(key1).not.toBe(key2);
    });
    it('should handle empty messages', () => {
        const key = createMessageKey([]);
        expect(key).toMatch(/^msg-\d+$/);
    });
});
describe('createDeduplicator', () => {
    it('should create a RequestDeduplicator instance', () => {
        const deduper = createDeduplicator({ debounceMs: 500 });
        expect(deduper).toBeInstanceOf(RequestDeduplicator);
    });
});
//# sourceMappingURL=request-deduplication.test.js.map