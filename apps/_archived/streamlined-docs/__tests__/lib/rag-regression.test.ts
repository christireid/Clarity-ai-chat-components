/**
 * RAG System Regression Tests
 *
 * Ensures improvements don't degrade quality. Tracks:
 * - Search quality metrics over time
 * - Performance regressions
 * - Feature completeness
 * - Bug fixes remain fixed
 */

import { describe, it, expect } from 'vitest'
import {
  hybridSearch,
  generateEnhancedRAGContext,
  shouldUseEnhancedRAG,
} from '../../lib/ai/ragOptimized'
import { validateCitations, detectHallucination } from '../../lib/ai/ragPrompts'

// ============================================================================
// Baseline Quality Metrics
// ============================================================================

const BASELINE_METRICS = {
  // Version when baseline was established
  version: '1.0.0',
  date: '2026-01-27',

  // Quality metrics
  minPrecision: 0.6,
  minRecall: 0.7,
  minMRR: 0.8,
  minNDCG: 0.75,

  // Performance metrics
  maxP50Latency: 100, // ms
  maxP95Latency: 250, // ms
  maxP99Latency: 500, // ms

  // Feature completeness
  requiredFeatures: [
    'keyword_search',
    'semantic_search',
    'hybrid_fusion',
    'reranking',
    'mmr_diversity',
    'citation_tracking',
    'hallucination_detection',
  ],
}

// ============================================================================
// Known Good Queries (Historical Test Cases)
// ============================================================================

interface RegressionTestCase {
  id: string
  query: string
  expectedTopResult?: string
  minScore?: number
  minResults?: number
  description: string
  addedInVersion: string
}

const REGRESSION_TEST_CASES: RegressionTestCase[] = [
  {
    id: 'basic-component-query',
    query: 'How do I use ChatProvider?',
    expectedTopResult: 'chat-provider',
    minScore: 0.7,
    minResults: 3,
    description: 'Basic component query should return relevant docs',
    addedInVersion: '1.0.0',
  },
  {
    id: 'streaming-functionality',
    query: 'implement streaming responses',
    expectedTopResult: 'streaming',
    minScore: 0.6,
    minResults: 2,
    description: 'Streaming queries should find streaming docs',
    addedInVersion: '1.0.0',
  },
  {
    id: 'hook-usage',
    query: 'useChat hook examples',
    minScore: 0.6,
    minResults: 2,
    description: 'Hook queries should return hook documentation',
    addedInVersion: '1.0.0',
  },
  {
    id: 'multi-concept',
    query: 'chat authentication with OAuth',
    minResults: 3,
    description: 'Multi-concept queries should return diverse results',
    addedInVersion: '1.0.0',
  },
  {
    id: 'optimization-query',
    query: 'reduce token costs and optimize performance',
    minScore: 0.5,
    minResults: 2,
    description: 'Optimization queries should find relevant guides',
    addedInVersion: '1.0.0',
  },
]

// ============================================================================
// Historical Bug Fixes
// ============================================================================

interface BugFix {
  id: string
  description: string
  fixedInVersion: string
  testCase: () => Promise<boolean>
}

const BUG_FIXES: BugFix[] = [
  {
    id: 'empty-query-crash',
    description: 'Empty queries should not crash the system',
    fixedInVersion: '1.0.0',
    testCase: async () => {
      try {
        const results = await hybridSearch('', { topK: 5 })
        return Array.isArray(results)
      } catch {
        return false
      }
    },
  },
  {
    id: 'special-chars-handling',
    description: 'Queries with special characters should be handled correctly',
    fixedInVersion: '1.0.0',
    testCase: async () => {
      try {
        const results = await hybridSearch('<ChatProvider> & configuration!', {
          topK: 5,
        })
        return results.length > 0
      } catch {
        return false
      }
    },
  },
  {
    id: 'duplicate-results',
    description: 'Results should not contain duplicates',
    fixedInVersion: '1.0.0',
    testCase: async () => {
      const results = await hybridSearch('chat provider setup', { topK: 10 })
      const ids = results.map((r) => r.id)
      return ids.length === new Set(ids).size
    },
  },
  {
    id: 'score-normalization',
    description: 'Scores should be normalized between 0 and 1',
    fixedInVersion: '1.0.0',
    testCase: async () => {
      const results = await hybridSearch('test query', { topK: 5 })
      return results.every((r) => r.finalScore >= 0 && r.finalScore <= 1)
    },
  },
  {
    id: 'greeting-detection',
    description: 'Simple greetings should skip RAG',
    fixedInVersion: '1.0.0',
    testCase: async () => {
      const greetings = ['hi', 'hello', 'thanks']
      return greetings.every((g) => !shouldUseEnhancedRAG(g))
    },
  },
]

// ============================================================================
// Regression Test Suite
// ============================================================================

describe('RAG System Regression Tests', () => {
  describe('Historical Test Cases', () => {
    REGRESSION_TEST_CASES.forEach((testCase) => {
      it(`should pass: ${testCase.id} - ${testCase.description}`, async () => {
        const results = await hybridSearch(testCase.query, { topK: 10 })

        // Check minimum results
        if (testCase.minResults) {
          expect(results.length).toBeGreaterThanOrEqual(testCase.minResults)
        }

        // Check minimum score
        if (testCase.minScore && results.length > 0) {
          expect(results[0].finalScore).toBeGreaterThanOrEqual(testCase.minScore)
        }

        // Check expected top result
        if (testCase.expectedTopResult && results.length > 0) {
          const hasExpectedResult = results
            .slice(0, 3)
            .some((r) => r.id.includes(testCase.expectedTopResult!))
          expect(hasExpectedResult).toBe(true)
        }
      })
    })
  })

  describe('Bug Fix Verification', () => {
    BUG_FIXES.forEach((bugFix) => {
      it(`should remain fixed: ${bugFix.id} - ${bugFix.description}`, async () => {
        const isPassing = await bugFix.testCase()
        expect(isPassing).toBe(true)
      })
    })
  })

  describe('Feature Completeness', () => {
    it('should have all required features implemented', async () => {
      const results = await hybridSearch('test query', {
        topK: 5,
        enableReranking: true,
        enableMMR: true,
      })

      // Check hybrid search (keyword + semantic)
      const hasKeyword = results.some((r) => r.matchedBy.includes('keyword'))
      const hasSemantic = results.some((r) => r.matchedBy.includes('semantic'))
      expect(hasKeyword || hasSemantic).toBe(true)

      // Check RRF fusion
      expect(results.every((r) => r.rrfScore !== undefined)).toBe(true)

      // Check reranking
      const hasReranking = results.some((r) => r.rerankScore !== undefined)
      expect(hasReranking).toBe(true)

      // Check final scores
      expect(results.every((r) => r.finalScore !== undefined)).toBe(true)
    })

    it('should support citation tracking', () => {
      const responseWithCitations = `According to [Source 1], you should use ChatProvider.
      **Sources:**
      [Source 1]: ChatProvider (/ref/chat-provider)`

      const validation = validateCitations(responseWithCitations, 1)
      expect(validation.isValid).toBe(true)
    })

    it('should support hallucination detection', () => {
      const context = 'ChatProvider component documentation'
      const response = 'Use the ChatProvider component from the library'

      const detection = detectHallucination(response, context)
      expect(detection.isLikelySafe).toBe(true)
    })
  })

  describe('Quality Baseline Maintenance', () => {
    it('should maintain minimum precision standards', async () => {
      // Test with known relevant query
      const results = await hybridSearch('ChatProvider component setup', {
        topK: 5,
      })

      // At least 60% of top 5 should be relevant
      const relevantCount = results.filter((r) => r.finalScore >= 0.6).length
      const precision = relevantCount / 5

      expect(precision).toBeGreaterThanOrEqual(BASELINE_METRICS.minPrecision)
    })

    it('should maintain search quality across query types', async () => {
      const queryTypes = [
        { type: 'component', query: 'ChatProvider component' },
        { type: 'hook', query: 'useChat hook' },
        { type: 'guide', query: 'streaming implementation guide' },
        { type: 'concept', query: 'token optimization strategies' },
      ]

      for (const { type, query } of queryTypes) {
        const results = await hybridSearch(query, { topK: 5 })

        // Each query type should return relevant results
        expect(results.length).toBeGreaterThan(0)
        expect(results[0].finalScore).toBeGreaterThan(0.5)
      }
    })

    it('should maintain ranking quality', async () => {
      const results = await hybridSearch('chat provider setup guide', { topK: 10 })

      // Results should be sorted by relevance
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].finalScore).toBeGreaterThanOrEqual(
          results[i + 1].finalScore
        )
      }

      // Top results should have high scores
      if (results.length > 0) {
        expect(results[0].finalScore).toBeGreaterThan(0.6)
      }
    })
  })

  describe('Performance Baseline Maintenance', () => {
    it('should not regress on search latency', async () => {
      const iterations = 20
      const latencies: number[] = []

      for (let i = 0; i < iterations; i++) {
        const start = performance.now()
        await hybridSearch('test query', { topK: 5 })
        latencies.push(performance.now() - start)
      }

      const p50 = latencies.sort((a, b) => a - b)[Math.floor(latencies.length * 0.5)]
      const p95 = latencies.sort((a, b) => a - b)[Math.floor(latencies.length * 0.95)]

      expect(p50).toBeLessThan(BASELINE_METRICS.maxP50Latency)
      expect(p95).toBeLessThan(BASELINE_METRICS.maxP95Latency)
    })

    it('should handle concurrent queries efficiently', async () => {
      const queries = Array.from({ length: 10 }, (_, i) => `query ${i}`)

      const start = performance.now()
      await Promise.all(queries.map((q) => hybridSearch(q, { topK: 5 })))
      const elapsed = performance.now() - start

      // Should complete in reasonable time
      expect(elapsed).toBeLessThan(1000) // 1 second for 10 concurrent queries
    })
  })

  describe('Edge Case Handling', () => {
    it('should handle empty queries gracefully', async () => {
      const results = await hybridSearch('', { topK: 5 })
      expect(Array.isArray(results)).toBe(true)
    })

    it('should handle very long queries', async () => {
      const longQuery = 'test '.repeat(500)
      const results = await hybridSearch(longQuery, { topK: 5 })
      expect(Array.isArray(results)).toBe(true)
    })

    it('should handle special characters', async () => {
      const queries = [
        '<ChatProvider>',
        'component & configuration',
        'hook | provider',
        'setup (advanced)',
      ]

      for (const query of queries) {
        const results = await hybridSearch(query, { topK: 5 })
        expect(Array.isArray(results)).toBe(true)
      }
    })

    it('should handle Unicode characters', async () => {
      const queries = ['chat 聊天', 'provider プロバイダー', 'hook крючок']

      for (const query of queries) {
        const results = await hybridSearch(query, { topK: 5 })
        expect(Array.isArray(results)).toBe(true)
      }
    })

    it('should handle queries with only stop words', async () => {
      const results = await hybridSearch('a the an of', { topK: 5 })
      expect(Array.isArray(results)).toBe(true)
    })

    it('should handle repeated words', async () => {
      const results = await hybridSearch('chat chat chat chat', { topK: 5 })
      expect(Array.isArray(results)).toBe(true)
    })
  })

  describe('Configuration Stability', () => {
    it('should handle various topK values', async () => {
      const topKValues = [1, 3, 5, 10, 20, 50]

      for (const k of topKValues) {
        const results = await hybridSearch('test query', { topK: k })
        expect(results.length).toBeLessThanOrEqual(k)
      }
    })

    it('should handle various score thresholds', async () => {
      const thresholds = [0.1, 0.3, 0.5, 0.7, 0.9]

      for (const threshold of thresholds) {
        const results = await hybridSearch('test query', {
          topK: 10,
          minScore: threshold,
        })
        results.forEach((r) => {
          expect(r.finalScore).toBeGreaterThanOrEqual(threshold)
        })
      }
    })

    it('should handle optimization toggles', async () => {
      const configs = [
        { enableReranking: true, enableMMR: true },
        { enableReranking: true, enableMMR: false },
        { enableReranking: false, enableMMR: true },
        { enableReranking: false, enableMMR: false },
      ]

      for (const config of configs) {
        const results = await hybridSearch('test query', { topK: 5, ...config })
        expect(Array.isArray(results)).toBe(true)
      }
    })
  })

  describe('Data Consistency', () => {
    it('should return consistent results for same query', async () => {
      const query = 'chat provider setup'

      const results1 = await hybridSearch(query, { topK: 5 })
      const results2 = await hybridSearch(query, { topK: 5 })

      // Should return same number of results
      expect(results1.length).toBe(results2.length)

      // Top results should be the same (order might vary slightly due to float precision)
      const ids1 = results1.map((r) => r.id).sort()
      const ids2 = results2.map((r) => r.id).sort()
      expect(ids1).toEqual(ids2)
    })

    it('should not return duplicate results', async () => {
      const results = await hybridSearch('test query', { topK: 10 })

      const ids = results.map((r) => r.id)
      const uniqueIds = new Set(ids)

      expect(ids.length).toBe(uniqueIds.size)
    })

    it('should include all required fields in results', async () => {
      const results = await hybridSearch('test query', { topK: 5 })

      results.forEach((result) => {
        expect(result).toHaveProperty('id')
        expect(result).toHaveProperty('title')
        expect(result).toHaveProperty('content')
        expect(result).toHaveProperty('url')
        expect(result).toHaveProperty('category')
        expect(result).toHaveProperty('score')
        expect(result).toHaveProperty('metadata')
        expect(result).toHaveProperty('keywordScore')
        expect(result).toHaveProperty('semanticScore')
        expect(result).toHaveProperty('rrfScore')
        expect(result).toHaveProperty('finalScore')
        expect(result).toHaveProperty('matchedBy')
      })
    })
  })

  describe('System Health Checks', () => {
    it('should complete end-to-end pipeline', async () => {
      const query = 'How to implement streaming chat?'

      const ragContext = await generateEnhancedRAGContext(query, {
        topK: 5,
        enableReranking: true,
        enableMMR: true,
      })

      // Verify all pipeline stages completed
      expect(ragContext.query).toBe(query)
      expect(ragContext.sources).toBeDefined()
      expect(ragContext.context).toBeDefined()
      expect(ragContext.systemPrompt).toBeDefined()
      expect(ragContext.stats).toBeDefined()
      expect(ragContext.stats.rrfApplied).toBe(true)
    })

    it('should maintain API compatibility', () => {
      // Verify API surface hasn't changed
      expect(typeof hybridSearch).toBe('function')
      expect(typeof generateEnhancedRAGContext).toBe('function')
      expect(typeof shouldUseEnhancedRAG).toBe('function')
    })

    it('should handle graceful degradation', async () => {
      // If semantic search fails, keyword search should still work
      // This is mocked in the implementation, so we just verify no crashes

      try {
        const results = await hybridSearch('test query', { topK: 5 })
        expect(Array.isArray(results)).toBe(true)
      } catch (error) {
        // Should not throw
        expect(error).toBeUndefined()
      }
    })
  })
})

// ============================================================================
// Improvement Tracking
// ============================================================================

describe('RAG Improvement Tracking', () => {
  it('should document current quality metrics', async () => {
    const testQueries = [
      'ChatProvider component',
      'useChat hook',
      'streaming implementation',
      'token optimization',
      'authentication setup',
    ]

    const allResults = await Promise.all(
      testQueries.map((q) => hybridSearch(q, { topK: 5 }))
    )

    const avgTopScore =
      allResults.reduce((sum, results) => {
        return sum + (results[0]?.finalScore || 0)
      }, 0) / testQueries.length

    const avgResultCount =
      allResults.reduce((sum, results) => sum + results.length, 0) /
      testQueries.length

    console.log('Current Quality Metrics:')
    console.log(`  Average top result score: ${avgTopScore.toFixed(3)}`)
    console.log(`  Average results per query: ${avgResultCount.toFixed(1)}`)
    console.log(`  Baseline version: ${BASELINE_METRICS.version}`)
    console.log(`  Baseline date: ${BASELINE_METRICS.date}`)

    // Verify we meet baseline
    expect(avgTopScore).toBeGreaterThan(0.6)
    expect(avgResultCount).toBeGreaterThan(2)
  })

  it('should track improvement percentage', async () => {
    // Compare against baseline metrics
    const query = 'chat provider setup'
    const results = await hybridSearch(query, { topK: 5 })

    const currentTopScore = results[0]?.finalScore || 0

    // Calculate improvement
    const baselineTopScore = 0.7 // Historical baseline
    const improvement =
      ((currentTopScore - baselineTopScore) / baselineTopScore) * 100

    console.log(`Quality improvement: ${improvement >= 0 ? '+' : ''}${improvement.toFixed(1)}%`)

    // Should not have regressed
    expect(currentTopScore).toBeGreaterThanOrEqual(baselineTopScore * 0.9) // Allow 10% tolerance
  })
})
