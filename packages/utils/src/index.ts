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

export * from './format/index.js'

// ============================================================================
// ID Generation
// ============================================================================

export {
  generateId,
  generatePrefixedId,
  generateSimpleId,
  isGeneratedId,
  extractTimestamp,
} from './id.js'

// ============================================================================
// Environment Detection
// ============================================================================

export {
  isBrowser,
  isServer,
  isNode,
  isServerless,
  detectEnvironment,
  isIndexedDBAvailable,
  isLocalStorageAvailable,
  isFetchAvailable,
  isWebWorkerAvailable,
  isDevelopment,
  isProduction,
  isTest,
  type RuntimeEnvironment,
} from './env.js'

// ============================================================================
// Math Utilities
// ============================================================================

export {
  clamp,
  calculatePercentage,
  lerp,
  inverseLerp,
  round,
  mapRange,
  inRange,
  average,
  sum,
} from './math.js'

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
  type TTLCacheOptions,
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
  logger,
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
// TypeScript Strict Mode Utilities
// ============================================================================

export {
  // Enhanced strict type guards
  isStrictString,
  isStrictNumber,
  isStrictBoolean,
  isStrictFunction,
  isStrictObject,
  isStrictArray,
  isStrictArrayOf,
  isStrictNull,
  isStrictUndefined,
  isStrictNullish,
  isStrictDefined,
  isStrictNonEmptyString,
  isStrictNonEmptyArray,
  isStrictValidDate,
  isStrictPromise,
  isStrictError,
  // Enhanced strict assertions
  strictAssertDefined,
  strictAssertString,
  strictAssertNumber,
  strictAssertBoolean,
  strictAssertObject,
  strictAssertArray,
  strictAssertFunction,
  strictAssert,
  strictAssertNever,
  // Enhanced strict validation
  validateStrictString,
  validateStrictNumber,
  validateStrictArray,
  // Enhanced strict runtime checking
  strictTypeOf,
  validateStrictUnion,
  validateStrictEnum,
  validateStrictDate,
  // Enhanced strict format validation
  isStrictValidEmail,
  isStrictValidUrl,
  isStrictValidUuid,
  isStrictValidJson,
  parseStrictJson,
  // Enhanced strict object utilities
  strictHasKey,
  strictHasKeys,
  strictPick,
  strictOmit,
  // Enhanced strict property access
  strictPropertyAccess,
  strictArrayAccess,
  // Enhanced strict utility functions
  createStrictTypeGuard,
  and,
  or,
  not,
  optional,
  arrayOf,
  tuple,
  record,
  strictMeasurePerformance,
  // Re-export types
  type StrictValidation,
  type StrictValidationSuccess,
  type StrictValidationError,
  type StrictTypeGuard,
  type StrictAssertion,
  type StrictStringValidationOptions,
  type StrictNumberValidationOptions,
  type StrictArrayValidationOptions,
} from './typescript-strict.js'

// ============================================================================
// File System Utilities
// ============================================================================
// NOTE: File system utilities are NOT exported from the main entry to keep
// the bundle browser-compatible. Use '@clarity-chat/utils/fs' for server-side
// file system utilities (pathExists, directoryExists, fileExists).

// ============================================================================
// Configuration Manager
// ============================================================================

export {
  createConfigManager,
  createSimpleConfig,
  validateConfig,
  getConfigDefaults,
  mergeConfig,
  type ConfigSchema,
  type ConfigFieldSchema,
  type ConfigManager,
} from './config-manager.js'

// ============================================================================
// Performance Monitor
// ============================================================================

export {
  PerformanceMonitor,
  measurePerformance,
  measureAsyncPerformance,
  startPerformanceTimer,
  endPerformanceTimer,
  getPerformanceMetrics,
  formatPerformanceMetrics,
  getPerformanceSummary,
  type PerformanceMetrics,
  type OperationTiming,
  type PerformanceOptions,
} from './performance.js'

// ============================================================================
// Unified Error Handler
// ============================================================================

export {
  UnifiedErrorHandler,
  handleError as handleUnifiedError, // Rename to avoid conflict with errors/utils.js
  isRetryableError,
  formatErrorForDisplay,
  retryOperation,
  type ErrorContext as UnifiedErrorContext, // Rename to avoid conflict
  type ErrorReport,
  type ProcessedError,
  type RetryConfig,
} from './error-handler.js'

// ============================================================================
// String Utilities
// ============================================================================

export {
  escapeHtml,
  unescapeHtml,
  kebabCase,
  camelCase,
  pascalCase,
  snakeCase,
  randomString,
} from './string.js'

// ============================================================================
// DOM Utilities (Browser-specific, SSR-safe)
// ============================================================================

export {
  copyToClipboard,
  downloadFile,
  scrollIntoView,
  getScrollPosition,
  isInViewport,
} from './dom.js'

// ============================================================================
// Object Utilities
// ============================================================================

export {
  isEqual,
  deepEqual,
  deepClone,
  deepMerge,
  isEmpty,
  isNotEmpty,
  getNestedValue,
  setNestedValue,
} from './object.js'
