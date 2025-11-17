/**
 * Clarity Memory - Constants
 * 
 * Shared constants used throughout the package.
 */

/**
 * Package version
 */
export const VERSION = '0.1.0'

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG = {
  CONTEXT: 'default',
  EMBEDDING: {
    PROVIDER: 'openai' as const,
    MODEL: 'text-embedding-3-small',
    CACHE: true,
    CACHE_TTL: 86400000, // 24 hours
  },
  STORE: {
    TYPE: 'in-memory' as const,
  },
  SHORT_TERM: {
    MAX_MESSAGES: 50,
    MAX_TOKENS: 32000,
    MAX_MESSAGE_LENGTH: 10000,
    AUTO_SUMMARIZE: true,
  },
  LONG_TERM: {
    ENABLED: true,
    MIN_IMPORTANCE: 0.5,
  },
  SCORING: {
    RECENCY_WEIGHT: 0.4,
    FREQUENCY_WEIGHT: 0.3,
    RELEVANCE_WEIGHT: 0.3,
    IMPORTANCE_WEIGHT: 0.0,
  },
  TOKEN_BUDGET: {
    MAX_TOKENS: 4000,
    RESERVE_TOKENS: 500,
    STRATEGY: 'priority' as const,
  },
  SUMMARIZATION: {
    PROVIDER: 'openai' as const,
    MODEL: 'gpt-4o-mini',
    AUTO: true,
  },
} as const

/**
 * Token estimation constants
 */
export const TOKEN_ESTIMATION = {
  CHARS_PER_TOKEN: 4,
  TOKENS_PER_CHAR: 0.25,
} as const

/**
 * Embedding dimensions by model
 */
export const EMBEDDING_DIMENSIONS = {
  'text-embedding-3-small': 1536,
  'text-embedding-3-large': 3072,
  'text-embedding-ada-002': 1536,
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  STORE_ERROR: 'Storage operation failed',
  EMBEDDING_ERROR: 'Embedding generation failed',
  TOKEN_BUDGET_EXCEEDED: 'Token budget exceeded',
  INVALID_CONFIG: 'Invalid configuration',
  MEMORY_NOT_FOUND: 'Memory not found',
  INVALID_CONTENT: 'Invalid memory content',
  INVALID_QUERY: 'Invalid query',
} as const

/**
 * Time constants (in milliseconds)
 */
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const

/**
 * Default timeouts (in milliseconds)
 */
export const TIMEOUTS = {
  API_CALL: 30000, // 30 seconds
  EMBEDDING: 60000, // 60 seconds
  STORE_OPERATION: 10000, // 10 seconds
  TEST: 10000, // 10 seconds
} as const
