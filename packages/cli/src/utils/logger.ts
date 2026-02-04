/**
 * Logger re-export from @clarity-chat/utils
 *
 * For backward compatibility, this file re-exports the canonical logger
 * from the utils package.
 */

export {
  LogLevel,
  type LogEntry,
  type Logger,
  type LoggerOptions,
  getLogger,
  setGlobalLogLevel,
  setRequestId,
  getRequestId,
  configureLogger,
  logger,
  info,
  warn,
  error,
  success,
  debug,
} from '@clarity-chat/utils/logger'
