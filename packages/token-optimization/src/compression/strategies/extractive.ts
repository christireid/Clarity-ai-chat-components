/**
 * Extractive Compression
 *
 * Compresses text by extracting the most important sentences.
 * Unlike token-level compression (LLMLingua), this operates at the sentence level,
 * preserving grammatical coherence while removing less important sentences.
 *
 * Scoring is based on:
 * - Position (first/last sentences weighted higher)
 * - Key phrase presence
 * - Named entity density
 * - Question/instruction markers
 * - Sentence length (moderate length preferred)
 *
 * @module extractive
 */

/**
 * Options for extractive compression
 */
export interface ExtractiveOptions {
  /** Minimum number of sentences to keep (default: 1) */
  minSentences?: number
  /** Maximum number of sentences to keep (default: unlimited) */
  maxSentences?: number
  /** Always include the first sentence (default: true) */
  preserveFirst?: boolean
  /** Always include the last sentence (default: false) */
  preserveLast?: boolean
  /** Boost sentences containing questions (default: true) */
  boostQuestions?: boolean
  /** Boost sentences containing instructions (default: true) */
  boostInstructions?: boolean
  /** Custom key phrases to boost */
  keyPhrases?: string[]
  /** Minimum sentence length in characters (default: 10) */
  minSentenceLength?: number
  /** Enable debug output */
  debug?: boolean
}

/**
 * Result of extractive compression
 */
export interface ExtractiveResult {
  /** Original input text */
  original: string
  /** Compressed output text */
  compressed: string
  /** Compression ratio (compressed.length / original.length) */
  compressionRatio: number
  /** Number of sentences in original */
  originalSentences: number
  /** Number of sentences kept */
  keptSentences: number
  /** Sentence retention ratio */
  sentenceRetentionRatio: number
  /** Quality metrics */
  quality: ExtractiveQualityMetrics
  /** Debug information if enabled */
  debug?: ExtractiveDebugInfo
}

/**
 * Quality metrics for extractive compression
 */
export interface ExtractiveQualityMetrics {
  /** Percentage of key terms preserved (0-1) */
  keyTermRetention: number
  /** Percentage of sentences preserved (0-1) */
  sentenceRetention: number
  /** Coverage of original content topics (0-1) */
  topicCoverage: number
  /** Overall quality score (0-1) */
  overallQuality: number
}

/**
 * Debug information for compression analysis
 */
export interface ExtractiveDebugInfo {
  /** Scored sentences */
  sentences: ScoredSentence[]
  /** Processing time in ms */
  processingTimeMs: number
}

/**
 * A sentence with its importance score
 */
export interface ScoredSentence {
  /** The sentence text */
  text: string
  /** Original position (0-indexed) */
  position: number
  /** Importance score (higher = more important) */
  score: number
  /** Whether this sentence was selected */
  selected: boolean
  /** Breakdown of score components */
  scoreBreakdown: ScoreBreakdown
}

/**
 * Breakdown of how a sentence score was calculated
 */
interface ScoreBreakdown {
  positionScore: number
  keyPhraseScore: number
  entityScore: number
  instructionScore: number
  questionScore: number
  lengthScore: number
  tfIdfScore: number
}

/**
 * Named entity patterns
 */
const ENTITY_PATTERNS = [
  // Capitalized words (potential proper nouns)
  /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g,
  // URLs
  /https?:\/\/[^\s]+/g,
  // Email addresses
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  // Numbers with units
  /\b\d+(?:\.\d+)?(?:\s*(?:KB|MB|GB|TB|ms|s|min|hr|days?|weeks?|months?|years?|%|px|em|rem))\b/gi,
  // Code identifiers (camelCase, snake_case)
  /\b[a-z]+(?:[A-Z][a-z]+)+\b/g,
  /\b[a-z]+(?:_[a-z]+)+\b/g,
]

/**
 * Instruction indicators
 */
const INSTRUCTION_PATTERNS = [
  /\b(?:must|shall|should|need to|have to|required|ensure|always|never)\b/i,
  /\b(?:important|note|warning|caution|attention)\b/i,
  /\b(?:step \d+|first|second|third|finally|then|next)\b/i,
  /\b(?:do not|don't|cannot|can't|avoid|prohibited)\b/i,
]

/**
 * Question indicators
 */
const QUESTION_PATTERNS = [
  /\?$/,
  /^(?:what|who|where|when|why|how|which|whose|whom)\b/i,
  /\b(?:can you|could you|would you|will you|please)\b/i,
]

/**
 * Extractive compressor that extracts the most important sentences.
 *
 * @example
 * ```typescript
 * const compressor = new ExtractiveCompressor();
 *
 * // Keep 50% of sentences
 * const result = compressor.compress(text, 0.5);
 * console.log(result.compressed);
 *
 * // Keep at least 3 sentences
 * const result2 = compressor.compress(text, 0.3, { minSentences: 3 });
 * ```
 */
export class ExtractiveCompressor {
  private readonly defaultOptions: ExtractiveOptions

  /**
   * Create a new extractive compressor
   *
   * @param defaultOptions - Default options for all compressions
   */
  constructor(defaultOptions: Partial<ExtractiveOptions> = {}) {
    this.defaultOptions = {
      minSentences: 1,
      preserveFirst: true,
      preserveLast: false,
      boostQuestions: true,
      boostInstructions: true,
      minSentenceLength: 10,
      ...defaultOptions,
    }
  }

  /**
   * Extract most important sentences from text
   *
   * @param text - Input text to compress
   * @param targetRatio - Target ratio of sentences to keep (0.1-1.0)
   * @param options - Compression options
   * @returns Compression result with quality metrics
   */
  compress(
    text: string,
    targetRatio: number,
    options?: ExtractiveOptions
  ): ExtractiveResult {
    const startTime = Date.now()
    const opts = { ...this.defaultOptions, ...options }

    // Handle edge cases
    if (!text || text.trim().length === 0) {
      return this.createEmptyResult(text)
    }

    // Split into sentences
    const sentences = this.splitSentences(text)

    if (sentences.length === 0) {
      return this.createEmptyResult(text)
    }

    // Score sentences
    const scoredSentences = this.scoreSentences(sentences, opts)

    // Determine how many sentences to keep
    const ratio = Math.max(0.1, Math.min(1.0, targetRatio))
    let targetCount = Math.ceil(sentences.length * ratio)

    // Apply min/max constraints
    targetCount = Math.max(targetCount, opts.minSentences || 1)
    if (opts.maxSentences) {
      targetCount = Math.min(targetCount, opts.maxSentences)
    }
    targetCount = Math.min(targetCount, sentences.length)

    // Select top sentences
    const selected = this.selectSentences(scoredSentences, targetCount, opts)

    // Reconstruct text
    const compressed = this.reconstructText(selected)

    // Calculate quality metrics
    const quality = this.calculateQuality(text, compressed, sentences, selected)

    const processingTime = Date.now() - startTime

    // Mark selected sentences in debug info
    if (opts.debug) {
      const selectedPositions = new Set(selected.map((s) => s.position))
      scoredSentences.forEach((s) => {
        s.selected = selectedPositions.has(s.position)
      })
    }

    return {
      original: text,
      compressed,
      compressionRatio: compressed.length / text.length,
      originalSentences: sentences.length,
      keptSentences: selected.length,
      sentenceRetentionRatio: selected.length / sentences.length,
      quality,
      debug: opts.debug
        ? {
            sentences: scoredSentences,
            processingTimeMs: processingTime,
          }
        : undefined,
    }
  }

  /**
   * Split text into sentences
   */
  private splitSentences(text: string): string[] {
    // Handle common abbreviations to avoid false splits
    const processed = text.replace(
      /\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|Inc|Ltd|Corp|vs|etc|i\.e|e\.g)\./gi,
      '$1__DOT__'
    )

    // Split on sentence boundaries
    const sentences = processed
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .map((s) => s.replace(/__DOT__/g, '.').trim())
      .filter((s) => s.length >= (this.defaultOptions.minSentenceLength || 10))

    return sentences
  }

  /**
   * Score all sentences
   */
  private scoreSentences(
    sentences: string[],
    opts: ExtractiveOptions
  ): ScoredSentence[] {
    // Calculate TF-IDF for the document
    const tfIdf = this.calculateTfIdf(sentences)

    // Calculate global key phrases
    const keyPhrases = new Set([
      ...this.extractKeyPhrases(sentences.join(' ')),
      ...(opts.keyPhrases || []).map((p) => p.toLowerCase()),
    ])

    return sentences.map((text, position) => {
      const breakdown = this.calculateScoreBreakdown(
        text,
        position,
        sentences.length,
        keyPhrases,
        tfIdf,
        opts
      )

      // Calculate total score
      const score =
        breakdown.positionScore * 1.5 +
        breakdown.keyPhraseScore * 2.0 +
        breakdown.entityScore * 1.0 +
        breakdown.instructionScore * 2.5 +
        breakdown.questionScore * 2.0 +
        breakdown.lengthScore * 0.5 +
        breakdown.tfIdfScore * 1.5

      return {
        text,
        position,
        score,
        selected: false,
        scoreBreakdown: breakdown,
      }
    })
  }

  /**
   * Calculate individual score components for a sentence
   */
  private calculateScoreBreakdown(
    text: string,
    position: number,
    totalSentences: number,
    keyPhrases: Set<string>,
    tfIdf: Map<string, number>,
    opts: ExtractiveOptions
  ): ScoreBreakdown {
    // Position score (first and last sentences are important)
    let positionScore = 0.5
    if (position === 0) {
      positionScore = 1.0
    } else if (position === totalSentences - 1) {
      positionScore = 0.8
    } else if (position < totalSentences * 0.2) {
      positionScore = 0.7
    }

    // Key phrase score
    const lowerText = text.toLowerCase()
    const keyPhraseMatches = [...keyPhrases].filter((phrase) =>
      lowerText.includes(phrase)
    ).length
    const keyPhraseScore = Math.min(1.0, keyPhraseMatches / 3)

    // Entity score
    let entityCount = 0
    for (const pattern of ENTITY_PATTERNS) {
      const matches = text.match(pattern)
      entityCount += matches ? matches.length : 0
    }
    const entityScore = Math.min(1.0, entityCount / 5)

    // Instruction score
    let instructionScore = 0
    if (opts.boostInstructions) {
      for (const pattern of INSTRUCTION_PATTERNS) {
        if (pattern.test(text)) {
          instructionScore = 1.0
          break
        }
      }
    }

    // Question score
    let questionScore = 0
    if (opts.boostQuestions) {
      for (const pattern of QUESTION_PATTERNS) {
        if (pattern.test(text)) {
          questionScore = 1.0
          break
        }
      }
    }

    // Length score (moderate length preferred)
    const wordCount = text.split(/\s+/).length
    let lengthScore = 0.5
    if (wordCount >= 10 && wordCount <= 30) {
      lengthScore = 1.0
    } else if (wordCount >= 5 && wordCount <= 50) {
      lengthScore = 0.7
    }

    // TF-IDF score
    const words = text.toLowerCase().split(/\s+/)
    let tfIdfSum = 0
    for (const word of words) {
      tfIdfSum += tfIdf.get(word) || 0
    }
    const tfIdfScore = Math.min(1.0, tfIdfSum / words.length)

    return {
      positionScore,
      keyPhraseScore,
      entityScore,
      instructionScore,
      questionScore,
      lengthScore,
      tfIdfScore,
    }
  }

  /**
   * Calculate TF-IDF scores for all terms
   */
  private calculateTfIdf(sentences: string[]): Map<string, number> {
    const documentFrequency = new Map<string, number>()
    const termFrequency = new Map<string, number>()

    // Count document frequency and term frequency
    for (const sentence of sentences) {
      const words = new Set(
        sentence
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w.length > 2)
      )
      for (const word of words) {
        documentFrequency.set(word, (documentFrequency.get(word) || 0) + 1)
        termFrequency.set(word, (termFrequency.get(word) || 0) + 1)
      }
    }

    // Calculate TF-IDF
    const tfIdf = new Map<string, number>()
    const numDocs = sentences.length

    for (const [word, tf] of termFrequency) {
      const df = documentFrequency.get(word) || 1
      const idf = Math.log(numDocs / df) + 1
      tfIdf.set(word, (tf / numDocs) * idf)
    }

    return tfIdf
  }

  /**
   * Extract key phrases from text
   */
  private extractKeyPhrases(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/)
    const counts = new Map<string, number>()

    // Count word frequencies
    for (const word of words) {
      if (word.length > 3 && !this.isStopWord(word)) {
        counts.set(word, (counts.get(word) || 0) + 1)
      }
    }

    // Get top words by frequency
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])
    return sorted.slice(0, 15).map(([word]) => word)
  }

  /**
   * Check if word is a stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the',
      'a',
      'an',
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
      'this',
      'that',
      'these',
      'those',
      'with',
      'from',
      'into',
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
      'only',
      'same',
      'than',
      'very',
      'just',
      'also',
      'about',
      'their',
      'they',
      'them',
      'your',
      'which',
      'what',
    ])
    return stopWords.has(word)
  }

  /**
   * Select sentences to include
   */
  private selectSentences(
    sentences: ScoredSentence[],
    targetCount: number,
    opts: ExtractiveOptions
  ): ScoredSentence[] {
    // Start with required sentences
    const required: ScoredSentence[] = []
    const candidates: ScoredSentence[] = []

    for (const sentence of sentences) {
      if (opts.preserveFirst && sentence.position === 0) {
        required.push(sentence)
      } else if (
        opts.preserveLast &&
        sentence.position === sentences.length - 1
      ) {
        required.push(sentence)
      } else {
        candidates.push(sentence)
      }
    }

    // Sort candidates by score (descending)
    candidates.sort((a, b) => b.score - a.score)

    // Select additional sentences
    const additionalNeeded = Math.max(0, targetCount - required.length)
    const selected = [...required, ...candidates.slice(0, additionalNeeded)]

    // Sort by original position for natural reading order
    selected.sort((a, b) => a.position - b.position)

    return selected
  }

  /**
   * Reconstruct text from selected sentences
   */
  private reconstructText(sentences: ScoredSentence[]): string {
    return sentences.map((s) => s.text).join(' ')
  }

  /**
   * Calculate quality metrics
   */
  private calculateQuality(
    original: string,
    compressed: string,
    allSentences: string[],
    selectedSentences: ScoredSentence[]
  ): ExtractiveQualityMetrics {
    // Key term retention
    const originalKeyTerms = new Set(this.extractKeyPhrases(original))
    const compressedKeyTerms = new Set(this.extractKeyPhrases(compressed))
    const keyTermRetention =
      originalKeyTerms.size > 0
        ? [...originalKeyTerms].filter((t) => compressedKeyTerms.has(t))
            .length / originalKeyTerms.size
        : 1

    // Sentence retention
    const sentenceRetention = selectedSentences.length / allSentences.length

    // Topic coverage (simplified: percentage of key phrases covered)
    const topicCoverage = keyTermRetention

    // Overall quality
    const overallQuality =
      keyTermRetention * 0.4 + sentenceRetention * 0.3 + topicCoverage * 0.3

    return {
      keyTermRetention,
      sentenceRetention,
      topicCoverage,
      overallQuality,
    }
  }

  /**
   * Create empty result for edge cases
   */
  private createEmptyResult(text: string): ExtractiveResult {
    return {
      original: text,
      compressed: text,
      compressionRatio: 1,
      originalSentences: 0,
      keptSentences: 0,
      sentenceRetentionRatio: 1,
      quality: {
        keyTermRetention: 1,
        sentenceRetention: 1,
        topicCoverage: 1,
        overallQuality: 1,
      },
    }
  }
}

/**
 * Create a default extractive compressor instance
 */
export function createExtractiveCompressor(
  options?: Partial<ExtractiveOptions>
): ExtractiveCompressor {
  return new ExtractiveCompressor(options)
}

/**
 * Compress text using extractive summarization with default settings
 *
 * @param text - Text to compress
 * @param targetRatio - Target ratio of sentences to keep (0.1-1.0)
 * @returns Compressed text
 */
export function compressExtractively(
  text: string,
  targetRatio: number = 0.5
): string {
  const compressor = new ExtractiveCompressor()
  const result = compressor.compress(text, targetRatio)
  return result.compressed
}
