/**
 * Internal Constants
 *
 * @internal
 * These constants are for internal use only and are not part of the public API.
 * They provide shared configuration values across the library.
 */
/**
 * Default token limits by model
 */
export const DEFAULT_TOKEN_LIMITS = {
    'gpt-4': 8192,
    'gpt-4-turbo': 128000,
    'gpt-4o': 128000,
    'gpt-4o-mini': 128000,
    'gpt-3.5-turbo': 16385,
    'claude-3-opus': 200000,
    'claude-3-sonnet': 200000,
    'claude-3-haiku': 200000,
    'claude-3.5-sonnet': 200000,
    default: 4096,
};
/**
 * Default streaming configuration
 */
export const DEFAULT_STREAMING_CONFIG = {
    chunkSize: 1024,
    bufferSize: 4096,
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
};
/**
 * Default memory configuration
 */
export const DEFAULT_MEMORY_CONFIG = {
    maxItems: 100,
    maxTokens: 4096,
    similarityThreshold: 0.7,
    strategy: 'hybrid',
};
/**
 * Animation durations in milliseconds
 */
export const ANIMATION_DURATIONS = {
    fast: 150,
    normal: 300,
    slow: 500,
};
/**
 * Z-index layers for consistent stacking
 */
export const Z_INDEX = {
    dropdown: 50,
    modal: 100,
    popover: 150,
    tooltip: 200,
    toast: 300,
};
/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};
/**
 * API error codes
 */
export const ERROR_CODES = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    RATE_LIMIT: 'RATE_LIMIT',
    AUTH_ERROR: 'AUTH_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};
/**
 * Message roles
 */
export const MESSAGE_ROLES = {
    user: 'user',
    assistant: 'assistant',
    system: 'system',
    tool: 'tool',
};
/**
 * Storage keys for persistence
 */
export const STORAGE_KEYS = {
    theme: 'clarity-chat-theme',
    preferences: 'clarity-chat-preferences',
    history: 'clarity-chat-history',
    cache: 'clarity-chat-cache',
};
//# sourceMappingURL=constants.js.map