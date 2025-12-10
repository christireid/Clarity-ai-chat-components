/**
 * @clarity-chat/shared-utils
 *
 * Shared utilities for all Clarity Chat packages
 */

// Logger
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
} from './logger.js'

// Progress
export {
  configureProgress,
  startSpinner,
  updateSpinner,
  succeedSpinner,
  failSpinner,
  warnSpinner,
  stopSpinner,
  pauseSpinner,
  resumeSpinner,
  ProgressTracker,
  formatDuration,
  formatSize,
} from './progress.js'

// Cache
export {
  getContentHash,
  createCacheKey,
  LRUCache,
  TTLCache,
  memoize,
  memoizeAsync,
} from './cache.js'

// Errors
export {
  ExitCode,
  CLIError,
  ValidationError,
  ConfigError,
  NotFoundError,
  PermissionError,
  handleError,
  withErrorHandling,
} from './errors.js'
