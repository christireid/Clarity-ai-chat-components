/**
 * RAG End-to-End Pipeline Tests
 *
 * Tests the complete RAG pipeline from query to response:
 * 1. Query processing
 * 2. Hybrid search (keyword + semantic)
 * 3. Result fusion and reranking
 * 4. Context building
 * 5. Response generation validation
 */

import { describe, it, expect, beforeAll, vi } from 'vitest'
import {
  hybridSearch,
  generateEnhancedRAGContext,
  buildEnhancedContext,
  shouldUseEnhancedRAG,
  getEnhancedFollowUps,
  formatEnhancedCitations,
  type HybridSearchResult,
  type EnhancedRAGContext,
} from '../../lib/ai/ragOptimized'

// ============================================================================
// Mock Setup
// ============================================================================

// Mock the vector store and keyword search
vi.mock('../../lib/ai/vectorStore', () => ({
  getVectorStore: vi.fn(() => ({
    initialize: vi.fn(),
    search: vi.fn((embedding: number[], topK: number) => {
      // Return mock semantic search results
      return Promise.resolve([
        {
          id: 'semantic-1',
          title: 'Semantic Result 1',
          content: 'Content found through semantic search',
          url: '/semantic/1',
          category: 'guide',
          score: 0.92,
          metadata: {
            lastUpdated: new Date().toISOString(),
            tags: ['semantic', 'ai'],
          },
        },
        {
          id: 'semantic-2',
          title: 'Semantic Result 2',
          content: 'Another semantic match',
          url: '/semantic/2',
          category: 'component',
          score: 0.85,
          metadata: {
            lastUpdated: new Date().toISOString(),
            tags: ['semantic'],
          },
        },
      ])
    }),
  })),
}))

vi.mock('../../lib/ai/keywordSearch', () => ({
  searchDocumentation: vi.fn((query: string, options: any) => {
    // Return mock keyword search results
    return [
      {
        chunk: {
          id: 'keyword-1',
          title: 'Keyword Result 1',
          content: 'Content found through keyword matching',
          url: '/keyword/1',
          category: 'hook',
          keywords: ['chat', 'provider', 'setup'],
          metadata: {
            lastUpdated: new Date().toISOString(),
            tags: ['keyword'],
          },
        },
        score: 8.5,
        matches: {
          title: 3,
          keywords: 2,
          content: 1.5,
          headings: 1,
        },
      },
      {
        chunk: {
          id: 'keyword-2',
          title: 'Keyword Result 2',
          content: 'Another keyword match',
          url: '/keyword/2',
          category: 'guide',
          keywords: ['streaming', 'real-time'],
          metadata: {
            lastUpdated: new Date().toISOString(),
            tags: ['keyword', 'streaming'],
          },
        },
        score: 7.2,
        matches: {
          title: 2,
          keywords: 1,
          content: 2.2,
          headings: 0,
        },
      },
    ]
  }),
  formatSearchResultsForRAG: vi.fn(),
}))

vi.mock('../../lib/ai/embeddings', () => ({
  generateEmbedding: vi.fn((text: string) => {
    // Return mock embedding
    return Promise.resolve(new Array(1536).fill(0.01))
  }),
  cosineSimilarity: vi.fn(() => 0.85),
}))

// ============================================================================
// Query Processing Tests
// ============================================================================

describe('Query Processing', () => {
  it('should identify queries that need RAG', () => {
    const ragQueries = [
      'How do I set up ChatProvider?',
      'What is the useChat hook?',
      'Show me an example of streaming',
      'Can I customize the chat window?',
      'Explain token optimization',
    ]

    ragQueries.forEach((query) => {
      expect(shouldUseEnhancedRAG(query)).toBe(true)
    })
  })

  it('should skip RAG for simple greetings', () => {
    const simpleQueries = ['hi', 'hello', 'thanks', 'thank you', 'ok', 'okay']

    simpleQueries.forEach((query) => {
      expect(shouldUseEnhancedRAG(query)).toBe(false)
    })
  })

  it('should skip RAG for system commands', () => {
    const commands = ['clear', 'reset', 'help']

    commands.forEach((query) => {
      expect(shouldUseEnhancedRAG(query)).toBe(false)
    })
  })

  it('should detect technical queries', () => {
    const technicalQueries = [
      'component props',
      'hook implementation',
      'api configuration',
      'error debugging',
    ]

    technicalQueries.forEach((query) => {
      expect(shouldUseEnhancedRAG(query)).toBe(true)
    })
  })
})

// ============================================================================
// Hybrid Search Tests
// ============================================================================

describe('Hybrid Search Pipeline', () => {
  it('should perform hybrid search successfully', async () => {
    const query = 'How to set up chat provider'

    const results = await hybridSearch(query, {
      topK: 5,
      retrieveK: 10,
      minScore: 0.3,
    })

    expect(results).toBeDefined()
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBeGreaterThan(0)
    expect(results.length).toBeLessThanOrEqual(5)
  })

  it('should combine keyword and semantic results', async () => {
    const query = 'streaming chat messages'

    const results = await hybridSearch(query, { topK: 10 })

    // Check that results have both search methods
    const hasKeyword = results.some((r) => r.matchedBy.includes('keyword'))
    const hasSemantic = results.some((r) => r.matchedBy.includes('semantic'))

    expect(hasKeyword).toBe(true)
    expect(hasSemantic).toBe(true)
  })

  it('should include hybrid matches (both methods)', async () => {
    const query = 'chat provider setup'

    const results = await hybridSearch(query, { topK: 10 })

    const hybridMatches = results.filter((r) => r.matchedBy.length === 2)

    // At least some results should match both methods
    expect(hybridMatches.length).toBeGreaterThan(0)
  })

  it('should calculate RRF scores correctly', async () => {
    const query = 'test query'

    const results = await hybridSearch(query, { topK: 5 })

    // All results should have RRF scores
    results.forEach((result) => {
      expect(result.rrfScore).toBeDefined()
      expect(result.rrfScore).toBeGreaterThan(0)
    })
  })

  it('should apply reranking when enabled', async () => {
    const query = 'chat component documentation'

    const withReranking = await hybridSearch(query, {
      topK: 5,
      enableReranking: true,
    })

    const withoutReranking = await hybridSearch(query, {
      topK: 5,
      enableReranking: false,
    })

    // With reranking, some results should have rerank scores
    const hasRerankScores = withReranking.some((r) => r.rerankScore !== undefined)
    expect(hasRerankScores).toBe(true)

    // Without reranking, no rerank scores
    const noRerankScores = withoutReranking.every((r) => r.rerankScore === undefined)
    expect(noRerankScores).toBe(true)
  })

  it('should apply MMR for diversity when enabled', async () => {
    const query = 'chat system guide'

    const withMMR = await hybridSearch(query, {
      topK: 5,
      enableMMR: true,
      mmrLambda: 0.7,
    })

    const withoutMMR = await hybridSearch(query, {
      topK: 5,
      enableMMR: false,
    })

    // Both should return results
    expect(withMMR.length).toBeGreaterThan(0)
    expect(withoutMMR.length).toBeGreaterThan(0)

    // Results might be ordered differently due to diversity
    // (Can't test exact order due to mocking, but verify structure)
    withMMR.forEach((result) => {
      expect(result.finalScore).toBeDefined()
    })
  })

  it('should respect minimum score threshold', async () => {
    const query = 'test query'

    const results = await hybridSearch(query, {
      topK: 10,
      minScore: 0.5,
    })

    // All results should meet minimum score
    results.forEach((result) => {
      expect(result.finalScore).toBeGreaterThanOrEqual(0.5)
    })
  })

  it('should respect topK limit', async () => {
    const query = 'chat documentation'

    const results3 = await hybridSearch(query, { topK: 3 })
    const results5 = await hybridSearch(query, { topK: 5 })
    const results10 = await hybridSearch(query, { topK: 10 })

    expect(results3.length).toBeLessThanOrEqual(3)
    expect(results5.length).toBeLessThanOrEqual(5)
    expect(results10.length).toBeLessThanOrEqual(10)
  })

  it('should sort results by final score', async () => {
    const query = 'chat provider'

    const results = await hybridSearch(query, { topK: 5 })

    // Results should be sorted in descending order
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].finalScore).toBeGreaterThanOrEqual(results[i + 1].finalScore)
    }
  })
})

// ============================================================================
// Context Building Tests
// ============================================================================

describe('Context Building', () => {
  const mockResults: HybridSearchResult[] = [
    {
      id: 'doc-1',
      title: 'ChatProvider Setup',
      content: 'The ChatProvider component manages chat state...',
      url: '/ref/chat-provider',
      category: 'component',
      score: 0.95,
      metadata: {
        lastUpdated: new Date().toISOString(),
        tags: ['component'],
      },
      keywordScore: 0.9,
      semanticScore: 0.95,
      rrfScore: 0.92,
      finalScore: 0.95,
      matchedBy: ['keyword', 'semantic'],
    },
    {
      id: 'doc-2',
      title: 'useChat Hook',
      content: 'The useChat hook provides message management...',
      url: '/ref/use-chat',
      category: 'hook',
      score: 0.88,
      metadata: {
        lastUpdated: new Date().toISOString(),
        tags: ['hook'],
      },
      keywordScore: 0.85,
      semanticScore: 0.88,
      rrfScore: 0.86,
      finalScore: 0.88,
      matchedBy: ['semantic'],
    },
  ]

  it('should build enhanced context from results', () => {
    const context = buildEnhancedContext(mockResults, 4000)

    expect(context).toContain('# Relevant Documentation')
    expect(context).toContain('ChatProvider Setup')
    expect(context).toContain('useChat Hook')
    expect(context).toContain('**Category:**')
    expect(context).toContain('**Relevance:**')
    expect(context).toContain('**URL:**')
  })

  it('should include match type badges', () => {
    const context = buildEnhancedContext(mockResults, 4000)

    expect(context).toContain('🎯') // Hybrid match badge
    expect(context).toContain('💡') // Semantic match badge
  })

  it('should respect max length limit', () => {
    const maxLength = 500
    const context = buildEnhancedContext(mockResults, maxLength)

    expect(context.length).toBeLessThanOrEqual(maxLength + 100) // Small buffer
  })

  it('should handle empty results gracefully', () => {
    const context = buildEnhancedContext([], 4000)

    expect(context).toContain('No relevant documentation found')
  })

  it('should truncate content when necessary', () => {
    const longResult: HybridSearchResult = {
      ...mockResults[0],
      content: 'a'.repeat(5000), // Very long content
    }

    const context = buildEnhancedContext([longResult], 2000)

    expect(context.length).toBeLessThan(2500)
    expect(context).toContain('[Truncated...]')
  })
})

// ============================================================================
// Enhanced RAG Context Generation Tests
// ============================================================================

describe('Enhanced RAG Context Generation', () => {
  it('should generate complete RAG context', async () => {
    const query = 'How to use ChatProvider?'

    const ragContext = await generateEnhancedRAGContext(query, {
      topK: 5,
      enableReranking: true,
      enableMMR: true,
    })

    expect(ragContext).toBeDefined()
    expect(ragContext.query).toBe(query)
    expect(ragContext.sources).toBeDefined()
    expect(ragContext.context).toBeDefined()
    expect(ragContext.systemPrompt).toBeDefined()
    expect(ragContext.stats).toBeDefined()
  })

  it('should include search statistics', async () => {
    const query = 'streaming implementation'

    const ragContext = await generateEnhancedRAGContext(query)

    expect(ragContext.stats.keywordResults).toBeGreaterThanOrEqual(0)
    expect(ragContext.stats.semanticResults).toBeGreaterThanOrEqual(0)
    expect(ragContext.stats.rrfApplied).toBe(true)
  })

  it('should indicate which optimizations were applied', async () => {
    const withOptimizations = await generateEnhancedRAGContext('test query', {
      enableReranking: true,
      enableMMR: true,
    })

    const withoutOptimizations = await generateEnhancedRAGContext('test query', {
      enableReranking: false,
      enableMMR: false,
    })

    expect(withOptimizations.stats.rerankingApplied).toBe(true)
    expect(withOptimizations.stats.mmrApplied).toBe(true)

    expect(withoutOptimizations.stats.rerankingApplied).toBe(false)
    expect(withoutOptimizations.stats.mmrApplied).toBe(false)
  })

  it('should include contextual system prompt', async () => {
    const ragContext = await generateEnhancedRAGContext('test query', {
      currentPath: '/reference/components',
    })

    expect(ragContext.systemPrompt).toContain('Relevant Documentation')
  })

  it('should handle current path context', async () => {
    const ragContext = await generateEnhancedRAGContext('component props', {
      currentPath: '/reference/components/chat-provider',
    })

    // Should boost results from same section
    expect(ragContext.sources.length).toBeGreaterThan(0)
  })
})

// ============================================================================
// Citation Formatting Tests
// ============================================================================

describe('Citation Formatting', () => {
  const mockResults: HybridSearchResult[] = [
    {
      id: 'doc-1',
      title: 'ChatProvider',
      content: 'Provider component documentation',
      url: '/ref/chat-provider',
      category: 'component',
      score: 0.95,
      metadata: {
        lastUpdated: new Date().toISOString(),
        tags: ['component'],
      },
      keywordScore: 0.9,
      semanticScore: 0.95,
      rrfScore: 0.92,
      finalScore: 0.95,
      matchedBy: ['keyword', 'semantic'],
    },
  ]

  it('should format citations for UI display', () => {
    const citations = formatEnhancedCitations(mockResults)

    expect(citations).toHaveLength(1)
    expect(citations[0]).toHaveProperty('id')
    expect(citations[0]).toHaveProperty('source')
    expect(citations[0]).toHaveProperty('chunkText')
    expect(citations[0]).toHaveProperty('url')
    expect(citations[0]).toHaveProperty('confidence')
    expect(citations[0]).toHaveProperty('matchedBy')
    expect(citations[0]).toHaveProperty('category')
  })

  it('should truncate long citation text', () => {
    const longResult: HybridSearchResult = {
      ...mockResults[0],
      content: 'a'.repeat(500),
    }

    const citations = formatEnhancedCitations([longResult])

    expect(citations[0].chunkText.length).toBeLessThanOrEqual(203) // 200 + "..."
  })

  it('should include match type information', () => {
    const citations = formatEnhancedCitations(mockResults)

    expect(citations[0].matchedBy).toContain('keyword')
    expect(citations[0].matchedBy).toContain('semantic')
  })

  it('should assign unique citation IDs', () => {
    const multiResults = [...mockResults, ...mockResults, ...mockResults]
    const citations = formatEnhancedCitations(multiResults)

    const ids = citations.map((c) => c.id)
    expect(new Set(ids).size).toBe(citations.length)
  })
})

// ============================================================================
// Follow-up Suggestions Tests
// ============================================================================

describe('Follow-up Suggestions', () => {
  const mockResults: HybridSearchResult[] = [
    {
      id: 'doc-1',
      title: 'ChatProvider Component',
      content: 'Provider documentation',
      url: '/ref/chat-provider',
      category: 'component',
      score: 0.95,
      metadata: {
        lastUpdated: new Date().toISOString(),
        tags: ['component'],
      },
      keywordScore: 0.9,
      semanticScore: 0.95,
      rrfScore: 0.92,
      finalScore: 0.95,
      matchedBy: ['keyword', 'semantic'],
    },
    {
      id: 'doc-2',
      title: 'Streaming Guide',
      content: 'Streaming implementation',
      url: '/guide/streaming',
      category: 'guide',
      score: 0.85,
      metadata: {
        lastUpdated: new Date().toISOString(),
        tags: ['streaming'],
      },
      keywordScore: 0.8,
      semanticScore: 0.85,
      rrfScore: 0.82,
      finalScore: 0.85,
      matchedBy: ['semantic'],
    },
  ]

  it('should generate relevant follow-up questions', () => {
    const followUps = getEnhancedFollowUps(mockResults)

    expect(followUps).toBeDefined()
    expect(Array.isArray(followUps)).toBe(true)
    expect(followUps.length).toBeGreaterThan(0)
    expect(followUps.length).toBeLessThanOrEqual(3)
  })

  it('should generate component-specific suggestions', () => {
    const componentResults: HybridSearchResult[] = [
      {
        ...mockResults[0],
        category: 'component',
      },
    ]

    const followUps = getEnhancedFollowUps(componentResults)

    // Should include component-related suggestions
    expect(followUps.some((q) => q.includes('styling') || q.includes('props'))).toBe(
      true
    )
  })

  it('should generate hook-specific suggestions', () => {
    const hookResults: HybridSearchResult[] = [
      {
        ...mockResults[0],
        category: 'hook',
        title: 'useChat Hook',
      },
    ]

    const followUps = getEnhancedFollowUps(hookResults)

    // Should include hook-related suggestions
    expect(
      followUps.some((q) => q.includes('example') || q.includes('performance'))
    ).toBe(true)
  })

  it('should avoid duplicate suggestions', () => {
    const followUps = getEnhancedFollowUps(mockResults)

    const uniqueFollowUps = new Set(followUps)
    expect(uniqueFollowUps.size).toBe(followUps.length)
  })

  it('should handle empty results', () => {
    const followUps = getEnhancedFollowUps([])

    expect(followUps).toBeDefined()
    expect(Array.isArray(followUps)).toBe(true)
  })
})

// ============================================================================
// End-to-End Integration Tests
// ============================================================================

describe('End-to-End RAG Pipeline', () => {
  it('should execute complete pipeline successfully', async () => {
    const query = 'How do I implement streaming chat?'

    // Step 1: Generate RAG context
    const ragContext = await generateEnhancedRAGContext(query, {
      topK: 5,
      enableReranking: true,
      enableMMR: true,
    })

    // Step 2: Verify all components are present
    expect(ragContext.query).toBe(query)
    expect(ragContext.sources.length).toBeGreaterThan(0)
    expect(ragContext.context).toBeTruthy()
    expect(ragContext.systemPrompt).toBeTruthy()

    // Step 3: Generate citations
    const citations = formatEnhancedCitations(ragContext.sources)
    expect(citations.length).toBe(ragContext.sources.length)

    // Step 4: Generate follow-ups
    const followUps = getEnhancedFollowUps(ragContext.sources)
    expect(followUps.length).toBeGreaterThan(0)

    // Step 5: Verify statistics
    expect(ragContext.stats.rrfApplied).toBe(true)
    expect(ragContext.stats.rerankingApplied).toBe(true)
    expect(ragContext.stats.mmrApplied).toBe(true)
  })

  it('should handle queries with no relevant results', async () => {
    const query = 'xyz123 nonexistent feature'

    const ragContext = await generateEnhancedRAGContext(query, { topK: 5 })

    // Should still complete without errors
    expect(ragContext).toBeDefined()
    expect(ragContext.query).toBe(query)

    // Context should indicate no results
    if (ragContext.sources.length === 0) {
      expect(ragContext.context).toContain('No relevant documentation')
    }
  })

  it('should provide consistent results for similar queries', async () => {
    const query1 = 'chat provider setup'
    const query2 = 'set up ChatProvider component'

    const result1 = await generateEnhancedRAGContext(query1, { topK: 3 })
    const result2 = await generateEnhancedRAGContext(query2, { topK: 3 })

    // Should return similar sources (at least some overlap)
    const ids1 = result1.sources.map((s) => s.id)
    const ids2 = result2.sources.map((s) => s.id)

    const overlap = ids1.filter((id) => ids2.includes(id))
    expect(overlap.length).toBeGreaterThan(0)
  })

  it('should respect configuration options', async () => {
    const query = 'test query'

    const minimal = await generateEnhancedRAGContext(query, {
      topK: 2,
      enableReranking: false,
      enableMMR: false,
    })

    const maximal = await generateEnhancedRAGContext(query, {
      topK: 10,
      enableReranking: true,
      enableMMR: true,
    })

    expect(minimal.sources.length).toBeLessThanOrEqual(2)
    expect(maximal.sources.length).toBeGreaterThan(minimal.sources.length)

    expect(minimal.stats.rerankingApplied).toBe(false)
    expect(maximal.stats.rerankingApplied).toBe(true)
  })
})
