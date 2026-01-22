/**
 * Simple logger utility for development and production
 * Maps to console methods with optional namespace support
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface Logger {
  debug: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
}

const isProduction = process.env.NODE_ENV === 'production'

function createLogger(namespace?: string): Logger {
  const prefix = namespace ? `[${namespace}]` : ''

  return {
    debug: (...args: unknown[]) => {
      if (!isProduction) {
        console.debug(prefix, ...args)
      }
    },
    info: (...args: unknown[]) => {
      console.info(prefix, ...args)
    },
    warn: (...args: unknown[]) => {
      console.warn(prefix, ...args)
    },
    error: (...args: unknown[]) => {
      console.error(prefix, ...args)
    },
  }
}

// Default logger instance
export const logger = createLogger()

// Factory function to create namespaced loggers
export function getLogger(namespace: string): Logger {
  return createLogger(namespace)
}

export default logger
