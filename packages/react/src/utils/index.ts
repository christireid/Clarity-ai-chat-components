/**
 * Utilities Index
 *
 * This module provides organized access to all utility functions.
 * Utilities are grouped by domain for better discoverability:
 *
 * - animations/     Animation presets and hooks (framer-motion)
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
// Re-export cn from primitives for backward compatibility
export { cn } from '@clarity-chat/primitives'
export * from './mobile'
export * from './export-utils'

// Glassmorphism Utilities
export * from './glassmorphism'

// Color Utilities
export * from './color'

// Animation Utilities
export * from './animations'

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

// Markdown Utilities
export {
  loadMarkdownDependencies,
  getMarkdownDependencies,
  PlainTextMarkdown,
  useMarkdownAvailability,
  type PlainTextMarkdownProps,
} from './markdown/markdown-fallback'

// Tokenization (explicit exports to avoid conflicts with optimization)
export {
  // Core token counting
  type TokenCounter,
  validateTokenBudget,
  createTokenBudget,
  tokenBudgetValidator,
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
  // Adaptive optimization
  AdaptiveTokenOptimizer,
  adaptiveOptimizer,
  optimizeTokensAdaptively,
  updateConversationState,
  getAdaptiveAnalytics,
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
  TokenBudget,
  TokenBudgetConfig,
  TokenBudgetValidation,
  TruncationOptions as TokenTruncationOptions,
  TokenUsageEvent,
  TokenAnalytics,
  TokenMetrics,
  TokenAlert,
  MigrationRule,
  MigrationAnalysis,
  MigrationResult,
  ModelEfficiencyProfile,
  ContextProfile,
  ConversationState,
  AdaptiveOptimizationConfig,
  AdaptiveOptimizationResult,
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

// Peer Detection
export {
  detectPeerCapabilities,
  getPeerModule,
  isPeerAvailable,
  clearPeerCache,
  getPeerDetectionStats,
  usePeerCapabilities,
  usePeerAvailable,
  usePeerModule,
  getInstallationInstructions,
  type PeerCapabilities,
} from './peer-detection'
