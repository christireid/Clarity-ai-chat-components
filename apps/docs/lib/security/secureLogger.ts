import { getLogger } from '@clarity-chat/utils/logger';

const logger = getLogger('secure');

/**
 * Secure logging utility for production environments
 * Adapts the legacy SecureLogger interface to the new standard logger
 */
export class SecureLogger {
  static debug(message: string, ...args: any[]) {
    logger.debug(message, ...args);
  }

  static info(message: string, ...args: any[]) {
    logger.info(message, ...args);
  }

  static warn(message: string, ...args: any[]) {
    logger.warn(message, ...args);
  }

  static error(message: string, ...args: any[]) {
    logger.error(message, ...args);
  }

  static getInstance() {
    return SecureLogger;
  }
}

export const loggerInstance = SecureLogger;
export { loggerInstance as logger };