/**
 * Clarity Memory - Core Type Definitions
 *
 * This file contains all core type definitions for Clarity Memory.
 */
// ============================================================================
// Error Types
// ============================================================================
/**
 * Memory error class
 */
export class MemoryError extends Error {
    code;
    cause;
    constructor(message, code, cause) {
        super(message);
        this.code = code;
        this.cause = cause;
        this.name = 'MemoryError';
    }
}
/**
 * Memory error codes
 */
export const MemoryErrorCodes = {
    STORE_ERROR: 'STORE_ERROR',
    EMBEDDING_ERROR: 'EMBEDDING_ERROR',
    TOKEN_BUDGET_EXCEEDED: 'TOKEN_BUDGET_EXCEEDED',
    INVALID_CONFIG: 'INVALID_CONFIG',
    MEMORY_NOT_FOUND: 'MEMORY_NOT_FOUND',
};
//# sourceMappingURL=index.js.map