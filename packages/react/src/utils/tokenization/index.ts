// Main exports for the tokenization utilities
export type { TokenCounter } from '@clarity-chat/token-optimization'

// Token budget validation
export {
  validateTokenBudget,
  createTokenBudget,
  tokenBudgetValidator,
  type TokenBudget,
  type TokenBudgetConfig,
  type TokenBudgetValidation,
  type TruncationOptions,
} from './token-budget-validator'

// Analytics and monitoring
export {
  recordTokenUsage,
  getTokenAnalytics,
  getTokenMetrics,
  tokenAnalyticsMonitor,
  type TokenUsageEvent,
  type TokenAnalytics,
  type TokenMetrics,
  type TokenAlert,
} from './token-analytics'

// Migration assistant
export {
  analyzeTokenMigration,
  generateMigrationReport,
  autoFixTokenMigration,
  manualMigrateTokens,
  tokenMigrationAssistant,
  type MigrationRule,
  type MigrationAnalysis,
  type MigrationResult,
} from './migration-assistant'

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
  type AdaptiveOptimizationResult,
} from './adaptive-optimizer'

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
  type SummarizationConfig,
} from './smart-truncation'

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
  type DynamicOptimizationResult,
} from './dynamic-optimization'

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
  type TokenUsageMetrics,
} from './optimization-middleware'

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
  type ResponsePrediction,
} from './response-optimization'

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
  type Alert,
} from './optimization-dashboard'

// Re-export the comprehensive test utilities
// export * from '../utils/__tests__/token-counter-comprehensive.test';

// Convenience re-exports from the original estimator and accurate-counter
// These maintain backward compatibility while using the new TokenCounter internally
export { estimateTokens, estimateMessagesTokens } from './estimator'
export {
  countTokens,
  countConversationTokens,
  truncateToTokenBudget,
  type ModelName,
  type TokenCount,
} from './accurate-counter'

// Export validation utilities for convenience
export { InputValidator } from './input-validator'
export type {
  ValidationResult as TokenValidationResult,
  InputConstraints,
} from './input-validator'

// Export error handling utilities
export {
  errorHandler,
  ErrorCategory,
  ErrorSeverity,
} from './enhanced-error-handling'
export type {
  TokenOptimizationError,
  ErrorRecoveryStrategy,
} from './enhanced-error-handling'

// Export React hooks
export { useTokenValidator, useAutoTokenValidator } from './use-token-validator'
export {
  useTokenPerformance,
  useAutoTokenPerformance,
} from './use-token-performance'
export type { TokenPerformanceMetrics } from './use-token-performance'
