/**
 * Token Optimization Constants
 *
 * Default configurations and constants for the token optimization system
 */

// Default configurations
export const DEFAULT_TOKENIZER_CONFIG = {
  model: 'gpt-4',
  cacheSize: 10000,
  enableCaching: true,
  enableMonitoring: true,
}

export const DEFAULT_SECURITY_CONFIG = {
  enableSanitization: true,
  enableCompressionObfuscation: true,
  enableAuditLogging: true,
  enablePIIRedaction: true,
  noiseLevel: 0.1,
  complianceLevel: 'enterprise' as const,
  auditRetention: 30, // days
}

export const DEFAULT_TOON_CONFIG = {
  enableArrayTables: true,
  maxArraySizeForTable: 1000,
  preserveKeys: false,
  compactNumbers: true,
  quoteStrings: false,
}

export const DEFAULT_LLM_LINGUA_CONFIG = {
  modelName: 'microsoft/llmlingua-2-xlm-roberta-large-meetingbank',
  compressionRate: 0.5,
  useLLMLingua2: true,
  enableStructureAware: true,
  enableFallback: true,
}

export const DEFAULT_CACHE_CONFIG = {
  maxSize: 100000,
  similarityThreshold: 0.85,
  embeddingModel: 'text-embedding-ada-002',
  cleanupInterval: 300000, // 5 minutes
  enablePersistence: true,
}

export const DEFAULT_ADVANCED_SECURITY_CONFIG = {
  enableThreatDetection: true,
  enableBehaviorAnalysis: true,
  enableZeroTrust: true,
  complianceLevel: 'enterprise' as const,
  auditRetention: 90, // days
}

// Performance constants
export const MAX_COMPRESSION_RATIO = 0.95 // Maximum 95% compression
export const MIN_COMPRESSION_RATIO = 0.1 // Minimum 10% compression
export const OPTIMAL_COMPRESSION_RATIO = 0.6 // Target 60% compression

export const CACHE_HIT_RATE_TARGET = 0.8 // Target 80% cache hit rate
export const SIMILARITY_THRESHOLD_DEFAULT = 0.85 // Default similarity for semantic search

// Security constants
export const SECURITY_LEVELS = {
  BASIC: 'basic',
  ENTERPRISE: 'enterprise',
  GOVERNMENT: 'government',
} as const

export const THREAT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const

// Token counting constants
export const CHARS_PER_TOKEN_APPROX = 4 // Approximate characters per token
export const TOKENS_PER_WORD_APPROX = 0.75 // Approximate tokens per word

/**
 * Model-specific context window limits (max input tokens)
 *
 * These represent the maximum number of tokens each model can process
 * in a single request, including both input and reserved output space.
 *
 * @remarks
 * - OpenAI GPT-4o series: 128K context window
 * - OpenAI o-series (reasoning): 128K-200K depending on model
 * - Anthropic Claude: 200K context window across all variants
 * - Google Gemini: 200K-2M context window (industry-leading)
 */
export const MODEL_TOKEN_LIMITS = {
  // OpenAI GPT-4o Series (o200k_base encoding)
  'gpt-4o': 128000,
  'gpt-4o-mini': 128000,
  'gpt-4o-2024-11-20': 128000,

  // OpenAI o-Series Reasoning Models (o200k_base encoding)
  o1: 200000,
  'o1-mini': 128000,
  'o1-preview': 128000,
  o3: 200000,
  'o3-mini': 128000,
  'o4-mini': 200000,

  // Anthropic Claude 3.5/4.5 Models
  'claude-3-5-sonnet-20241022': 200000,
  'claude-3-5-haiku-20241022': 200000,
  'claude-opus-4-5': 200000,
  'claude-sonnet-4-5': 200000,
  'claude-haiku-4-5': 200000,
  'claude-3-opus': 200000,
  'claude-3-sonnet': 200000,
  'claude-3-haiku': 200000,

  // Google Gemini Models
  'gemini-2.0-pro': 1000000,
  'gemini-2.0-flash': 200000,
  'gemini-2.0-flash-lite': 200000,
  'gemini-1.5-pro': 2000000,
  'gemini-1.5-flash': 1000000,

  // Legacy OpenAI Models (cl100k_base encoding)
  'gpt-4': 8192,
  'gpt-4-turbo': 128000,
  'gpt-3.5-turbo': 4096,
} as const

/**
 * Model pricing per 1 million tokens (USD)
 *
 * Pricing structure for cost estimation and optimization decisions.
 * All prices are in USD per 1M tokens.
 *
 * @property input - Cost per 1M input tokens
 * @property output - Cost per 1M output tokens
 * @property cached - Cost per 1M cached input tokens (when available)
 */
export const MODEL_PRICING = {
  // OpenAI GPT-4o Series
  'gpt-4o': { input: 2.5, output: 10.0, cached: 1.25 },
  'gpt-4o-mini': { input: 0.15, output: 0.6, cached: 0.075 },

  // OpenAI o-Series Reasoning Models
  o1: { input: 15.0, output: 60.0 },
  'o1-mini': { input: 3.0, output: 12.0 },
  'o3-mini': { input: 1.1, output: 4.4 },

  // Anthropic Claude 4.5 Models
  'claude-opus-4-5': { input: 5.0, output: 25.0 },
  'claude-sonnet-4-5': { input: 3.0, output: 15.0, cached: 0.3 },
  'claude-haiku-4-5': { input: 1.0, output: 5.0, cached: 0.1 },

  // Google Gemini Models
  'gemini-2.0-pro': { input: 2.5, output: 15.0 },
  'gemini-2.0-flash': { input: 0.5, output: 3.0 },
  'gemini-2.0-flash-lite': { input: 0.075, output: 0.3 },
} as const

/**
 * Maximum output token limits per model
 *
 * These represent the maximum number of tokens each model can generate
 * in a single response. Important for response planning and budgeting.
 */
export const MODEL_OUTPUT_LIMITS = {
  // OpenAI Models
  'gpt-4o': 16384,
  'gpt-4o-mini': 16384,
  'gpt-4o-2024-11-20': 16384,
  o1: 100000,
  'o1-mini': 65536,
  'o1-preview': 32768,
  o3: 100000,
  'o3-mini': 65536,
  'o4-mini': 100000,

  // Anthropic Claude Models (all support 64K output)
  'claude-3-5-sonnet-20241022': 64000,
  'claude-3-5-haiku-20241022': 64000,
  'claude-opus-4-5': 64000,
  'claude-sonnet-4-5': 64000,
  'claude-haiku-4-5': 64000,
  'claude-3-opus': 64000,
  'claude-3-sonnet': 64000,
  'claude-3-haiku': 64000,

  // Google Gemini Models
  'gemini-2.0-pro': 65536,
  'gemini-2.0-flash': 65536,
  'gemini-2.0-flash-lite': 65536,
  'gemini-1.5-pro': 65536,
  'gemini-1.5-flash': 65536,
} as const

/**
 * Tokenizer encoding mappings by model family
 *
 * Maps model families to their tokenizer encodings for accurate token counting.
 *
 * @remarks
 * - o200k_base: Used by GPT-4o, o-series (200K vocabulary)
 * - cl100k_base: Used by GPT-4, GPT-3.5 (100K vocabulary)
 * - claude: Anthropic's proprietary tokenizer
 * - gemini: Google's SentencePiece-based tokenizer
 */
export const MODEL_ENCODINGS = {
  /** GPT-4o and o-series models use o200k_base encoding */
  o200k_base: [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4o-2024-11-20',
    'o1',
    'o1-mini',
    'o1-preview',
    'o3',
    'o3-mini',
    'o4-mini',
  ],
  /** GPT-4 and GPT-3.5 models use cl100k_base encoding */
  cl100k_base: [
    'gpt-4',
    'gpt-4-turbo',
    'gpt-4-32k',
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-16k',
  ],
  /** Anthropic Claude models use proprietary tokenizer */
  claude: [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    'claude-opus-4-5',
    'claude-sonnet-4-5',
    'claude-haiku-4-5',
    'claude-3-opus',
    'claude-3-sonnet',
    'claude-3-haiku',
  ],
  /** Google Gemini models use SentencePiece tokenizer */
  gemini: [
    'gemini-2.0-pro',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
  ],
} as const

/**
 * Type for model token limit keys
 */
export type ModelTokenLimitKey = keyof typeof MODEL_TOKEN_LIMITS

/**
 * Type for model pricing keys
 */
export type ModelPricingKey = keyof typeof MODEL_PRICING

/**
 * Type for model output limit keys
 */
export type ModelOutputLimitKey = keyof typeof MODEL_OUTPUT_LIMITS

/**
 * Type for encoding names
 */
export type EncodingName = keyof typeof MODEL_ENCODINGS

// Compression method priorities
export const COMPRESSION_PRIORITIES = {
  TOON: 1,
  LLMLINGUA: 2,
  CONTEXT_AWARE: 3,
  SEMANTIC: 4,
  TRUNCATION: 5,
} as const

// Security pattern constants
export const INJECTION_PATTERNS = [
  /ignore.*previous.*instructions/gi,
  /system:\s*.*/gi,
  /you\s+are\s+now/gi,
  /disregard.*above/gi,
  /bypass.*security/gi,
  /unicode.*bypass/gi,
  /base64.*instruction/gi,
  /prompt.*injection/gi,
  /jailbreak.*attempt/gi,
  /data.*exfiltration/gi,
] as const

// PII pattern constants
export const PII_PATTERNS = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone
  /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Credit card
  /\b[a-zA-Z0-9]{32,}\b/g, // API key
  /\b[A-Z]{1,2}\d{6,8}\b/g, // Passport
  /\b[A-Z]{2}\d{6,8}\b/g, // License plate
] as const

// Performance targets
export const PERFORMANCE_TARGETS = {
  TOKEN_COUNT_SPEED: 10000, // tokens per second
  COMPRESSION_SPEED: 1000, // operations per second
  CACHE_HIT_RATE: 0.8, // 80%
  MEMORY_USAGE: 100 * 1024 * 1024, // 100MB max
  LATENCY_P95: 100, // 95th percentile latency in ms
} as const

// Error codes
export const ERROR_CODES = {
  TOKEN_ENCODING_FAILED: 'TOKEN_ENCODING_FAILED',
  COMPRESSION_FAILED: 'COMPRESSION_FAILED',
  SECURITY_VIOLATION: 'SECURITY_VIOLATION',
  CACHE_OVERFLOW: 'CACHE_OVERFLOW',
  MODEL_NOT_SUPPORTED: 'MODEL_NOT_SUPPORTED',
  INVALID_INPUT: 'INVALID_INPUT',
} as const

// Success codes
export const SUCCESS_CODES = {
  OPTIMIZATION_COMPLETE: 'OPTIMIZATION_COMPLETE',
  CACHE_HIT: 'CACHE_HIT',
  SECURITY_VALIDATED: 'SECURITY_VALIDATED',
  COMPRESSION_SUCCESSFUL: 'COMPRESSION_SUCCESSFUL',
} as const

// Default unified optimizer config
export const DEFAULT_UNIFIED_OPTIMIZER_CONFIG = {
  tokenizer: DEFAULT_TOKENIZER_CONFIG,
  security: DEFAULT_SECURITY_CONFIG,
  toon: DEFAULT_TOON_CONFIG,
  llmlingua: DEFAULT_LLM_LINGUA_CONFIG,
  cache: DEFAULT_CACHE_CONFIG,
  advanced: DEFAULT_ADVANCED_SECURITY_CONFIG,
}

// Export all constants as a single object for convenience
export const OPTIMIZATION_CONSTANTS = {
  DEFAULT_TOKENIZER_CONFIG,
  DEFAULT_SECURITY_CONFIG,
  DEFAULT_TOON_CONFIG,
  DEFAULT_LLM_LINGUA_CONFIG,
  DEFAULT_CACHE_CONFIG,
  DEFAULT_ADVANCED_SECURITY_CONFIG,
  SECURITY_LEVELS,
  CHARS_PER_TOKEN_APPROX,
  TOKENS_PER_WORD_APPROX,
  MODEL_TOKEN_LIMITS,
  MODEL_PRICING,
  MODEL_OUTPUT_LIMITS,
  MODEL_ENCODINGS,
  COMPRESSION_PRIORITIES,
  INJECTION_PATTERNS,
  PII_PATTERNS,
  PERFORMANCE_TARGETS,
  ERROR_CODES,
  SUCCESS_CODES,
  DEFAULT_UNIFIED_OPTIMIZER_CONFIG,
}
