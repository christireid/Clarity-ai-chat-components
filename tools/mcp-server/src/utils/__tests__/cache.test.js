/**
 * Tests for cache utility
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Cache } from '../cache.js';
describe('Cache', () => {
    let cache;
    beforeEach(() => {
        cache = new Cache(1000); // 1 second TTL
    });
    it('should store and retrieve values', () => {
        cache.set('key1', 'value1');
        expect(cache.get('key1')).toBe('value1');
    });
    it('should return null for non-existent keys', () => {
        expect(cache.get('nonexistent')).toBeNull();
    });
    it('should return null for expired entries', async () => {
        cache.set('key1', 'value1', 100); // 100ms TTL
        expect(cache.get('key1')).toBe('value1');
        await new Promise(resolve => setTimeout(resolve, 150));
        expect(cache.get('key1')).toBeNull();
    });
    it('should check if key exists', () => {
        expect(cache.has('key1')).toBe(false);
        cache.set('key1', 'value1');
        expect(cache.has('key1')).toBe(true);
    });
    it('should delete entries', () => {
        cache.set('key1', 'value1');
        cache.delete('key1');
        expect(cache.get('key1')).toBeNull();
    });
    it('should clear all entries', () => {
        cache.set('key1', 'value1');
        cache.set('key2', 'value2');
        cache.clear();
        expect(cache.get('key1')).toBeNull();
        expect(cache.get('key2')).toBeNull();
    });
    it('should clean expired entries', async () => {
        cache.set('key1', 'value1', 100);
        cache.set('key2', 'value2', 200);
        await new Promise(resolve => setTimeout(resolve, 150));
        const cleaned = cache.clean();
        expect(cleaned).toBe(1);
        expect(cache.get('key1')).toBeNull();
        expect(cache.get('key2')).toBe('value2');
    });
});
//# sourceMappingURL=cache.test.js.map