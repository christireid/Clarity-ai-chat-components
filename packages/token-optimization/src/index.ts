/**
 * Token Optimization System
 * 
 * Advanced token counting, compression, and optimization for AI applications
 * with enterprise-grade security and 60-90% cost reduction
 */

// Core tokenizers
export { AccurateTokenCounter } from './tokenizers/accurate-counter'
export { AdvancedTokenCounter, countTokens, countTokensWithConfidence } from './tokenizers/advanced-counter'
export type { 
  ModelFamily, 
  ContentType, 
  TokenCountResult, 
  AdvancedTokenizerConfig,
  TokenCounterMetrics
} from './tokenizers/advanced-counter'

// Advanced compression
export { AdvancedCompressionEngine } from './compression/advanced-engine'
export { compressText, compressTextBatch } from './compression/advanced-engine'
export type { 
  CompressionStrategy, 
  CompressionResult, 
  CompressionEstimate,
  CompressionConfig 
} from './compression/advanced-engine'

// Advanced budget management
export { AdvancedTokenBudgetManager, optimizeTokenBudget, optimizeTokensWithCompression } from './budget/advanced-budget'
export type { 
  TokenBudgetConfig, 
  TokenAllocation, 
  AllocationStrategy,
  AllocationResult,
  ContextFactors
} from './budget/advanced-budget'

// Security and formats
export { TokenSecurityManager } from './security/token-security'
export { ToonOptimizer } from './formats/toon-optimizer'

// Main optimizer that combines all features
export { UnifiedTokenOptimizer } from './unified-optimizer'

// Legacy compatibility layer
export {
  TokenCounter,
  TokenBudgetManager,
  MemoryCompressor,
  SemanticChunker,
  ContextOptimizer
} from './legacy-compatibility'

// Types
export type {
  TokenizerConfig,
  SecurityConfig,
  ToonConfig,
  CompressionResult as LegacyCompressionResult,
  CacheStats,
  MLPrediction,
  AdvancedSecurityConfig
} from './types'

// Constants
export { 
  DEFAULT_TOKENIZER_CONFIG,
  DEFAULT_SECURITY_CONFIG,
  DEFAULT_CACHE_CONFIG,
  MAX_COMPRESSION_RATIO,
  SECURITY_LEVELS
} from './constants'