/**
 * Token Optimization Package - Enhanced Implementation
 *
 * This package provides advanced token optimization capabilities including:
 * - Enhanced security with comprehensive threat protection
 * - Quality gates with 85% minimum quality preservation
 * - Cost-aware optimization with budget management
 * - Advanced semantic caching with 90%+ cost reduction
 * - Dynamic compression with quality preservation
 */

// Security exports (Node.js only - uses events module via security-dashboard)
// export { EnhancedSecurityManager } from './security/enhanced-security'
// export type {
//   EnhancedSecurityConfig,
//   SecurityContext,
//   ThreatIntelligence,
//   EnhancedValidationResult,
// } from './security/enhanced-security'

export { TokenSecurityManager } from './security/token-security'
export type {
  SecurityConfig as TokenSecurityConfig,
  SecurityEvent,
  SanitizationResult,
  ProtectionResult,
  ComplianceReport,
} from './security/token-security'

// Security configuration builder (depends on enhanced-security)
// export {
//   createSecurityConfig,
//   SecurityProfiles,
// } from './security/security-config-builder'
// export type { SecurityConfigBuilder } from './security/security-config-builder'

// Security testing playground (depends on enhanced-security)
// export {
//   createSecurityTestingPlayground,
//   runSecurityTests,
// } from './security/security-testing-playground'
// export type {
//   SecurityTestCase,
//   SecurityTestResult,
// } from './security/security-testing-playground'

// Security event streaming (Node.js only - uses events module)
// export { createSecurityEventStreamer, SecurityStreamSubscribers } from './security/security-event-streaming'
// export type { SecurityStreamEvent, StreamSubscriber, StreamMetrics } from './security/security-event-streaming'

// Redis security store (Node.js only - uses events module)
// export { createSecurityStore } from './security/redis-security-store'
// export type { RedisSecurityStore } from './security/redis-security-store'

// Security dashboard (Node.js only - uses events module)
// export { createSecurityDashboard } from './security/security-dashboard'
// export type { SecurityDashboard } from './security/security-dashboard'

// Quality exports
export { QualityGate } from './quality/quality-gate'
export type {
  QualityGateConfig,
  QualityMetrics as QualityGateMetrics,
  QualityCheckResult,
  QualityContext,
} from './quality/quality-gate'

// Cost exports
export { CostAwareOptimizer } from './cost/cost-aware-optimizer'
export type {
  CostAwareConfig,
  CostEstimate,
  OptimizationStrategy as CostOptimizationStrategy,
  BudgetStatus,
  ResourceRequirements,
} from './cost/cost-aware-optimizer'

// Caching exports
export { AdvancedSemanticCache } from './caching/advanced-semantic-cache'
export type {
  SemanticCacheConfig,
  CachedEntry,
  CacheMetadata,
  SemanticCacheResult,
  CacheContext,
  CacheStats,
} from './caching/advanced-semantic-cache'

// Compression exports - New real compression strategies (recommended)
export {
  LLMLinguaCompressor,
  createLLMLinguaCompressor,
  compressWithLLMLingua,
  ExtractiveCompressor,
  createExtractiveCompressor,
  compressExtractively,
  AdaptiveCompressor,
  createAdaptiveCompressor,
  compressAdaptively,
  recommendStrategy,
  normalizeWhitespace,
  normalizeWhitespaceBatch,
} from './compression'

export type {
  // LLMLingua types
  LLMLinguaOptions,
  LLMLinguaResult,
  LLMLinguaQualityMetrics,
  LLMLinguaDebugInfo,
  // Extractive types
  ExtractiveOptions,
  ExtractiveResult,
  ExtractiveQualityMetrics,
  ExtractiveDebugInfo,
  ScoredSentence,
  // Adaptive types
  AdaptiveOptions,
  AdaptiveResult,
  AdaptiveQualityMetrics,
  AdaptiveDebugInfo,
  ContentAnalysis,
  ContentType,
  LanguageFeatures,
  CompressionStrategyType,
  // Common types
  CommonQualityMetrics,
  CommonCompressionResult,
  StrategyRecommendation,
  // Normalization types
  NormalizationConfig,
  NormalizationResult,
} from './compression'

// Legacy compression exports (deprecated - use new strategies above)
export { DynamicCompressionEngine } from './compression/dynamic-compression'
export type {
  DynamicCompressionConfig,
  CompressionStrategy,
  CompressionResult,
  CompressionContext,
  QualityMetrics as CompressionQualityMetrics,
} from './compression/dynamic-compression'

// Token counting exports (legacy compatibility)
export { TokenCounter } from './legacy-compatibility'

// Tokenizers - using gpt-tokenizer (20x smaller than tiktoken WASM)
export { AccurateTokenCounter } from './tokenizers/accurate-counter'
export type {
  TokenizerConfig,
  TokenInfo,
  CacheStats as TokenCacheStats,
  MonitoringStats,
  ChatMessage,
} from './tokenizers/accurate-counter'

export { SimpleTokenCounter } from './tokenizers/simple-counter'

// Text chunking - using llm-splitter (100x smaller than LangChain)
export { TextChunker, ChunkingStrategy } from './chunking/text-chunker'
export type {
  ChunkingConfig,
  TextChunk,
  ChunkingResult,
} from './chunking/text-chunker'

// TOON (Token-Oriented Object Notation) format
export {
  ToonOptimizer,
  TOONParseError,
  encodeToon,
  decodeToon,
  validateToon,
} from './formats/toon-optimizer'
export type {
  ToonConfig,
  TOONSchema,
  TOONSchemaField,
  ValidationResult as TOONValidationResult,
  ValidationError as TOONValidationError,
  SavingsEstimate,
  SavingsInfo,
} from './formats/toon-optimizer'

// Tiered Cache System
export { ExactCache } from './cache/exact-cache'
export type {
  ExactCacheConfig,
  ExactCacheResult,
  ExactCacheStats,
} from './cache/exact-cache'

export { SmartCache } from './cache/smart-cache'
export type {
  SmartCacheConfig,
  SmartCacheResult,
  SmartCacheStats,
} from './cache/smart-cache'

export { TieredCache } from './cache/tiered-cache'
export type {
  TieredCacheConfig,
  TieredCacheResult,
  CacheStats as TieredCacheStats,
  TierStats,
  PrefetchItem,
} from './cache/tiered-cache'

// Markdown Compression
export {
  MarkdownCompressor,
  CompressionLevel,
} from './compression/markdown-compressor'
export type {
  MarkdownCompressorConfig,
  CompressionResult as MarkdownCompressionResult,
} from './compression/markdown-compressor'

// Routing - Complexity Analysis & Model Selection
export {
  ComplexityAnalyzer,
  ComplexityLevel,
} from './routing/complexity-analyzer'
export type {
  ComplexityAnalyzerConfig,
  ComplexityResult,
  ComplexityFactors,
  ComplexityWeights,
} from './routing/complexity-analyzer'

export { ModelRouter, RoutingStrategy } from './routing/model-router'
export type {
  ModelRouterConfig,
  ModelConfig,
  ModelTier,
  RoutingOptions,
  RoutingResult,
  RouterStats,
} from './routing/model-router'
