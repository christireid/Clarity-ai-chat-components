/**
 * Compression Module
 *
 * Provides real compression algorithms for token optimization.
 *
 * ## Recommended Compressors (Real Compression)
 *
 * - **LLMLinguaCompressor**: Statistical token-level compression (2-20x compression)
 * - **ExtractiveCompressor**: Sentence-level extraction (2-5x compression)
 * - **AdaptiveCompressor**: Auto-selects best strategy based on content
 *
 * ## Legacy / Utility (Not Real Compression)
 *
 * - **BasicCompressionEngine**: Whitespace normalization only (10-20% reduction)
 *
 * @example
 * ```typescript
 * import {
 *   // Recommended - real compression
 *   LLMLinguaCompressor,
 *   ExtractiveCompressor,
 *   AdaptiveCompressor,
 *   compressAdaptively,
 *
 *   // Utilities
 *   normalizeWhitespace
 * } from '@clarity/token-optimization/compression';
 *
 * // Quick adaptive compression
 * const compressed = await compressAdaptively(longPrompt, 0.3);
 *
 * // Full control with LLMLingua
 * const compressor = new LLMLinguaCompressor();
 * const result = await compressor.compress(text, 0.3, {
 *   preserveCode: true,
 *   preserveInstructions: true
 * });
 *
 * // Just clean up whitespace (not real compression)
 * const cleaned = normalizeWhitespace(text);
 * ```
 *
 * @module compression
 */

// ============================================================================
// Real Compression Strategies (Recommended)
// ============================================================================

// LLMLingua - Statistical token compression
export {
  LLMLinguaCompressor,
  createLLMLinguaCompressor,
  compressWithLLMLingua,
  type LLMLinguaOptions,
  type LLMLinguaResult,
  type LLMLinguaQualityMetrics,
  type LLMLinguaDebugInfo,
} from './strategies/llmlingua'

// Extractive - Sentence-level compression
export {
  ExtractiveCompressor,
  createExtractiveCompressor,
  compressExtractively,
  type ExtractiveOptions,
  type ExtractiveResult,
  type ExtractiveQualityMetrics,
  type ExtractiveDebugInfo,
  type ScoredSentence,
} from './strategies/extractive'

// Adaptive - Auto-strategy selection
export {
  AdaptiveCompressor,
  createAdaptiveCompressor,
  compressAdaptively,
  type AdaptiveOptions,
  type AdaptiveResult,
  type AdaptiveQualityMetrics,
  type AdaptiveDebugInfo,
  type ContentAnalysis,
  type ContentType,
  type LanguageFeatures,
  type CompressionStrategyType,
} from './strategies/adaptive'

// Common types
export {
  type CommonQualityMetrics,
  type CommonCompressionResult,
  type StrategyRecommendation,
  recommendStrategy,
} from './strategies'

// ============================================================================
// Memory Compression Strategies (Migrated from memory package)
// ============================================================================

// Memory extract - heuristic-based key extraction
export {
  MemoryExtractStrategy,
  createMemoryExtractStrategy,
  compressWithMemoryExtract,
  type MemoryContent,
  type MemoryExtractResult,
  type MemoryExtractOptions,
} from './strategies/memory-extract'

// Memory summarize - LLM-based summarization
export {
  MemorySummarizeStrategy,
  createMemorySummarizeStrategy,
  compressWithMemorySummarize,
  type LLMSummarizer,
  type Summarizer,
  type MemorySummarizeResult,
  type MemorySummarizeOptions,
} from './strategies/memory-summarize'

// Memory adaptive - auto-select best strategy
export {
  MemoryAdaptiveStrategy,
  createMemoryAdaptiveStrategy,
  compressWithMemoryAdaptive,
  type MemoryAdaptiveResult,
  type MemoryAdaptiveOptions,
  type MemoryTruncateResult,
  type MemoryNoCompressionResult,
} from './strategies/memory-adaptive'

// ============================================================================
// Utility Functions (Not Real Compression)
// ============================================================================

export {
  normalizeWhitespace,
  normalizeWhitespaceBatch,
  type NormalizationConfig,
  type NormalizationResult,
} from './basic-engine'

// ============================================================================
// Legacy Exports (Deprecated - Maintained for Backward Compatibility)
// ============================================================================

/**
 * @deprecated Use LLMLinguaCompressor, ExtractiveCompressor, or AdaptiveCompressor instead.
 * BasicCompressionEngine only performs whitespace normalization (10-20% reduction).
 */
export { BasicCompressionEngine } from './basic-engine'

/**
 * @deprecated
 */
export type {
  CompressionStrategy,
  CompressionResult,
  CompressionConfig,
} from './basic-engine'
