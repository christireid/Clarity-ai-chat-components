/**
 * Optimization Utilities
 *
 * Token optimization, compression, caching, and performance utilities.
 */
// Prompt Compression
export { compressPrompt, aggressiveCompress, conservativeCompress, balancedCompress, compressConversation, } from './prompt-compression';
export { compressPromptSemantic, compressPromptCombined, calculateTokenImportance, estimateCompressibility, } from './prompt-compression-advanced';
export { LLMLinguaCompressor, compressRAGContext, intelligentCompress, createLLMLinguaCompressor, } from './llmlingua-compressor';
// Chain-of-Thought
export { analyzeCoTPrompt, optimizeCoTPrompt, addZeroShotCoT, recommendCoTApproach, estimateCoTSavings, createCoTPrompt, COT_TRIGGERS, } from './cot-optimizer';
// Output Limits
export { calculateDynamicOutputLimit, injectBrevityInstruction, getPreferenceConfig, getTaskTypeConfig, detectTaskType, createModelOutputConfig, getMaxTokens, } from './dynamic-output-limit';
// KV Cache
export { buildKVCacheOptimizedPrompt, createSegment, createSystemSegment, createContextSegment, createRAGSegment, createHistorySegment, createUserSegment, conversationToSegments, validateSegments, estimateKVCacheSavings, PromptBudgetExceededError, } from './kv-cache-prompt-builder';
export * from './prompt-structure';
export * from './response-prefilling';
export * from './response-limiter';
// Context Ordering
export { reorderForAttention, addStructuralMarkers, optimizeContextLayout, calculateMessageImportance, estimateAttentionLoss, createContextOrderingHook, } from './context-ordering';
// Context Window (explicit exports to avoid ContextMessage conflict with context-ordering)
export { FIFOTruncation, SlidingWindowTruncation, SmartTruncation, SummarizationTruncation, ContextWindowManager, } from './context-window';
// Caching
export { SmartCache, SimpleCache, } from './smart-cache';
export { PersistentSemanticCache, createPersistentSemanticCache, usePersistentSemanticCacheConfig, } from './semantic-cache-persistent';
export { SchemaCache, createOpenAIWarmingRequest, estimateSchemaLatency, recommendSchemaStrategy, COMMON_SCHEMAS, } from './structured-output-cache';
// Token Optimization (explicit exports to avoid conflicts with named exports above)
export { shortenPrompt, estimateTokens, calculateTokenSavings, limitHistorySlidingWindow, limitHistoryFIFO, limitHistorySmart, limitHistory, createCache, generateCacheKey, createThrottler, classifyQueryComplexity, routeToModel, estimateRoutingSavings, shouldUseReference, createReference, enforceOutputLimit, createBatcher, calculateSimilarity, findSimilarCached, } from './token-optimization';
// Performance (explicit exports to avoid conflicts)
export { throttle, debounce, Batcher, measurePerformance, PerformanceMonitor, lazyLoad, optimizeArray, } from './performance';
export { calculateVisibleRange, createDebouncedFunction, createThrottledFunction, MemoryManager, calculateMessageDiff, BatchProcessor, PerformanceTracker, checkPerformanceTarget, } from './performance-optimization';
//# sourceMappingURL=index.js.map