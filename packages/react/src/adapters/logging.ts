/**
 * Structured Logging for Model Adapters
 *
 * Provides structured, leveled logging with:
 * - Log levels (debug, info, warn, error)
 * - Structured context and metadata
 * - Correlation IDs for request tracing
 * - Automatic sensitive data scrubbing
 * - Pluggable log transports (console, file, external)
 * - Performance-optimized (async, buffered)
 */

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Numeric severity for filtering
 */
const LOG_LEVEL_SEVERITY: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
}

/**
 * Structured log entry
 */
export interface LogEntry {
  /** Log level */
  level: LogLevel
  /** Log message */
  message: string
  /** Timestamp (ISO 8601) */
  timestamp: string
  /** Provider name (openai, anthropic, google, etc.) */
  provider?: string
  /** Correlation ID for request tracing */
  correlationId?: string
  /** Operation type (chat, stream, retry, etc.) */
  operation?: string
  /** Structured metadata */
  metadata?: Record<string, unknown>
  /** Error object (for error level) */
  error?: {
    name: string
    message: string
    code?: string
    stack?: string
  }
  /** Performance metrics */
  metrics?: {
    durationMs?: number
    tokenCount?: number
    cost?: number
  }
}

/**
 * Log transport interface for custom logging backends
 */
export interface LogTransport {
  /** Send log entry to transport */
  log(entry: LogEntry): void | Promise<void>
  /** Flush any buffered logs */
  flush?(): void | Promise<void>
}

/**
 * Console log transport with color coding
 */
export class ConsoleLogTransport implements LogTransport {
  private colors = {
    [LogLevel.DEBUG]: '\x1b[36m', // Cyan
    [LogLevel.INFO]: '\x1b[32m', // Green
    [LogLevel.WARN]: '\x1b[33m', // Yellow
    [LogLevel.ERROR]: '\x1b[31m', // Red
  }
  private reset = '\x1b[0m'

  log(entry: LogEntry): void {
    const color = this.colors[entry.level]
    const prefix = `${color}[${entry.level.toUpperCase()}]${this.reset}`
    const timestamp = new Date(entry.timestamp).toISOString()
    const provider = entry.provider ? ` [${entry.provider}]` : ''
    const correlationId = entry.correlationId
      ? ` [${entry.correlationId.slice(0, 8)}]`
      : ''

    let message = `${prefix} ${timestamp}${provider}${correlationId} ${entry.message}`

    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      message += `\n  Metadata: ${JSON.stringify(entry.metadata, null, 2)}`
    }

    if (entry.metrics) {
      message += `\n  Metrics: ${JSON.stringify(entry.metrics, null, 2)}`
    }

    if (entry.error) {
      message += `\n  Error: ${entry.error.name}: ${entry.error.message}`
      if (entry.error.code) {
        message += `\n  Code: ${entry.error.code}`
      }
      if (entry.error.stack) {
        message += `\n  Stack: ${entry.error.stack}`
      }
    }

    console.log(message)
  }
}

/**
 * JSON log transport for structured logging systems
 */
export class JSONLogTransport implements LogTransport {
  log(entry: LogEntry): void {
    console.log(JSON.stringify(entry))
  }
}

/**
 * Buffered log transport for batching
 */
export class BufferedLogTransport implements LogTransport {
  private buffer: LogEntry[] = []
  private flushInterval: NodeJS.Timeout | null = null

  constructor(
    private target: LogTransport,
    private bufferSize = 100,
    private flushIntervalMs = 5000
  ) {
    // Auto-flush on interval
    this.flushInterval = setInterval(() => {
      this.flush()
    }, flushIntervalMs)
  }

  log(entry: LogEntry): void {
    this.buffer.push(entry)

    // Flush if buffer full
    if (this.buffer.length >= this.bufferSize) {
      this.flush()
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return

    const entries = [...this.buffer]
    this.buffer = []

    for (const entry of entries) {
      await this.target.log(entry)
    }
  }

  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
      this.flushInterval = null
    }
    this.flush()
  }
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  /** Minimum log level to output */
  level?: LogLevel
  /** Log transports */
  transports?: LogTransport[]
  /** Default provider name */
  provider?: string
  /** Enable sensitive data scrubbing */
  scrubSensitiveData?: boolean
  /** Sensitive field names to scrub */
  sensitiveFields?: string[]
}

/**
 * Structured logger for model adapters
 */
export class Logger {
  private level: LogLevel
  private transports: LogTransport[]
  private provider?: string
  private scrubSensitiveData: boolean
  private sensitiveFields: Set<string>
  private correlationId?: string

  constructor(config: LoggerConfig = {}) {
    this.level = config.level || LogLevel.INFO
    this.transports = config.transports || [new ConsoleLogTransport()]
    this.provider = config.provider
    this.scrubSensitiveData = config.scrubSensitiveData ?? true
    this.sensitiveFields = new Set(
      config.sensitiveFields || [
        'apiKey',
        'api_key',
        'apikey',
        'authorization',
        'password',
        'secret',
        'token',
        'x-api-key',
      ]
    )
  }

  /**
   * Set correlation ID for request tracing
   */
  setCorrelationId(id: string): Logger {
    const logger = this.clone()
    logger.correlationId = id
    return logger
  }

  /**
   * Set provider context
   */
  setProvider(provider: string): Logger {
    const logger = this.clone()
    logger.provider = provider
    return logger
  }

  /**
   * Create child logger with additional context
   */
  child(context: Partial<LoggerConfig>): Logger {
    return new Logger({
      level: context.level || this.level,
      transports: context.transports || this.transports,
      provider: context.provider || this.provider,
      scrubSensitiveData:
        context.scrubSensitiveData ?? this.scrubSensitiveData,
      sensitiveFields: context.sensitiveFields || Array.from(this.sensitiveFields),
    })
  }

  /**
   * Clone logger
   */
  private clone(): Logger {
    const logger = new Logger({
      level: this.level,
      transports: this.transports,
      provider: this.provider,
      scrubSensitiveData: this.scrubSensitiveData,
      sensitiveFields: Array.from(this.sensitiveFields),
    })
    logger.correlationId = this.correlationId
    return logger
  }

  /**
   * Check if level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return (
      LOG_LEVEL_SEVERITY[level] >= LOG_LEVEL_SEVERITY[this.level]
    )
  }

  /**
   * Scrub sensitive data from object
   */
  private scrub(obj: unknown): unknown {
    if (!this.scrubSensitiveData) return obj

    if (typeof obj !== 'object' || obj === null) return obj

    if (Array.isArray(obj)) {
      return obj.map((item) => this.scrub(item))
    }

    const scrubbed: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase()
      if (this.sensitiveFields.has(lowerKey)) {
        scrubbed[key] = '[REDACTED]'
      } else if (typeof value === 'object' && value !== null) {
        scrubbed[key] = this.scrub(value)
      } else {
        scrubbed[key] = value
      }
    }
    return scrubbed
  }

  /**
   * Create log entry
   */
  private createEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      provider: this.provider,
      correlationId: this.correlationId,
    }

    if (metadata) {
      entry.metadata = this.scrub(metadata) as Record<string, unknown>
      if (entry.metadata.operation) {
        entry.operation = entry.metadata.operation as string
      }
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        code: (error as any).code,
        stack: error.stack,
      }
    }

    return entry
  }

  /**
   * Send log entry to transports
   */
  private async send(entry: LogEntry): Promise<void> {
    for (const transport of this.transports) {
      try {
        await transport.log(entry)
      } catch (error) {
        // Don't let transport errors break logging
        console.error('Log transport error:', error)
      }
    }
  }

  /**
   * Debug log
   */
  debug(message: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return
    const entry = this.createEntry(LogLevel.DEBUG, message, metadata)
    this.send(entry)
  }

  /**
   * Info log
   */
  info(message: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.INFO)) return
    const entry = this.createEntry(LogLevel.INFO, message, metadata)
    this.send(entry)
  }

  /**
   * Warning log
   */
  warn(message: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.WARN)) return
    const entry = this.createEntry(LogLevel.WARN, message, metadata)
    this.send(entry)
  }

  /**
   * Error log
   */
  error(
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>
  ): void {
    if (!this.shouldLog(LogLevel.ERROR)) return
    const entry = this.createEntry(LogLevel.ERROR, message, metadata, error)
    this.send(entry)
  }

  /**
   * Log with custom level
   */
  log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) return
    const entry = this.createEntry(level, message, metadata, error)
    this.send(entry)
  }

  /**
   * Flush all transports
   */
  async flush(): Promise<void> {
    for (const transport of this.transports) {
      if (transport.flush) {
        await transport.flush()
      }
    }
  }
}

/**
 * Global logger instance
 */
export const globalLogger = new Logger({
  level: LogLevel.INFO,
  transports: [new ConsoleLogTransport()],
  scrubSensitiveData: true,
})

/**
 * Create correlation ID for request tracing
 */
export function createCorrelationId(): string {
  // Generate UUID v4-like ID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Log adapter request
 */
export function logAdapterRequest(
  provider: string,
  operation: string,
  metadata: Record<string, unknown>
): void {
  globalLogger
    .setProvider(provider)
    .info(`${operation} request started`, {
      operation,
      ...metadata,
    })
}

/**
 * Log adapter response
 */
export function logAdapterResponse(
  provider: string,
  operation: string,
  durationMs: number,
  metadata: Record<string, unknown>
): void {
  globalLogger
    .setProvider(provider)
    .info(`${operation} request completed`, {
      operation,
      metrics: { durationMs },
      ...metadata,
    })
}

/**
 * Log adapter error
 */
export function logAdapterError(
  provider: string,
  operation: string,
  error: Error,
  metadata: Record<string, unknown>
): void {
  globalLogger
    .setProvider(provider)
    .error(`${operation} request failed`, error, {
      operation,
      ...metadata,
    })
}
