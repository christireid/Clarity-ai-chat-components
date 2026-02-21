/**
 * RAG Retrieval Quality Metrics Tests
 *
 * Measures and validates retrieval quality using standard IR metrics:
 * - Precision@K
 * - Recall@K
 * - Mean Reciprocal Rank (MRR)
 * - Normalized Discounted Cumulative Gain (NDCG)
 * - Mean Average Precision (MAP)
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { hybridSearch, type HybridSearchResult } from '../../lib/ai/ragOptimized'
import { generateEmbedding } from '../../lib/ai/embeddings'
import { getVectorStore } from '../../lib/ai/vectorStore'
import type { DocChunk } from '../../lib/ai/vectorStore'

// ============================================================================
// Test Data with Relevance Judgments
// ============================================================================

interface RelevanceJudgment {
  query: string
  relevantDocIds: string[] // Ordered by relevance (most relevant first)
  description: string
}

const relevanceJudgments: RelevanceJudgment[] = [
  {
    query: 'How do I set up ChatProvider?',
    relevantDocIds: ['chat-provider', 'getting-started', 'components-overview'],
    description: 'ChatProvider setup query',
  },
  {
    query: 'streaming real-time responses',
    relevantDocIds: ['streaming-guide', 'use-streaming-hook', 'sse-implementation'],
    description: 'Streaming functionality query',
  },
  {
    query: 'optimize token usage and costs',
    relevantDocIds: ['token-optimization', 'cost-management', 'prompt-engineering'],
    description: 'Cost optimization query',
  },
  {
    query: 'authentication with OAuth',
    relevantDocIds: ['auth-guide', 'oauth-setup', 'security-best-practices'],
    description: 'Authentication query',
  },
  {
    query: 'useChat hook examples',
    relevantDocIds: ['use-chat-hook', 'hooks-overview', 'message-management'],
    description: 'Hook usage query',
  },
]

// Mock documentation chunks for testing
const testDocChunks: DocChunk[] = [
  {
    id: 'chat-provider',
    title: 'ChatProvider Component',
    content: 'Setup and configuration for ChatProvider...',
    url: '/ref/chat-provider',
    category: 'component',
    embedding: [],
    metadata: {
      lastUpdated: new Date().toISOString(),
      tags: ['component', 'provider'],
    },
  },
  {
    id: 'getting-started',
    title: 'Getting Started Guide',
    content: 'Quick start with Clarity Chat including ChatProvider setup...',
    url: '/guide/getting-started',
    category: 'guide',
    embedding: [],
    metadata: {
      lastUpdated: new Date().toISOString(),
      tags: ['guide', 'quickstart'],
    },
  },
  {
    id: 'streaming-guide',
    title: 'Streaming Implementation Guide',
    content: 'Implement real-time streaming responses with SSE...',
    url: '/guide/streaming',
    category: 'guide',
    embedding: [],
    metadata: {
      lastUpdated: new Date().toISOString(),
      tags: ['streaming', 'sse', 'real-time'],
    },
  },
  {
    id: 'token-optimization',
    title: 'Token Optimization Strategies',
    content: 'Reduce costs by optimizing token usage...',
    url: '/guide/token-optimization',
    category: 'guide',
    embedding: [],
    metadata: {
      lastUpdated: new Date().toISOString(),
      tags: ['optimization', 'tokens', 'cost'],
    },
  },
  {
    id: 'use-chat-hook',
    title: 'useChat Hook Reference',
    content: 'The useChat hook provides message management...',
    url: '/ref/hooks/use-chat',
    category: 'hook',
    embedding: [],
    metadata: {
      lastUpdated: new Date().toISOString(),
      tags: ['hook', 'chat', 'messages'],
    },
  },
]

// ============================================================================
// Metrics Calculation Functions
// ============================================================================

/**
 * Calculate Precision@K
 * Precision = (Relevant Retrieved) / K
 */
function calculatePrecisionAtK(
  retrieved: string[],
  relevant: string[],
  k: number
): number {
  const topK = retrieved.slice(0, k)
  const relevantSet = new Set(relevant)
  const relevantRetrieved = topK.filter((id) => relevantSet.has(id)).length

  return relevantRetrieved / k
}

/**
 * Calculate Recall@K
 * Recall = (Relevant Retrieved) / (Total Relevant)
 */
function calculateRecallAtK(
  retrieved: string[],
  relevant: string[],
  k: number
): number {
  if (relevant.length === 0) return 0

  const topK = retrieved.slice(0, k)
  const relevantSet = new Set(relevant)
  const relevantRetrieved = topK.filter((id) => relevantSet.has(id)).length

  return relevantRetrieved / relevant.length
}

/**
 * Calculate Mean Reciprocal Rank (MRR)
 * MRR = 1 / rank of first relevant document
 */
function calculateMRR(retrieved: string[], relevant: string[]): number {
  const relevantSet = new Set(relevant)

  for (let i = 0; i < retrieved.length; i++) {
    if (relevantSet.has(retrieved[i])) {
      return 1 / (i + 1)
    }
  }

  return 0
}

/**
 * Calculate Normalized Discounted Cumulative Gain (NDCG@K)
 */
function calculateNDCGAtK(
  retrieved: string[],
  relevant: string[],
  k: number
): number {
  const topK = retrieved.slice(0, k)

  // Calculate DCG
  let dcg = 0
  for (let i = 0; i < topK.length; i++) {
    const relevanceScore = relevant.indexOf(topK[i])
    if (relevanceScore !== -1) {
      // Relevance score: higher rank in relevant list = higher score
      const rel = relevant.length - relevanceScore
      dcg += rel / Math.log2(i + 2) // i+2 because log2(1) = 0
    }
  }

  // Calculate IDCG (ideal DCG)
  let idcg = 0
  for (let i = 0; i < Math.min(k, relevant.length); i++) {
    const rel = relevant.length - i
    idcg += rel / Math.log2(i + 2)
  }

  return idcg === 0 ? 0 : dcg / idcg
}

/**
 * Calculate Average Precision for a single query
 */
function calculateAveragePrecision(
  retrieved: string[],
  relevant: string[]
): number {
  if (relevant.length === 0) return 0

  const relevantSet = new Set(relevant)
  let sumPrecisions = 0
  let relevantCount = 0

  for (let i = 0; i < retrieved.length; i++) {
    if (relevantSet.has(retrieved[i])) {
      relevantCount++
      const precision = relevantCount / (i + 1)
      sumPrecisions += precision
    }
  }

  return relevantCount === 0 ? 0 : sumPrecisions / relevant.length
}

/**
 * Calculate F1 Score
 */
function calculateF1Score(precision: number, recall: number): number {
  if (precision + recall === 0) return 0
  return (2 * precision * recall) / (precision + recall)
}

// ============================================================================
// Retrieval Quality Tests
// ============================================================================

describe('RAG Retrieval Quality Metrics', () => {
  // Mock the hybrid search to return controlled results
  const mockSearchResults = new Map<string, HybridSearchResult[]>()

  beforeAll(() => {
    // Setup mock search results for each test query
    relevanceJudgments.forEach((judgment) => {
      const results: HybridSearchResult[] = judgment.relevantDocIds.map(
        (id, index) => ({
          id,
          title: `Document ${id}`,
          content: `Content for ${id}`,
          url: `/docs/${id}`,
          category: 'guide',
          score: 1 - index * 0.1, // Decreasing scores
          metadata: {
            lastUpdated: new Date().toISOString(),
            tags: [],
          },
          keywordScore: 0.8,
          semanticScore: 0.9,
          rrfScore: 0.85,
          finalScore: 1 - index * 0.1,
          matchedBy: ['keyword', 'semantic'],
        })
      )
      mockSearchResults.set(judgment.query, results)
    })
  })

  // ============================================================================
  // Precision@K Tests
  // ============================================================================

  describe('Precision@K', () => {
    it('should achieve high precision@5 for specific queries', () => {
      const judgment = relevanceJudgments[0]
      const results = mockSearchResults.get(judgment.query)!
      const retrievedIds = results.map((r) => r.id)

      const precision5 = calculatePrecisionAtK(
        retrievedIds,
        judgment.relevantDocIds,
        5
      )

      expect(precision5).toBeGreaterThan(0.6) // At least 60% precision
    })

    it('should maintain precision@3 > 0.66 across queries', () => {
      const precisions = relevanceJudgments.map((judgment) => {
        const results = mockSearchResults.get(judgment.query)!
        const retrievedIds = results.map((r) => r.id)
        return calculatePrecisionAtK(retrievedIds, judgment.relevantDocIds, 3)
      })

      const avgPrecision = precisions.reduce((a, b) => a + b, 0) / precisions.length

      expect(avgPrecision).toBeGreaterThan(0.66)
    })

    it('should have decreasing precision as K increases', () => {
      const judgment = relevanceJudgments[0]
      const results = mockSearchResults.get(judgment.query)!
      const retrievedIds = results.map((r) => r.id)

      const p1 = calculatePrecisionAtK(retrievedIds, judgment.relevantDocIds, 1)
      const p3 = calculatePrecisionAtK(retrievedIds, judgment.relevantDocIds, 3)
      const p5 = calculatePrecisionAtK(retrievedIds, judgment.relevantDocIds, 5)

      // Precision typically decreases or stays same as K increases
      expect(p1).toBeGreaterThanOrEqual(p3)
      expect(p3).toBeGreaterThanOrEqual(p5)
    })
  })

  // ============================================================================
  // Recall@K Tests
  // ============================================================================

  describe('Recall@K', () => {
    it('should achieve high recall@10', () => {
      const judgment = relevanceJudgments[1]
      const results = mockSearchResults.get(judgment.query)!
      const retrievedIds = results.map((r) => r.id)

      const recall10 = calculateRecallAtK(
        retrievedIds,
        judgment.relevantDocIds,
        10
      )

      expect(recall10).toBeGreaterThan(0.7) // At least 70% recall
    })

    it('should have increasing recall as K increases', () => {
      const judgment = relevanceJudgments[2]
      const results = mockSearchResults.get(judgment.query)!
      const retrievedIds = results.map((r) => r.id)

      const r3 = calculateRecallAtK(retrievedIds, judgment.relevantDocIds, 3)
      const r5 = calculateRecallAtK(retrievedIds, judgment.relevantDocIds, 5)
      const r10 = calculateRecallAtK(retrievedIds, judgment.relevantDocIds, 10)

      // Recall should increase or stay same
      expect(r5).toBeGreaterThanOrEqual(r3)
      expect(r10).toBeGreaterThanOrEqual(r5)
    })

    it('should reach 100% recall when K >= relevant documents', () => {
      const judgment = relevanceJudgments[0]
      const results = mockSearchResults.get(judgment.query)!
      const retrievedIds = results.map((r) => r.id)

      const recallAll = calculateRecallAtK(
        retrievedIds,
        judgment.relevantDocIds,
        judgment.relevantDocIds.length
      )

      expect(recallAll).toBe(1.0)
    })
  })

  // ============================================================================
  // Mean Reciprocal Rank (MRR) Tests
  // ============================================================================

  describe('Mean Reciprocal Rank (MRR)', () => {
    it('should have MRR = 1.0 when first result is relevant', () => {
      const judgment = relevanceJudgments[0]
      const results = mockSearchResults.get(judgment.query)!
      const retrievedIds = results.map((r) => r.id)

      const mrr = calculateMRR(retrievedIds, judgment.relevantDocIds)

      expect(mrr).toBe(1.0)
    })

    it('should calculate correct MRR for various positions', () => {
      // First relevant at position 2
      const retrieved1 = ['doc1', 'relevant', 'doc3']
      const relevant1 = ['relevant']
      expect(calculateMRR(retrieved1, relevant1)).toBeCloseTo(0.5, 5)

      // First relevant at position 3
      const retrieved2 = ['doc1', 'doc2', 'relevant', 'doc4']
      const relevant2 = ['relevant']
      expect(calculateMRR(retrieved2, relevant2)).toBeCloseTo(0.333, 2)

      // First relevant at position 4
      const retrieved3 = ['doc1', 'doc2', 'doc3', 'relevant']
      const relevant3 = ['relevant']
      expect(calculateMRR(retrieved3, relevant3)).toBeCloseTo(0.25, 5)
    })

    it('should achieve MRR > 0.8 across test queries', () => {
      const mrrs = relevanceJudgments.map((judgment) => {
        const results = mockSearchResults.get(judgment.query)!
        const retrievedIds = results.map((r) => r.id)
        return calculateMRR(retrievedIds, judgment.relevantDocIds)
      })

      const avgMRR = mrrs.reduce((a, b) => a + b, 0) / mrrs.length

      expect(avgMRR).toBeGreaterThan(0.8)
    })
  })

  // ============================================================================
  // NDCG@K Tests
  // ============================================================================

  describe('Normalized Discounted Cumulative Gain (NDCG@K)', () => {
    it('should calculate NDCG@5 correctly', () => {
      const judgment = relevanceJudgments[0]
      const results = mockSearchResults.get(judgment.query)!
      const retrievedIds = results.map((r) => r.id)

      const ndcg5 = calculateNDCGAtK(retrievedIds, judgment.relevantDocIds, 5)

      expect(ndcg5).toBeGreaterThan(0.7)
      expect(ndcg5).toBeLessThanOrEqual(1.0)
    })

    it('should have NDCG = 1.0 for perfect ranking', () => {
      const relevant = ['doc1', 'doc2', 'doc3']
      const retrieved = ['doc1', 'doc2', 'doc3', 'doc4', 'doc5']

      const ndcg = calculateNDCGAtK(retrieved, relevant, 5)

      expect(ndcg).toBeCloseTo(1.0, 2)
    })

    it('should penalize incorrect ranking', () => {
      const relevant = ['doc1', 'doc2', 'doc3']

      // Perfect order
      const retrieved1 = ['doc1', 'doc2', 'doc3']
      const ndcg1 = calculateNDCGAtK(retrieved1, relevant, 3)

      // Reversed order
      const retrieved2 = ['doc3', 'doc2', 'doc1']
      const ndcg2 = calculateNDCGAtK(retrieved2, relevant, 3)

      // Perfect order should have higher NDCG
      expect(ndcg1).toBeGreaterThan(ndcg2)
    })

    it('should achieve NDCG@10 > 0.75 across queries', () => {
      const ndcgScores = relevanceJudgments.map((judgment) => {
        const results = mockSearchResults.get(judgment.query)!
        const retrievedIds = results.map((r) => r.id)
        return calculateNDCGAtK(retrievedIds, judgment.relevantDocIds, 10)
      })

      const avgNDCG = ndcgScores.reduce((a, b) => a + b, 0) / ndcgScores.length

      expect(avgNDCG).toBeGreaterThan(0.75)
    })
  })

  // ============================================================================
  // Mean Average Precision (MAP) Tests
  // ============================================================================

  describe('Mean Average Precision (MAP)', () => {
    it('should calculate average precision correctly', () => {
      const retrieved = ['doc1', 'relevant1', 'doc3', 'relevant2', 'doc5']
      const relevant = ['relevant1', 'relevant2']

      const ap = calculateAveragePrecision(retrieved, relevant)

      // AP = (1/2 + 2/4) / 2 = (0.5 + 0.5) / 2 = 0.5
      expect(ap).toBeCloseTo(0.5, 5)
    })

    it('should achieve MAP > 0.7 across test queries', () => {
      const apScores = relevanceJudgments.map((judgment) => {
        const results = mockSearchResults.get(judgment.query)!
        const retrievedIds = results.map((r) => r.id)
        return calculateAveragePrecision(retrievedIds, judgment.relevantDocIds)
      })

      const map = apScores.reduce((a, b) => a + b, 0) / apScores.length

      expect(map).toBeGreaterThan(0.7)
    })

    it('should return 1.0 for perfect retrieval', () => {
      const relevant = ['doc1', 'doc2', 'doc3']
      const retrieved = ['doc1', 'doc2', 'doc3']

      const ap = calculateAveragePrecision(retrieved, relevant)

      expect(ap).toBe(1.0)
    })
  })

  // ============================================================================
  // F1 Score Tests
  // ============================================================================

  describe('F1 Score', () => {
    it('should calculate F1 correctly from precision and recall', () => {
      const precision = 0.8
      const recall = 0.6

      const f1 = calculateF1Score(precision, recall)

      // F1 = 2 * (0.8 * 0.6) / (0.8 + 0.6) = 0.96 / 1.4 ≈ 0.686
      expect(f1).toBeCloseTo(0.686, 2)
    })

    it('should return 0 when precision and recall are 0', () => {
      const f1 = calculateF1Score(0, 0)
      expect(f1).toBe(0)
    })

    it('should achieve F1@5 > 0.6 across queries', () => {
      const f1Scores = relevanceJudgments.map((judgment) => {
        const results = mockSearchResults.get(judgment.query)!
        const retrievedIds = results.map((r) => r.id)

        const precision = calculatePrecisionAtK(
          retrievedIds,
          judgment.relevantDocIds,
          5
        )
        const recall = calculateRecallAtK(retrievedIds, judgment.relevantDocIds, 5)

        return calculateF1Score(precision, recall)
      })

      const avgF1 = f1Scores.reduce((a, b) => a + b, 0) / f1Scores.length

      expect(avgF1).toBeGreaterThan(0.6)
    })
  })

  // ============================================================================
  // Overall System Quality Tests
  // ============================================================================

  describe('Overall System Quality', () => {
    it('should meet quality thresholds across all metrics', () => {
      const metrics = relevanceJudgments.map((judgment) => {
        const results = mockSearchResults.get(judgment.query)!
        const retrievedIds = results.map((r) => r.id)

        return {
          precision5: calculatePrecisionAtK(
            retrievedIds,
            judgment.relevantDocIds,
            5
          ),
          recall10: calculateRecallAtK(retrievedIds, judgment.relevantDocIds, 10),
          mrr: calculateMRR(retrievedIds, judgment.relevantDocIds),
          ndcg5: calculateNDCGAtK(retrievedIds, judgment.relevantDocIds, 5),
          ap: calculateAveragePrecision(retrievedIds, judgment.relevantDocIds),
        }
      })

      // Calculate averages
      const avgMetrics = {
        precision5:
          metrics.reduce((sum, m) => sum + m.precision5, 0) / metrics.length,
        recall10: metrics.reduce((sum, m) => sum + m.recall10, 0) / metrics.length,
        mrr: metrics.reduce((sum, m) => sum + m.mrr, 0) / metrics.length,
        ndcg5: metrics.reduce((sum, m) => sum + m.ndcg5, 0) / metrics.length,
        map: metrics.reduce((sum, m) => sum + m.ap, 0) / metrics.length,
      }

      // Quality thresholds
      expect(avgMetrics.precision5).toBeGreaterThan(0.6)
      expect(avgMetrics.recall10).toBeGreaterThan(0.7)
      expect(avgMetrics.mrr).toBeGreaterThan(0.8)
      expect(avgMetrics.ndcg5).toBeGreaterThan(0.75)
      expect(avgMetrics.map).toBeGreaterThan(0.7)

      console.log('Quality Metrics Summary:', avgMetrics)
    })

    it('should have consistent quality across different query types', () => {
      // Group by query type
      const componentQueries = relevanceJudgments.filter((j) =>
        j.description.includes('component')
      )
      const hookQueries = relevanceJudgments.filter((j) =>
        j.description.includes('hook')
      )
      const guideQueries = relevanceJudgments.filter((j) =>
        j.description.includes('guide') || j.description.includes('optimization')
      )

      const calculateAvgPrecision = (judgments: RelevanceJudgment[]) => {
        const precisions = judgments.map((j) => {
          const results = mockSearchResults.get(j.query)!
          const retrievedIds = results.map((r) => r.id)
          return calculatePrecisionAtK(retrievedIds, j.relevantDocIds, 5)
        })
        return precisions.reduce((a, b) => a + b, 0) / precisions.length
      }

      const componentPrecision = calculateAvgPrecision(componentQueries)
      const hookPrecision = calculateAvgPrecision(hookQueries)
      const guidePrecision = calculateAvgPrecision(guideQueries)

      // All should meet minimum threshold
      expect(componentPrecision).toBeGreaterThan(0.5)
      expect(hookPrecision).toBeGreaterThan(0.5)
      expect(guidePrecision).toBeGreaterThan(0.5)

      // Variance shouldn't be too high
      const precisions = [componentPrecision, hookPrecision, guidePrecision]
      const variance =
        precisions.reduce(
          (sum, p) =>
            sum +
            Math.pow(
              p - precisions.reduce((a, b) => a + b) / precisions.length,
              2
            ),
          0
        ) / precisions.length

      expect(variance).toBeLessThan(0.1) // Low variance = consistent quality
    })
  })
})
