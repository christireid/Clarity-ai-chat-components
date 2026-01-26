/**
 * Query Complexity Classifier
 *
 * Classifies user queries into complexity levels to determine
 * the appropriate prompting strategy (simple, moderate, complex)
 */

export enum QueryComplexity {
  SIMPLE = 'simple',     // Single fact lookup
  MODERATE = 'moderate', // Multiple facts or comparison
  COMPLEX = 'complex',   // Reasoning or synthesis required
}

export interface ClassifiedQuery {
  query: string
  complexity: QueryComplexity
  reasoning: string
  keywords: string[]
}

/**
 * Classify query complexity using heuristics
 *
 * @param query - The user's query
 * @returns Classified query with complexity level and reasoning
 */
export function classifyQueryComplexity(query: string): ClassifiedQuery {
  const lowerQuery = query.toLowerCase()

  // Complex indicators - require reasoning, comparison, or synthesis
  const complexIndicators = [
    'why',
    'how does',
    'explain',
    'compare',
    'difference between',
    'best practices',
    'when should',
    'what are the trade-offs',
    'pros and cons',
    'advantages and disadvantages',
    'which is better',
  ]

  // Moderate indicators - require multiple facts or steps
  const moderateIndicators = [
    'what is',
    'how to',
    'can i',
    'does it',
    'list',
    'show me',
    'what are',
  ]

  // Check for complex patterns
  const isComplex = complexIndicators.some((indicator) => lowerQuery.includes(indicator))

  const isModerate = moderateIndicators.some((indicator) => lowerQuery.includes(indicator))

  // Check query length (longer queries tend to be more complex)
  const words = query.split(/\s+/).length

  let complexity: QueryComplexity
  let reasoning: string

  if (isComplex || words > 15) {
    complexity = QueryComplexity.COMPLEX
    reasoning = 'Contains reasoning keywords or is lengthy'
  } else if (isModerate || words > 5) {
    complexity = QueryComplexity.MODERATE
    reasoning = 'Multiple concepts or moderate length'
  } else {
    complexity = QueryComplexity.SIMPLE
    reasoning = 'Short, direct question'
  }

  // Extract keywords (words with 4+ characters)
  const keywords = query.toLowerCase().match(/\b\w{4,}\b/g) || []

  return {
    query,
    complexity,
    reasoning,
    keywords,
  }
}
