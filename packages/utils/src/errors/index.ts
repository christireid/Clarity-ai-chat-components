
/**
 * Unified Error Handling System
 *
 * Provides structured, developer-friendly error classes with:
 * - Clear descriptions of what went wrong
 * - Step-by-step solutions
 * - Code examples
 * - Links to documentation
 * - Contextual information for debugging
 *
 * @module @clarity-chat/utils/errors
 *
 * @example
 * ```ts
 * import {
 *   ClarityError,
 *   APIKeyMissingError,
 *   ValidationError,
 *   handleError,
 *   tryCatch
 * } from '@clarity-chat/utils/errors'
 *
 * // Throw a helpful error
 * if (!apiKey) {
 *   throw new APIKeyMissingError('openai')
 * }
 *
 * // Handle errors with proper formatting
 * try {
 *   await riskyOperation()
 * } catch (error) {
 *   handleError(error) // Formats and logs the error
 * }
 *
 * // Use try-catch tuple pattern
 * const [error, result] = await tryCatch(() => fetchData())
 * if (error) {
 *   console.error(error.message)
 * }
 * ```
 */

// Re-export base error and types
export * from './base.js'

// Re-export API errors
export * from './api.js'

// Re-export config errors
export * from './config.js'

// Re-export validation errors
export * from './validation.js'

// Re-export CLI errors
export * from './cli.js'

// Re-export utility functions
export * from './utils.js'
