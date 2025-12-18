/**
 * Utilities Index
 *
 * This module provides organized access to all utility functions.
 * Utilities are grouped by domain for better discoverability:
 *
 * - streaming/      Streaming response utilities
 * - message/        Message conversion and helpers
 * - api/            API, rate limiting, and model utilities
 * - resilience/     Circuit breakers and retry logic
 * - optimization/   Token optimization and compression
 * - tools/          Tool result utilities
 * - config/         Configuration utilities
 * - security/       Security and sanitization
 * - search/         Search utilities
 * - tokenization/   Token counting and pricing
 * - prompt-caching/ Prompt cache management
 * - toon/           Token-Oriented Object Notation
 */

// Core Utilities (remain at root)
export { cn } from './cn'
export * from './mobile'
export * from './export-utils'

// Streaming Utilities
export * from './streaming'

// Message Utilities
export * from './message'

// API Utilities
export * from './api'

// Resilience Utilities
export * from './resilience'

// Optimization Utilities
export * from './optimization'

// Tool Utilities
export * from './tools'

// Configuration Utilities
export * from './config'

// Security Utilities
export * from './security'

// Search Utilities
export * from './search'

// Tokenization (existing subdirectory)
export * from './tokenization'

// Prompt Caching (existing subdirectory)
export {
  PromptCacheManager,
  createAnthropicCachedMessages,
  estimateCacheSavings,
  type CacheProvider,
  type CacheableContent,
  type CacheStats,
  type PromptCacheOptions,
} from './prompt-caching'

// TOON (existing subdirectory)
export {
  jsonToToon,
  toonToJson,
  autoOptimize,
  formatForLLM,
  parseFlexible,
  estimateToonSavings,
  isSuitableForToon,
  type ToonOptions,
  type ToonFormat,
  type ToonMetadata,
  type ToonStats,
  type ToonOptimizationResult,
  type AutoToonOptions,
} from './toon'
