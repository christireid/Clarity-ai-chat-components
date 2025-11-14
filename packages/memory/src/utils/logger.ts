/**
 * Clarity Memory - Logger Utility
 * 
 * Simple logging utility for development and debugging.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface Logger {
  debug: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
}

class MemoryLogger implements Logger {
  private enabled: boolean
  private level: LogLevel

  constructor(enabled = false, level: LogLevel = 'info') {
    this.enabled = enabled
    this.level = level
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false
    
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    return levels.indexOf(level) >= levels.indexOf(this.level)
  }

  private formatMessage(level: LogLevel, ...args: unknown[]): void {
    if (!this.shouldLog(level)) return

    const prefix = `[Clarity Memory] [${level.toUpperCase()}]`
    const timestamp = new Date().toISOString()
    
    switch (level) {
      case 'debug':
        console.debug(prefix, timestamp, ...args)
        break
      case 'info':
        console.info(prefix, timestamp, ...args)
        break
      case 'warn':
        console.warn(prefix, timestamp, ...args)
        break
      case 'error':
        console.error(prefix, timestamp, ...args)
        break
    }
  }

  debug(...args: unknown[]): void {
    this.formatMessage('debug', ...args)
  }

  info(...args: unknown[]): void {
    this.formatMessage('info', ...args)
  }

  warn(...args: unknown[]): void {
    this.formatMessage('warn', ...args)
  }

  error(...args: unknown[]): void {
    this.formatMessage('error', ...args)
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  setLevel(level: LogLevel): void {
    this.level = level
  }
}

/**
 * Create a logger instance
 */
export function createLogger(enabled = false, level: LogLevel = 'info'): Logger {
  return new MemoryLogger(enabled, level)
}

/**
 * Default logger instance
 */
export const logger = createLogger(
  process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development',
  (process.env.LOG_LEVEL as LogLevel) || 'info'
)
