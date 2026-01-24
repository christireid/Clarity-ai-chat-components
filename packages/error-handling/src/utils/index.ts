/**
 * Utility functions for error handling
 */

// API handler utilities
export {
  successResponse,
  errorResponse,
  apiHandler,
  streamingApiHandler,
  writeErrorToStream,
  parseSSEError,
} from './api-handler'
export type { ApiResponse, ApiHandlerContext, ApiHandler } from './api-handler'

// Error logging utilities
export {
  createErrorLogger,
  getErrorLogger,
  configureErrorLogger,
  logError,
  logWarning,
  logInfo,
  reactErrorInfoToLogOptions,
} from './error-logger'
export type {
  ErrorLogEntry,
  ErrorLoggerConfig,
  ErrorLogger,
  LogOptions,
} from './error-logger'

// Error reporter
export { errorReporter } from './error-reporter'
export type { ErrorReport } from './error-reporter'
