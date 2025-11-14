/**
 * Structured logging utility for MCP server
 * 
 * Uses console.error for stdio transport compatibility
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  requestId?: string
  error?: string
  metadata?: Record<string, any>
}

class Logger {
  private requestId?: string

  setRequestId(requestId: string) {
    this.requestId = requestId
  }

  clearRequestId() {
    this.requestId = undefined
  }

  private log(level: LogLevel, message: string, error?: Error, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(this.requestId && { requestId: this.requestId }),
      ...(error && { error: error.message, stack: error.stack }),
      ...(metadata && { metadata })
    }

    // Use console.error for stdio transport (stderr)
    console.error(JSON.stringify(entry))
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, undefined, metadata)
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log(LogLevel.INFO, message, undefined, metadata)
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log(LogLevel.WARN, message, undefined, metadata)
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, error, metadata)
  }
}

export const logger = new Logger()
