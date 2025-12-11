/**
 * @clarity-chat/utils
 *
 * Unified utility library for Clarity Chat.
 * Tree-shakeable, TypeScript-first utilities for formatting, caching,
 * logging, error handling, async operations, and validation.
 *
 * @packageDocumentation
 *
 * @example Import from specific modules for better tree-shaking:
 * ```ts
 * // Recommended: Import from specific modules
 * import { formatBytes, formatDuration } from '@clarity-chat/utils/format'
 * import { LRUCache, memoize } from '@clarity-chat/utils/cache'
 * import { getLogger } from '@clarity-chat/utils/logger'
 * import { debounce, retry } from '@clarity-chat/utils/async'
 * import { ValidationError, tryCatch } from '@clarity-chat/utils/errors'
 * import { isString, assertDefined } from '@clarity-chat/utils/validation'
 * ```
 *
 * @example Or import everything from the main entry:
 * ```ts
 * import { formatBytes, debounce, ValidationError } from '@clarity-chat/utils'
 * ```
 */

// ============================================================================
// Format Utilities
// ============================================================================

export {
  formatBytes,
  formatSize,
  formatDelta,
  formatDuration,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  truncate,
} from './format/index.js'

// ============================================================================
// Cache Utilities
// ============================================================================

export {
  getContentHash,
  createCacheKey,
  LRUCache,
  TTLCache,
  memoize,
  memoizeAsync,
  type MemoizeOptions,
} from './cache/index.js'

// ============================================================================
// Logger
// ============================================================================

export {
  LogLevel,
  type LogLevelString,
  type LogEntry,
  type LoggerOptions,
  type Logger,
  configureLogger,
  setGlobalLogLevel,
  setRequestId,
  getRequestId,
  getLogger,
  info,
  warn,
  error,
  success,
  debug,
} from './logger/index.js'

// ============================================================================
// Progress (CLI spinners)
// ============================================================================

export {
  configureProgress,
  startSpinner,
  startSpinnerSync,
  updateSpinner,
  succeedSpinner,
  failSpinner,
  warnSpinner,
  stopSpinner,
  pauseSpinner,
  resumeSpinner,
  ProgressTracker,
} from './progress/index.js'

// ============================================================================
// Errors
// ============================================================================

// Base error
export {
  ClarityError,
  GenericClarityError,
  type ErrorContext,
  type ErrorSolution,
} from './errors/base.js'

// API errors
export {
  APIKeyMissingError,
  APIRateLimitError,
  APIAuthenticationError,
  APINetworkError,
  APIResponseError,
  APITimeoutError,
} from './errors/api.js'

// Config errors
export {
  EnvVarMissingError,
  InvalidConfigError,
  PortAlreadyInUseError,
  FileNotFoundError,
  DependencyMissingError,
  ConfigParseError,
} from './errors/config.js'

// Validation errors
export {
  ValidationError,
  InvalidInputError,
  MissingFieldError,
  TypeMismatchError,
  RangeError,
  FormatError,
} from './errors/validation.js'

// CLI errors
export {
  ExitCode,
  CLIError,
  CLIValidationError,
  CLIConfigError,
  CLINotFoundError,
  CLIPermissionError,
  handleCLIError,
  withCLIErrorHandling,
} from './errors/cli.js'

// Error utilities
export {
  formatError,
  logError,
  getStatusCode,
  handleError,
  createErrorHandler,
  withErrorHandling,
  assert,
  tryCatch,
  tryCatchSync,
  isErrorType,
  getErrorMessage,
  normalizeError,
} from './errors/utils.js'

// ============================================================================
// Async Utilities
// ============================================================================

export {
  debounce,
  throttle,
  retry,
  timeout,
  sleep,
  pool,
  createAbortController,
  waitUntil,
  type RetryOptions,
} from './async/index.js'

// ============================================================================
// Validation
// ============================================================================

export {
  // Type guards
  isString,
  isNumber,
  isBoolean,
  isFunction,
  isObject,
  isArray,
  isArrayOf,
  isNull,
  isUndefined,
  isNullish,
  isDefined,
  isNonEmptyString,
  isNonEmptyArray,
  isValidDate,
  isPromise,
  isError,
  // Assertions
  assertDefined,
  assertString,
  assertNumber,
  assertObject,
  assertArray,
  // Note: assert is exported from errors/utils.js
  assertNever,
  // Format validators
  isValidEmail,
  isValidUrl,
  isValidUUID,
  isValidJSON,
  parseJSON,
  // Object utilities
  hasKey,
  hasKeys,
  pick,
  omit,
} from './validation/index.js'

// ============================================================================
// File System Utilities
// ============================================================================

export { pathExists, directoryExists, fileExists } from './fs.js'
