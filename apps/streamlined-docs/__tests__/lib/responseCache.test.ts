/**
 * Response Cache Tests
 *
 * Tests for the enhanced caching system including:
 * - Multi-layer caching (L1 + L2)
 * - Semantic cache keys
 * - Dynamic TTL
 * - Tag-based invalidation
 * - Compression
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocalResponseCache, generateContextHash } from '../../lib/ai/responseCache'

describe('LocalResponseCache', () => {
  let cache: LocalResponseCache

  beforeEach(() => {
    cache = new LocalResponseCache()
  })

  describe('Basic Operations', () => {
    it('should cache and retrieve responses', async () => {
      const query = 'How do I use ChatWindow?'
      const response = 'Here is how to use ChatWindow...'

      await cache.set(query, response, {
        model: 'gpt-4-turbo',
        tags: ['component', 'api:ChatWindow'],
      })

      const cached = await cache.get(query)
      expect(cached).toBeDefined()
      expect(cached?.response).toBe(response)
      expect(cached?.query).toBe(query)
    })

    it('should return null for cache miss', async () => {
      const cached = await cache.get('Non-existent query')
      expect(cached).toBeNull()
    })

    it('should track hit and miss counts', async () => {
      await cache.set('query1', 'response1', { model: 'gpt-4' })

      await cache.get('query1') // Hit
      await cache.get('query2') // Miss
      await cache.get('query1') // Hit

      const stats = await cache.getStats()
      expect(stats.cacheHits).toBe(2)
      expect(stats.cacheMisses).toBe(1)
    })
  })

  describe('Semantic Cache Keys', () => {
    it('should differentiate between similar queries with different intents', async () => {
      await cache.set('How to use ChatWindow?', 'Response 1', {
        model: 'gpt-4',
        tags: ['how-to'],
      })

      await cache.set('What is ChatWindow?', 'Response 2', {
        model: 'gpt-4',
        tags: ['what-is'],
      })

      const cached1 = await cache.get('How to use ChatWindow?')
      const cached2 = await cache.get('What is ChatWindow?')

      expect(cached1?.response).toBe('Response 1')
      expect(cached2?.response).toBe('Response 2')
    })
  })

  describe('Tag-Based Invalidation', () => {
    it('should invalidate by tags', async () => {
      await cache.set('Query 1', 'Response 1', {
        model: 'gpt-4',
        tags: ['component', 'api:ChatWindow'],
      })

      await cache.set('Query 2', 'Response 2', {
        model: 'gpt-4',
        tags: ['component', 'api:MessageList'],
      })

      await cache.set('Query 3', 'Response 3', {
        model: 'gpt-4',
        tags: ['guide'],
      })

      // Clear only ChatWindow
      await cache.clear(['api:ChatWindow'])

      const cached1 = await cache.get('Query 1')
      const cached2 = await cache.get('Query 2')
      const cached3 = await cache.get('Query 3')

      expect(cached1).toBeNull()
      expect(cached2).toBeDefined()
      expect(cached3).toBeDefined()
    })

    it('should clear all when no tags provided', async () => {
      await cache.set('Query 1', 'Response 1', { model: 'gpt-4' })
      await cache.set('Query 2', 'Response 2', { model: 'gpt-4' })

      await cache.clear()

      const cached1 = await cache.get('Query 1')
      const cached2 = await cache.get('Query 2')

      expect(cached1).toBeNull()
      expect(cached2).toBeNull()
    })
  })

  describe('Pattern Invalidation', () => {
    it('should invalidate by pattern match', async () => {
      await cache.set('How to use streaming?', 'Response 1', { model: 'gpt-4' })
      await cache.set('What is streaming?', 'Response 2', { model: 'gpt-4' })
      await cache.set('How to use hooks?', 'Response 3', { model: 'gpt-4' })

      const count = await cache.invalidatePattern('streaming')

      expect(count).toBe(2)

      const cached1 = await cache.get('How to use streaming?')
      const cached2 = await cache.get('What is streaming?')
      const cached3 = await cache.get('How to use hooks?')

      expect(cached1).toBeNull()
      expect(cached2).toBeNull()
      expect(cached3).toBeDefined()
    })
  })

  describe('Compression', () => {
    it('should compress large responses', async () => {
      const largeResponse = 'A'.repeat(2000) // 2KB response

      await cache.set('Large query', largeResponse, {
        model: 'gpt-4',
      })

      const cached = await cache.get('Large query')
      expect(cached?.response).toBe(largeResponse)

      const stats = await cache.getStats()
      expect(stats.compressionStats?.totalCompressed).toBeGreaterThan(0)
    })

    it('should not compress small responses', async () => {
      const smallResponse = 'Small response'

      await cache.set('Small query', smallResponse, {
        model: 'gpt-4',
      })

      const cached = await cache.get('Small query')
      expect(cached?.response).toBe(smallResponse)
      expect(cached?.compressed).toBeFalsy()
    })
  })

  describe('Cache Statistics', () => {
    it('should calculate hit rate correctly', async () => {
      await cache.set('query1', 'response1', { model: 'gpt-4' })

      await cache.get('query1') // Hit
      await cache.get('query2') // Miss
      await cache.get('query1') // Hit
      await cache.get('query3') // Miss

      const stats = await cache.getStats()
      expect(stats.hitRate).toBe(50) // 2 hits, 2 misses
    })

    it('should calculate estimated savings', async () => {
      await cache.set('query1', 'response1', { model: 'gpt-4' })

      await cache.get('query1') // Hit
      await cache.get('query1') // Hit

      const stats = await cache.getStats()
      expect(stats.estimatedSavings).toBe(0.003) // 2 hits × $0.0015
    })
  })

  describe('Context Hash Generation', () => {
    it('should generate consistent hashes for same sources', () => {
      const sources1 = [
        { url: '/components/chat-window' },
        { url: '/components/message-list' },
      ]

      const sources2 = [
        { url: '/components/message-list' },
        { url: '/components/chat-window' },
      ]

      const hash1 = generateContextHash(sources1)
      const hash2 = generateContextHash(sources2)

      expect(hash1).toBe(hash2) // Should be same regardless of order
    })

    it('should group similar URL patterns', () => {
      const componentSources = [
        { url: '/components/chat-window' },
        { url: '/components/message-list' },
      ]

      const hookSources = [{ url: '/hooks/use-chat' }, { url: '/hooks/use-messages' }]

      const compHash = generateContextHash(componentSources)
      const hookHash = generateContextHash(hookSources)

      expect(compHash).not.toBe(hookHash) // Different patterns
      expect(compHash).toBeDefined()
      expect(hookHash).toBeDefined()
      expect(compHash.length).toBe(12) // MD5 hash truncated to 12 chars
      expect(hookHash.length).toBe(12)
    })
  })

  describe('Cache Metadata', () => {
    it('should retrieve cache metadata', async () => {
      await cache.set('test query', 'test response', {
        model: 'gpt-4',
        tags: ['test'],
      })

      const metadata = await cache.getMetadata('test query')

      expect(metadata).toBeDefined()
      expect(metadata?.hits).toBe(0)
      expect(metadata?.tags).toContain('test')
      expect(metadata?.created).toBeDefined()
    })

    it('should return null for non-existent entries', async () => {
      const metadata = await cache.getMetadata('non-existent')
      expect(metadata).toBeNull()
    })
  })

  describe('Cache Warming', () => {
    it('should warm cache with queries', async () => {
      // Pre-populate some queries
      await cache.set('Query 1', 'Response 1', { model: 'gpt-4' })
      await cache.set('Query 2', 'Response 2', { model: 'gpt-4' })

      const queries = [
        { query: 'Query 1' },
        { query: 'Query 2' },
        { query: 'Query 3' }, // Not cached
      ]

      await cache.warmCache(queries)

      // Should find 2/3 already cached
      const stats = await cache.getStats()
      expect(stats.cacheHits).toBeGreaterThan(0)
    })
  })
})

describe('Context Hash Generation', () => {
  it('should handle empty sources', () => {
    const hash = generateContextHash([])
    expect(hash).toBeDefined()
    expect(hash.length).toBe(12)
  })

  it('should deduplicate sources', () => {
    const sources = [
      { url: '/components/chat' },
      { url: '/components/chat' },
      { url: '/components/chat' },
    ]

    const hash1 = generateContextHash(sources)
    const hash2 = generateContextHash([{ url: '/components/chat' }])

    expect(hash1).toBe(hash2)
  })

  it('should extract URL patterns correctly', () => {
    const sources = [
      { url: '/components/chat-window' },
      { url: '/hooks/use-chat' },
      { url: '/guides/getting-started' },
      { url: '/examples/basic-chat' },
      { url: '/api/docs' },
      { url: '/other/unknown' },
    ]

    const hash = generateContextHash(sources)
    expect(hash).toBeDefined()
    expect(hash.length).toBe(12)
  })
})
