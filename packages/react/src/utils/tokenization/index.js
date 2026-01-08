// Main exports for the tokenization utilities
export { TokenCounter } from '@clarity-chat/token-optimization';
// Core token counting with different strategies
export { smartCountTokens, smartTokenCounter, } from './smart-fallback';
// Robust error handling
export { countTokensRobust, robustTokenCounter, } from './robust-error-handling';
// Token budget validation
export { validateTokenBudget, createTokenBudget, tokenBudgetValidator, } from './token-budget-validator';
// Performance optimization
export { countTokensOptimized, countTokensBatchOptimized, benchmarkTokenCounter, optimizedTokenCounter, } from './performance-optimization';
// Analytics and monitoring
export { recordTokenUsage, getTokenAnalytics, getTokenMetrics, tokenAnalyticsMonitor, } from './token-analytics';
// Migration assistant
export { analyzeTokenMigration, generateMigrationReport, autoFixTokenMigration, manualMigrateTokens, tokenMigrationAssistant, } from './migration-assistant';
// Text compression and preprocessing
export { compressText, compressForBudget, compressForRatio, compressSemanticOnly, compressMultiStrategy, SemanticCompressor, } from './text-compression';
// Advanced compression techniques
export { LLMLinguaCompressor, AdvancedCompressionOrchestrator, compressWithLLMLingua, compressWithSelectiveContext, compressAdaptive, compressEnsemble, compressIncremental, advancedCompressor, compressionOrchestrator, compressWithAdvanced, } from './advanced-compression';
// Adaptive optimization
export { AdaptiveTokenOptimizer, adaptiveOptimizer, optimizeTokensAdaptively, updateConversationState, getAdaptiveAnalytics, } from './adaptive-optimizer';
// Intelligent caching
export { IntelligentSemanticCache, MultiLevelCacheManager, IntelligentTokenCache, semanticCache, multiLevelCache, tokenCache, getCachedTokenCount, getCachedCompression, setCachedCompression, getCacheAnalytics, } from './intelligent-caching';
// Smart truncation and summarization
export { SmartTruncator, SmartSummarizer, truncateText, summarizeText, truncateConversation, } from './smart-truncation';
// Dynamic optimization
export { DynamicOptimizer, optimizeForModel, optimizeForBudget, optimizeForCost, } from './dynamic-optimization';
// Optimization middleware
export { TokenOptimizationMiddleware, TokenOptimizationInterceptor, TokenOptimizedAPI, tokenMiddleware, tokenInterceptor, tokenOptimizedAPI, getOptimizationMetrics, getOptimizationHistory, configureMiddleware, } from './optimization-middleware';
// Response optimization
export { ResponseLengthPredictor, ResponseOptimizer, responseLengthPredictor, responseOptimizer, predictResponseLength, controlResponseBudget, getResponsePredictionAccuracy, } from './response-optimization';
// Optimization dashboard and monitoring
export { TokenOptimizationMonitor, TokenOptimizationAnalytics, createTokenMonitor, createTokenAnalytics, } from './optimization-dashboard';
// Re-export the comprehensive test utilities
// export * from '../utils/__tests__/token-counter-comprehensive.test';
// Convenience re-exports from the original estimator and accurate-counter
// These maintain backward compatibility while using the new TokenCounter internally
export { estimateTokens, estimateTokensByProvider, estimateMessagesTokens, } from './estimator';
export { countTokens, countConversationTokens, truncateToTokenBudget, } from './accurate-counter';
// Export validation utilities for convenience
export { InputValidator } from './input-validator';
// Export error handling utilities
export { errorHandler, ErrorCategory, ErrorSeverity, } from './enhanced-error-handling';
// Export React hooks
export { useTokenValidator, useAutoTokenValidator } from './use-token-validator';
export { useTokenPerformance, useAutoTokenPerformance, } from './use-token-performance';
//# sourceMappingURL=index.js.map