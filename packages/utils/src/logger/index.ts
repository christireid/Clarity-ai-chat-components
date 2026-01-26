/**
 * Unified Logger
 *
 * Structured logging utility with log levels, namespaces, and request tracking.
 * Supports both pretty-printed and JSON output formats.
 *
 * SECURITY: Automatically redacts sensitive information (API keys, passwords, tokens)
 * from log output to prevent secret leakage.
 *
 * @example
 * ```ts
 *
 * const logger = getLogger('my-module')
 * logger.info('Starting process')
 * logger.error('Something went wrong', { detail: 'info' })
 * logger.debug('Debug info') // Only shown when DEBUG=true
 * ```
 */

/**
 * Sensitive patterns to detect and redact in logs
 * Prevents accidental exposure of secrets, API keys, passwords, and tokens
 */
const SENSITIVE_PATTERNS = [
  // API keys (various formats)
  /\b(api[_-]?key|apikey)[\s:=]+['"]?([a-zA-Z0-9_-]{16,})['"]?/gi,
  // Bearer tokens
  /\b(bearer|authorization)[\s:]+(['"]?)(bearer\s+)?([a-zA-Z0-9_.]{20,})\2/gi,
  // Passwords
  /\b(password|passwd|pwd)[\s:=]+['"]?([^\s'"]{6,})['"]?/gi,
  // Secret keys
  /\b(secret[_-]?key|secretkey)[\s:=]+['"]?([a-zA-Z0-9_-]{16,})['"]?/gi,
  // AWS keys
  /\b(AWS|aws)[_-]?(SECRET|secret)[_-]?(ACCESS|access)[_-]?(KEY|key)[\s:=]+['"]?([a-zA-Z0-9/+=]{40})['"]?/gi,
  // Private keys (PEM format indicators)
  /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----[\s\S]+?-----END\s+(RSA\s+)?PRIVATE\s+KEY-----/gi,
  // JWT tokens (3 base64 segments separated by dots)
  /\beyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
  // Generic tokens
  /\b(token|auth[_-]?token)[\s:=]+['"]?([a-zA-Z0-9_.]{20,})['"]?/gi,
] as const

/**
 * Sensitive field names to redact in objects
 */
const SENSITIVE_FIELDS = new Set([
  'password',
  'passwd',
  'pwd',
  'secret',
  'token',
  'apiKey',
  'api_key',
  'apikey',
  'accessToken',
  'access_token',
  'refreshToken',
  'refresh_token',
  'privateKey',
  'private_key',
  'secretKey',
  'secret_key',
  'authorization',
  'auth',
  'credentials',
])

/**
 * Redact secrets from a string
 */
function redactSecretsFromString(str: string): string {
  let redacted = str
  for (const pattern of SENSITIVE_PATTERNS) {
    redacted = redacted.replace(pattern, (match) => {
      // Keep the field name/prefix visible for debugging context
      const colonIndex = match.indexOf(':')
      const equalsIndex = match.indexOf('=')
      const splitIndex = Math.max(colonIndex, equalsIndex)

      if (splitIndex > 0) {
        const prefix = match.substring(0, splitIndex + 1)
        return `${prefix} [REDACTED]`
      }
      return '[REDACTED]'
    })
  }
  return redacted
}

/**
 * Redact secrets from an object (recursive)
 */
function redactSecretsFromObject(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (typeof obj === 'string') {
    return redactSecretsFromString(obj)
  }

  if (typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(redactSecretsFromObject)
  }

  const redacted: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase()

    // Check if field name is sensitive
    if (SENSITIVE_FIELDS.has(lowerKey)) {
      redacted[key] = '[REDACTED]'
      continue
    }

    // Recursively redact nested objects
    if (typeof value === 'string') {
      redacted[key] = redactSecretsFromString(value)
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSecretsFromObject(value)
    } else {
      redacted[key] = value
    }
  }

  return redacted
}

/**
 * Redact secrets from log arguments
 */
function redactSecrets(args: unknown[]): unknown[] {
  return args.map(redactSecretsFromObject)
}

/**
 * Log level enum for filtering output
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * String representation of log levels
 */
export type LogLevelString = 'debug' | 'info' | 'success' | 'warn' | 'error'

/**
 * Structured log entry
 */
export interface LogEntry {
  timestamp: string
  level: LogLevel
  namespace: string
  message: string
  data?: unknown
  error?: Error
}

/**
 * Logger configuration options
 */
export interface LoggerOptions {
  /** Enable verbose/debug logging */
  verbose?: boolean
  /** Suppress all output */
  silent?: boolean
  /** Include timestamps in output */
  timestamps?: boolean
  /** Output as JSON instead of pretty-printed */
  jsonOutput?: boolean
}

/**
 * Logger instance interface
 */
export interface Logger {
  info: (message: string, ...args: unknown[]) => void
  warn: (message: string, ...args: unknown[]) => void
  error: (message: string | Error, ...args: unknown[]) => void
  success: (message: string, ...args: unknown[]) => void
  debug: (message: string, ...args: unknown[]) => void
  setLevel: (level: LogLevel) => void
  getLevel: () => LogLevel
}

const DEFAULT_OPTIONS: LoggerOptions = {
  verbose: false,
  silent: false,
  timestamps: false,
  jsonOutput: false,
}

let globalOptions: LoggerOptions = { ...DEFAULT_OPTIONS }
let globalLogLevel: LogLevel =
  typeof process !== 'undefined' && process.env?.DEBUG
    ? LogLevel.DEBUG
    : LogLevel.INFO
let requestId: string | null = null

/**
 * Configure global logger options
 *
 * @param options - Logger options to merge with defaults
 *
 * @example
 * ```ts
 * configureLogger({ verbose: true, timestamps: true })
 * ```
 */
export function configureLogger(options: Partial<LoggerOptions>): void {
  globalOptions = { ...globalOptions, ...options }
  if (options.verbose) {
    globalLogLevel = LogLevel.DEBUG
  }
}

/**
 * Set global log level
 *
 * @param level - Minimum log level to display
 */
export function setGlobalLogLevel(level: LogLevel): void {
  globalLogLevel = level
}

/**
 * Set request ID for distributed tracing
 *
 * @param id - Request ID or null to clear
 */
export function setRequestId(id: string | null): void {
  requestId = id
}

/**
 * Get current request ID
 */
export function getRequestId(): string | null {
  return requestId
}

/**
 * Get current timestamp string (HH:MM:SS)
 */
function getTimestamp(): string {
  return new Date().toISOString().split('T')[1]?.slice(0, 8) ?? ''
}

/**
 * Format log entry as JSON
 */
function formatLogEntry(entry: LogEntry): string {
  return JSON.stringify({
    ...entry,
    error: entry.error
      ? {
          message: entry.error.message,
          stack: entry.error.stack,
          name: entry.error.name,
        }
      : undefined,
  })
}

/**
 * Log icons for each level
 */
const LOG_ICONS: Record<LogLevelString, string> = {
  debug: '🔍',
  info: 'ℹ',
  success: '✓',
  warn: '⚠',
  error: '✗',
}

/**
 * Create a namespaced logger instance
 *
 * @param namespace - Logger namespace (shown in output)
 * @param level - Initial log level (defaults to global level)
 * @returns Logger instance
 *
 * @example
 * ```ts
 * const logger = getLogger('api-client')
 * logger.info('Making request', { url: '/api/data' })
 * logger.error(new Error('Request failed'))
 * ```
 */
export function getLogger(
  namespace: string,
  level: LogLevel = globalLogLevel
): Logger {
  let instanceLevel = level

  const shouldLog = (logLevel: LogLevel): boolean => {
    if (globalOptions.silent) return false
    return logLevel >= instanceLevel && logLevel >= globalLogLevel
  }

  const formatPrefix = (icon: string): string => {
    const parts: string[] = []
    if (globalOptions.timestamps) {
      parts.push(`[${getTimestamp()}]`)
    }
    parts.push(`[${namespace}]`)
    parts.push(icon)
    if (requestId) {
      parts.push(`[${requestId.slice(0, 8)}]`)
    }
    return parts.join(' ')
  }

  const logMessage = (
    levelKey: LogLevelString,
    logLevel: LogLevel,
    message: string,
    args: unknown[],
    error?: Error
  ): void => {
    if (!shouldLog(logLevel)) return

    // Redact secrets from message and args before logging
    const redactedMessage = redactSecretsFromString(message)
    const redactedArgs = redactSecrets(args)

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: logLevel,
      namespace,
      message: redactedMessage,
      data: redactedArgs.length > 0 ? redactedArgs : undefined,
      error,
    }

    if (process.env.NODE_ENV === 'development') {
      const consoleFn =
        logLevel === LogLevel.ERROR
          ? console.error
          : logLevel === LogLevel.WARN
            ? console.warn
            : console.log

      const isJsonMode =
        globalOptions.jsonOutput ||
        (typeof process !== 'undefined' && process.env?.JSON_LOGS)

      if (isJsonMode) {
        consoleFn(formatLogEntry(entry))
      } else {
        consoleFn(
          formatPrefix(LOG_ICONS[levelKey]),
          redactedMessage,
          ...redactedArgs
        )

        if (
          error?.stack &&
          (globalOptions.verbose || logLevel === LogLevel.ERROR)
        ) {
          // Redact secrets from error stack traces
          const redactedStack = redactSecretsFromString(error.stack)
          console.error(redactedStack)
        }
      }
    }
  }

  return {
    info: (message: string, ...args: unknown[]) => {
      logMessage('info', LogLevel.INFO, message, args)
    },

    warn: (message: string, ...args: unknown[]) => {
      logMessage('warn', LogLevel.WARN, message, args)
    },

    error: (message: string | Error, ...args: unknown[]) => {
      const error = message instanceof Error ? message : undefined
      const errorMessage: string = error
        ? error.message
        : typeof message === 'string'
          ? message
          : String(message)
      logMessage('error', LogLevel.ERROR, errorMessage, args, error)
    },

    success: (message: string, ...args: unknown[]) => {
      logMessage('success', LogLevel.INFO, message, args)
    },

    debug: (message: string, ...args: unknown[]) => {
      logMessage('debug', LogLevel.DEBUG, message, args)
    },

    setLevel: (level: LogLevel) => {
      instanceLevel = level
    },

    getLevel: () => instanceLevel,
  }
}

// Create default logger instance
const defaultLogger = getLogger('app')

/**
 * Default logger instance - convenience export for simple usage
 */
export const logger = defaultLogger

/**
 * Log an info message using the default logger
 */
export const info = (message: string, ...args: unknown[]): void =>
  defaultLogger.info(message, ...args)

/**
 * Log a warning using the default logger
 */
export const warn = (message: string, ...args: unknown[]): void =>
  defaultLogger.warn(message, ...args)

/**
 * Log an error using the default logger
 */
export const error = (message: string | Error, ...args: unknown[]): void =>
  defaultLogger.error(message, ...args)

/**
 * Log a success message using the default logger
 */
export const success = (message: string, ...args: unknown[]): void =>
  defaultLogger.success(message, ...args)

/**
 * Log a debug message using the default logger
 */
export const debug = (message: string, ...args: unknown[]): void =>
  defaultLogger.debug(message, ...args)
