import { logger } from '@clarity-chat/utils/logger';
/**
 * Importance Scorer
 *
 * Calculates memory importance scores based on multiple factors including:
 * - Base importance (user-defined or default)
 * - Recency (exponential decay with configurable half-life)
 * - Access frequency (how often the memory is accessed)
 * - Semantic relevance (text similarity when query is provided)
 * - Scope boost (user-scoped memories get priority)
 *
 * The scoring algorithm is inspired by memory systems like Mem0 and Zep,
 * which combine multiple signals for intelligent memory retrieval.
 *
 * @module scoring/importance-scorer
 */

import type { Memory, MemoryScore } from '../types'


/**
 * Weight configuration for scoring components
 */
export interface ScoringWeights {
  base: number
  recency: number
  frequency: number
  relevance: number
}

/**
 * Configuration for the importance scorer
 */
export interface ImportanceScorerConfig {
  /** Half-life for recency decay in days (default: 7) */
  recencyHalfLife?: number
  /** Maximum accesses to normalize frequency against (default: 10) */
  maxFrequencyAccesses?: number
  /** Weight configuration for different scoring components */
  weights?: Partial<ScoringWeights>
}

/**
 * Internal resolved configuration with all values defined
 */
interface ResolvedConfig {
  recencyHalfLife: number
  maxFrequencyAccesses: number
  weights: ScoringWeights
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: ResolvedConfig = {
  recencyHalfLife: 7,
  maxFrequencyAccesses: 10,
  weights: {
    base: 0.2,
    recency: 0.3,
    frequency: 0.2,
    relevance: 0.3,
  },
}

/**
 * Importance Scorer
 *
 * Calculates memory importance scores based on multiple factors.
 * Used for intelligent memory retrieval and context optimization.
 *
 * @example
 * ```typescript
 * const scorer = new ImportanceScorer()
 *
 * // Score a memory without query
 * const score = scorer.score(memory)
 * logger.debug(score.final) // 0.0 - 1.0
 *
 * // Score a memory with query for semantic relevance
 * const scoreWithQuery = scorer.score(memory, "user preferences")
 * logger.debug(scoreWithQuery.semanticRelevance) // Higher if memory content matches query
 * ```
 */
export class ImportanceScorer {
  private config: ResolvedConfig

  constructor(config?: ImportanceScorerConfig) {
    this.config = {
      recencyHalfLife:
        config?.recencyHalfLife ?? DEFAULT_CONFIG.recencyHalfLife,
      maxFrequencyAccesses:
        config?.maxFrequencyAccesses ?? DEFAULT_CONFIG.maxFrequencyAccesses,
      weights: {
        base: config?.weights?.base ?? DEFAULT_CONFIG.weights.base,
        recency: config?.weights?.recency ?? DEFAULT_CONFIG.weights.recency,
        frequency:
          config?.weights?.frequency ?? DEFAULT_CONFIG.weights.frequency,
        relevance:
          config?.weights?.relevance ?? DEFAULT_CONFIG.weights.relevance,
      },
    }
  }

  /**
   * Score a memory based on multiple factors
   *
   * @param memory - The memory item to score
   * @param query - Optional query string for semantic relevance calculation
   * @returns Memory score with breakdown of all components
   */
  score(memory: Memory, query?: string): MemoryScore {
    const base = memory.importance ?? 0.5
    const recency = this.calculateRecency(memory)
    const frequency = this.calculateFrequency(memory)
    const userBoost = memory.scope === 'user' ? 0.1 : 0
    const semanticRelevance = this.calculateSemanticRelevance(memory, query)

    const weights = {
      recencyWeight: this.config.weights.recency,
      frequencyWeight: this.config.weights.frequency,
      relevanceWeight: this.config.weights.relevance,
    }

    const final =
      base * this.config.weights.base +
      recency * weights.recencyWeight +
      frequency * weights.frequencyWeight +
      semanticRelevance * weights.relevanceWeight +
      userBoost

    return {
      base,
      recency,
      frequency,
      userBoost,
      semanticRelevance,
      final: Math.min(1, Math.max(0, final)),
      breakdown: weights,
    }
  }

  /**
   * Score multiple memories and return them sorted by score
   *
   * @param memories - Array of memories to score
   * @param query - Optional query string for semantic relevance
   * @returns Memories with scores, sorted by final score descending
   */
  scoreBatch(
    memories: Memory[],
    query?: string
  ): Array<{ memory: Memory; score: MemoryScore }> {
    return memories
      .map((memory) => ({
        memory,
        score: this.score(memory, query),
      }))
      .sort((a, b) => b.score.final - a.score.final)
  }

  /**
   * Calculate recency score using exponential decay
   *
   * Newer memories score higher. Uses configurable half-life.
   * Formula: e^(-age_days / half_life)
   */
  private calculateRecency(memory: Memory): number {
    const timestamp = memory.timestamp ?? memory.createdAt
    if (!timestamp) return 0.5 // Default for memories without timestamp

    const ageMs = Date.now() - new Date(timestamp).getTime()
    if (ageMs < 0 || isNaN(ageMs)) return 1 // Future or invalid dates get max recency

    const ageDays = ageMs / (1000 * 60 * 60 * 24)

    // Exponential decay with configurable half-life
    return Math.exp((-ageDays * Math.LN2) / this.config.recencyHalfLife)
  }

  /**
   * Calculate frequency score based on access count
   *
   * More accesses = higher importance (normalized to 0-1)
   */
  private calculateFrequency(memory: Memory): number {
    const accesses = memory.accessCount ?? 0
    return Math.min(1, accesses / this.config.maxFrequencyAccesses)
  }

  /**
   * Calculate semantic relevance between memory content and query
   *
   * Uses multiple text similarity techniques:
   * 1. Exact substring match (highest score)
   * 2. Word overlap (Jaccard-like similarity)
   * 3. Keyword matching with TF-IDF-like weighting
   *
   * For production use with embeddings, override this method or use
   * vector similarity scores directly.
   */
  private calculateSemanticRelevance(memory: Memory, query?: string): number {
    // No query = neutral relevance
    if (!query || !query.trim()) return 0.5

    const content = memory.content?.toLowerCase() ?? ''
    const queryLower = query.toLowerCase().trim()

    // Empty content = low relevance
    if (!content) return 0.1

    // Exact substring match gets highest score
    if (content.includes(queryLower)) {
      // Boost score based on how much of the content is the query
      const coverage = queryLower.length / content.length
      return Math.min(1, 0.8 + coverage * 0.2)
    }

    // Calculate word-based similarity
    const contentWords = this.tokenize(content)
    const queryWords = this.tokenize(queryLower)

    if (queryWords.length === 0) return 0.5
    if (contentWords.length === 0) return 0.1

    // Count matching words
    const contentWordSet = new Set(contentWords)
    let matchCount = 0
    let weightedMatchScore = 0

    for (const queryWord of queryWords) {
      if (contentWordSet.has(queryWord)) {
        matchCount++
        // Weight by word length (longer words are more significant)
        weightedMatchScore += Math.min(1, queryWord.length / 5)
      } else {
        // Check for partial matches (prefix matching)
        for (const contentWord of contentWords) {
          if (
            contentWord.startsWith(queryWord) ||
            queryWord.startsWith(contentWord)
          ) {
            matchCount += 0.5
            weightedMatchScore += 0.3
            break
          }
        }
      }
    }

    // Calculate Jaccard-like similarity
    const unionSize = new Set([...contentWords, ...queryWords]).size
    const jaccardSimilarity = matchCount / unionSize

    // Combine weighted score with Jaccard
    const normalizedWeighted = weightedMatchScore / queryWords.length
    const combinedScore = jaccardSimilarity * 0.4 + normalizedWeighted * 0.6

    // Scale to 0.1-0.9 range (reserve extremes for exact/no match)
    return Math.min(0.9, Math.max(0.1, combinedScore * 0.8 + 0.1))
  }

  /**
   * Tokenize text into words, removing common stop words
   */
  private tokenize(text: string): string[] {
    const stopWords = new Set([
      'a',
      'an',
      'the',
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
      'need',
      'dare',
      'ought',
      'used',
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
      'just',
      'and',
      'but',
      'if',
      'or',
      'because',
      'until',
      'while',
      'although',
      'though',
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
      'it',
      'its',
      'itself',
      'they',
      'them',
      'their',
      'theirs',
      'themselves',
      'what',
      'which',
      'who',
      'whom',
      'this',
      'that',
      'these',
      'those',
      'am',
    ])

    return text
      .split(/\s+/)
      .map((word) => word.replace(/[^\w]/g, '').toLowerCase())
      .filter((word) => word.length > 1 && !stopWords.has(word))
  }
}
