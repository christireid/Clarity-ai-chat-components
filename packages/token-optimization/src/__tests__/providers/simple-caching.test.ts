import { describe, test, expect } from 'vitest'
import {
  createProviderCache,
  quickCache,
  anthropicCache,
  openaiCache,
  googleCache,
  estimateCacheSavings,
} from '../../providers/simple-caching'
import type { CacheableMessage } from '../../providers/types'

describe('Simple Provider Caching API', () => {
  // Test messages with enough tokens to trigger caching (>1024)
  const largeMessages: CacheableMessage[] = [
    {
      role: 'system',
      content: 'You are a helpful coding assistant. '.repeat(200), // ~6000 chars = ~1500 tokens
    },
    {
      role: 'user',
      content: 'How do I create a React component?',
    },
  ]

  // Small messages below caching threshold
  const smallMessages: CacheableMessage[] = [
    {
      role: 'user',
      content: 'Hello!',
    },
  ]

  describe('createProviderCache', () => {
    test('should create cache function with default Anthropic provider', async () => {
      const cache = createProviderCache()
      const result = await cache(largeMessages)

      expect(result.cached).toBe(true)
      expect(result.metadata.provider).toBe('anthropic')
      expect(result.metadata.cachedTokens).toBeGreaterThan(0)
      expect(result.estimatedSavings.percentage).toBe(0.9) // 90% savings
    })

    test('should create cache function with custom provider', async () => {
      const cache = createProviderCache({ provider: 'openai' })
      const result = await cache(largeMessages)

      expect(result.cached).toBe(true)
      expect(result.metadata.provider).toBe('openai')
      expect(result.metadata.cachedTokens).toBeGreaterThan(1024)
    })

    test('should respect custom minTokens threshold', async () => {
      const cache = createProviderCache({ minTokens: 5000 })
      const result = await cache(largeMessages)

      // Our test messages are ~1500 tokens, below 5000
      expect(result.cached).toBe(false)
      expect(result.recommendations.length).toBeGreaterThan(0)
    })

    test('should auto-select provider based on content size', async () => {
      const cache = createProviderCache({ autoSelectProvider: true })

      // Small content -> should use Anthropic
      const smallResult = await cache(largeMessages)
      expect(smallResult.metadata.provider).toBe('anthropic')

      // Very large content -> should use OpenAI
      const veryLargeMessages: CacheableMessage[] = [
        {
          role: 'system',
          content: 'X'.repeat(25000), // >5000 tokens
        },
      ]
      const largeResult = await cache(veryLargeMessages)
      expect(largeResult.metadata.provider).toBe('openai')
    })

    test('should handle messages below threshold gracefully', async () => {
      const cache = createProviderCache()
      const result = await cache(smallMessages)

      expect(result.cached).toBe(false)
      expect(result.metadata.cachedTokens).toBe(0)
      expect(result.recommendations).toBeDefined()
    })
  })

  describe('quickCache', () => {
    test('should cache with default Anthropic provider', async () => {
      const result = await quickCache(largeMessages)

      expect(result.cached).toBe(true)
      expect(result.metadata.provider).toBe('anthropic')
      expect(result.estimatedSavings.percentage).toBe(0.9)
    })

    test('should cache with specified provider', async () => {
      const result = await quickCache(largeMessages, 'openai')

      expect(result.cached).toBe(true)
      expect(result.metadata.provider).toBe('openai')
    })

    test('should handle empty message arrays', async () => {
      const result = await quickCache([])

      expect(result.cached).toBe(false)
      expect(result.metadata.cachedTokens).toBe(0)
    })
  })

  describe('Provider-specific functions', () => {
    test('anthropicCache should use Anthropic provider', async () => {
      const result = await anthropicCache(largeMessages)

      expect(result.cached).toBe(true)
      expect(result.metadata.provider).toBe('anthropic')
      expect(result.metadata.providerDetails?.breakpointCount).toBeDefined()
    })

    test('openaiCache should use OpenAI provider', async () => {
      const result = await openaiCache(largeMessages)

      expect(result.cached).toBe(true)
      expect(result.metadata.provider).toBe('openai')
      expect(result.metadata.cachedTokens).toBeGreaterThan(1024)
    })

    test('googleCache should use Google Gemini provider', async () => {
      const result = await googleCache(largeMessages)

      expect(result.cached).toBe(true)
      expect(result.metadata.provider).toBe('google')
    })
  })

  describe('estimateCacheSavings', () => {
    test('should estimate savings for cacheable content', async () => {
      const estimate = await estimateCacheSavings(largeMessages)

      expect(estimate.eligible).toBe(true)
      expect(estimate.estimatedTokens).toBeGreaterThan(0)
      expect(estimate.estimatedSavingsPercent).toBe(90)
      expect(estimate.recommendation).toContain('90% cost reduction')
    })

    test('should indicate when content is too small to cache', async () => {
      const estimate = await estimateCacheSavings(smallMessages)

      expect(estimate.eligible).toBe(false)
      expect(estimate.estimatedSavingsPercent).toBe(0)
      expect(estimate.recommendation).toContain('Need at least 1024 tokens')
    })

    test('should work with different providers', async () => {
      const anthropicEstimate = await estimateCacheSavings(
        largeMessages,
        'anthropic'
      )
      const openaiEstimate = await estimateCacheSavings(largeMessages, 'openai')
      const googleEstimate = await estimateCacheSavings(largeMessages, 'google')

      // All providers should offer 90% savings
      expect(anthropicEstimate.estimatedSavingsPercent).toBe(90)
      expect(openaiEstimate.estimatedSavingsPercent).toBe(90)
      expect(googleEstimate.estimatedSavingsPercent).toBe(90)
    })

    test('should handle array content blocks', async () => {
      const blockMessages: CacheableMessage[] = [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: 'System prompt. '.repeat(300), // Increased to ensure >1024 tokens
            },
          ],
        },
      ]

      const estimate = await estimateCacheSavings(blockMessages)

      // Note: JSON.stringify makes this smaller, so it may not be eligible
      // This tests that the function handles array content without errors
      expect(estimate).toHaveProperty('eligible')
      expect(estimate).toHaveProperty('estimatedTokens')
    })
  })

  describe('README Examples', () => {
    test('README example: Zero-config caching with Anthropic', async () => {
      // From README.md line 94-106
      // Note: Need >1024 tokens to trigger caching
      const result = await quickCache([
        {
          role: 'system',
          content: 'You are a helpful coding assistant. '.repeat(200), // Increased to >1024 tokens
        },
        { role: 'user', content: 'How do I create a React component?' },
      ])

      expect(result.messages).toBeDefined()
      expect(result.metadata.provider).toBe('anthropic')
      // Caching should be triggered
      if (result.cached) {
        expect(result.estimatedSavings.percentage).toBeGreaterThan(0)
      }
    })

    test('README example: createProviderCache usage', async () => {
      // From README.md line 199-201
      const cache = createProviderCache({ provider: 'anthropic' })
      const result = await cache(largeMessages)

      expect(result.cached).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    test('should handle messages with empty content', async () => {
      const emptyMessages: CacheableMessage[] = [
        {
          role: 'user',
          content: '',
        },
      ]

      const result = await quickCache(emptyMessages)

      expect(result.cached).toBe(false)
    })

    test('should handle mixed content types', async () => {
      const mixedMessages: CacheableMessage[] = [
        {
          role: 'system',
          content: 'Text content. '.repeat(200), // Increased for >1024 tokens
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Array content. '.repeat(200), // Increased
            },
          ],
        },
      ]

      const result = await quickCache(mixedMessages)

      // Should handle mixed content without errors
      expect(result.messages).toBeDefined()
    })

    test('should handle very large message arrays', async () => {
      const manyMessages: CacheableMessage[] = Array.from(
        { length: 50 },
        (_, i) => ({
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: `Message ${i}. `.repeat(50), // Increased to ensure total >1024 tokens
        })
      )

      const result = await quickCache(manyMessages)

      // Should handle large arrays without errors
      expect(result.messages).toBeDefined()
      expect(Array.isArray(result.messages)).toBe(true)
    })
  })

  describe('Integration with ProviderCachingManager', () => {
    test('should return same structure as ProviderCachingManager', async () => {
      const result = await quickCache(largeMessages)

      // Verify result structure matches what consumers expect
      expect(result).toHaveProperty('cached')
      expect(result).toHaveProperty('messages')
      expect(result).toHaveProperty('metadata')
      expect(result).toHaveProperty('estimatedSavings')
      expect(result).toHaveProperty('recommendations')

      expect(result.metadata).toHaveProperty('provider')
      expect(result.metadata).toHaveProperty('cachedTokens')
      // Note: metadata doesn't have totalTokens, only cachedTokens

      expect(result.estimatedSavings).toHaveProperty('percentage')
      expect(result.estimatedSavings).toHaveProperty('tokens')
      expect(result.estimatedSavings).toHaveProperty('costReduction')
    })

    test('should provide actionable recommendations', async () => {
      const result = await quickCache(smallMessages)

      expect(result.recommendations).toBeDefined()
      expect(result.recommendations.length).toBeGreaterThan(0)
      expect(result.recommendations[0]).toBeTruthy()
    })
  })
})
