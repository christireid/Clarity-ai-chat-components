/**
 * Integration Tests for Unified Token Optimizer
 */

import { 
  UnifiedTokenOptimizer, 
  optimizeTokens, 
  getOptimizationStats 
} from '../src/unified-optimizer'

describe('UnifiedTokenOptimizer Integration', () => {
  let optimizer: UnifiedTokenOptimizer
  
  beforeEach(() => {
    optimizer = new UnifiedTokenOptimizer({
      enableCaching: true,
      enableCompression: true,
      enableModelRouting: true,
      minQuality: 0.7
    })
  })
  
  describe('optimize', () => {
    it('should optimize content with all techniques', async () => {
      const content = 'This is test content for unified optimization testing. '.repeat(100)
      
      const result = await optimizer.optimize({
        content,
        requirements: {
          enableCaching: true,
          enableCompression: true,
          enableModelRouting: true
        },
        constraints: {
          maxCost: 0.01 // Reasonable cost limit
        },
        context: {
          reuseProbability: 0.5
        }
      })
      
      expect(result.optimizedContent).toBeDefined()
      expect(result.selectedModel).toBeDefined()
      expect(result.totalCost).toBeGreaterThan(0)
      expect(result.costSavings).toBeGreaterThanOrEqual(0)
      expect(result.estimatedQuality).toBeGreaterThanOrEqual(0.7)
      expect(result.confidence).toBeGreaterThan(0)
      expect(result.processingTime).toBeGreaterThan(0)
      
      // Check savings breakdown
      expect(result.savingsBreakdown).toBeDefined()
      expect(result.savingsBreakdown.caching).toBeGreaterThanOrEqual(0)
      expect(result.savingsBreakdown.compression).toBeGreaterThanOrEqual(0)
      expect(result.savingsBreakdown.modelRouting).toBeGreaterThanOrEqual(0)
    })
    
    it('should optimize with minimal requirements', async () => {
      const content = 'Simple content for minimal optimization. '.repeat(50)
      
      const result = await optimizer.optimize({
        content,
        requirements: {},
        constraints: {},
        context: {}
      })
      
      expect(result.optimizedContent).toBeDefined()
      expect(result.totalCost).toBeGreaterThan(0)
      expect(result.estimatedQuality).toBeGreaterThanOrEqual(0.7)
    })
    
    it('should handle empty content', async () => {
      const result = await optimizer.optimize({
        content: '',
        requirements: {},
        constraints: {},
        context: {}
      })
      
      expect(result.optimizedContent).toBe('')
      expect(result.totalCost).toBe(0)
      expect(result.costSavings).toBe(0)
    })
    
    it('should optimize with caching disabled', async () => {
      const content = 'Content without caching. '.repeat(100)
      
      const result = await optimizer.optimize({
        content,
        requirements: {
          enableCaching: false,
          enableCompression: true,
          enableModelRouting: true
        },
        constraints: {},
        context: {}
      })
      
      expect(result.savingsBreakdown.caching).toBe(0)
      expect(result.savingsBreakdown.compression).toBeGreaterThanOrEqual(0)
      expect(result.savingsBreakdown.modelRouting).toBeGreaterThanOrEqual(0)
    })
    
    it('should optimize with compression disabled', async () => {
      const content = 'Content without compression. '.repeat(100)
      
      const result = await optimizer.optimize({
        content,
        requirements: {
          enableCaching: true,
          enableCompression: false,
          enableModelRouting: true
        },
        constraints: {},
        context: {}
      })
      
      expect(result.savingsBreakdown.compression).toBe(0)
      expect(result.savingsBreakdown.caching).toBeGreaterThanOrEqual(0)
      expect(result.savingsBreakdown.modelRouting).toBeGreaterThanOrEqual(0)
    })
    
    it('should optimize with model routing disabled', async () => {
      const content = 'Content without model routing. '.repeat(100)
      
      const result = await optimizer.optimize({
        content,
        requirements: {
          enableCaching: true,
          enableCompression: true,
          enableModelRouting: false
        },
        constraints: {},
        context: {}
      })
      
      expect(result.savingsBreakdown.modelRouting).toBe(0)
      expect(result.selectedModel).toBe('generic')
      expect(result.savingsBreakdown.caching).toBeGreaterThanOrEqual(0)
      expect(result.savingsBreakdown.compression).toBeGreaterThanOrEqual(0)
    })
  })
  
  describe('optimizeTokens convenience function', () => {
    it('should optimize using convenience function', async () => {
      const content = 'Content for convenience function optimization. '.repeat(50)
      
      const result = await optimizeTokens(content, {
        enableCaching: true,
        enableCompression: true
      })
      
      expect(result.optimizedContent).toBeDefined()
      expect(result.totalCost).toBeGreaterThan(0)
      expect(result.estimatedQuality).toBeGreaterThanOrEqual(0.7)
    })
    
    it('should handle different content types', async () => {
      const codeContent = `
        function processData(data) {
          return data.map(item => ({
            id: item.id,
            processed: true
          }))
        }
      `
      
      const result = await optimizeTokens(codeContent)
      
      expect(result.optimizedContent).toBeDefined()
      expect(result.selectedModel).toBeDefined()
    })
    
    it('should handle technical documentation', async () => {
      const docContent = `
        # Technical Documentation
        
        This document describes the architecture and implementation details
        of the token optimization system.
        
        ## Architecture Overview
        
        The system consists of multiple components working together...
      `
      
      const result = await optimizeTokens(docContent)
      
      expect(result.optimizedContent).toBeDefined()
      expect(result.estimatedQuality).toBeGreaterThanOrEqual(0.7)
    })
  })
  
  describe('getOptimizationStats', () => {
    it('should provide optimization statistics', () => {
      const stats = getOptimizationStats()
      
      expect(stats).toBeDefined()
      expect(stats.totalOptimizations).toBe(0)
      expect(stats.averageSavings).toBe(0)
      expect(stats.averageQuality).toBe(0)
      expect(stats.mostEffectiveStrategy).toBe('none')
    })
    
    it('should provide stats after optimizations', async () => {
      // Perform some optimizations
      for (let i = 0; i < 5; i++) {
        await optimizeTokens(`Test content ${i}. `.repeat(50))
      }
      
      const stats = getOptimizationStats()
      
      expect(stats.totalOptimizations).toBe(5)
      expect(stats.averageSavings).toBeGreaterThanOrEqual(0)
      expect(stats.averageQuality).toBeGreaterThanOrEqual(0.7)
      expect(stats.mostEffectiveStrategy).toBeDefined()
    })
  })
  
  describe('performance benchmarks', () => {
    it('should optimize within reasonable time', async () => {
      const content = 'Performance test content. '.repeat(200)
      
      const startTime = Date.now()
      const result = await optimizeTokens(content)
      const endTime = Date.now()
      
      expect(result.processingTime).toBeLessThan(5000) // Should complete within 5 seconds
      expect(endTime - startTime).toBeLessThan(6000) // Total time including overhead
    })
    
    it('should achieve meaningful cost savings', async () => {
      const content = 'Cost savings test content. '.repeat(500)
      
      const result = await optimizeTokens(content)
      
      // Should achieve at least 20% cost savings
      expect(result.costSavings).toBeGreaterThan(0.2)
      expect(result.confidence).toBeGreaterThan(0.5)
    })
  })
  
  describe('error handling', () => {
    it('should handle very long content gracefully', async () => {
      const longContent = 'Very long content for error handling. '.repeat(1000)
      
      const result = await optimizeTokens(longContent)
      
      expect(result.optimizedContent).toBeDefined()
      expect(result.processingTime).toBeLessThan(10000) // Should not hang
    })
    
    it('should handle special characters', async () => {
      const specialContent = 'Special chars: émojis 🚀 and symbols © ™ •'
      
      const result = await optimizeTokens(specialContent)
      
      expect(result.optimizedContent).toBeDefined()
      expect(result.selectedModel).toBeDefined()
    })
  })
})

describe('Integration with real-world scenarios', () => {
  let optimizer: UnifiedTokenOptimizer
  
  beforeEach(() => {
    optimizer = new UnifiedTokenOptimizer()
  })
  
  it('should optimize customer support content', async () => {
    const supportContent = `
      Customer: I'm having trouble with my account login. 
      The system keeps saying my password is incorrect but I'm sure it's right.
      
      Agent: I understand your frustration. Let me help you resolve this login issue.
      First, could you try clearing your browser cache and cookies?
      Then attempt to login again using the "Forgot Password" link if needed.
      
      Customer: I've tried that but it's still not working.
      
      Agent: Let me check your account status and see what's causing the issue.
    `
    
    const result = await optimizer.optimize({
      content: supportContent,
      requirements: {},
      constraints: {},
      context: {}
    })
    
    expect(result.optimizedContent).toBeDefined()
    expect(result.costSavings).toBeGreaterThan(0)
  })
  
  it('should optimize code review content', async () => {
    const codeReviewContent = `
      Code Review for PR #123:
      
      The implementation looks good overall, but I have a few suggestions:
      
      1. In the authentication module, consider using async/await instead of callbacks
         for better error handling and readability.
         
      2. The database query in line 45 could be optimized by adding an index
         on the user_id column to improve performance.
         
      3. Add more unit tests for the edge cases in the validation logic.
      
      4. Consider implementing rate limiting to prevent abuse.
      
      5. The error messages could be more user-friendly.
    `
    
    const result = await optimizer.optimize({
      content: codeReviewContent,
      requirements: {},
      constraints: {},
      context: {}
    })
    
    expect(result.optimizedContent).toBeDefined()
    expect(result.estimatedQuality).toBeGreaterThanOrEqual(0.7)
  })
  
  it('should optimize documentation content', async () => {
    const docContent = `
      # API Documentation
      
      ## Authentication
      
      All API requests require authentication using Bearer tokens. Include your token in the Authorization header:
      
      \`\`\`
      Authorization: Bearer YOUR_TOKEN_HERE
      \`\`\`
      
      ## Rate Limiting
      
      API requests are limited to 1000 requests per hour per API key. Rate limit headers are included in all responses:
      
      - X-RateLimit-Limit: 1000
      - X-RateLimit-Remaining: 999
      - X-RateLimit-Reset: 1640995200
      
      ## Error Handling
      
      The API uses standard HTTP status codes:
      
      - 200: Success
      - 400: Bad Request
      - 401: Unauthorized
      - 429: Too Many Requests
      - 500: Internal Server Error
    `
    
    const result = await optimizer.optimize({
      content: docContent,
      requirements: {},
      constraints: {},
      context: {}
    })
    
    expect(result.optimizedContent).toBeDefined()
    expect(result.selectedModel).toBeDefined()
  })
})