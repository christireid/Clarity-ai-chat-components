/**
 * Vision and Multimodal Tests
 */

import { describe, it, expect } from 'vitest'
import {
  VisionTokenCounter,
  calculateOpenAIVisionTokens,
  calculateAnthropicVisionTokens,
  calculateGoogleVisionTokens,
  compareProvidersForImage,
  ImageOptimizer,
  calculateResizeDimensions,
  createMultimodalMessage,
  createImageContent,
  extractText,
  extractImages,
  countImages,
  MultimodalCostEstimator,
  MULTIMODAL_MODEL_PRICING,
  compareMultimodalProviders,
} from '../../vision'

describe('Vision Token Counter', () => {
  describe('OpenAI Token Calculation', () => {
    it('should calculate tokens for low detail', () => {
      const result = calculateOpenAIVisionTokens({ width: 512, height: 512 }, 'low')
      expect(result.tokens).toBe(85)
      expect(result.tileCount).toBe(0)
    })

    it('should calculate tokens for high detail image', () => {
      const result = calculateOpenAIVisionTokens({ width: 1024, height: 1024 }, 'high')
      expect(result.tokens).toBeGreaterThan(85)
      expect(result.baseTokens).toBe(85)
      expect(result.tileCount).toBeGreaterThan(0)
    })

    it('should auto-select low for small images', () => {
      const result = calculateOpenAIVisionTokens({ width: 400, height: 400 }, 'auto')
      expect(result.tokens).toBe(85)
    })

    it('should scale down large images', () => {
      const result = calculateOpenAIVisionTokens({ width: 4096, height: 4096 }, 'high')
      expect(result.effectiveDimensions.width).toBeLessThanOrEqual(2048)
      expect(result.effectiveDimensions.height).toBeLessThanOrEqual(2048)
    })
  })

  describe('Anthropic Token Calculation', () => {
    it('should calculate tokens', () => {
      const result = calculateAnthropicVisionTokens({ width: 1024, height: 1024 })
      expect(result.tokens).toBeGreaterThan(0)
      expect(result.provider).toBe('anthropic')
    })

    it('should scale to 1568px max', () => {
      const result = calculateAnthropicVisionTokens({ width: 2000, height: 2000 })
      expect(result.effectiveDimensions.width).toBeLessThanOrEqual(1568)
    })
  })

  describe('Google Token Calculation', () => {
    it('should return flat 258 tokens', () => {
      const small = calculateGoogleVisionTokens({ width: 512, height: 512 })
      const large = calculateGoogleVisionTokens({ width: 2048, height: 2048 })

      expect(small.tokens).toBe(258)
      expect(large.tokens).toBe(258)
    })
  })

  describe('Provider Comparison', () => {
    it('should compare all providers', () => {
      const comparison = compareProvidersForImage({ width: 1024, height: 1024 })

      expect(comparison.openai).toBeDefined()
      expect(comparison.anthropic).toBeDefined()
      expect(comparison.google).toBeDefined()
      expect(comparison.cheapest).toBeTruthy()
      expect(comparison.mostExpensive).toBeTruthy()
    })
  })

  describe('Vision Token Counter Class', () => {
    it('should count tokens for OpenAI', () => {
      const counter = new VisionTokenCounter({ provider: 'openai' })
      const result = counter.count({
        dimensions: { width: 1024, height: 1024 },
      })

      expect(result.tokens).toBeGreaterThan(0)
    })

    it('should count batch of images', () => {
      const counter = new VisionTokenCounter({ provider: 'openai' })
      const images = [
        { dimensions: { width: 512, height: 512 } },
        { dimensions: { width: 1024, height: 1024 } },
      ]

      const results = counter.countBatch(images)
      expect(results).toHaveLength(2)
    })

    it('should calculate total tokens', () => {
      const counter = new VisionTokenCounter({ provider: 'openai' })
      const images = [
        { dimensions: { width: 512, height: 512 } },
        { dimensions: { width: 1024, height: 1024 } },
      ]

      const total = counter.countTotal(images)
      expect(total).toBeGreaterThan(0)
    })
  })
})

describe('Image Optimizer', () => {
  describe('Resize Calculations', () => {
    it('should maintain aspect ratio', () => {
      const result = calculateResizeDimensions(
        { width: 2000, height: 1000 },
        { width: 1000, height: 1000 }
      )

      expect(result.width).toBe(1000)
      expect(result.height).toBe(500)
    })

    it('should not upscale', () => {
      const result = calculateResizeDimensions(
        { width: 500, height: 500 },
        { width: 1000, height: 1000 }
      )

      expect(result.width).toBe(500)
      expect(result.height).toBe(500)
    })
  })

  describe('Image Optimization', () => {
    it('should optimize with balanced strategy', () => {
      const optimizer = new ImageOptimizer({
        provider: 'openai',
        strategy: 'balanced',
      })

      const result = optimizer.optimize({ width: 4000, height: 3000 })

      expect(result.dimensions.width).toBeLessThanOrEqual(2048)
      expect(result.tokenSavings).toBeGreaterThanOrEqual(0)
    })

    it('should provide optimization steps', () => {
      const optimizer = new ImageOptimizer({
        provider: 'openai',
        strategy: 'aggressive',
      })

      const result = optimizer.optimize({ width: 3000, height: 2000 })

      expect(result.optimizationSteps.length).toBeGreaterThan(0)
    })

    it('should calculate cost savings', () => {
      const optimizer = new ImageOptimizer({
        provider: 'openai',
      })

      const result = optimizer.optimize({ width: 2048, height: 2048 })
      const savings = result.costSavings(2.5) // GPT-4o pricing

      expect(savings).toBeGreaterThanOrEqual(0)
    })

    it('should optimize batch', () => {
      const optimizer = new ImageOptimizer({
        provider: 'openai',
      })

      const images = [
        { dimensions: { width: 3000, height: 2000 } },
        { dimensions: { width: 2000, height: 1500 } },
      ]

      const results = optimizer.optimizeBatch(images)
      expect(results).toHaveLength(2)
    })
  })
})

describe('Multimodal Types', () => {
  describe('Message Creation', () => {
    it('should create text message', () => {
      const msg = createMultimodalMessage('user', 'Hello', [])
      expect(msg.role).toBe('user')
      expect(extractText(msg)).toBe('Hello')
    })

    it('should create multimodal message', () => {
      const image = createImageContent('base64data', 'image/jpeg')
      const msg = createMultimodalMessage('user', 'What is this?', [image])

      expect(countImages(msg)).toBe(1)
      expect(extractText(msg)).toBe('What is this?')
    })
  })

  describe('Message Analysis', () => {
    it('should count images', () => {
      const image1 = createImageContent('data1', 'image/jpeg')
      const image2 = createImageContent('data2', 'image/png')
      const msg = createMultimodalMessage('user', 'Compare these', [image1, image2])

      expect(countImages(msg)).toBe(2)
    })

    it('should extract text and images', () => {
      const image = createImageContent('data', 'image/jpeg')
      const msg = createMultimodalMessage('user', 'Describe this', [image])

      expect(extractText(msg)).toBe('Describe this')
      expect(extractImages(msg)).toHaveLength(1)
    })
  })
})

describe('Multimodal Cost Estimator', () => {
  describe('Basic Estimation', () => {
    it('should estimate text-only message', () => {
      const estimator = new MultimodalCostEstimator({
        pricing: MULTIMODAL_MODEL_PRICING['gpt-4o'],
      })

      const msg = createMultimodalMessage('user', 'Hello world', [])
      const estimate = estimator.estimateMessage(msg)

      expect(estimate.textTokens).toBeGreaterThan(0)
      expect(estimate.imageTokens).toBe(0)
      expect(estimate.totalCost).toBeGreaterThan(0)
    })

    it('should estimate multimodal message', () => {
      const estimator = new MultimodalCostEstimator({
        pricing: MULTIMODAL_MODEL_PRICING['gpt-4o'],
      })

      const image = createImageContent('data', 'image/jpeg', {
        width: 1024,
        height: 1024,
      })
      const msg = createMultimodalMessage('user', 'What is this?', [image])
      const estimate = estimator.estimateMessage(msg)

      expect(estimate.textTokens).toBeGreaterThan(0)
      expect(estimate.imageTokens).toBeGreaterThan(0)
      expect(estimate.totalCost).toBeGreaterThan(0)
    })

    it('should estimate conversation', () => {
      const estimator = new MultimodalCostEstimator({
        pricing: MULTIMODAL_MODEL_PRICING['gpt-4o-mini'],
      })

      const messages = [
        createMultimodalMessage('user', 'Hello', []),
        createMultimodalMessage('assistant', 'Hi there!', []),
      ]

      const estimate = estimator.estimateConversation(messages)
      expect(estimate.totalTokens).toBeGreaterThan(0)
    })
  })

  describe('Provider Comparison', () => {
    it('should compare costs across providers', () => {
      const msg = createMultimodalMessage('user', 'Test', [])
      const comparison = compareMultimodalProviders(msg)

      expect(comparison['gpt-4o']).toBeDefined()
      expect(comparison['gpt-4o-mini']).toBeDefined()
      expect(comparison['claude-3-5-sonnet']).toBeDefined()
      expect(comparison['gemini-flash']).toBeDefined()
    })

    it('should have consistent token counts', () => {
      const msg = createMultimodalMessage('user', 'Test message', [])
      const comparison = compareMultimodalProviders(msg)

      // All should count similar text tokens
      const textTokens = Object.values(comparison).map((e) => e.textTokens)
      const allSimilar = textTokens.every((t) => Math.abs(t - textTokens[0]) < 5)
      expect(allSimilar).toBe(true)
    })
  })

  describe('Cost Breakdown', () => {
    it('should separate text and image costs', () => {
      const estimator = new MultimodalCostEstimator({
        pricing: MULTIMODAL_MODEL_PRICING['gpt-4o'],
      })

      const image = createImageContent('data', 'image/jpeg', {
        width: 1024,
        height: 1024,
      })
      const msg = createMultimodalMessage('user', 'Analyze this', [image])
      const estimate = estimator.estimateMessage(msg)

      expect(estimate.textCost).toBeGreaterThan(0)
      expect(estimate.imageCost).toBeGreaterThan(0)
      expect(estimate.inputCost).toBe(estimate.textCost + estimate.imageCost)
    })
  })
})
