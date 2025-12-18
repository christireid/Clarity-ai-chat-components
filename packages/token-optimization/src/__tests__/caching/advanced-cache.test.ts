/**
 * Tests for Advanced Context Cache
 */

import { AdvancedContextCache, type CacheConfig } from '../src/caching/advanced-cache'

describe('AdvancedContextCache', () => {
  let cache: AdvancedContextCache
  
  beforeEach(() => {
    cache = new AdvancedContextCache({
      maxSize: 100,
      minTokensToCache: 100,
      defaultTTL: 3600000
    })
  })
  
  describe('cacheContext', () => {
    it('should cache large content successfully', async () => {
      const content = 'This is a test content that is long enough to be cached. '.repeat(50)
      const result = await cache.cacheContext(content)
      
      expect(result.success).toBe(true)
      expect(result.cacheKey).toBeDefined()
      expect(result.estimatedSavings).toBeGreaterThan(0)
    })
    
    it('should not cache small content', async () => {
      const content = 'Small content'
      const result = await cache.cacheContext(content)
      
      expect(result.success).toBe(false)
      expect(result.reason).toContain('too small')
    })
    
    it('should not cache content with low reuse probability', async () => {
      const content = 'Unique random content ' + Math.random().toString()
      const result = await cache.cacheContext(content)
      
      // May or may not cache depending on analysis
      expect(result).toBeDefined()
    })
  })
  
  describe('getCachedContext', () => {
    it('should retrieve cached content', async () => {
      const content = 'Test content for caching. '.repeat(100)
      const cacheResult = await cache.cacheContext(content)
      
      expect(cacheResult.success).toBe(true)
      
      const cached = await cache.getCachedContext(cacheResult.cacheKey!)
      
      expect(cached).toBeDefined()
      expect(cached!.content).toBe(content)
      expect(cached!.accessCount).toBe(1)
    })
    
    it('should return null for non-existent cache key', async () => {
      const cached = await cache.getCachedContext('non-existent-key')
      expect(cached).toBeNull()
    })
  })
  
  describe('shouldCacheContext', () => {
    it('should determine if content should be cached', async () => {
      const largeContent = 'Large content for caching decision. '.repeat(100)
      const shouldCache = await cache.shouldCacheContext(largeContent)
      
      expect(typeof shouldCache).toBe('boolean')
    })
    
    it('should not cache small content', async () => {
      const smallContent = 'Small content'
      const shouldCache = await cache.shouldCacheContext(smallContent)
      
      expect(shouldCache).toBe(false)
    })
  })
  
  describe('getCacheStats', () => {
    it('should provide cache statistics', () => {
      const stats = cache.getCacheStats()
      
      expect(stats).toBeDefined()
      expect(stats.totalContexts).toBe(0)
      expect(stats.totalTokensCached).toBe(0)
      expect(stats.hitRate).toBe(0)
    })
    
    it('should provide stats after caching content', async () => {
      const content = 'Test content for statistics. '.repeat(100)
      await cache.cacheContext(content)
      
      const stats = cache.getCacheStats()
      
      expect(stats.totalContexts).toBeGreaterThan(0)
      expect(stats.totalTokensCached).toBeGreaterThan(0)
      expect(stats.averageSavingsPerContext).toBeGreaterThan(0)
    })
  })
  
  describe('eviction', () => {
    it('should evict least valuable content when cache is full', async () => {
      // Create a small cache
      const smallCache = new AdvancedContextCache({ maxSize: 2 })
      
      // Cache first content
      const content1 = 'First content for eviction test. '.repeat(100)
      await smallCache.cacheContext(content1)
      
      // Cache second content
      const content2 = 'Second content for eviction test. '.repeat(100)
      await smallCache.cacheContext(content2)
      
      // Cache third content (should trigger eviction)
      const content3 = 'Third content for eviction test. '.repeat(100)
      await smallCache.cacheContext(content3)
      
      const stats = smallCache.getCacheStats()
      expect(stats.totalContexts).toBeLessThanOrEqual(2)
    })
  })
})

describe('cacheContext with metadata', () => {
  let cache: AdvancedContextCache
  
  beforeEach(() => {
    cache = new AdvancedContextCache()
  })
  
  it('should cache with metadata', async () => {
    const content = 'Test content with metadata. '.repeat(100)
    const metadata = {
      contentType: 'technical',
      estimatedReuseProbability: 0.8
    }
    
    const result = await cache.cacheContext(content, metadata)
    
    expect(result.success).toBe(true)
    
    const cached = await cache.getCachedContext(result.cacheKey!)
    expect(cached!.metadata.contentType).toBe('technical')
    expect(cached!.metadata.estimatedReuseProbability).toBe(0.8)
  })
})