/**
 * Enhanced logger with multiple levels and formatting
 *
 * Re-exports the canonical logger from @clarity-chat/utils and adds
 * dev-tools specific UI helpers for boxes and tables.
 */

import { infoBox, warningBox, errorBox, successBox } from '../ui/box'
import { keyValueTable } from '../ui/table'
import {
  getLogger as utilsGetLogger,
  type Logger as UtilsLogger,
  type LoggerOptions as BaseLoggerOptions,
} from '@clarity-chat/utils/logger'

// Re-export canonical logger types and functions
export {
  LogLevel as LogLevelEnum,
  setGlobalLogLevel,
  configureLogger,
  logger,
  info,
  warn,
  error,
  success,
  debug,
} from '@clarity-chat/utils/logger'

export type { LogEntry } from '@clarity-chat/utils/logger'

// String-based log level type for compatibility
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error'

// Extended logger interface with dev-tools specific methods
export interface Logger extends UtilsLogger {
  trace: (message: string, context?: Record<string, any>) => void
  time: (label: string) => void
  timeEnd: (label: string) => void
}

// Extended options to support legacy API
export interface LoggerOptions extends BaseLoggerOptions {
  level?: string
  prefix?: string
  colors?: boolean // Ignored, kept for compatibility
}

// Dev-tools specific UI logging helpers
export function logInfoBox(message: string, context?: Record<string, any>): void {
  console.info(message, context)
  if (context) {
    console.log(infoBox(message, JSON.stringify(context)))
  }
}

export function logWarningBox(message: string, context?: Record<string, any>): void {
  console.warn(message, context)
  console.log(warningBox(message, context ? JSON.stringify(context) : undefined))
}

export function logErrorBox(message: string, context?: Record<string, any>): void {
  console.error(message, context)
  console.log(errorBox(message, context ? JSON.stringify(context) : undefined))
}

export function logSuccessBox(message: string, context?: Record<string, any>): void {
  console.info(message, context)
  console.log(successBox(message, context ? JSON.stringify(context) : undefined))
}

export function logKeyValue(data: Record<string, any>, title?: string): void {
  console.info(title || 'Key-Value Data', data)
  console.log(keyValueTable(data))
}

/**
 * Enhanced getLogger that adds dev-tools specific methods
 */
export function getLogger(namespace = 'app', options?: LoggerOptions): Logger {
  const baseLogger = utilsGetLogger(namespace)

  return {
    ...baseLogger,
    trace: (message: string, context?: Record<string, any>) => {
      baseLogger.debug(message, context)
    },
    time: (label: string) => {
      console.time(label)
    },
    timeEnd: (label: string) => {
      console.timeEnd(label)
    },
  }
}

/**
 * Create logger with options (alias for getLogger)
 * Supports legacy API with prefix option
 */
export function createLogger(options?: LoggerOptions): Logger {
  const namespace = options?.prefix || 'app'
  return getLogger(namespace, options)
}
