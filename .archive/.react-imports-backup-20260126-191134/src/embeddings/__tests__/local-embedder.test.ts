/**
 * Tests for LocalEmbedder
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  LocalEmbedder,
  createLocalEmbedder,
  createEmbedFunction,
  calculateSimilarity,
  type LocalEmbedderConfig,
  type EmbeddingResult,
} from '../local-embedder'

describe('LocalEmbedder', () => {
  describe('constructor', () => {
    it('should create with default config', () => {
      const embedder = new LocalEmbedder()
      expect(embedder).toBeDefined()
      expect(embedder.isReady()).toBe(true)
    })

    it('should accept custom config', () => {
      const embedder = new LocalEmbedder({
        dimensions: 256,
        batchSize: 16,
        cacheEmbeddings: false,
      })
      expect(embedder).toBeDefined()
    })

    it('should throw on invalid dimensions', () => {
      expect(() => {
        new LocalEmbedder({ dimensions: 0 })
      }).toThrow('dimensions must be positive')

      expect(() => {
        new LocalEmbedder({ dimensions: -10 })
      }).toThrow('dimensions must be positive')
    })

    it('should throw on invalid batchSize', () => {
      expect(() => {
        new LocalEmbedder({ batchSize: 0 })
      }).toThrow('batchSize must be positive')

      expect(() => {
        new LocalEmbedder({ batchSize: -5 })
      }).toThrow('batchSize must be positive')
    })

    it('should throw on invalid maxCacheSize', () => {
      expect(() => {
        new LocalEmbedder({ maxCacheSize: 0 })
      }).toThrow('maxCacheSize must be positive')

      expect(() => {
        new LocalEmbedder({ maxCacheSize: -100 })
      }).toThrow('maxCacheSize must be positive')
    })
  })

  describe('embed', () => {
    it('should generate embedding for text', async () => {
      const embedder = new LocalEmbedder({ dimensions: 64 })
      const result = await embedder.embed('Hello world')

      expect(result.embedding).toBeInstanceOf(Array)
      expect(result.embedding.length).toBe(64)
      expect(result.text).toBe('Hello world')
      expect(result.dimensions).toBe(64)
      expect(result.generationTimeMs).toBeGreaterThanOrEqual(0)
      expect(result.cached).toBe(false)
      expect(result.method).toBe('fallback')
    })

    it('should cache embeddings by default', async () => {
      const embedder = new LocalEmbedder({ dimensions: 64 })

      const result1 = await embedder.embed('Test text')
      expect(result1.cached).toBe(false)

      const result2 = await embedder.embed('Test text')
      expect(result2.cached).toBe(true)

      // Embeddings should be identical
      expect(result1.embedding).toEqual(result2.embedding)
    })

    it('should not cache when cacheEmbeddings is false', async () => {
      const embedder = new LocalEmbedder({
        dimensions: 64,
        cacheEmbeddings: false,
      })

      const result1 = await embedder.embed('Test text')
      const result2 = await embedder.embed('Test text')

      expect(result1.cached).toBe(false)
      expect(result2.cached).toBe(false)
    })

    it('should normalize text for caching', async () => {
      const embedder = new LocalEmbedder({ dimensions: 64 })

      const result1 = await embedder.embed('Hello World')
      const result2 = await embedder.embed('hello world')

      // Both should produce the same cache key (normalized)
      expect(result2.cached).toBe(true)
    })

    it('should respect maxCacheSize and evict oldest entries', async () => {
      const embedder = new LocalEmbedder({
        dimensions: 64,
        maxCacheSize: 3,
      })

      // Add 3 entries (at max)
      await embedder.embed('First')
      await embedder.embed('Second')
      await embedder.embed('Third')
      expect(embedder.getStats().cacheSize).toBe(3)

      // Add 4th entry - should evict the oldest (First)
      await embedder.embed('Fourth')
      expect(embedder.getStats().cacheSize).toBe(3)

      // Third and Fourth should still be cached
      const result3 = await embedder.embed('Third')
      expect(result3.cached).toBe(true)

      const result4 = await embedder.embed('Fourth')
      expect(result4.cached).toBe(true)

      // First should no longer be cached (was evicted)
      // Note: Re-requesting First will evict Second (FIFO)
      const result1 = await embedder.embed('First')
      expect(result1.cached).toBe(false)
    })

    it('should handle empty text', async () => {
      const embedder = new LocalEmbedder({ dimensions: 64 })
      const result = await embedder.embed('')

      expect(result.embedding).toBeInstanceOf(Array)
      expect(result.embedding.length).toBe(64)
      // Empty text should produce zero vector
      expect(result.embedding.every((v) => v === 0)).toBe(true)
    })

    it('should produce normalized embeddings', async () => {
      const embedder = new LocalEmbedder({ dimensions: 64 })
      const result = await embedder.embed('Some text for testing')

      // Calculate L2 norm
      const norm = Math.sqrt(
        result.embedding.reduce((sum, v) => sum + v * v, 0)
      )

      // Normalized vectors have norm ~1 (or 0 for empty)
      expect(norm).toBeCloseTo(1, 5)
    })
  })

  describe('embedBatch', () => {
    it('should process multiple texts', async () => {
      const embedder = new LocalEmbedder({ dimensions: 64 })
      const texts = ['First text', 'Second text', 'Third text']

      const results = await embedder.embedBatch(texts)

      expect(results.length).toBe(3)
      results.forEach((result, i) => {
        expect(result.text).toBe(texts[i])
        expect(result.embedding.length).toBe(64)
      })
    })

    it('should respect batch size', async () => {
      const embedder = new LocalEmbedder({
        dimensions: 64,
        batchSize: 2,
      })

      const texts = Array.from({ length: 5 }, (_, i) => `Text ${i}`)
      const results = await embedder.embedBatch(texts)

      expect(results.length).toBe(5)
    })

    it('should handle empty array', async () => {
      const embedder = new LocalEmbedder({ dimensions: 64 })
      const results = await embedder.embedBatch([])

      expect(results).toEqual([])
    })
  })

  describe('getStats', () => {
    it('should track generation statistics', async () => {
      const embedder = new LocalEmbedder({ dimensions: 64 })

      await embedder.embed('First')
      await embedder.embed('Second')
      await embedder.embed('First') // Cache hit

      const stats = embedder.getStats()

      expect(stats.totalGenerated).toBe(2) // Only unique generations
      expect(stats.cacheHits).toBe(1)
      expect(stats.cacheSize).toBe(2)
      expect(stats.method).toBe('fallback')
    })

    it('should calculate average generation time', async () => {
      const embedder = new LocalEmbedder({ dimensions: 64 })

      await embedder.embed('Test 1')
      await embedder.embed('Test 2')

      const stats = embedder.getStats()
      expect(stats.avgGenerationTimeMs).toBeGreaterThanOrEqual(0)
    })
  })

  describe('clearCache', () => {
    it('should clear the cache', async () => {
      const embedder = new LocalEmbedder({ dimensions: 64 })

      await embedder.embed('Test')
      expect(embedder.getStats().cacheSize).toBe(1)

      embedder.clearCache()
      expect(embedder.getStats().cacheSize).toBe(0)
      expect(embedder.getStats().cacheHits).toBe(0)
    })
  })

  describe('dispose', () => {
    it('should clean up resources and reset stats', async () => {
      const embedder = new LocalEmbedder({ dimensions: 64 })

      // Generate some embeddings to populate stats
      await embedder.embed('Test 1')
      await embedder.embed('Test 2')
      await embedder.embed('Test 1') // Cache hit

      const statsBefore = embedder.getStats()
      expect(statsBefore.totalGenerated).toBe(2)
      expect(statsBefore.cacheHits).toBe(1)
      expect(statsBefore.cacheSize).toBe(2)

      embedder.dispose()

      const statsAfter = embedder.getStats()
      expect(statsAfter.cacheSize).toBe(0)
      expect(statsAfter.totalGenerated).toBe(0)
      expect(statsAfter.cacheHits).toBe(0)
      expect(statsAfter.avgGenerationTimeMs).toBe(0)
      expect(embedder.isModelLoaded()).toBe(false)
    })
  })

  describe('isReady', () => {
    it('should always return true (fallback available)', () => {
      const embedder = new LocalEmbedder()
      expect(embedder.isReady()).toBe(true)
    })
  })
})

describe('createLocalEmbedder', () => {
  it('should create embedder instance', () => {
    const embedder = createLocalEmbedder()
    expect(embedder).toBeInstanceOf(LocalEmbedder)
  })

  it('should pass config to constructor', () => {
    const embedder = createLocalEmbedder({ dimensions: 256 })
    expect(embedder).toBeDefined()
  })
})

describe('createEmbedFunction', () => {
  it('should create a function compatible with SemanticCacheConfig', async () => {
    const embedder = new LocalEmbedder({ dimensions: 64 })
    const embedFunction = createEmbedFunction(embedder)

    const embedding = await embedFunction('Test text')

    expect(embedding).toBeInstanceOf(Array)
    expect(embedding.length).toBe(64)
  })
})

describe('calculateSimilarity', () => {
  it('should return 1 for identical vectors', () => {
    const a = [0.5, 0.5, 0.5, 0.5]
    const similarity = calculateSimilarity(a, a)
    expect(similarity).toBeCloseTo(1, 5)
  })

  it('should return 0 for orthogonal vectors', () => {
    const a = [1, 0, 0, 0]
    const b = [0, 1, 0, 0]
    const similarity = calculateSimilarity(a, b)
    expect(similarity).toBeCloseTo(0, 5)
  })

  it('should return -1 for opposite vectors', () => {
    const a = [1, 0, 0, 0]
    const b = [-1, 0, 0, 0]
    const similarity = calculateSimilarity(a, b)
    expect(similarity).toBeCloseTo(-1, 5)
  })

  it('should handle empty vectors', () => {
    expect(calculateSimilarity([], [])).toBe(0)
  })

  it('should handle mismatched dimensions', () => {
    const a = [1, 2, 3]
    const b = [1, 2]
    expect(calculateSimilarity(a, b)).toBe(0)
  })

  it('should handle zero vectors', () => {
    const a = [0, 0, 0]
    const b = [1, 2, 3]
    expect(calculateSimilarity(a, b)).toBe(0)
  })
})

describe('semantic similarity with fallback embedder', () => {
  it('should produce similar embeddings for similar texts', async () => {
    const embedder = new LocalEmbedder({ dimensions: 128 })

    const result1 = await embedder.embed('What is React?')
    const result2 = await embedder.embed('What is React')
    const result3 = await embedder.embed('How to cook pasta')

    const sim12 = calculateSimilarity(result1.embedding, result2.embedding)
    const sim13 = calculateSimilarity(result1.embedding, result3.embedding)

    // Similar questions should have higher similarity
    expect(sim12).toBeGreaterThan(sim13)
  })

  it('should produce different embeddings for different texts', async () => {
    const embedder = new LocalEmbedder({ dimensions: 128 })

    const result1 = await embedder.embed('JavaScript programming')
    const result2 = await embedder.embed('Cooking recipes')

    const similarity = calculateSimilarity(result1.embedding, result2.embedding)

    // Different topics should have lower similarity
    expect(similarity).toBeLessThan(0.8)
  })
})
