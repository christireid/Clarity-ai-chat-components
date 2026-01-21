import { describe, test, expect, beforeEach } from 'vitest'
import {
  ProviderCachingManager,
  applyProviderCaching,
  parseOpenAICacheMetrics,
} from '../../providers/prompt-caching'
import type {
  CacheableMessage,
  ProviderCachingConfig,
  OpenAIUsageMetadata,
  TokenCounter,
} from '../../providers/types'

// Mock token counter
class MockTokenCounter implements TokenCounter {
  count(text: string): number {
    // Rough estimate: ~4 chars per token
    return Math.ceil(text.length / 4)
  }

  countBatch(texts: string[]): number {
    return texts.reduce((sum, text) => sum + this.count(text), 0)
  }
}

describe('ProviderCachingManager', () => {
  let tokenCounter: TokenCounter
  let messages: CacheableMessage[]

  beforeEach(() => {
    tokenCounter = new MockTokenCounter()

    // Create test messages with enough tokens (>1024) to trigger caching
    // ~30 chars * 200 = 6000 chars / 4 = 1500 tokens
    messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant. '.repeat(200),
        cacheable: true,
      },
      {
        role: 'user',
        content: 'What is the weather today?',
        cacheable: false,
      },
    ]
  })

  describe('Anthropic Caching', () => {
    test('should apply cache_control breakpoints to cacheable messages', async () => {
      const manager = new ProviderCachingManager(
        {
          enabled: true,
          provider: 'anthropic',
          anthropic: {
            minCachedTokens: 1024,
            maxBreakpoints: 4,
          },
        },
        tokenCounter
      )

      const result = await manager.applyCaching(messages, 'anthropic')

      expect(result.cached).toBe(true)
      expect(result.metadata.provider).toBe('anthropic')
      expect(result.metadata.cachedTokens).toBeGreaterThan(0)
      expect(result.estimatedSavings.percentage).toBe(0.9) // 90% savings
      expect(result.recommendations).toBeDefined()
    })

    test('should not cache messages below minimum token threshold', async () => {
      const manager = new ProviderCachingManager(
        {
          enabled: true,
          provider: 'anthropic',
          anthropic: {
            minCachedTokens: 5000, // Set very high
            maxBreakpoints: 4,
          },
        },
        tokenCounter
      )

      const smallMessages: CacheableMessage[] = [
        {
          role: 'user',
          content: 'Hello',
          cacheable: true,
        },
      ]

      const result = await manager.applyCaching(smallMessages, 'anthropic')

      expect(result.cached).toBe(false)
      expect(result.metadata.cachedTokens).toBe(0)
      expect(result.recommendations.length).toBeGreaterThan(0)
    })

    test('should respect max breakpoints limit', async () => {
      const manager = new ProviderCachingManager(
        {
          enabled: true,
          provider: 'anthropic',
          anthropic: {
            minCachedTokens: 100, // Very low to trigger caching
            maxBreakpoints: 2, // Limit to 2
          },
        },
        tokenCounter
      )

      const manyMessages: CacheableMessage[] = Array.from(
        { length: 5 },
        (_, i) => ({
          role: 'system',
          content: 'System message '.repeat(100), // Large enough to cache
          cacheable: true,
        })
      )

      const result = await manager.applyCaching(manyMessages, 'anthropic')

      expect(
        result.metadata.providerDetails?.breakpointCount
      ).toBeLessThanOrEqual(2)
      expect(result.recommendations).toBeDefined()
    })

    test('should use correct TTL from config', async () => {
      const manager = new ProviderCachingManager(
        {
          enabled: true,
          provider: 'anthropic',
          anthropic: {
            defaultTTL: '1h',
            minCachedTokens: 1024,
          },
        },
        tokenCounter
      )

      const result = await manager.applyCaching(messages, 'anthropic')

      expect(result.metadata.providerDetails?.ttl).toBe('1h')
    })
  })

  describe('OpenAI Caching', () => {
    test('should optimize message order for automatic caching', async () => {
      const manager = new ProviderCachingManager(
        {
          enabled: true,
          provider: 'openai',
          openai: {
            optimizeMessageOrder: true,
          },
        },
        tokenCounter
      )

      const result = await manager.applyCaching(messages, 'openai')

      expect(result.cached).toBe(true)
      expect(result.metadata.provider).toBe('openai')
      expect(result.metadata.cachedTokens).toBeGreaterThan(1024)
    })

    test('should not cache prompts below 1024 tokens', async () => {
      const manager = new ProviderCachingManager(
        {
          enabled: true,
          provider: 'openai',
        },
        tokenCounter
      )

      const smallMessages: CacheableMessage[] = [
        {
          role: 'user',
          content: 'Hi',
          cacheable: true,
        },
      ]

      const result = await manager.applyCaching(smallMessages, 'openai')

      expect(result.cached).toBe(false)
      expect(result.metadata.cachedTokens).toBe(0)
      expect(result.recommendations.length).toBeGreaterThan(0)
    })

    test('parseOpenAIUsage should extract cache metrics', () => {
      const usage: OpenAIUsageMetadata = {
        prompt_tokens: 2000,
        completion_tokens: 500,
        total_tokens: 2500,
        prompt_tokens_details: {
          cached_tokens: 1800, // 90% cached
        },
      }

      const metrics = parseOpenAICacheMetrics(usage)

      expect(metrics.cachedTokens).toBe(1800)
      expect(metrics.totalTokens).toBe(2500)
      expect(metrics.cacheHitRate).toBe(0.9) // 1800/2000
      expect(metrics.costSavings).toBeCloseTo(0.81) // 0.9 * 0.9
    })
  })

  describe('Google Gemini Caching', () => {
    test('should apply implicit caching for large prompts', async () => {
      const manager = new ProviderCachingManager(
        {
          enabled: true,
          provider: 'google',
          google: {
            mode: 'implicit',
          },
        },
        tokenCounter
      )

      const result = await manager.applyCaching(messages, 'google')

      expect(result.cached).toBe(true)
      expect(result.metadata.provider).toBe('google')
      expect(result.metadata.cachedTokens).toBeGreaterThan(0)
    })

    test('should handle explicit caching mode', async () => {
      const manager = new ProviderCachingManager(
        {
          enabled: true,
          provider: 'google',
          google: {
            mode: 'explicit',
            defaultTTL: '7200s',
            cacheId: 'test-cache-123',
          },
        },
        tokenCounter
      )

      const result = await manager.applyCaching(messages, 'google')

      expect(result.cached).toBe(true)
      expect(result.metadata.cacheKey).toContain('test-cache-123')
      expect(result.metadata.expiresAt).toBeDefined()
      expect(result.recommendations.length).toBeGreaterThan(0)
    })

    test('should not cache small prompts in implicit mode', async () => {
      const manager = new ProviderCachingManager(
        {
          enabled: true,
          provider: 'google',
          google: {
            mode: 'implicit',
          },
        },
        tokenCounter
      )

      const smallMessages: CacheableMessage[] = [
        {
          role: 'user',
          content: 'Hello',
        },
      ]

      const result = await manager.applyCaching(smallMessages, 'google')

      expect(result.cached).toBe(false)
      expect(result.recommendations.length).toBeGreaterThan(0)
    })
  })

  describe('Configuration Management', () => {
    test('should allow config updates', () => {
      const manager = new ProviderCachingManager({
        enabled: true,
        provider: 'anthropic',
      })

      manager.updateConfig({
        provider: 'openai',
      })

      const config = manager.getConfig()
      expect(config.provider).toBe('openai')
    })

    test('should return disabled result when caching is disabled', async () => {
      const manager = new ProviderCachingManager({
        enabled: false,
        provider: 'anthropic',
      })

      const result = await manager.applyCaching(messages)

      expect(result.cached).toBe(false)
      expect(result.metadata.cachedTokens).toBe(0)
      expect(result.recommendations).toContain('Provider caching is disabled.')
    })
  })

  describe('Convenience Functions', () => {
    test('applyProviderCaching should work without manager instance', async () => {
      const result = await applyProviderCaching(
        messages,
        {
          enabled: true,
          provider: 'anthropic',
          anthropic: {
            minCachedTokens: 1024,
          },
        },
        tokenCounter // Need to pass token counter
      )

      expect(result.cached).toBe(true)
      expect(result.metadata.provider).toBe('anthropic')
    })

    test('parseOpenAICacheMetrics should handle zero cached tokens', () => {
      const usage: OpenAIUsageMetadata = {
        prompt_tokens: 500, // Below threshold
        completion_tokens: 100,
        total_tokens: 600,
        prompt_tokens_details: {
          cached_tokens: 0,
        },
      }

      const metrics = parseOpenAICacheMetrics(usage)

      expect(metrics.cachedTokens).toBe(0)
      expect(metrics.cacheHitRate).toBe(0)
      expect(metrics.costSavings).toBe(0)
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty message arrays', async () => {
      const manager = new ProviderCachingManager({
        enabled: true,
        provider: 'anthropic',
      })

      const result = await manager.applyCaching([])

      expect(result.cached).toBe(false)
      expect(result.metadata.cachedTokens).toBe(0)
    })

    test('should handle messages without content', async () => {
      const manager = new ProviderCachingManager(
        {
          enabled: true,
          provider: 'anthropic',
        },
        tokenCounter
      )

      const emptyMessages: CacheableMessage[] = [
        {
          role: 'user',
          content: '',
        },
      ]

      const result = await manager.applyCaching(emptyMessages)

      expect(result.cached).toBe(false)
    })

    test('should handle array content blocks', async () => {
      const manager = new ProviderCachingManager(
        {
          enabled: true,
          provider: 'anthropic',
          anthropic: {
            minCachedTokens: 100,
          },
        },
        tokenCounter
      )

      const blockMessages: CacheableMessage[] = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Hello '.repeat(100),
            },
          ],
          cacheable: true,
        },
      ]

      const result = await manager.applyCaching(blockMessages)

      expect(result.cached).toBe(true)
    })
  })
})
