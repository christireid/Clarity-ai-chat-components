/**
 * Cache Utilities Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getContentHash, createCacheKey, LRUCache, TTLCache, memoize, memoizeAsync, } from '../index.js';
describe('getContentHash', () => {
    it('should return 16 character hash', () => {
        const hash = getContentHash('hello world');
        expect(hash).toHaveLength(16);
    });
    it('should return consistent hash for same input', () => {
        const hash1 = getContentHash('test content');
        const hash2 = getContentHash('test content');
        expect(hash1).toBe(hash2);
    });
    it('should return different hash for different input', () => {
        const hash1 = getContentHash('content1');
        const hash2 = getContentHash('content2');
        expect(hash1).not.toBe(hash2);
    });
    it('should handle empty string', () => {
        const hash = getContentHash('');
        expect(hash).toHaveLength(16);
    });
    it('should handle unicode content', () => {
        const hash = getContentHash('你好世界 🌍');
        expect(hash).toHaveLength(16);
    });
});
describe('createCacheKey', () => {
    it('should create consistent key from inputs', () => {
        const key1 = createCacheKey('user', '123', 'profile');
        const key2 = createCacheKey('user', '123', 'profile');
        expect(key1).toBe(key2);
    });
    it('should create different keys for different inputs', () => {
        const key1 = createCacheKey('user', '123');
        const key2 = createCacheKey('user', '456');
        expect(key1).not.toBe(key2);
    });
    it('should handle single input', () => {
        const key = createCacheKey('single');
        expect(key).toHaveLength(16);
    });
    it('should handle empty inputs', () => {
        const key = createCacheKey();
        expect(key).toHaveLength(16);
    });
    it('should be order-sensitive', () => {
        const key1 = createCacheKey('a', 'b');
        const key2 = createCacheKey('b', 'a');
        expect(key1).not.toBe(key2);
    });
});
describe('LRUCache', () => {
    it('should store and retrieve values', () => {
        const cache = new LRUCache(10);
        cache.set('key1', 100);
        cache.set('key2', 200);
        expect(cache.get('key1')).toBe(100);
        expect(cache.get('key2')).toBe(200);
    });
    it('should return undefined for missing keys', () => {
        const cache = new LRUCache(10);
        expect(cache.get('nonexistent')).toBeUndefined();
    });
    it('should evict oldest entry when at capacity', () => {
        const cache = new LRUCache(3);
        cache.set('a', 1);
        cache.set('b', 2);
        cache.set('c', 3);
        cache.set('d', 4); // Should evict 'a'
        expect(cache.get('a')).toBeUndefined();
        expect(cache.get('b')).toBe(2);
        expect(cache.get('c')).toBe(3);
        expect(cache.get('d')).toBe(4);
    });
    it('should update LRU order on get', () => {
        const cache = new LRUCache(3);
        cache.set('a', 1);
        cache.set('b', 2);
        cache.set('c', 3);
        // Access 'a' to make it most recently used
        cache.get('a');
        cache.set('d', 4); // Should evict 'b' now, not 'a'
        expect(cache.get('a')).toBe(1);
        expect(cache.get('b')).toBeUndefined();
    });
    it('should update value and position on re-set', () => {
        const cache = new LRUCache(3);
        cache.set('a', 1);
        cache.set('b', 2);
        cache.set('c', 3);
        cache.set('a', 100); // Update 'a'
        cache.set('d', 4); // Should evict 'b'
        expect(cache.get('a')).toBe(100);
        expect(cache.get('b')).toBeUndefined();
    });
    it('should report correct size', () => {
        const cache = new LRUCache(10);
        expect(cache.size).toBe(0);
        cache.set('a', 1);
        expect(cache.size).toBe(1);
        cache.set('b', 2);
        expect(cache.size).toBe(2);
        cache.delete('a');
        expect(cache.size).toBe(1);
    });
    it('should check key existence with has()', () => {
        const cache = new LRUCache(10);
        cache.set('exists', 1);
        expect(cache.has('exists')).toBe(true);
        expect(cache.has('missing')).toBe(false);
    });
    it('should delete entries', () => {
        const cache = new LRUCache(10);
        cache.set('key', 1);
        expect(cache.delete('key')).toBe(true);
        expect(cache.get('key')).toBeUndefined();
        expect(cache.delete('key')).toBe(false);
    });
    it('should clear all entries', () => {
        const cache = new LRUCache(10);
        cache.set('a', 1);
        cache.set('b', 2);
        cache.set('c', 3);
        cache.clear();
        expect(cache.size).toBe(0);
        expect(cache.get('a')).toBeUndefined();
    });
    it('should iterate over keys', () => {
        const cache = new LRUCache(10);
        cache.set('a', 1);
        cache.set('b', 2);
        const keys = [...cache.keys()];
        expect(keys).toContain('a');
        expect(keys).toContain('b');
    });
    it('should iterate over values', () => {
        const cache = new LRUCache(10);
        cache.set('a', 1);
        cache.set('b', 2);
        const values = [...cache.values()];
        expect(values).toContain(1);
        expect(values).toContain(2);
    });
    it('should iterate over entries', () => {
        const cache = new LRUCache(10);
        cache.set('a', 1);
        cache.set('b', 2);
        const entries = [...cache.entries()];
        expect(entries).toContainEqual(['a', 1]);
        expect(entries).toContainEqual(['b', 2]);
    });
    it('should handle cache of size 1', () => {
        const cache = new LRUCache(1);
        cache.set('a', 1);
        expect(cache.get('a')).toBe(1);
        cache.set('b', 2);
        expect(cache.get('a')).toBeUndefined();
        expect(cache.get('b')).toBe(2);
    });
});
describe('TTLCache', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    it('should store and retrieve values within TTL', () => {
        const cache = new TTLCache(1000);
        cache.set('key', 100);
        expect(cache.get('key')).toBe(100);
    });
    it('should return undefined for expired entries', () => {
        const cache = new TTLCache(1000);
        cache.set('key', 100);
        vi.advanceTimersByTime(1001);
        expect(cache.get('key')).toBeUndefined();
    });
    it('should use custom TTL when provided', () => {
        const cache = new TTLCache(10000);
        cache.set('short', 100, 500);
        cache.set('long', 200);
        vi.advanceTimersByTime(600);
        expect(cache.get('short')).toBeUndefined();
        expect(cache.get('long')).toBe(200);
    });
    it('should report correct has() for expired entries', () => {
        const cache = new TTLCache(1000);
        cache.set('key', 100);
        expect(cache.has('key')).toBe(true);
        vi.advanceTimersByTime(1001);
        expect(cache.has('key')).toBe(false);
    });
    it('should delete entries', () => {
        const cache = new TTLCache(10000);
        cache.set('key', 100);
        expect(cache.delete('key')).toBe(true);
        expect(cache.get('key')).toBeUndefined();
    });
    it('should clear all entries', () => {
        const cache = new TTLCache(10000);
        cache.set('a', 1);
        cache.set('b', 2);
        cache.clear();
        expect(cache.size).toBe(0);
    });
    it('should prune expired entries', () => {
        const cache = new TTLCache(500);
        cache.set('a', 1);
        cache.set('b', 2, 1000);
        vi.advanceTimersByTime(600);
        const removed = cache.prune();
        expect(removed).toBe(1); // Only 'a' expired
        expect(cache.size).toBe(1);
        expect(cache.get('b')).toBe(2);
    });
    it('should report remaining TTL', () => {
        const cache = new TTLCache(1000);
        cache.set('key', 100);
        vi.advanceTimersByTime(300);
        const remaining = cache.getTTL('key');
        expect(remaining).toBeCloseTo(700, -2); // ~700ms remaining
    });
    it('should return 0 TTL for expired keys', () => {
        const cache = new TTLCache(1000);
        cache.set('key', 100);
        vi.advanceTimersByTime(1500);
        expect(cache.getTTL('key')).toBe(0);
    });
    it('should return 0 TTL for missing keys', () => {
        const cache = new TTLCache(1000);
        expect(cache.getTTL('nonexistent')).toBe(0);
    });
    it('should clean up expired entry on get()', () => {
        const cache = new TTLCache(1000);
        cache.set('key', 100);
        expect(cache.size).toBe(1);
        vi.advanceTimersByTime(1500);
        cache.get('key');
        expect(cache.size).toBe(0);
    });
});
describe('memoize', () => {
    it('should cache function results', () => {
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
    it('should respect maxSize option', () => {
        const fn = vi.fn((x) => x * 2);
        const memoized = memoize(fn, { maxSize: 2 });
        memoized(1); // Cache: [1]
        memoized(2); // Cache: [1, 2]
        memoized(3); // Cache: [2, 3] - evicts 1
        fn.mockClear();
        // After 3 calls, cache contains [2, 3]
        // memoized(2) and memoized(3) should be hits
        memoized(2); // Cache hit - updates LRU: [3, 2]
        memoized(3); // Cache hit - updates LRU: [2, 3]
        expect(fn).toHaveBeenCalledTimes(0);
        // Now calling memoized(1) is a miss, evicts 2
        memoized(1); // Cache miss - evicts 2, cache: [3, 1]
        expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should use custom key function', () => {
        const fn = vi.fn((obj) => obj.id * 2);
        const memoized = memoize(fn, { keyFn: (obj) => String(obj.id) });
        expect(memoized({ id: 5 })).toBe(10);
        expect(memoized({ id: 5 })).toBe(10);
        expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should handle multiple arguments', () => {
        const fn = vi.fn((a, b) => a + b);
        const memoized = memoize(fn);
        expect(memoized(1, 2)).toBe(3);
        expect(memoized(1, 2)).toBe(3);
        expect(memoized(2, 1)).toBe(3); // Different args, different cache key
        expect(fn).toHaveBeenCalledTimes(2);
    });
    it('should work with TTL option', () => {
        vi.useFakeTimers();
        const fn = vi.fn((x) => x * 2);
        const memoized = memoize(fn, { ttlMs: 1000 });
        expect(memoized(5)).toBe(10);
        expect(memoized(5)).toBe(10);
        expect(fn).toHaveBeenCalledTimes(1);
        vi.advanceTimersByTime(1500);
        expect(memoized(5)).toBe(10); // Recompute after TTL
        expect(fn).toHaveBeenCalledTimes(2);
        vi.useRealTimers();
    });
    it('should handle objects as arguments', () => {
        const fn = vi.fn((obj) => JSON.stringify(obj));
        const memoized = memoize(fn);
        const obj = { a: 1, b: 2 };
        memoized(obj);
        memoized(obj);
        expect(fn).toHaveBeenCalledTimes(1);
        memoized({ a: 1, b: 2 }); // Same value, different reference
        expect(fn).toHaveBeenCalledTimes(1); // JSON.stringify creates same key
    });
    it('should cache undefined return values', () => {
        const fn = vi.fn(() => undefined);
        const memoized = memoize(fn);
        expect(memoized()).toBeUndefined();
        expect(memoized()).toBeUndefined();
        expect(fn).toHaveBeenCalledTimes(1); // Should only call once, cache undefined
    });
    it('should cache null return values', () => {
        const fn = vi.fn(() => null);
        const memoized = memoize(fn);
        expect(memoized()).toBeNull();
        expect(memoized()).toBeNull();
        expect(fn).toHaveBeenCalledTimes(1); // Should only call once, cache null
    });
});
describe('memoizeAsync', () => {
    it('should cache async function results', async () => {
        const fn = vi.fn(async (x) => x * 2);
        const memoized = memoizeAsync(fn);
        expect(await memoized(5)).toBe(10);
        expect(await memoized(5)).toBe(10);
        expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should share in-flight promises', async () => {
        let resolvePromise;
        const fn = vi.fn(() => new Promise((resolve) => {
            resolvePromise = resolve;
        }));
        const memoized = memoizeAsync(fn);
        const promise1 = memoized();
        const promise2 = memoized();
        // The underlying function should only be called once
        expect(fn).toHaveBeenCalledTimes(1);
        resolvePromise(42);
        // Both should resolve to the same value
        const [result1, result2] = await Promise.all([promise1, promise2]);
        expect(result1).toBe(42);
        expect(result2).toBe(42);
    });
    it('should remove failed promises from cache', async () => {
        const fn = vi
            .fn()
            .mockRejectedValueOnce(new Error('First fail'))
            .mockResolvedValue('success');
        const memoized = memoizeAsync(fn);
        await expect(memoized()).rejects.toThrow('First fail');
        // Should retry since failed promise is not cached
        const result = await memoized();
        expect(result).toBe('success');
        expect(fn).toHaveBeenCalledTimes(2);
    });
    it('should respect maxSize option', async () => {
        const fn = vi.fn(async (x) => x * 2);
        const memoized = memoizeAsync(fn, { maxSize: 2 });
        await memoized(1);
        await memoized(2);
        await memoized(3); // Evicts 1
        fn.mockClear();
        await memoized(1); // Cache miss
        expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should use custom key function', async () => {
        const fn = vi.fn(async (obj) => obj.id * 2);
        const memoized = memoizeAsync(fn, { keyFn: (obj) => String(obj.id) });
        expect(await memoized({ id: 5 })).toBe(10);
        expect(await memoized({ id: 5 })).toBe(10);
        expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should work with TTL option', async () => {
        vi.useFakeTimers();
        const fn = vi.fn(async (x) => x * 2);
        const memoized = memoizeAsync(fn, { ttlMs: 1000 });
        expect(await memoized(5)).toBe(10);
        expect(await memoized(5)).toBe(10);
        expect(fn).toHaveBeenCalledTimes(1);
        vi.advanceTimersByTime(1500);
        expect(await memoized(5)).toBe(10);
        expect(fn).toHaveBeenCalledTimes(2);
        vi.useRealTimers();
    });
});
//# sourceMappingURL=index.test.js.map