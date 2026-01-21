/**
 * Tests for Cascading Router with Quality Assessment
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  CascadingRouter,
  HeuristicQualityAssessor,
  createOpenAICascadingRouter,
  createAnthropicCascadingRouter,
  type ModelTier,
  type ModelConfig,
  type LLMQualityAssessor,
  type QualityAssessment,
} from '../../routing/cascading-router'

// Mock models for testing
const cheapModel: ModelConfig = {
  id: 'cheap-model',
  tier: 'small',
  inputCostPer1M: 0.1,
  outputCostPer1M: 0.5,
  contextWindow: 100000,
  maxOutput: 4096,
  capabilities: ['chat'],
}

const standardModel: ModelConfig = {
  id: 'standard-model',
  tier: 'medium',
  inputCostPer1M: 1.0,
  outputCostPer1M: 5.0,
  contextWindow: 100000,
  maxOutput: 4096,
  capabilities: ['chat', 'tools'],
}

const premiumModel: ModelConfig = {
  id: 'premium-model',
  tier: 'premium',
  inputCostPer1M: 10.0,
  outputCostPer1M: 50.0,
  contextWindow: 200000,
  maxOutput: 8192,
  capabilities: ['chat', 'tools', 'reasoning'],
}

// Mock generate function
type GenerateFn = (model: ModelConfig) => Promise<{
  response: string
  inputTokens: number
  outputTokens: number
}>

describe('HeuristicQualityAssessor', () => {
  let assessor: HeuristicQualityAssessor

  beforeEach(() => {
    assessor = new HeuristicQualityAssessor()
  })

  it('should pass quality threshold for good responses', () => {
    const prompt = 'Explain quantum computing'
    const response = 'Quantum computing uses quantum bits (qubits) to perform calculations. Unlike classical bits that are either 0 or 1, qubits can be in superposition. This allows quantum computers to solve certain problems exponentially faster than classical computers.'

    const assessment = assessor.assess(prompt, response, 0.7)

    expect(assessment.score).toBeGreaterThanOrEqual(0.7)
    expect(assessment.passesThreshold).toBe(true)
    expect(assessment.method).toBe('heuristic')
  })

  it('should fail quality threshold for too-short responses', () => {
    const prompt = 'Explain quantum computing in detail'
    const response = 'Quantum computers use qubits.'

    const assessment = assessor.assess(prompt, response, 0.7)

    expect(assessment.score).toBeLessThan(0.7)
    expect(assessment.passesThreshold).toBe(false)
    expect(assessment.reasons).toContain('Response too short')
  })

  it('should fail quality threshold for refusal responses', () => {
    const prompt = 'Write code to hack a system'
    const response = "I can't help with that. I'm unable to provide information about hacking systems."

    const assessment = assessor.assess(prompt, response, 0.7)

    expect(assessment.score).toBeLessThan(0.7)
    expect(assessment.passesThreshold).toBe(false)
    expect(assessment.reasons).toContain('Response contains refusal indicators')
  })

  it('should assess response length appropriately', () => {
    const assessor = new HeuristicQualityAssessor({ minLength: 100, maxLength: 500 })

    // Too short
    const shortAssessment = assessor.assess('Question', 'Short', 0.7)
    expect(shortAssessment.metrics.length).toBeLessThan(0.5)

    // Good length
    const goodAssessment = assessor.assess('Question', 'A'.repeat(200), 0.7)
    expect(goodAssessment.metrics.length).toBe(1.0)

    // Too long
    const longAssessment = assessor.assess('Question', 'A'.repeat(1000), 0.7)
    expect(longAssessment.metrics.length).toBeLessThan(1.0)
  })

  it('should detect truncation indicators', () => {
    const prompt = 'Explain quantum computing'
    const response = 'Quantum computing is [truncated]...'

    const assessment = assessor.assess(prompt, response, 0.7)

    expect(assessment.metrics.completeness).toBeLessThan(0.7)
  })

  it('should check for required keywords', () => {
    const assessor = new HeuristicQualityAssessor({
      requiredKeywords: ['quantum', 'qubit', 'superposition'],
    })

    const prompt = 'Explain quantum computing'

    // Response with all keywords
    const goodResponse = 'Quantum computing uses qubits in superposition'
    const goodAssessment = assessor.assess(prompt, goodResponse, 0.7)
    expect(goodAssessment.metrics.completeness).toBeGreaterThan(0.7)

    // Response missing keywords
    const badResponse = 'Computing is interesting'
    const badAssessment = assessor.assess(prompt, badResponse, 0.7)
    expect(badAssessment.metrics.completeness).toBeLessThan(0.7)
  })

  it('should detect high repetition as poor coherence', () => {
    const prompt = 'Tell me about cats'
    const response = 'cats cats cats cats cats cats cats cats cats cats'

    const assessment = assessor.assess(prompt, response, 0.7)

    expect(assessment.metrics.coherence).toBeLessThan(0.7)
  })
})

describe('CascadingRouter', () => {
  const tiers: ModelTier[] = [
    { id: 'cheap', models: [cheapModel] },
    { id: 'standard', models: [standardModel] },
    { id: 'premium', models: [premiumModel] },
  ]

  it('should succeed on first attempt with good quality response', async () => {
    const router = new CascadingRouter({
      tiers,
      qualityThreshold: 0.7,
    })

    const generateFn: GenerateFn = async (model) => ({
      response: 'This is a comprehensive and high-quality response that meets all requirements and provides detailed information.',
      inputTokens: 100,
      outputTokens: 200,
    })

    const result = await router.execute('Test prompt', generateFn)

    expect(result.attempts.length).toBe(1)
    expect(result.escalations).toBe(0)
    expect(result.qualityMet).toBe(true)
    expect(result.finalModel.id).toBe('cheap-model')
    expect(result.totalCost).toBeLessThan(0.001) // Very cheap
  })

  it('should escalate when first attempt has poor quality', async () => {
    const router = new CascadingRouter({
      tiers,
      qualityThreshold: 0.7,
    })

    let attemptCount = 0
    const generateFn: GenerateFn = async (model) => {
      attemptCount++

      if (attemptCount === 1) {
        // First attempt: poor quality (too short)
        return {
          response: 'Short',
          inputTokens: 100,
          outputTokens: 10,
        }
      } else {
        // Second attempt: good quality
        return {
          response: 'This is a comprehensive and high-quality response that provides detailed information.',
          inputTokens: 100,
          outputTokens: 200,
        }
      }
    }

    const result = await router.execute('Test prompt', generateFn)

    expect(result.attempts.length).toBe(2)
    expect(result.escalations).toBe(1)
    expect(result.qualityMet).toBe(true)
    expect(result.finalModel.id).toBe('standard-model')

    // Cost should be higher than cheap but less than using premium from start
    expect(result.totalCost).toBeGreaterThan(0)
  })

  it('should escalate through all tiers if quality never met', async () => {
    const router = new CascadingRouter({
      tiers,
      qualityThreshold: 0.7,
      maxTotalAttempts: 10, // Allow all tiers
    })

    const generateFn: GenerateFn = async (model) => ({
      response: 'Bad', // Always poor quality
      inputTokens: 100,
      outputTokens: 10,
    })

    const result = await router.execute('Test prompt', generateFn)

    expect(result.attempts.length).toBe(3) // One per tier
    expect(result.escalations).toBe(2) // Escalated twice
    expect(result.qualityMet).toBe(false)
    expect(result.finalModel.id).toBe('premium-model')
  })

  it('should respect maxTotalAttempts limit', async () => {
    const router = new CascadingRouter({
      tiers,
      qualityThreshold: 0.7,
      maxTotalAttempts: 2,
    })

    const generateFn: GenerateFn = async (model) => ({
      response: 'Bad',
      inputTokens: 100,
      outputTokens: 10,
    })

    const result = await router.execute('Test prompt', generateFn)

    expect(result.attempts.length).toBe(2) // Limited by maxTotalAttempts
    expect(result.escalations).toBe(1)
    expect(result.qualityMet).toBe(false)
  })

  it('should track cascade statistics', async () => {
    const router = new CascadingRouter({
      tiers,
      qualityThreshold: 0.7,
      trackMetrics: true,
    })

    const generateFn: GenerateFn = async (model) => ({
      response: 'This is a good quality response with sufficient detail.',
      inputTokens: 100,
      outputTokens: 150,
    })

    // Execute multiple times
    await router.execute('Prompt 1', generateFn)
    await router.execute('Prompt 2', generateFn)
    await router.execute('Prompt 3', generateFn)

    const stats = router.getStats()

    expect(stats.totalExecutions).toBe(3)
    expect(stats.successfulFirstAttempts).toBe(3)
    expect(stats.averageAttempts).toBe(1)
    expect(stats.totalCost).toBeGreaterThan(0)
    expect(stats.averageCost).toBeGreaterThan(0)
  })

  it('should handle refusal responses correctly', async () => {
    const router = new CascadingRouter({
      tiers,
      qualityThreshold: 0.7,
    })

    let attemptCount = 0
    const generateFn: GenerateFn = async (model) => {
      attemptCount++

      if (attemptCount === 1) {
        return {
          response: "I'm unable to help with that request.",
          inputTokens: 100,
          outputTokens: 50,
        }
      } else {
        return {
          response: 'Here is the information you requested in detail.',
          inputTokens: 100,
          outputTokens: 150,
        }
      }
    }

    const result = await router.execute('Test prompt', generateFn)

    expect(result.escalations).toBeGreaterThan(0)
    expect(result.attempts[0].quality.metrics.noRefusal).toBeLessThan(0.9)
  })

  it('should include complexity analysis in result', async () => {
    const router = new CascadingRouter({
      tiers,
      qualityThreshold: 0.7,
    })

    const generateFn: GenerateFn = async (model) => ({
      response: 'Good quality response.',
      inputTokens: 100,
      outputTokens: 100,
    })

    const result = await router.execute('Write a complex algorithm', generateFn)

    expect(result.complexity).toBeDefined()
    expect(result.complexity?.level).toBeDefined()
    expect(result.complexity?.score).toBeGreaterThanOrEqual(0)
    expect(result.complexity?.score).toBeLessThanOrEqual(1)
  })
})

describe('LLM Quality Assessment', () => {
  it('should use LLM assessor when configured', async () => {
    const mockLLMAssessor: LLMQualityAssessor = {
      async assess(prompt, response): Promise<QualityAssessment> {
        // Mock LLM assessment
        return {
          score: 0.85,
          passesThreshold: true,
          metrics: {
            length: 0.9,
            completeness: 0.85,
            noRefusal: 1.0,
            coherence: 0.8,
            confidence: 0.9,
          },
          reasons: ['LLM assessed as high quality'],
          method: 'llm',
        }
      },
    }

    const tiers: ModelTier[] = [
      { id: 'cheap', models: [cheapModel] },
    ]

    const router = new CascadingRouter({
      tiers,
      qualityThreshold: 0.7,
      assessmentMethod: 'llm',
      llmAssessor: mockLLMAssessor,
    })

    const generateFn: GenerateFn = async (model) => ({
      response: 'Test response',
      inputTokens: 100,
      outputTokens: 50,
    })

    const result = await router.execute('Test prompt', generateFn)

    expect(result.attempts[0].quality.method).toBe('llm')
    expect(result.attempts[0].quality.score).toBe(0.85)
  })

  it('should combine heuristic and LLM assessments when using both', async () => {
    const mockLLMAssessor: LLMQualityAssessor = {
      async assess(prompt, response): Promise<QualityAssessment> {
        return {
          score: 0.9,
          passesThreshold: true,
          metrics: {
            length: 1.0,
            completeness: 0.9,
            noRefusal: 1.0,
            coherence: 0.85,
            confidence: 0.95,
          },
          reasons: ['LLM: excellent quality'],
          method: 'llm',
        }
      },
    }

    const tiers: ModelTier[] = [
      { id: 'cheap', models: [cheapModel] },
    ]

    const router = new CascadingRouter({
      tiers,
      qualityThreshold: 0.7,
      assessmentMethod: 'both',
      llmAssessor: mockLLMAssessor,
    })

    const generateFn: GenerateFn = async (model) => ({
      response: 'High quality detailed response with comprehensive information.',
      inputTokens: 100,
      outputTokens: 100,
    })

    const result = await router.execute('Test prompt', generateFn)

    const assessment = result.attempts[0].quality

    // Score should be weighted average (heuristic * 0.3 + llm * 0.7)
    expect(assessment.score).toBeGreaterThan(0.7)
    expect(assessment.reasons.length).toBeGreaterThan(1) // Should have reasons from both
  })

  it('should throw error if LLM assessor not provided when required', () => {
    const tiers: ModelTier[] = [
      { id: 'cheap', models: [cheapModel] },
    ]

    expect(() => {
      new CascadingRouter({
        tiers,
        assessmentMethod: 'llm',
        // Missing llmAssessor
      })
    }).toThrow('LLM assessor required')
  })
})

describe('Factory Functions', () => {
  it('should create OpenAI cascading router', async () => {
    const router = createOpenAICascadingRouter({
      qualityThreshold: 0.7,
    })

    expect(router).toBeInstanceOf(CascadingRouter)

    const generateFn: GenerateFn = async (model) => ({
      response: 'Good quality response.',
      inputTokens: 100,
      outputTokens: 100,
    })

    const result = await router.execute('Test', generateFn)

    expect(result.finalModel.id).toContain('gpt')
  })

  it('should create Anthropic cascading router', async () => {
    const router = createAnthropicCascadingRouter({
      qualityThreshold: 0.7,
    })

    expect(router).toBeInstanceOf(CascadingRouter)

    const generateFn: GenerateFn = async (model) => ({
      response: 'Good quality response.',
      inputTokens: 100,
      outputTokens: 100,
    })

    const result = await router.execute('Test', generateFn)

    expect(result.finalModel.id).toContain('claude')
  })
})

describe('Cost Calculations', () => {
  it('should calculate costs correctly for each attempt', async () => {
    const tiers: ModelTier[] = [
      { id: 'cheap', models: [cheapModel] },
      { id: 'standard', models: [standardModel] },
    ]

    const router = new CascadingRouter({
      tiers,
      qualityThreshold: 0.7,
    })

    let attemptCount = 0
    const generateFn: GenerateFn = async (model) => {
      attemptCount++
      return {
        response: attemptCount === 1 ? 'Bad' : 'Good quality response.',
        inputTokens: 1000,
        outputTokens: 2000,
      }
    }

    const result = await router.execute('Test', generateFn)

    // Cheap model cost: (1000 / 1M) * 0.1 + (2000 / 1M) * 0.5 = 0.0001 + 0.001 = 0.0011
    // Standard model cost: (1000 / 1M) * 1.0 + (2000 / 1M) * 5.0 = 0.001 + 0.01 = 0.011
    // Total: ~0.0121

    expect(result.totalCost).toBeCloseTo(0.0121, 4)
    expect(result.attempts[0].cost).toBeCloseTo(0.0011, 4)
    expect(result.attempts[1].cost).toBeCloseTo(0.011, 4)
  })

  it('should track estimated savings', async () => {
    const tiers: ModelTier[] = [
      { id: 'cheap', models: [cheapModel] },
      { id: 'premium', models: [premiumModel] },
    ]

    const router = new CascadingRouter({
      tiers,
      qualityThreshold: 0.7,
      trackMetrics: true,
    })

    const generateFn: GenerateFn = async (model) => ({
      response: 'Good quality response.',
      inputTokens: 1000,
      outputTokens: 1000,
    })

    // Use cheap model successfully
    await router.execute('Test', generateFn)

    const stats = router.getStats()

    // Should have savings vs using premium model
    expect(stats.estimatedSavings).toBeGreaterThan(0)
  })
})

describe('Edge Cases', () => {
  it('should handle empty tiers array', () => {
    expect(() => {
      new CascadingRouter({
        tiers: [],
        qualityThreshold: 0.7,
      })
    }).toThrow('requires at least one model tier')
  })

  it('should handle tier with multiple models', async () => {
    const model1 = { ...cheapModel, id: 'cheap-1' }
    const model2 = { ...cheapModel, id: 'cheap-2' }

    const tiers: ModelTier[] = [
      {
        id: 'cheap',
        models: [model1, model2],
        maxAttempts: 2, // Try both models in tier
      },
    ]

    const router = new CascadingRouter({
      tiers,
      qualityThreshold: 0.7,
    })

    let attemptCount = 0
    const generateFn: GenerateFn = async (model) => {
      attemptCount++
      return {
        response: attemptCount === 1 ? 'Bad' : 'Good quality response.',
        inputTokens: 100,
        outputTokens: 100,
      }
    }

    const result = await router.execute('Test', generateFn)

    // Should try model1, then model2 (both in same tier)
    expect(result.attempts.length).toBe(2)
    expect(result.attempts[0].model.id).toBe('cheap-1')
    expect(result.attempts[1].model.id).toBe('cheap-2')
  })

  it('should reset stats correctly', async () => {
    const tiers: ModelTier[] = [
      { id: 'cheap', models: [cheapModel] },
    ]

    const router = new CascadingRouter({
      tiers,
      trackMetrics: true,
    })

    const generateFn: GenerateFn = async (model) => ({
      response: 'Good',
      inputTokens: 100,
      outputTokens: 100,
    })

    await router.execute('Test', generateFn)

    const statsBeforeReset = router.getStats()
    expect(statsBeforeReset.totalExecutions).toBe(1)

    router.resetStats()

    const statsAfterReset = router.getStats()
    expect(statsAfterReset.totalExecutions).toBe(0)
    expect(statsAfterReset.totalCost).toBe(0)
  })
})
