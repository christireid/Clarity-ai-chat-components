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
export { ClarityError } from './base-error.js';
// API errors
export { APIKeyMissingError, APIRateLimitError, APIAuthenticationError, APINetworkError, APIResponseError } from './api-errors.js';
// Configuration errors
export { EnvVarMissingError, InvalidConfigError, PortAlreadyInUseError, FileNotFoundError, DependencyMissingError } from './config-errors.js';
// Validation errors
export { ValidationError, InvalidInputError, MissingFieldError, TypeMismatchError } from './validation-errors.js';
// Helper functions
export { formatError, logError, handleError, createErrorHandler, withErrorHandling, assert, tryCatch } from './utils.js';
//# sourceMappingURL=index.js.map