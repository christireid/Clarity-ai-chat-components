/**
 * Enhanced error handling system for Clarity Chat
 * 
 * Provides developer-friendly error messages with:
 * - Clear descriptions of what went wrong
 * - Step-by-step solutions
 * - Code examples
 * - Links to documentation
 * - Contextual information for debugging
 * 
 * @example
 * ```typescript
 * import { APIKeyMissingError } from '@clarity-chat/errors'
 * 
 * if (!process.env.OPENAI_API_KEY) {
 *   throw new APIKeyMissingError('openai')
 * }
 * ```
 */

// Base error class
export { ClarityError, ErrorContext, ErrorSolution } from './base-error'

// API errors
export {
  APIKeyMissingError,
  APIRateLimitError,
  APIAuthenticationError,
  APINetworkError,
  APIResponseError
} from './api-errors'

// Configuration errors
export {
  EnvVarMissingError,
  InvalidConfigError,
  PortAlreadyInUseError,
  FileNotFoundError,
  DependencyMissingError
} from './config-errors'

// Validation errors
export {
  ValidationError,
  InvalidInputError,
  MissingFieldError,
  TypeMismatchError
} from './validation-errors'

// Helper functions
export { formatError, logError, handleError } from './utils'
