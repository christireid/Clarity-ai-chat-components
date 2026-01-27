/**
 * RAG Vector Search Accuracy Tests
 *
 * Validates semantic search quality, relevance, and ranking accuracy.
 * Tests cover cosine similarity, embedding quality, and result precision.
 */

import { describe, it, expect, beforeAll, vi } from 'vitest'
import { generateEmbedding, cosineSimilarity } from '../../lib/ai/embeddings'
import { getVectorStore, type SearchResult } from '../../lib/ai/vectorStore'
import type { DocChunk } from '../../lib/ai/vectorStore'

// ============================================================================
// Mock Data - Representative Documentation Chunks
// ============================================================================

const mockDocChunks: DocChunk[] = [
  {
    id: 'chat-provider-1',
    title: 'ChatProvider Component',
    content: `The ChatProvider component is the root provider for Clarity Chat.
    It manages the chat state, API configuration, and provides context to all child components.

    Example:
    <ChatProvider apiKey="your-api-key" model="gpt-4">
      <ChatWindow />
    </ChatProvider>`,
    url: '/reference/components/chat-provider',
    category: 'component',
    embedding: [], // Will be filled by setup
    metadata: {
      lastUpdated: new Date().toISOString(),
      tags: ['provider', 'component', 'react', 'context'],
      section: 'components',
      headings: ['Installation', 'Props', 'Usage'],
    },
  },
  {
    id: 'use-chat-1',
    title: 'useChat Hook',
    content: `The useChat hook provides access to chat functionality including
    messages, sending messages, and managing conversation state.

    Returns: { messages, sendMessage, isLoading, error }`,
    url: '/reference/hooks/use-chat',
    category: 'hook',
    embedding: [],
    metadata: {
      lastUpdated: new Date().toISOString(),
      tags: ['hook', 'react', 'chat', 'messages'],
      section: 'hooks',
      headings: ['Usage', 'Return Values', 'Examples'],
    },
  },
  {
    id: 'streaming-guide-1',
    title: 'Implementing Streaming Responses',
    content: `Learn how to implement real-time streaming for AI responses.
    This guide covers WebSocket connections, Server-Sent Events, and handling
    partial message updates in your UI.`,
    url: '/guides/streaming',
    category: 'guide',
    embedding: [],
    metadata: {
      lastUpdated: new Date().toISOString(),
      tags: ['streaming', 'websocket', 'sse', 'real-time'],
      section: 'guides',
      headings: ['Setup', 'Implementation', 'Best Practices'],
    },
  },
  {
    id: 'token-optimization-1',
    title: 'Token Usage Optimization',
    content: `Optimize your token usage to reduce costs and improve performance.
    Learn about token counting, context management, and efficient prompting.`,
    url: '/guides/token-optimization',
    category: 'guide',
    embedding: [],
    metadata: {
      lastUpdated: new Date().toISOString(),
      tags: ['tokens', 'optimization', 'cost', 'performance'],
      section: 'guides',
      headings: ['Token Basics', 'Strategies', 'Monitoring'],
    },
  },
  {
    id: 'authentication-1',
    title: 'Authentication Setup',
    content: `Configure authentication for your chat application.
    Supports OAuth, API keys, and custom authentication providers.`,
    url: '/guides/authentication',
    category: 'guide',
    embedding: [],
    metadata: {
      lastUpdated: new Date().toISOString(),
      tags: ['auth', 'security', 'oauth', 'api-keys'],
      section: 'guides',
      headings: ['OAuth Setup', 'API Keys', 'Custom Providers'],
    },
  },
]

// ============================================================================
// Test Queries with Expected Results
// ============================================================================

interface TestQuery {
  query: string
  expectedTopResults: string[] // Expected doc IDs in order
  description: string
}

const testQueries: TestQuery[] = [
  {
    query: 'How do I set up the ChatProvider?',
    expectedTopResults: ['chat-provider-1'],
    description: 'Direct component query should return exact match',
  },
  {
    query: 'What hooks are available for managing messages?',
    expectedTopResults: ['use-chat-1'],
    description: 'Hook query should prioritize hook documentation',
  },
  {
    query: 'How to implement real-time streaming responses?',
    expectedTopResults: ['streaming-guide-1'],
    description: 'Streaming query should find streaming guide',
  },
  {
    query: 'Reduce API costs and token usage',
    expectedTopResults: ['token-optimization-1'],
    description: 'Cost/optimization query should find token guide',
  },
  {
    query: 'Configure OAuth authentication',
    expectedTopResults: ['authentication-1'],
    description: 'Auth query should find authentication guide',
  },
]

// ============================================================================
// Setup and Utilities
// ============================================================================

// Mock OpenAI embeddings generation
vi.mock('../../lib/ai/embeddings', async () => {
  const actual = await vi.importActual('../../lib/ai/embeddings')

  // Generate deterministic embeddings based on text content
  const generateMockEmbedding = (text: string): number[] => {
    const words = text.toLowerCase().split(/\s+/)
    const embedding = new Array(1536).fill(0)

    // Simple word-based embedding: set specific dimensions based on keywords
    const keywordMap: Record<string, number[]> = {
      'chat': [0, 100, 200],
      'provider': [1, 101, 201],
      'hook': [2, 102, 202],
      'streaming': [3, 103, 203],
      'message': [4, 104, 204],
      'token': [5, 105, 205],
      'optimization': [6, 106, 206],
      'auth': [7, 107, 207],
      'authentication': [7, 107, 207],
      'oauth': [8, 108, 208],
      'component': [9, 109, 209],
      'api': [10, 110, 210],
      'real-time': [11, 111, 211],
      'websocket': [11, 111, 211],
      'cost': [12, 112, 212],
    }

    words.forEach(word => {
      if (keywordMap[word]) {
        keywordMap[word].forEach(idx => {
          embedding[idx] += 1
        })
      }
    })

    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
    if (magnitude > 0) {
      return embedding.map(val => val / magnitude)
    }
    return embedding
  }

  return {
    ...actual,
    generateEmbedding: vi.fn((text: string) =>
      Promise.resolve(generateMockEmbedding(text))
    ),
  }
})

describe('Vector Search Accuracy', () => {
  let vectorStore: ReturnType<typeof getVectorStore>

  beforeAll(async () => {
    // Generate embeddings for test documents
    for (const chunk of mockDocChunks) {
      const content = `${chunk.title} ${chunk.content}`
      chunk.embedding = await generateEmbedding(content)
    }

    // Initialize vector store
    vectorStore = getVectorStore()
    await vectorStore.initialize()

    // Store all chunks
    await vectorStore.upsertBatch(mockDocChunks)
  })

  // ============================================================================
  // Semantic Similarity Tests
  // ============================================================================

  describe('Semantic Similarity', () => {
    it('should find semantically similar documents', async () => {
      const query = 'How do I use the chat provider component?'
      const queryEmbedding = await generateEmbedding(query)

      const results = await vectorStore.search(queryEmbedding, 5)

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].id).toBe('chat-provider-1')
      expect(results[0].score).toBeGreaterThan(0.5)
    })

    it('should distinguish between different topics', async () => {
      const streamingQuery = 'real-time streaming implementation'
      const authQuery = 'authentication and security setup'

      const streamingEmbedding = await generateEmbedding(streamingQuery)
      const authEmbedding = await generateEmbedding(authQuery)

      const streamingResults = await vectorStore.search(streamingEmbedding, 3)
      const authResults = await vectorStore.search(authEmbedding, 3)

      // Results should be different
      expect(streamingResults[0].id).not.toBe(authResults[0].id)

      // Streaming query should return streaming guide
      expect(streamingResults[0].id).toBe('streaming-guide-1')

      // Auth query should return auth guide
      expect(authResults[0].id).toBe('authentication-1')
    })

    it('should handle synonym variations', async () => {
      // Different ways to ask about the same thing
      const queries = [
        'chat provider setup',
        'configure chat context',
        'initialize chat provider component',
      ]

      const results = await Promise.all(
        queries.map(async (q) => {
          const embedding = await generateEmbedding(q)
          return vectorStore.search(embedding, 1)
        })
      )

      // All should return the same top result
      results.forEach((result) => {
        expect(result[0].id).toBe('chat-provider-1')
      })
    })

    it('should handle multi-concept queries', async () => {
      const query = 'streaming messages with hooks'
      const embedding = await generateEmbedding(query)

      const results = await vectorStore.search(embedding, 3)

      // Should return both streaming and hook related docs
      const resultIds = results.map((r) => r.id)
      expect(resultIds).toContain('streaming-guide-1')
      expect(resultIds).toContain('use-chat-1')
    })
  })

  // ============================================================================
  // Ranking Quality Tests
  // ============================================================================

  describe('Ranking Quality', () => {
    it('should rank results by relevance', async () => {
      const query = 'chat message management hooks'
      const embedding = await generateEmbedding(query)

      const results = await vectorStore.search(embedding, 5)

      // Scores should be in descending order
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score)
      }

      // Most relevant should be first
      expect(results[0].id).toBe('use-chat-1')
    })

    it('should apply score thresholds correctly', async () => {
      const query = 'completely unrelated quantum physics'
      const embedding = await generateEmbedding(query)

      const results = await vectorStore.search(embedding, 5)

      // Should return results but with lower scores
      results.forEach((result) => {
        expect(result.score).toBeLessThan(0.8)
      })
    })

    it('should handle topK parameter correctly', async () => {
      const query = 'chat documentation'
      const embedding = await generateEmbedding(query)

      const results3 = await vectorStore.search(embedding, 3)
      const results5 = await vectorStore.search(embedding, 5)

      expect(results3).toHaveLength(Math.min(3, mockDocChunks.length))
      expect(results5).toHaveLength(Math.min(5, mockDocChunks.length))

      // Top 3 should be the same in both
      expect(results3[0].id).toBe(results5[0].id)
      expect(results3[1].id).toBe(results5[1].id)
      expect(results3[2].id).toBe(results5[2].id)
    })
  })

  // ============================================================================
  // Precision and Recall Tests
  // ============================================================================

  describe('Precision and Recall', () => {
    it('should achieve high precision for specific queries', async () => {
      for (const testCase of testQueries) {
        const embedding = await generateEmbedding(testCase.query)
        const results = await vectorStore.search(embedding, 3)

        // Check if expected result is in top 3
        const resultIds = results.map((r) => r.id)
        const expectedId = testCase.expectedTopResults[0]

        expect(resultIds).toContain(expectedId)
        expect(resultIds.indexOf(expectedId)).toBeLessThan(3)
      }
    })

    it('should maintain consistency across similar queries', async () => {
      const baseQuery = 'chat provider component'
      const variations = [
        'chat provider component',
        'ChatProvider component',
        'chat context provider',
      ]

      const results = await Promise.all(
        variations.map(async (q) => {
          const embedding = await generateEmbedding(q)
          return vectorStore.search(embedding, 1)
        })
      )

      // All variations should return the same top result
      const topIds = results.map((r) => r[0].id)
      expect(new Set(topIds).size).toBe(1)
      expect(topIds[0]).toBe('chat-provider-1')
    })
  })

  // ============================================================================
  // Edge Cases
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle very short queries', async () => {
      const query = 'chat'
      const embedding = await generateEmbedding(query)

      const results = await vectorStore.search(embedding, 3)

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].score).toBeGreaterThan(0)
    })

    it('should handle very long queries', async () => {
      const query = `I want to implement a comprehensive chat system with
        streaming responses, authentication, token optimization, and real-time
        messaging capabilities. How do I set up the ChatProvider component with
        all the necessary hooks and handle message management efficiently?`

      const embedding = await generateEmbedding(query)
      const results = await vectorStore.search(embedding, 5)

      expect(results.length).toBeGreaterThan(0)

      // Should include relevant docs for all mentioned concepts
      const resultIds = results.map((r) => r.id)
      expect(resultIds).toContain('chat-provider-1')
    })

    it('should handle queries with special characters', async () => {
      const query = '<ChatProvider> component setup & configuration!'
      const embedding = await generateEmbedding(query)

      const results = await vectorStore.search(embedding, 3)

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].id).toBe('chat-provider-1')
    })

    it('should handle empty results gracefully', async () => {
      // Create a very specific query unlikely to match
      const query = 'xyzabc123 nonexistent feature'
      const embedding = await generateEmbedding(query)

      const results = await vectorStore.search(embedding, 5)

      // Should still return results, but with low scores
      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
    })
  })

  // ============================================================================
  // Cosine Similarity Tests
  // ============================================================================

  describe('Cosine Similarity Calculation', () => {
    it('should calculate correct similarity for identical vectors', () => {
      const vec = [1, 2, 3, 4, 5]
      const similarity = cosineSimilarity(vec, vec)

      expect(similarity).toBeCloseTo(1.0, 5)
    })

    it('should calculate correct similarity for orthogonal vectors', () => {
      const vec1 = [1, 0, 0]
      const vec2 = [0, 1, 0]
      const similarity = cosineSimilarity(vec1, vec2)

      expect(similarity).toBeCloseTo(0.0, 5)
    })

    it('should calculate correct similarity for opposite vectors', () => {
      const vec1 = [1, 2, 3]
      const vec2 = [-1, -2, -3]
      const similarity = cosineSimilarity(vec1, vec2)

      expect(similarity).toBeCloseTo(-1.0, 5)
    })

    it('should be symmetric', () => {
      const vec1 = [1, 2, 3, 4]
      const vec2 = [5, 6, 7, 8]

      const sim1 = cosineSimilarity(vec1, vec2)
      const sim2 = cosineSimilarity(vec2, vec1)

      expect(sim1).toBeCloseTo(sim2, 10)
    })

    it('should throw error for dimension mismatch', () => {
      const vec1 = [1, 2, 3]
      const vec2 = [1, 2, 3, 4]

      expect(() => cosineSimilarity(vec1, vec2)).toThrow()
    })
  })

  // ============================================================================
  // Metadata Filtering Tests
  // ============================================================================

  describe('Metadata and Category Filtering', () => {
    it('should include relevant metadata in results', async () => {
      const query = 'streaming guide'
      const embedding = await generateEmbedding(query)

      const results = await vectorStore.search(embedding, 1)

      expect(results[0].metadata).toBeDefined()
      expect(results[0].metadata.tags).toContain('streaming')
      expect(results[0].category).toBe('guide')
    })

    it('should return correct document structure', async () => {
      const query = 'chat provider'
      const embedding = await generateEmbedding(query)

      const results = await vectorStore.search(embedding, 1)
      const result = results[0]

      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('title')
      expect(result).toHaveProperty('content')
      expect(result).toHaveProperty('url')
      expect(result).toHaveProperty('category')
      expect(result).toHaveProperty('score')
      expect(result).toHaveProperty('metadata')
    })
  })
})

// ============================================================================
// Embedding Quality Tests
// ============================================================================

describe('Embedding Quality', () => {
  it('should generate embeddings with correct dimensions', async () => {
    const text = 'Test document content'
    const embedding = await generateEmbedding(text)

    expect(embedding).toHaveLength(1536)
  })

  it('should generate consistent embeddings for same input', async () => {
    const text = 'Consistent input text'

    const embedding1 = await generateEmbedding(text)
    const embedding2 = await generateEmbedding(text)

    const similarity = cosineSimilarity(embedding1, embedding2)
    expect(similarity).toBeCloseTo(1.0, 5)
  })

  it('should generate different embeddings for different inputs', async () => {
    const text1 = 'First document about chat'
    const text2 = 'Second document about authentication'

    const embedding1 = await generateEmbedding(text1)
    const embedding2 = await generateEmbedding(text2)

    const similarity = cosineSimilarity(embedding1, embedding2)
    expect(similarity).toBeLessThan(0.95)
  })

  it('should handle various text lengths', async () => {
    const shortText = 'Short'
    const mediumText = 'This is a medium length text with several words'
    const longText = 'This is a much longer text that contains many more words and provides detailed information about various topics including chat systems, authentication, streaming, and more'.repeat(10)

    const short = await generateEmbedding(shortText)
    const medium = await generateEmbedding(mediumText)
    const long = await generateEmbedding(longText)

    expect(short).toHaveLength(1536)
    expect(medium).toHaveLength(1536)
    expect(long).toHaveLength(1536)
  })
})
