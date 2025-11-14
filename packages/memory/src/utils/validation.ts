/**
 * Clarity Memory - Validation Utilities
 * 
 * Validation functions for configuration and data.
 */

import { MemoryError, MemoryErrorCodes } from '../types'

/**
 * Validate memory content
 */
export function validateMemoryContent(content: unknown): asserts content is string {
  if (typeof content !== 'string') {
    throw new MemoryError(
      'Memory content must be a string',
      MemoryErrorCodes.INVALID_CONFIG
    )
  }
  
  if (content.trim().length === 0) {
    throw new MemoryError(
      'Memory content cannot be empty',
      MemoryErrorCodes.INVALID_CONFIG
    )
  }
}

/**
 * Validate memory ID
 */
export function validateMemoryId(id: unknown): asserts id is string {
  if (typeof id !== 'string') {
    throw new MemoryError(
      'Memory ID must be a string',
      MemoryErrorCodes.INVALID_CONFIG
    )
  }
  
  if (id.trim().length === 0) {
    throw new MemoryError(
      'Memory ID cannot be empty',
      MemoryErrorCodes.INVALID_CONFIG
    )
  }
}

/**
 * Validate query string
 */
export function validateQuery(query: unknown): asserts query is string {
  if (typeof query !== 'string') {
    throw new MemoryError(
      'Query must be a string',
      MemoryErrorCodes.INVALID_CONFIG
    )
  }
  
  if (query.trim().length === 0) {
    throw new MemoryError(
      'Query cannot be empty',
      MemoryErrorCodes.INVALID_CONFIG
    )
  }
}

/**
 * Validate token budget
 */
export function validateTokenBudget(
  maxTokens: unknown,
  reserveTokens: unknown = 0
): void {
  if (typeof maxTokens !== 'number' || maxTokens <= 0) {
    throw new MemoryError(
      'maxTokens must be a positive number',
      MemoryErrorCodes.INVALID_CONFIG
    )
  }
  
  if (typeof reserveTokens !== 'number' || reserveTokens < 0) {
    throw new MemoryError(
      'reserveTokens must be a non-negative number',
      MemoryErrorCodes.INVALID_CONFIG
    )
  }
  
  if (reserveTokens >= maxTokens) {
    throw new MemoryError(
      'reserveTokens must be less than maxTokens',
      MemoryErrorCodes.INVALID_CONFIG
    )
  }
}

/**
 * Validate embedding dimensions
 */
export function validateEmbeddingDimensions(
  embedding: number[],
  expectedDimensions: number
): void {
  if (!Array.isArray(embedding)) {
    throw new MemoryError(
      'Embedding must be an array',
      MemoryErrorCodes.INVALID_CONFIG
    )
  }
  
  if (embedding.length !== expectedDimensions) {
    throw new MemoryError(
      `Embedding must have ${expectedDimensions} dimensions, got ${embedding.length}`,
      MemoryErrorCodes.INVALID_CONFIG
    )
  }
}

/**
 * Validate score (0-1 range)
 */
export function validateScore(score: unknown, name = 'Score'): asserts score is number {
  if (typeof score !== 'number') {
    throw new MemoryError(
      `${name} must be a number`,
      MemoryErrorCodes.INVALID_CONFIG
    )
  }
  
  if (score < 0 || score > 1) {
    throw new MemoryError(
      `${name} must be between 0 and 1`,
      MemoryErrorCodes.INVALID_CONFIG
    )
  }
}
