import { describe, it, expect, beforeEach } from 'vitest'
import { SmartCache } from '../../cache/smart-cache'

describe('SmartCache', () => {
  let cache: SmartCache

  beforeEach(() => {
    cache = new SmartCache({ maxSize: 100, ttl: 3600000 })
  })

  describe('pattern matching', () => {
    it('matches parameterized queries with same pattern', () => {
      cache.index('What is the weather in Paris?', 'Sunny, 22°C')

      const result = cache.match('What is the weather in London?')

      expect(result.hit).toBe(true)
      expect(result.pattern).toBe('What is the weather in {location}?')
    })

    it('extracts and stores entity parameters', () => {
      cache.index('Show me users from New York', 'User list...')

      const result = cache.match('Show me users from Los Angeles')

      expect(result.hit).toBe(true)
      expect(result.extractedParams).toEqual({ location: 'Los Angeles' })
    })

    it('does not match unrelated queries', () => {
      cache.index('What is the weather in Paris?', 'Sunny')

      const result = cache.match('What time is it?')

      expect(result.hit).toBe(false)
    })

    it('matches queries with number parameters', () => {
      cache.index('Show me the top 10 results', 'Results 1-10...')

      const result = cache.match('Show me the top 25 results')

      expect(result.hit).toBe(true)
      expect(result.extractedParams).toEqual({ number: '25' })
    })

    it('preserves response from original query', () => {
      cache.index('Find restaurants in Chicago', 'Restaurant list for Chicago')

      const result = cache.match('Find restaurants in Miami')

      expect(result.hit).toBe(true)
      expect(result.value).toBe('Restaurant list for Chicago')
    })
  })

  describe('template generation', () => {
    it('normalizes locations to {location} placeholder', () => {
      const template = cache.generateTemplate(
        'Find restaurants in San Francisco'
      )
      expect(template).toBe('Find restaurants in {location}')
    })

    it('normalizes dates to {date} placeholder', () => {
      const template = cache.generateTemplate('Events on January 15, 2024')
      expect(template).toContain('{date}')
    })

    it('normalizes numbers to {number} placeholder', () => {
      const template = cache.generateTemplate('Show me the top 10 results')
      expect(template).toBe('Show me the top {number} results')
    })

    it('normalizes ISO dates', () => {
      const template = cache.generateTemplate('Data from 2024-01-15')
      expect(template).toContain('{date}')
    })

    it('normalizes US date format', () => {
      const template = cache.generateTemplate('Report for 01/15/2024')
      expect(template).toContain('{date}')
    })

    it('handles multiple parameters', () => {
      const template = cache.generateTemplate(
        'Weather in Paris on January 15, 2024 for 5 days'
      )
      expect(template).toContain('{location}')
      expect(template).toContain('{date}')
      expect(template).toContain('{number}')
    })
  })

  describe('TTL expiration', () => {
    it('expires entries after TTL', async () => {
      const shortTTLCache = new SmartCache({ maxSize: 100, ttl: 50 })
      shortTTLCache.index('Weather in Paris', 'Sunny')

      await new Promise((resolve) => setTimeout(resolve, 60))

      const result = shortTTLCache.match('Weather in London')
      expect(result.hit).toBe(false)
    })
  })

  describe('LRU eviction', () => {
    it('evicts oldest patterns when at capacity', () => {
      const smallCache = new SmartCache({ maxSize: 2, ttl: 3600000 })

      smallCache.index('Weather in Paris', 'Sunny')
      smallCache.index('Users from Berlin', 'User list')
      smallCache.index('Restaurants in Tokyo', 'Restaurant list') // Should evict Paris

      expect(smallCache.match('Weather in London').hit).toBe(false)
      expect(smallCache.match('Users from Chicago').hit).toBe(true)
      expect(smallCache.match('Restaurants in Sydney').hit).toBe(true)
    })
  })

  describe('cache operations', () => {
    it('reports correct size', () => {
      expect(cache.size).toBe(0)
      cache.index('Query 1', 'Response 1')
      cache.index('Query 2', 'Response 2')
      expect(cache.size).toBe(2)
    })

    it('clears all entries', () => {
      cache.index('Query', 'Response')
      cache.clear()
      expect(cache.size).toBe(0)
    })

    it('returns statistics', () => {
      cache.index('Weather in Paris', 'Sunny')
      cache.match('Weather in Paris') // exact hit
      cache.match('Weather in London') // pattern hit
      cache.match('Unrelated query') // miss

      const stats = cache.getStats()
      expect(stats.size).toBe(1)
      expect(stats.hits).toBe(2)
      expect(stats.misses).toBe(1)
    })
  })

  describe('confidence scoring', () => {
    it('returns high confidence for exact template match', () => {
      cache.index('Weather in Paris', 'Sunny')

      const result = cache.match('Weather in London')

      expect(result.confidence).toBeGreaterThanOrEqual(0.9)
    })
  })
})
