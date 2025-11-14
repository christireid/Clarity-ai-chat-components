/**
 * Clarity Memory - Validation Utilities
 * 
 * Input validation and error checking utilities
 */

import type { MemoryConfig, AddMemoryOptions } from '../core/types'

/**
 * Validate memory content
 */
export function validateContent(content: unknown): asserts content is string {
  if (typeof content !== 'string') {
    throw new Error('Memory content must be a string')
  }
  
  if (content.trim().length === 0) {
    throw new Error('Memory content cannot be empty')
  }
  
  if (content.length > 100000) {
    throw new Error('Memory content is too long (max 100,000 characters)')
  }
}

/**
 * Validate memory ID
 */
export function validateId(id: unknown): asserts id is string {
  if (typeof id !== 'string') {
    throw new Error('Memory ID must be a string')
  }
  
  if (id.trim().length === 0) {
    throw new Error('Memory ID cannot be empty')
  }
}

/**
 * Validate importance score
 */
export function validateImportance(importance: number): number {
  if (typeof importance !== 'number' || isNaN(importance)) {
    throw new Error('Importance must be a number')
  }
  
  if (importance < 0 || importance > 1) {
    throw new Error('Importance must be between 0 and 1')
  }
  
  return Math.max(0, Math.min(1, importance))
}

/**
 * Validate memory config
 */
export function validateConfig(config: MemoryConfig): MemoryConfig {
  const validated = { ...config }
  
  // Validate maxTokens
  if (validated.maxTokens !== undefined) {
    if (typeof validated.maxTokens !== 'number' || validated.maxTokens < 1) {
      throw new Error('maxTokens must be a positive number')
    }
    if (validated.maxTokens > 1000000) {
      throw new Error('maxTokens is too large (max 1,000,000)')
    }
  }
  
  // Validate token budget
  if (validated.tokenBudget) {
    const budget = validated.tokenBudget
    const sum = 
      (budget.systemPrompt || 0) +
      (budget.memories || 0) +
      (budget.recentContext || 0) +
      (budget.responseReserve || 0)
    
    if (sum > 1.01 || sum < 0.99) {
      console.warn(`Token budget percentages sum to ${sum}, should be close to 1.0`)
    }
  }
  
  // Validate compression threshold
  if (validated.compressionThreshold !== undefined) {
    if (validated.compressionThreshold < 0 || validated.compressionThreshold > 1) {
      throw new Error('compressionThreshold must be between 0 and 1')
    }
  }
  
  // Validate store config
  if (validated.store && typeof validated.store === 'object') {
    if (validated.store.type === 'vector' && !validated.store.provider) {
      throw new Error('Vector store config must specify a provider')
    }
  }
  
  return validated
}

/**
 * Validate add memory options
 */
export function validateAddOptions(options: AddMemoryOptions): AddMemoryOptions {
  const validated = { ...options }
  
  // Validate importance
  if (validated.importance !== undefined) {
    validated.importance = validateImportance(validated.importance)
  }
  
  // Validate TTL
  if (validated.ttl !== undefined) {
    if (typeof validated.ttl !== 'number' || validated.ttl < 0) {
      throw new Error('TTL must be a non-negative number')
    }
  }
  
  // Validate tags
  if (validated.tags) {
    if (!Array.isArray(validated.tags)) {
      throw new Error('Tags must be an array')
    }
    validated.tags = validated.tags.filter(tag => typeof tag === 'string' && tag.trim().length > 0)
  }
  
  return validated
}

/**
 * Sanitize memory content
 */
export function sanitizeContent(content: string): string {
  // Remove excessive whitespace
  return content.trim().replace(/\s+/g, ' ')
}

/**
 * Check if environment supports a feature
 */
export function checkEnvironmentSupport(feature: 'indexeddb' | 'filesystem' | 'fetch'): boolean {
  switch (feature) {
    case 'indexeddb':
      return typeof indexedDB !== 'undefined'
    
    case 'filesystem':
      try {
        // Check if we're in Node.js
        return typeof require !== 'undefined' && typeof process !== 'undefined'
      } catch {
        return false
      }
    
    case 'fetch':
      return typeof fetch !== 'undefined'
    
    default:
      return false
  }
}

/**
 * Get helpful error message for common issues
 */
export function getHelpfulErrorMessage(error: Error, context?: string): string {
  const message = error.message
  
  // IndexedDB errors
  if (message.includes('IndexedDB') || message.includes('indexeddb')) {
    return `${message}\n\nTip: IndexedDB is only available in browser environments. Use 'memory' or 'filesystem' store for Node.js.`
  }
  
  // File system errors
  if (message.includes('filesystem') || message.includes('FileSystem')) {
    return `${message}\n\nTip: File system store is only available in Node.js environments. Use 'memory' or 'indexeddb' store for browsers.`
  }
  
  // Embedding errors
  if (message.includes('embedding') || message.includes('Embedder')) {
    return `${message}\n\nTip: Make sure you've configured an embedding provider if you need semantic search.`
  }
  
  // Store errors
  if (message.includes('store') || message.includes('Store')) {
    return `${message}\n\nTip: Check your store configuration. Use 'memory' for the simplest setup.`
  }
  
  return message
}
