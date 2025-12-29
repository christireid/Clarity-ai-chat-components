import { getLogger } from '@/lib/logging'

const logger = getLogger('secure')

/**
 * Secure logging utility for production environments
 * Adapts the legacy SecureLogger interface to the new standard logger
 */
export class SecureLogger {
  static debug(message: string, ...args: unknown[]) {
    logger.debug(message, ...args)
  }

  static info(message: string, ...args: unknown[]) {
    logger.info(message, ...args)
  }

  static warn(message: string, ...args: unknown[]) {
    logger.warn(message, ...args)
  }

  static error(message: string, ...args: unknown[]) {
    logger.error(message, ...args)
  }

  static getInstance() {
    return SecureLogger
  }
}

/**
 * Log API errors with context
 */
export function logApiError(
  context: string,
  error: unknown,
  details?: Record<string, unknown>
) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  logger.error(`[${context}] API Error:`, {
    message: errorMessage,
    stack: errorStack,
    ...details,
  })
}

export const loggerInstance = SecureLogger
export { loggerInstance as secureLogger }
export { getLogger }
