/**
 * Tests for Simple Model Router
 */

import { SimpleModelRouter, routeToOptimalModel, getModelCostComparison } from '../src/routing/simple-router'

describe('SimpleModelRouter', () => {
  let router: SimpleModelRouter
  
  beforeEach(() => {
    router = new SimpleModelRouter()
  })
  
  describe('routeToOptimalModel', () => {
    it('should route simple content to cost-effective model', async () => {
      const content = 'Simple content for routing test'
      const result = await router.routeToOptimalModel({
        content,
        requirements: {
          complexity: 'low',
          quality: 'good'
        },
        constraints: {}
      })
      
      expect(result.selectedModel).toBeDefined()
      expect(result.estimatedCost).toBeGreaterThan(0)
      expect(result.costSavings).toBeGreaterThanOrEqual(0)
      expect(result.confidence).toBeGreaterThan(0.5)
    })
    
    it('should route complex content to capable model', async () => {
      const content = 'Complex analytical content requiring advanced reasoning capabilities for optimal processing and understanding'
      const result = await router.routeToOptimalModel({
        content,
        requirements: {
          complexity: 'high',
          reasoning: true,
          quality: 'excellent'
        },
        constraints: {}
      })
      
      expect(result.selectedModel).toBeDefined()
      expect(result.estimatedQuality).toBeGreaterThan(0.7)
    })
    
    it('should respect budget constraints', async () => {
      const content = 'Test content for budget constraint'
      const maxBudget = 0.001 // Very low budget
      
      const result = await router.routeToOptimalModel({
        content,
        requirements: {
          complexity: 'low'
        },
        constraints: {
          maxCost: maxBudget
        }
      })
      
      expect(result.estimatedCost).toBeLessThanOrEqual(maxBudget)
      expect(result.costSavings).toBeGreaterThanOrEqual(0)
    })
    
    it('should handle preferred models constraint', async () => {
      const content = 'Test content for preferred models'
      const preferredModels = ['gpt-3.5', 'claude'] as const
      
      const result = await router.routeToOptimalModel({
        content,
        requirements: {
          complexity: 'medium'
        },
        constraints: {
          preferredModels
        }
      })
      
      expect(preferredModels).toContain(result.selectedModel)
    })
    
    it('should handle excluded models constraint', async () => {
      const content = 'Test content for excluded models'
      const excludedModels = ['gpt-4'] as const
      
      const result = await router.routeToOptimalModel({
        content,
        requirements: {
          complexity: 'medium'
        },
        constraints: {
          excludedModels
        }
      })
      
      expect(excludedModels).not.toContain(result.selectedModel)
    })
  })
  
  describe('content analysis', () => {
    it('should analyze code content correctly', async () => {
      const codeContent = `
        function calculateSum(numbers) {
          return numbers.reduce((sum, num) => sum + num, 0)
        }
        
        const result = calculateSum([1, 2, 3, 4, 5])
        console.log(result)
      `
      
      const result = await router.routeToOptimalModel({
        content: codeContent,
        requirements: {
          complexity: 'medium'
        },
        constraints: {}
      })
      
      expect(result.selectedModel).toBeDefined()
      expect(result.reasoning).toContain('code')
    })
    
    it('should analyze complex content', async () => {
      const complexContent = `
        The philosophical implications of quantum mechanics extend far beyond the realm of physics,
        challenging our fundamental understanding of reality, causality, and the nature of observation itself.
        When we consider the measurement problem and the role of the observer in collapsing wave functions,
        we must grapple with questions about consciousness, reality, and the fundamental nature of existence.
      `
      
      const result = await router.routeToOptimalModel({
        content: complexContent,
        requirements: {
          complexity: 'high',
          reasoning: true
        },
        constraints: {}
      })
      
      expect(result.selectedModel).toBeDefined()
      expect(result.estimatedQuality).toBeGreaterThan(0.8)
    })
  })
  
  describe('cost optimization', () => {
    it('should select cost-effective model for simple tasks', async () => {
      const simpleContent = 'Simple task requiring basic processing'
      const result = await router.routeToOptimalModel({
        content: simpleContent,
        requirements: {
          complexity: 'low',
          speed: 'fast'
        },
        constraints: {}
      })
      
      // Should prefer cheaper models for simple tasks
      expect(['gpt-3.5', 'generic']).toContain(result.selectedModel)
      expect(result.costSavings).toBeGreaterThan(0)
    })
    
    it('should balance cost and performance', async () => {
      const content = 'Balanced content requiring good performance at reasonable cost'
      const result = await router.routeToOptimalModel({
        content,
        requirements: {
          complexity: 'medium',
          quality: 'good'
        },
        constraints: {}
      })
      
      expect(result.selectedModel).toBeDefined()
      expect(result.estimatedQuality).toBeGreaterThan(0.7)
      expect(result.costSavings).toBeGreaterThan(0)
    })
  })
  
  describe('getModelCostComparison', () => {
    it('should provide cost comparison for different models', () => {
      const tokenCount = 1000
      const comparisons = getModelCostComparison(tokenCount)
      
      expect(comparisons).toHaveLength(5) // All models
      expect(comparisons[0].cost).toBeLessThan(comparisons[comparisons.length - 1].cost)
      
      // Should be sorted by cost
      for (let i = 1; i < comparisons.length; i++) {
        expect(comparisons[i].cost).toBeGreaterThanOrEqual(comparisons[i - 1].cost)
      }
    })
    
    it('should handle different output ratios', () => {
      const tokenCount = 1000
      const lowOutputRatio = 0.1
      const highOutputRatio = 0.5
      
      const lowOutputComparisons = getModelCostComparison(tokenCount, lowOutputRatio)
      const highOutputComparisons = getModelCostComparison(tokenCount, highOutputRatio)
      
      // High output ratio should result in higher costs
      const lowOutputTotal = lowOutputComparisons.reduce((sum, c) => sum + c.cost, 0)
      const highOutputTotal = highOutputComparisons.reduce((sum, c) => sum + c.cost, 0)
      
      expect(highOutputTotal).toBeGreaterThan(lowOutputTotal)
    })
  })
})

describe('routeToOptimalModel convenience function', () => {
  it('should route using convenience function', async () => {
    const content = 'Test content for convenience function'
    const result = await routeToOptimalModel(content, {
      complexity: 'medium'
    })
    
    expect(result.selectedModel).toBeDefined()
    expect(result.estimatedCost).toBeGreaterThan(0)
    expect(result.reasoning).toBeDefined()
  })
})