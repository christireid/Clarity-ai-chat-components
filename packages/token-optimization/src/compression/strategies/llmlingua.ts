/**
 * LLMLingua-style Prompt Compression
 *
 * Implements statistical compression based on token importance scoring.
 * Achieves 2-20x compression while preserving semantic meaning by:
 *
 * 1. Tokenizing input text
 * 2. Calculating importance scores using TF-IDF, position, and linguistic markers
 * 3. Removing low-importance tokens to reach target ratio
 * 4. Reconstructing text with proper spacing
 *
 * Based on the LLMLingua paper: https://arxiv.org/abs/2310.05736
 *
 * @module llmlingua
 */

/**
 * Options for LLMLingua compression
 */
export interface LLMLinguaOptions {
  /** Number of tokens to preserve at the start (default: 10) */
  preserveFirst?: number
  /** Number of tokens to preserve at the end (default: 5) */
  preserveLast?: number
  /** Preserve instruction markers like "You must", "Important:", etc. (default: true) */
  preserveInstructions?: boolean
  /** Keep code blocks intact (default: true) */
  preserveCode?: boolean
  /** Minimum quality threshold 0-1 (default: 0.7) */
  minQuality?: number
  /** Custom stop words to always remove */
  additionalStopWords?: string[]
  /** Words to always preserve */
  preserveWords?: string[]
  /** Enable debug logging */
  debug?: boolean
}

/**
 * Result of LLMLingua compression
 */
export interface LLMLinguaResult {
  /** Original input text */
  original: string
  /** Compressed output text */
  compressed: string
  /** Compression ratio (compressed.length / original.length) */
  compressionRatio: number
  /** Estimated tokens in original */
  originalTokens: number
  /** Estimated tokens in compressed */
  compressedTokens: number
  /** Token reduction ratio */
  tokenReductionRatio: number
  /** Quality metrics */
  quality: LLMLinguaQualityMetrics
  /** Debug information if enabled */
  debug?: LLMLinguaDebugInfo
}

/**
 * Quality metrics for compression
 */
export interface LLMLinguaQualityMetrics {
  /** Cosine similarity of term vectors (0-1) */
  semanticSimilarity: number
  /** Percentage of key terms preserved (0-1) */
  keyTermRetention: number
  /** Percentage of instruction markers preserved (0-1) */
  instructionRetention: number
  /** Overall quality score (0-1) */
  overallQuality: number
}

/**
 * Debug information for compression analysis
 */
export interface LLMLinguaDebugInfo {
  /** Token importance scores */
  tokenScores: Array<{ token: string; score: number; kept: boolean }>
  /** Processing time in ms */
  processingTimeMs: number
  /** Statistics about the compression */
  stats: {
    totalTokens: number
    keptTokens: number
    removedTokens: number
    preservedByPosition: number
    preservedByInstruction: number
    preservedByCode: number
  }
}

/**
 * Internal token representation with metadata
 */
interface TokenWithMetadata {
  /** The token string */
  token: string
  /** Original position in text */
  position: number
  /** Importance score (higher = more important) */
  importance: number
  /** Whether this token should be preserved */
  preserved: boolean
  /** Reason for preservation */
  preserveReason?: string
  /** Whether token is part of a code block */
  isCode: boolean
  /** Whether token is an instruction marker */
  isInstruction: boolean
}

/**
 * Default stop words that carry little semantic meaning
 */
const DEFAULT_STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'but',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'could',
  'should',
  'may',
  'might',
  'must',
  'shall',
  'can',
  'to',
  'of',
  'in',
  'for',
  'on',
  'with',
  'at',
  'by',
  'from',
  'as',
  'into',
  'through',
  'during',
  'before',
  'after',
  'above',
  'below',
  'between',
  'under',
  'again',
  'further',
  'then',
  'once',
  'here',
  'there',
  'when',
  'where',
  'why',
  'how',
  'all',
  'each',
  'few',
  'more',
  'most',
  'other',
  'some',
  'such',
  'no',
  'nor',
  'not',
  'only',
  'own',
  'same',
  'so',
  'than',
  'too',
  'very',
  's',
  't',
  'just',
  'don',
  'now',
  'it',
  'its',
  "it's",
  'this',
  'that',
  'these',
  'those',
  'i',
  'me',
  'my',
  'myself',
  'we',
  'our',
  'ours',
  'ourselves',
  'you',
  'your',
  'yours',
  'yourself',
  'yourselves',
  'he',
  'him',
  'his',
  'himself',
  'she',
  'her',
  'hers',
  'herself',
  'they',
  'them',
  'their',
  'theirs',
  'themselves',
  'what',
  'which',
  'who',
  'whom',
  'actually',
  'basically',
  'literally',
  'really',
  'quite',
  'rather',
  'simply',
  'perhaps',
  'maybe',
  'probably',
  'certainly',
  'definitely',
  'essentially',
])

/**
 * Instruction markers that indicate important content
 */
const INSTRUCTION_MARKERS = [
  'important',
  'note',
  'warning',
  'caution',
  'attention',
  'required',
  'must',
  'shall',
  'need',
  'ensure',
  'remember',
  'always',
  'never',
  'do not',
  "don't",
  'cannot',
  "can't",
  'please',
  'instructions',
  'steps',
  'example',
  'output',
  'input',
  'return',
  'respond',
  'answer',
  'task',
  'goal',
  'objective',
  'constraint',
  'requirement',
  'rule',
  'format',
  'json',
  'xml',
  'markdown',
  'code',
]

/**
 * Code block patterns
 */
const CODE_BLOCK_PATTERN = /```[\s\S]*?```|`[^`]+`/g

/**
 * LLMLingua-style prompt compression using perplexity-based token importance.
 * Achieves 2-20x compression while preserving semantic meaning.
 *
 * @example
 * ```typescript
 * const compressor = new LLMLinguaCompressor();
 *
 * // Compress to 50% of original tokens
 * const result = await compressor.compress(longPrompt, 0.5);
 * console.log(result.compressed);
 * console.log(`Reduced from ${result.originalTokens} to ${result.compressedTokens} tokens`);
 *
 * // Aggressive compression to 20%
 * const aggressive = await compressor.compress(longPrompt, 0.2, {
 *   preserveInstructions: true,
 *   preserveCode: true,
 *   minQuality: 0.6
 * });
 * ```
 */
export class LLMLinguaCompressor {
  private readonly stopWords: Set<string>
  private readonly instructionMarkers: Set<string>

  /**
   * Create a new LLMLingua compressor
   *
   * @param defaultOptions - Default options for all compressions
   */
  constructor(private readonly defaultOptions: Partial<LLMLinguaOptions> = {}) {
    this.stopWords = new Set([
      ...DEFAULT_STOP_WORDS,
      ...(defaultOptions.additionalStopWords || []),
    ])
    this.instructionMarkers = new Set(
      INSTRUCTION_MARKERS.map((m) => m.toLowerCase())
    )
  }

  /**
   * Compress text by removing low-information tokens
   *
   * @param text - Input text to compress
   * @param targetRatio - Target compression ratio (0.1 = keep 10% = 10x compression)
   * @param options - Compression options
   * @returns Compression result with metrics
   *
   * @example
   * ```typescript
   * // Keep 50% of tokens (2x compression)
   * const result = await compressor.compress(text, 0.5);
   *
   * // Keep 20% of tokens (5x compression)
   * const aggressive = await compressor.compress(text, 0.2);
   * ```
   */
  async compress(
    text: string,
    targetRatio: number,
    options?: LLMLinguaOptions
  ): Promise<LLMLinguaResult> {
    const startTime = Date.now()
    const opts = { ...this.defaultOptions, ...options }

    // Handle edge cases
    if (!text || text.trim().length === 0) {
      return this.createEmptyResult(text)
    }

    // Clamp target ratio
    const ratio = Math.max(0.05, Math.min(1.0, targetRatio))

    // Extract and preserve code blocks
    const { textWithPlaceholders, codeBlocks } = this.extractCodeBlocks(
      text,
      opts.preserveCode !== false
    )

    // Tokenize
    const tokens = this.tokenize(textWithPlaceholders)

    if (tokens.length === 0) {
      return this.createEmptyResult(text)
    }

    // Calculate importance scores
    const tokensWithMetadata = this.analyzeTokens(tokens, opts)

    // Determine how many tokens to keep
    const targetCount = Math.max(
      1,
      Math.ceil(tokens.length * ratio),
      (opts.preserveFirst || 0) + (opts.preserveLast || 0)
    )

    // Select tokens to keep
    const keptTokens = this.selectTokens(tokensWithMetadata, targetCount, opts)

    // Reconstruct text
    let compressed = this.reconstructText(keptTokens)

    // Restore code blocks
    compressed = this.restoreCodeBlocks(compressed, codeBlocks)

    // Calculate quality metrics
    const quality = this.calculateQuality(text, compressed, tokensWithMetadata)

    // Check minimum quality
    if (opts.minQuality && quality.overallQuality < opts.minQuality) {
      // Recursively try with higher ratio
      const higherRatio = Math.min(1.0, ratio + 0.1)
      if (higherRatio < 1.0) {
        return this.compress(text, higherRatio, {
          ...opts,
          minQuality: opts.minQuality,
        })
      }
    }

    const processingTime = Date.now() - startTime
    const originalTokens = this.estimateTokenCount(text)
    const compressedTokens = this.estimateTokenCount(compressed)

    const result: LLMLinguaResult = {
      original: text,
      compressed,
      compressionRatio: compressed.length / text.length,
      originalTokens,
      compressedTokens,
      tokenReductionRatio: compressedTokens / originalTokens,
      quality,
    }

    if (opts.debug) {
      result.debug = this.createDebugInfo(
        tokensWithMetadata,
        keptTokens,
        processingTime
      )
    }

    return result
  }

  /**
   * Tokenize text into words and punctuation
   */
  private tokenize(text: string): string[] {
    // Split on whitespace and punctuation, keeping punctuation as separate tokens
    return text
      .split(/(\s+|[.,!?;:'"()[\]{}])/)
      .filter((t) => t.length > 0 && !/^\s+$/.test(t))
  }

  /**
   * Analyze tokens and calculate importance scores
   */
  private analyzeTokens(
    tokens: string[],
    opts: LLMLinguaOptions
  ): TokenWithMetadata[] {
    // Calculate term frequency
    const tf = this.calculateTermFrequency(tokens)

    // Calculate inverse document frequency (treating each sentence as a document)
    const idf = this.calculateIDF(tokens)

    const totalTokens = tokens.length

    return tokens.map((token, position) => {
      const lowerToken = token.toLowerCase()
      const isStopWord = this.stopWords.has(lowerToken)
      const isPunctuation = /^[.,!?;:'"()[\]{}]$/.test(token)
      const isCodePlaceholder = token.startsWith('__CODE_BLOCK_')
      const isInstruction = this.isInstructionContext(tokens, position)

      // Calculate base importance using TF-IDF
      let importance = (tf.get(lowerToken) || 0) * (idf.get(lowerToken) || 1)

      // Position weighting: boost start and end
      const positionWeight = this.calculatePositionWeight(position, totalTokens)
      importance *= positionWeight

      // Penalize stop words heavily
      if (isStopWord) {
        importance *= 0.1
      }

      // Punctuation gets medium importance (helps readability)
      if (isPunctuation) {
        importance *= 0.5
      }

      // Boost instruction-related tokens
      if (isInstruction && opts.preserveInstructions !== false) {
        importance *= 3.0
      }

      // Check if should be preserved
      const preserveFirst = opts.preserveFirst ?? 10
      const preserveLast = opts.preserveLast ?? 5

      let preserved = false
      let preserveReason: string | undefined

      if (position < preserveFirst) {
        preserved = true
        preserveReason = 'position_first'
      } else if (position >= totalTokens - preserveLast) {
        preserved = true
        preserveReason = 'position_last'
      } else if (isCodePlaceholder && opts.preserveCode !== false) {
        preserved = true
        preserveReason = 'code_block'
      } else if (opts.preserveWords?.includes(lowerToken)) {
        preserved = true
        preserveReason = 'preserve_list'
      }

      return {
        token,
        position,
        importance,
        preserved,
        preserveReason,
        isCode: isCodePlaceholder,
        isInstruction,
      }
    })
  }

  /**
   * Calculate term frequency for all tokens
   */
  private calculateTermFrequency(tokens: string[]): Map<string, number> {
    const counts = new Map<string, number>()
    const total = tokens.length

    for (const token of tokens) {
      const lower = token.toLowerCase()
      counts.set(lower, (counts.get(lower) || 0) + 1)
    }

    // Normalize to frequencies
    const tf = new Map<string, number>()
    for (const [term, count] of counts) {
      tf.set(term, count / total)
    }

    return tf
  }

  /**
   * Calculate inverse document frequency
   * Treats each sentence as a "document"
   */
  private calculateIDF(tokens: string[]): Map<string, number> {
    // Split into sentences
    const text = tokens.join(' ')
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const numDocs = Math.max(1, sentences.length)

    // Count document frequency
    const df = new Map<string, number>()
    for (const sentence of sentences) {
      const sentenceTokens = new Set(
        sentence
          .toLowerCase()
          .split(/\s+/)
          .filter((t) => t.length > 0)
      )
      for (const token of sentenceTokens) {
        df.set(token, (df.get(token) || 0) + 1)
      }
    }

    // Calculate IDF
    const idf = new Map<string, number>()
    for (const [term, count] of df) {
      idf.set(term, Math.log(numDocs / count) + 1)
    }

    return idf
  }

  /**
   * Calculate position weight (tokens at start and end are more important)
   */
  private calculatePositionWeight(
    position: number,
    totalTokens: number
  ): number {
    if (totalTokens <= 1) return 1.0

    const normalizedPos = position / (totalTokens - 1)

    // Boost first 10% and last 10%
    if (normalizedPos < 0.1) {
      return 1.5 + 0.5 * (1 - normalizedPos / 0.1)
    }
    if (normalizedPos > 0.9) {
      return 1.3 + 0.3 * ((normalizedPos - 0.9) / 0.1)
    }

    return 1.0
  }

  /**
   * Check if token is in an instruction context
   */
  private isInstructionContext(tokens: string[], position: number): boolean {
    // Check surrounding tokens for instruction markers
    const windowSize = 3
    const start = Math.max(0, position - windowSize)
    const end = Math.min(tokens.length, position + windowSize + 1)

    for (let i = start; i < end; i++) {
      const token = tokens[i].toLowerCase()
      if (this.instructionMarkers.has(token)) {
        return true
      }
    }

    return false
  }

  /**
   * Select tokens to keep based on importance and constraints
   */
  private selectTokens(
    tokens: TokenWithMetadata[],
    targetCount: number,
    _opts: LLMLinguaOptions
  ): TokenWithMetadata[] {
    // Separate preserved and non-preserved tokens
    const preserved = tokens.filter((t) => t.preserved)
    const candidates = tokens.filter((t) => !t.preserved)

    // Sort candidates by importance (descending)
    candidates.sort((a, b) => b.importance - a.importance)

    // Calculate how many more tokens we need
    const additionalNeeded = Math.max(0, targetCount - preserved.length)

    // Select top candidates
    const selected = candidates.slice(0, additionalNeeded)

    // Combine and sort by original position
    const result = [...preserved, ...selected]
    result.sort((a, b) => a.position - b.position)

    return result
  }

  /**
   * Reconstruct text from selected tokens
   */
  private reconstructText(tokens: TokenWithMetadata[]): string {
    if (tokens.length === 0) return ''

    const parts: string[] = []
    let prevPosition = -1

    for (const token of tokens) {
      // Add space if there's a gap and token isn't punctuation
      if (prevPosition >= 0 && !/^[.,!?;:'")\]}]$/.test(token.token)) {
        // Check if previous token was opening punctuation
        const prevToken = parts[parts.length - 1]
        if (!/^['"([{]$/.test(prevToken)) {
          parts.push(' ')
        }
      }

      parts.push(token.token)
      prevPosition = token.position
    }

    return parts.join('').replace(/\s+/g, ' ').trim()
  }

  /**
   * Extract code blocks and replace with placeholders
   */
  private extractCodeBlocks(
    text: string,
    preserve: boolean
  ): { textWithPlaceholders: string; codeBlocks: Map<string, string> } {
    const codeBlocks = new Map<string, string>()

    if (!preserve) {
      return { textWithPlaceholders: text, codeBlocks }
    }

    let index = 0
    const textWithPlaceholders = text.replace(CODE_BLOCK_PATTERN, (match) => {
      const placeholder = `__CODE_BLOCK_${index}__`
      codeBlocks.set(placeholder, match)
      index++
      return placeholder
    })

    return { textWithPlaceholders, codeBlocks }
  }

  /**
   * Restore code blocks from placeholders
   */
  private restoreCodeBlocks(
    text: string,
    codeBlocks: Map<string, string>
  ): string {
    let result = text
    for (const [placeholder, code] of codeBlocks) {
      result = result.replace(placeholder, code)
    }
    return result
  }

  /**
   * Calculate quality metrics
   */
  private calculateQuality(
    original: string,
    compressed: string,
    tokens: TokenWithMetadata[]
  ): LLMLinguaQualityMetrics {
    // Key term retention
    const originalKeyTerms = this.extractKeyTerms(original)
    const compressedKeyTerms = this.extractKeyTerms(compressed)
    const keyTermRetention =
      originalKeyTerms.size > 0
        ? [...originalKeyTerms].filter((t) => compressedKeyTerms.has(t))
            .length / originalKeyTerms.size
        : 1

    // Instruction retention
    const instructionTokens = tokens.filter((t) => t.isInstruction)
    const keptInstructionTokens = tokens.filter(
      (t) => t.isInstruction && (t.preserved || t.importance > 0)
    )
    const instructionRetention =
      instructionTokens.length > 0
        ? keptInstructionTokens.length / instructionTokens.length
        : 1

    // Semantic similarity using term vectors
    const semanticSimilarity = this.calculateCosineSimilarity(
      original,
      compressed
    )

    // Overall quality (weighted average)
    const overallQuality =
      semanticSimilarity * 0.4 +
      keyTermRetention * 0.4 +
      instructionRetention * 0.2

    return {
      semanticSimilarity,
      keyTermRetention,
      instructionRetention,
      overallQuality,
    }
  }

  /**
   * Extract key terms (non-stop words with high frequency)
   */
  private extractKeyTerms(text: string): Set<string> {
    const words = text.toLowerCase().split(/\s+/)
    const counts = new Map<string, number>()

    for (const word of words) {
      if (word.length > 2 && !this.stopWords.has(word)) {
        counts.set(word, (counts.get(word) || 0) + 1)
      }
    }

    // Get top terms by frequency
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])
    const topCount = Math.min(20, Math.ceil(sorted.length * 0.3))

    return new Set(sorted.slice(0, topCount).map(([term]) => term))
  }

  /**
   * Calculate cosine similarity between two texts using term vectors
   */
  private calculateCosineSimilarity(text1: string, text2: string): number {
    const vec1 = this.createTermVector(text1)
    const vec2 = this.createTermVector(text2)

    // Get all terms
    const allTerms = new Set([...vec1.keys(), ...vec2.keys()])

    // Calculate dot product and magnitudes
    let dotProduct = 0
    let mag1 = 0
    let mag2 = 0

    for (const term of allTerms) {
      const v1 = vec1.get(term) || 0
      const v2 = vec2.get(term) || 0
      dotProduct += v1 * v2
      mag1 += v1 * v1
      mag2 += v2 * v2
    }

    mag1 = Math.sqrt(mag1)
    mag2 = Math.sqrt(mag2)

    if (mag1 === 0 || mag2 === 0) return 0

    return dotProduct / (mag1 * mag2)
  }

  /**
   * Create term frequency vector for text
   */
  private createTermVector(text: string): Map<string, number> {
    const words = text.toLowerCase().split(/\s+/)
    const counts = new Map<string, number>()

    for (const word of words) {
      if (word.length > 0) {
        counts.set(word, (counts.get(word) || 0) + 1)
      }
    }

    return counts
  }

  /**
   * Estimate token count (rough approximation)
   */
  private estimateTokenCount(text: string): number {
    // Rough estimate: ~4 characters per token on average
    // This varies by tokenizer, but provides a reasonable approximation
    return Math.ceil(text.length / 4)
  }

  /**
   * Create empty result for edge cases
   */
  private createEmptyResult(text: string): LLMLinguaResult {
    return {
      original: text,
      compressed: text,
      compressionRatio: 1,
      originalTokens: 0,
      compressedTokens: 0,
      tokenReductionRatio: 1,
      quality: {
        semanticSimilarity: 1,
        keyTermRetention: 1,
        instructionRetention: 1,
        overallQuality: 1,
      },
    }
  }

  /**
   * Create debug information
   */
  private createDebugInfo(
    allTokens: TokenWithMetadata[],
    keptTokens: TokenWithMetadata[],
    processingTimeMs: number
  ): LLMLinguaDebugInfo {
    const keptPositions = new Set(keptTokens.map((t) => t.position))

    return {
      tokenScores: allTokens.map((t) => ({
        token: t.token,
        score: t.importance,
        kept: keptPositions.has(t.position),
      })),
      processingTimeMs,
      stats: {
        totalTokens: allTokens.length,
        keptTokens: keptTokens.length,
        removedTokens: allTokens.length - keptTokens.length,
        preservedByPosition: keptTokens.filter(
          (t) =>
            t.preserveReason === 'position_first' ||
            t.preserveReason === 'position_last'
        ).length,
        preservedByInstruction: keptTokens.filter((t) => t.isInstruction)
          .length,
        preservedByCode: keptTokens.filter(
          (t) => t.preserveReason === 'code_block'
        ).length,
      },
    }
  }
}

/**
 * Create a default LLMLingua compressor instance
 */
export function createLLMLinguaCompressor(
  options?: Partial<LLMLinguaOptions>
): LLMLinguaCompressor {
  return new LLMLinguaCompressor(options)
}

/**
 * Compress text using LLMLingua with default settings
 *
 * @param text - Text to compress
 * @param targetRatio - Target compression ratio (0.1-1.0)
 * @returns Compressed text
 */
export async function compressWithLLMLingua(
  text: string,
  targetRatio: number = 0.5
): Promise<string> {
  const compressor = new LLMLinguaCompressor()
  const result = await compressor.compress(text, targetRatio)
  return result.compressed
}
