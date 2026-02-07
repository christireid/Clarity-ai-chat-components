/**
 * Internal Utilities
 *
 * @internal
 * This module contains internal utilities that are NOT part of the public API.
 * These utilities are used internally by the library and should not be imported
 * directly by consumers.
 *
 * If you find yourself needing these utilities, please open an issue to discuss
 * making them part of the public API.
 */

// Type assertions and guards
export {
  assertDefined,
  isDefined,
  isNonEmptyString,
  isValidNumber,
  isPlainObject,
  isArray,
  isFunction,
  isPromise,
  assert,
  assertNever,
} from './assertions'

// Constants
export {
  DEFAULT_TOKEN_LIMITS,
  DEFAULT_STREAMING_CONFIG,
  DEFAULT_MEMORY_CONFIG,
  ANIMATION_DURATIONS,
  Z_INDEX,
  BREAKPOINTS,
  ERROR_CODES,
  MESSAGE_ROLES,
  STORAGE_KEYS,
} from './constants'

// Helper functions
export {
  generateId,
  deepClone,
  deepMerge,
  // Note: retry is not exported from helpers - use @clarity-chat/utils/async instead
  cancellable,
  truncate,
} from './helpers'

// Import from canonical sources
export { debounce, throttle } from '@clarity-chat/utils/async'
export { memoize } from '@clarity-chat/utils/cache'

// Development warnings (stripped in production)
export {
  warn,
  devWarning,
  deprecatedProp,
  deprecatedComponent,
  missingProviderWarning,
  performanceWarning,
  inlineFunctionWarning,
  accessibilityWarning,
  validateProp,
  requireProp,
  validateEnumProp,
  resetWarnings,
  hasWarned,
  type WarningCategory,
  type WarningOptions,
} from './dev-warnings'

// Debug mode utilities (browser console access)
export {
  enableDebug,
  disableDebug,
  getDebugConfig,
  getDebugLogs,
  clearDebugLogs,
  debugLog,
  debug,
  measurePerformance,
  measurePerformanceAsync,
  initDebugMode,
  type LogLevel,
  type DebugLogEntry,
  type DebugConfig,
  type ClarityDebugInterface,
} from './debug'

// Component-specific error utilities
export {
  ComponentError,
  invariant,
  createComponentInvariant,
  throwMissingProviderError,
  throwInvalidPropError,
  throwMissingPropError,
  createErrorHandler,
  withComponentErrorHandling,
  isComponentError,
  type ComponentErrorCode,
  type ComponentErrorOptions,
} from './component-errors'

// Internal hooks (not for public use)
export {
  useChat as useChatEnhanced,
  type CoreMessage,
  type CoreMessageContent,
  type UseChatOptions as UseChatEnhancedOptions,
  type UseChatReturn as UseChatEnhancedReturn,
} from './hooks'
