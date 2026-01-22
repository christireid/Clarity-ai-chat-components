/**
 * @vitest-environment jsdom
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useTokenOptimization } from '../../hooks/use-token-optimization'

describe('useTokenOptimization Hook', () => {
  describe('Initialization', () => {
    test('should initialize with default settings', () => {
      const { result } = renderHook(() => useTokenOptimization())

      expect(result.current.countTokens).toBeInstanceOf(Function)
      expect(result.current.getFromCache).toBeInstanceOf(Function)
      expect(result.current.setInCache).toBeInstanceOf(Function)
      expect(result.current.compress).toBeInstanceOf(Function)
      expect(result.current.route).toBeInstanceOf(Function)
      expect(result.current.optimize).toBeInstanceOf(Function)
      expect(result.current.getStats).toBeInstanceOf(Function)
      expect(result.current.resetStats).toBeInstanceOf(Function)
      expect(result.current.clearCache).toBeInstanceOf(Function)
    })

    test('should accept custom preset', () => {
      const { result } = renderHook(() =>
        useTokenOptimization({ preset: 'production' })
      )

      expect(result.current.countTokens).toBeInstanceOf(Function)
    })
  })

  describe('Token Counting', () => {
    test('should count tokens accurately', () => {
      const { result } = renderHook(() => useTokenOptimization())

      const text = 'Hello, world! This is a test.'
      const tokens = result.current.countTokens(text)

      expect(tokens).toBeGreaterThan(0)
      expect(tokens).toBeLessThan(text.length)
    })

    test('should handle empty string', () => {
      const { result } = renderHook(() => useTokenOptimization())

      const tokens = result.current.countTokens('')
      expect(tokens).toBe(0)
    })
  })

  describe('Compression', () => {
    test('should compress markdown content', () => {
      const { result } = renderHook(() => useTokenOptimization())

      const markdown = `# Heading

This is a paragraph with **bold** text.

- Item 1
- Item 2
`
      const compressed = result.current.compress(markdown)

      expect(compressed.compressed).toBeDefined()
      expect(compressed.originalSize).toBeGreaterThan(0)
      expect(compressed.compressedSize).toBeLessThanOrEqual(
        compressed.originalSize
      )
    })

    test('should pass through when compression disabled', () => {
      const { result } = renderHook(() =>
        useTokenOptimization({ enableCompression: false })
      )

      const text = '# Test'
      const compressed = result.current.compress(text)

      expect(compressed.compressed).toBe(text)
      expect(compressed.savingsPercent).toBe(0)
    })
  })

  describe('Routing', () => {
    test('should route prompts', () => {
      const { result } = renderHook(() =>
        useTokenOptimization({
          availableModels: ['gpt-4o-mini', 'gpt-4o'],
        })
      )

      const routing = result.current.route('Test prompt')

      expect(routing).toBeDefined()
      expect(routing.strategy).toBeDefined()
      expect(routing.confidence).toBeGreaterThanOrEqual(0)
    })

    test('should handle routing disabled', () => {
      const { result } = renderHook(() =>
        useTokenOptimization({ enableRouting: false })
      )

      const routing = result.current.route('Test prompt')

      expect(routing.selectedModel).toBeUndefined()
      expect(routing.confidence).toBe(0)
    })
  })

  describe('Caching', () => {
    test('should cache and retrieve responses', async () => {
      const { result } = renderHook(() => useTokenOptimization())

      const prompt = 'What is 2+2?'
      const response = '4'

      await act(async () => {
        await result.current.setInCache(prompt, response)
      })

      let cached: string | undefined
      await act(async () => {
        cached = await result.current.getFromCache(prompt)
      })

      expect(cached).toBe(response)
    })

    test('should return undefined for uncached prompts', async () => {
      const { result } = renderHook(() => useTokenOptimization())

      let cached: string | undefined
      await act(async () => {
        cached = await result.current.getFromCache('uncached')
      })

      expect(cached).toBeUndefined()
    })

    test('should clear cache', async () => {
      const { result } = renderHook(() => useTokenOptimization())

      await act(async () => {
        await result.current.setInCache('key', 'value')
        result.current.clearCache()
      })

      let cached: string | undefined
      await act(async () => {
        cached = await result.current.getFromCache('key')
      })

      expect(cached).toBeUndefined()
    })
  })

  describe('Optimize', () => {
    test('should optimize a prompt', async () => {
      const { result } = renderHook(() => useTokenOptimization())

      let optimized: Awaited<ReturnType<typeof result.current.optimize>>
      await act(async () => {
        optimized = await result.current.optimize('# Hello **World**')
      })

      expect(optimized!.compressedPrompt).toBeDefined()
      expect(optimized!.recommendedModel).toBeDefined()
      expect(optimized!.tokensSaved).toBeGreaterThanOrEqual(0)
    })

    test('should use cached response when available', async () => {
      const { result } = renderHook(() => useTokenOptimization())

      const prompt = 'Cached prompt'
      const response = 'Cached response'

      await act(async () => {
        await result.current.setInCache(prompt, response)
      })

      let optimized: Awaited<ReturnType<typeof result.current.optimize>>
      await act(async () => {
        optimized = await result.current.optimize(prompt)
      })

      expect(optimized!.cachedResponse).toBe(response)
    })
  })

  describe('Statistics', () => {
    test('should track statistics', async () => {
      const { result } = renderHook(() => useTokenOptimization())

      await act(async () => {
        await result.current.optimize('Test 1')
        await result.current.optimize('Test 2')
      })

      const stats = result.current.getStats()

      expect(stats.tokensProcessed).toBeGreaterThan(0)
      expect(stats.cache).toBeDefined()
      expect(stats.router).toBeDefined()
    })

    test('should reset statistics', async () => {
      const { result } = renderHook(() => useTokenOptimization())

      await act(async () => {
        await result.current.optimize('Test')
        result.current.resetStats()
      })

      const stats = result.current.getStats()
      expect(stats.tokensProcessed).toBe(0)
      expect(stats.tokensSaved).toBe(0)
    })
  })

  describe('Presets', () => {
    test.each(['minimal', 'standard', 'production', 'enterprise'] as const)(
      'should support %s preset',
      (preset) => {
        const { result } = renderHook(() => useTokenOptimization({ preset }))
        expect(result.current.countTokens).toBeInstanceOf(Function)
      }
    )
  })

  describe('All Features Disabled', () => {
    test('should work with minimal configuration', async () => {
      const { result } = renderHook(() =>
        useTokenOptimization({
          enableCache: false,
          enableCompression: false,
          enableRouting: false,
        })
      )

      let optimized: Awaited<ReturnType<typeof result.current.optimize>>
      await act(async () => {
        optimized = await result.current.optimize('Plain text')
      })

      expect(optimized!.compressedPrompt).toBe('Plain text')
      expect(optimized!.cachedResponse).toBeUndefined()
    })
  })
})
