/**
 * Integration Tests
 *
 * Comprehensive tests that verify all modules work together correctly.
 * These tests ensure the entire token optimization pipeline functions as expected.
 */

import { describe, it, expect } from 'vitest'
import {
  // Compression
  compressText,
  CompressionLevel,

  // Model Router
  ModelRouter,

  // Conversation Memory
  SlidingWindowStrategy,
  ImportanceBasedStrategy,

  // Tiered Cache
  TieredCache,

  // Vision
  calculateOpenAIVisionTokens,
  ImageOptimizer,
  MultimodalCostEstimator,

  // Streaming
  StreamingTokenCounter,
  StreamingCostTracker,

  // Telemetry
  TelemetryCollector,
  instrumentTokenCount,

  // Schema
  optimizeSchema,
  analyzeSchema,
} from '../'

describe('Integration Tests', () => {
  describe('Complete Optimization Pipeline', () => {
    it('should optimize text through full pipeline', async () => {
      const telemetry = new TelemetryCollector({
        serviceName: 'integration-test',
        enableTracing: true,
        enableMetrics: true,
      })

      const spanId = telemetry.startSpan('full_pipeline')

      // Step 1: Compress text
      const originalText = `
        This is a long message that could benefit from compression.
        It contains redundant information and could be optimized.
        The optimization pipeline will process this text through multiple stages.
      `.repeat(10)

      const compressed = compressText(originalText, CompressionLevel.BALANCED)
      expect(compressed.ratio).toBeLessThan(1)
      telemetry.addEvent(spanId, 'compression_complete', {
        ratio: compressed.ratio,
      })

      // Step 2: Use tiered cache
      const cache = new TieredCache()
      const cacheKey = 'test-message'

      // First request - cache miss
      let cachedResult = cache.get(cacheKey)
      expect(cachedResult).toBeNull()
      telemetry.incrementCounter('cacheMisses')

      // Store in cache
      cache.set(cacheKey, compressed.compressed)

      // Second request - cache hit
      cachedResult = cache.get(cacheKey)
      expect(cachedResult).toBe(compressed.compressed)
      telemetry.incrementCounter('cacheHits')

      // Step 3: Route to appropriate model
      const router = new ModelRouter()
      const routingResult = router.route({
        messages: [{ role: 'user', content: compressed.compressed }],
        maxTokens: 100,
      })

      expect(routingResult.model).toBeDefined()
      telemetry.addEvent(spanId, 'routing_complete', {
        model: routingResult.model.id,
      })

      telemetry.endSpan(spanId)

      const metrics = telemetry.getMetrics()
      expect(metrics.cacheHits).toBe(1)
      expect(metrics.cacheMisses).toBe(1)
    })

    it('should handle conversation memory with optimization', async () => {
      const strategy = new SlidingWindowStrategy({ windowSize: 5 })

      const messages = Array.from({ length: 10 }, (_, i) => ({
        role: 'user' as const,
        content: `Message ${i + 1}`,
        timestamp: Date.now() + i * 1000,
      }))

      const result = await strategy.optimize(messages)

      // Should keep only last 5 messages
      expect(result.messages.length).toBe(5)
      expect(result.messages[0].content).toBe('Message 6')
      expect(result.messages[4].content).toBe('Message 10')
      expect(result.tokensRemoved).toBeGreaterThan(0)
    })

    it('should optimize multimodal requests with cost estimation', () => {
      const optimizer = new ImageOptimizer({
        strategy: 'balanced',
        provider: 'openai',
      })

      // Optimize image dimensions
      const imageResult = optimizer.optimize(
        { width: 3000, height: 2000 },
        'png'
      )

      expect(imageResult.tokensBefore).toBeGreaterThan(imageResult.tokensAfter)
      expect(imageResult.tokenSavings).toBeGreaterThan(0)

      // Estimate cost with optimized image
      const costEstimator = new MultimodalCostEstimator('openai')
      const costEstimate = costEstimator.estimateMessage({
        role: 'user',
        content: [
          { type: 'text', text: 'Describe this image' },
          {
            type: 'image',
            image_url: 'https://example.com/image.jpg',
            dimensions: imageResult.dimensions,
          },
        ],
      })

      expect(costEstimate.totalTokens).toBeGreaterThan(0)
      expect(costEstimate.imageTokens).toBeGreaterThan(0)
    })

    it('should track streaming with telemetry', async () => {
      const telemetry = new TelemetryCollector({
        serviceName: 'streaming-test',
      })

      const counter = new StreamingTokenCounter({
        predictionStrategy: 'average',
        onTokenUpdate: () => {},
      })

      const costTracker = new StreamingCostTracker({
        inputTokens: 10,
        pricing: {
          model: 'gpt-4o',
          provider: 'openai',
          inputCostPer1M: 2.5,
          outputCostPer1M: 10,
        },
        enableTiming: true,
      })

      const spanId = telemetry.startSpan('streaming_test')

      // Simulate streaming chunks
      for (let i = 0; i < 5; i++) {
        const chunk = {
          content: 'word ',
          sequence: i,
          cumulative: 'word '.repeat(i + 1),
          isFinal: i === 4,
        }

        const tokenStats = counter.processChunk(chunk)
        const costStats = costTracker.update(tokenStats)

        telemetry.addEvent(spanId, 'chunk_processed', {
          sequence: i,
          tokens: tokenStats.totalTokens,
          cost: costStats.totalCost,
        })
      }

      telemetry.endSpan(spanId)

      const spans = telemetry.getSpans()
      expect(spans[0].events.length).toBe(5)
    })

    it('should optimize function schemas and track savings', () => {
      const telemetry = new TelemetryCollector({
        serviceName: 'schema-test',
      })

      const schema = {
        name: 'get_weather',
        description: 'Get the current weather for a location',
        parameters: {
          type: 'object' as const,
          properties: {
            location: {
              type: 'string' as const,
              description: 'The city and state',
              title: 'Location',
              examples: ['New York, NY'],
            },
          },
          required: ['location'],
        },
      }

      const spanId = telemetry.startSpan('schema_optimization')

      // Analyze first
      const analysis = analyzeSchema(schema)
      expect(analysis.totalTokens).toBeGreaterThan(0)
      expect(analysis.recommendations.length).toBeGreaterThan(0)

      telemetry.addEvent(spanId, 'analysis_complete', {
        totalTokens: analysis.totalTokens,
        recommendations: analysis.recommendations.length,
      })

      // Optimize
      const result = optimizeSchema(schema, 'balanced')
      expect(result.tokensSaved).toBeGreaterThan(0)

      telemetry.recordMetric('tokenCountDurations', 10)
      telemetry.endSpan(spanId, {
        tokensSaved: result.tokensSaved,
        percentageSaved: result.percentageSaved,
      })

      const spans = telemetry.getSpans()
      expect(spans[0].events.length).toBe(1)
    })
  })

  describe('Cross-Module Integration', () => {
    it('should combine compression with caching', () => {
      const cache = new TieredCache()
      const text = 'This is a test message that will be compressed and cached'

      // Compress and cache
      const compressed = compressText(text, CompressionLevel.BALANCED)
      cache.set('compressed-key', compressed.compressed)

      // Retrieve and verify
      const cached = cache.get('compressed-key')
      expect(cached).toBe(compressed.compressed)

      const stats = cache.getStats()
      expect(stats.hits).toBe(1)
    })

    it('should use router with conversation memory', async () => {
      const router = new ModelRouter()
      const strategy = new ImportanceBasedStrategy({ maxTokens: 1000 })

      const messages = [
        { role: 'system' as const, content: 'You are helpful', timestamp: Date.now() },
        { role: 'user' as const, content: 'Hello', timestamp: Date.now() + 1000 },
        { role: 'assistant' as const, content: 'Hi there!', timestamp: Date.now() + 2000 },
        { role: 'user' as const, content: 'How are you?', timestamp: Date.now() + 3000 },
      ]

      // Optimize conversation
      const optimized = await strategy.optimize(messages)

      // Route optimized conversation
      const routingResult = router.route({
        messages: optimized.messages,
        maxTokens: 500,
      })

      expect(routingResult.model).toBeDefined()
      expect(optimized.messages.length).toBeLessThanOrEqual(messages.length)
    })

    it('should track vision optimization with telemetry', () => {
      const telemetry = new TelemetryCollector({
        serviceName: 'vision-tracking',
      })

      const countTokens = (dimensions: { width: number; height: number }) => {
        return calculateOpenAIVisionTokens(dimensions, 'auto').tokens
      }

      const instrumented = instrumentTokenCount(countTokens, telemetry)

      const tokens = instrumented({ width: 2048, height: 1536 })
      expect(tokens).toBeGreaterThan(0)

      const metrics = telemetry.getMetrics()
      expect(metrics.tokensCounted).toBe(1)
    })
  })

  describe('Error Handling and Resilience', () => {
    it('should handle cache failures gracefully', () => {
      const cache = new TieredCache()

      // Non-existent key
      const result = cache.get('non-existent')
      expect(result).toBeNull()

      // Clear and verify
      cache.clear()
      const stats = cache.getStats()
      expect(stats.size).toBe(0)
    })

    it('should handle invalid compression input', () => {
      // Empty string
      const result1 = compressText('', CompressionLevel.BALANCED)
      expect(result1.compressed).toBe('')
      expect(result1.ratio).toBe(1)

      // Already short string
      const result2 = compressText('Hi', CompressionLevel.BALANCED)
      expect(result2.compressed).toBe('Hi')
    })

    it('should handle streaming errors', () => {
      const counter = new StreamingTokenCounter({
        predictionStrategy: 'linear',
        onTokenUpdate: () => {},
      })

      // Invalid chunk
      const chunk = {
        content: '',
        sequence: 0,
        cumulative: '',
        isFinal: false,
      }

      const stats = counter.processChunk(chunk)
      expect(stats.totalTokens).toBe(0)
    })

    it('should handle telemetry errors gracefully', () => {
      const collector = new TelemetryCollector({
        serviceName: 'error-test',
      })

      // End non-existent span
      collector.endSpan('non-existent')
      expect(collector.getSpans().length).toBe(0)

      // Record error on non-existent span
      collector.recordError('non-existent', new Error('test'))
      expect(collector.getMetrics().errorsEncountered).toBe(0)
    })
  })

  describe('Performance and Scale', () => {
    it('should handle large conversation histories efficiently', async () => {
      const strategy = new SlidingWindowStrategy({ windowSize: 100 })

      const messages = Array.from({ length: 1000 }, (_, i) => ({
        role: (i % 2 === 0 ? 'user' : 'assistant') as const,
        content: `Message ${i}`,
        timestamp: Date.now() + i * 1000,
      }))

      const start = performance.now()
      const result = await strategy.optimize(messages)
      const duration = performance.now() - start

      expect(result.messages.length).toBe(100)
      expect(duration).toBeLessThan(100) // Should be fast
    })

    it('should cache efficiently at scale', () => {
      const cache = new TieredCache()

      const start = performance.now()

      // Add 1000 items
      for (let i = 0; i < 1000; i++) {
        cache.set(`key-${i}`, `value-${i}`)
      }

      // Retrieve 1000 items
      for (let i = 0; i < 1000; i++) {
        const value = cache.get(`key-${i}`)
        expect(value).toBe(`value-${i}`)
      }

      const duration = performance.now() - start

      const stats = cache.getStats()
      expect(stats.hits).toBe(1000)
      expect(duration).toBeLessThan(500) // Should be fast
    })

    it('should optimize multiple schemas efficiently', () => {
      const schemas = Array.from({ length: 100 }, (_, i) => ({
        name: `function_${i}`,
        description: `Description for function ${i}`,
        parameters: {
          type: 'object' as const,
          properties: {
            param: {
              type: 'string' as const,
              title: 'Parameter',
              description: 'A parameter',
            },
          },
        },
      }))

      const start = performance.now()

      const results = schemas.map(schema =>
        optimizeSchema(schema, 'balanced')
      )

      const duration = performance.now() - start

      expect(results.length).toBe(100)
      expect(results.every(r => r.tokensSaved >= 0)).toBe(true)
      expect(duration).toBeLessThan(1000) // Should be reasonably fast
    })
  })

  describe('Real-World Scenarios', () => {
    it('should handle complete chat optimization workflow', async () => {
      const telemetry = new TelemetryCollector({
        serviceName: 'chat-workflow',
      })

      const cache = new TieredCache()
      const router = new ModelRouter()
      const memory = new SlidingWindowStrategy({ windowSize: 10 })

      const workflowSpan = telemetry.startSpan('chat_workflow')

      // Step 1: User sends message
      const userMessage = 'What is the weather like today?'

      // Step 2: Check cache
      const cacheKey = `msg:${userMessage}`
      let response = cache.get(cacheKey)

      if (response) {
        telemetry.incrementCounter('cacheHits')
      } else {
        telemetry.incrementCounter('cacheMisses')

        // Step 3: Optimize conversation history
        const messages = [
          { role: 'user' as const, content: userMessage, timestamp: Date.now() },
        ]
        const optimized = await memory.optimize(messages)

        // Step 4: Route to model
        const routing = router.route({
          messages: optimized.messages,
          maxTokens: 100,
        })

        telemetry.addEvent(workflowSpan, 'routed_to_model', {
          model: routing.model.id,
        })

        // Simulate response
        response = 'The weather is sunny today.'

        // Step 5: Cache response
        cache.set(cacheKey, response)
      }

      telemetry.endSpan(workflowSpan)

      expect(response).toBeDefined()
      expect(telemetry.getSpans().length).toBe(1)
    })

    it('should optimize function calling workflow', () => {
      const telemetry = new TelemetryCollector({
        serviceName: 'function-calling',
      })

      const functions = [
        {
          name: 'get_weather',
          description: 'Get current weather for a location with detailed information',
          parameters: {
            type: 'object' as const,
            properties: {
              location: {
                type: 'string' as const,
                description: 'The city and state, e.g. San Francisco, CA',
                title: 'Location',
                examples: ['New York, NY', 'Los Angeles, CA'],
              },
              unit: {
                type: 'string' as const,
                enum: ['celsius', 'fahrenheit'],
                default: 'fahrenheit',
                title: 'Unit',
              },
            },
            required: ['location'],
          },
        },
      ]

      const workflowSpan = telemetry.startSpan('function_optimization')

      // Optimize all function schemas
      const optimized = functions.map(func => {
        const result = optimizeSchema(func, 'balanced')
        telemetry.addEvent(workflowSpan, 'schema_optimized', {
          name: func.name,
          saved: result.tokensSaved,
        })
        return result.schema
      })

      telemetry.endSpan(workflowSpan, {
        totalFunctions: functions.length,
      })

      expect(optimized.length).toBe(1)
      expect(telemetry.getSpans()[0].events.length).toBe(1)
    })

    it('should handle multimodal chat with cost optimization', () => {
      const costEstimator = new MultimodalCostEstimator('openai')
      const imageOptimizer = new ImageOptimizer({
        strategy: 'cost',
        provider: 'openai',
      })

      // Original large image
      const originalDimensions = { width: 4096, height: 3072 }

      // Optimize image
      const optimized = imageOptimizer.optimize(originalDimensions, 'png')

      // Estimate cost with original
      const originalCost = costEstimator.estimateMessage({
        role: 'user',
        content: [
          { type: 'text', text: 'Describe this image' },
          {
            type: 'image',
            image_url: 'https://example.com/image.jpg',
            dimensions: originalDimensions,
          },
        ],
      })

      // Estimate cost with optimized
      const optimizedCost = costEstimator.estimateMessage({
        role: 'user',
        content: [
          { type: 'text', text: 'Describe this image' },
          {
            type: 'image',
            image_url: 'https://example.com/image.jpg',
            dimensions: optimized.dimensions,
          },
        ],
      })

      expect(optimizedCost.totalTokens).toBeLessThan(originalCost.totalTokens)
      expect(optimized.tokenSavings).toBeGreaterThan(0)
    })
  })

  describe('Backward Compatibility', () => {
    it('should maintain compatibility with existing cache API', () => {
      const cache = new TieredCache()

      // Old-style usage
      cache.set('key', 'value')
      const value = cache.get('key')
      expect(value).toBe('value')

      // Stats should work
      const stats = cache.getStats()
      expect(stats.hits).toBe(1)

      // Clear should work
      cache.clear()
      expect(cache.getStats().size).toBe(0)
    })

    it('should support legacy compression API', () => {
      const text = 'Test message'

      // Should work with minimal options
      const result = compressText(text, CompressionLevel.BALANCED)

      expect(result.compressed).toBeDefined()
      expect(result.ratio).toBeDefined()
      expect(result.method).toBeDefined()
    })

    it('should handle old router configuration', () => {
      const router = new ModelRouter()

      // Legacy routing call
      const result = router.route({
        messages: [{ role: 'user', content: 'Hello' }],
        maxTokens: 100,
      })

      expect(result.model).toBeDefined()
      expect(result.reason).toBeDefined()
    })
  })
})
