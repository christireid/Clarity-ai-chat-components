import { warn } from '@clarity-chat/utils';
/**
 * @clarity-chat/shared-utils
 *
 * @deprecated This package is deprecated and will be removed in v2.0.0.
 * Please migrate to @clarity-chat/utils instead.
 *
 * Migration guide:
 *
 * Before:
 * ```ts
 * import { getLogger, LRUCache, startSpinner } from '@clarity-chat/shared-utils'
 * ```
 *
 * After:
 * ```ts
 * import { getLogger, LRUCache, startSpinner } from '@clarity-chat/utils'
 * // Or for better tree-shaking:
 * import { LRUCache } from '@clarity-chat/utils/cache'
 * import { startSpinner } from '@clarity-chat/utils/progress'
 * ```
 *
 * @see https://github.com/christireid/Clarity-ai-chat-components/blob/main/packages/utils/MIGRATION.md
 */

// Show deprecation warning in development
if (
  typeof process !== 'undefined' &&
  process.env?.['NODE_ENV'] !== 'production'
) {
  warn(
    '\x1b[33m[@clarity-chat/shared-utils] DEPRECATION WARNING\x1b[0m\n' +
      '\n' +
      'This package has been consolidated into @clarity-chat/utils.\n' +
      'Please update your imports:\n' +
      '\n' +
      "  Before: import { ... } from '@clarity-chat/shared-utils'\n" +
      "  After:  import { ... } from '@clarity-chat/utils'\n" +
      '\n' +
      'This package will be removed in v2.0.0.\n'
  )
}

// Re-export everything from the consolidated utils package

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
} from '@clarity-chat/utils'

// Progress (from @clarity-chat/utils/progress)
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
} from '@clarity-chat/utils'

// Format helpers (were in progress.ts)
export { formatDuration, formatSize } from '@clarity-chat/utils'

// Cache (from @clarity-chat/utils/cache)
export {
  getContentHash,
  createCacheKey,
  LRUCache,
  TTLCache,
  memoize,
  memoizeAsync,
} from '@clarity-chat/utils'

// CLI Errors (from @clarity-chat/utils/errors)
// Note: Some error class names changed. Using aliases for backward compatibility.
export {
  ExitCode,
  CLIError,
  CLIValidationError as ValidationError,
  CLIConfigError as ConfigError,
  CLINotFoundError as NotFoundError,
  CLIPermissionError as PermissionError,
  handleCLIError as handleError,
  withCLIErrorHandling as withErrorHandling,
} from '@clarity-chat/utils'
