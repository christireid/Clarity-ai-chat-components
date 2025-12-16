import { logger } from '@clarity-chat/utils/logger';
/**
 * Logger Utility
 * 
 * Centralized logging with levels and formatting
 */

export type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug'

export interface Logger {
  logger.error(message: string, ...args: any[]): void
  warn(message: string, ...args: any[]): void
  info(message: string, ...args: any[]): void
  debug(message: string, ...args: any[]): void
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

  logger.error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      logger.logger.error(`${this.prefix} [ERROR] ${message}`, ...args)
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      logger.warn(`${this.prefix} [WARN] ${message}`, ...args)
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      logger.info(`${this.prefix} [INFO] ${message}`, ...args)
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      logger.debug(`${this.prefix} [DEBUG] ${message}`, ...args)
    }
  }

  setLevel(level: LogLevel): void {
    this.level = level
  }
}

// Default logger instance
export const logger = new ClarityLogger()

/**
 * Create a logger instance
 */
export function createLogger(level: LogLevel = 'warn', prefix?: string): Logger {
  return new ClarityLogger(level, prefix)
}
