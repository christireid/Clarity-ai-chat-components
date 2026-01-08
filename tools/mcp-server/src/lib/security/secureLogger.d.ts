/**
 * SecureLogger - A wrapper around console for consistent logging
 *
 * This module provides a centralized logging interface for the MCP server.
 * All logging goes through stderr to maintain stdio transport compatibility.
 */
export declare const SecureLogger: {
    debug: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
    log: (...args: unknown[]) => void;
};
//# sourceMappingURL=secureLogger.d.ts.map