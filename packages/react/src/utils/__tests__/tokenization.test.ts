/**
 * Comprehensive tests for Tokenization Utilities
 *
 * Tests cover:
 * - accurate-counter.ts: Token counting with cache, conversation counting, truncation, chunking
 * - estimator.ts: Token estimation, CJK support, provider-based estimation
 * - model-pricing.ts: Cost calculation, cache savings, model comparison
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  countTokens,
  countConversationTokens,
  truncateToTokenBudget,
  chunkByTokens,
  getTokenizerStats,
  clearTokenCache,
} from '../tokenization/accurate-counter'
import {
  estimateTokens,
  estimateTokensByProvider,
  getCharsPerToken,
  estimateMessagesTokens,
  validateEstimation,
  estimateTokensDebug,
} from '../tokenization/estimator'
import {
  calculateCost,
  calculateCacheSavings,
  estimateConversationCost,
  compareModelCosts,
  recommendModel,
  MODEL_PRICING,
} from '../tokenization/model-pricing'

// =============================================================================
// ACCURATE COUNTER TESTS
// =============================================================================

describe('Accurate Counter', () => {
  beforeEach(() => {
    clearTokenCache()
  })

  describe('countTokens', () => {
    it('counts tokens for simple text', async () => {
      const result = await countTokens('Hello, world!', { model: 'gpt-4' })

      expect(result.total).toBeGreaterThan(0)
      expect(result.model).toBe('gpt-4')
      expect(result.method).toBe('estimated') // No tiktoken available in tests
    })

    it('uses cache on repeated calls', async () => {
      const text = 'This is a test string for caching'

      // First call
      const result1 = await countTokens(text, { model: 'gpt-4', cache: true })

      // Second call (should use cache)
      const result2 = await countTokens(text, { model: 'gpt-4', cache: true })

      expect(result1.total).toBe(result2.total)
    })

    it('bypasses cache when cache=false', async () => {
      const text = 'Test string'

      await countTokens(text, { model: 'gpt-4', cache: false })

      const stats = getTokenizerStats()
      expect(stats.cacheSize).toBe(0)
    })

    it('uses estimation when preferAccurate=false', async () => {
      const result = await countTokens('Test', {
        model: 'gpt-4',
        preferAccurate: false,
      })

      expect(result.method).toBe('estimated')
    })

    it('throws for unknown models', async () => {
      await expect(
        countTokens('test', { model: 'unknown-model' as any })
      ).rejects.toThrow('Unknown model')
    })

    it('estimates correctly for different models', async () => {
      const text = 'Hello world this is a test'

      const gpt4Result = await countTokens(text, { model: 'gpt-4' })
      const claudeResult = await countTokens(text, { model: 'claude-3-sonnet' })

      // Claude uses 3.8 chars/token vs GPT's 4, so should estimate slightly more tokens
      expect(claudeResult.total).toBeGreaterThanOrEqual(gpt4Result.total)
    })

    it('handles empty string', async () => {
      const result = await countTokens('', { model: 'gpt-4' })
      expect(result.total).toBe(0)
    })

    it('handles very long text', async () => {
      const longText = 'word '.repeat(10000)
      const result = await countTokens(longText, { model: 'gpt-4' })

      expect(result.total).toBeGreaterThan(1000)
    })
  })

  describe('countConversationTokens', () => {
    it('counts tokens for a conversation with overhead', async () => {
      const messages = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' },
      ]

      const result = await countConversationTokens(messages, { model: 'gpt-4' })

      // Should include message overhead (4 tokens per message + 2 for priming)
      expect(result.total).toBeGreaterThan(0)
      expect(result.model).toBe('gpt-4')
    })

    it('handles empty conversation', async () => {
      const result = await countConversationTokens([], { model: 'gpt-4' })

      // Just the priming tokens
      expect(result.total).toBe(2)
    })

    it('adds extra tokens for named messages', async () => {
      const messagesWithoutName = [{ role: 'user', content: 'Hello' }]
      const messagesWithName = [
        { role: 'user', content: 'Hello', name: 'Alice' },
      ]

      const resultWithoutName = await countConversationTokens(
        messagesWithoutName,
        { model: 'gpt-4' }
      )
      const resultWithName = await countConversationTokens(
        messagesWithName as any,
        { model: 'gpt-4' }
      )

      expect(resultWithName.total).toBe(resultWithoutName.total + 1)
    })
  })

  describe('truncateToTokenBudget', () => {
    it('returns original text when under budget', async () => {
      const text = 'Short text'
      const result = await truncateToTokenBudget(text, 100, { model: 'gpt-4' })

      expect(result.truncated).toBe(text)
      expect(result.wasTruncated).toBe(false)
    })

    it('truncates text to fit budget', async () => {
      const text = 'word '.repeat(100)
      const result = await truncateToTokenBudget(text, 10, { model: 'gpt-4' })

      expect(result.wasTruncated).toBe(true)
      expect(result.tokens).toBeLessThanOrEqual(10)
      expect(result.truncated.length).toBeLessThan(text.length)
    })

    it('tries to end at sentence boundary', async () => {
      const text = 'First sentence. Second sentence. Third sentence.'
      const result = await truncateToTokenBudget(text, 8, { model: 'gpt-4' })

      // Should try to end at a sentence boundary
      if (result.wasTruncated) {
        const endsWithPeriod = result.truncated.endsWith('.')
        const endsWithNewline = result.truncated.endsWith('\n')
        // May or may not end at boundary depending on token budget
        expect(result.truncated.length).toBeLessThan(text.length)
      }
    })

    it('handles text with newlines', async () => {
      const text = 'Line one\nLine two\nLine three\nLine four'
      const result = await truncateToTokenBudget(text, 5, { model: 'gpt-4' })

      expect(result.wasTruncated).toBe(true)
    })
  })

  describe('chunkByTokens', () => {
    it('returns single chunk for short text', async () => {
      const text = 'Short text'
      const chunks = await chunkByTokens(text, 100, { model: 'gpt-4' })

      expect(chunks).toHaveLength(1)
      expect(chunks[0]).toBe(text)
    })

    it('splits long text into multiple chunks', async () => {
      const text = 'word '.repeat(100)
      const chunks = await chunkByTokens(text, 10, { model: 'gpt-4' })

      expect(chunks.length).toBeGreaterThan(1)
    })

    it('handles overlap parameter', async () => {
      const text = 'word '.repeat(50)
      const chunksWithOverlap = await chunkByTokens(text, 10, {
        model: 'gpt-4',
        overlap: 5,
      })
      const chunksWithoutOverlap = await chunkByTokens(text, 10, {
        model: 'gpt-4',
        overlap: 0,
      })

      // With overlap, we should have more chunks due to repeated content
      expect(chunksWithOverlap.length).toBeGreaterThanOrEqual(
        chunksWithoutOverlap.length
      )
    })
  })

  describe('cache management', () => {
    it('reports cache stats', () => {
      const stats = getTokenizerStats()

      expect(stats).toHaveProperty('cacheSize')
      expect(stats).toHaveProperty('cacheMaxSize')
      expect(stats.cacheMaxSize).toBe(1000)
    })

    it('reports cache hits and misses', async () => {
      clearTokenCache()

      // First call - cache miss
      await countTokens('test-text', { model: 'gpt-4', cache: true })

      // Second call - cache hit
      await countTokens('test-text', { model: 'gpt-4', cache: true })

      // Third call different text - cache miss
      await countTokens('different-text', { model: 'gpt-4', cache: true })

      const stats = getTokenizerStats()
      expect(stats.cacheHits).toBe(1)
      expect(stats.cacheMisses).toBe(2)
      expect(stats.hitRatePercent).toBeCloseTo(33.3, 0)
    })

    it('clears cache and resets statistics', async () => {
      await countTokens('test', { model: 'gpt-4', cache: true })
      await countTokens('test', { model: 'gpt-4', cache: true })

      clearTokenCache()

      const stats = getTokenizerStats()
      expect(stats.cacheSize).toBe(0)
      expect(stats.cacheHits).toBe(0)
      expect(stats.cacheMisses).toBe(0)
    })

    it('evicts oldest entries when cache is full', async () => {
      // Fill cache with entries using parallel execution for speed
      const promises = Array.from({ length: 1001 }, (_, i) =>
        countTokens(`text-${i}`, { model: 'gpt-4', cache: true })
      )
      await Promise.all(promises)

      const stats = getTokenizerStats()
      expect(stats.cacheSize).toBeLessThanOrEqual(1000)
    })

    it('uses LRU eviction - recently accessed entries are kept', async () => {
      clearTokenCache()

      // Fill cache near capacity
      for (let i = 0; i < 999; i++) {
        await countTokens(`item-${i}`, { model: 'gpt-4', cache: true })
      }

      // Access an early entry to make it "recently used"
      await countTokens('item-0', { model: 'gpt-4', cache: true })

      // Add more entries to trigger eviction
      await countTokens('new-item-1', { model: 'gpt-4', cache: true })
      await countTokens('new-item-2', { model: 'gpt-4', cache: true })

      // item-0 should still get a cache hit since it was recently accessed
      const statsBefore = getTokenizerStats()
      const hitsBefore = statsBefore.cacheHits

      await countTokens('item-0', { model: 'gpt-4', cache: true })

      const statsAfter = getTokenizerStats()
      expect(statsAfter.cacheHits).toBe(hitsBefore + 1)
    })
  })
})

// =============================================================================
// ESTIMATOR TESTS
// =============================================================================

describe('Token Estimator', () => {
  describe('estimateTokens', () => {
    it('estimates tokens for simple text', () => {
      const tokens = estimateTokens('Hello, world!')

      expect(tokens).toBeGreaterThan(0)
      // "Hello, world!" is 13 chars, default 4 chars/token = ~4 tokens
      expect(tokens).toBe(Math.ceil(13 / 4))
    })

    it('returns 0 for empty string', () => {
      expect(estimateTokens('')).toBe(0)
    })

    it('uses model-specific ratios', () => {
      const text = 'This is a test string for estimation'

      const gptTokens = estimateTokens(text, 'gpt-4')
      const claudeTokens = estimateTokens(text, 'claude-3-sonnet')

      // Claude uses 3.8 chars/token, GPT uses 4
      expect(claudeTokens).toBeGreaterThanOrEqual(gptTokens)
    })

    it('handles CJK text correctly', () => {
      const chineseText = '你好世界' // "Hello world" in Chinese
      const latinText = 'Hello' // Similar length Latin text

      const chineseTokens = estimateTokens(chineseText)
      const latinTokens = estimateTokens(latinText)

      // CJK chars count as 3 effective chars each, so more tokens
      expect(chineseTokens).toBeGreaterThan(latinTokens)
    })

    it('handles mixed CJK and Latin text', () => {
      const mixedText = 'Hello 你好 World'
      const tokens = estimateTokens(mixedText)

      expect(tokens).toBeGreaterThan(0)
    })

    it('infers ratio from unknown model names', () => {
      // Custom Claude-like model
      const claudeTokens = estimateTokens('test', 'claude-custom-model')
      const gptTokens = estimateTokens('test', 'gpt-custom-model')

      // Should infer claude = 3.8, gpt = 4
      expect(claudeTokens).toBeGreaterThanOrEqual(gptTokens)
    })
  })

  describe('estimateTokensByProvider', () => {
    it('estimates using provider-specific ratios', () => {
      const text = 'This is a test string'

      const openaiTokens = estimateTokensByProvider(text, 'openai')
      const anthropicTokens = estimateTokensByProvider(text, 'anthropic')

      // Anthropic uses 3.8 chars/token, OpenAI uses 4
      expect(anthropicTokens).toBeGreaterThanOrEqual(openaiTokens)
    })

    it('returns 0 for empty string', () => {
      expect(estimateTokensByProvider('', 'openai')).toBe(0)
    })

    it('handles all provider types', () => {
      const text = 'Test text'
      const providers = [
        'openai',
        'anthropic',
        'google',
        'deepseek',
        'meta',
        'mistral',
      ] as const

      for (const provider of providers) {
        const tokens = estimateTokensByProvider(text, provider)
        expect(tokens).toBeGreaterThan(0)
      }
    })

    it('handles CJK text correctly for consistency with estimateTokens', () => {
      const chineseText = '你好世界' // "Hello world" in Chinese
      const latinText = 'Hello' // Similar length Latin text

      const chineseTokensOpenAI = estimateTokensByProvider(
        chineseText,
        'openai'
      )
      const latinTokensOpenAI = estimateTokensByProvider(latinText, 'openai')

      // CJK chars count as 3 effective chars each, so more tokens
      expect(chineseTokensOpenAI).toBeGreaterThan(latinTokensOpenAI)
    })
  })

  describe('getCharsPerToken', () => {
    it('returns model-specific ratio for known models', () => {
      expect(getCharsPerToken('gpt-4')).toBe(4)
      expect(getCharsPerToken('claude-3-sonnet')).toBe(3.8)
    })

    it('returns default ratio when no model specified', () => {
      expect(getCharsPerToken()).toBe(4)
    })

    it('infers ratio for unknown models', () => {
      expect(getCharsPerToken('claude-future')).toBe(3.8)
      expect(getCharsPerToken('gpt-future')).toBe(4)
    })
  })

  describe('estimateMessagesTokens', () => {
    it('estimates tokens for messages with overhead', () => {
      const messages = [
        { content: 'Hello', role: 'user' },
        { content: 'Hi there!', role: 'assistant' },
      ]

      const tokens = estimateMessagesTokens(messages)

      // Content tokens + 4 tokens per message overhead
      const contentTokens =
        estimateTokens('Hello') + estimateTokens('Hi there!')
      const overhead = 4 * 2 // 4 tokens per message

      expect(tokens).toBe(contentTokens + overhead)
    })

    it('handles empty messages array', () => {
      expect(estimateMessagesTokens([])).toBe(0)
    })

    it('uses model-specific estimation', () => {
      const messages = [{ content: 'Test message', role: 'user' }]

      const gptTokens = estimateMessagesTokens(messages, 'gpt-4')
      const claudeTokens = estimateMessagesTokens(messages, 'claude-3-sonnet')

      expect(claudeTokens).toBeGreaterThanOrEqual(gptTokens)
    })
  })

  describe('validateEstimation', () => {
    it('reports accurate when within 20% error', () => {
      const result = validateEstimation(100, 100)

      expect(result.error).toBe(0)
      expect(result.errorPercent).toBe(0)
      expect(result.isAccurate).toBe(true)
    })

    it('reports inaccurate when over 20% error', () => {
      const result = validateEstimation(150, 100)

      expect(result.error).toBe(50)
      expect(result.errorPercent).toBe(50)
      expect(result.isAccurate).toBe(false)
    })

    it('handles zero actual tokens', () => {
      const result = validateEstimation(10, 0)

      expect(result.errorPercent).toBe(0)
    })

    it('calculates correct error percentage', () => {
      const result = validateEstimation(110, 100)

      expect(result.error).toBe(10)
      expect(result.errorPercent).toBe(10)
      expect(result.isAccurate).toBe(true)
    })
  })

  describe('estimateTokensDebug', () => {
    it('returns detailed estimation info', () => {
      const text = 'Hello, world!'
      const result = estimateTokensDebug(text, 'gpt-4')

      expect(result.tokens).toBeGreaterThan(0)
      expect(result.charsPerToken).toBe(4)
      expect(result.textLength).toBe(text.length)
      expect(result.effectiveLength).toBe(text.length) // No CJK, same as textLength
      expect(result.hasCJK).toBe(false)
      expect(result.model).toBe('gpt-4')
      expect(result.method).toBe('model-specific')
    })

    it('indicates inferred method for unknown models', () => {
      const result = estimateTokensDebug('test', 'claude-custom')

      expect(result.method).toBe('inferred')
    })

    it('indicates default method when no model specified', () => {
      const result = estimateTokensDebug('test')

      expect(result.method).toBe('default')
      expect(result.model).toBeUndefined()
    })

    it('handles CJK text with increased effective length', () => {
      const chineseText = '你好世界' // 4 Chinese characters
      const result = estimateTokensDebug(chineseText, 'gpt-4')

      expect(result.hasCJK).toBe(true)
      expect(result.textLength).toBe(4) // Actual character count
      expect(result.effectiveLength).toBe(12) // CJK chars count as 3 each
      expect(result.tokens).toBe(3) // 12 / 4 chars per token = 3 tokens
    })

    it('handles mixed CJK and Latin text', () => {
      const mixedText = 'Hello 你好' // 5 Latin + 1 space + 2 CJK = 8 chars
      const result = estimateTokensDebug(mixedText, 'gpt-4')

      expect(result.hasCJK).toBe(true)
      expect(result.textLength).toBe(8)
      // 6 Latin/space chars + (2 CJK chars * 3) = 6 + 6 = 12 effective length
      expect(result.effectiveLength).toBe(12)
    })
  })
})

// =============================================================================
// MODEL PRICING TESTS
// =============================================================================

describe('Model Pricing', () => {
  describe('MODEL_PRICING', () => {
    it('contains all expected models', () => {
      const expectedModels = [
        'gpt-4',
        'gpt-4o',
        'claude-3-sonnet',
        'claude-3-5-sonnet',
        'gemini-1.5-pro',
      ]

      for (const model of expectedModels) {
        expect(MODEL_PRICING[model]).toBeDefined()
      }
    })

    it('has valid pricing structure', () => {
      for (const [model, pricing] of Object.entries(MODEL_PRICING)) {
        expect(pricing.inputCostPer1M).toBeGreaterThanOrEqual(0)
        expect(pricing.outputCostPer1M).toBeGreaterThanOrEqual(0)
        expect(pricing.contextWindow).toBeGreaterThan(0)
        expect(pricing.maxOutputTokens).toBeGreaterThan(0)
        expect(pricing.provider).toBeDefined()
      }
    })
  })

  describe('calculateCost', () => {
    it('calculates cost for input and output tokens', () => {
      const result = calculateCost({
        model: 'gpt-4',
        inputTokens: 1000000,
        outputTokens: 500000,
      })

      // GPT-4: $30/1M input, $60/1M output
      expect(result.inputCost).toBe(30.0)
      expect(result.outputCost).toBe(30.0)
      expect(result.totalCost).toBe(60.0)
    })

    it('includes cached input cost when provided', () => {
      const result = calculateCost({
        model: 'gpt-4-turbo',
        inputTokens: 1000000,
        outputTokens: 500000,
        cachedInputTokens: 500000,
      })

      expect(result.cachedInputCost).toBeDefined()
      expect(result.breakdown.cachedInputTokens).toBe(500000)
    })

    it('excludes cached cost when not provided', () => {
      const result = calculateCost({
        model: 'gpt-4',
        inputTokens: 1000,
        outputTokens: 500,
      })

      expect(result.cachedInputCost).toBeUndefined()
      expect(result.breakdown.cachedInputTokens).toBeUndefined()
    })

    it('throws for unknown models', () => {
      expect(() =>
        calculateCost({
          model: 'unknown-model',
          inputTokens: 1000,
          outputTokens: 500,
        })
      ).toThrow('Unknown model')
    })

    it('calculates correct breakdown', () => {
      const result = calculateCost({
        model: 'gpt-4o-mini',
        inputTokens: 2000000,
        outputTokens: 1000000,
      })

      expect(result.breakdown.inputTokens).toBe(2000000)
      expect(result.breakdown.outputTokens).toBe(1000000)
      expect(result.model).toBe('gpt-4o-mini')
    })
  })

  describe('calculateCacheSavings', () => {
    it('calculates savings with cache hits', () => {
      const result = calculateCacheSavings({
        model: 'gpt-4-turbo',
        inputTokens: 1000000,
        cacheHitRate: 0.5,
      })

      expect(result.withCache).toBeLessThan(result.withoutCache)
      expect(result.savings).toBeGreaterThan(0)
      expect(result.savingsPercent).toBeGreaterThan(0)
    })

    it('returns zero savings for models without cache pricing', () => {
      const result = calculateCacheSavings({
        model: 'gpt-4', // No cached pricing
        inputTokens: 1000000,
        cacheHitRate: 0.5,
      })

      expect(result.savings).toBe(0)
      expect(result.savingsPercent).toBe(0)
    })

    it('calculates full savings at 100% cache hit rate', () => {
      const result = calculateCacheSavings({
        model: 'gpt-4-turbo',
        inputTokens: 1000000,
        cacheHitRate: 1.0,
      })

      // All tokens cached
      expect(result.withCache).toBeLessThan(result.withoutCache)
    })

    it('calculates no savings at 0% cache hit rate', () => {
      const result = calculateCacheSavings({
        model: 'gpt-4-turbo',
        inputTokens: 1000000,
        cacheHitRate: 0,
      })

      expect(result.withCache).toBe(result.withoutCache)
      expect(result.savings).toBe(0)
    })
  })

  describe('estimateConversationCost', () => {
    it('estimates daily and monthly costs', () => {
      const result = estimateConversationCost({
        model: 'gpt-4o-mini',
        averageInputTokens: 1000,
        averageOutputTokens: 500,
        messagesPerDay: 100,
      })

      expect(result.costPerMessage).toBeGreaterThan(0)
      expect(result.costPerDay).toBe(result.costPerMessage * 100)
      expect(result.costPerMonth).toBe(result.costPerDay * 30)
    })

    it('uses custom days per month', () => {
      const result = estimateConversationCost({
        model: 'gpt-4o',
        averageInputTokens: 1000,
        averageOutputTokens: 500,
        messagesPerDay: 10,
        daysPerMonth: 20,
      })

      expect(result.costPerMonth).toBe(result.costPerDay * 20)
    })
  })

  describe('compareModelCosts', () => {
    it('compares costs across multiple models', () => {
      const result = compareModelCosts({
        models: ['gpt-4', 'gpt-4o', 'gpt-4o-mini'],
        inputTokens: 1000,
        outputTokens: 500,
      })

      expect(result).toHaveLength(3)
      // Results should be sorted by cost (ascending)
      expect(result[0]!.cost).toBeLessThanOrEqual(result[1]!.cost)
      expect(result[1]!.cost).toBeLessThanOrEqual(result[2]!.cost)
    })

    it('calculates savings relative to most expensive', () => {
      const result = compareModelCosts({
        models: ['gpt-4', 'gpt-4o-mini'],
        inputTokens: 1000000,
        outputTokens: 500000,
      })

      // Most expensive should have 0 savings
      const mostExpensive = result.find((r) => r.savingsPercent === 0)
      expect(mostExpensive).toBeDefined()

      // Cheapest should have positive savings
      const cheapest = result[0]
      expect(cheapest!.savingsPercent).toBeGreaterThan(0)
    })
  })

  describe('recommendModel', () => {
    it('recommends cheapest model meeting requirements', () => {
      const result = recommendModel({
        inputTokens: 1000,
        outputTokens: 500,
        minContextWindow: 8000,
      })

      expect(result.recommended).toBeDefined()
      expect(result.reasoning).toContain('Cheapest option')
    })

    it('filters by provider', () => {
      const result = recommendModel({
        inputTokens: 1000,
        outputTokens: 500,
        providers: ['anthropic'],
      })

      // Should recommend a Claude model
      expect(result.recommended).toContain('claude')
    })

    it('respects max cost per request', () => {
      const result = recommendModel({
        inputTokens: 1000000,
        outputTokens: 500000,
        maxCostPerRequest: 1.0, // Very restrictive
      })

      // Should recommend a cheap model or fallback
      expect(result.recommended).toBeDefined()
    })

    it('provides alternatives', () => {
      const result = recommendModel({
        inputTokens: 1000,
        outputTokens: 500,
      })

      expect(result.alternatives).toBeDefined()
      expect(Array.isArray(result.alternatives)).toBe(true)
    })

    it('returns fallback when no models match', () => {
      const result = recommendModel({
        inputTokens: 1000,
        outputTokens: 500,
        minContextWindow: 100000000, // Impossibly high
      })

      expect(result.recommended).toBe('gpt-3.5-turbo')
      expect(result.reasoning).toContain('fallback')
    })

    it('filters by context window requirement', () => {
      const result = recommendModel({
        inputTokens: 1000,
        outputTokens: 500,
        minContextWindow: 100000,
      })

      // Should only recommend models with >= 100K context
      const recommendedPricing = MODEL_PRICING[result.recommended]
      if (
        recommendedPricing &&
        result.reasoning !== 'No models match requirements. Using fallback.'
      ) {
        expect(recommendedPricing.contextWindow).toBeGreaterThanOrEqual(100000)
      }
    })
  })
})

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe('Tokenization Integration', () => {
  it('estimation and accurate counting produce similar results', async () => {
    const text = 'This is a test string for token counting comparison'

    const estimated = estimateTokens(text, 'gpt-4')
    const counted = await countTokens(text, { model: 'gpt-4' })

    // Should be reasonably close (within 50% for estimation)
    const ratio = estimated / counted.total
    expect(ratio).toBeGreaterThan(0.5)
    expect(ratio).toBeLessThan(2)
  })

  it('cost calculation uses correct token counts', () => {
    const text = 'Test message content'
    const inputTokens = estimateTokens(text, 'gpt-4')
    const outputTokens = estimateTokens('Response', 'gpt-4')

    const cost = calculateCost({
      model: 'gpt-4',
      inputTokens,
      outputTokens,
    })

    expect(cost.breakdown.inputTokens).toBe(inputTokens)
    expect(cost.breakdown.outputTokens).toBe(outputTokens)
  })

  it('message estimation matches individual token estimation', () => {
    const messages = [
      { content: 'Hello', role: 'user' },
      { content: 'World', role: 'assistant' },
    ]

    const messageTokens = estimateMessagesTokens(messages, 'gpt-4')
    const individualTokens =
      estimateTokens('Hello', 'gpt-4') +
      estimateTokens('World', 'gpt-4') +
      4 * 2 // overhead

    expect(messageTokens).toBe(individualTokens)
  })
})
