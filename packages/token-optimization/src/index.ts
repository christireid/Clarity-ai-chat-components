/**
 * Token Optimization Package
 *
 * The simplest way to count and optimize LLM tokens.
 *
 * @example Quick Start (React)
 * ```tsx
 * import { useTokenCount } from '@clarity-chat/token-optimization'
 *
 * function MyComponent() {
 *   const { count } = useTokenCount(text)
 *   return <span>{count} tokens</span>
 * }
 * ```
 *
 * @example Quick Start (Node.js)
 * ```typescript
 * import { countTokens, DEFAULTS } from '@clarity-chat/token-optimization'
 *
 * const count = countTokens('Hello world') // Uses gpt-4o by default
 * console.log(`${count} tokens using ${DEFAULTS.model}`)
 * ```
 *
 * @example With Model Router
 * ```typescript
 * const router = ModelRouter.default()
 * // or with builder:
 * const router = ModelRouter.builder()
 *   .useOpenAIModels()
 *   .withStrategy('cost-optimized')
 *   .build()
 * ```
 *
 * @packageDocumentation
 */

// ============================================================================
// Sensible Defaults (Start Here!)
// ============================================================================

export {
  // Core defaults
  DEFAULT_MODEL,
  DEFAULT_DEBOUNCE_MS,
  DEFAULT_MAX_CACHE_SIZE,
  DEFAULT_CACHE_TTL_MS,
  DEFAULT_SIMILARITY_THRESHOLD,
  // Component defaults
  DEFAULT_TOKEN_COUNTER_OPTIONS,
  DEFAULT_COUNT_OPTIONS,
  DEFAULT_COMPRESSION_OPTIONS,
  DEFAULT_LLMLINGUA_OPTIONS,
  DEFAULT_CACHE_OPTIONS,
  DEFAULT_TIERED_CACHE_BY_PRESET,
  DEFAULT_ROUTING_CONFIG,
  DEFAULT_FALLBACK_MODEL,
  DEFAULT_SECURITY_CONFIG,
  DEFAULT_BUDGET_OPTIONS,
  // Hook defaults
  DEFAULT_USE_TOKEN_COUNT_OPTIONS,
  DEFAULT_USE_TOKEN_BUDGET_OPTIONS,
  DEFAULT_USE_TOKEN_OPTIMIZATION_OPTIONS,
  // Presets
  PRESETS,
  // All-in-one defaults object
  DEFAULTS,
} from './defaults'
export type { PresetName } from './defaults'

// ============================================================================
// Model Registry & Pricing (Single Source of Truth)
// ============================================================================

export {
  MODEL_REGISTRY,
  getAllModelIds,
  getModelsByProvider,
  getModelsWithCapability,
  getModelsWithMinContextWindow,
  isValidModelId,
  getModelConfig,
  tryGetModelConfig,
  // Model Registration API (for custom models)
  registerModel,
  createCustomModel,
  isCustomModel,
  unregisterModel,
} from './models/model-registry'
export type {
  ModelId,
  KnownModelId,
  ModelProvider,
  TokenizerEncoding,
  ModelRegistryConfig,
  // Deprecated - use ModelRegistryConfig
  ModelRegistryConfig as TokenModelConfig,
} from './models/model-registry'

export {
  MODEL_PRICING,
  calculateCost,
  calculateCacheSavings,
  estimateConversationCost,
  compareModelCosts,
  recommendModel,
  getModelPricing,
  modelSupportsCaching,
  getModelsWithCaching,
} from './models/model-pricing'
export type {
  PricingProvider,
  ModelPricing,
  CostCalculation,
} from './models/model-pricing'

// Token Estimation Utilities
export {
  estimateTokens,
  countConversationTokens,
  estimateMessagesTokens,
  getCharsPerToken,
  shouldUseAsyncEstimation,
  estimateTokensDebug,
} from './utils/token-estimation'

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

// Analytics exports - Real-time cost tracking and savings calculation
export {
  calculateCost as calculateRequestCost,
  getSavingsPercentage,
  CostTracker,
  compareModelCosts as compareModelCostsDetailed,
  estimatePotentialSavings,
} from './analytics/cost-calculator'
export type {
  TokenUsage as AnalyticsTokenUsage,
  CostBreakdown,
  CostTracking,
  SavingsReport,
} from './analytics/cost-calculator'

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
  // Memory compression strategies (migrated from memory package)
  MemoryExtractStrategy,
  createMemoryExtractStrategy,
  compressWithMemoryExtract,
  MemorySummarizeStrategy,
  createMemorySummarizeStrategy,
  compressWithMemorySummarize,
  MemoryAdaptiveStrategy,
  createMemoryAdaptiveStrategy,
  compressWithMemoryAdaptive,
  // Legacy compression API (deprecated, use compressAdaptively instead)
  compressText,
  compressTextBatch,
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
  // Memory compression types (migrated from memory package)
  MemoryContent,
  MemoryExtractResult,
  MemoryExtractOptions,
  LLMSummarizer,
  Summarizer,
  MemorySummarizeResult,
  MemorySummarizeOptions,
  MemoryAdaptiveResult,
  MemoryAdaptiveOptions,
  MemoryTruncateResult,
  MemoryNoCompressionResult,
} from './compression'

// Token counting exports (legacy compatibility)
// Legacy compatibility exports have been removed
// Use AccurateTokenCounter for token counting
// Backward compatibility classes from legacy-compatibility.ts were deprecated and removed

// Deprecated legacy classes have been removed
// For token counting: use AccurateTokenCounter
// For memory optimization: use @clarity-chat/memory package

// Memory Token Budget Manager (migrated from memory package)
export {
  MemoryTokenBudgetManager,
  createMemoryTokenBudgetManager,
  MemoryBudgetPresets,
} from './budget/memory-budget'
export type {
  MemoryBudgetType,
  MemoryTokenAllocation,
  MemoryTokenBudgetConfig,
  MemoryTokenBreakdown,
  MemoryBudgetContext,
} from './budget/memory-budget'

// Tokenizers - using gpt-tokenizer (5-6x smaller than tiktoken)
export { AccurateTokenCounter } from './tokenizers/accurate-counter'
export type {
  TokenizerConfig,
  TokenInfo,
  CacheStats as TokenCacheStats,
  MonitoringStats,
  ChatMessage,
} from './tokenizers/accurate-counter'

// Provider-Native Token Counting - 100% accurate counting using provider APIs
export {
  ProviderNativeCounter,
  providerNativeCount,
} from './tokenizers/provider-native-counter'
export type {
  ProviderNativeCounterConfig,
  TokenCountResult,
} from './tokenizers/provider-native-counter'

// Provider-Native Caching (Anthropic, OpenAI, Google)
// ⚠️ Formats messages for provider caching. You must implement provider API calls.
export {
  // Advanced API (full control)
  ProviderCachingFormatter,
  formatMessagesForProviderCaching,
  parseOpenAICacheMetrics,
  // Deprecated aliases (use ProviderCachingFormatter instead)
  ProviderCachingManager,
  applyProviderCaching,
  // Simple API (recommended for most use cases)
  createProviderCache,
  quickCache,
  anthropicCache,
  openaiCache,
  googleCache,
  estimateCacheSavings,
} from './providers'
export type {
  CachingProvider,
  AnthropicCacheControl,
  AnthropicContentBlock,
  AnthropicMessage,
  OpenAICacheConfig,
  OpenAIUsageMetadata,
  GeminiCacheConfig,
  GeminiCachedContent,
  GeminiCachingMode,
  ProviderCacheMetadata,
  ProviderCachingResult,
  ProviderCachingConfig,
  CacheableMessage,
  // Token counting provider interface
  TokenCountingProvider,
  // Backward compatibility type alias
  TokenCounter,
} from './providers/types'
export type { SimpleProviderCachingConfig } from './providers/simple-caching'

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

// Markdown Optimization - Strip/compress markdown for token reduction
export {
  MarkdownOptimizer,
  stripMarkdown,
  compressMarkdown,
} from './formats/markdown-optimizer'
export type {
  MarkdownCompressOptions,
  CodeBlock,
  SavingsEstimate as MarkdownSavingsEstimate,
} from './formats/markdown-optimizer'

// HTML Optimization - Convert HTML to text/markdown for token reduction
export {
  HTMLOptimizer,
  htmlToText,
  htmlToMarkdown,
} from './formats/html-optimizer'
export type { HTMLToTextOptions } from './formats/html-optimizer'

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

export {
  ModelRouter,
  ModelRouterBuilder,
  RoutingStrategy,
} from './routing/model-router'
export type {
  ModelRouterConfig,
  ModelRoutingConfig,
  ModelTier,
  RoutingOptions,
  RoutingResult,
  RouterStats,
  // Deprecated - use ModelRoutingConfig
  ModelRoutingConfig as ModelConfig,
} from './routing/model-router'

// React Hooks
export {
  // Simple hooks (recommended starting point)
  useTokenCount,
  // Full-featured hooks
  useTieredCache,
  useModelRouter,
  useOptimizationPipeline,
  // Token budget tracking (new canonical name)
  useTokenBudgetTracking,
  // Token budget monitoring (deprecated - use useTokenBudgetTracking)
  useTokenBudgetMonitor,
  getStatusColor,
  formatTokenUsage,
  createModelBudgetMonitor,
  isValidBudgetMonitorModel,
  estimateTokenCost,
} from './hooks'
export type {
  // Simple hook types
  UseTokenCountOptions,
  UseTokenCountReturn,
  // Full-featured hook types
  UseTieredCacheConfig,
  UseTieredCacheReturn,
  UseModelRouterConfig,
  UseModelRouterReturn,
  OptimizationPipelineConfig,
  PipelineResult,
  PipelineStats,
  UseOptimizationPipelineReturn,
  // Token budget tracking types (new canonical name)
  TokenBudgetTrackingReturn,
  // Token budget monitoring types (deprecated)
  TokenUsageStatus,
  TokenBudgetUsage,
  TokenUsage, // @deprecated - use TokenBudgetUsage for budget tracking, or analytics/TokenUsage for API metrics
  TrimResult,
  BudgetMessage,
  TokenBudgetConfig,
  TokenBudgetMonitorReturn, // @deprecated - use TokenBudgetTrackingReturn
  BudgetMonitorModel,
  TokenCostEstimate,
  ModelName, // Backward compatibility
} from './hooks'

// Accessibility - WCAG 2.1 AA compliant utilities
export {
  // Screen reader announcements
  announce,
  announceTokenUsage,
  announceCost,
  announceCompression,
  announceThresholdCrossing,
  cleanupAnnouncer,
  // React hooks for accessibility
  useTokenAnnouncer,
  useTokenKeyboardShortcuts,
  usePrefersReducedMotion,
  usePrefersHighContrast,
  // Accessible components
  AccessibleTokenDisplay,
  MemoizedAccessibleTokenDisplay,
  useTokenDisplayState,
} from './accessibility'
export type {
  AnnouncementPriority,
  TokenAnnouncerOptions,
  UseTokenAnnouncerReturn,
  KeyboardShortcutOptions,
  ReducedMotionOptions,
  AccessibleTokenDisplayProps,
  TokenDisplayState,
} from './accessibility'

// ============================================================================
// Production & Enterprise Readiness Features
// ============================================================================

// Error Handling System
export {
  // Base errors
  TokenOptimizationError,
  TokenErrorCode,
  // Helpful errors with suggestions and docs links
  HelpfulError,
  UnsupportedModelError,
  TokenBudgetExceededError,
  ValidationError,
  CacheError,
  CompressionError,
  QualityThresholdError,
  SecurityViolationError,
  // Factory function
  createError,
  // Utilities
  isRecoverable,
  withRetry,
  withTimeout,
  wrapError,
} from './errors'
export type { RetryOptions } from './errors'

// Health Check System
export {
  HealthChecker,
  createHealthEndpoint,
  createLivenessCheck,
  createReadinessCheck,
} from './health'
export type {
  HealthStatus,
  ComponentHealth,
  HealthMetrics,
  HealthCheckerConfig,
} from './health'

// Observability System
export {
  Logger,
  MetricsCollector,
  Tracer,
  createObservability,
} from './observability'
export type {
  ObservabilityConfig,
  MetricsHandler,
  LogHandler,
  TraceHandler,
  Span,
  MetricsSnapshot,
  LogLevel,
} from './observability'

// Resilience - Circuit Breaker
export {
  CircuitBreaker,
  CircuitBreakerRegistry,
  createCircuitBreaker,
} from './resilience/circuit-breaker'
export type {
  CircuitBreakerConfig,
  CircuitBreakerStats,
  CircuitState,
} from './resilience/circuit-breaker'

// ============================================================================
// Simplified API (Recommended Entry Point)
// ============================================================================

// Factory for non-React usage
export { createOptimizer, OptimizerPresets } from './factory'
export type { OptimizerConfig, OptimizerPreset, Optimizer } from './factory'

// Unified React hook (recommended)
export { useTokenOptimization } from './hooks/use-token-optimization'
export type {
  UseTokenOptimizationConfig,
  UseTokenOptimizationReturn,
  TokenOptimizationPreset,
} from './hooks/use-token-optimization'
