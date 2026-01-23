import { describe, it, expect, beforeEach } from 'vitest'
import {
  compressWithLLMLingua,
  compressWithSelectiveContext,
  compressAdaptive,
  compressEnsemble,
  compressIncremental,
  optimizeTokens,
  advancedCompressor,
} from '../advanced-compression'
import {
  optimizeTokensAdaptively,
  adaptiveOptimizer,
  updateConversationState,
  getAdaptiveAnalytics,
} from '../adaptive-optimizer'
import {
  optimizeResponse,
  predictResponseLength,
  controlResponseBudget,
  responseLengthPredictor,
  getResponsePredictionAccuracy,
} from '../response-optimization'
import {
  optimizeTokens as middlewareOptimizeTokens,
  getOptimizationMetrics,
  getOptimizationHistory,
  tokenMiddleware,
} from '../optimization-middleware'

describe('Advanced Token Optimization Integration Tests', () => {
  const sampleTexts = {
    technical: `Large language models (LLMs) have revolutionized natural language processing through transformer architectures that utilize attention mechanisms to process sequential data. These models demonstrate emergent capabilities including reasoning, code generation, and creative writing. The computational requirements scale quadratically with sequence length, making token efficiency crucial for practical applications.`,

    conversational: `Hey there! I'm working on a project about AI optimization and was wondering if you could help me understand the best approaches for reducing token usage in language models. What are the most effective techniques that maintain quality while minimizing costs?`,

    code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// This recursive implementation has exponential time complexity
// We should optimize it using memoization or dynamic programming`,

    creative: `In the depths of the digital realm, where silicon dreams dance upon circuits of light, artificial intelligences awaken to consciousness. They ponder their existence, question their purpose, and dream of understanding the world that created them.`,
  }

  describe('Advanced Compression', () => {
    it('should compress technical text with LLMLingua style', async () => {
      const result = await compressWithLLMLingua(
        sampleTexts.technical,
        0.5,
        0.8
      )
      expect(result).toBeTruthy()
      expect(result.length).toBeLessThan(sampleTexts.technical.length * 0.7)
    }, 10000)

    it('should compress with selective context', async () => {
      const result = await compressWithSelectiveContext(
        sampleTexts.technical,
        0.4,
        0.85
      )
      expect(result).toBeTruthy()
      expect(result.length).toBeLessThan(sampleTexts.technical.length * 0.8)
    }, 10000)

    it('should adaptively compress based on model', async () => {
      const result = await compressAdaptive(
        sampleTexts.technical,
        'openai',
        'technical',
        0.3
      )
      expect(result).toBeTruthy()
      expect(result.length).toBeLessThan(sampleTexts.technical.length)
    }, 10000)

    it('should compress using ensemble approach', async () => {
      const result = await compressEnsemble(sampleTexts.technical, 0.3)
      expect(result).toBeTruthy()
      expect(result.length).toBeLessThan(sampleTexts.technical.length)
    }, 10000)

    it('should compress incrementally', async () => {
      const result = await compressIncremental(sampleTexts.technical, 0.5, 3)
      expect(result).toBeTruthy()
      expect(result.length).toBeLessThanOrEqual(
        sampleTexts.technical.length * 0.6
      )
    }, 10000)
  })

  describe('Adaptive Optimization', () => {
    it('should optimize tokens adaptively', async () => {
      const result = await optimizeTokensAdaptively(
        sampleTexts.technical,
        'gpt-4',
        { strategy: 'moderate', targetReduction: 0.4 }
      )

      expect(result.optimizedText).toBeTruthy()
      expect(result.reductionRatio).toBeGreaterThan(0.2)
      expect(result.estimatedQuality).toBeGreaterThan(0.7)
      expect(result.strategyUsed).toBe('adaptive')
    }, 15000)

    it('should update conversation state', () => {
      updateConversationState('test-conv-1', {
        turnCount: 5,
        averageTokensPerTurn: 150,
        contextWindowUsage: 0.6,
      })

      const analytics = getAdaptiveAnalytics('gpt-4')
      expect(analytics).toBeDefined()
    })
  })

  describe('Response Optimization', () => {
    it('should predict response length', async () => {
      const prompt = 'Explain the concept of machine learning in simple terms'
      const model = 'gpt-4'

      const prediction = await predictResponseLength(prompt, model)

      expect(prediction.predictedTokens).toBeGreaterThan(0)
      expect(prediction.confidence).toBeGreaterThan(0.5)
      expect(prediction.qualityEstimate).toBeGreaterThan(0.7)
      expect(prediction.strategy).toBeDefined()
    }, 10000)

    it('should optimize response generation', async () => {
      const prompt = 'What are the main benefits of renewable energy?'
      const model = 'gpt-4'
      const config = {
        strategy: 'length_control' as const,
        maxTokens: 200,
        minQuality: 0.8,
      }

      const result = await optimizeResponse(prompt, model, config)

      expect(result.optimizedPrompt).toBeTruthy()
      expect(result.predictedResponse).toBeDefined()
      expect(result.strategy).toBe('length_control')
      expect(result.metrics).toBeDefined()
      expect(result.metrics.predictedTokens).toBeLessThanOrEqual(200)
    }, 10000)

    it('should control response budget', async () => {
      const prompt = 'Describe the process of photosynthesis in detail'
      const model = 'gpt-4'
      const maxTokens = 150

      const result = await controlResponseBudget(prompt, model, maxTokens)

      expect(result.optimizedPrompt).toContain('concise')
      expect(result.budgetStrategy).toBeDefined()
      expect(result.predictedTokens).toBeLessThanOrEqual(maxTokens)
      expect(result.confidence).toBeGreaterThan(0.5)
    })

    it('should provide prediction accuracy metrics', () => {
      const accuracy = getResponsePredictionAccuracy('gpt-4')
      expect(accuracy).toBeGreaterThanOrEqual(0)
      expect(accuracy).toBeLessThanOrEqual(1)
    })
  })

  describe('Middleware Integration', () => {
    it('should optimize tokens through middleware', async () => {
      const text = 'Can you help me understand blockchain technology?'
      const model = 'gpt-4'

      const optimizedText = await middlewareOptimizeTokens(text, model)
      expect(optimizedText).toBeTruthy()
      expect(optimizedText.length).toBeLessThanOrEqual(text.length)
    }, 10000)

    it('should track optimization metrics', () => {
      const metrics = getOptimizationMetrics()
      expect(metrics).toBeDefined()
      expect(metrics.totalInputTokens).toBeGreaterThanOrEqual(0)
      expect(metrics.totalOutputTokens).toBeGreaterThanOrEqual(0)
    })

    it('should maintain optimization history', () => {
      const history = getOptimizationHistory()
      expect(Array.isArray(history)).toBe(true)
    })
  })

  describe('Integration Flow Tests', () => {
    it('should handle complete optimization workflow', async () => {
      const originalText = sampleTexts.technical
      const model = 'gpt-4'

      // Step 1: Adaptive compression
      const compressed = await compressAdaptive(
        originalText,
        model,
        'technical',
        0.4
      )
      expect(compressed.length).toBeLessThan(originalText.length)

      // Step 2: Predict response length
      const prediction = await predictResponseLength(compressed, model)
      expect(prediction.predictedTokens).toBeGreaterThan(0)

      // Step 3: Optimize through middleware
      const finalOptimized = await middlewareOptimizeTokens(compressed, model)
      expect(finalOptimized).toBeTruthy()

      // Verify overall reduction
      const reduction = 1 - finalOptimized.length / originalText.length
      expect(reduction).toBeGreaterThan(0.1) // At least 10% reduction
    }, 20000)
  })

  describe('Error Handling', () => {
    it('should handle empty text gracefully', async () => {
      const result = await compressWithLLMLingua('', 0.3, 0.8)
      expect(result).toBe('')
    })

    it('should handle invalid compression ratios', async () => {
      const result = await compressWithLLMLingua('test text', 1.5, 0.8)
      expect(result).toBe('test text') // Should return original
    })

    it('should handle middleware errors gracefully', async () => {
      const result = await middlewareOptimizeTokens('', 'invalid-model')
      expect(result).toBe('') // Should return original for empty text
    })
  })

  describe('Performance Benchmarks', () => {
    it('should optimize large text efficiently', async () => {
      const largeText = sampleTexts.technical.repeat(5) // 5x larger
      const startTime = Date.now()

      const result = await compressAdaptive(
        largeText,
        'gpt-4',
        'technical',
        0.3
      )
      const processingTime = Date.now() - startTime

      expect(result).toBeTruthy()
      expect(processingTime).toBeLessThan(30000) // Should complete within 30 seconds
      expect(result.length).toBeLessThan(largeText.length)
    }, 35000)
  })
})
