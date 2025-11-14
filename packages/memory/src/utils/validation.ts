/**
 * Configuration Validation Utilities
 */

import type { MemoryConfig } from '../core/types'
import { detectEnvironment, getEnvironmentRecommendations } from './environment'

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

/**
 * Validate memory configuration
 */
export function validateConfig(config?: MemoryConfig): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
  }

  if (!config) {
    return result // Empty config is valid (uses defaults)
  }

  // Validate storage config
  if (config.storage) {
    const env = detectEnvironment()
    
    if (config.storage.type === 'indexeddb' && env !== 'browser') {
      result.errors.push(
        'IndexedDB storage is only available in browser environments'
      )
      result.valid = false
    }

    if (config.storage.type === 'postgres' && !config.storage.url) {
      result.errors.push(
        'Postgres storage requires a connection URL'
      )
      result.valid = false
    }

    if (config.storage.type === 'redis' && !config.storage.url) {
      result.errors.push(
        'Redis storage requires a connection URL'
      )
      result.valid = false
    }
  }

  // Validate embedding provider
  if (config.embeddingProvider) {
    if (config.embeddingProvider.provider === 'openai' && !config.embeddingProvider.apiKey) {
      result.errors.push(
        'OpenAI embedding provider requires an API key'
      )
      result.valid = false
    }

    if (config.embeddingProvider.provider === 'anthropic' && !config.embeddingProvider.apiKey) {
      result.errors.push(
        'Anthropic embedding provider requires an API key'
      )
      result.valid = false
    }
  }

  // Validate token budget
  if (config.tokenBudget) {
    const allocation = config.tokenBudget.allocation
    const total = 
      allocation.systemPrompt +
      allocation.userPreferences +
      allocation.recentContext +
      allocation.semanticMemory +
      allocation.episodicMemory +
      allocation.responseReserve

    if (Math.abs(total - 1.0) > 0.01) {
      result.errors.push(
        `Token allocation percentages must sum to 1.0 (currently ${total.toFixed(2)})`
      )
      result.valid = false
    }

    if (config.tokenBudget.maxTokens < 100) {
      result.warnings.push(
        'Token budget is very low (< 100). Consider increasing for better context quality.'
      )
    }
  }

  // Validate compression config
  if (config.compression) {
    if (config.compression.strategy === 'summarize' && !config.summarization?.enabled) {
      result.warnings.push(
        'Summarize compression strategy requires summarization to be enabled'
      )
    }

    if (config.compression.threshold < 0 || config.compression.threshold > 1) {
      result.errors.push(
        'Compression threshold must be between 0 and 1'
      )
      result.valid = false
    }

    if (config.compression.minQuality < 0 || config.compression.minQuality > 1) {
      result.errors.push(
        'Compression minQuality must be between 0 and 1'
      )
      result.valid = false
    }
  }

  // Validate summarization config
  if (config.summarization?.enabled) {
    if (config.summarization.provider === 'openai' && !process.env.OPENAI_API_KEY && !config.summarization) {
      result.warnings.push(
        'OpenAI summarization requires OPENAI_API_KEY environment variable or API key in config'
      )
    }

    if (config.summarization.interval < 1000) {
      result.warnings.push(
        'Summarization interval is very short (< 1 second). This may cause performance issues.'
      )
    }
  }

  // Environment-specific suggestions
  const envRecs = getEnvironmentRecommendations()
  if (envRecs.warnings.length > 0) {
    result.warnings.push(...envRecs.warnings)
  }

  // General suggestions
  if (!config.storage) {
    result.suggestions.push(
      `Consider configuring storage. Recommended for this environment: ${envRecs.storage}`
    )
  }

  if (!config.embeddingProvider && config.tokenBudget) {
    result.suggestions.push(
      'Consider adding an embedding provider for better semantic search'
    )
  }

  if (config.debug && config.logLevel === 'silent') {
    result.warnings.push(
      'Debug mode is enabled but log level is silent. Enable logging to see debug output.'
    )
  }

  return result
}

/**
 * Format validation result as a user-friendly message
 */
export function formatValidationResult(result: ValidationResult): string {
  const parts: string[] = []

  if (result.errors.length > 0) {
    parts.push('❌ Errors:')
    result.errors.forEach(err => parts.push(`  - ${err}`))
  }

  if (result.warnings.length > 0) {
    parts.push('⚠️  Warnings:')
    result.warnings.forEach(warn => parts.push(`  - ${warn}`))
  }

  if (result.suggestions.length > 0) {
    parts.push('💡 Suggestions:')
    result.suggestions.forEach(sugg => parts.push(`  - ${sugg}`))
  }

  return parts.join('\n')
}
