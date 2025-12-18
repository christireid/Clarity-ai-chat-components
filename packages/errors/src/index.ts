/**
 * @clarity-chat/errors
 *
 * @deprecated This package is deprecated and will be removed in v2.0.0.
 * Please migrate to @clarity-chat/utils/errors instead.
 *
 * Migration guide:
 *
 * Before:
 * ```ts
 * import { ClarityError, APIKeyMissingError, ValidationError } from '@clarity-chat/errors'
 * ```
 *
 * After:
 * ```ts
 * import { ClarityError, APIKeyMissingError, ValidationError } from '@clarity-chat/utils/errors'
 * // Or from main entry:
 * import { ClarityError, APIKeyMissingError, ValidationError } from '@clarity-chat/utils'
 * ```
 *
 * @see https://github.com/christireid/Clarity-ai-chat-components/blob/main/packages/utils/MIGRATION.md
 */

// Show deprecation warning in development
if (
  typeof process !== 'undefined' &&
  process.env?.['NODE_ENV'] !== 'production'
) {
  console.warn(
    '\x1b[33m[@clarity-chat/errors] DEPRECATION WARNING\x1b[0m\n' +
      '\n' +
      'This package has been consolidated into @clarity-chat/utils.\n' +
      'Please update your imports:\n' +
      '\n' +
      "  Before: import { ... } from '@clarity-chat/errors'\n" +
      "  After:  import { ... } from '@clarity-chat/utils/errors'\n" +
      '\n' +
      'This package will be removed in v2.0.0.\n'
  )
}

// Re-export everything from the consolidated utils package

// Base error class
export {
  ClarityError,
  GenericClarityError,
  type ErrorContext,
  type ErrorSolution,
} from '@clarity-chat/utils'

// API errors
export {
  APIKeyMissingError,
  APIRateLimitError,
  APIAuthenticationError,
  APINetworkError,
  APIResponseError,
  APITimeoutError,
} from '@clarity-chat/utils'

// Configuration errors
export {
  EnvVarMissingError,
  InvalidConfigError,
  PortAlreadyInUseError,
  FileNotFoundError,
  DependencyMissingError,
  ConfigParseError,
} from '@clarity-chat/utils'

// Validation errors
export {
  ValidationError,
  InvalidInputError,
  MissingFieldError,
  TypeMismatchError,
  RangeError,
  FormatError,
} from '@clarity-chat/utils'

// Error utilities
export {
  formatError,
  logError,
  handleError,
  createErrorHandler,
  withErrorHandling,
  assert,
  tryCatch,
  tryCatchSync,
  getStatusCode,
  isErrorType,
  getErrorMessage,
  normalizeError,
} from '@clarity-chat/utils'
