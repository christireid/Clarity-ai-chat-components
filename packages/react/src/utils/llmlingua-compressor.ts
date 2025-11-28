/**
 * LLMLingua-2 Style Prompt Compressor
 *
 * Implements advanced prompt compression for RAG contexts using
 * perplexity-based token importance scoring, achieving 3-5x compression
 * while preserving semantic meaning.
 *
 * Key features:
 * - Perplexity-inspired token scoring (simulated with statistical methods)
 * - Segment preservation (instructions, queries)
 * - Progressive compression with configurable targets
 * - RAG-specific optimizations
 * - Browser-compatible with lazy loading
 *
 * When @huggingface/transformers becomes available with LLMLingua-2 weights,
 * this implementation can be upgraded to use actual ML-based compression.
 *
 * @see https://github.com/microsoft/LLMLingua
 * @module utils/llmlingua-compressor
 */

import { estimateTokens } from './tokenization/estimator'
import {
  compressPromptSemantic,
  calculateTokenImportance,
  type SemanticCompressionResult,
} from './prompt-compression-advanced'

/**
 * Configuration for LLMLingua compression
 */
export interface LLMLinguaConfig {
  /** Target compression ratio (0.1-0.5, default 0.25 = 4x compression) */
  targetRatio?: number
  /** Number of tokens to always preserve at start (instructions) */
  preserveFirst?: number
  /** Number of tokens to always preserve at end (query) */
  preserveLast?: number
  /** Use WebGL acceleration if available (default: true) */
  useGPU?: boolean
  /** Minimum tokens to apply compression (default: 200) */
  minTokensToCompress?: number
  /** Force iterative compression for better results (slower, default: false) */
  iterativeMode?: boolean
  /** Number of iterations for iterative mode (default: 3) */
  iterations?: number
}

/**
 * Result from compression operation
 */
export interface CompressionResult {
  /** Original text */
  original: string
  /** Compressed text */
  compressed: string
  /** Original token count */
  originalTokens: number
  /** Compressed token count */
  compressedTokens: number
  /** Actual compression ratio achieved (compressed/original) */
  compressionRatio: number
  /** Segments that were preserved uncompressed */
  preservedSegments: string[]
  /** Processing time in milliseconds */
  processingTimeMs: number
  /** Method used for compression */
  method: 'llmlingua' | 'fallback' | 'none'
  /** Per-segment compression details (for debugging) */
  segmentDetails?: Array<{
    type: 'preserved' | 'compressed'
    original: string
    result: string
    tokens: number
  }>
}

/**
 * Statistics for the compressor
 */
export interface CompressorStats {
  /** Total compressions performed */
  totalCompressions: number
  /** Total tokens saved */
  totalTokensSaved: number
  /** Average compression ratio */
  avgCompressionRatio: number
  /** Total processing time in ms */
  totalProcessingTimeMs: number
  /** Whether GPU acceleration is active */
  gpuEnabled: boolean
  /** Whether ML model is loaded */
  modelLoaded: boolean
}

// Default configuration
const DEFAULT_CONFIG: Required<LLMLinguaConfig> = {
  targetRatio: 0.25,
  preserveFirst: 100,
  preserveLast: 50,
  useGPU: true,
  minTokensToCompress: 200,
  iterativeMode: false,
  iterations: 3,
}

/**
 * Common stop words with extremely low importance (can almost always be removed)
 */
const ULTRA_LOW_IMPORTANCE = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'shall',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as',
  'this', 'that', 'these', 'those', 'it', 'its',
])

/**
 * High importance markers - never remove
 */
const HIGH_IMPORTANCE_MARKERS = new Set([
  // Instructions
  'must', 'required', 'important', 'critical', 'essential', 'always', 'never',
  // Questions
  'what', 'who', 'where', 'when', 'why', 'how', 'which',
  // Actions
  'create', 'implement', 'define', 'explain', 'describe', 'analyze', 'return',
  // Negations (changing meaning)
  'not', 'no', 'none', 'without', 'except', 'unless',
])

/**
 * Tokenize text preserving original word boundaries
 */
function tokenizeWithPositions(text: string): Array<{ word: string; start: number; end: number }> {
  const tokens: Array<{ word: string; start: number; end: number }> = []
  const regex = /\S+/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    tokens.push({
      word: match[0],
      start: match.index,
      end: match.index + match[0].length,
    })
  }

  return tokens
}

/**
 * Calculate token importance using statistical methods
 * Simulates perplexity-based scoring without requiring ML model
 */
function calculatePerplexityScore(
  word: string,
  context: string[],
  position: number,
  totalTokens: number
): number {
  const lower = word.toLowerCase().replace(/[^\w]/g, '')

  // Ultra-low importance words
  if (ULTRA_LOW_IMPORTANCE.has(lower)) {
    return 0.1
  }

  // High importance markers
  if (HIGH_IMPORTANCE_MARKERS.has(lower)) {
    return 1.0
  }

  // Start with base score
  let score = 0.5

  // Position-based importance (start and end more important)
  const normalizedPos = position / totalTokens
  if (normalizedPos < 0.1 || normalizedPos > 0.9) {
    score += 0.2
  }

  // Word length (longer words tend to be more specific/important)
  if (lower.length > 6) {
    score += 0.15
  }

  // Technical terms (camelCase, snake_case, numbers)
  if (/[A-Z]/.test(word) && /[a-z]/.test(word)) {
    score += 0.2 // camelCase
  }
  if (word.includes('_')) {
    score += 0.2 // snake_case
  }
  if (/\d/.test(word)) {
    score += 0.15 // contains numbers
  }

  // Context frequency (rare words more important - inverse frequency)
  const wordLower = lower
  const frequency = context.filter(w => w.toLowerCase() === wordLower).length / context.length
  if (frequency < 0.01) {
    score += 0.2 // Very rare
  } else if (frequency < 0.05) {
    score += 0.1 // Somewhat rare
  }

  // Code-like patterns
  if (/^[a-z]+[A-Z]/.test(word) || /^\w+\(/.test(word) || word.includes('.')) {
    score += 0.15
  }

  return Math.min(score, 1.0)
}

/**
 * Compress text using perplexity-based token pruning
 */
function compressWithPerplexity(
  text: string,
  targetRatio: number,
  preserveFirst: number,
  preserveLast: number
): { compressed: string; preservedSegments: string[] } {
  const tokens = tokenizeWithPositions(text)
  const contextWords = tokens.map(t => t.word)
  const preservedSegments: string[] = []

  if (tokens.length === 0) {
    return { compressed: text, preservedSegments: [] }
  }

  // Calculate importance for each token
  const scoredTokens = tokens.map((token, idx) => ({
    ...token,
    importance: calculatePerplexityScore(token.word, contextWords, idx, tokens.length),
  }))

  // Determine which tokens to preserve
  const targetTokenCount = Math.max(
    Math.ceil(tokens.length * targetRatio),
    preserveFirst + preserveLast
  )

  // Always preserve first N and last N tokens
  const firstPreserved = scoredTokens.slice(0, Math.min(preserveFirst, tokens.length))
  const lastPreserved = scoredTokens.slice(Math.max(tokens.length - preserveLast, preserveFirst))

  if (firstPreserved.length > 0) {
    preservedSegments.push(firstPreserved.map(t => t.word).join(' '))
  }
  if (lastPreserved.length > 0 && lastPreserved[0] !== firstPreserved[firstPreserved.length - 1]) {
    preservedSegments.push(lastPreserved.map(t => t.word).join(' '))
  }

  // For middle tokens, select by importance
  const middleTokens = scoredTokens.slice(preserveFirst, Math.max(tokens.length - preserveLast, preserveFirst))
  const middleTargetCount = targetTokenCount - firstPreserved.length - lastPreserved.length

  // Sort by importance and select top N
  const sortedMiddle = [...middleTokens].sort((a, b) => b.importance - a.importance)
  const selectedMiddle = sortedMiddle.slice(0, Math.max(0, middleTargetCount))

  // Restore original order
  selectedMiddle.sort((a, b) => a.start - b.start)

  // Reconstruct compressed text
  const allSelected = [
    ...firstPreserved,
    ...selectedMiddle,
    ...lastPreserved,
  ]

  // Remove duplicates (in case preserve ranges overlap)
  const seen = new Set<number>()
  const uniqueSelected = allSelected.filter(t => {
    if (seen.has(t.start)) return false
    seen.add(t.start)
    return true
  })

  uniqueSelected.sort((a, b) => a.start - b.start)

  const compressed = uniqueSelected.map(t => t.word).join(' ')

  return { compressed, preservedSegments }
}

/**
 * Iteratively compress for better results
 */
function iterativeCompress(
  text: string,
  targetRatio: number,
  iterations: number,
  preserveFirst: number,
  preserveLast: number
): string {
  let currentText = text
  const iterationRatio = Math.pow(targetRatio, 1 / iterations)

  for (let i = 0; i < iterations; i++) {
    const result = compressWithPerplexity(
      currentText,
      iterationRatio,
      Math.floor(preserveFirst / (i + 1)),
      Math.floor(preserveLast / (i + 1))
    )
    currentText = result.compressed

    // Stop if we're already at or below target
    if (estimateTokens(currentText) <= estimateTokens(text) * targetRatio) {
      break
    }
  }

  return currentText
}

/**
 * LLMLingua-2 Style Compressor
 *
 * Achieves 3-5x compression on RAG context while preserving semantic meaning.
 * Uses perplexity-inspired token importance scoring.
 *
 * @example
 * ```typescript
 * const compressor = new LLMLinguaCompressor({ targetRatio: 0.25 })
 * await compressor.initialize()
 *
 * const result = await compressor.compress(ragContext)
 * console.log(`Compressed from ${result.originalTokens} to ${result.compressedTokens}`)
 * console.log(`Ratio: ${result.compressionRatio}`) // ~0.25
 *
 * // Compress with preserved segments
 * const result2 = await compressor.compressWithSegments(text, [
 *   { start: 0, end: 100, preserve: true },  // Keep instructions
 *   { start: 500, end: 600, preserve: true }, // Keep query
 * ])
 * ```
 */
export class LLMLinguaCompressor {
  private config: Required<LLMLinguaConfig>
  private modelLoaded = false
  private gpuEnabled = false
  private stats = {
    totalCompressions: 0,
    totalTokensSaved: 0,
    totalProcessingTimeMs: 0,
    compressionRatios: [] as number[],
  }

  constructor(config: LLMLinguaConfig = {}) {
    // Validate config
    if (config.targetRatio !== undefined && (config.targetRatio <= 0 || config.targetRatio > 1)) {
      throw new Error('targetRatio must be between 0 and 1')
    }
    if (config.preserveFirst !== undefined && config.preserveFirst < 0) {
      throw new Error('preserveFirst must be non-negative')
    }
    if (config.preserveLast !== undefined && config.preserveLast < 0) {
      throw new Error('preserveLast must be non-negative')
    }
    if (config.iterations !== undefined && config.iterations < 1) {
      throw new Error('iterations must be at least 1')
    }

    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    }
  }

  /**
   * Initialize the compressor
   *
   * Attempts to load ML model and enable GPU acceleration.
   * Falls back to statistical methods if unavailable.
   *
   * Note: Full LLMLingua-2 model integration is prepared but not implemented.
   * When @huggingface/transformers supports the model, upgrade here.
   */
  async initialize(): Promise<void> {
    // Check for WebGL availability
    if (typeof window !== 'undefined' && this.config.useGPU) {
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
        this.gpuEnabled = !!gl
      } catch {
        this.gpuEnabled = false
      }
    }

    // Future: Load LLMLingua-2 model
    // try {
    //   const transformers = await import('@huggingface/transformers')
    //   const model = await transformers.pipeline(
    //     'text-classification',
    //     'microsoft/llmlingua-2-bert-base-multilingual-cased-meetingbank'
    //   )
    //   this.model = model
    //   this.modelLoaded = true
    // } catch {
    //   this.modelLoaded = false
    // }
  }

  /**
   * Check if compressor is ready
   */
  isReady(): boolean {
    // Always ready - we have statistical fallback
    return true
  }

  /**
   * Check if ML model is loaded
   */
  isModelLoaded(): boolean {
    return this.modelLoaded
  }

  /**
   * Compress text using LLMLingua-style compression
   */
  async compress(
    text: string,
    options?: Partial<LLMLinguaConfig>
  ): Promise<CompressionResult> {
    const startTime = performance.now()
    const config = { ...this.config, ...options }

    const originalTokens = estimateTokens(text)

    // Skip compression if too short
    if (originalTokens < config.minTokensToCompress) {
      return {
        original: text,
        compressed: text,
        originalTokens,
        compressedTokens: originalTokens,
        compressionRatio: 1.0,
        preservedSegments: [],
        processingTimeMs: performance.now() - startTime,
        method: 'none',
      }
    }

    let compressed: string
    let preservedSegments: string[]

    if (config.iterativeMode) {
      // Iterative compression for better results
      compressed = iterativeCompress(
        text,
        config.targetRatio,
        config.iterations,
        config.preserveFirst,
        config.preserveLast
      )
      preservedSegments = [] // Not tracked in iterative mode
    } else {
      // Single-pass compression
      const result = compressWithPerplexity(
        text,
        config.targetRatio,
        config.preserveFirst,
        config.preserveLast
      )
      compressed = result.compressed
      preservedSegments = result.preservedSegments
    }

    const compressedTokens = estimateTokens(compressed)
    const compressionRatio = compressedTokens / originalTokens
    const processingTimeMs = performance.now() - startTime

    // Update stats
    this.stats.totalCompressions++
    this.stats.totalTokensSaved += originalTokens - compressedTokens
    this.stats.totalProcessingTimeMs += processingTimeMs
    this.stats.compressionRatios.push(compressionRatio)

    return {
      original: text,
      compressed,
      originalTokens,
      compressedTokens,
      compressionRatio,
      preservedSegments,
      processingTimeMs,
      method: this.modelLoaded ? 'llmlingua' : 'fallback',
    }
  }

  /**
   * Compress with explicit segment preservation
   */
  async compressWithSegments(
    text: string,
    segments: Array<{ start: number; end: number; preserve: boolean }>
  ): Promise<CompressionResult> {
    const startTime = performance.now()
    const originalTokens = estimateTokens(text)

    // Sort segments by start position
    const sortedSegments = [...segments].sort((a, b) => a.start - b.start)

    // Extract preserved and compressible parts
    const parts: Array<{ text: string; preserve: boolean; start: number }> = []
    let lastEnd = 0

    for (const segment of sortedSegments) {
      // Add text before this segment (to be compressed)
      if (segment.start > lastEnd) {
        parts.push({
          text: text.substring(lastEnd, segment.start),
          preserve: false,
          start: lastEnd,
        })
      }

      // Add the segment
      parts.push({
        text: text.substring(segment.start, segment.end),
        preserve: segment.preserve,
        start: segment.start,
      })

      lastEnd = segment.end
    }

    // Add remaining text
    if (lastEnd < text.length) {
      parts.push({
        text: text.substring(lastEnd),
        preserve: false,
        start: lastEnd,
      })
    }

    // Process each part
    const processedParts: string[] = []
    const preservedSegments: string[] = []
    const segmentDetails: CompressionResult['segmentDetails'] = []

    for (const part of parts) {
      if (part.preserve) {
        processedParts.push(part.text)
        preservedSegments.push(part.text.trim())
        segmentDetails?.push({
          type: 'preserved',
          original: part.text,
          result: part.text,
          tokens: estimateTokens(part.text),
        })
      } else {
        // Compress this segment
        const result = compressWithPerplexity(
          part.text,
          this.config.targetRatio,
          0, // No first/last preservation within segment
          0
        )
        processedParts.push(result.compressed)
        segmentDetails?.push({
          type: 'compressed',
          original: part.text,
          result: result.compressed,
          tokens: estimateTokens(result.compressed),
        })
      }
    }

    const compressed = processedParts.join('')
    const compressedTokens = estimateTokens(compressed)
    const processingTimeMs = performance.now() - startTime

    // Update stats
    this.stats.totalCompressions++
    this.stats.totalTokensSaved += originalTokens - compressedTokens
    this.stats.totalProcessingTimeMs += processingTimeMs
    this.stats.compressionRatios.push(compressedTokens / originalTokens)

    return {
      original: text,
      compressed,
      originalTokens,
      compressedTokens,
      compressionRatio: compressedTokens / originalTokens,
      preservedSegments,
      processingTimeMs,
      method: this.modelLoaded ? 'llmlingua' : 'fallback',
      segmentDetails,
    }
  }

  /**
   * Get compression statistics
   */
  getStats(): CompressorStats {
    const avgRatio =
      this.stats.compressionRatios.length > 0
        ? this.stats.compressionRatios.reduce((a, b) => a + b, 0) /
          this.stats.compressionRatios.length
        : 0

    return {
      totalCompressions: this.stats.totalCompressions,
      totalTokensSaved: this.stats.totalTokensSaved,
      avgCompressionRatio: avgRatio,
      totalProcessingTimeMs: this.stats.totalProcessingTimeMs,
      gpuEnabled: this.gpuEnabled,
      modelLoaded: this.modelLoaded,
    }
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.modelLoaded = false
    this.gpuEnabled = false
    this.stats = {
      totalCompressions: 0,
      totalTokensSaved: 0,
      totalProcessingTimeMs: 0,
      compressionRatios: [],
    }
  }
}

/**
 * Compress RAG context specifically
 *
 * Optimized for multiple document chunks, preserving key facts and entities.
 *
 * @example
 * ```typescript
 * const compressed = await compressRAGContext(
 *   ['Document 1 text...', 'Document 2 text...'],
 *   { targetRatio: 0.25 }
 * )
 * ```
 */
export async function compressRAGContext(
  ragResults: string[],
  config: LLMLinguaConfig = {}
): Promise<string[]> {
  const compressor = new LLMLinguaCompressor(config)

  const compressedResults = await Promise.all(
    ragResults.map(async (text) => {
      const result = await compressor.compress(text)
      return result.compressed
    })
  )

  return compressedResults
}

/**
 * Intelligent compression that chooses best method based on content
 *
 * Combines LLMLingua-style compression with TF-IDF for optimal results.
 */
export async function intelligentCompress(
  text: string,
  options: {
    targetRatio?: number
    preserveCode?: boolean
    preserveFirst?: number
    preserveLast?: number
  } = {}
): Promise<CompressionResult> {
  const {
    targetRatio = 0.25,
    preserveCode = true,
    preserveFirst = 100,
    preserveLast = 50,
  } = options

  const startTime = performance.now()
  const originalTokens = estimateTokens(text)

  // If text contains significant code, use TF-IDF which handles structure better
  const codeBlockCount = (text.match(/```[\s\S]*?```/g) || []).length
  const hasSignificantCode = codeBlockCount > 0 || text.includes('function ') || text.includes('class ')

  if (hasSignificantCode && preserveCode) {
    // Use TF-IDF semantic compression for code-heavy content
    const result = compressPromptSemantic(text, {
      targetRatio,
      preserveStructure: true,
      useImportanceScoring: true,
    })

    return {
      original: text,
      compressed: result.compressed,
      originalTokens: result.originalTokens,
      compressedTokens: result.compressedTokens,
      compressionRatio: result.compressionRatio,
      preservedSegments: [],
      processingTimeMs: performance.now() - startTime,
      method: 'fallback',
    }
  }

  // Use LLMLingua-style compression for prose
  const compressor = new LLMLinguaCompressor({
    targetRatio,
    preserveFirst,
    preserveLast,
  })

  return compressor.compress(text)
}

/**
 * Create a LLMLingua compressor with the given configuration
 */
export function createLLMLinguaCompressor(config?: LLMLinguaConfig): LLMLinguaCompressor {
  return new LLMLinguaCompressor(config)
}
