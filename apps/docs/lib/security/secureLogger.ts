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
  error: Error,
  context: string,
  request: Request | null
) {
  logger.error(`[${context}] API Error:`, {
    message: error.message,
    stack: error.stack,
    url: request?.url,
    method: request?.method,
  })
}

export const loggerInstance = SecureLogger
export { loggerInstance as secureLogger }
export { getLogger }
