/**
 * Query Processing - Unified Export
 *
 * Central export point for all query processing functionality.
 * Import everything you need from this single file.
 *
 * @example
 * ```typescript
 * import { processQuery, classifyQueryIntent, expandQuery } from '@/lib/ai/query-processing'
 * ```
 *
 * @module query-processing
 * @version 1.0.0
 */

// ============================================================================
// Intent Classification
// ============================================================================

export {
  classifyQueryIntent,
  QueryIntent,
  QueryEntity,
  SkillLevel,
  type ClassifiedIntent,
  requiresCodeExample,
  isProblemSolving,
  isConversational,
  getRecommendedStructure,
} from './query-intent-classifier'

// ============================================================================
// Query Expansion
// ============================================================================

export {
  expandQuery,
  generateHypotheticalAnswer,
  generateMultiPerspectiveQueries,
  extractBoostedSearchTerms,
  expandWithDomainKnowledge,
  type ExpandedQuery,
  type ExpansionOptions,
} from './query-expansion'

// ============================================================================
// Conversation Context
// ============================================================================

export {
  getConversationContextManager,
  formatContextForRAG,
  requiresConversationContext,
  type ConversationTurn,
  type ConversationContext,
  type ResolvedQuery,
  ConversationContextManager,
} from './conversation-context-manager'

// ============================================================================
// Enhanced Query Processor
// ============================================================================

export {
  processQuery,
  generateRAGPrompt,
  formatProcessedQueryDebug,
  processBatch,
  processWithPerspectives,
  trackQuery,
  getStatistics,
  type ProcessedQuery,
  type ProcessingOptions,
  type QueryStatistics,
} from './enhanced-query-processor'

// ============================================================================
// Query Complexity (Legacy - still useful)
// ============================================================================

export {
  classifyQueryComplexity,
  QueryComplexity,
  type ClassifiedQuery,
} from './query-complexity-classifier'

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Quick query classification and expansion
 *
 * @example
 * ```typescript
 * const quick = quickProcess('How to use ChatWindow?')
 * console.log(quick.intent)    // 'tutorial'
 * console.log(quick.expanded)  // 'How to use ChatWindow (component)?'
 * ```
 */
export function quickProcess(query: string): {
  intent: string
  confidence: number
  expanded: string
  entities: string[]
} {
  const classified = classifyQueryIntent(query)
  const expanded = expandQuery(query, classified)

  return {
    intent: classified.primary,
    confidence: classified.confidence,
    expanded: expanded.expanded,
    entities: classified.entities.map((e) => e.value),
  }
}

/**
 * Check if query is conversational (greeting, thanks, etc.)
 */
export function isConversationalQuery(query: string): boolean {
  const classified = classifyQueryIntent(query)
  return isConversational(classified.primary)
}

/**
 * Get optimal search strategy for query
 *
 * @returns 'keyword' | 'semantic' | 'hybrid'
 */
export function getOptimalSearchStrategy(query: string): 'keyword' | 'semantic' | 'hybrid' {
  const complexity = classifyQueryComplexity(query)

  // Simple queries work well with keyword search
  if (complexity.complexity === QueryComplexity.SIMPLE) {
    return 'keyword'
  }

  // Complex queries benefit from semantic understanding
  if (complexity.complexity === QueryComplexity.COMPLEX) {
    return 'semantic'
  }

  // Default to hybrid for balanced approach
  return 'hybrid'
}

/**
 * Extract main topic from query
 */
export function extractTopic(query: string): string {
  const classified = classifyQueryIntent(query)

  // Try to get from entities first
  const mainEntity = classified.entities.find(
    (e) => e.type === QueryEntity.COMPONENT || e.type === QueryEntity.HOOK || e.type === QueryEntity.CONCEPT
  )

  if (mainEntity) {
    return mainEntity.value
  }

  // Fallback to focus
  return classified.focus
}

/**
 * Generate suggested follow-up questions
 */
export function generateFollowUpSuggestions(query: string): string[] {
  const classified = classifyQueryIntent(query)
  const suggestions: string[] = []

  // Based on intent, suggest relevant follow-ups
  switch (classified.primary) {
    case QueryIntent.DEFINITION:
      suggestions.push('How do I use it?')
      suggestions.push('Show me an example')
      suggestions.push('What are the best practices?')
      break

    case QueryIntent.EXAMPLE:
      suggestions.push('Can you explain how this works?')
      suggestions.push('What are common use cases?')
      suggestions.push('How to customize this?')
      break

    case QueryIntent.TUTORIAL:
      suggestions.push('What are common issues?')
      suggestions.push('Can you show more advanced usage?')
      suggestions.push('What are the best practices?')
      break

    case QueryIntent.TROUBLESHOOTING:
      suggestions.push('How can I prevent this in the future?')
      suggestions.push('Are there alternative approaches?')
      suggestions.push('Where can I learn more?')
      break

    default:
      if (classified.entities.length > 0) {
        const entity = classified.entities[0].value
        suggestions.push(`Tell me more about ${entity}`)
        suggestions.push(`Show me examples of ${entity}`)
      }
  }

  return suggestions.slice(0, 3)
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if query is asking for code
 */
export function isCodeRequest(query: string): boolean {
  const classified = classifyQueryIntent(query)
  return requiresCodeExample(classified.primary)
}

/**
 * Check if query is problem-solving
 */
export function isProblemSolvingQuery(query: string): boolean {
  const classified = classifyQueryIntent(query)
  return isProblemSolving(classified.primary)
}

/**
 * Check if query needs detailed explanation
 */
export function needsDetailedExplanation(query: string): boolean {
  const complexity = classifyQueryComplexity(query)
  return complexity.complexity === QueryComplexity.COMPLEX
}

// ============================================================================
// Presets for Common Scenarios
// ============================================================================

/**
 * Processing options for API documentation queries
 */
export const API_DOCS_OPTIONS: ProcessingOptions = {
  domain: 'react',
  generatePerspectives: false,
  useHyDE: false,
  includeSynonyms: true,
  expandAcronyms: true,
}

/**
 * Processing options for tutorial/how-to queries
 */
export const TUTORIAL_OPTIONS: ProcessingOptions = {
  domain: 'react',
  generatePerspectives: true,
  useHyDE: true,
  includeRelatedTerms: true,
  maxPerspectives: 5,
}

/**
 * Processing options for troubleshooting queries
 */
export const TROUBLESHOOTING_OPTIONS: ProcessingOptions = {
  domain: 'general',
  generatePerspectives: true,
  useHyDE: false,
  includeAlternatives: true,
  maxAlternatives: 5,
}

/**
 * Processing options for conversational queries
 */
export const CONVERSATIONAL_OPTIONS: ProcessingOptions = {
  includeConversationHistory: true,
  generatePerspectives: false,
  useHyDE: false,
  includeSynonyms: false,
}

/**
 * Get recommended processing options based on query
 */
export function getRecommendedOptions(query: string): ProcessingOptions {
  const classified = classifyQueryIntent(query)

  switch (classified.primary) {
    case QueryIntent.API_LOOKUP:
    case QueryIntent.DEFINITION:
      return API_DOCS_OPTIONS

    case QueryIntent.TUTORIAL:
    case QueryIntent.INTEGRATION:
      return TUTORIAL_OPTIONS

    case QueryIntent.TROUBLESHOOTING:
    case QueryIntent.DEBUGGING:
    case QueryIntent.ERROR_RESOLUTION:
      return TROUBLESHOOTING_OPTIONS

    case QueryIntent.CLARIFICATION:
    case QueryIntent.FOLLOWUP:
      return CONVERSATIONAL_OPTIONS

    default:
      return {} // Use defaults
  }
}
