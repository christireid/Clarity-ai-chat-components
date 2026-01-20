import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { createOptimizer, OptimizerPresets } from '../factory'

describe('createOptimizer Factory', () => {
  describe('Default Configuration', () => {
    test('should create optimizer with default settings', () => {
      const optimizer = createOptimizer()

      expect(optimizer).toBeDefined()
      expect(optimizer.countTokens).toBeInstanceOf(Function)
      expect(optimizer.getFromCache).toBeInstanceOf(Function)
      expect(optimizer.setInCache).toBeInstanceOf(Function)
      expect(optimizer.compress).toBeInstanceOf(Function)
      expect(optimizer.route).toBeInstanceOf(Function)
      expect(optimizer.optimize).toBeInstanceOf(Function)
      expect(optimizer.getStats).toBeInstanceOf(Function)
      expect(optimizer.resetStats).toBeInstanceOf(Function)
      expect(optimizer.clearCache).toBeInstanceOf(Function)
      expect(optimizer.dispose).toBeInstanceOf(Function)

      optimizer.dispose()
    })

    test('should count tokens accurately', () => {
      const optimizer = createOptimizer()
      const text = 'Hello, world! This is a test.'
      const tokens = optimizer.countTokens(text)

      expect(tokens).toBeGreaterThan(0)
      expect(tokens).toBeLessThan(text.length) // Tokens should be fewer than chars

      optimizer.dispose()
    })
  })

  describe('Presets', () => {
    test('should support minimal preset', () => {
      const optimizer = createOptimizer({ preset: 'minimal' })
      expect(optimizer).toBeDefined()
      optimizer.dispose()
    })

    test('should support standard preset', () => {
      const optimizer = createOptimizer({ preset: 'standard' })
      expect(optimizer).toBeDefined()
      optimizer.dispose()
    })

    test('should support production preset', () => {
      const optimizer = createOptimizer({ preset: 'production' })
      expect(optimizer).toBeDefined()
      optimizer.dispose()
    })

    test('should support enterprise preset', () => {
      const optimizer = createOptimizer({ preset: 'enterprise' })
      expect(optimizer).toBeDefined()
      optimizer.dispose()
    })

    test('OptimizerPresets should export all presets', () => {
      expect(OptimizerPresets.minimal).toBeDefined()
      expect(OptimizerPresets.standard).toBeDefined()
      expect(OptimizerPresets.production).toBeDefined()
      expect(OptimizerPresets.enterprise).toBeDefined()
    })
  })

  describe('Compression', () => {
    test('should compress markdown content', () => {
      const optimizer = createOptimizer()
      const markdown = `# Heading

This is a paragraph with **bold** and *italic* text.

- Item 1
- Item 2
- Item 3
`
      const result = optimizer.compress(markdown)

      expect(result.compressed).toBeDefined()
      expect(result.originalSize).toBeGreaterThan(0)
      expect(result.compressedSize).toBeLessThanOrEqual(result.originalSize)

      optimizer.dispose()
    })

    test('should return unchanged text when compression disabled', () => {
      const optimizer = createOptimizer({ enableCompression: false })
      const text = '# Hello World'
      const result = optimizer.compress(text)

      expect(result.compressed).toBe(text)
      expect(result.savingsPercent).toBe(0)

      optimizer.dispose()
    })
  })

  describe('Routing', () => {
    test('should route prompts to appropriate models', () => {
      const optimizer = createOptimizer({
        availableModels: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo'],
      })
      const prompt = 'Explain quantum computing in simple terms'
      const result = optimizer.route(prompt)

      expect(result).toBeDefined()
      expect(result.strategy).toBeDefined()
      expect(result.confidence).toBeGreaterThanOrEqual(0)

      optimizer.dispose()
    })

    test('should return fallback when routing disabled', () => {
      const optimizer = createOptimizer({ enableRouting: false })
      const result = optimizer.route('Test prompt')

      expect(result.selectedModel).toBeUndefined()
      expect(result.confidence).toBe(0)

      optimizer.dispose()
    })
  })

  describe('Caching', () => {
    test('should cache and retrieve responses', async () => {
      const optimizer = createOptimizer()
      const prompt = 'What is the capital of France?'
      const response = 'The capital of France is Paris.'

      await optimizer.setInCache(prompt, response)
      const result = await optimizer.getFromCache(prompt)

      expect(result.hit).toBe(true)
      expect(result.data).toBe(response)

      optimizer.dispose()
    })

    test('should return miss for uncached prompts', async () => {
      const optimizer = createOptimizer()
      const result = await optimizer.getFromCache('Never asked before')

      expect(result.hit).toBe(false)

      optimizer.dispose()
    })

    test('should clear cache', async () => {
      const optimizer = createOptimizer()

      await optimizer.setInCache('test', 'value')
      optimizer.clearCache()

      const result = await optimizer.getFromCache('test')
      expect(result.hit).toBe(false)

      optimizer.dispose()
    })
  })

  describe('Optimize (All-in-one)', () => {
    test('should optimize a prompt', async () => {
      const optimizer = createOptimizer()
      const prompt = '# Hello World\n\nThis is a **test** prompt.'

      const result = await optimizer.optimize(prompt)

      expect(result.compressedPrompt).toBeDefined()
      expect(result.recommendedModel).toBeDefined()
      expect(result.tokensSaved).toBeGreaterThanOrEqual(0)
      expect(result.estimatedCostSaved).toBeGreaterThanOrEqual(0)

      optimizer.dispose()
    })

    test('should return cached response when available', async () => {
      const optimizer = createOptimizer()
      const prompt = 'Cached prompt'
      const cachedResponse = 'Cached response value'

      await optimizer.setInCache(prompt, cachedResponse)
      const result = await optimizer.optimize(prompt)

      expect(result.cachedResponse).toBe(cachedResponse)
      expect(result.tokensSaved).toBeGreaterThan(0)

      optimizer.dispose()
    })
  })

  describe('Statistics', () => {
    test('should track statistics', async () => {
      const optimizer = createOptimizer()

      await optimizer.optimize('Test prompt 1')
      await optimizer.optimize('Test prompt 2')

      const stats = optimizer.getStats()

      expect(stats.tokensProcessed).toBeGreaterThan(0)
      expect(stats.cache).toBeDefined()
      expect(stats.router).toBeDefined()

      optimizer.dispose()
    })

    test('should reset statistics', async () => {
      const optimizer = createOptimizer()

      await optimizer.optimize('Test prompt')
      optimizer.resetStats()

      const stats = optimizer.getStats()
      expect(stats.tokensProcessed).toBe(0)
      expect(stats.tokensSaved).toBe(0)

      optimizer.dispose()
    })
  })

  describe('Feature Toggles', () => {
    test('should work with all features disabled', async () => {
      const optimizer = createOptimizer({
        enableCache: false,
        enableCompression: false,
        enableRouting: false,
      })

      const result = await optimizer.optimize('Test prompt')

      expect(result.compressedPrompt).toBe('Test prompt')
      expect(result.cachedResponse).toBeUndefined()

      optimizer.dispose()
    })
  })
})
