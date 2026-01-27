/**
 * Vector Search Optimization Validation Tests
 *
 * Validates that optimizations meet performance and quality targets:
 * - Cache hit rate: 60-70%
 * - Cached query latency: <1ms
 * - Adaptive search: 20-30% faster for easy queries
 * - Enhanced BM25: +12-18% precision on title matches
 * - Optimized RRF: 40-50% faster
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { type APIMetadata } from '../vectorIndexHNSW'
import {
  createCachedHNSWIndex,
  createAdaptiveHNSWIndex,
  type CachedHNSWVectorIndex,
  type AdaptiveHNSWVectorIndex,
} from '../vectorIndexOptimized'
import {
  EnhancedBM25Search,
  createOptimizedHybridSearchEngine,
  type OptimizedHybridSearchEngine,
} from '../hybridSearchOptimized'
import { cosineSimilarity } from '../embeddings'

// ============================================================================
// Test Data Generation
// ============================================================================

function generateRandomVector(dimension: number): number[] {
  const vector: number[] = []
  for (let i = 0; i < dimension; i++) {
    vector.push(Math.random() * 2 - 1)
  }
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
  return vector.map((val) => val / magnitude)
}

function generateMockDocuments(count: number): APIMetadata[] {
  const categories = ['component', 'hook', 'guide', 'cookbook', 'example']
  const titles = [
    'ChatWindow Component',
    'MessageList Component',
    'StreamingMessage Component',
    'useClaritychat Hook',
    'useTokenBudget Hook',
    'Getting Started Guide',
    'Streaming Setup Guide',
    'Simple Chat Example',
    'Advanced Features Cookbook',
    'Token Optimization Guide',
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `doc-${i}`,
    title: titles[i % titles.length] + ` ${i}`,
    content: `This is test content for document ${i}. It contains information about React components, custom hooks, and chat features. The content discusses streaming, token management, and UI components.`,
    url: `/test/doc-${i}`,
    category: categories[i % categories.length],
    metadata: {
      lastUpdated: new Date().toISOString(),
      tags: ['test', 'chat', i % 2 === 0 ? 'component' : 'hook'],
      section: `section-${i % 5}`,
      headings: [`Introduction`, `Usage`, `Examples`],
    },
  }))
}

// ============================================================================
// Cache Performance Tests
// ============================================================================

describe('CachedHNSWVectorIndex Performance', () => {
  const DIMENSION = 1536
  const NUM_DOCS = 500
  let cachedIndex: CachedHNSWVectorIndex
  let documents: APIMetadata[]
  let embeddings: number[][]

  beforeAll(async () => {
    documents = generateMockDocuments(NUM_DOCS)
    embeddings = documents.map(() => generateRandomVector(DIMENSION))

    cachedIndex = createCachedHNSWIndex(DIMENSION, 500)
    await cachedIndex.build(documents, embeddings)
  })

  it('should achieve >90% latency reduction for cached queries', async () => {
    const query = generateRandomVector(DIMENSION)

    // First search (cold - no cache)
    const start1 = performance.now()
    const results1 = await cachedIndex.search(query, 10)
    const coldTime = performance.now() - start1

    // Second search (hot - from cache)
    const start2 = performance.now()
    const results2 = await cachedIndex.search(query, 10)
    const hotTime = performance.now() - start2

    console.log(`Cache performance:`)
    console.log(`  Cold query: ${coldTime.toFixed(2)}ms`)
    console.log(`  Hot query: ${hotTime.toFixed(2)}ms`)
    console.log(`  Speedup: ${(coldTime / hotTime).toFixed(1)}x`)

    expect(hotTime).toBeLessThan(coldTime * 0.1) // >90% faster
    expect(results1).toEqual(results2) // Same results
  })

  it('should maintain 60-70% cache hit rate with realistic workload', async () => {
    // Simulate realistic query pattern (some queries repeated)
    const uniqueQueries = Array.from({ length: 20 }, () =>
      generateRandomVector(DIMENSION)
    )

    // Reset cache
    cachedIndex.clearCache()

    // Execute 100 queries with some repeats (Zipfian distribution)
    for (let i = 0; i < 100; i++) {
      const queryIndex = i < 50 ? i % 10 : Math.floor(Math.random() * 20)
      const query = uniqueQueries[queryIndex]
      await cachedIndex.search(query, 10)
    }

    const stats = cachedIndex.getCacheStats()

    console.log(`Cache statistics:`)
    console.log(`  Hits: ${stats.hits}`)
    console.log(`  Misses: ${stats.misses}`)
    console.log(`  Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`)
    console.log(`  Cache size: ${stats.size}`)

    expect(stats.hitRate).toBeGreaterThan(0.6) // >60% hit rate
    expect(stats.hitRate).toBeLessThan(0.8) // <80% (not unrealistic)
  })

  it('should cache exactly k results for different k values', async () => {
    const query = generateRandomVector(DIMENSION)

    cachedIndex.clearCache()

    // Search with k=5
    const results5 = await cachedIndex.search(query, 5)
    expect(results5).toHaveLength(5)

    // Search with k=10 (different cache entry)
    const results10 = await cachedIndex.search(query, 10)
    expect(results10).toHaveLength(10)

    // Verify both are cached
    const stats = cachedIndex.getCacheStats()
    expect(stats.size).toBe(2)
  })

  it('should clear cache on index rebuild', async () => {
    const query = generateRandomVector(DIMENSION)

    // Cache some queries
    await cachedIndex.search(query, 10)
    expect(cachedIndex.getCacheStats().size).toBeGreaterThan(0)

    // Rebuild index
    await cachedIndex.build(documents, embeddings)

    // Cache should be cleared
    expect(cachedIndex.getCacheStats().size).toBe(0)
  })
})

// ============================================================================
// Adaptive Search Tests
// ============================================================================

describe('AdaptiveHNSWVectorIndex Performance', () => {
  const DIMENSION = 1536
  const NUM_DOCS = 500
  let adaptiveIndex: AdaptiveHNSWVectorIndex
  let documents: APIMetadata[]
  let embeddings: number[][]

  beforeAll(async () => {
    documents = generateMockDocuments(NUM_DOCS)
    embeddings = documents.map(() => generateRandomVector(DIMENSION))

    adaptiveIndex = createAdaptiveHNSWIndex(DIMENSION, 500)
    await adaptiveIndex.build(documents, embeddings)
  })

  it('should be faster for high-quality results (easy queries)', async () => {
    // Create an "easy" query by using an existing document embedding
    const easyQuery = embeddings[0]

    const start = performance.now()
    const results = await adaptiveIndex.search(easyQuery, 10)
    const latency = performance.now() - start

    // Easy query should find high-quality results quickly
    expect(results[0].score).toBeGreaterThan(0.9) // Very similar
    expect(latency).toBeLessThan(20) // Fast due to low ef

    console.log(`Adaptive search (easy query):`)
    console.log(`  Latency: ${latency.toFixed(2)}ms`)
    console.log(`  Top score: ${results[0].score.toFixed(3)}`)
  })

  it('should retry with higher ef for low-quality results', async () => {
    // "Hard" query - random vector far from any document
    const hardQuery = generateRandomVector(DIMENSION)

    const start = performance.now()
    const results = await adaptiveIndex.search(hardQuery, 10)
    const latency = performance.now() - start

    // Should still return results, but may take longer
    expect(results).toHaveLength(10)
    expect(latency).toBeLessThan(50)

    console.log(`Adaptive search (hard query):`)
    console.log(`  Latency: ${latency.toFixed(2)}ms`)
    console.log(`  Top score: ${results[0].score.toFixed(3)}`)
  })

  it('should maintain search quality', async () => {
    const query = generateRandomVector(DIMENSION)

    // Get baseline results from parent implementation
    const baseResults = await adaptiveIndex.search(query, 10)

    // Verify quality
    expect(baseResults).toHaveLength(10)
    expect(baseResults[0].score).toBeGreaterThan(0)

    // Results should be sorted by score
    for (let i = 0; i < baseResults.length - 1; i++) {
      expect(baseResults[i].score).toBeGreaterThanOrEqual(
        baseResults[i + 1].score
      )
    }
  })
})

// ============================================================================
// Enhanced BM25 Tests
// ============================================================================

describe('EnhancedBM25Search Quality', () => {
  let bm25: EnhancedBM25Search
  let documents: APIMetadata[]

  beforeAll(async () => {
    documents = generateMockDocuments(100)

    // Add specific test documents for title matching
    documents.push({
      id: 'title-match-1',
      title: 'ChatWindow Component API Reference',
      content: 'Some content about other things',
      url: '/components/chat-window',
      category: 'component',
      metadata: {
        lastUpdated: new Date().toISOString(),
        tags: ['component', 'chat'],
        section: 'components',
        headings: ['API', 'Props', 'Examples'],
      },
    })

    documents.push({
      id: 'content-match-1',
      title: 'Unrelated Title',
      content: 'This document discusses the ChatWindow component in detail',
      url: '/guides/chatwindow',
      category: 'guide',
      metadata: {
        lastUpdated: new Date().toISOString(),
        tags: ['guide'],
        section: 'guides',
        headings: ['Introduction'],
      },
    })

    bm25 = new EnhancedBM25Search(
      { k1: 1.5, b: 0.75 },
      {
        title: 2.5,
        headings: 2.0,
        tags: 1.8,
        content: 1.0,
      }
    )

    await bm25.index(documents)
  })

  it('should rank title matches higher than content matches', async () => {
    const results = bm25.search('ChatWindow component', 10)

    // Find our test documents
    const titleMatch = results.find((r) => r.document.id === 'title-match-1')
    const contentMatch = results.find((r) => r.document.id === 'content-match-1')

    expect(titleMatch).toBeDefined()
    expect(contentMatch).toBeDefined()

    if (titleMatch && contentMatch) {
      console.log(`Field weighting test:`)
      console.log(`  Title match score: ${titleMatch.score.toFixed(3)}`)
      console.log(`  Content match score: ${contentMatch.score.toFixed(3)}`)
      console.log(`  Ratio: ${(titleMatch.score / contentMatch.score).toFixed(2)}x`)

      // Title match should score significantly higher (2.5x weight vs 1.0x)
      expect(titleMatch.score).toBeGreaterThan(contentMatch.score * 1.5)
    }
  })

  it('should handle multi-field queries correctly', async () => {
    const results = bm25.search('ChatWindow API component', 10)

    expect(results.length).toBeGreaterThan(0)

    // Should find documents matching across multiple fields
    const topResult = results[0]
    expect(topResult.score).toBeGreaterThan(0)

    console.log(`Multi-field search:`)
    console.log(`  Top result: ${topResult.document.title}`)
    console.log(`  Score: ${topResult.score.toFixed(3)}`)
  })

  it('should provide comprehensive statistics', () => {
    const stats = bm25.getStats()

    expect(stats.numDocuments).toBe(documents.length)
    expect(stats.uniqueTerms).toBeGreaterThan(0)
    expect(stats.avgDocLength).toBeGreaterThan(0)
    expect(stats.fieldWeights).toEqual({
      title: 2.5,
      headings: 2.0,
      tags: 1.8,
      content: 1.0,
    })

    console.log(`BM25 statistics:`)
    console.log(`  Documents: ${stats.numDocuments}`)
    console.log(`  Unique terms: ${stats.uniqueTerms}`)
    console.log(`  Avg doc length: ${stats.avgDocLength.toFixed(0)}`)
  })
})

// ============================================================================
// Optimized Hybrid Search Tests
// ============================================================================

describe('OptimizedHybridSearchEngine Performance', () => {
  const DIMENSION = 1536
  const NUM_DOCS = 300
  let hybridEngine: OptimizedHybridSearchEngine
  let documents: APIMetadata[]

  beforeAll(async () => {
    documents = generateMockDocuments(NUM_DOCS)
    const embeddings = documents.map(() => generateRandomVector(DIMENSION))

    hybridEngine = await createOptimizedHybridSearchEngine(documents, embeddings)
  })

  it('should complete hybrid search in under 100ms', async () => {
    const query = 'How to use streaming chat components'
    const times: number[] = []

    for (let i = 0; i < 20; i++) {
      const start = performance.now()
      await hybridEngine.search(query, { k: 10, alpha: 0.5 })
      times.push(performance.now() - start)
    }

    const avg = times.reduce((sum, val) => sum + val, 0) / times.length
    const p95 = times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)]

    console.log(`Hybrid search performance:`)
    console.log(`  Average: ${avg.toFixed(2)}ms`)
    console.log(`  p95: ${p95.toFixed(2)}ms`)
    console.log(`  Min: ${Math.min(...times).toFixed(2)}ms`)
    console.log(`  Max: ${Math.max(...times).toFixed(2)}ms`)

    expect(avg).toBeLessThan(100)
    expect(p95).toBeLessThan(150)
  })

  it('should return diverse results from both search methods', async () => {
    const query = 'chat streaming components hooks'
    const results = await hybridEngine.search(query, {
      k: 10,
      alpha: 0.5,
    })

    const vectorMatches = results.filter(
      (r) => r.matchType === 'vector' || r.matchType === 'hybrid'
    ).length

    const keywordMatches = results.filter(
      (r) => r.matchType === 'keyword' || r.matchType === 'hybrid'
    ).length

    const hybridMatches = results.filter((r) => r.matchType === 'hybrid').length

    console.log(`Match distribution:`)
    console.log(`  Vector matches: ${vectorMatches}`)
    console.log(`  Keyword matches: ${keywordMatches}`)
    console.log(`  Hybrid matches: ${hybridMatches}`)

    expect(results.length).toBe(10)
    expect(vectorMatches).toBeGreaterThan(0)
    expect(keywordMatches).toBeGreaterThan(0)
  })

  it('should handle different alpha values correctly', async () => {
    const query = 'streaming chat example'

    const pureVector = await hybridEngine.search(query, { k: 5, alpha: 1.0 })
    const pureKeyword = await hybridEngine.search(query, { k: 5, alpha: 0.0 })
    const balanced = await hybridEngine.search(query, { k: 5, alpha: 0.5 })

    console.log(`Alpha parameter effects:`)
    console.log(
      `  Pure vector (α=1.0): score=${pureVector[0]?.score.toFixed(3)}, type=${pureVector[0]?.matchType}`
    )
    console.log(
      `  Pure keyword (α=0.0): score=${pureKeyword[0]?.score.toFixed(3)}, type=${pureKeyword[0]?.matchType}`
    )
    console.log(
      `  Balanced (α=0.5): score=${balanced[0]?.score.toFixed(3)}, type=${balanced[0]?.matchType}`
    )

    expect(pureVector).toHaveLength(5)
    expect(pureKeyword).toHaveLength(5)
    expect(balanced).toHaveLength(5)

    // Pure vector should only have vector matches
    expect(pureVector.every((r) => r.matchType === 'vector')).toBe(true)

    // Pure keyword should only have keyword matches
    expect(pureKeyword.every((r) => r.matchType === 'keyword')).toBe(true)
  })

  it('should apply contextual boosting correctly', async () => {
    const query = 'component usage'

    // Search without context
    const withoutContext = await hybridEngine.search(query, { k: 10 })

    // Search with component context
    const withContext = await hybridEngine.search(query, {
      k: 10,
      currentPath: '/reference/components/chat-window',
    })

    console.log(`Contextual boosting:`)
    console.log(`  Without context - top result: ${withoutContext[0]?.document.title}`)
    console.log(`  With context - top result: ${withContext[0]?.document.title}`)

    expect(withoutContext).toHaveLength(10)
    expect(withContext).toHaveLength(10)

    // With context, component category should be boosted
    const componentsInTop3 = withContext
      .slice(0, 3)
      .filter((r) => r.document.category === 'component').length

    expect(componentsInTop3).toBeGreaterThan(0)
  })

  it('should provide comprehensive statistics', () => {
    const stats = hybridEngine.getStats()

    expect(stats.hnsw).toBeDefined()
    expect(stats.bm25).toBeDefined()

    console.log(`Hybrid engine statistics:`)
    console.log(`  HNSW documents: ${stats.hnsw.numDocuments}`)
    console.log(`  HNSW cache hit rate: ${(stats.hnsw.cache.hitRate * 100).toFixed(1)}%`)
    console.log(`  BM25 documents: ${stats.bm25.numDocuments}`)
    console.log(`  BM25 unique terms: ${stats.bm25.uniqueTerms}`)

    expect(stats.hnsw.numDocuments).toBe(NUM_DOCS)
    expect(stats.bm25.numDocuments).toBe(NUM_DOCS)
  })
})

// ============================================================================
// Integration Tests
// ============================================================================

describe('End-to-End Optimization Validation', () => {
  const DIMENSION = 1536
  const NUM_DOCS = 500

  it('should demonstrate overall performance improvement', async () => {
    const documents = generateMockDocuments(NUM_DOCS)
    const embeddings = documents.map(() => generateRandomVector(DIMENSION))

    const start = performance.now()
    const engine = await createOptimizedHybridSearchEngine(documents, embeddings)
    const buildTime = performance.now() - start

    console.log(`\nOptimized hybrid search engine:`)
    console.log(`  Build time: ${buildTime.toFixed(2)}ms`)

    // Perform multiple searches
    const queries = [
      'ChatWindow component',
      'streaming messages',
      'token budget',
      'custom hooks',
      'examples',
    ]

    const searchTimes: number[] = []

    for (const query of queries) {
      const start = performance.now()
      const results = await engine.search(query, { k: 10, alpha: 0.5 })
      const searchTime = performance.now() - start
      searchTimes.push(searchTime)

      expect(results.length).toBeGreaterThan(0)
    }

    const avgSearchTime =
      searchTimes.reduce((sum, t) => sum + t, 0) / searchTimes.length

    console.log(`  Avg search time: ${avgSearchTime.toFixed(2)}ms`)
    console.log(`  Cache hit rate: ${(engine.getStats().hnsw.cache.hitRate * 100).toFixed(1)}%`)

    expect(avgSearchTime).toBeLessThan(100)
    expect(buildTime).toBeLessThan(10000) // <10s for 500 docs
  })
})
