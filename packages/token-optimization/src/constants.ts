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
  enableMonitoring: true
}

export const DEFAULT_SECURITY_CONFIG = {
  enableSanitization: true,
  enableCompressionObfuscation: true,
  enableAuditLogging: true,
  enablePIIRedaction: true,
  noiseLevel: 0.1,
  complianceLevel: 'enterprise' as const,
  auditRetention: 30 // days
}

export const DEFAULT_TOON_CONFIG = {
  enableArrayTables: true,
  maxArraySizeForTable: 1000,
  preserveKeys: false,
  compactNumbers: true,
  quoteStrings: false
}

export const DEFAULT_LLM_LINGUA_CONFIG = {
  modelName: 'microsoft/llmlingua-2-xlm-roberta-large-meetingbank',
  compressionRate: 0.5,
  useLLMLingua2: true,
  enableStructureAware: true,
  enableFallback: true
}

export const DEFAULT_CACHE_CONFIG = {
  maxSize: 100000,
  similarityThreshold: 0.85,
  embeddingModel: 'text-embedding-ada-002',
  cleanupInterval: 300000, // 5 minutes
  enablePersistence: true
}

export const DEFAULT_ADVANCED_SECURITY_CONFIG = {
  enableThreatDetection: true,
  enableBehaviorAnalysis: true,
  enableZeroTrust: true,
  complianceLevel: 'enterprise' as const,
  auditRetention: 90 // days
}

// Performance constants
export const MAX_COMPRESSION_RATIO = 0.95 // Maximum 95% compression
export const MIN_COMPRESSION_RATIO = 0.1  // Minimum 10% compression
export const OPTIMAL_COMPRESSION_RATIO = 0.6 // Target 60% compression

export const CACHE_HIT_RATE_TARGET = 0.8 // Target 80% cache hit rate
export const SIMILARITY_THRESHOLD_DEFAULT = 0.85 // Default similarity for semantic search

// Security constants
export const SECURITY_LEVELS = {
  BASIC: 'basic',
  ENTERPRISE: 'enterprise',
  GOVERNMENT: 'government'
} as const

export const THREAT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const

// Token counting constants
export const CHARS_PER_TOKEN_APPROX = 4 // Approximate characters per token
export const TOKENS_PER_WORD_APPROX = 0.75 // Approximate tokens per word

// Model-specific token limits
export const MODEL_TOKEN_LIMITS = {
  'gpt-4': 8192,
  'gpt-4-turbo': 128000,
  'gpt-3.5-turbo': 4096,
  'claude-3-sonnet': 200000,
  'claude-3-opus': 200000,
  'claude-3-haiku': 200000
} as const

// Compression method priorities
export const COMPRESSION_PRIORITIES = {
  TOON: 1,
  LLMLINGUA: 2,
  CONTEXT_AWARE: 3,
  SEMANTIC: 4,
  TRUNCATION: 5
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
  /data.*exfiltration/gi
] as const

// PII pattern constants
export const PII_PATTERNS = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone
  /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Credit card
  /\b[a-zA-Z0-9]{32,}\b/g, // API key
  /\b[A-Z]{1,2}\d{6,8}\b/g, // Passport
  /\b[A-Z]{2}\d{6,8}\b/g // License plate
] as const

// Performance targets
export const PERFORMANCE_TARGETS = {
  TOKEN_COUNT_SPEED: 10000, // tokens per second
  COMPRESSION_SPEED: 1000, // operations per second
  CACHE_HIT_RATE: 0.8, // 80%
  MEMORY_USAGE: 100 * 1024 * 1024, // 100MB max
  LATENCY_P95: 100 // 95th percentile latency in ms
} as const

// Error codes
export const ERROR_CODES = {
  TOKEN_ENCODING_FAILED: 'TOKEN_ENCODING_FAILED',
  COMPRESSION_FAILED: 'COMPRESSION_FAILED',
  SECURITY_VIOLATION: 'SECURITY_VIOLATION',
  CACHE_OVERFLOW: 'CACHE_OVERFLOW',
  MODEL_NOT_SUPPORTED: 'MODEL_NOT_SUPPORTED',
  INVALID_INPUT: 'INVALID_INPUT'
} as const

// Success codes
export const SUCCESS_CODES = {
  OPTIMIZATION_COMPLETE: 'OPTIMIZATION_COMPLETE',
  CACHE_HIT: 'CACHE_HIT',
  SECURITY_VALIDATED: 'SECURITY_VALIDATED',
  COMPRESSION_SUCCESSFUL: 'COMPRESSION_SUCCESSFUL'
} as const

// Default unified optimizer config
export const DEFAULT_UNIFIED_OPTIMIZER_CONFIG = {
  tokenizer: DEFAULT_TOKENIZER_CONFIG,
  security: DEFAULT_SECURITY_CONFIG,
  toon: DEFAULT_TOON_CONFIG,
  llmlingua: DEFAULT_LLM_LINGUA_CONFIG,
  cache: DEFAULT_CACHE_CONFIG,
  advanced: DEFAULT_ADVANCED_SECURITY_CONFIG
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
  COMPRESSION_PRIORITIES,
  INJECTION_PATTERNS,
  PII_PATTERNS,
  PERFORMANCE_TARGETS,
  ERROR_CODES,
  SUCCESS_CODES,
  DEFAULT_UNIFIED_OPTIMIZER_CONFIG
}