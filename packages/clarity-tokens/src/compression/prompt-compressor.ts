/**
 * Prompt Compressor - Client-side prompt compression
 *
 * Implements multiple compression strategies to reduce token usage:
 * - Heuristic: Fast, rule-based compression (2-3x)
 * - Extractive: TF-IDF based sentence selection (3-5x)
 * - Auto: Selects best strategy based on input characteristics
 */

import type { CompressionConfig, CompressionResult, CompressionStrategy } from '../types'
import { countTokens, estimateTokens } from '../core/token-counter'

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<CompressionConfig> = {
  targetRatio: 0.5,
  strategy: 'auto',
  preserveStructure: true,
  minTokens: 50,
  qualityThreshold: 0.85,
}

/**
 * Common English stopwords for heuristic compression
 */
const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
  'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
  'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here',
  'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'and',
  'but', 'or', 'because', 'until', 'while', 'although', 'though', 'if',
  'that', 'which', 'who', 'whom', 'this', 'these', 'those', 'am', 'it',
  'its', 'itself', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours',
  'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he',
  'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'they',
  'them', 'their', 'theirs', 'themselves', 'what',
])

/**
 * Structural elements to preserve
 */
const STRUCTURAL_PATTERNS = {
  codeBlock: /```[\s\S]*?```/g,
  inlineCode: /`[^`]+`/g,
  header: /^#{1,6}\s+.+$/gm,
  listItem: /^[\s]*[-*+]\s+.+$/gm,
  numberedList: /^[\s]*\d+\.\s+.+$/gm,
  url: /https?:\/\/[^\s]+/g,
  json: /\{[\s\S]*?\}/g,
}

/**
 * Extract and preserve structural elements
 */
function extractStructuralElements(
  text: string
): { preserved: Map<string, string>; stripped: string } {
  const preserved = new Map<string, string>()
  let stripped = text
  let placeholderIndex = 0

  for (const [name, pattern] of Object.entries(STRUCTURAL_PATTERNS)) {
    stripped = stripped.replace(pattern, (match) => {
      const placeholder = `__STRUCT_${name}_${placeholderIndex++}__`
      preserved.set(placeholder, match)
      return placeholder
    })
  }

  return { preserved, stripped }
}

/**
 * Restore structural elements
 */
function restoreStructuralElements(
  text: string,
  preserved: Map<string, string>
): string {
  let result = text
  for (const [placeholder, original] of preserved) {
    result = result.replace(placeholder, original)
  }
  return result
}

/**
 * Heuristic compression - fast, rule-based
 */
function compressHeuristic(text: string, preserveStructure: boolean): string {
  let processed = text

  // Handle structural elements
  let preserved = new Map<string, string>()
  if (preserveStructure) {
    const extracted = extractStructuralElements(text)
    preserved = extracted.preserved
    processed = extracted.stripped
  }

  // Remove excessive whitespace
  processed = processed.replace(/\s+/g, ' ')

  // Remove stopwords from non-code content
  const words = processed.split(' ')
  const filteredWords = words.filter((word) => {
    const lowerWord = word.toLowerCase().replace(/[^\w]/g, '')
    // Keep words that are not stopwords or are short (likely important)
    return !STOPWORDS.has(lowerWord) || word.length > 4
  })
  processed = filteredWords.join(' ')

  // Remove redundant punctuation
  processed = processed.replace(/[.]{2,}/g, '.')
  processed = processed.replace(/[,]{2,}/g, ',')
  processed = processed.replace(/\s+([.,!?;:])/g, '$1')

  // Remove filler phrases
  const fillerPhrases = [
    /\bbasically\b/gi,
    /\bactually\b/gi,
    /\bliterally\b/gi,
    /\bin order to\b/gi,
    /\bdue to the fact that\b/gi,
    /\bat this point in time\b/gi,
    /\bit is important to note that\b/gi,
    /\bas a matter of fact\b/gi,
    /\bin the event that\b/gi,
    /\bfor the purpose of\b/gi,
  ]

  for (const phrase of fillerPhrases) {
    processed = processed.replace(phrase, '')
  }

  // Clean up remaining issues
  processed = processed.replace(/\s+/g, ' ').trim()

  // Restore structural elements
  if (preserveStructure) {
    processed = restoreStructuralElements(processed, preserved)
  }

  return processed
}

/**
 * Calculate TF-IDF scores for sentences
 */
function calculateTfIdf(sentences: string[]): Map<string, number> {
  // Term frequency per sentence
  const termFrequencies: Map<string, Map<string, number>>[] = []
  const documentFrequency = new Map<string, number>()
  const allTerms = new Set<string>()

  for (const sentence of sentences) {
    const terms = sentence.toLowerCase().match(/\b\w+\b/g) || []
    const tf = new Map<string, number>()

    for (const term of terms) {
      if (!STOPWORDS.has(term)) {
        tf.set(term, (tf.get(term) || 0) + 1)
        allTerms.add(term)
      }
    }

    termFrequencies.push(tf)

    // Update document frequency
    for (const term of tf.keys()) {
      documentFrequency.set(term, (documentFrequency.get(term) || 0) + 1)
    }
  }

  // Calculate TF-IDF for each sentence
  const sentenceScores = new Map<string, number>()
  const numDocs = sentences.length

  for (let i = 0; i < sentences.length; i++) {
    const tf = termFrequencies[i]
    let score = 0

    for (const [term, freq] of tf) {
      const df = documentFrequency.get(term) || 1
      const idf = Math.log(numDocs / df)
      score += freq * idf
    }

    // Normalize by sentence length
    const words = sentences[i].split(/\s+/).length
    sentenceScores.set(sentences[i], score / Math.sqrt(words))
  }

  return sentenceScores
}

/**
 * Extractive compression - TF-IDF based sentence selection
 */
function compressExtractive(
  text: string,
  targetRatio: number,
  preserveStructure: boolean
): string {
  // Handle structural elements
  let preserved = new Map<string, string>()
  let processed = text

  if (preserveStructure) {
    const extracted = extractStructuralElements(text)
    preserved = extracted.preserved
    processed = extracted.stripped
  }

  // Split into sentences
  const sentences = processed.match(/[^.!?]+[.!?]+/g) || [processed]

  // Calculate TF-IDF scores
  const scores = calculateTfIdf(sentences)

  // Sort sentences by score
  const rankedSentences = sentences
    .map((s, idx) => ({ sentence: s, score: scores.get(s) || 0, index: idx }))
    .sort((a, b) => b.score - a.score)

  // Select top sentences to meet target ratio
  const targetLength = Math.ceil(sentences.length * targetRatio)
  const selectedSentences = rankedSentences
    .slice(0, Math.max(1, targetLength))
    .sort((a, b) => a.index - b.index) // Restore original order
    .map((s) => s.sentence)

  let result = selectedSentences.join(' ')

  // Restore structural elements
  if (preserveStructure) {
    result = restoreStructuralElements(result, preserved)
  }

  return result.trim()
}

/**
 * Analyze text to determine best compression strategy
 */
function analyzeText(text: string): {
  recommendedStrategy: CompressionStrategy
  redundancyScore: number
  estimatedRatio: number
} {
  const wordCount = text.split(/\s+/).length
  const sentenceCount = (text.match(/[.!?]+/g) || []).length + 1
  const codeBlockCount = (text.match(/```/g) || []).length / 2
  const avgSentenceLength = wordCount / sentenceCount

  // Calculate redundancy score based on repeated phrases
  const phrases = text.toLowerCase().match(/\b(\w+\s+){2,3}\w+\b/g) || []
  const phraseFreq = new Map<string, number>()
  for (const phrase of phrases) {
    phraseFreq.set(phrase, (phraseFreq.get(phrase) || 0) + 1)
  }
  const repeatedPhrases = Array.from(phraseFreq.values()).filter((v) => v > 1)
  const redundancyScore = Math.min(
    repeatedPhrases.length / Math.max(phrases.length, 1),
    1
  )

  // Determine recommended strategy
  let recommendedStrategy: CompressionStrategy = 'heuristic'

  if (codeBlockCount > 0) {
    // Code-heavy content benefits from heuristic (preserves structure)
    recommendedStrategy = 'heuristic'
  } else if (avgSentenceLength > 20 && sentenceCount > 5) {
    // Long sentences with multiple paragraphs benefit from extractive
    recommendedStrategy = 'extractive'
  } else if (redundancyScore > 0.3) {
    // High redundancy benefits from heuristic
    recommendedStrategy = 'heuristic'
  }

  // Estimate compression ratio
  const stopwordRatio =
    text
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => STOPWORDS.has(w.replace(/[^\w]/g, ''))).length /
    wordCount
  const estimatedRatio = 1 - stopwordRatio * 0.5 - redundancyScore * 0.3

  return {
    recommendedStrategy,
    redundancyScore,
    estimatedRatio,
  }
}

/**
 * Estimate quality preservation score
 */
function estimateQuality(original: string, compressed: string): number {
  // Simple heuristic based on key term preservation
  const originalTerms = new Set(
    original
      .toLowerCase()
      .match(/\b\w{4,}\b/g)
      ?.filter((t) => !STOPWORDS.has(t)) || []
  )
  const compressedTerms = new Set(
    compressed
      .toLowerCase()
      .match(/\b\w{4,}\b/g)
      ?.filter((t) => !STOPWORDS.has(t)) || []
  )

  let preserved = 0
  for (const term of originalTerms) {
    if (compressedTerms.has(term)) {
      preserved++
    }
  }

  return originalTerms.size > 0 ? preserved / originalTerms.size : 1
}

/**
 * Prompt Compressor
 *
 * Compresses prompts using heuristic or extractive methods
 * to reduce token usage while preserving semantic meaning.
 */
export class PromptCompressor {
  private defaultConfig: Required<CompressionConfig>

  constructor(config: CompressionConfig = {}) {
    this.defaultConfig = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Compress text using specified strategy
   */
  compress(text: string, config?: Partial<CompressionConfig>): CompressionResult {
    const startTime = performance.now()
    const finalConfig = { ...this.defaultConfig, ...config }

    // Count original tokens
    const originalTokens = countTokens(text)

    // Check minimum tokens
    if (originalTokens < finalConfig.minTokens) {
      return {
        original: text,
        compressed: text,
        originalTokens,
        compressedTokens: originalTokens,
        compressionRatio: 1,
        tokensSaved: 0,
        strategy: 'heuristic',
        qualityScore: 1,
        processingTimeMs: performance.now() - startTime,
      }
    }

    // Determine strategy
    let strategy = finalConfig.strategy
    if (strategy === 'auto') {
      const analysis = analyzeText(text)
      strategy = analysis.recommendedStrategy
    }

    // Apply compression
    let compressed: string
    if (strategy === 'extractive') {
      compressed = compressExtractive(
        text,
        finalConfig.targetRatio,
        finalConfig.preserveStructure
      )
    } else {
      compressed = compressHeuristic(text, finalConfig.preserveStructure)
    }

    // Count compressed tokens
    const compressedTokens = countTokens(compressed)

    // Calculate metrics
    const compressionRatio = originalTokens / Math.max(compressedTokens, 1)
    const qualityScore = estimateQuality(text, compressed)

    // Check quality threshold
    if (qualityScore < finalConfig.qualityThreshold) {
      // Quality too low, return original
      return {
        original: text,
        compressed: text,
        originalTokens,
        compressedTokens: originalTokens,
        compressionRatio: 1,
        tokensSaved: 0,
        strategy,
        qualityScore: 1,
        processingTimeMs: performance.now() - startTime,
      }
    }

    return {
      original: text,
      compressed,
      originalTokens,
      compressedTokens,
      compressionRatio,
      tokensSaved: originalTokens - compressedTokens,
      strategy,
      qualityScore,
      processingTimeMs: performance.now() - startTime,
    }
  }

  /**
   * Analyze compressibility without actually compressing
   */
  analyzeCompressibility(text: string): {
    estimatedRatio: number
    recommendedStrategy: CompressionStrategy
    redundancyScore: number
    originalTokens: number
  } {
    const analysis = analyzeText(text)
    return {
      ...analysis,
      originalTokens: estimateTokens(text),
    }
  }

  /**
   * Compress multiple messages
   */
  compressMessages(
    messages: Array<{ role: string; content: string }>,
    config?: Partial<CompressionConfig>
  ): {
    messages: Array<{ role: string; content: string }>
    totalSaved: number
    compressionRatio: number
  } {
    let totalOriginal = 0
    let totalCompressed = 0
    let totalSaved = 0

    const compressedMessages = messages.map((message) => {
      // Don't compress system messages (usually important)
      if (message.role === 'system') {
        return message
      }

      const result = this.compress(message.content, config)
      totalOriginal += result.originalTokens
      totalCompressed += result.compressedTokens
      totalSaved += result.tokensSaved

      return {
        role: message.role,
        content: result.compressed,
      }
    })

    return {
      messages: compressedMessages,
      totalSaved,
      compressionRatio: totalOriginal / Math.max(totalCompressed, 1),
    }
  }
}

/**
 * Create a prompt compressor
 */
export function createPromptCompressor(
  config?: CompressionConfig
): PromptCompressor {
  return new PromptCompressor(config)
}

/**
 * Quick compress function for one-off use
 */
export function compressPrompt(
  text: string,
  config?: CompressionConfig
): CompressionResult {
  const compressor = new PromptCompressor(config)
  return compressor.compress(text)
}
