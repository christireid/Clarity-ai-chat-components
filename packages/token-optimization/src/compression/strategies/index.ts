/**
 * Compression Strategies
 *
 * This module provides real compression algorithms for token optimization:
 *
 * - **LLMLingua**: Statistical token-level compression based on importance scoring.
 *   Achieves 2-20x compression while preserving semantic meaning.
 *
 * - **Extractive**: Sentence-level compression that extracts the most important
 *   sentences while maintaining grammatical coherence.
 *
 * - **Adaptive**: Automatically selects the best strategy based on content analysis.
 *
 * - **Memory Strategies**: Migrated from the memory package for consolidation:
 *   - MemoryExtractStrategy: Extract key information using heuristics
 *   - MemorySummarizeStrategy: LLM-based summarization
 *   - MemoryAdaptiveStrategy: Auto-select best strategy for memory content
 *
 * @example
 * ```typescript
 * import {
 *   LLMLinguaCompressor,
 *   ExtractiveCompressor,
 *   AdaptiveCompressor,
 *   compressWithLLMLingua,
 *   compressExtractively,
 *   compressAdaptively,
 *   // Memory strategies
 *   MemoryExtractStrategy,
 *   MemoryAdaptiveStrategy,
 * } from './strategies';
 *
 * // Quick compression
 * const compressed = await compressAdaptively(text, 0.5);
 *
 * // Full control with LLMLingua
 * const compressor = new LLMLinguaCompressor();
 * const result = await compressor.compress(text, 0.3, {
 *   preserveCode: true,
 *   preserveInstructions: true
 * });
 * console.log(`Achieved ${result.tokenReductionRatio} token reduction`);
 * console.log(`Quality: ${result.quality.overallQuality}`);
 *
 * // Memory-specific compression
 * const memoryStrategy = new MemoryAdaptiveStrategy();
 * const memResult = await memoryStrategy.compress({ content: text }, 0.5);
 * console.log(`Used ${memResult.method} strategy`);
 * ```
 *
 * @module strategies
 */

// LLMLingua compression
export {
  LLMLinguaCompressor,
  createLLMLinguaCompressor,
  compressWithLLMLingua,
  type LLMLinguaOptions,
  type LLMLinguaResult,
  type LLMLinguaQualityMetrics,
  type LLMLinguaDebugInfo,
} from './llmlingua'

// Extractive compression
export {
  ExtractiveCompressor,
  createExtractiveCompressor,
  compressExtractively,
  type ExtractiveOptions,
  type ExtractiveResult,
  type ExtractiveQualityMetrics,
  type ExtractiveDebugInfo,
  type ScoredSentence,
} from './extractive'

// Adaptive compression
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
} from './adaptive'

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
} from './memory-extract'

// Memory summarize - LLM-based summarization
export {
  MemorySummarizeStrategy,
  createMemorySummarizeStrategy,
  compressWithMemorySummarize,
  type LLMSummarizer,
  type Summarizer,
  type MemorySummarizeResult,
  type MemorySummarizeOptions,
} from './memory-summarize'

// Memory adaptive - auto-select best strategy
export {
  MemoryAdaptiveStrategy,
  createMemoryAdaptiveStrategy,
  compressWithMemoryAdaptive,
  type MemoryAdaptiveResult,
  type MemoryAdaptiveOptions,
  type MemoryTruncateResult,
  type MemoryNoCompressionResult,
} from './memory-adaptive'

// Conversation memory management (context window optimization)
export {
  // Strategies
  SlidingWindowStrategy,
  ImportanceBasedStrategy,
  SummarizationStrategy,
  AdaptiveConversationStrategy,
  // Factory functions
  createSlidingWindowStrategy,
  createImportanceBasedStrategy,
  createSummarizationStrategy,
  createAdaptiveStrategy,
  // Quick helpers
  optimizeConversation,
  // Types
  type ConversationMessage,
  type MessageRole,
  type ConversationMemoryResult,
  type SlidingWindowOptions,
  type ImportanceBasedOptions,
  type SummarizationOptions,
  type ConversationSummarizer,
  type AdaptiveStrategyOptions,
} from './conversation-memory'

// Binary compression using fflate (WASM-accelerated)
export {
  BinaryCompressor,
  createBinaryCompressor,
  compressBinary,
  decompressBinary,
  type BinaryCompressionOptions,
  type BinaryCompressionResult,
  type BinaryDecompressionResult,
} from './binary-compression'

// String compression using lz-string (UTF-16 optimized)
export {
  StringCompressor,
  createStringCompressor,
  compressString,
  decompressString,
  compressForURL,
  decompressFromURL,
  ConversationCache,
  type StringCompressionFormat,
  type StringCompressionOptions,
  type StringCompressionResult,
} from './string-compression'

/**
 * Common quality metrics interface used across all strategies
 */
export interface CommonQualityMetrics {
  /** Semantic similarity between original and compressed (0-1) */
  semanticSimilarity?: number
  /** Percentage of key terms preserved (0-1) */
  keyTermRetention: number
  /** Percentage of sentences preserved (0-1, extractive only) */
  sentenceRetention?: number
  /** Overall quality score (0-1) */
  overallQuality: number
}

/**
 * Common compression result interface
 */
export interface CommonCompressionResult {
  /** Original input text */
  original: string
  /** Compressed output text */
  compressed: string
  /** Compression ratio (compressed.length / original.length) */
  compressionRatio: number
  /** Quality metrics */
  quality: CommonQualityMetrics
}

// Import CompressionStrategyType for use in this file
import type { CompressionStrategyType as StrategyType } from './adaptive'

/**
 * Strategy recommendation based on content type
 */
export interface StrategyRecommendation {
  /** Recommended strategy */
  strategy: StrategyType
  /** Confidence in recommendation (0-1) */
  confidence: number
  /** Reason for recommendation */
  reason: string
  /** Expected compression ratio */
  expectedRatio: number
  /** Expected quality score */
  expectedQuality: number
}

/**
 * Get strategy recommendation for content without running compression
 *
 * @param text - Text to analyze
 * @returns Strategy recommendation
 */
export function recommendStrategy(text: string): StrategyRecommendation {
  const { AdaptiveCompressor } = require('./adaptive')
  const compressor = new AdaptiveCompressor()
  const analysis = compressor.analyzeContent(text)

  // Determine best strategy based on content
  let strategy: StrategyType = 'llmlingua'
  let confidence = 0.7
  let reason = 'default recommendation for general text'
  let expectedRatio = 0.5
  let expectedQuality = 0.8

  if (analysis.contentType === 'code') {
    strategy = 'minimal'
    confidence = 0.9
    reason = 'code content should not be aggressively compressed'
    expectedRatio = 0.95
    expectedQuality = 0.99
  } else if (analysis.contentType === 'structured') {
    strategy = 'minimal'
    confidence = 0.85
    reason = 'structured data should preserve format'
    expectedRatio = 0.9
    expectedQuality = 0.95
  } else if (analysis.sentenceCount > 20) {
    strategy = 'extractive'
    confidence = 0.8
    reason = 'long document benefits from sentence extraction'
    expectedRatio = 0.4
    expectedQuality = 0.85
  } else if (analysis.contentType === 'prose') {
    strategy = 'llmlingua'
    confidence = 0.85
    reason = 'prose text benefits from token-level compression'
    expectedRatio = 0.35
    expectedQuality = 0.82
  } else if (analysis.complexity > 0.6) {
    strategy = 'hybrid'
    confidence = 0.75
    reason = 'complex content benefits from multi-pass compression'
    expectedRatio = 0.3
    expectedQuality = 0.8
  }

  return {
    strategy,
    confidence,
    reason,
    expectedRatio,
    expectedQuality,
  }
}
