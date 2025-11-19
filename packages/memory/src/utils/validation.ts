/**
 * Input validation utilities
 */

import type { MemoryType, AddOptions, SearchOptions, ContextOptions } from '../types'

/**
 * Validate memory content
 */
export function validateContent(content: unknown): asserts content is string {
  if (typeof content !== 'string') {
    throw new TypeError('Memory content must be a string')
  }
  if (content.trim().length === 0) {
    throw new Error('Memory content cannot be empty')
  }
  if (content.length > 100000) {
    throw new Error('Memory content exceeds maximum length of 100,000 characters')
  }
}

/**
 * Validate memory ID
 */
export function validateMemoryId(id: unknown): asserts id is string {
  if (typeof id !== 'string') {
    throw new TypeError('Memory ID must be a string')
  }
  if (id.trim().length === 0) {
    throw new Error('Memory ID cannot be empty')
  }
}

/**
 * Validate memory type
 */
export function validateMemoryType(type: unknown): asserts type is MemoryType {
  const validTypes: MemoryType[] = ['episodic', 'semantic', 'profile']
  if (!validTypes.includes(type as MemoryType)) {
    throw new TypeError(`Invalid memory type: ${type}. Must be one of: ${validTypes.join(', ')}`)
  }
}

/**
 * Validate importance score
 */
export function validateImportance(importance: unknown): asserts importance is number {
  if (typeof importance !== 'number') {
    throw new TypeError('Importance must be a number')
  }
  if (importance < 0 || importance > 1) {
    throw new RangeError('Importance must be between 0 and 1')
  }
  if (!Number.isFinite(importance)) {
    throw new RangeError('Importance must be a finite number')
  }
}

/**
 * Validate add options
 */
export function validateAddOptions(options?: AddOptions): void {
  if (!options) return

  if (options.type !== undefined) {
    validateMemoryType(options.type)
  }

  if (options.importance !== undefined) {
    validateImportance(options.importance)
  }

  if (options.tags !== undefined) {
    if (!Array.isArray(options.tags)) {
      throw new TypeError('Tags must be an array')
    }
    if (options.tags.some((tag) => typeof tag !== 'string')) {
      throw new TypeError('All tags must be strings')
    }
  }

  if (options.embedding !== undefined) {
    if (!Array.isArray(options.embedding)) {
      throw new TypeError('Embedding must be an array')
    }
    if (options.embedding.some((val) => typeof val !== 'number')) {
      throw new TypeError('Embedding must be an array of numbers')
    }
  }
}

/**
 * Validate search options
 */
export function validateSearchOptions(options?: SearchOptions): void {
  if (!options) return

  if (options.limit !== undefined) {
    if (typeof options.limit !== 'number' || options.limit < 1) {
      throw new RangeError('Search limit must be a positive number')
    }
  }

  if (options.minScore !== undefined) {
    if (typeof options.minScore !== 'number' || options.minScore < 0 || options.minScore > 1) {
      throw new RangeError('minScore must be a number between 0 and 1')
    }
  }

  if (options.types !== undefined) {
    if (!Array.isArray(options.types)) {
      throw new TypeError('Types must be an array')
    }
    options.types.forEach(validateMemoryType)
  }
}

/**
 * Validate context options
 */
export function validateContextOptions(options: ContextOptions): void {
  if (typeof options.maxTokens !== 'number' || options.maxTokens < 1) {
    throw new RangeError('maxTokens must be a positive number')
  }

  if (options.maxTokens > 1000000) {
    throw new RangeError('maxTokens exceeds maximum of 1,000,000')
  }

  if (options.types !== undefined) {
    if (!Array.isArray(options.types)) {
      throw new TypeError('Types must be an array')
    }
    options.types.forEach(validateMemoryType)
  }
}

/**
 * Validate query string
 */
export function validateQuery(query: unknown): asserts query is string {
  if (typeof query !== 'string') {
    throw new TypeError('Query must be a string')
  }
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean
  warnings: string[]
  suggestions: string[]
  errors?: string[]
}

/**
 * Validate memory service configuration
 */
export function validateConfig(config?: any): ValidationResult {
  const warnings: string[] = []
  const suggestions: string[] = []
  const errors: string[] = []

  if (!config) {
    suggestions.push('Consider providing a configuration object for better control')
    return { valid: true, warnings, suggestions }
  }

  // Check for embedding provider
  if (!config.embeddingProvider) {
    suggestions.push('Add an embedding provider for semantic search capabilities')
  }

  // Check for token budget
  if (!config.tokenBudget) {
    suggestions.push('Configure token budget for better context management')
  }

  // Check storage configuration
  if (config.storage?.type && !['memory', 'file', 'indexeddb'].includes(config.storage.type)) {
    errors.push(`Invalid storage type: ${config.storage.type}. Must be 'memory', 'file', or 'indexeddb'`)
  }

  return {
    valid: errors.length === 0,
    warnings,
    suggestions,
    errors,
  }
}

/**
 * Format validation result for display
 */
export function formatValidationResult(result: ValidationResult): string {
  const lines: string[] = []

  if (result.errors && result.errors.length > 0) {
    lines.push('Errors:')
    result.errors.forEach((error) => lines.push(`  ❌ ${error}`))
  }

  if (result.warnings.length > 0) {
    lines.push('Warnings:')
    result.warnings.forEach((warning) => lines.push(`  ⚠️  ${warning}`))
  }

  if (result.suggestions.length > 0) {
    lines.push('Suggestions:')
    result.suggestions.forEach((suggestion) => lines.push(`  💡 ${suggestion}`))
  }

  return lines.join('\n')
}
