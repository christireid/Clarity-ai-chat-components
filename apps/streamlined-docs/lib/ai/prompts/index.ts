/**
 * Enhanced Prompting System - Main Export
 *
 * Robust prompt engineering system with:
 * - Multi-dimensional query classification
 * - Quality-optimized system prompts
 * - Automated response validation
 * - Comprehensive quality metrics
 *
 * @see README.md for detailed documentation
 */

// Enhanced Complexity Classifier
export {
  classifyQueryEnhanced,
  getRecommendedPromptStrategy,
  formatClassificationReport,
  type EnhancedClassification,
  type ComplexityDimensions,
  type AnswerRequirements,
} from './enhanced-complexity-classifier'

// Enhanced System Prompts
export {
  generateEnhancedSystemPrompt,
  generateCodeExamplePrompt,
  MASTER_SYSTEM_PROMPT,
  QUALITY_ASSESSMENT_PROMPT,
  type EnhancedSystemPrompt,
  type ValidationCriteria,
  type CodeQualityCheck,
  type CompletenessCheck,
} from './enhanced-system'

// Response Validation
export {
  validateResponse,
  formatValidationReport,
  type ValidationResult,
  type ValidationIssue,
  type ValidationCheck,
  type ValidationCategory,
  type ResponseComponents,
  type CodeBlock,
  type Citation,
} from './response-validation'

// Quality Metrics
export {
  calculateQualityScores,
  qualityMetricsTracker,
  QualityMetricsTracker,
  formatAggregateMetricsReport,
  type QualityMetrics,
  type PerformanceMetrics,
  type UserFeedback,
  type FeedbackIssue,
  type QualityScores,
  type AggregateMetrics,
} from './quality-metrics'

// Legacy exports (backward compatibility)
export { generateCoTPrompt, generateReflectiveCoTPrompt } from './cot'
export {
  generateCitationPrompt,
  extractCitations,
  verifyCitations,
  type CitationGroundedPrompt,
  type Source,
  type GroundedResponse,
  type CitationValidation,
} from './citations'

// Re-export query complexity from main module
export { QueryComplexity } from '../query-complexity-classifier'

/**
 * Quick Start Example:
 *
 * ```typescript
 * import {
 *   classifyQueryEnhanced,
 *   generateEnhancedSystemPrompt,
 *   validateResponse,
 *   calculateQualityScores,
 *   qualityMetricsTracker,
 * } from '@/lib/ai/prompts'
 *
 * // 1. Classify query
 * const classification = classifyQueryEnhanced(userQuery)
 *
 * // 2. Generate prompt
 * const prompt = generateEnhancedSystemPrompt(
 *   userQuery,
 *   classification.complexity,
 *   classification.requirements.needsCodeExample,
 *   hasSources
 * )
 *
 * // 3. Generate response
 * const response = await llm.generate(prompt)
 *
 * // 4. Validate
 * const validation = validateResponse(
 *   response,
 *   prompt.validationCriteria,
 *   userQuery
 * )
 *
 * // 5. Track metrics
 * const scores = calculateQualityScores(validation, performanceMetrics)
 * qualityMetricsTracker.log({
 *   queryId: crypto.randomUUID(),
 *   timestamp: Date.now(),
 *   query: userQuery,
 *   response,
 *   classification,
 *   validation,
 *   performance: performanceMetrics,
 *   scores,
 * })
 * ```
 */
