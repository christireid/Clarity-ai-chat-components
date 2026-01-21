/**
 * Adaptive Compression Strategy Selection
 *
 * Automatically selects the best compression strategy based on content analysis.
 * Considers factors like:
 *
 * - Content type (prose, code, mixed, structured data)
 * - Text length
 * - Target compression ratio
 * - Quality requirements
 * - Processing time constraints
 *
 * Strategies available:
 * - LLMLingua: Best for prose text, achieves high compression with semantic preservation
 * - Extractive: Best for long documents, preserves sentence-level coherence
 * - Hybrid: Combines multiple strategies for optimal results
 *
 * @module adaptive
 */

import {
  LLMLinguaCompressor,
  type LLMLinguaOptions,
  type LLMLinguaResult,
} from './llmlingua'
import {
  ExtractiveCompressor,
  type ExtractiveOptions,
  type ExtractiveResult,
} from './extractive'

/**
 * Options for adaptive compression
 */
export interface AdaptiveOptions {
  /** Target compression ratio (0.1-1.0), lower = more aggressive */
  targetRatio?: number
  /** Minimum acceptable quality (0-1) */
  minQuality?: number
  /** Maximum processing time in milliseconds */
  maxProcessingTime?: number
  /** Preferred strategy (will be used if suitable for content) */
  preferredStrategy?: CompressionStrategyType
  /** Force a specific strategy regardless of content analysis */
  forceStrategy?: CompressionStrategyType
  /** LLMLingua-specific options */
  llmlinguaOptions?: Partial<LLMLinguaOptions>
  /** Extractive-specific options */
  extractiveOptions?: Partial<ExtractiveOptions>
  /** Enable debug output */
  debug?: boolean
}

/**
 * Available compression strategy types
 */
export type CompressionStrategyType =
  | 'llmlingua'
  | 'extractive'
  | 'hybrid'
  | 'minimal'

/**
 * Result of adaptive compression
 */
export interface AdaptiveResult {
  /** Original input text */
  original: string
  /** Compressed output text */
  compressed: string
  /** Compression ratio achieved */
  compressionRatio: number
  /** Strategy that was used */
  strategyUsed: CompressionStrategyType
  /** Why this strategy was selected */
  strategyReason: string
  /** Quality metrics */
  quality: AdaptiveQualityMetrics
  /** Content analysis results */
  contentAnalysis: ContentAnalysis
  /** Processing time in milliseconds */
  processingTimeMs: number
  /** Debug information if enabled */
  debug?: AdaptiveDebugInfo
}

/**
 * Quality metrics for adaptive compression
 */
export interface AdaptiveQualityMetrics {
  /** Semantic similarity (0-1) */
  semanticSimilarity?: number
  /** Key term retention (0-1) */
  keyTermRetention: number
  /** Sentence retention (0-1) for extractive */
  sentenceRetention?: number
  /** Overall quality score (0-1) */
  overallQuality: number
}

/**
 * Content analysis results
 */
export interface ContentAnalysis {
  /** Detected content type */
  contentType: ContentType
  /** Confidence in content type detection (0-1) */
  typeConfidence: number
  /** Text length in characters */
  length: number
  /** Estimated token count */
  estimatedTokens: number
  /** Number of sentences */
  sentenceCount: number
  /** Average sentence length */
  avgSentenceLength: number
  /** Percentage of text that is code */
  codePercentage: number
  /** Complexity score (0-1) */
  complexity: number
  /** Has structured data (JSON, XML, etc.) */
  hasStructuredData: boolean
  /** Detected language features */
  languageFeatures: LanguageFeatures
}

/**
 * Content type categories
 */
export type ContentType =
  | 'prose' // Natural language text
  | 'code' // Programming code
  | 'mixed' // Mix of prose and code
  | 'structured' // JSON, XML, YAML, etc.
  | 'conversational' // Chat/dialogue format
  | 'technical' // Technical documentation
  | 'list' // Lists and enumerations

/**
 * Detected language features
 */
export interface LanguageFeatures {
  /** Contains questions */
  hasQuestions: boolean
  /** Contains instructions/commands */
  hasInstructions: boolean
  /** Contains code blocks */
  hasCodeBlocks: boolean
  /** Contains bullet points or numbered lists */
  hasLists: boolean
  /** Contains headers/sections */
  hasSections: boolean
  /** Contains JSON data */
  hasJson: boolean
  /** Contains XML/HTML */
  hasXml: boolean
}

/**
 * Debug information
 */
export interface AdaptiveDebugInfo {
  /** All strategies considered */
  strategiesConsidered: Array<{
    strategy: CompressionStrategyType
    score: number
    reason: string
  }>
  /** Analysis timing breakdown */
  timing: {
    analysisMs: number
    compressionMs: number
    totalMs: number
  }
  /** Raw strategy result */
  strategyResult: LLMLinguaResult | ExtractiveResult
}

/**
 * Strategy scoring for selection
 */
interface StrategyScore {
  strategy: CompressionStrategyType
  score: number
  reason: string
}

/**
 * Adaptive compressor that automatically selects the best strategy.
 *
 * @example
 * ```typescript
 * const compressor = new AdaptiveCompressor();
 *
 * // Let it choose the best strategy
 * const result = await compressor.compress(text);
 * console.log(`Used strategy: ${result.strategyUsed}`);
 * console.log(`Reason: ${result.strategyReason}`);
 *
 * // With custom options
 * const result2 = await compressor.compress(text, {
 *   targetRatio: 0.3,
 *   minQuality: 0.8,
 *   preferredStrategy: 'extractive'
 * });
 * ```
 */
export class AdaptiveCompressor {
  private readonly llmlinguaCompressor: LLMLinguaCompressor
  private readonly extractiveCompressor: ExtractiveCompressor
  private readonly defaultOptions: AdaptiveOptions

  /**
   * Create a new adaptive compressor
   *
   * @param defaultOptions - Default options for all compressions
   */
  constructor(defaultOptions: Partial<AdaptiveOptions> = {}) {
    this.defaultOptions = {
      targetRatio: 0.5,
      minQuality: 0.7,
      maxProcessingTime: 5000,
      ...defaultOptions,
    }

    this.llmlinguaCompressor = new LLMLinguaCompressor(
      defaultOptions.llmlinguaOptions
    )
    this.extractiveCompressor = new ExtractiveCompressor(
      defaultOptions.extractiveOptions
    )
  }

  /**
   * Compress text using automatically selected strategy
   *
   * @param text - Input text to compress
   * @param options - Compression options
   * @returns Compression result with strategy information
   */
  async compress(
    text: string,
    options?: AdaptiveOptions
  ): Promise<AdaptiveResult> {
    const startTime = Date.now()
    const opts = { ...this.defaultOptions, ...options }

    // Handle edge cases
    if (!text || text.trim().length === 0) {
      return this.createEmptyResult(text, Date.now() - startTime)
    }

    // Analyze content
    const analysisStart = Date.now()
    const contentAnalysis = this.analyzeContent(text)
    const analysisTime = Date.now() - analysisStart

    // Select strategy
    const strategy: StrategyScore = opts.forceStrategy
      ? {
          strategy: opts.forceStrategy,
          score: 1.0,
          reason: 'forced by options',
        }
      : this.selectStrategy(contentAnalysis, opts)

    // Apply compression
    const compressionStart = Date.now()
    const result = await this.applyStrategy(
      text,
      strategy.strategy,
      contentAnalysis,
      opts
    )
    const compressionTime = Date.now() - compressionStart

    const totalTime = Date.now() - startTime

    const adaptiveResult: AdaptiveResult = {
      original: text,
      compressed: result.compressed,
      compressionRatio: result.compressionRatio,
      strategyUsed: strategy.strategy,
      strategyReason: strategy.reason,
      quality: result.quality,
      contentAnalysis,
      processingTimeMs: totalTime,
    }

    if (opts.debug) {
      adaptiveResult.debug = {
        strategiesConsidered: this.getAllStrategyScores(contentAnalysis, opts),
        timing: {
          analysisMs: analysisTime,
          compressionMs: compressionTime,
          totalMs: totalTime,
        },
        strategyResult: result.rawResult,
      }
    }

    return adaptiveResult
  }

  /**
   * Analyze content to determine characteristics
   */
  analyzeContent(text: string): ContentAnalysis {
    const length = text.length
    const estimatedTokens = Math.ceil(length / 4)

    // Split into sentences
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const sentenceCount = sentences.length
    const avgSentenceLength = length / Math.max(sentenceCount, 1)

    // Detect code
    const codeBlockMatches = text.match(/```[\s\S]*?```/g) || []
    const inlineCodeMatches = text.match(/`[^`]+`/g) || []
    const codeLength =
      codeBlockMatches.reduce((sum, m) => sum + m.length, 0) +
      inlineCodeMatches.reduce((sum, m) => sum + m.length, 0)
    const codePercentage = codeLength / Math.max(length, 1)

    // Detect language features
    const languageFeatures = this.detectLanguageFeatures(text)

    // Detect structured data
    const hasStructuredData =
      languageFeatures.hasJson || languageFeatures.hasXml || this.hasYaml(text)

    // Calculate complexity
    const complexity = this.calculateComplexity(text, sentenceCount)

    // Determine content type
    const { contentType, typeConfidence } = this.determineContentType(
      text,
      codePercentage,
      hasStructuredData,
      languageFeatures
    )

    return {
      contentType,
      typeConfidence,
      length,
      estimatedTokens,
      sentenceCount,
      avgSentenceLength,
      codePercentage,
      complexity,
      hasStructuredData,
      languageFeatures,
    }
  }

  /**
   * Detect language features in text
   */
  private detectLanguageFeatures(text: string): LanguageFeatures {
    return {
      hasQuestions: /\?/.test(text),
      hasInstructions:
        /\b(must|shall|should|need|ensure|always|never|do not|don't)\b/i.test(
          text
        ),
      hasCodeBlocks: /```[\s\S]*?```/.test(text),
      hasLists: /^[\s]*[-*•]\s|^\s*\d+\.\s/m.test(text),
      hasSections: /^#+\s|^[A-Z][^.]*:\s*$/m.test(text),
      hasJson: /\{[\s\S]*"[^"]+"\s*:/.test(text),
      hasXml: /<[a-zA-Z][^>]*>/.test(text),
    }
  }

  /**
   * Check for YAML content
   */
  private hasYaml(text: string): boolean {
    // Simple YAML detection
    return /^[a-zA-Z_][a-zA-Z0-9_]*:\s*\S/m.test(text) && !text.includes('{')
  }

  /**
   * Calculate text complexity
   */
  private calculateComplexity(text: string, sentenceCount: number): number {
    const words = text.split(/\s+/)
    const wordCount = words.length
    const avgWordLength =
      words.reduce((sum, w) => sum + w.length, 0) / Math.max(wordCount, 1)
    const wordsPerSentence = wordCount / Math.max(sentenceCount, 1)

    // Complexity based on word length and sentence length
    let complexity = 0

    // Long words indicate complexity
    if (avgWordLength > 6) complexity += 0.3
    else if (avgWordLength > 5) complexity += 0.2

    // Long sentences indicate complexity
    if (wordsPerSentence > 25) complexity += 0.4
    else if (wordsPerSentence > 15) complexity += 0.2

    // Technical terms
    const technicalTerms = (
      text.match(
        /\b[A-Z][a-z]+(?:[A-Z][a-z]+)+\b|\b[a-z]+_[a-z]+\b|\b[A-Z]{2,}\b/g
      ) || []
    ).length
    if (technicalTerms > 10) complexity += 0.2
    else if (technicalTerms > 5) complexity += 0.1

    return Math.min(1.0, complexity)
  }

  /**
   * Determine content type from analysis
   */
  private determineContentType(
    text: string,
    codePercentage: number,
    hasStructuredData: boolean,
    features: LanguageFeatures
  ): { contentType: ContentType; typeConfidence: number } {
    // Structured data check
    if (hasStructuredData && (features.hasJson || features.hasXml)) {
      return { contentType: 'structured', typeConfidence: 0.9 }
    }

    // Code check
    if (codePercentage > 0.7) {
      return { contentType: 'code', typeConfidence: 0.9 }
    }
    if (codePercentage > 0.3) {
      return { contentType: 'mixed', typeConfidence: 0.8 }
    }

    // List check
    if (features.hasLists) {
      const listLines = (text.match(/^[\s]*[-*•]\s|^\s*\d+\.\s/gm) || []).length
      const totalLines = text.split('\n').length
      if (listLines / totalLines > 0.5) {
        return { contentType: 'list', typeConfidence: 0.8 }
      }
    }

    // Conversational check
    const conversationalPatterns = [
      /^(User|Assistant|Human|AI|Q|A):/im,
      /^"[^"]+"\s*$/m,
      /^>\s/m,
    ]
    const isConversational = conversationalPatterns.some((p) => p.test(text))
    if (isConversational) {
      return { contentType: 'conversational', typeConfidence: 0.7 }
    }

    // Technical documentation check
    if (features.hasSections && features.hasCodeBlocks) {
      return { contentType: 'technical', typeConfidence: 0.7 }
    }

    // Default to prose
    return { contentType: 'prose', typeConfidence: 0.6 }
  }

  /**
   * Select the best compression strategy
   */
  private selectStrategy(
    analysis: ContentAnalysis,
    opts: AdaptiveOptions
  ): StrategyScore {
    const scores = this.getAllStrategyScores(analysis, opts)

    // Check preferred strategy
    if (opts.preferredStrategy) {
      const preferred = scores.find(
        (s) => s.strategy === opts.preferredStrategy
      )
      if (preferred && preferred.score > 0.5) {
        return preferred
      }
    }

    // Return highest scoring strategy
    return scores[0]
  }

  /**
   * Get scores for all strategies
   */
  private getAllStrategyScores(
    analysis: ContentAnalysis,
    opts: AdaptiveOptions
  ): StrategyScore[] {
    const scores: StrategyScore[] = []

    // LLMLingua scoring
    const llmlinguaScore = this.scoreLLMLingua(analysis, opts)
    scores.push({
      strategy: 'llmlingua',
      score: llmlinguaScore.score,
      reason: llmlinguaScore.reason,
    })

    // Extractive scoring
    const extractiveScore = this.scoreExtractive(analysis, opts)
    scores.push({
      strategy: 'extractive',
      score: extractiveScore.score,
      reason: extractiveScore.reason,
    })

    // Hybrid scoring
    const hybridScore = this.scoreHybrid(analysis, opts)
    scores.push({
      strategy: 'hybrid',
      score: hybridScore.score,
      reason: hybridScore.reason,
    })

    // Minimal scoring
    const minimalScore = this.scoreMinimal(analysis, opts)
    scores.push({
      strategy: 'minimal',
      score: minimalScore.score,
      reason: minimalScore.reason,
    })

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score)

    return scores
  }

  /**
   * Score LLMLingua strategy for this content
   */
  private scoreLLMLingua(
    analysis: ContentAnalysis,
    opts: AdaptiveOptions
  ): { score: number; reason: string } {
    let score = 0.5
    const reasons: string[] = []

    // Good for prose
    if (analysis.contentType === 'prose') {
      score += 0.3
      reasons.push('prose content')
    }

    // Good for mixed content
    if (analysis.contentType === 'mixed') {
      score += 0.2
      reasons.push('mixed content')
    }

    // Good for medium-length text
    if (analysis.estimatedTokens >= 100 && analysis.estimatedTokens <= 5000) {
      score += 0.2
      reasons.push('optimal length')
    }

    // Good for aggressive compression
    if ((opts.targetRatio || 0.5) < 0.4) {
      score += 0.2
      reasons.push('aggressive compression target')
    }

    // Less good for structured data
    if (analysis.hasStructuredData) {
      score -= 0.3
      reasons.push('structured data present')
    }

    // Less good for pure code
    if (analysis.contentType === 'code') {
      score -= 0.4
      reasons.push('code content')
    }

    return {
      score: Math.max(0, Math.min(1, score)),
      reason:
        reasons.length > 0 ? reasons.join(', ') : 'default token compression',
    }
  }

  /**
   * Score extractive strategy for this content
   */
  private scoreExtractive(
    analysis: ContentAnalysis,
    opts: AdaptiveOptions
  ): { score: number; reason: string } {
    let score = 0.4
    const reasons: string[] = []

    // Good for long documents
    if (analysis.sentenceCount > 20) {
      score += 0.3
      reasons.push('many sentences')
    }

    // Good for prose and technical docs
    if (
      analysis.contentType === 'prose' ||
      analysis.contentType === 'technical'
    ) {
      score += 0.2
      reasons.push(`${analysis.contentType} content`)
    }

    // Good for moderate compression
    if ((opts.targetRatio || 0.5) >= 0.3 && (opts.targetRatio || 0.5) <= 0.7) {
      score += 0.1
      reasons.push('moderate compression target')
    }

    // Good when quality is important
    if ((opts.minQuality || 0.7) > 0.8) {
      score += 0.2
      reasons.push('high quality requirement')
    }

    // Less good for short text
    if (analysis.sentenceCount < 5) {
      score -= 0.3
      reasons.push('too few sentences')
    }

    // Less good for lists
    if (analysis.contentType === 'list') {
      score -= 0.2
      reasons.push('list content')
    }

    return {
      score: Math.max(0, Math.min(1, score)),
      reason:
        reasons.length > 0 ? reasons.join(', ') : 'default sentence extraction',
    }
  }

  /**
   * Score hybrid strategy for this content
   */
  private scoreHybrid(
    analysis: ContentAnalysis,
    opts: AdaptiveOptions
  ): { score: number; reason: string } {
    let score = 0.3
    const reasons: string[] = []

    // Good for complex content
    if (analysis.complexity > 0.6) {
      score += 0.3
      reasons.push('complex content')
    }

    // Good for mixed content
    if (analysis.contentType === 'mixed') {
      score += 0.3
      reasons.push('mixed content types')
    }

    // Good for very long documents
    if (analysis.estimatedTokens > 5000) {
      score += 0.2
      reasons.push('very long document')
    }

    // Good when quality is critical
    if ((opts.minQuality || 0.7) > 0.85) {
      score += 0.2
      reasons.push('very high quality requirement')
    }

    // Penalize if time is constrained
    if ((opts.maxProcessingTime || 5000) < 1000) {
      score -= 0.3
      reasons.push('time constrained')
    }

    return {
      score: Math.max(0, Math.min(1, score)),
      reason:
        reasons.length > 0
          ? reasons.join(', ')
          : 'default multi-strategy approach',
    }
  }

  /**
   * Score minimal strategy
   */
  private scoreMinimal(
    analysis: ContentAnalysis,
    opts: AdaptiveOptions
  ): { score: number; reason: string } {
    let score = 0.2
    const reasons: string[] = []

    // Good for very short text
    if (analysis.estimatedTokens < 50) {
      score += 0.4
      reasons.push('very short text')
    }

    // Good for structured data
    if (analysis.hasStructuredData) {
      score += 0.3
      reasons.push('structured data')
    }

    // Good for code
    if (analysis.contentType === 'code') {
      score += 0.3
      reasons.push('code content')
    }

    // Good for very conservative compression
    if ((opts.targetRatio || 0.5) > 0.8) {
      score += 0.2
      reasons.push('conservative compression target')
    }

    return {
      score: Math.max(0, Math.min(1, score)),
      reason:
        reasons.length > 0
          ? reasons.join(', ')
          : 'default whitespace normalization',
    }
  }

  /**
   * Apply the selected compression strategy
   */
  private async applyStrategy(
    text: string,
    strategy: CompressionStrategyType,
    analysis: ContentAnalysis,
    opts: AdaptiveOptions
  ): Promise<{
    compressed: string
    compressionRatio: number
    quality: AdaptiveQualityMetrics
    rawResult: LLMLinguaResult | ExtractiveResult
  }> {
    const targetRatio = opts.targetRatio || 0.5

    switch (strategy) {
      case 'llmlingua': {
        const result = await this.llmlinguaCompressor.compress(
          text,
          targetRatio,
          {
            ...opts.llmlinguaOptions,
            preserveCode: analysis.codePercentage > 0.1,
            preserveInstructions: analysis.languageFeatures.hasInstructions,
          }
        )
        return {
          compressed: result.compressed,
          compressionRatio: result.compressionRatio,
          quality: {
            semanticSimilarity: result.quality.semanticSimilarity,
            keyTermRetention: result.quality.keyTermRetention,
            overallQuality: result.quality.overallQuality,
          },
          rawResult: result,
        }
      }

      case 'extractive': {
        const result = this.extractiveCompressor.compress(text, targetRatio, {
          ...opts.extractiveOptions,
          boostInstructions: analysis.languageFeatures.hasInstructions,
          boostQuestions: analysis.languageFeatures.hasQuestions,
        })
        return {
          compressed: result.compressed,
          compressionRatio: result.compressionRatio,
          quality: {
            keyTermRetention: result.quality.keyTermRetention,
            sentenceRetention: result.quality.sentenceRetention,
            overallQuality: result.quality.overallQuality,
          },
          rawResult: result,
        }
      }

      case 'hybrid': {
        // First pass: extractive to reduce sentences
        const extractiveResult = this.extractiveCompressor.compress(
          text,
          Math.min(0.7, targetRatio * 1.5),
          opts.extractiveOptions
        )

        // Second pass: LLMLingua on the extracted text
        const finalResult = await this.llmlinguaCompressor.compress(
          extractiveResult.compressed,
          targetRatio / extractiveResult.compressionRatio,
          opts.llmlinguaOptions
        )

        const combinedRatio =
          extractiveResult.compressionRatio * finalResult.compressionRatio

        return {
          compressed: finalResult.compressed,
          compressionRatio: combinedRatio,
          quality: {
            semanticSimilarity: finalResult.quality.semanticSimilarity,
            keyTermRetention: Math.min(
              extractiveResult.quality.keyTermRetention,
              finalResult.quality.keyTermRetention
            ),
            sentenceRetention: extractiveResult.quality.sentenceRetention,
            overallQuality:
              (extractiveResult.quality.overallQuality +
                finalResult.quality.overallQuality) /
              2,
          },
          rawResult: finalResult,
        }
      }

      case 'minimal':
      default: {
        // Minimal compression - just whitespace normalization
        const compressed = text.replace(/\s+/g, ' ').trim()
        const compressionRatio = compressed.length / text.length

        // Create a minimal result
        const minimalResult: LLMLinguaResult = {
          original: text,
          compressed,
          compressionRatio,
          originalTokens: Math.ceil(text.length / 4),
          compressedTokens: Math.ceil(compressed.length / 4),
          tokenReductionRatio: compressed.length / text.length,
          quality: {
            semanticSimilarity: 0.99,
            keyTermRetention: 1.0,
            instructionRetention: 1.0,
            overallQuality: 0.99,
          },
        }

        return {
          compressed,
          compressionRatio,
          quality: {
            keyTermRetention: 1.0,
            overallQuality: 0.99,
          },
          rawResult: minimalResult,
        }
      }
    }
  }

  /**
   * Create empty result for edge cases
   */
  private createEmptyResult(
    text: string,
    processingTimeMs: number
  ): AdaptiveResult {
    return {
      original: text,
      compressed: text,
      compressionRatio: 1,
      strategyUsed: 'minimal',
      strategyReason: 'empty or whitespace-only input',
      quality: {
        keyTermRetention: 1,
        overallQuality: 1,
      },
      contentAnalysis: {
        contentType: 'prose',
        typeConfidence: 0,
        length: text.length,
        estimatedTokens: 0,
        sentenceCount: 0,
        avgSentenceLength: 0,
        codePercentage: 0,
        complexity: 0,
        hasStructuredData: false,
        languageFeatures: {
          hasQuestions: false,
          hasInstructions: false,
          hasCodeBlocks: false,
          hasLists: false,
          hasSections: false,
          hasJson: false,
          hasXml: false,
        },
      },
      processingTimeMs,
    }
  }
}

/**
 * Create a default adaptive compressor instance
 */
export function createAdaptiveCompressor(
  options?: Partial<AdaptiveOptions>
): AdaptiveCompressor {
  return new AdaptiveCompressor(options)
}

/**
 * Compress text using adaptive strategy selection
 *
 * @param text - Text to compress
 * @param targetRatio - Target compression ratio (0.1-1.0)
 * @returns Compressed text
 */
export async function compressAdaptively(
  text: string,
  targetRatio: number = 0.5
): Promise<string> {
  const compressor = new AdaptiveCompressor()
  const result = await compressor.compress(text, { targetRatio })
  return result.compressed
}
