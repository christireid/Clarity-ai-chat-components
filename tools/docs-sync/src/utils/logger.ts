/**
 * Logger re-export from @clarity-chat/utils
 *
 * Re-exports the canonical logger and adds CLI-specific helpers
 */

// Re-export canonical logger
export {
  type Logger,
  type LogEntry,
  type LoggerOptions,
  LogLevel,
  getLogger,
  logger,
  setGlobalLogLevel,
  configureLogger,
  info,
  warn,
  error,
  success,
  debug,
} from '@clarity-chat/utils/logger'

// Re-export progress utilities
export {
  startSpinner,
  updateSpinner,
  succeedSpinner,
  failSpinner,
  warnSpinner,
  stopSpinner,
  ProgressTracker,
  printSummary,
  formatSize,
} from '@clarity-chat/utils/progress'
