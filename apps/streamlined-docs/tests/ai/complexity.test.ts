/**
 * Tests for Query Complexity Classifier
 */

import { describe, it, expect } from 'vitest'
import { classifyQueryComplexity, QueryComplexity } from '@/lib/ai/complexity'

describe('Query Complexity Classifier', () => {
  describe('Simple queries', () => {
    it('should classify short questions as simple', () => {
      const result = classifyQueryComplexity('What is React?')
      expect(result.complexity).toBe(QueryComplexity.SIMPLE)
    })

    it('should classify basic fact lookups as simple', () => {
      const result = classifyQueryComplexity('API key')
      expect(result.complexity).toBe(QueryComplexity.SIMPLE)
    })

    it('should extract keywords from simple queries', () => {
      const result = classifyQueryComplexity('What is React?')
      expect(result.keywords).toContain('react')
    })
  })

  describe('Moderate queries', () => {
    it('should classify "how to" questions as moderate', () => {
      const result = classifyQueryComplexity('How to use useState hook?')
      expect(result.complexity).toBe(QueryComplexity.MODERATE)
    })

    it('should classify "what is" questions with details as moderate', () => {
      const result = classifyQueryComplexity('What is the useChatStream hook?')
      expect(result.complexity).toBe(QueryComplexity.MODERATE)
    })

    it('should classify medium-length queries as moderate', () => {
      const result = classifyQueryComplexity(
        'How do I configure the chat component?'
      )
      expect(result.complexity).toBe(QueryComplexity.MODERATE)
    })
  })

  describe('Complex queries', () => {
    it('should classify "why" questions as complex', () => {
      const result = classifyQueryComplexity('Why should I use React hooks?')
      expect(result.complexity).toBe(QueryComplexity.COMPLEX)
    })

    it('should classify "explain" questions as complex', () => {
      const result = classifyQueryComplexity(
        'Explain the difference between useMemo and useCallback'
      )
      expect(result.complexity).toBe(QueryComplexity.COMPLEX)
    })

    it('should classify comparison questions as complex', () => {
      const result = classifyQueryComplexity(
        'Compare REST API and GraphQL approaches'
      )
      expect(result.complexity).toBe(QueryComplexity.COMPLEX)
    })

    it('should classify trade-off questions as complex', () => {
      const result = classifyQueryComplexity(
        'What are the trade-offs between server-side and client-side rendering?'
      )
      expect(result.complexity).toBe(QueryComplexity.COMPLEX)
    })

    it('should classify long queries as complex', () => {
      const result = classifyQueryComplexity(
        'How do I set up authentication with JWT tokens, handle refresh tokens, and implement role-based access control?'
      )
      expect(result.complexity).toBe(QueryComplexity.COMPLEX)
      expect(result.reasoning).toContain('lengthy')
    })

    it('should classify multiple questions as complex', () => {
      const result = classifyQueryComplexity(
        'What is React? How does it differ from Vue?'
      )
      expect(result.complexity).toBe(QueryComplexity.COMPLEX)
      expect(result.reasoning).toContain('multiple questions')
    })
  })

  describe('Keyword extraction', () => {
    it('should extract meaningful keywords', () => {
      const result = classifyQueryComplexity(
        'How to use the useChatStream hook with streaming?'
      )
      expect(result.keywords).toContain('usechatstream')
      expect(result.keywords).toContain('streaming')
    })

    it('should filter out common words', () => {
      const result = classifyQueryComplexity(
        'What is the best approach for this?'
      )
      expect(result.keywords).not.toContain('what')
      expect(result.keywords).not.toContain('this')
    })

    it('should only include words 4+ characters', () => {
      const result = classifyQueryComplexity('How to use API key?')
      expect(result.keywords).not.toContain('how')
      expect(result.keywords).not.toContain('use')
      expect(result.keywords).not.toContain('key')
    })
  })
})
