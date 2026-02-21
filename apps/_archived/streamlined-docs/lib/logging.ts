/**
 * Simple logging utility for the docs app
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface Logger {
  debug: (message: string, ...args: unknown[]) => void
  info: (message: string, ...args: unknown[]) => void
  warn: (message: string, ...args: unknown[]) => void
  error: (message: string, ...args: unknown[]) => void
}

const isDev = process.env.NODE_ENV === 'development'

function createLogger(namespace: string): Logger {
  const prefix = `[${namespace}]`

  return {
    debug: (message: string, ...args: unknown[]) => {
      if (isDev) {
        console.debug(prefix, message, ...args)
      }
    },
    info: (message: string, ...args: unknown[]) => {
      console.info(prefix, message, ...args)
    },
    warn: (message: string, ...args: unknown[]) => {
      console.warn(prefix, message, ...args)
    },
    error: (message: string, ...args: unknown[]) => {
      console.error(prefix, message, ...args)
    },
  }
}

const loggers = new Map<string, Logger>()

export function getLogger(namespace: string): Logger {
  if (!loggers.has(namespace)) {
    loggers.set(namespace, createLogger(namespace))
  }
  return loggers.get(namespace)!
}

// Default logger
export const logger = getLogger('app')
