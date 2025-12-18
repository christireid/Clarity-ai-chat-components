/**
 * SecureLogger - A wrapper around console for consistent logging
 *
 * This module provides a centralized logging interface for the MCP server.
 * All logging goes through stderr to maintain stdio transport compatibility.
 */

export const SecureLogger = {
  debug: (...args: unknown[]): void => {
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG) {
      console.error('[DEBUG]', ...args)
    }
  },

  info: (...args: unknown[]): void => {
    console.error('[INFO]', ...args)
  },

  warn: (...args: unknown[]): void => {
    console.error('[WARN]', ...args)
  },

  error: (...args: unknown[]): void => {
    console.error('[ERROR]', ...args)
  },

  log: (...args: unknown[]): void => {
    console.error(...args)
  },
}
