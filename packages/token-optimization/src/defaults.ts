/**
 * Sensible Defaults for Token Optimization
 *
 * This file contains all default values in one place, making it easy to:
 * - See what configuration options are available
 * - Understand the recommended settings
 * - Override specific values while keeping sensible defaults
 *
 * Philosophy: Zero-configuration should work for 90% of use cases.
 *
 * @module defaults
 */

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT MODEL CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default model for token counting and optimization.
 * GPT-4o is chosen as the default because:
 * - It's the most commonly used model in production
 * - It has excellent balance of capability and cost
 * - It has a 128K context window
 */
export const DEFAULT_MODEL = 'gpt-4o' as const

/**
 * Default debounce delay for React hooks (milliseconds).
 * 150ms provides a good balance between responsiveness and performance.
 */
export const DEFAULT_DEBOUNCE_MS = 150

/**
 * Default maximum cache size (number of entries).
 * 1000 entries balances memory usage with cache hit rates.
 */
export const DEFAULT_MAX_CACHE_SIZE = 1000

/**
 * Default cache TTL (milliseconds).
 * 1 hour is a good default for most applications.
 */
export const DEFAULT_CACHE_TTL_MS = 3600000 // 1 hour

/**
 * Default similarity threshold for semantic caching.
 * 0.92 provides high confidence that responses are semantically equivalent.
 */
export const DEFAULT_SIMILARITY_THRESHOLD = 0.92

// ═══════════════════════════════════════════════════════════════════════════
// TOKEN COUNTER DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default options for TokenCounter.
 *
 * @example
 * ```typescript
 * const counter = new TokenCounter()
 * // Uses these defaults automatically
 * ```
 */
export const DEFAULT_TOKEN_COUNTER_OPTIONS = {
  /** Model to use for tokenization */
  model: DEFAULT_MODEL,
  /** Size of the internal token cache */
  cacheSize: 10000,
  /** Enable caching for repeated strings */
  enableCaching: true,
  /** Enable performance monitoring */
  enableMonitoring: false,
} as const

/**
 * Default options for countTokens function.
 */
export const DEFAULT_COUNT_OPTIONS = {
  model: DEFAULT_MODEL,
  includeSpecialTokens: false,
} as const

// ═══════════════════════════════════════════════════════════════════════════
// COMPRESSION DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default compression options.
 *
 * @example
 * ```typescript
 * const result = await compressor.compress(text)
 * // Uses these defaults automatically
 * ```
 */
export const DEFAULT_COMPRESSION_OPTIONS = {
  /** Compression strategy: 'auto' selects based on content */
  strategy: 'auto' as const,
  /** Number of tokens to preserve at start */
  preserveStart: 0,
  /** Number of tokens to preserve at end */
  preserveEnd: 0,
  /** Minimum quality threshold (0-1) */
  minQuality: 0.85,
  /** Target compression ratio (0-1, where 0.5 = 50% of original) */
  targetRatio: 0.5,
} as const

/**
 * Default LLMLingua compression options.
 */
export const DEFAULT_LLMLINGUA_OPTIONS = {
  preserveCode: true,
  preserveInstructions: true,
  minQuality: 0.8,
} as const

// ═══════════════════════════════════════════════════════════════════════════
// CACHE DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default cache options.
 *
 * @example
 * ```typescript
 * const cache = new SemanticCache()
 * // Uses these defaults automatically
 * ```
 */
export const DEFAULT_CACHE_OPTIONS = {
  /** Maximum number of cached entries */
  maxSize: DEFAULT_MAX_CACHE_SIZE,
  /** Time-to-live in milliseconds */
  ttl: DEFAULT_CACHE_TTL_MS,
  /** Similarity threshold for semantic matching */
  similarityThreshold: DEFAULT_SIMILARITY_THRESHOLD,
  /** Enable exact string matching (fastest) */
  enableExactMatch: true,
  /** Enable semantic similarity matching */
  enableSemanticMatch: true,
} as const

/**
 * Default tiered cache configuration by preset level.
 */
export const DEFAULT_TIERED_CACHE_BY_PRESET = {
  minimal: {
    exact: { maxSize: 100, ttl: 300000 }, // 5 min
    smart: { maxSize: 50, ttl: 300000 },
  },
  standard: {
    exact: { maxSize: 500, ttl: 1800000 }, // 30 min
    smart: { maxSize: 200, ttl: 1800000 },
  },
  production: {
    exact: { maxSize: 1000, ttl: 3600000 }, // 1 hour
    smart: { maxSize: 500, ttl: 3600000 },
  },
  enterprise: {
    exact: { maxSize: 5000, ttl: 7200000 }, // 2 hours
    smart: { maxSize: 2000, ttl: 7200000 },
  },
} as const

// ═══════════════════════════════════════════════════════════════════════════
// MODEL ROUTING DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default model tier configuration for intelligent routing.
 *
 * @example
 * ```typescript
 * const router = new ModelRouter()
 * // Routes to cheapest capable model by default
 * ```
 */
export const DEFAULT_ROUTING_CONFIG = {
  /** Model tiers from cheapest to most capable */
  models: {
    economy: ['gpt-3.5-turbo', 'claude-3-haiku'],
    standard: ['gpt-4o-mini', 'claude-3-sonnet'],
    premium: ['gpt-4o', 'claude-3-5-sonnet'],
    elite: ['gpt-4', 'claude-3-opus', 'o1'],
  },
  /** Default tier for unknown complexity */
  defaultTier: 'standard' as const,
  /** Strategy for model selection */
  strategy: 'balanced' as const,
} as const

/**
 * Default fallback model when routing fails.
 */
export const DEFAULT_FALLBACK_MODEL = 'gpt-4o-mini'

// ═══════════════════════════════════════════════════════════════════════════
// SECURITY DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default security configuration.
 *
 * ⚠️ SECURITY CONFIGURATION:
 * - PII Redaction: DISABLED by default (opt-in for compliance needs)
 * - Audit Logging: ENABLED by default (required for security monitoring)
 * - Sanitization: ENABLED by default (required for injection protection)
 *
 * Use presets for different security levels:
 * - `minimal`: Development - no PII redaction, no audit logging
 * - `standard`: Default - no PII redaction, audit logging enabled (THIS DEFAULT)
 * - `production`: Production - PII redaction enabled, audit logging enabled
 * - `enterprise`: Compliance - PII redaction enabled, strict compliance, 90-day retention
 *
 * @example
 * ```typescript
 * // Use standard preset (default - inherits this config)
 * const optimizer = createOptimizer({ preset: 'standard' })
 *
 * // Use enterprise preset for compliance
 * const secureOptimizer = createOptimizer({ preset: 'enterprise' })
 *
 * // Custom override
 * const customOptimizer = createOptimizer({
 *   preset: 'standard',
 *   security: {
 *     enablePIIRedaction: true, // Override to enable
 *   },
 * })
 * ```
 */
export const DEFAULT_SECURITY_CONFIG = {
  /** Enable input sanitization */
  enableSanitization: true,
  /** Enable PII detection and redaction (DISABLED - opt-in for compliance) */
  enablePIIRedaction: false,
  /** Enable audit logging (ENABLED for accountability) */
  enableAuditLogging: true,
  /** Compliance level ('standard' balances security and performance) */
  complianceLevel: 'standard' as const,
  /** Audit log retention in days */
  auditRetention: 30,
} as const

// ═══════════════════════════════════════════════════════════════════════════
// BUDGET DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default token budget configuration.
 *
 * @example
 * ```typescript
 * const budget = useTokenBudget(text)
 * // Uses 4096 max tokens with 1000 reserved for output
 * ```
 */
export const DEFAULT_BUDGET_OPTIONS = {
  /** Maximum tokens for the request */
  maxTokens: 4096,
  /** Tokens reserved for the response */
  reserveForOutput: 1000,
  /** Warning threshold (percentage of max) */
  warningThreshold: 0.8,
  /** Critical threshold (percentage of max) */
  criticalThreshold: 0.95,
} as const

// ═══════════════════════════════════════════════════════════════════════════
// REACT HOOK DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default options for useTokenCount hook.
 *
 * @example
 * ```typescript
 * const { count } = useTokenCount(text)
 * // Debounces at 150ms by default
 * ```
 */
export const DEFAULT_USE_TOKEN_COUNT_OPTIONS = {
  model: DEFAULT_MODEL,
  debounceMs: DEFAULT_DEBOUNCE_MS,
  enabled: true,
} as const

/**
 * Default options for useTokenBudget hook.
 */
export const DEFAULT_USE_TOKEN_BUDGET_OPTIONS = {
  model: DEFAULT_MODEL,
  debounceMs: DEFAULT_DEBOUNCE_MS,
  ...DEFAULT_BUDGET_OPTIONS,
} as const

/**
 * Default options for useTokenOptimization hook.
 */
export const DEFAULT_USE_TOKEN_OPTIMIZATION_OPTIONS = {
  preset: 'standard' as const,
  model: DEFAULT_MODEL,
  enableCache: true,
  enableCompression: true,
  enableRouting: true,
} as const

// ═══════════════════════════════════════════════════════════════════════════
// PRESET CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Preset configurations for different use cases.
 *
 * - `minimal`: Lowest resource usage, fastest (development)
 * - `standard`: Good balance for most applications (recommended, DEFAULT)
 * - `production`: Higher limits and security for production
 * - `enterprise`: Maximum performance and compliance
 *
 * @example
 * ```typescript
 * // Use standard preset (default)
 * const optimizer = createOptimizer({ preset: 'standard' })
 *
 * // Use enterprise preset for compliance
 * const secureOptimizer = createOptimizer({ preset: 'enterprise' })
 *
 * // Custom configuration overrides preset
 * const customOptimizer = createOptimizer({
 *   preset: 'standard',
 *   security: {
 *     enablePIIRedaction: true, // Override preset
 *   },
 * })
 * ```
 */
export const PRESETS = {
  minimal: {
    description:
      'Development - lowest security overhead, suitable for local development',
    cache: DEFAULT_TIERED_CACHE_BY_PRESET.minimal,
    compressionLevel: 'light',
    routingStrategy: 'cost-optimized',
    security: {
      enableSanitization: true,
      enablePIIRedaction: false, // Disabled for dev
      enableAuditLogging: false,
      complianceLevel: 'minimal' as const,
      auditRetention: 7,
    },
  },
  standard: {
    description:
      'Balanced defaults for most applications (recommended, DEFAULT)',
    cache: DEFAULT_TIERED_CACHE_BY_PRESET.standard,
    compressionLevel: 'moderate',
    routingStrategy: 'balanced',
    security: {
      enableSanitization: true,
      enablePIIRedaction: false, // Disabled - opt-in
      enableAuditLogging: true,
      complianceLevel: 'standard' as const,
      auditRetention: 30,
    },
  },
  production: {
    description: 'Production workloads with enhanced security',
    cache: DEFAULT_TIERED_CACHE_BY_PRESET.production,
    compressionLevel: 'moderate',
    routingStrategy: 'balanced',
    security: {
      enableSanitization: true,
      enablePIIRedaction: true, // Enabled for production
      enableAuditLogging: true,
      complianceLevel: 'standard' as const,
      auditRetention: 30,
    },
  },
  enterprise: {
    description:
      'Maximum performance and compliance for high-volume applications',
    cache: DEFAULT_TIERED_CACHE_BY_PRESET.enterprise,
    compressionLevel: 'aggressive',
    routingStrategy: 'quality-first',
    security: {
      enableSanitization: true,
      enablePIIRedaction: true, // Enabled for compliance
      enableAuditLogging: true,
      complianceLevel: 'strict' as const,
      auditRetention: 90,
    },
  },
} as const

export type PresetName = keyof typeof PRESETS

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ALL DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All default values in one convenient object.
 *
 * @example
 * ```typescript
 * import { DEFAULTS } from '@clarity-chat/token-optimization'
 *
 * console.log(DEFAULTS.model) // 'gpt-4o'
 * console.log(DEFAULTS.tokenCounter.cacheSize) // 10000
 * ```
 */
export const DEFAULTS = {
  model: DEFAULT_MODEL,
  debounceMs: DEFAULT_DEBOUNCE_MS,
  maxCacheSize: DEFAULT_MAX_CACHE_SIZE,
  cacheTtlMs: DEFAULT_CACHE_TTL_MS,
  similarityThreshold: DEFAULT_SIMILARITY_THRESHOLD,

  tokenCounter: DEFAULT_TOKEN_COUNTER_OPTIONS,
  count: DEFAULT_COUNT_OPTIONS,
  compression: DEFAULT_COMPRESSION_OPTIONS,
  llmlingua: DEFAULT_LLMLINGUA_OPTIONS,
  cache: DEFAULT_CACHE_OPTIONS,
  routing: DEFAULT_ROUTING_CONFIG,
  security: DEFAULT_SECURITY_CONFIG,
  budget: DEFAULT_BUDGET_OPTIONS,

  hooks: {
    tokenCount: DEFAULT_USE_TOKEN_COUNT_OPTIONS,
    tokenBudget: DEFAULT_USE_TOKEN_BUDGET_OPTIONS,
    tokenOptimization: DEFAULT_USE_TOKEN_OPTIMIZATION_OPTIONS,
  },

  presets: PRESETS,
} as const
