/**
 * RAGService - Retrieval-Augmented Generation Service
 *
 * Handles semantic search, embeddings, and context building for documentation.
 * This service is stateless and can be safely used across multiple requests.
 *
 * Responsibilities:
 * - Generate embeddings for queries
 * - Perform vector search
 * - Build context from retrieved documents
 * - Format citations
 * - Determine RAG eligibility
 *
 * Dependencies: None (stateless)
 *
 * @example
 * ```typescript
 * const ragService = new RAGService()
 * const context = await ragService.retrieveContext(query, {
 *   topK: 5,
 *   minScore: 0.7
 * })
 * ```
 */

import { generateEmbedding } from '../ai/embeddings'
import { getVectorStore, type SearchResult } from '../ai/vectorStore'
import { searchDocumentation } from '../ai/keywordSearch'

// Simple logger for services
const logger = {
  debug: (msg: string, ...args: unknown[]) =>
    console.debug(`[RAGService] ${msg}`, ...args),
  info: (msg: string, ...args: unknown[]) =>
    console.info(`[RAGService] ${msg}`, ...args),
  warn: (msg: string, ...args: unknown[]) =>
    console.warn(`[RAGService] ${msg}`, ...args),
  error: (msg: string, ...args: unknown[]) =>
    console.error(`[RAGService] ${msg}`, ...args),
}

export interface RAGOptions {
  /** Number of documents to retrieve (default: 5) */
  topK?: number
  /** Minimum similarity score threshold (0-1, default: 0.7) */
  minScore?: number
  /** Current page path for contextual prompts */
  currentPath?: string
  /** Maximum context length in characters */
  maxContextLength?: number
  /** Enable reranking for better results */
  enableReranking?: boolean
}

export interface RAGContext {
  /** The user's question */
  query: string
  /** Retrieved documentation chunks */
  sources: SearchResult[]
  /** Formatted context for the LLM */
  context: string
  /** Total relevance score */
  totalScore: number
  /** Search method used */
  searchMethod: 'vector' | 'keyword' | 'hybrid'
}

export interface Citation {
  id: string
  source: string
  chunkText: string
  url: string
  confidence: number
}

/**
 * RAGService - Clean, stateless service for RAG operations
 */
export class RAGService {
  /**
   * Retrieve relevant documentation for a query
   */
  async retrieveContext(
    query: string,
    options: RAGOptions = {}
  ): Promise<RAGContext> {
    const {
      topK = 5,
      minScore = 0.7,
      currentPath,
      maxContextLength = 4000,
      enableReranking = true,
    } = options

    let sources: SearchResult[] = []
    let searchMethod: 'vector' | 'keyword' | 'hybrid' = 'hybrid'

    try {
      // Try keyword search first (fast, no API calls)
      const keywordResults = searchDocumentation(query, {
        topK,
        minScore: 0.1,
        currentPath,
      })

      if (keywordResults.length > 0) {
        logger.debug(
          `Found ${keywordResults.length} results using keyword search`
        )

        sources = keywordResults.map((result) => ({
          id: result.chunk.id,
          title: result.chunk.title,
          content: result.chunk.content,
          url: result.chunk.url,
          category: result.chunk.category,
          score: Math.min(result.score / 10, 1),
          metadata: result.chunk.metadata,
        }))

        searchMethod = 'keyword'
      } else {
        // Fallback to vector search
        logger.debug('Keyword search returned no results, using vector search')

        const queryEmbedding = await generateEmbedding(query)
        const vectorStore = getVectorStore()
        await vectorStore.initialize()

        const results = await vectorStore.search(queryEmbedding, topK)
        sources = results.filter((result) => result.score >= minScore)
        searchMethod = 'vector'
      }

      // Rerank if enabled
      if (enableReranking && sources.length > 0) {
        sources = this.rerankResults(query, sources)
      }

      // Build context
      const context = this.buildContext(sources, maxContextLength)
      const totalScore = sources.reduce((sum, s) => sum + s.score, 0)

      return {
        query,
        sources,
        context,
        totalScore,
        searchMethod,
      }
    } catch (error) {
      logger.error('Error retrieving context:', error)

      // Last resort: keyword search with very low threshold
      const keywordResults = searchDocumentation(query, {
        topK,
        minScore: 0.01,
        currentPath,
      })

      sources = keywordResults.map((result) => ({
        id: result.chunk.id,
        title: result.chunk.title,
        content: result.chunk.content,
        url: result.chunk.url,
        category: result.chunk.category,
        score: Math.min(result.score / 10, 1),
        metadata: result.chunk.metadata,
      }))

      return {
        query,
        sources,
        context: this.buildContext(sources, maxContextLength),
        totalScore: sources.reduce((sum, s) => sum + s.score, 0),
        searchMethod: 'keyword',
      }
    }
  }

  /**
   * Build context string from retrieved documents
   */
  buildContext(sources: SearchResult[], maxLength = 4000): string {
    if (sources.length === 0) {
      return 'No relevant documentation found for this query.'
    }

    let context = '# Relevant Documentation\n\n'
    let currentLength = context.length

    for (const source of sources) {
      const section =
        `## ${source.title} (Score: ${(source.score * 100).toFixed(1)}%)\n` +
        `**Category:** ${source.category}\n` +
        `**URL:** ${source.url}\n\n` +
        `${source.content}\n\n` +
        '---\n\n'

      // Check if adding this section would exceed max length
      if (currentLength + section.length > maxLength) {
        const remaining = maxLength - currentLength
        if (remaining > 200) {
          context += section.slice(0, remaining - 50) + '...\n\n'
        }
        break
      }

      context += section
      currentLength += section.length
    }

    return context
  }

  /**
   * Format citations for display
   */
  formatCitations(sources: SearchResult[]): Citation[] {
    return sources.map((source, index) => ({
      id: `citation-${index}`,
      source: source.title,
      chunkText:
        source.content.slice(0, 200) +
        (source.content.length > 200 ? '...' : ''),
      url: source.url,
      confidence: source.score,
    }))
  }

  /**
   * Determine if a query should use RAG
   */
  shouldUseRAG(query: string): boolean {
    const lowerQuery = query.toLowerCase()

    // Questions that benefit from RAG
    const ragIndicators = [
      'how',
      'what',
      'where',
      'when',
      'why',
      'can i',
      'how to',
      'explain',
      'show me',
      'example',
      'component',
      'hook',
      'api',
      'props',
      'use',
      'implement',
      'integrate',
    ]

    // Simple greetings or commands don't need RAG
    const nonRAGPatterns = [
      /^(hi|hello|hey|thanks|thank you|ok|okay)$/i,
      /^(clear|reset|help)$/i,
    ]

    if (nonRAGPatterns.some((pattern) => pattern.test(query.trim()))) {
      return false
    }

    return ragIndicators.some((indicator) => lowerQuery.includes(indicator))
  }

  /**
   * Calculate relevance score for a query-document pair
   */
  private calculateRelevanceScore(query: string, source: SearchResult): number {
    let score = source.score // Start with vector similarity (0-1)

    // Boost score if query terms appear in title
    const queryTerms = query.toLowerCase().split(/\s+/)
    const titleLower = source.title.toLowerCase()
    const titleMatches = queryTerms.filter((term) =>
      titleLower.includes(term)
    ).length
    score += (titleMatches / queryTerms.length) * 0.1

    // Boost score for certain categories based on query
    if (query.includes('component') && source.category === 'component') {
      score += 0.05
    }
    if (query.includes('hook') && source.category === 'hook') {
      score += 0.05
    }
    if (query.includes('example') && source.category === 'example') {
      score += 0.05
    }

    // Boost score for recent documents
    if (source.metadata?.lastUpdated) {
      const daysSinceUpdate =
        (Date.now() - new Date(source.metadata.lastUpdated).getTime()) /
        (1000 * 60 * 60 * 24)
      if (daysSinceUpdate < 7) {
        score += 0.02
      }
    }

    return Math.min(score, 1)
  }

  /**
   * Rerank results using multiple signals
   */
  private rerankResults(
    query: string,
    results: SearchResult[]
  ): SearchResult[] {
    return results
      .map((result) => ({
        ...result,
        score: this.calculateRelevanceScore(query, result),
      }))
      .sort((a, b) => b.score - a.score)
  }

  /**
   * Get suggested follow-up questions based on retrieved documents
   */
  getSuggestedFollowUps(sources: SearchResult[]): string[] {
    const suggestions: string[] = []
    const categories = new Set(sources.map((s) => s.category))

    if (categories.has('component')) {
      suggestions.push('How do I customize the styling?')
      suggestions.push('What are the available props?')
    }

    if (categories.has('hook')) {
      suggestions.push('How do I use this with other hooks?')
      suggestions.push('What are the performance considerations?')
    }

    if (categories.has('guide')) {
      suggestions.push('Are there any best practices to follow?')
      suggestions.push('What are common pitfalls?')
    }

    if (categories.has('example')) {
      suggestions.push('Can you explain how this example works?')
      suggestions.push('How can I adapt this for my use case?')
    }

    return suggestions.slice(0, 3)
  }
}
