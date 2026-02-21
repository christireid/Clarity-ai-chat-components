/**
 * RAG Integration Module
 *
 * Integrates optimized RAG prompts with existing RAG infrastructure.
 * Provides high-level functions for context-aware, citation-rich responses.
 *
 * @module ragIntegration
 */

import {
  RAGPrompts,
  RAGUtils,
  formatSourcesForContext,
  prioritizeContext,
  validateCitations,
  detectHallucination,
  buildConversationRAGPrompt,
} from './ragPrompts'
import { retrieveRelevantDocs, type RAGOptions } from './rag'
import type { SearchResult } from './vectorStore'
import type { Message } from '@clarity-chat/types'
import { logger } from '@/lib/logger'

// ============================================================================
// Enhanced RAG Context Generation
// ============================================================================

export interface EnhancedRAGContext {
  /** User's query */
  query: string
  /** Retrieved and prioritized documentation chunks */
  sources: SearchResult[]
  /** Formatted context for LLM */
  formattedContext: string
  /** Complete system prompt with RAG context */
  systemPrompt: string
  /** User message with context and instructions */
  userMessage: string
  /** Metadata about context selection */
  metadata: {
    totalSources: number
    selectedSources: number
    totalTokens: number
    contextTokens: number
    historyTokens: number
  }
}

/**
 * Generate enhanced RAG context with optimized prompts
 *
 * This is the main entry point for RAG-enhanced responses.
 * It combines retrieval, prioritization, and prompt optimization.
 *
 * @param query - User's question
 * @param options - RAG configuration options
 * @param conversationHistory - Previous messages for context continuity
 * @returns Enhanced RAG context ready for LLM consumption
 *
 * @example
 * ```typescript
 * const ragContext = await generateEnhancedRAGContext(
 *   "How do I use ChatProvider?",
 *   { topK: 5, minScore: 0.7 },
 *   previousMessages
 * )
 *
 * // Use with your LLM
 * const response = await llm.generate({
 *   system: ragContext.systemPrompt,
 *   messages: [{ role: 'user', content: ragContext.userMessage }]
 * })
 * ```
 */
export async function generateEnhancedRAGContext(
  query: string,
  options: RAGOptions & {
    conversationHistory?: Message[]
    maxHistoryTokens?: number
    maxContextTokens?: number
    includeMetadata?: boolean
  } = {}
): Promise<EnhancedRAGContext> {
  const {
    conversationHistory = [],
    maxHistoryTokens = 1000,
    maxContextTokens = 4000,
    topK = 5,
    minScore = 0.7,
    currentPath,
  } = options

  // Step 1: Retrieve relevant documentation
  logger.debug('Retrieving relevant documentation...', { query, topK })
  const rawSources = await retrieveRelevantDocs(query, {
    topK: topK * 2, // Retrieve more for better prioritization
    minScore,
    currentPath,
  })

  logger.debug(`Retrieved ${rawSources.length} raw sources`)

  // Step 2: Prioritize and select sources within token budget
  const selectedSources = prioritizeContext(rawSources, maxContextTokens)

  logger.debug(`Selected ${selectedSources.length} prioritized sources`)

  // Step 3: Format sources into structured context
  const formattedContext = formatSourcesForContext(selectedSources, {
    maxTokens: maxContextTokens,
    includeScores: true,
    includeCategories: true,
  })

  // Step 4: Build conversation-aware user message
  const userMessage =
    conversationHistory.length > 0
      ? buildConversationRAGPrompt({
          question: query,
          context: formattedContext,
          conversationHistory,
          maxHistoryTokens,
        })
      : RAGPrompts.userTemplate
          .replace('{context}', formattedContext)
          .replace('{question}', query)

  // Step 5: Use optimized system prompt
  const systemPrompt = RAGPrompts.system

  // Step 6: Calculate token metadata
  const contextTokens = RAGUtils.estimateTokens(formattedContext)
  const historyTokens = RAGUtils.estimateTokens(
    RAGUtils.formatConversationHistory(conversationHistory, maxHistoryTokens)
  )
  const totalTokens =
    contextTokens + historyTokens + RAGUtils.estimateTokens(systemPrompt)

  logger.debug('RAG context generated', {
    totalSources: rawSources.length,
    selectedSources: selectedSources.length,
    contextTokens,
    historyTokens,
    totalTokens,
  })

  return {
    query,
    sources: selectedSources,
    formattedContext,
    systemPrompt,
    userMessage,
    metadata: {
      totalSources: rawSources.length,
      selectedSources: selectedSources.length,
      totalTokens,
      contextTokens,
      historyTokens,
    },
  }
}

// ============================================================================
// Response Validation & Quality Assurance
// ============================================================================

export interface ResponseQualityReport {
  /** Whether response meets quality standards */
  isValid: boolean
  /** Overall quality score (0-1) */
  qualityScore: number
  /** Citation validation results */
  citations: {
    isValid: boolean
    missingCitations: number[]
    issues: string[]
  }
  /** Hallucination detection results */
  hallucination: {
    isLikelySafe: boolean
    warnings: string[]
  }
  /** Response length check */
  length: {
    tokens: number
    exceedsLimit: boolean
    maxTokens: number
  }
  /** Recommendations for improvement */
  recommendations: string[]
}

/**
 * Validate response quality against best practices
 *
 * Checks for:
 * - Proper citations
 * - No hallucinations
 * - Appropriate length
 * - Structured format
 *
 * @param response - Assistant's response
 * @param context - Documentation context provided
 * @param sourceCount - Number of sources in context
 * @param maxResponseTokens - Maximum allowed response tokens
 * @returns Quality report with validation results and recommendations
 *
 * @example
 * ```typescript
 * const report = validateResponse(
 *   assistantResponse,
 *   ragContext.formattedContext,
 *   ragContext.sources.length
 * )
 *
 * if (!report.isValid) {
 *   console.warn('Response quality issues:', report.recommendations)
 * }
 * ```
 */
export function validateResponse(
  response: string,
  context: string,
  sourceCount: number,
  maxResponseTokens: number = 2000
): ResponseQualityReport {
  const recommendations: string[] = []

  // Citation validation
  const citations = validateCitations(response, sourceCount)
  if (!citations.isValid) {
    recommendations.push('Add missing source citations')
  }

  // Hallucination detection
  const hallucination = detectHallucination(response, context)
  if (!hallucination.isLikelySafe) {
    recommendations.push('Review response for potential hallucinations')
    hallucination.warnings.forEach((warning) => {
      recommendations.push(`  - ${warning}`)
    })
  }

  // Length check
  const tokens = RAGUtils.estimateTokens(response)
  const exceedsLimit = tokens > maxResponseTokens
  if (exceedsLimit) {
    recommendations.push(
      `Reduce response length (${tokens} > ${maxResponseTokens} tokens)`
    )
  }

  // Format check
  const hasCodeExample = response.includes('```')
  const hasSources = response.includes('**Sources:**')
  const hasStepByStep = /\d+\.\s/.test(response) // Looks for numbered lists

  if (sourceCount > 0 && !hasSources) {
    recommendations.push('Add source list at end of response')
  }

  // Calculate quality score
  let qualityScore = 1.0

  if (!citations.isValid) qualityScore -= 0.3
  if (!hallucination.isLikelySafe) qualityScore -= 0.4
  if (exceedsLimit) qualityScore -= 0.2
  if (sourceCount > 0 && !hasSources) qualityScore -= 0.1

  qualityScore = Math.max(0, qualityScore)

  const isValid =
    citations.isValid && hallucination.isLikelySafe && !exceedsLimit

  return {
    isValid,
    qualityScore,
    citations,
    hallucination,
    length: {
      tokens,
      exceedsLimit,
      maxTokens: maxResponseTokens,
    },
    recommendations,
  }
}

// ============================================================================
// Specialized RAG Functions
// ============================================================================

/**
 * Generate RAG context optimized for code queries
 *
 * Prioritizes:
 * - Code examples
 * - API documentation
 * - Type definitions
 */
export async function generateCodeFocusedRAGContext(
  query: string,
  options: RAGOptions = {}
): Promise<EnhancedRAGContext> {
  const ragContext = await generateEnhancedRAGContext(query, options)

  // Override system prompt for code focus
  const systemPrompt = RAGPrompts.system + '\n\n' + RAGPrompts.codeFocused

  return {
    ...ragContext,
    systemPrompt,
  }
}

/**
 * Generate RAG context optimized for troubleshooting
 *
 * Prioritizes:
 * - Error messages
 * - Troubleshooting guides
 * - Common issues
 */
export async function generateTroubleshootingRAGContext(
  query: string,
  options: RAGOptions = {}
): Promise<EnhancedRAGContext> {
  const ragContext = await generateEnhancedRAGContext(query, options)

  // Override system prompt for troubleshooting
  const systemPrompt = RAGPrompts.system + '\n\n' + RAGPrompts.troubleshooting

  return {
    ...ragContext,
    systemPrompt,
  }
}

/**
 * Generate RAG context optimized for comparisons
 *
 * Prioritizes:
 * - Feature comparisons
 * - Use case guides
 * - Performance data
 */
export async function generateComparisonRAGContext(
  query: string,
  options: RAGOptions = {}
): Promise<EnhancedRAGContext> {
  const ragContext = await generateEnhancedRAGContext(query, options)

  // Override system prompt for comparisons
  const systemPrompt = RAGPrompts.system + '\n\n' + RAGPrompts.comparison

  return {
    ...ragContext,
    systemPrompt,
  }
}

// ============================================================================
// Query Classification
// ============================================================================

export type QueryType = 'code' | 'troubleshooting' | 'comparison' | 'general'

/**
 * Classify query type to select appropriate RAG strategy
 *
 * @param query - User's question
 * @returns Query type classification
 *
 * @example
 * ```typescript
 * const queryType = classifyQuery("How do I implement streaming?")
 * // Returns: 'code'
 *
 * const queryType2 = classifyQuery("Why am I getting this error?")
 * // Returns: 'troubleshooting'
 * ```
 */
export function classifyQuery(query: string): QueryType {
  const lowerQuery = query.toLowerCase()

  // Code-related patterns
  const codePatterns = [
    'how do i',
    'how to',
    'implement',
    'example',
    'code',
    'show me',
    'create',
    'build',
  ]

  // Troubleshooting patterns
  const troubleshootingPatterns = [
    'error',
    'not working',
    'broken',
    'issue',
    'problem',
    'why',
    'fix',
    'debug',
  ]

  // Comparison patterns
  const comparisonPatterns = [
    'vs',
    'versus',
    'difference',
    'compare',
    'better',
    'when to use',
    'which',
    'or',
  ]

  if (codePatterns.some((pattern) => lowerQuery.includes(pattern))) {
    return 'code'
  }

  if (troubleshootingPatterns.some((pattern) => lowerQuery.includes(pattern))) {
    return 'troubleshooting'
  }

  if (comparisonPatterns.some((pattern) => lowerQuery.includes(pattern))) {
    return 'comparison'
  }

  return 'general'
}

/**
 * Generate RAG context with automatic query classification
 *
 * Automatically selects the best RAG strategy based on query type.
 *
 * @param query - User's question
 * @param options - RAG configuration options
 * @returns Enhanced RAG context optimized for query type
 *
 * @example
 * ```typescript
 * // Automatically uses code-focused prompts
 * const context = await generateSmartRAGContext(
 *   "How do I implement file uploads?"
 * )
 *
 * // Automatically uses troubleshooting prompts
 * const context2 = await generateSmartRAGContext(
 *   "Why am I getting a 404 error?"
 * )
 * ```
 */
export async function generateSmartRAGContext(
  query: string,
  options: RAGOptions & {
    conversationHistory?: Message[]
  } = {}
): Promise<EnhancedRAGContext & { queryType: QueryType }> {
  const queryType = classifyQuery(query)

  logger.debug('Query classified', { query, queryType })

  let ragContext: EnhancedRAGContext

  switch (queryType) {
    case 'code':
      ragContext = await generateCodeFocusedRAGContext(query, options)
      break
    case 'troubleshooting':
      ragContext = await generateTroubleshootingRAGContext(query, options)
      break
    case 'comparison':
      ragContext = await generateComparisonRAGContext(query, options)
      break
    default:
      ragContext = await generateEnhancedRAGContext(query, options)
  }

  return {
    ...ragContext,
    queryType,
  }
}

// ============================================================================
// Streaming Integration
// ============================================================================

/**
 * Stream-friendly RAG context for Server-Sent Events
 *
 * Returns context that can be incrementally sent to the client.
 */
export async function generateStreamingRAGContext(
  query: string,
  options: RAGOptions & {
    conversationHistory?: Message[]
    onSourcesRetrieved?: (sources: SearchResult[]) => void
    onContextFormatted?: (context: string) => void
  } = {}
): Promise<EnhancedRAGContext> {
  const { onSourcesRetrieved, onContextFormatted, ...ragOptions } = options

  // Retrieve sources
  const rawSources = await retrieveRelevantDocs(query, ragOptions)

  // Callback with sources (e.g., for streaming to client)
  if (onSourcesRetrieved) {
    onSourcesRetrieved(rawSources)
  }

  // Generate full context
  const ragContext = await generateEnhancedRAGContext(query, ragOptions)

  // Callback with formatted context
  if (onContextFormatted) {
    onContextFormatted(ragContext.formattedContext)
  }

  return ragContext
}

// ============================================================================
// Exports
// ============================================================================

export const RAGIntegration = {
  generateEnhancedRAGContext,
  validateResponse,
  classifyQuery,
  generateSmartRAGContext,
  generateCodeFocusedRAGContext,
  generateTroubleshootingRAGContext,
  generateComparisonRAGContext,
  generateStreamingRAGContext,
}
