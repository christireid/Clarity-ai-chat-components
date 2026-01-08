/**
 * SecureLogger - A wrapper around console for consistent logging
 *
 * This module provides a centralized logging interface for the MCP server.
 * All logging goes through stderr to maintain stdio transport compatibility.
 */
export const SecureLogger = {
    debug: (...args) => {
        if (process.env.NODE_ENV !== 'production' || process.env.DEBUG) {
            console.error('[DEBUG]', ...args);
        }
    },
    info: (...args) => {
        console.error('[INFO]', ...args);
    },
    warn: (...args) => {
        console.error('[WARN]', ...args);
    },
    error: (...args) => {
        console.error('[ERROR]', ...args);
    },
    log: (...args) => {
        console.error(...args);
    },
};
//# sourceMappingURL=secureLogger.js.map