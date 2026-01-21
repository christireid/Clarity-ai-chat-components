/**
 * Basic Text Normalization Utility
 *
 * IMPORTANT: This is NOT a compression engine.
 *
 * This module provides simple whitespace normalization utilities.
 * It achieves only 10-20% size reduction by:
 * - Collapsing multiple whitespace characters to single spaces
 * - Removing redundant punctuation
 * - Trimming leading/trailing whitespace
 *
 * For real compression (2-20x ratios), use:
 * - LLMLinguaCompressor: Statistical token removal based on importance
 * - ExtractiveCompressor: Sentence-level extraction
 * - AdaptiveCompressor: Automatic strategy selection
 *
 * @module basic-engine
 */

/**
 * Configuration for whitespace normalization
 */
export interface NormalizationConfig {
  /** Collapse multiple spaces to single space (default: true) */
  collapseSpaces: boolean
  /** Collapse multiple newlines to single newline (default: false) */
  collapseNewlines: boolean
  /** Remove redundant punctuation like "..." -> "." (default: true) */
  normalizeEllipsis: boolean
  /** Trim leading/trailing whitespace (default: true) */
  trim: boolean
}

/**
 * Result of text normalization
 */
export interface NormalizationResult {
  /** Original input text */
  original: string
  /** Normalized output text */
  normalized: string
  /** Character reduction ratio (normalized.length / original.length) */
  ratio: number
  /** Estimated tokens saved (rough approximation: chars / 4) */
  estimatedTokensSaved: number
  /** Actual operations performed */
  operationsApplied: string[]
}

/**
 * Legacy interface for backward compatibility
 * @deprecated Use NormalizationResult instead
 */
export interface CompressionResult {
  original: string
  compressed: string
  ratio: number
  quality: number
  strategy: string
  tokensSaved: number
}

/**
 * Legacy interface for backward compatibility
 * @deprecated Use NormalizationConfig instead
 */
export interface CompressionConfig {
  targetRatio: number
  qualityThreshold: number
  enableFallback: boolean
}

/**
 * Legacy interface for backward compatibility
 * @deprecated
 */
export interface CompressionStrategy {
  name: string
  compress: (text: string) => Promise<string>
  quality: number
  ratio: number
}

/**
 * Default normalization configuration
 */
const DEFAULT_NORMALIZATION_CONFIG: NormalizationConfig = {
  collapseSpaces: true,
  collapseNewlines: false,
  normalizeEllipsis: true,
  trim: true,
}

/**
 * Normalize whitespace in text
 *
 * This is a simple utility that cleans up whitespace. It does NOT
 * perform semantic compression and typically achieves only 10-20%
 * size reduction on average text.
 *
 * @param text - Input text to normalize
 * @param config - Normalization configuration options
 * @returns Normalized text with operations applied
 *
 * @example
 * ```typescript
 * const result = normalizeWhitespace('Hello    world...');
 * console.log(result.normalized); // 'Hello world.'
 * console.log(result.ratio); // ~0.85 (15% reduction)
 * ```
 */
export function normalizeWhitespace(
  text: string,
  config: Partial<NormalizationConfig> = {}
): NormalizationResult {
  const fullConfig = { ...DEFAULT_NORMALIZATION_CONFIG, ...config }
  const operationsApplied: string[] = []
  let result = text

  if (fullConfig.collapseSpaces) {
    const before = result.length
    result = result.replace(/[ \t]+/g, ' ')
    if (result.length < before) {
      operationsApplied.push('collapsed_spaces')
    }
  }

  if (fullConfig.collapseNewlines) {
    const before = result.length
    result = result.replace(/\n{3,}/g, '\n\n')
    if (result.length < before) {
      operationsApplied.push('collapsed_newlines')
    }
  }

  if (fullConfig.normalizeEllipsis) {
    const before = result.length
    result = result.replace(/\.{2,}/g, '.')
    if (result.length < before) {
      operationsApplied.push('normalized_ellipsis')
    }
  }

  if (fullConfig.trim) {
    const before = result.length
    result = result.trim()
    if (result.length < before) {
      operationsApplied.push('trimmed')
    }
  }

  const ratio = text.length > 0 ? result.length / text.length : 1
  const estimatedTokensSaved = Math.ceil((text.length - result.length) / 4)

  return {
    original: text,
    normalized: result,
    ratio,
    estimatedTokensSaved,
    operationsApplied,
  }
}

/**
 * Normalize whitespace in multiple texts
 *
 * @param texts - Array of texts to normalize
 * @param config - Normalization configuration options
 * @returns Array of normalization results
 */
export function normalizeWhitespaceBatch(
  texts: string[],
  config: Partial<NormalizationConfig> = {}
): NormalizationResult[] {
  return texts.map((text) => normalizeWhitespace(text, config))
}

/**
 * BasicCompressionEngine
 *
 * @deprecated This class provides only whitespace normalization, not compression.
 * Use LLMLinguaCompressor, ExtractiveCompressor, or AdaptiveCompressor for
 * real compression capabilities.
 *
 * This class is maintained for backward compatibility only.
 */
export class BasicCompressionEngine {
  private strategies: Map<string, CompressionStrategy>

  constructor(_config: CompressionConfig) {
    this.strategies = new Map()
    this.initializeStrategies()
  }

  /**
   * @deprecated Use normalizeWhitespace() function instead.
   * This method only performs whitespace normalization, not compression.
   */
  async compress(text: string): Promise<CompressionResult> {
    const result = normalizeWhitespace(text)

    return {
      original: text,
      compressed: result.normalized,
      ratio: result.ratio,
      quality: 0.99, // Normalization preserves essentially all meaning
      strategy: 'whitespace_normalization',
      tokensSaved: result.estimatedTokensSaved,
    }
  }

  private initializeStrategies(): void {
    this.strategies.set('basic', {
      name: 'whitespace_normalization',
      compress: async (text: string) => {
        return normalizeWhitespace(text).normalized
      },
      quality: 0.99,
      ratio: 0.85, // Honest estimate: 10-15% reduction typical
    })
  }
}

/**
 * @deprecated Use normalizeWhitespace() instead
 */
export async function compressText(text: string): Promise<string> {
  return normalizeWhitespace(text).normalized
}

/**
 * @deprecated Use normalizeWhitespaceBatch() instead
 */
export async function compressTextBatch(texts: string[]): Promise<string[]> {
  return normalizeWhitespaceBatch(texts).map((r) => r.normalized)
}
