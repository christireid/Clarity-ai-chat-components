/**
 * Advanced Prompting Integration
 *
 * Integrates Chain-of-Thought and citation-grounding
 * into the documentation assistant workflow
 */

import {
  classifyQueryComplexity,
  type QueryComplexity,
} from './query-complexity-classifier'
import { generateCoTPrompt } from './chain-of-thought-prompts'
import {
  generateCitationPrompt,
  extractCitations,
  validateCitations,
  type Source,
  type GroundedResponse,
} from './citation-grounded-prompts'
import { metricsLogger, type PromptMetrics } from './prompt-metrics'

export interface AdvancedPromptConfig {
  enableCoT: boolean // Enable Chain-of-Thought for complex queries
  enableCitations: boolean // Require citations for all claims
  strictMode: boolean // Extra strict citation requirements
}

export interface AdvancedPromptResult {
  systemPrompt: string
  userPrompt: string
  complexity: QueryComplexity
  requiresCitations: boolean
  postProcessing: (
    response: string,
    sources: Source[]
  ) => Promise<ProcessedResponse>
}

export interface ProcessedResponse {
  answer: string
  grounded: GroundedResponse
  metrics: PromptMetrics
}

/**
 * Generate advanced prompt with CoT, citations, and grounding
 *
 * This is the main integration point for all advanced prompting techniques
 */
export async function generateAdvancedPrompt(
  query: string,
  sources: Source[],
  config: AdvancedPromptConfig = {
    enableCoT: true,
    enableCitations: true,
    strictMode: false,
  }
): Promise<AdvancedPromptResult> {
  const startTime = Date.now()

  // Step 1: Classify query complexity
  const classification = classifyQueryComplexity(query)

  // Step 2: Generate appropriate prompt based on complexity and config
  let systemPrompt: string
  let userPrompt: string
  let requiresCitations = config.enableCitations

  if (config.enableCitations) {
    // Citation-grounded prompting takes precedence
    const citationPrompt = config.strictMode
      ? await import('./citation-grounded-prompts').then((m) =>
          m.generateStrictCitationPrompt(query, sources)
        )
      : generateCitationPrompt(query, sources)

    systemPrompt = citationPrompt.systemPrompt
    userPrompt = citationPrompt.userPrompt
  } else if (config.enableCoT) {
    // Fall back to Chain-of-Thought
    const contextChunks = sources.map((s) => s.content)
    const cotPrompt = generateCoTPrompt(
      query,
      classification.complexity,
      contextChunks
    )

    systemPrompt = cotPrompt.systemPrompt
    userPrompt = cotPrompt.userPrompt
    requiresCitations = false
  } else {
    // Simple prompt without advanced techniques
    systemPrompt = `You are a helpful documentation assistant. Provide clear, accurate answers based on the provided context.`
    userPrompt = `Context:\n${sources.map((s) => s.content).join('\n\n')}\n\nQuestion: ${query}`
    requiresCitations = false
  }

  // Step 3: Define post-processing function
  const postProcessing = async (
    response: string,
    sources: Source[]
  ): Promise<ProcessedResponse> => {
    const processingStartTime = Date.now()

    // Extract citations
    const grounded = requiresCitations
      ? extractCitations(response, sources)
      : {
          answer: response,
          citations: [],
          uncitedClaims: [],
        }

    // Validate citations if required
    if (requiresCitations) {
      const validation = validateCitations(grounded)
      if (!validation.isValid && config.strictMode) {
        console.warn(
          '[Advanced Prompting] Citation validation failed:',
          validation.issues
        )
      }
    }

    // Calculate metrics
    const responseTime = Date.now() - startTime
    const metrics: PromptMetrics = {
      queryId: crypto.randomUUID(),
      timestamp: Date.now(),
      complexity: classification.complexity,
      promptTokens: estimateTokens(systemPrompt + userPrompt),
      completionTokens: estimateTokens(response),
      groundingConfidence: grounded.groundingScore || 1.0,
      citationCount: grounded.citations.length,
      responseTime,
      technique: requiresCitations
        ? 'citation'
        : config.enableCoT
          ? 'cot'
          : 'simple',
    }

    // Log metrics
    metricsLogger.log(metrics)

    return {
      answer: response,
      grounded,
      metrics,
    }
  }

  return {
    systemPrompt,
    userPrompt,
    complexity: classification.complexity,
    requiresCitations,
    postProcessing,
  }
}

/**
 * Estimate token count (rough approximation)
 *
 * More accurate token counting should use tiktoken or similar
 */
function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4)
}

/**
 * Default configuration for production
 */
export const PRODUCTION_CONFIG: AdvancedPromptConfig = {
  enableCoT: true,
  enableCitations: true,
  strictMode: false,
}

/**
 * Development configuration (more lenient)
 */
export const DEVELOPMENT_CONFIG: AdvancedPromptConfig = {
  enableCoT: true,
  enableCitations: true,
  strictMode: false,
}

/**
 * Strict configuration for critical domains
 */
export const STRICT_CONFIG: AdvancedPromptConfig = {
  enableCoT: true,
  enableCitations: true,
  strictMode: true,
}

/**
 * Get configuration based on environment
 */
export function getPromptConfig(): AdvancedPromptConfig {
  const env = process.env.NODE_ENV

  if (env === 'production') {
    return PRODUCTION_CONFIG
  }

  if (env === 'development') {
    return DEVELOPMENT_CONFIG
  }

  return DEVELOPMENT_CONFIG
}
