/**
 * Tests for Query Complexity Classifier
 */

import { describe, it, expect } from 'vitest'
import { classifyQueryComplexity, QueryComplexity } from '@/lib/ai/query-complexity-classifier'

describe('Query Complexity Classifier', () => {
  describe('Simple Queries', () => {
    it('should classify short direct questions as simple', () => {
      const result = classifyQueryComplexity('What is React?')
      expect(result.complexity).toBe(QueryComplexity.SIMPLE)
    })

    it('should classify single-word queries as simple', () => {
      const result = classifyQueryComplexity('Help')
      expect(result.complexity).toBe(QueryComplexity.SIMPLE)
    })

    it('should classify basic lookups as simple', () => {
      const result = classifyQueryComplexity('API docs')
      expect(result.complexity).toBe(QueryComplexity.SIMPLE)
    })
  })

  describe('Moderate Queries', () => {
    it('should classify "how to" questions as moderate', () => {
      const result = classifyQueryComplexity('How to use useState hook?')
      expect(result.complexity).toBe(QueryComplexity.MODERATE)
    })

    it('should classify "what is" questions with details as moderate', () => {
      const result = classifyQueryComplexity('What is the purpose of useMemo?')
      expect(result.complexity).toBe(QueryComplexity.MODERATE)
    })

    it('should classify list requests as moderate', () => {
      const result = classifyQueryComplexity('List all available hooks')
      expect(result.complexity).toBe(QueryComplexity.MODERATE)
    })

    it('should classify moderate-length queries as moderate', () => {
      const result = classifyQueryComplexity('Can I use multiple chat components on the same page?')
      expect(result.complexity).toBe(QueryComplexity.MODERATE)
    })
  })

  describe('Complex Queries', () => {
    it('should classify comparison questions as complex', () => {
      const result = classifyQueryComplexity(
        'Explain the difference between useMemo and useCallback and when to use each'
      )
      expect(result.complexity).toBe(QueryComplexity.COMPLEX)
    })

    it('should classify "why" questions as complex', () => {
      const result = classifyQueryComplexity('Why should I use React Context instead of props?')
      expect(result.complexity).toBe(QueryComplexity.COMPLEX)
    })

    it('should classify best practices questions as complex', () => {
      const result = classifyQueryComplexity('What are the best practices for error handling?')
      expect(result.complexity).toBe(QueryComplexity.COMPLEX)
    })

    it('should classify trade-off questions as complex', () => {
      const result = classifyQueryComplexity(
        'What are the trade-offs between client-side and server-side rendering?'
      )
      expect(result.complexity).toBe(QueryComplexity.COMPLEX)
    })

    it('should classify lengthy queries as complex', () => {
      const result = classifyQueryComplexity(
        'I am building a chat application and I need to implement message streaming with proper error handling and retry logic. What is the recommended approach?'
      )
      expect(result.complexity).toBe(QueryComplexity.COMPLEX)
    })
  })

  describe('Keyword Extraction', () => {
    it('should extract meaningful keywords', () => {
      const result = classifyQueryComplexity('How to implement streaming chat with error handling?')
      expect(result.keywords).toContain('implement')
      expect(result.keywords).toContain('streaming')
      expect(result.keywords).toContain('chat')
      expect(result.keywords).toContain('error')
      expect(result.keywords).toContain('handling')
    })

    it('should filter out short words', () => {
      const result = classifyQueryComplexity('How to use the API?')
      expect(result.keywords).not.toContain('how')
      expect(result.keywords).not.toContain('the')
    })
  })

  describe('Reasoning', () => {
    it('should provide reasoning for classification', () => {
      const result = classifyQueryComplexity('What is React?')
      expect(result.reasoning).toBeTruthy()
      expect(result.reasoning.length).toBeGreaterThan(0)
    })
  })
})
