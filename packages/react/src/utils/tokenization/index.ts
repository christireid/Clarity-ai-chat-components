// Main exports for the tokenization utilities
export { TokenCounter } from '@clarity-chat/token-optimization';

// Core token counting with different strategies
export { 
  smartCountTokens, 
  smartTokenCounter,
  type FallbackStrategy,
  type FallbackContext 
} from './smart-fallback.js';

// Robust error handling
export { 
  countTokensRobust,
  robustTokenCounter,
  type TokenCounterError,
  type ErrorContext,
  type ErrorHandlingOptions 
} from './robust-error-handling.js';

// Token budget validation
export { 
  validateTokenBudget,
  createTokenBudget,
  tokenBudgetValidator,
  type TokenBudget,
  type TokenBudgetConfig,
  type TokenBudgetValidation,
  type TruncationOptions 
} from './token-budget-validator.js';

// Performance optimization
export { 
  countTokensOptimized,
  countTokensBatchOptimized,
  benchmarkTokenCounter,
  optimizedTokenCounter,
  type PerformanceMetrics,
  type PerformanceBenchmark,
  type CachingConfig 
} from './performance-optimization.js';

// Analytics and monitoring
export { 
  recordTokenUsage,
  getTokenAnalytics,
  getTokenMetrics,
  tokenAnalyticsMonitor,
  type TokenUsageEvent,
  type TokenAnalytics,
  type TokenMetrics,
  type TokenAlert 
} from './token-analytics.js';

// Migration assistant
export { 
  analyzeTokenMigration,
  generateMigrationReport,
  autoFixTokenMigration,
  manualMigrateTokens,
  tokenMigrationAssistant,
  type MigrationRule,
  type MigrationAnalysis,
  type MigrationResult 
} from './migration-assistant.js';

// Text compression and preprocessing
export {
  compressText,
  compressForBudget,
  compressForRatio,
  compressSemanticOnly,
  compressMultiStrategy,
  SemanticCompressor,
  type CompressionStrategy,
  type CompressionConfig,
  type CompressionResult
} from './text-compression.js';

// Advanced compression techniques
export {
  LLMLinguaCompressor,
  AdvancedCompressionOrchestrator,
  compressWithLLMLingua,
  compressWithSelectiveContext,
  compressAdaptive,
  compressEnsemble,
  compressIncremental,
  advancedCompressor,
  compressionOrchestrator,
  compressWithAdvanced,
  type AdvancedCompressionStrategy,
  type AdvancedCompressionConfig,
  type AdvancedCompressionResult,
  type CompressionQualityMetrics
} from './advanced-compression.js';

// Advanced compression techniques
export {
  LLMLinguaCompressor,
  AdvancedCompressionOrchestrator,
  compressWithLLMLingua,
  compressWithSelectiveContext,
  compressAdaptive,
  compressEnsemble,
  compressIncremental,
  advancedCompressor,
  compressionOrchestrator,
  compressWithAdvanced,
  type AdvancedCompressionStrategy,
  type AdvancedCompressionConfig,
  type AdvancedCompressionResult,
  type CompressionQualityMetrics
} from './advanced-compression.js';

// Adaptive optimization
export {
  AdaptiveTokenOptimizer,
  adaptiveOptimizer,
  optimizeTokensAdaptively,
  updateConversationState,
  getAdaptiveAnalytics,
  type ModelEfficiencyProfile,
  type ContextProfile,
  type ConversationState,
  type AdaptiveOptimizationConfig,
  type AdaptiveOptimizationResult
} from './adaptive-optimizer.js';

// Intelligent caching
export {
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
  type CacheLevel,
  type CacheStrategy,
  type CacheConfig,
  type CacheEntry,
  type CacheStats,
  type SemanticCacheConfig
} from './intelligent-caching.js';

// Smart truncation and summarization
export {
  SmartTruncator,
  SmartSummarizer,
  truncateText,
  summarizeText,
  truncateConversation,
  type TruncationStrategy,
  type ContentType,
  type TruncationConfig,
  type TruncationResult,
  type SummarizationConfig
} from './smart-truncation.js';

// Dynamic optimization
export {
  DynamicOptimizer,
  optimizeForModel,
  optimizeForBudget,
  optimizeForCost,
  type ModelFamily,
  type ContextType,
  type ModelContext,
  type ContentContext,
  type DynamicOptimizationResult
} from './dynamic-optimization.js';

// Optimization middleware
export {
  TokenOptimizationMiddleware,
  TokenOptimizationInterceptor,
  TokenOptimizedAPI,
  tokenMiddleware,
  tokenInterceptor,
  tokenOptimizedAPI,
  getOptimizationMetrics,
  getOptimizationHistory,
  configureMiddleware,
  type MiddlewareMode,
  type OptimizationTarget,
  type MiddlewarePriority,
  type MiddlewareConfig,
  type OptimizationContext,
  type MiddlewareResult,
  type TokenUsageMetrics
} from './optimization-middleware.js';

// Response optimization
export {
  ResponseLengthPredictor,
  ResponseOptimizer,
  responseLengthPredictor,
  responseOptimizer,
  predictResponseLength,
  controlResponseBudget,
  getResponsePredictionAccuracy,
  type ResponseOptimizationStrategy,
  type ResponseOptimizationConfig,
  type ResponseMetrics,
  type ConversationContext,
  type ResponsePrediction
} from './response-optimization.js';

// Optimization dashboard and monitoring
export {
  TokenOptimizationMonitor,
  TokenOptimizationAnalytics,
  createTokenMonitor,
  createTokenAnalytics,
  type DashboardMetrics,
  type TimeSeriesData,
  type ModelMetrics,
  type AlertConfig,
  type Alert
} from './optimization-dashboard.js';

// Re-export the comprehensive test utilities
// export * from '../utils/__tests__/token-counter-comprehensive.test.js';

// Convenience re-exports from the original estimator and accurate-counter
// These maintain backward compatibility while using the new TokenCounter internally
export { estimateTokens, estimateTokensByProvider, estimateMessagesTokens } from './estimator.js';
export { countTokens, countConversationTokens, truncateToTokenBudget } from './accurate-counter.js';

// Export validation utilities for convenience
export { InputValidator } from './input-validator.js';
export type { ValidationResult, InputConstraints } from './input-validator.js';

// Export error handling utilities
export { errorHandler, ErrorCategory, ErrorSeverity } from './enhanced-error-handling.js';
export type { TokenOptimizationError, ErrorRecoveryStrategy } from './enhanced-error-handling.js';

// Export React hooks
export { useTokenValidator, useAutoTokenValidator } from './use-token-validator.js';
export { useTokenPerformance, useAutoTokenPerformance } from './use-token-performance.js';
export type { TokenPerformanceMetrics } from './use-token-performance.js';

// Default export for easy importing
export default {
  // Core functionality
  TokenCounter,
  
  // Smart counting
  smartCountTokens,
  smartTokenCounter,
  
  // Robust counting
  countTokensRobust,
  robustTokenCounter,
  
  // Budget validation
  validateTokenBudget,
  createTokenBudget,
  tokenBudgetValidator,
  
  // Performance optimization
  countTokensOptimized,
  countTokensBatchOptimized,
  benchmarkTokenCounter,
  optimizedTokenCounter,
  
  // Text compression
  compressText,
  compressForBudget,
  compressForRatio,
  compressSemanticOnly,
  compressMultiStrategy,
  SemanticCompressor,
  
  // Advanced compression
  LLMLinguaCompressor,
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
  
  // Intelligent caching
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
  
  // Optimization middleware
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
  
  // Dashboard and monitoring
  TokenOptimizationMonitor,
  TokenOptimizationAnalytics,
  createTokenMonitor,
  createTokenAnalytics,
  
  // Analytics
  recordTokenUsage: recordTokenUsage,
  getTokenAnalytics,
  getTokenMetrics,
  tokenAnalyticsMonitor,
  
  // Migration
  analyzeTokenMigration,
  generateMigrationReport,
  autoFixTokenMigration,
  manualMigrateTokens,
  tokenMigrationAssistant
};