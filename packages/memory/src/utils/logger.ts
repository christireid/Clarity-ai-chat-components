/**
 * Logger Utility
 *
 * Centralized logging with levels and formatting
 */

export type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug'

export interface Logger {
  error(message: string, ...args: unknown[]): void
  warn(message: string, ...args: unknown[]): void
  info(message: string, ...args: unknown[]): void
  debug(message: string, ...args: unknown[]): void
}

class ClarityLogger implements Logger {
  private level: LogLevel
  private prefix: string

  constructor(level: LogLevel = 'warn', prefix: string = '[ClarityMemory]') {
    this.level = level
    this.prefix = prefix
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['silent', 'error', 'warn', 'info', 'debug']
    const currentLevelIndex = levels.indexOf(this.level)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex <= currentLevelIndex
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(`${this.prefix} [ERROR] ${message}`, ...args)
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`${this.prefix} [WARN] ${message}`, ...args)
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(`${this.prefix} [INFO] ${message}`, ...args)
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(`${this.prefix} [DEBUG] ${message}`, ...args)
    }
  }

  setLevel(level: LogLevel): void {
    this.level = level
  }
}

// Default logger instance
export const memoryLogger = new ClarityLogger()

/**
 * Create a logger instance
 */
export function createLogger(level: LogLevel = 'warn', prefix?: string): Logger {
  return new ClarityLogger(level, prefix)
}
