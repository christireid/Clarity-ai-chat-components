import { describe, it, expect, beforeEach, vi } from 'vitest'
import { EmbeddingUtils } from '../index'
import { MemoryEmbeddingCache } from '../cache'

describe('EmbeddingUtils', () => {
  describe('cosineSimilarity', () => {
    it('should calculate cosine similarity', () => {
      const a = [1, 0, 0]
      const b = [1, 0, 0]
      expect(EmbeddingUtils.cosineSimilarity(a, b)).toBe(1)
    })
    
    it('should handle different vectors', () => {
      const a = [1, 2, 3]
      const b = [4, 5, 6]
      const similarity = EmbeddingUtils.cosineSimilarity(a, b)
      expect(similarity).toBeGreaterThan(0)
      expect(similarity).toBeLessThan(1)
    })
  })
  
  describe('findMostSimilar', () => {
    it('should find most similar embeddings', () => {
      const query = [1, 0, 0]
      const candidates = [
        { embedding: [1, 0, 0], data: 'exact match' },
        { embedding: [0.9, 0.1, 0], data: 'close match' },
        { embedding: [0, 1, 0], data: 'orthogonal' },
      ]
      
      const results = EmbeddingUtils.findMostSimilar(query, candidates, 2)
      
      expect(results).toHaveLength(2)
      expect(results[0].data).toBe('exact match')
      expect(results[1].data).toBe('close match')
    })
  })
  
  describe('estimateTokens', () => {
    it('should estimate token count', () => {
      const text = 'This is a test'
      const tokens = EmbeddingUtils.estimateTokens(text)
      expect(tokens).toBeGreaterThan(0)
      expect(tokens).toBeLessThan(text.length)
    })
  })
  
  describe('calculateCost', () => {
    it('should calculate cost correctly', () => {
      const cost = EmbeddingUtils.calculateCost(1_000_000, 0.02)
      expect(cost).toBe(0.02)
    })
    
    it('should handle fractional tokens', () => {
      const cost = EmbeddingUtils.calculateCost(500_000, 0.10)
      expect(cost).toBe(0.05)
    })
  })
})

describe('MemoryEmbeddingCache', () => {
  let cache: MemoryEmbeddingCache
  
  beforeEach(() => {
    cache = new MemoryEmbeddingCache()
  })
  
  describe('set and get', () => {
    it('should store and retrieve embeddings', async () => {
      const embedding = [1, 2, 3]
      await cache.set('test', 'model', embedding)
      
      const retrieved = await cache.get('test', 'model')
      expect(retrieved).toEqual(embedding)
    })
    
    it('should return null for non-existent key', async () => {
      const result = await cache.get('nonexistent', 'model')
      expect(result).toBeNull()
    })
    
    it('should differentiate by model', async () => {
      await cache.set('test', 'model1', [1, 2, 3])
      await cache.set('test', 'model2', [4, 5, 6])
      
      const result1 = await cache.get('test', 'model1')
      const result2 = await cache.get('test', 'model2')
      
      expect(result1).toEqual([1, 2, 3])
      expect(result2).toEqual([4, 5, 6])
    })
  })
  
  describe('has', () => {
    it('should check if embedding exists', async () => {
      await cache.set('test', 'model', [1, 2, 3])
      
      expect(await cache.has('test', 'model')).toBe(true)
      expect(await cache.has('nonexistent', 'model')).toBe(false)
    })
  })
  
  describe('clear', () => {
    it('should clear all entries', async () => {
      await cache.set('test1', 'model', [1, 2, 3])
      await cache.set('test2', 'model', [4, 5, 6])
      
      await cache.clear()
      
      expect(await cache.has('test1', 'model')).toBe(false)
      expect(await cache.has('test2', 'model')).toBe(false)
    })
  })
  
  describe('stats', () => {
    it('should track cache statistics', async () => {
      await cache.set('test', 'model', [1, 2, 3])
      
      // Hit
      await cache.get('test', 'model')
      // Miss
      await cache.get('nonexistent', 'model')
      
      const stats = await cache.stats()
      
      expect(stats.hits).toBe(1)
      expect(stats.misses).toBe(1)
      expect(stats.hitRate).toBeCloseTo(0.5)
    })
  })
  
  describe('TTL', () => {
    it('should expire entries after TTL', async () => {
      await cache.set('test', 'model', [1, 2, 3], 100)
      
      const immediate = await cache.get('test', 'model')
      expect(immediate).toEqual([1, 2, 3])
      
      await new Promise(resolve => setTimeout(resolve, 150))
      
      const expired = await cache.get('test', 'model')
      expect(expired).toBeNull()
    })
  })
})

