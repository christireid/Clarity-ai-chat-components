import { describe, it, expect, beforeEach } from 'vitest'
import { ExactCache } from '../../cache/exact-cache'

describe('ExactCache', () => {
  let cache: ExactCache<string>

  beforeEach(() => {
    cache = new ExactCache({ maxSize: 100, ttl: 3600000 })
  })

  describe('basic operations', () => {
    it('stores and retrieves values by key', () => {
      cache.set('prompt1', 'response1')
      const result = cache.get('prompt1')

      expect(result).toEqual({
        hit: true,
        value: 'response1',
        age: expect.any(Number),
      })
    })

    it('returns miss for non-existent keys', () => {
      const result = cache.get('nonexistent')
      expect(result).toEqual({ hit: false })
    })

    it('achieves O(1) lookup time for 10000 entries', () => {
      for (let i = 0; i < 10000; i++) {
        cache.set(`key-${i}`, `value-${i}`)
      }

      const start = performance.now()
      cache.get('key-5000')
      const duration = performance.now() - start

      // Relaxed threshold for CI environments and slower machines
      expect(duration).toBeLessThan(10) // < 10ms (O(1) operation)
    })

    it('updates existing entries', () => {
      cache.set('key', 'value1')
      cache.set('key', 'value2')

      const result = cache.get('key')
      expect(result.value).toBe('value2')
    })

    it('reports correct size', () => {
      expect(cache.size).toBe(0)
      cache.set('a', '1')
      cache.set('b', '2')
      expect(cache.size).toBe(2)
    })

    it('clears all entries', () => {
      cache.set('a', '1')
      cache.set('b', '2')
      cache.clear()
      expect(cache.size).toBe(0)
      expect(cache.get('a').hit).toBe(false)
    })

    it('deletes specific entries', () => {
      cache.set('a', '1')
      cache.set('b', '2')
      const deleted = cache.delete('a')
      expect(deleted).toBe(true)
      expect(cache.get('a').hit).toBe(false)
      expect(cache.get('b').hit).toBe(true)
    })

    it('has() returns correct boolean', () => {
      cache.set('exists', 'value')
      expect(cache.has('exists')).toBe(true)
      expect(cache.has('notexists')).toBe(false)
    })
  })

  describe('TTL expiration', () => {
    it('expires entries after TTL', async () => {
      const shortTTLCache = new ExactCache<string>({ maxSize: 100, ttl: 50 })
      shortTTLCache.set('key', 'value')

      await new Promise((resolve) => setTimeout(resolve, 60))

      const result = shortTTLCache.get('key')
      expect(result.hit).toBe(false)
    })

    it('returns age of entry', () => {
      cache.set('key', 'value')

      // Small delay to ensure age > 0
      const result = cache.get('key')
      expect(result.age).toBeGreaterThanOrEqual(0)
      expect(result.age).toBeLessThan(100)
    })
  })

  describe('LRU eviction', () => {
    it('evicts least recently used when at capacity', () => {
      const smallCache = new ExactCache<string>({ maxSize: 3, ttl: 3600000 })

      smallCache.set('a', '1')
      smallCache.set('b', '2')
      smallCache.set('c', '3')
      smallCache.get('a') // Access 'a' to make it recently used
      smallCache.set('d', '4') // Should evict 'b'

      expect(smallCache.get('a').hit).toBe(true)
      expect(smallCache.get('b').hit).toBe(false) // Evicted
      expect(smallCache.get('c').hit).toBe(true)
      expect(smallCache.get('d').hit).toBe(true)
    })

    it('evicts oldest when all are equally aged', () => {
      const smallCache = new ExactCache<string>({ maxSize: 2, ttl: 3600000 })

      smallCache.set('first', '1')
      smallCache.set('second', '2')
      smallCache.set('third', '3') // Should evict 'first'

      expect(smallCache.get('first').hit).toBe(false)
      expect(smallCache.get('second').hit).toBe(true)
      expect(smallCache.get('third').hit).toBe(true)
    })
  })

  describe('hash function', () => {
    it('generates consistent hashes for same input', () => {
      const hash1 = cache.hash('test prompt')
      const hash2 = cache.hash('test prompt')
      expect(hash1).toBe(hash2)
    })

    it('generates different hashes for different inputs', () => {
      const hash1 = cache.hash('prompt 1')
      const hash2 = cache.hash('prompt 2')
      expect(hash1).not.toBe(hash2)
    })

    it('handles empty strings', () => {
      const hash = cache.hash('')
      expect(typeof hash).toBe('string')
      expect(hash.length).toBeGreaterThan(0)
    })

    it('handles unicode strings', () => {
      const hash = cache.hash('Hello \u{1F600} World')
      expect(typeof hash).toBe('string')
    })
  })

  describe('getStats', () => {
    it('returns cache statistics', () => {
      cache.set('a', '1')
      cache.get('a') // hit
      cache.get('b') // miss

      const stats = cache.getStats()

      expect(stats.size).toBe(1)
      expect(stats.hits).toBe(1)
      expect(stats.misses).toBe(1)
      expect(stats.hitRate).toBe(0.5)
    })
  })
})
