import { logger } from '@clarity-chat/utils/logger';
/**
 * RAG (Retrieval-Augmented Generation)
 *
 * Core logic for retrieving relevant documentation and generating
 * context-aware responses using the indexed documentation.
 */

import { generateEmbedding } from './embeddings'
import { getVectorStore, type SearchResult } from './vectorStore'
import { SYSTEM_PROMPT, getContextualPrompt, formatSources } from './prompts'
import { searchDocumentation, formatSearchResultsForRAG } from './keywordSearch'

export interface RAGContext {
  /** The user's question */
  query: string
  /** Retrieved documentation chunks */
  sources: SearchResult[]
  /** Formatted context for the LLM */
  context: string
  /** System prompt with context */
  systemPrompt: string
}

export interface RAGOptions {
  /** Number of documents to retrieve (default: 5) */
  topK?: number
  /** Minimum similarity score threshold (0-1, default: 0.7) */
  minScore?: number
  /** Include sources in response (default: true) */
  includeSources?: boolean
  /** Current page path for contextual prompts */
  currentPath?: string
  /** Maximum context length in characters */
  maxContextLength?: number
}

/**
 * Retrieve relevant documentation for a query using semantic search or keyword search
 */
export async function retrieveRelevantDocs(
  query: string,
  options: RAGOptions = {}
): Promise<SearchResult[]> {
  const {
    topK = 5,
    minScore = 0.7,
    currentPath,
  } = options

  try {
    // First, try keyword search (fast and doesn't require API calls)
    const keywordResults = searchDocumentation(query, {
      topK,
      minScore: 0.1, // Use lower threshold for keyword search
      currentPath,
    })

    if (keywordResults.length > 0) {
      logger.debug(`Found ${keywordResults.length} results using keyword search`)

      // Convert keyword search results to SearchResult format
      const searchResults: SearchResult[] = keywordResults.map((result) => ({
        id: result.chunk.id,
        title: result.chunk.title,
        content: result.chunk.content,
        url: result.chunk.url,
        category: result.chunk.category,
        score: Math.min(result.score / 10, 1), // Normalize score to 0-1 range
        metadata: result.chunk.metadata,
      }))

      return searchResults
    }

    // Fallback to embeddings-based search if keyword search returns no results
    logger.debug('Keyword search returned no results, trying embeddings search...')

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query)

    // Search vector store
    const vectorStore = getVectorStore()
    await vectorStore.initialize()

    const results = await vectorStore.search(queryEmbedding, topK)

    // Filter by minimum score
    const filteredResults = results.filter((result) => result.score >= minScore)

    return filteredResults
  } catch (error) {
    logger.logger.error('Error in retrieveRelevantDocs:', error)

    // Last resort: try keyword search with very low threshold
    const keywordResults = searchDocumentation(query, {
      topK,
      minScore: 0.01,
      currentPath,
    })

    return keywordResults.map((result) => ({
      id: result.chunk.id,
      title: result.chunk.title,
      content: result.chunk.content,
      url: result.chunk.url,
      category: result.chunk.category,
      score: Math.min(result.score / 10, 1),
      metadata: result.chunk.metadata,
    }))
  }
}

/**
 * Build context from retrieved documents
 */
export function buildContext(sources: SearchResult[], maxLength = 4000): string {
  if (sources.length === 0) {
    return 'No relevant documentation found for this query.'
  }

  let context = '# Relevant Documentation\n\n'
  let currentLength = context.length

  for (const source of sources) {
    const section = `## ${source.title} (Score: ${(source.score * 100).toFixed(1)}%)\n`
      + `**Category:** ${source.category}\n`
      + `**URL:** ${source.url}\n\n`
      + `${source.content}\n\n`
      + '---\n\n'

    // Check if adding this section would exceed max length
    if (currentLength + section.length > maxLength) {
      // Try to add a truncated version
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
 * Generate a complete RAG context for a query
 */
export async function generateRAGContext(
  query: string,
  options: RAGOptions = {}
): Promise<RAGContext> {
  const {
    currentPath = '/',
    maxContextLength = 4000,
    includeSources = true,
  } = options

  // Retrieve relevant documents
  const sources = await retrieveRelevantDocs(query, options)

  // Build context from sources
  const context = buildContext(sources, maxContextLength)

  // Get contextual system prompt
  const basePrompt = getContextualPrompt(currentPath)
  const systemPrompt = `${basePrompt}\n\n${context}`

  return {
    query,
    sources,
    context,
    systemPrompt,
  }
}

/**
 * Format RAG context for LLM consumption
 */
export function formatRAGPrompt(ragContext: RAGContext): string {
  const { query, sources } = ragContext

  let prompt = `User Question: ${query}\n\n`

  if (sources.length > 0) {
    prompt += `I found ${sources.length} relevant documentation sections to help answer this question:\n\n`
    prompt += ragContext.context
    prompt += '\n\nPlease provide a helpful answer based on the documentation above. '
    prompt += 'Include code examples where appropriate and link to relevant pages.\n'
  } else {
    prompt += 'I could not find specific documentation for this query. '
    prompt += 'Please provide a general answer or suggest where the user might find this information.\n'
  }

  return prompt
}

/**
 * Enhance a user message with RAG context
 */
export async function enhanceMessageWithRAG(
  userMessage: string,
  options: RAGOptions = {}
): Promise<{
  enhancedMessage: string
  ragContext: RAGContext
  hasRelevantDocs: boolean
}> {
  // Generate RAG context
  const ragContext = await generateRAGContext(userMessage, options)

  // Format the prompt
  const enhancedMessage = formatRAGPrompt(ragContext)

  return {
    enhancedMessage,
    ragContext,
    hasRelevantDocs: ragContext.sources.length > 0,
  }
}

/**
 * Get suggested follow-up questions based on retrieved documents
 */
export function getSuggestedFollowUps(sources: SearchResult[]): string[] {
  const suggestions: string[] = []

  // Extract suggestions based on document categories
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

  // Limit to 3 suggestions
  return suggestions.slice(0, 3)
}

/**
 * Calculate relevance score for a query-document pair
 * Combines vector similarity with text-based heuristics
 */
export function calculateRelevanceScore(
  query: string,
  source: SearchResult
): number {
  let score = source.score // Start with vector similarity (0-1)

  // Boost score if query terms appear in title (exact match)
  const queryTerms = query.toLowerCase().split(/\s+/)
  const titleLower = source.title.toLowerCase()
  const titleMatches = queryTerms.filter((term) => titleLower.includes(term)).length
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
  const daysSinceUpdate = (Date.now() - new Date(source.metadata.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
  if (daysSinceUpdate < 7) {
    score += 0.02 // Recently updated
  }

  return Math.min(score, 1) // Cap at 1
}

/**
 * Rerank search results using multiple signals
 */
export function rerankResults(
  query: string,
  results: SearchResult[]
): SearchResult[] {
  return results
    .map((result) => ({
      ...result,
      score: calculateRelevanceScore(query, result),
    }))
    .sort((a, b) => b.score - a.score)
}

/**
 * Check if a query is likely to need documentation context
 */
export function shouldUseRAG(query: string): boolean {
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
 * Format citations for display in the UI
 */
export interface Citation {
  id: string
  source: string
  chunkText: string
  url: string
  confidence: number
}

export function formatCitations(sources: SearchResult[]): Citation[] {
  return sources.map((source, index) => ({
    id: `citation-${index}`,
    source: source.title,
    chunkText: source.content.slice(0, 200) + (source.content.length > 200 ? '...' : ''),
    url: source.url,
    confidence: source.score,
  }))
}
