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
export { ClarityError, ErrorContext, ErrorSolution } from './base-error';
export { APIKeyMissingError, APIRateLimitError, APIAuthenticationError, APINetworkError, APIResponseError } from './api-errors';
export { EnvVarMissingError, InvalidConfigError, PortAlreadyInUseError, FileNotFoundError, DependencyMissingError } from './config-errors';
export { ValidationError, InvalidInputError, MissingFieldError, TypeMismatchError } from './validation-errors';
export { formatError, logError, handleError } from './utils';
//# sourceMappingURL=index.d.ts.map