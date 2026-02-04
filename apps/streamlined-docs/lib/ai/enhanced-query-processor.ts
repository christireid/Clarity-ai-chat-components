/**
 * Enhanced Query Processor
 *
 * Integrates all query processing techniques:
 * - Intent classification
 * - Query expansion
 * - Conversation context
 * - Query reformulation
 * - Multi-perspective generation
 *
 * Provides a unified interface for advanced query processing.
 *
 * @module enhanced-query-processor
 * @version 1.0.0
 */

import {
  classifyQueryIntent,
  ClassifiedIntent,
  QueryIntent,
  requiresCodeExample,
  isProblemSolving,
  getRecommendedStructure,
} from './query-intent-classifier'

import {
  expandQuery,
  ExpandedQuery,
  ExpansionOptions,
  generateHypotheticalAnswer,
  generateMultiPerspectiveQueries,
  extractBoostedSearchTerms,
} from './query-expansion'

import {
  getConversationContextManager,
  ResolvedQuery,
  formatContextForRAG,
  requiresConversationContext,
} from './conversation-context-manager'

import { classifyQueryComplexity, QueryComplexity } from './query-complexity-classifier'

// ============================================================================
// Types
// ============================================================================

export interface ProcessedQuery {
  /** Original raw query */
  original: string

  /** Classified intent */
  intent: ClassifiedIntent

  /** Query complexity */
  complexity: QueryComplexity

  /** Expanded query with synonyms */
  expanded: ExpandedQuery

  /** Context-resolved query (coreferences resolved) */
  resolved: ResolvedQuery

  /** Optimized queries for different search strategies */
  searchQueries: {
    /** For keyword/BM25 search */
    keyword: string
    /** For semantic/vector search */
    semantic: string
    /** For hybrid search */
    hybrid: string
    /** Multi-perspective queries for comprehensive retrieval */
    perspectives: string[]
  }

  /** Hypothetical answer for HyDE retrieval */
  hypotheticalAnswer: string

  /** Boosted search terms with weights */
  boostedTerms: {
    term: string
    boost: number
  }[]

  /** Recommended response structure */
  responseGuidance: {
    sections: string[]
    style: string
    includeCodeExamples: boolean
    isProblemSolving: boolean
  }

  /** Conversation context */
  conversationContext: string

  /** Processing metadata */
  metadata: {
    processingTime: number
    conversationId?: string
    turnNumber?: number
    requiresContext: boolean
  }
}

export interface ProcessingOptions extends ExpansionOptions {
  /** Conversation ID for context tracking */
  conversationId?: string

  /** Include conversation history in context */
  includeConversationHistory?: boolean

  /** Generate multi-perspective queries */
  generatePerspectives?: boolean

  /** Use HyDE for semantic search */
  useHyDE?: boolean

  /** Maximum perspectives to generate */
  maxPerspectives?: number
}

// ============================================================================
// Main Processing Function
// ============================================================================

/**
 * Process query with all enhancement techniques
 */
export async function processQuery(
  query: string,
  options: ProcessingOptions = {}
): Promise<ProcessedQuery> {
  const startTime = Date.now()

  // Default options
  const opts: Required<ProcessingOptions> = {
    includeSynonyms: true,
    includeRelatedTerms: true,
    includeAlternatives: true,
    expandAcronyms: true,
    maxAlternatives: 5,
    domain: 'general',
    conversationId: undefined,
    includeConversationHistory: true,
    generatePerspectives: true,
    useHyDE: true,
    maxPerspectives: 5,
    ...options,
  }

  // Step 1: Classify intent
  const previousQueries = opts.conversationId
    ? getPreviousQueries(opts.conversationId)
    : []
  const intent = classifyQueryIntent(query, previousQueries)

  // Step 2: Classify complexity
  const complexityResult = classifyQueryComplexity(query)
  const complexity = complexityResult.complexity

  // Step 3: Resolve conversation context
  let resolved: ResolvedQuery
  if (opts.conversationId && requiresConversationContext(query)) {
    const manager = getConversationContextManager()
    resolved = manager.resolveQuery(opts.conversationId, query, intent)
  } else {
    resolved = {
      original: query,
      resolved: query,
      carriedOverEntities: [],
      contextSummary: '',
      continuesTopic: false,
    }
  }

  // Step 4: Expand query
  const expanded = expandQuery(resolved.resolved, intent, {
    includeSynonyms: opts.includeSynonyms,
    includeRelatedTerms: opts.includeRelatedTerms,
    includeAlternatives: opts.includeAlternatives,
    expandAcronyms: opts.expandAcronyms,
    maxAlternatives: opts.maxAlternatives,
    domain: opts.domain,
  })

  // Step 5: Generate search queries
  const searchQueries = {
    keyword: expanded.reformulations.keyword,
    semantic: expanded.reformulations.semantic,
    hybrid: expanded.reformulations.hybrid,
    perspectives: opts.generatePerspectives
      ? generateMultiPerspectiveQueries(resolved.resolved, intent).slice(0, opts.maxPerspectives)
      : [resolved.resolved],
  }

  // Step 6: Generate hypothetical answer (HyDE)
  const hypotheticalAnswer = opts.useHyDE
    ? generateHypotheticalAnswer(resolved.resolved, intent.primary)
    : ''

  // Step 7: Extract boosted terms
  const boostedTerms = extractBoostedSearchTerms(resolved.resolved, intent)

  // Step 8: Get response guidance
  const structure = getRecommendedStructure(intent.primary)
  const responseGuidance = {
    sections: structure.sections,
    style: structure.style,
    includeCodeExamples: requiresCodeExample(intent.primary),
    isProblemSolving: isProblemSolving(intent.primary),
  }

  // Step 9: Format conversation context
  const conversationContext = opts.conversationId
    ? formatContextForRAG(opts.conversationId, opts.includeConversationHistory)
    : ''

  // Step 10: Add turn to conversation context
  if (opts.conversationId) {
    const manager = getConversationContextManager()
    manager.addTurn(opts.conversationId, query, intent)
  }

  // Calculate processing time
  const processingTime = Date.now() - startTime

  return {
    original: query,
    intent,
    complexity,
    expanded,
    resolved,
    searchQueries,
    hypotheticalAnswer,
    boostedTerms,
    responseGuidance,
    conversationContext,
    metadata: {
      processingTime,
      conversationId: opts.conversationId,
      turnNumber: opts.conversationId ? getTurnNumber(opts.conversationId) : undefined,
      requiresContext: requiresConversationContext(query),
    },
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get previous queries from conversation
 */
function getPreviousQueries(conversationId: string): string[] {
  const manager = getConversationContextManager()
  const context = manager.getOrCreateContext(conversationId)
  return context.turns.map((t) => t.query)
}

/**
 * Get turn number in conversation
 */
function getTurnNumber(conversationId: string): number {
  const manager = getConversationContextManager()
  const context = manager.getOrCreateContext(conversationId)
  return context.turns.length
}

// ============================================================================
// RAG Integration Functions
// ============================================================================

/**
 * Generate optimized RAG prompt from processed query
 */
export function generateRAGPrompt(processed: ProcessedQuery): {
  systemPrompt: string
  userPrompt: string
  searchQuery: string
} {
  const { intent, complexity, expanded, resolved, conversationContext, responseGuidance } =
    processed

  // Build system prompt with guidance
  const systemPromptParts: string[] = [
    'You are a helpful documentation assistant for Clarity AI Chat Components.',
  ]

  // Add style guidance
  if (responseGuidance.style) {
    const styleGuidance: Record<string, string> = {
      concise: 'Provide clear, concise answers without unnecessary detail.',
      detailed: 'Provide comprehensive, detailed explanations with examples.',
      'code-focused':
        'Focus on code examples with minimal explanation. Let the code speak for itself.',
      instructional:
        'Provide step-by-step instructions that are easy to follow. Number each step.',
      comparative:
        'Present information in a comparison format. Highlight differences clearly.',
      'problem-solving':
        'Focus on diagnosing the problem and providing actionable solutions.',
      reference:
        'Provide technical reference information in a structured, easy-to-scan format.',
      advisory:
        'Provide recommendations with clear reasoning. Explain trade-offs when applicable.',
      conversational: 'Be friendly and conversational. Match the user\'s tone.',
      informational: 'Provide clear, factual information without being overly technical.',
    }

    systemPromptParts.push(styleGuidance[responseGuidance.style] || '')
  }

  // Add code example guidance
  if (responseGuidance.includeCodeExamples) {
    systemPromptParts.push(
      'Include practical code examples that demonstrate the concepts. ' +
        'Use TypeScript and modern React patterns.'
    )
  }

  // Add problem-solving guidance
  if (responseGuidance.isProblemSolving) {
    systemPromptParts.push(
      'Focus on identifying the root cause and providing clear solutions. ' +
        'Include verification steps to confirm the fix works.'
    )
  }

  // Add skill level guidance
  const skillGuidance: Record<string, string> = {
    beginner:
      'The user is a beginner. Explain concepts clearly without assuming prior knowledge. ' +
      'Use simple language and provide context.',
    intermediate:
      'The user has intermediate knowledge. Focus on practical usage and best practices.',
    advanced:
      'The user is experienced. Provide technical details, performance considerations, ' +
      'and advanced patterns.',
  }
  systemPromptParts.push(skillGuidance[intent.skillLevel] || '')

  // Add conversation context if available
  if (conversationContext) {
    systemPromptParts.push(
      '\n## Conversation Context\n' +
        conversationContext +
        '\n\nConsider the conversation context when answering. ' +
        'Reference previous topics when relevant.'
    )
  }

  const systemPrompt = systemPromptParts.filter(Boolean).join('\n\n')

  // Build user prompt
  const userPromptParts: string[] = []

  // Add resolved query (with coreferences resolved)
  userPromptParts.push(`User Question: ${resolved.resolved}`)

  // Add carried over entities for context
  if (resolved.carriedOverEntities.length > 0) {
    const entities = resolved.carriedOverEntities
      .map((e) => `${e.value} (${e.type})`)
      .join(', ')
    userPromptParts.push(`Context from previous turns: ${entities}`)
  }

  // Add technical terms for clarity
  if (intent.technicalTerms.length > 0) {
    userPromptParts.push(`Technical terms: ${intent.technicalTerms.join(', ')}`)
  }

  // Add query focus
  if (intent.focus && intent.focus !== processed.original) {
    userPromptParts.push(`Focus: ${intent.focus}`)
  }

  const userPrompt = userPromptParts.join('\n')

  // Determine best search query
  // For semantic search, prefer expanded or hypothetical
  const searchQuery =
    complexity === QueryComplexity.SIMPLE
      ? processed.searchQueries.keyword
      : processed.searchQueries.hybrid

  return {
    systemPrompt,
    userPrompt,
    searchQuery,
  }
}

/**
 * Format processed query for debugging/logging
 */
export function formatProcessedQueryDebug(processed: ProcessedQuery): string {
  const lines: string[] = [
    '=== Processed Query Debug Info ===',
    '',
    `Original: ${processed.original}`,
    `Resolved: ${processed.resolved.resolved}`,
    '',
    '--- Intent ---',
    `Primary: ${processed.intent.primary}`,
    `Secondary: ${processed.intent.secondary.join(', ') || 'none'}`,
    `Confidence: ${(processed.intent.confidence * 100).toFixed(0)}%`,
    `Skill Level: ${processed.intent.skillLevel}`,
    `Query Type: ${processed.intent.queryType}`,
    '',
    '--- Complexity ---',
    `Level: ${processed.complexity}`,
    '',
    '--- Entities ---',
    ...processed.intent.entities.map((e) => `  ${e.type}: ${e.value}`),
    '',
    '--- Technical Terms ---',
    processed.intent.technicalTerms.join(', ') || 'none',
    '',
    '--- Search Queries ---',
    `Keyword: ${processed.searchQueries.keyword}`,
    `Semantic: ${processed.searchQueries.semantic}`,
    `Hybrid: ${processed.searchQueries.hybrid}`,
    '',
    '--- Response Guidance ---',
    `Style: ${processed.responseGuidance.style}`,
    `Sections: ${processed.responseGuidance.sections.join(' → ')}`,
    `Code Examples: ${processed.responseGuidance.includeCodeExamples}`,
    `Problem Solving: ${processed.responseGuidance.isProblemSolving}`,
    '',
    '--- Metadata ---',
    `Processing Time: ${processed.metadata.processingTime}ms`,
    `Requires Context: ${processed.metadata.requiresContext}`,
    processed.metadata.conversationId ? `Conversation: ${processed.metadata.conversationId}` : '',
    processed.metadata.turnNumber ? `Turn: ${processed.metadata.turnNumber}` : '',
  ]

  return lines.filter(Boolean).join('\n')
}

// ============================================================================
// Batch Processing
// ============================================================================

/**
 * Process multiple queries in batch (useful for prefetching)
 */
export async function processBatch(
  queries: string[],
  options: ProcessingOptions = {}
): Promise<ProcessedQuery[]> {
  return Promise.all(queries.map((query) => processQuery(query, options)))
}

/**
 * Process query and its generated perspectives
 */
export async function processWithPerspectives(
  query: string,
  options: ProcessingOptions = {}
): Promise<{
  primary: ProcessedQuery
  perspectives: ProcessedQuery[]
}> {
  // Process primary query
  const primary = await processQuery(query, {
    ...options,
    generatePerspectives: true,
  })

  // Process each perspective
  const perspectives = await processBatch(primary.searchQueries.perspectives, {
    ...options,
    generatePerspectives: false, // Don't generate nested perspectives
    conversationId: undefined, // Perspectives don't need conversation context
  })

  return {
    primary,
    perspectives,
  }
}

// ============================================================================
// Statistics and Analytics
// ============================================================================

/**
 * Get query processing statistics
 */
export interface QueryStatistics {
  totalQueries: number
  averageProcessingTime: number
  intentDistribution: Record<QueryIntent, number>
  complexityDistribution: Record<QueryComplexity, number>
  skillLevelDistribution: Record<string, number>
  averageConfidence: number
}

const queryStats: {
  queries: ProcessedQuery[]
  startTime: number
} = {
  queries: [],
  startTime: Date.now(),
}

/**
 * Track query for statistics
 */
export function trackQuery(processed: ProcessedQuery): void {
  queryStats.queries.push(processed)

  // Keep only last 1000 queries
  if (queryStats.queries.length > 1000) {
    queryStats.queries = queryStats.queries.slice(-1000)
  }
}

/**
 * Get current statistics
 */
export function getStatistics(): QueryStatistics {
  const queries = queryStats.queries

  if (queries.length === 0) {
    return {
      totalQueries: 0,
      averageProcessingTime: 0,
      intentDistribution: {} as Record<QueryIntent, number>,
      complexityDistribution: {} as Record<QueryComplexity, number>,
      skillLevelDistribution: {},
      averageConfidence: 0,
    }
  }

  // Calculate distributions
  const intentDist: Record<string, number> = {}
  const complexityDist: Record<string, number> = {}
  const skillDist: Record<string, number> = {}
  let totalConfidence = 0
  let totalProcessingTime = 0

  for (const query of queries) {
    // Intent distribution
    intentDist[query.intent.primary] = (intentDist[query.intent.primary] || 0) + 1

    // Complexity distribution
    complexityDist[query.complexity] = (complexityDist[query.complexity] || 0) + 1

    // Skill level distribution
    skillDist[query.intent.skillLevel] = (skillDist[query.intent.skillLevel] || 0) + 1

    // Averages
    totalConfidence += query.intent.confidence
    totalProcessingTime += query.metadata.processingTime
  }

  return {
    totalQueries: queries.length,
    averageProcessingTime: totalProcessingTime / queries.length,
    intentDistribution: intentDist as Record<QueryIntent, number>,
    complexityDistribution: complexityDist as Record<QueryComplexity, number>,
    skillLevelDistribution: skillDist,
    averageConfidence: totalConfidence / queries.length,
  }
}
