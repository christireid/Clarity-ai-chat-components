/**
 * Enhanced Query Complexity Classifier
 *
 * Sophisticated classifier that considers multiple dimensions:
 * - Syntactic complexity (length, structure)
 * - Semantic complexity (concepts, reasoning depth)
 * - Domain specificity (technical depth required)
 * - Answer requirements (code, explanation, comparison)
 *
 * Improves on simple keyword-based classification with multi-factor analysis.
 */

import type { QueryComplexity } from '../query-complexity-classifier'

export interface EnhancedClassification {
  complexity: QueryComplexity
  confidence: number // 0-1
  reasoning: string
  dimensions: ComplexityDimensions
  requirements: AnswerRequirements
  estimatedResponseLength: number // words
  recommendedTemperature: number
}

export interface ComplexityDimensions {
  syntactic: number // 0-1: query structure complexity
  semantic: number // 0-1: concept depth
  technical: number // 0-1: technical knowledge required
  reasoning: number // 0-1: logical reasoning required
  comparison: number // 0-1: comparative analysis required
}

export interface AnswerRequirements {
  needsCodeExample: boolean
  needsMultipleExamples: boolean
  needsDeepExplanation: boolean
  needsComparison: boolean
  needsStepByStep: boolean
  needsCitations: boolean
  estimatedCodeBlocks: number
  estimatedParagraphs: number
}

/**
 * Enhanced query complexity classification
 */
export function classifyQueryEnhanced(query: string): EnhancedClassification {
  const lowerQuery = query.toLowerCase()
  const words = query.split(/\s+/)
  const wordCount = words.length

  // Calculate complexity dimensions
  const dimensions = calculateComplexityDimensions(query, lowerQuery, wordCount)

  // Determine overall complexity
  const avgComplexity = Object.values(dimensions).reduce((a, b) => a + b, 0) / 5

  let complexity: QueryComplexity
  let confidence: number

  if (avgComplexity < 0.35) {
    complexity = 'simple'
    confidence = 1 - (avgComplexity / 0.35) * 0.3 // 0.7-1.0 confidence
  } else if (avgComplexity < 0.65) {
    complexity = 'moderate'
    // Confidence peaks at 0.5 (midpoint), lower at boundaries
    const distanceFromMidpoint = Math.abs(avgComplexity - 0.5)
    confidence = 1 - distanceFromMidpoint * 0.4 // 0.8-1.0 at midpoint
  } else {
    complexity = 'complex'
    confidence = avgComplexity // 0.65-1.0 confidence
  }

  // Determine answer requirements
  const requirements = determineAnswerRequirements(
    query,
    lowerQuery,
    complexity,
    dimensions
  )

  // Estimate response length
  const estimatedResponseLength = estimateResponseLength(
    complexity,
    requirements
  )

  // Recommend temperature
  const recommendedTemperature = calculateRecommendedTemperature(
    complexity,
    dimensions
  )

  // Generate reasoning
  const reasoning = generateReasoningExplanation(
    complexity,
    dimensions,
    requirements,
    avgComplexity
  )

  return {
    complexity,
    confidence,
    reasoning,
    dimensions,
    requirements,
    estimatedResponseLength,
    recommendedTemperature,
  }
}

/**
 * Calculate complexity across multiple dimensions
 */
function calculateComplexityDimensions(
  query: string,
  lowerQuery: string,
  wordCount: number
): ComplexityDimensions {
  // 1. Syntactic Complexity (structure)
  const hasMultipleSentences = (query.match(/[.?!]/g) || []).length > 1
  const hasConjunctions = /\b(and|or|but|however|although)\b/i.test(query)
  const hasSubclauses = /,\s*which|,\s*where|,\s*when/i.test(query)
  const lengthFactor = Math.min(wordCount / 30, 1) // Normalize to 0-1

  const syntactic =
    (lengthFactor * 0.4 +
      (hasMultipleSentences ? 0.3 : 0) +
      (hasConjunctions ? 0.2 : 0) +
      (hasSubclauses ? 0.1 : 0))

  // 2. Semantic Complexity (concept depth)
  const simpleKeywords = [
    'what is',
    'show me',
    'how do i',
    'where is',
    'can i',
  ]
  const moderateKeywords = [
    'how does',
    'explain',
    'describe',
    'what are',
    'configure',
  ]
  const complexKeywords = [
    'why',
    'compare',
    'difference between',
    'best practices',
    'trade-offs',
    'optimize',
    'architecture',
    'design pattern',
  ]

  let semantic = 0.5 // Default moderate
  if (simpleKeywords.some((kw) => lowerQuery.includes(kw))) {
    semantic = 0.2
  } else if (complexKeywords.some((kw) => lowerQuery.includes(kw))) {
    semantic = 0.9
  } else if (moderateKeywords.some((kw) => lowerQuery.includes(kw))) {
    semantic = 0.5
  }

  // Adjust based on presence of multiple concepts
  const conceptCount = (lowerQuery.match(/\b(component|hook|function|state|prop|event|handler|context)\b/g) || []).length
  if (conceptCount >= 3) {
    semantic = Math.min(semantic + 0.2, 1)
  }

  // 3. Technical Complexity (specialized knowledge required)
  const technicalTerms = [
    'typescript',
    'generic',
    'api',
    'async',
    'promise',
    'callback',
    'streaming',
    'ssr',
    'csr',
    'hydration',
    'reconciliation',
    'memoization',
    'performance',
    'bundle',
    'tree shaking',
  ]

  const technicalTermCount = technicalTerms.filter((term) =>
    lowerQuery.includes(term)
  ).length

  const technical = Math.min(technicalTermCount * 0.25, 1)

  // 4. Reasoning Complexity (logical reasoning required)
  const reasoningIndicators = [
    'why',
    'because',
    'reason',
    'cause',
    'leads to',
    'results in',
    'should i',
    'when to',
    'when should',
  ]

  const hasReasoning = reasoningIndicators.some((ind) =>
    lowerQuery.includes(ind)
  )
  const reasoning = hasReasoning ? 0.8 : 0.2

  // 5. Comparison Complexity (requires comparing multiple things)
  const comparisonIndicators = [
    'difference',
    'compare',
    'versus',
    'vs',
    'or',
    'better',
    'best',
    'trade-off',
    'pros and cons',
    'advantage',
    'disadvantage',
  ]

  const hasComparison = comparisonIndicators.some((ind) =>
    lowerQuery.includes(ind)
  )
  const comparison = hasComparison ? 0.9 : 0.1

  return {
    syntactic,
    semantic,
    technical,
    reasoning,
    comparison,
  }
}

/**
 * Determine what the answer needs to include
 */
function determineAnswerRequirements(
  query: string,
  lowerQuery: string,
  complexity: QueryComplexity,
  dimensions: ComplexityDimensions
): AnswerRequirements {
  // Code example required if asking "how to" or showing implementation
  const codeKeywords = [
    'how do i',
    'how to',
    'implement',
    'create',
    'build',
    'example',
    'code',
    'syntax',
  ]
  const needsCodeExample = codeKeywords.some((kw) => lowerQuery.includes(kw))

  // Multiple examples for comparisons or complex queries
  const needsMultipleExamples =
    dimensions.comparison > 0.5 || complexity === 'complex'

  // Deep explanation for "why" and "explain" queries
  const deepExplanationKeywords = ['why', 'explain', 'how does', 'understand']
  const needsDeepExplanation =
    deepExplanationKeywords.some((kw) => lowerQuery.includes(kw)) ||
    complexity === 'complex'

  // Comparison for comparative queries
  const needsComparison = dimensions.comparison > 0.5

  // Step-by-step for "how to" complex queries
  const needsStepByStep =
    (lowerQuery.includes('how') && complexity !== 'simple') ||
    lowerQuery.includes('step')

  // Citations for technical or complex queries
  const needsCitations = dimensions.technical > 0.5 || complexity !== 'simple'

  // Estimate content
  let estimatedCodeBlocks = 0
  let estimatedParagraphs = 0

  if (complexity === 'simple') {
    estimatedCodeBlocks = needsCodeExample ? 1 : 0
    estimatedParagraphs = 1
  } else if (complexity === 'moderate') {
    estimatedCodeBlocks = needsCodeExample ? 1 : 0
    estimatedParagraphs = 2
  } else {
    // complex
    estimatedCodeBlocks = needsMultipleExamples ? 2 : needsCodeExample ? 1 : 0
    estimatedParagraphs = 3
  }

  return {
    needsCodeExample,
    needsMultipleExamples,
    needsDeepExplanation,
    needsComparison,
    needsStepByStep,
    needsCitations,
    estimatedCodeBlocks,
    estimatedParagraphs,
  }
}

/**
 * Estimate response length in words
 */
function estimateResponseLength(
  complexity: QueryComplexity,
  requirements: AnswerRequirements
): number {
  let baseWords = 0

  if (complexity === 'simple') {
    baseWords = 100 // Direct answer
  } else if (complexity === 'moderate') {
    baseWords = 250 // Answer + explanation
  } else {
    baseWords = 450 // Comprehensive response
  }

  // Add for code examples (assume ~50 words per block)
  baseWords += requirements.estimatedCodeBlocks * 50

  // Add for deep explanations
  if (requirements.needsDeepExplanation) {
    baseWords += 150
  }

  // Add for comparisons
  if (requirements.needsComparison) {
    baseWords += 100
  }

  // Add for step-by-step
  if (requirements.needsStepByStep) {
    baseWords += 100
  }

  return baseWords
}

/**
 * Calculate recommended temperature based on query characteristics
 */
function calculateRecommendedTemperature(
  complexity: QueryComplexity,
  dimensions: ComplexityDimensions
): number {
  // Base temperature by complexity
  let temperature = 0.5

  if (complexity === 'simple') {
    temperature = 0.3 // Deterministic for simple queries
  } else if (complexity === 'complex') {
    temperature = 0.7 // More creative for synthesis
  }

  // Adjust based on reasoning vs technical balance
  if (dimensions.reasoning > 0.7 && dimensions.technical < 0.3) {
    temperature += 0.1 // More creative for conceptual reasoning
  }

  if (dimensions.technical > 0.7 && dimensions.reasoning < 0.3) {
    temperature -= 0.1 // More deterministic for technical facts
  }

  // Clamp to valid range
  return Math.max(0.1, Math.min(1.0, temperature))
}

/**
 * Generate human-readable reasoning explanation
 */
function generateReasoningExplanation(
  complexity: QueryComplexity,
  dimensions: ComplexityDimensions,
  requirements: AnswerRequirements,
  avgComplexity: number
): string {
  const reasons: string[] = []

  // Complexity determination
  reasons.push(
    `Overall complexity: ${complexity} (score: ${avgComplexity.toFixed(2)})`
  )

  // Dimension analysis
  const topDimensions = Object.entries(dimensions)
    .filter(([_, score]) => score > 0.5)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 2)
    .map(([dim, score]) => `${dim} (${score.toFixed(2)})`)

  if (topDimensions.length > 0) {
    reasons.push(`High in: ${topDimensions.join(', ')}`)
  }

  // Requirements
  const reqList: string[] = []
  if (requirements.needsCodeExample) reqList.push('code example')
  if (requirements.needsDeepExplanation) reqList.push('detailed explanation')
  if (requirements.needsComparison) reqList.push('comparison')
  if (requirements.needsStepByStep) reqList.push('step-by-step guide')

  if (reqList.length > 0) {
    reasons.push(`Requires: ${reqList.join(', ')}`)
  }

  return reasons.join('. ')
}

/**
 * Get recommended prompt strategy based on classification
 */
export function getRecommendedPromptStrategy(
  classification: EnhancedClassification
): {
  useCoT: boolean
  useCitations: boolean
  useStrictMode: boolean
  explanation: string
} {
  const { complexity, dimensions, requirements } = classification

  let useCoT = false
  let useCitations = false
  let useStrictMode = false
  const reasons: string[] = []

  // Chain-of-Thought for complex reasoning
  if (dimensions.reasoning > 0.6 || complexity === 'complex') {
    useCoT = true
    reasons.push('Complex reasoning requires Chain-of-Thought')
  }

  // Citations for technical queries
  if (dimensions.technical > 0.5 || requirements.needsCitations) {
    useCitations = true
    reasons.push('Technical claims need citations')
  }

  // Strict mode for high-stakes queries (security, architecture)
  const highStakesKeywords = [
    'security',
    'production',
    'authentication',
    'authorization',
    'deploy',
    'architecture',
  ]
  const isHighStakes = highStakesKeywords.some((kw) =>
    classification.reasoning.toLowerCase().includes(kw)
  )

  if (isHighStakes && useCitations) {
    useStrictMode = true
    reasons.push('High-stakes query requires strict validation')
  }

  return {
    useCoT,
    useCitations,
    useStrictMode,
    explanation: reasons.join('. '),
  }
}

/**
 * Format classification for display/debugging
 */
export function formatClassificationReport(
  classification: EnhancedClassification
): string {
  let report = `# Query Complexity Analysis\n\n`
  report += `**Complexity Level**: ${classification.complexity.toUpperCase()}\n`
  report += `**Confidence**: ${(classification.confidence * 100).toFixed(1)}%\n`
  report += `**Reasoning**: ${classification.reasoning}\n\n`

  report += `## Complexity Dimensions\n\n`
  Object.entries(classification.dimensions).forEach(([dim, score]) => {
    const bar = '█'.repeat(Math.round(score * 10))
    report += `- **${dim}**: ${bar} ${(score * 100).toFixed(0)}%\n`
  })

  report += `\n## Answer Requirements\n\n`
  const req = classification.requirements
  report += `- Code Example: ${req.needsCodeExample ? '✅' : '❌'} (${req.estimatedCodeBlocks} blocks)\n`
  report += `- Deep Explanation: ${req.needsDeepExplanation ? '✅' : '❌'}\n`
  report += `- Comparison: ${req.needsComparison ? '✅' : '❌'}\n`
  report += `- Step-by-Step: ${req.needsStepByStep ? '✅' : '❌'}\n`
  report += `- Citations: ${req.needsCitations ? '✅' : '❌'}\n`

  report += `\n## Estimated Response\n\n`
  report += `- Length: ~${classification.estimatedResponseLength} words\n`
  report += `- Paragraphs: ${req.estimatedParagraphs}\n`
  report += `- Temperature: ${classification.recommendedTemperature}\n`

  const strategy = getRecommendedPromptStrategy(classification)
  report += `\n## Recommended Strategy\n\n`
  report += `- Chain-of-Thought: ${strategy.useCoT ? '✅' : '❌'}\n`
  report += `- Citations: ${strategy.useCitations ? '✅' : '❌'}\n`
  report += `- Strict Mode: ${strategy.useStrictMode ? '✅' : '❌'}\n`
  report += `\n${strategy.explanation}\n`

  return report
}
