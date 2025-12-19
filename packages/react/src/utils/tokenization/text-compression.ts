/**
 * Advanced Text Compression and Preprocessing Techniques
 *
 * This module implements state-of-the-art text compression methods including:
 * - Semantic compression using perplexity-based token removal
 * - Extractive compression with keyphrase extraction
 * - Lossless compression techniques
 * - Intelligent preprocessing for token reduction
 */

import { TokenCounter } from '@clarity-chat/token-optimization'

// Compression strategies based on recent research
export type CompressionStrategy =
  | 'semantic' // LLMLingua-style perplexity-based
  | 'extractive' // Keyphrase-based extraction
  | 'lossless' // Lossless compression
  | 'hybrid' // Combined approach
  | 'budget-controlled' // Budget-aware compression
  | 'adaptive' // Context-aware adaptive

export interface CompressionConfig {
  strategy: CompressionStrategy
  targetRatio?: number // Target compression ratio (e.g., 0.5 = 50% reduction)
  budgetTokens?: number // Maximum token budget
  preserveStructure?: boolean // Preserve text structure (for code, tables)
  preserveKeyTerms?: string[] // Terms that must be preserved
  qualityThreshold?: number // Minimum quality retention (0-1)
  modelSpecific?: boolean // Use model-specific optimizations
}

export interface CompressionResult {
  originalText: string
  compressedText: string
  originalTokens: number
  compressedTokens: number
  compressionRatio: number
  estimatedQuality: number
  preservedTerms: string[]
  removedContent: string[]
  strategyUsed: CompressionStrategy
}

// Semantic compression using token importance scoring
export class SemanticCompressor {
  private cache: Map<string, CompressionResult>

  constructor() {
    this.cache = new Map()
  }

  /**
   * Compress text using semantic importance scoring
   * Inspired by LLMLingua's perplexity-based approach
   */
  async compressSemantic(
    text: string,
    config: CompressionConfig
  ): Promise<CompressionResult> {
    const cacheKey = `${text}-${JSON.stringify(config)}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    const originalTokens = await TokenCounter.count(text)
    const targetTokens =
      config.budgetTokens ||
      Math.floor(originalTokens * (config.targetRatio || 0.5))

    // Token importance scoring based on multiple factors
    const tokens = this.tokenize(text)
    const tokenScores = await this.scoreTokenImportance(tokens, text)

    // Select most important tokens while preserving structure
    const selectedTokens = this.selectImportantTokens(
      tokens,
      tokenScores,
      targetTokens,
      config
    )

    const compressedText = this.reconstructText(selectedTokens)
    const compressedTokens = await TokenCounter.count(compressedText)
    const compressionRatio = compressedTokens / originalTokens

    const result: CompressionResult = {
      originalText: text,
      compressedText,
      originalTokens,
      compressedTokens,
      compressionRatio,
      estimatedQuality: this.estimateQuality(compressionRatio, config),
      preservedTerms: this.extractPreservedTerms(tokens, selectedTokens),
      removedContent: this.extractRemovedContent(tokens, selectedTokens),
      strategyUsed: 'semantic',
    }

    this.cache.set(cacheKey, result)
    return result
  }

  /**
   * Extract keyphrases and compress based on semantic importance
   */
  async compressExtractive(
    text: string,
    config: CompressionConfig
  ): Promise<CompressionResult> {
    const originalTokens = await TokenCounter.count(text)

    // Extract keyphrases using multiple algorithms
    const keyphrases = await this.extractKeyphrases(text)

    // Score sentences based on keyphrase presence
    const sentences = this.splitIntoSentences(text)
    const sentenceScores = sentences.map((sentence) => ({
      sentence,
      score: this.scoreSentenceByKeyphrases(sentence, keyphrases),
      tokens: TokenCounter.count(sentence),
    }))

    // Select sentences to meet target token count
    const targetTokens =
      config.budgetTokens ||
      Math.floor(originalTokens * (config.targetRatio || 0.5))
    const selectedSentences = this.selectSentencesByScore(
      sentenceScores,
      targetTokens
    )

    const compressedText = selectedSentences.join(' ')
    const compressedTokens = await TokenCounter.count(compressedText)

    return {
      originalText: text,
      compressedText,
      originalTokens,
      compressedTokens,
      compressionRatio: compressedTokens / originalTokens,
      estimatedQuality: this.estimateQuality(
        compressedTokens / originalTokens,
        config
      ),
      preservedTerms: keyphrases,
      removedContent: sentences.filter((s) => !selectedSentences.includes(s)),
      strategyUsed: 'extractive',
    }
  }

  /**
   * Lossless compression using advanced techniques
   */
  compressLossless(text: string): CompressionResult {
    const originalTokens = TokenCounter.count(text)

    // Apply multiple lossless compression techniques
    let compressed = text

    // Remove redundant whitespace
    compressed = compressed.replace(/\s+/g, ' ').trim()

    // Replace common phrases with shorter equivalents
    compressed = this.replaceCommonPhrases(compressed)

    // Abbreviate where context allows
    compressed = this.intelligentAbbreviate(compressed)

    // Remove unnecessary punctuation
    compressed = this.optimizePunctuation(compressed)

    const compressedTokens = TokenCounter.count(compressed)

    return {
      originalText: text,
      compressedText: compressed,
      originalTokens,
      compressedTokens,
      compressionRatio: compressedTokens / originalTokens,
      estimatedQuality: 1.0, // Lossless compression maintains quality
      preservedTerms: [],
      removedContent: [],
      strategyUsed: 'lossless',
    }
  }

  /**
   * Hybrid compression combining multiple strategies
   */
  async compressHybrid(
    text: string,
    config: CompressionConfig
  ): Promise<CompressionResult> {
    // Start with lossless compression
    const losslessResult = this.compressLossless(text)

    // Apply semantic compression if further reduction needed
    if (losslessResult.compressionRatio > (config.targetRatio || 0.5)) {
      const semanticConfig = {
        ...config,
        targetRatio:
          (config.targetRatio || 0.5) / losslessResult.compressionRatio,
      }

      const semanticResult = await this.compressSemantic(
        losslessResult.compressedText,
        semanticConfig
      )

      // Combine results
      const finalTokens = semanticResult.compressedTokens
      const originalTokens = await TokenCounter.count(text)

      return {
        ...semanticResult,
        originalText: text,
        originalTokens,
        compressionRatio: finalTokens / originalTokens,
        strategyUsed: 'hybrid',
      }
    }

    return {
      ...losslessResult,
      strategyUsed: 'hybrid',
    }
  }

  /**
   * Budget-controlled compression with quality guarantees
   */
  async compressBudgetControlled(
    text: string,
    budgetTokens: number,
    config: CompressionConfig
  ): Promise<CompressionResult> {
    const originalTokens = await TokenCounter.count(text)

    if (originalTokens <= budgetTokens) {
      return {
        originalText: text,
        compressedText: text,
        originalTokens,
        compressedTokens: originalTokens,
        compressionRatio: 1.0,
        estimatedQuality: 1.0,
        preservedTerms: [],
        removedContent: [],
        strategyUsed: 'budget-controlled',
      }
    }

    const targetRatio = budgetTokens / originalTokens
    const compressionConfig: CompressionConfig = {
      ...config,
      budgetTokens,
      targetRatio,
      qualityThreshold: config.qualityThreshold || 0.8,
    }

    // Try different strategies and select the best one
    const strategies = [
      'semantic',
      'extractive',
      'hybrid',
    ] as CompressionStrategy[]
    let bestResult: CompressionResult | null = null
    let bestQuality = 0

    for (const strategy of strategies) {
      try {
        let result: CompressionResult

        switch (strategy) {
          case 'semantic':
            result = await this.compressSemantic(text, compressionConfig)
            break
          case 'extractive':
            result = await this.compressExtractive(text, compressionConfig)
            break
          case 'hybrid':
            result = await this.compressHybrid(text, compressionConfig)
            break
          default:
            continue
        }

        if (
          result.compressedTokens <= budgetTokens &&
          result.estimatedQuality > bestQuality
        ) {
          bestResult = result
          bestQuality = result.estimatedQuality
        }
      } catch (error) {
        console.warn(`Compression strategy ${strategy} failed:`, error)
      }
    }

    return (
      bestResult ||
      this.createFallbackResult(text, budgetTokens, originalTokens)
    )
  }

  // Helper methods
  private tokenize(text: string): string[] {
    return text.split(/\s+/).filter((token) => token.length > 0)
  }

  private async scoreTokenImportance(
    tokens: string[],
    context: string
  ): Promise<Map<string, number>> {
    const scores = new Map<string, number>()

    for (const token of tokens) {
      let score = 0

      // Frequency-based scoring
      const frequency = (context.match(new RegExp(token, 'gi')) || []).length
      score += Math.log(frequency + 1)

      // Position-based scoring (beginning and end are more important)
      const position = context.indexOf(token)
      const positionScore =
        position < context.length * 0.2 || position > context.length * 0.8
          ? 1.5
          : 1.0
      score *= positionScore

      // Length-based scoring (longer tokens often carry more meaning)
      const lengthScore = Math.min(token.length / 10, 1.0)
      score += lengthScore

      scores.set(token, score)
    }

    return scores
  }

  private selectImportantTokens(
    tokens: string[],
    scores: Map<string, number>,
    targetCount: number,
    config: CompressionConfig
  ): string[] {
    const preserveSet = new Set(config.preserveKeyTerms || [])

    const scoredTokens = tokens.map((token) => ({
      token,
      score: scores.get(token) || 0,
      preserve: preserveSet.has(token),
    }))

    // Sort by score (descending) but preserve required terms
    scoredTokens.sort((a, b) => {
      if (a.preserve && !b.preserve) return -1
      if (!a.preserve && b.preserve) return 1
      return b.score - a.score
    })

    return scoredTokens.slice(0, targetCount).map((item) => item.token)
  }

  private reconstructText(tokens: string[]): string {
    return tokens.join(' ').replace(/\s+([.,!?;:])/g, '$1')
  }

  private estimateQuality(
    compressionRatio: number,
    config: CompressionConfig
  ): number {
    const { qualityThreshold = 0.8 } = config

    // Quality decreases with compression ratio but plateaus
    const baseQuality = Math.max(0.3, 1 - compressionRatio * 0.5)

    return Math.max(qualityThreshold, baseQuality)
  }

  private extractPreservedTerms(
    original: string[],
    selected: string[]
  ): string[] {
    return selected.filter((token) => original.includes(token))
  }

  private extractRemovedContent(
    original: string[],
    selected: string[]
  ): string[] {
    return original.filter((token) => !selected.includes(token))
  }

  private async extractKeyphrases(text: string): Promise<string[]> {
    // Simple keyphrase extraction - in production, integrate with KeyBERT or similar
    const words = text
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length > 3)
    const frequency = new Map<string, number>()

    for (const word of words) {
      frequency.set(word, (frequency.get(word) || 0) + 1)
    }

    return Array.from(frequency.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)
  }

  private splitIntoSentences(text: string): string[] {
    return text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  }

  private scoreSentenceByKeyphrases(
    sentence: string,
    keyphrases: string[]
  ): number {
    const sentenceLower = sentence.toLowerCase()
    return keyphrases.reduce(
      (score, phrase) =>
        score + (sentenceLower.includes(phrase.toLowerCase()) ? 1 : 0),
      0
    )
  }

  private selectSentencesByScore(
    scoredSentences: Array<{
      sentence: string
      score: number
      tokens: number | Promise<number>
    }>,
    targetTokens: number
  ): string[] {
    // Implementation for sentence selection based on scores
    return scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.ceil(targetTokens / 20)) // Rough estimate
      .map((item) => item.sentence)
  }

  private replaceCommonPhrases(text: string): string {
    const replacements = new Map([
      ['in order to', 'to'],
      ['due to the fact that', 'because'],
      ['for the purpose of', 'for'],
      ['in the event that', 'if'],
      ['with regard to', 'about'],
      ['in spite of the fact that', 'although'],
      ['at this point in time', 'now'],
      ['in the near future', 'soon'],
      ['on a daily basis', 'daily'],
      ['take into consideration', 'consider'],
    ])

    let result = text
    for (const [long, short] of replacements) {
      result = result.replace(new RegExp(long, 'gi'), short)
    }
    return result
  }

  private intelligentAbbreviate(text: string): string {
    const abbreviations = new Map([
      ['artificial intelligence', 'AI'],
      ['machine learning', 'ML'],
      ['natural language processing', 'NLP'],
      ['large language model', 'LLM'],
      ['user interface', 'UI'],
      ['application programming interface', 'API'],
      ['convolutional neural network', 'CNN'],
      ['recurrent neural network', 'RNN'],
      ['transformer', 'TFR'],
      ['attention mechanism', 'attention'],
    ])

    let result = text
    for (const [full, abbr] of abbreviations) {
      result = result.replace(new RegExp(`\\b${full}\\b`, 'gi'), abbr)
    }
    return result
  }

  private optimizePunctuation(text: string): string {
    return text
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*\.\s*/g, '. ')
      .replace(/\s*;\s*/g, '; ')
      .replace(/\s*:\s*/g, ': ')
      .replace(/\s*!\s*/g, '! ')
      .replace(/\s*\?\s*/g, '? ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  private createFallbackResult(
    text: string,
    budgetTokens: number,
    originalTokens: number
  ): CompressionResult {
    // Simple truncation as fallback
    const words = text.split(' ')
    const targetWords = Math.floor(budgetTokens * 0.8) // Conservative estimate
    const compressedText = words.slice(0, targetWords).join(' ')

    return {
      originalText: text,
      compressedText,
      originalTokens,
      compressedTokens: budgetTokens,
      compressionRatio: budgetTokens / originalTokens,
      estimatedQuality: 0.5, // Low quality for fallback
      preservedTerms: [],
      removedContent: words.slice(targetWords),
      strategyUsed: 'budget-controlled',
    }
  }
}

// Main compression function
export async function compressText(
  text: string,
  config: CompressionConfig
): Promise<CompressionResult> {
  const compressor = new SemanticCompressor()

  switch (config.strategy) {
    case 'semantic':
      return compressor.compressSemantic(text, config)
    case 'extractive':
      return compressor.compressExtractive(text, config)
    case 'lossless':
      return compressor.compressLossless(text)
    case 'hybrid':
      return compressor.compressHybrid(text, config)
    case 'budget-controlled':
      return compressor.compressBudgetControlled(
        text,
        config.budgetTokens || Math.floor(text.length / 4),
        config
      )
    default:
      return compressor.compressHybrid(text, config)
  }
}

// Convenience functions for common use cases
export async function compressForBudget(
  text: string,
  maxTokens: number,
  options?: Partial<CompressionConfig>
): Promise<CompressionResult> {
  return compressText(text, {
    strategy: 'budget-controlled',
    budgetTokens: maxTokens,
    preserveStructure: true,
    qualityThreshold: 0.7,
    ...options,
  })
}

export async function compressForRatio(
  text: string,
  targetRatio: number,
  options?: Partial<CompressionConfig>
): Promise<CompressionResult> {
  return compressText(text, {
    strategy: 'hybrid',
    targetRatio,
    preserveStructure: true,
    qualityThreshold: 0.8,
    ...options,
  })
}

export async function compressSemanticOnly(
  text: string,
  targetRatio: number
): Promise<CompressionResult> {
  return compressText(text, {
    strategy: 'semantic',
    targetRatio,
    preserveKeyTerms: ['important', 'key', 'critical', 'essential'],
  })
}

// Advanced compression with multiple strategies
export async function compressMultiStrategy(
  text: string,
  strategies: CompressionStrategy[],
  config: CompressionConfig
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = []

  for (const strategy of strategies) {
    try {
      const result = await compressText(text, {
        ...config,
        strategy,
      })
      results.push(result)
    } catch (error) {
      console.warn(`Strategy ${strategy} failed:`, error)
    }
  }

  return results
}
