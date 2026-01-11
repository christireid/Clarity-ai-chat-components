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

// License Utility
export { validateLicense, checkLicense, type LicenseStatus } from './license'

// Core Utilities (remain at root)
export { cn } from './cn'
export * from './mobile'
export * from './export-utils'

// Color Utilities
export * from './color'

// Streaming Utilities
export * from './streaming'

// Message Utilities
export * from './message'

// API Utilities
export * from './api'

// Resilience Utilities
export * from './resilience'

// Tool Utilities
export * from './tools'

// Configuration Utilities
export * from './config'

// Security Utilities
export * from './security'

// Search Utilities
export * from './search'

// Tokenization (explicit exports to avoid conflicts with optimization)
export {
  // Core token counting
  TokenCounter,
  smartCountTokens,
  smartTokenCounter,
  countTokensRobust,
  robustTokenCounter,
  validateTokenBudget,
  createTokenBudget,
  tokenBudgetValidator,
  countTokensOptimized,
  countTokensBatchOptimized,
  benchmarkTokenCounter,
  optimizedTokenCounter,
  // Analytics
  recordTokenUsage,
  getTokenAnalytics,
  getTokenMetrics,
  tokenAnalyticsMonitor,
  // Migration
  analyzeTokenMigration,
  generateMigrationReport,
  autoFixTokenMigration,
  manualMigrateTokens,
  tokenMigrationAssistant,
  // Text compression (renamed to avoid conflicts)
  compressText,
  compressForBudget,
  compressForRatio,
  compressSemanticOnly,
  compressMultiStrategy,
  SemanticCompressor,
  // Advanced compression (using module-specific names)
  AdvancedCompressionOrchestrator,
  compressWithLLMLingua,
  compressWithSelectiveContext,
  compressAdaptive,
  compressEnsemble,
  compressIncremental,
  advancedCompressor,
  compressionOrchestrator,
  compressWithAdvanced,
  // Adaptive optimization
  AdaptiveTokenOptimizer,
  adaptiveOptimizer,
  optimizeTokensAdaptively,
  updateConversationState,
  getAdaptiveAnalytics,
  // Intelligent caching (renamed to avoid conflicts)
  IntelligentSemanticCache,
  MultiLevelCacheManager,
  IntelligentTokenCache,
  semanticCache,
  multiLevelCache,
  tokenCache,
  getCachedTokenCount,
  getCachedCompression,
  setCachedCompression,
  getCacheAnalytics,
  // Smart truncation
  SmartTruncator,
  SmartSummarizer,
  truncateText,
  summarizeText,
  truncateConversation,
  // Dynamic optimization
  DynamicOptimizer,
  optimizeForModel,
  optimizeForBudget,
  optimizeForCost,
  // Middleware
  TokenOptimizationMiddleware,
  TokenOptimizationInterceptor,
  TokenOptimizedAPI,
  tokenMiddleware,
  tokenInterceptor,
  tokenOptimizedAPI,
  getOptimizationMetrics,
  getOptimizationHistory,
  configureMiddleware,
  // Response optimization
  ResponseLengthPredictor,
  ResponseOptimizer,
  responseLengthPredictor,
  responseOptimizer,
  predictResponseLength,
  controlResponseBudget,
  getResponsePredictionAccuracy,
  // Dashboard
  TokenOptimizationMonitor,
  TokenOptimizationAnalytics,
  createTokenMonitor,
  createTokenAnalytics,
  // Estimator functions
  estimateTokensByProvider,
  estimateMessagesTokens,
  countTokens,
  countConversationTokens,
  truncateToTokenBudget,
  // Validation
  InputValidator,
  errorHandler,
  ErrorCategory,
  ErrorSeverity,
  // Hooks
  useTokenValidator,
  useAutoTokenValidator,
  useTokenPerformance,
  useAutoTokenPerformance,
} from './tokenization'

// Tokenization types (renamed to avoid conflicts with optimization types)
export type {
  FallbackStrategy,
  FallbackContext,
  TokenCounterError,
  ErrorContext,
  ErrorHandlingOptions,
  TokenBudget,
  TokenBudgetConfig,
  TokenBudgetValidation,
  TruncationOptions as TokenTruncationOptions,
  PerformanceMetrics as TokenPerformanceMetrics,
  PerformanceBenchmark,
  CachingConfig,
  TokenUsageEvent,
  TokenAnalytics,
  TokenMetrics,
  TokenAlert,
  MigrationRule,
  MigrationAnalysis,
  MigrationResult,
  CompressionStrategy,
  CompressionConfig,
  CompressionResult as TokenCompressionResult,
  AdvancedCompressionStrategy,
  AdvancedCompressionConfig,
  AdvancedCompressionResult,
  CompressionQualityMetrics,
  ModelEfficiencyProfile,
  ContextProfile,
  ConversationState,
  AdaptiveOptimizationConfig,
  AdaptiveOptimizationResult,
  CacheLevel,
  CacheStrategy as TokenCacheStrategy,
  CacheConfig as TokenCachingConfig,
  CacheEntry as TokenCacheEntry,
  CacheStats as TokenCacheStats,
  SemanticCacheConfig as TokenSemanticCacheConfig,
  TruncationStrategy as TokenizerTruncationStrategy,
  ContentType,
  TruncationConfig,
  TruncationResult,
  SummarizationConfig,
  ModelFamily,
  ContextType,
  ModelContext,
  ContentContext,
  DynamicOptimizationResult,
  MiddlewareMode,
  OptimizationTarget,
  MiddlewarePriority,
  MiddlewareConfig,
  OptimizationContext,
  MiddlewareResult,
  TokenUsageMetrics,
  ResponseOptimizationStrategy,
  ResponseOptimizationConfig,
  ResponseMetrics,
  ConversationContext,
  ResponsePrediction,
  DashboardMetrics,
  TimeSeriesData,
  ModelMetrics,
  AlertConfig,
  Alert,
  ModelName,
  TokenValidationResult,
  InputConstraints,
  TokenOptimizationError,
  ErrorRecoveryStrategy,
  TokenPerformanceMetrics as TokenPerformanceHookMetrics,
} from './tokenization'

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
