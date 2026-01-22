import { describe, it, expect, beforeEach } from 'vitest'
import {
  ModelRouter,
  ModelConfig,
  RoutingStrategy,
} from '../../routing/model-router'
import { ComplexityLevel } from '../../routing/complexity-analyzer'

describe('ModelRouter', () => {
  let router: ModelRouter

  const testModels: ModelConfig[] = [
    {
      id: 'gpt-4o-mini',
      tier: 'small',
      inputCostPer1M: 0.15,
      outputCostPer1M: 0.6,
      contextWindow: 128000,
      maxOutput: 16384,
      capabilities: ['text', 'code'],
    },
    {
      id: 'gpt-4o',
      tier: 'medium',
      inputCostPer1M: 2.5,
      outputCostPer1M: 10,
      contextWindow: 128000,
      maxOutput: 16384,
      capabilities: ['text', 'code', 'vision'],
    },
    {
      id: 'claude-3-5-sonnet',
      tier: 'large',
      inputCostPer1M: 3,
      outputCostPer1M: 15,
      contextWindow: 200000,
      maxOutput: 8192,
      capabilities: ['text', 'code', 'reasoning'],
    },
    {
      id: 'claude-3-opus',
      tier: 'premium',
      inputCostPer1M: 15,
      outputCostPer1M: 75,
      contextWindow: 200000,
      maxOutput: 4096,
      capabilities: ['text', 'code', 'reasoning', 'complex'],
    },
  ]

  beforeEach(() => {
    router = new ModelRouter({ models: testModels })
  })

  describe('basic routing', () => {
    it('routes simple prompts to small models', () => {
      const result = router.route('Hello, how are you?')

      expect(result.selectedModel.tier).toBe('small')
      expect(result.selectedModel.id).toBe('gpt-4o-mini')
    })

    it('routes moderate prompts to medium models', () => {
      const result = router.route(
        'Write a function to validate email addresses'
      )

      expect(result.selectedModel.tier).toBe('medium')
    })

    it('routes complex prompts to large models', () => {
      const result = router.route(`
        Analyze the security implications of implementing OAuth 2.0
        in a distributed microservices architecture. Consider:
        - Token storage strategies
        - Service-to-service authentication
        - Rate limiting and abuse prevention
      `)

      expect(['large', 'premium']).toContain(result.selectedModel.tier)
    })
  })

  describe('cost optimization', () => {
    it('returns cost estimate for selected model', () => {
      const result = router.route('Hello', { estimatedTokens: 1000 })

      expect(result.estimatedCost).toBeDefined()
      expect(result.estimatedCost).toBeGreaterThan(0)
    })

    it('calculates input and output costs separately', () => {
      const result = router.route('Hello', {
        estimatedInputTokens: 100,
        estimatedOutputTokens: 500,
      })

      expect(result.inputCost).toBeDefined()
      expect(result.outputCost).toBeDefined()
      expect(result.estimatedCost).toBeCloseTo(
        result.inputCost! + result.outputCost!,
        6
      )
    })

    it('selects cheaper model when complexity allows', () => {
      const simple = router.route('Hi there')
      const complex = router.route(`
        Design and implement a complete authentication system with OAuth 2.0.
        First, analyze the security requirements.
        Then, create the database schema.
        Finally, implement the API endpoints with proper encryption.
      `)

      // Complex prompt should route to a more capable (and expensive) model
      expect(simple.selectedModel!.inputCostPer1M).toBeLessThanOrEqual(
        complex.selectedModel!.inputCostPer1M
      )
    })
  })

  describe('routing strategies', () => {
    it('uses cost-optimized strategy by default', () => {
      const result = router.route('Hello')

      expect(result.strategy).toBe(RoutingStrategy.CostOptimized)
    })

    it('supports quality-first strategy', () => {
      const qualityRouter = new ModelRouter({
        models: testModels,
        defaultStrategy: RoutingStrategy.QualityFirst,
      })

      const result = qualityRouter.route('Simple question')

      // Quality-first should use larger models even for simple prompts
      expect(['medium', 'large', 'premium']).toContain(
        result.selectedModel.tier
      )
    })

    it('supports balanced strategy', () => {
      const balancedRouter = new ModelRouter({
        models: testModels,
        defaultStrategy: RoutingStrategy.Balanced,
      })

      const result = balancedRouter.route('Write some code')

      expect(result.strategy).toBe(RoutingStrategy.Balanced)
    })

    it('allows per-request strategy override', () => {
      const result = router.route('Hello', {
        strategy: RoutingStrategy.QualityFirst,
      })

      expect(result.strategy).toBe(RoutingStrategy.QualityFirst)
    })
  })

  describe('capability matching', () => {
    it('routes to models with required capabilities', () => {
      const result = router.route('Analyze this image', {
        requiredCapabilities: ['vision'],
      })

      expect(result.selectedModel.capabilities).toContain('vision')
    })

    it('routes reasoning tasks to capable models', () => {
      const result = router.route('Explain why this approach is better', {
        requiredCapabilities: ['reasoning'],
      })

      expect(result.selectedModel.capabilities).toContain('reasoning')
    })

    it('returns null if no model has required capabilities', () => {
      const result = router.route('Do something special', {
        requiredCapabilities: ['nonexistent'],
      })

      expect(result.selectedModel).toBeUndefined()
      expect(result.fallbackReason).toContain('capability')
    })
  })

  describe('context window constraints', () => {
    it('excludes models with insufficient context window', () => {
      const smallContextModels: ModelConfig[] = [
        {
          id: 'small-context',
          tier: 'small',
          inputCostPer1M: 0.1,
          outputCostPer1M: 0.1,
          contextWindow: 1000,
          maxOutput: 500,
          capabilities: ['text'],
        },
        {
          id: 'large-context',
          tier: 'medium',
          inputCostPer1M: 1,
          outputCostPer1M: 1,
          contextWindow: 100000,
          maxOutput: 10000,
          capabilities: ['text'],
        },
      ]

      const routerWithSmall = new ModelRouter({ models: smallContextModels })
      const result = routerWithSmall.route('Hello', {
        estimatedInputTokens: 5000,
      })

      expect(result.selectedModel?.id).toBe('large-context')
    })
  })

  describe('fallback behavior', () => {
    it('falls back to larger model if smaller is unavailable', () => {
      const limitedModels: ModelConfig[] = [
        {
          id: 'only-large',
          tier: 'large',
          inputCostPer1M: 5,
          outputCostPer1M: 15,
          contextWindow: 100000,
          maxOutput: 8000,
          capabilities: ['text', 'code'],
        },
      ]

      const limitedRouter = new ModelRouter({ models: limitedModels })
      const result = limitedRouter.route('Hello')

      expect(result.selectedModel?.id).toBe('only-large')
      expect(result.fallbackReason).toContain('unavailable')
    })
  })

  describe('complexity analysis integration', () => {
    it('includes complexity analysis in result', () => {
      const result = router.route('Write a sorting algorithm')

      expect(result.complexity).toBeDefined()
      expect(result.complexity?.level).toBeDefined()
      expect(result.complexity?.score).toBeDefined()
    })

    it('uses complexity to determine model tier', () => {
      const simpleResult = router.route('Hi')
      const complexResult = router.route(`
        Design a distributed database with ACID compliance,
        horizontal scaling, and automatic failover.
        First analyze the requirements, then propose architecture.
      `)

      expect(simpleResult.complexity?.level === ComplexityLevel.Low).toBe(true)
      expect(
        complexResult.complexity?.level === ComplexityLevel.High ||
          complexResult.complexity?.level === ComplexityLevel.Critical
      ).toBe(true)
    })
  })

  describe('model filtering', () => {
    it('allows filtering by model id', () => {
      const result = router.route('Hello', {
        allowedModels: ['gpt-4o', 'claude-3-5-sonnet'],
      })

      expect(['gpt-4o', 'claude-3-5-sonnet']).toContain(
        result.selectedModel?.id
      )
    })

    it('allows excluding specific models', () => {
      const result = router.route('Hello', {
        excludedModels: ['gpt-4o-mini'],
      })

      expect(result.selectedModel?.id).not.toBe('gpt-4o-mini')
    })
  })

  describe('statistics', () => {
    it('tracks routing decisions', () => {
      router.route('Query 1')
      router.route('Query 2')
      router.route('Query 3')

      const stats = router.getStats()

      expect(stats.totalRoutes).toBe(3)
    })

    it('tracks cost savings', () => {
      // Route some simple queries that use small models
      router.route('Hello', { estimatedTokens: 1000 })
      router.route('Hi there', { estimatedTokens: 1000 })

      const stats = router.getStats()

      expect(stats.estimatedSavings).toBeGreaterThanOrEqual(0)
    })
  })
})
