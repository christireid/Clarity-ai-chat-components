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

/**
 * Default retention policies (TTL in seconds)
 *
 * GDPR-compliant defaults with bounded retention:
 * - Short-term/session: Cleared on session end
 * - Episodic: 30 days (typical conversation retention)
 * - Semantic: 90 days (learned facts and patterns)
 * - Procedural: 60 days (workflows and procedures)
 * - Profile: 1 year (user preferences and settings)
 */
export const DEFAULT_RETENTION_POLICY = {
  episodic: 30 * 24 * 60 * 60, // 30 days (2592000 seconds)
  semantic: 90 * 24 * 60 * 60, // 90 days (7776000 seconds)
  procedural: 60 * 24 * 60 * 60, // 60 days (5184000 seconds)
  shortTerm: 0, // Session only (deleted on session end)
  session: 24 * 60 * 60, // 1 day (86400 seconds)
  thread: 7 * 24 * 60 * 60, // 7 days (604800 seconds)
  global: 365 * 24 * 60 * 60, // 1 year (31536000 seconds)
  user: 365 * 24 * 60 * 60, // 1 year (31536000 seconds)
  profile: 365 * 24 * 60 * 60, // 1 year (31536000 seconds)
} as const

/**
 * Default memory limits to prevent unbounded growth
 *
 * These limits ensure:
 * - Predictable memory usage
 * - Reasonable API costs (embeddings)
 * - Acceptable performance
 * - GDPR data minimization compliance
 */
export const DEFAULT_MEMORY_LIMITS = {
  /** Maximum number of memories (LRU eviction when exceeded) */
  maxMemories: 1000,
  /** Maximum total tokens across all memories (~400KB text) */
  maxTotalTokens: 100_000,
  /** Maximum size of single memory in characters */
  maxMemorySize: 10_000,
  /** Warn when approaching limits (90% threshold) */
  warnThreshold: 0.9,
} as const

/**
 * Default cleanup intervals (in milliseconds)
 */
export const DEFAULT_CLEANUP_INTERVAL = 60 * 60 * 1000 // 1 hour (3600000 ms)
export const DEFAULT_SUMMARIZATION_INTERVAL = 30 * 60 * 1000 // 30 minutes (1800000 ms)
export const DEFAULT_DECAY_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours (86400000 ms)
