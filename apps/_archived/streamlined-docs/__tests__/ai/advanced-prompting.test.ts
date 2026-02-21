/**
 * Tests for Advanced Prompting System
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { classifyQueryComplexity, QueryComplexity } from '@/lib/ai/query-complexity-classifier'
import { generateCoTPrompt } from '@/lib/ai/chain-of-thought-prompts'
import {
  generateCitationPrompt,
  extractCitations,
  validateCitations,
  type Source,
} from '@/lib/ai/citation-grounded-prompts'

describe('Advanced Prompting System', () => {
  const mockSources: Source[] = [
    {
      id: '1',
      title: 'React Hooks Documentation',
      url: '/docs/hooks',
      content: 'React Hooks are functions that let you use state and other React features.',
    },
    {
      id: '2',
      title: 'useState Hook',
      url: '/docs/hooks/use-state',
      content: 'useState is a Hook that lets you add React state to function components.',
    },
  ]

  describe('Chain-of-Thought Prompting', () => {
    it('should use simple prompt for simple queries', () => {
      const classification = classifyQueryComplexity('What is React?')
      const prompt = generateCoTPrompt('What is React?', classification.complexity, [])

      expect(prompt.systemPrompt).not.toContain('step by step')
      expect(prompt.systemPrompt).toContain('concise')
    })

    it('should use structured thinking for moderate queries', () => {
      const classification = classifyQueryComplexity('How to use useState hook?')
      const prompt = generateCoTPrompt(
        'How to use useState hook?',
        classification.complexity,
        []
      )

      expect(prompt.systemPrompt).toContain('key concepts')
    })

    it('should use full CoT for complex queries', () => {
      const classification = classifyQueryComplexity(
        'Explain the difference between useMemo and useCallback'
      )
      const prompt = generateCoTPrompt(
        'Explain the difference between useMemo and useCallback',
        classification.complexity,
        []
      )

      expect(prompt.systemPrompt).toContain('step by step')
      expect(prompt.userPrompt).toContain('systematically')
    })

    it('should include context in user prompt', () => {
      const classification = classifyQueryComplexity('What is React?')
      const context = ['React is a library', 'React uses JSX']
      const prompt = generateCoTPrompt('What is React?', classification.complexity, context)

      expect(prompt.userPrompt).toContain('React is a library')
      expect(prompt.userPrompt).toContain('React uses JSX')
    })
  })

  describe('Citation-Grounded Prompting', () => {
    it('should format sources with IDs', () => {
      const prompt = generateCitationPrompt('What are React Hooks?', mockSources)

      expect(prompt.userPrompt).toContain('[1]')
      expect(prompt.userPrompt).toContain('[2]')
      expect(prompt.userPrompt).toContain('React Hooks Documentation')
    })

    it('should require citations in system prompt', () => {
      const prompt = generateCitationPrompt('What are React Hooks?', mockSources)

      expect(prompt.systemPrompt).toContain('MUST')
      expect(prompt.systemPrompt).toContain('citation')
      expect(prompt.systemPrompt).toContain('[1]')
    })

    it('should extract citations correctly', () => {
      const response = 'React Hooks are functions [1]. useState adds state [2].'
      const grounded = extractCitations(response, mockSources)

      expect(grounded.citations.length).toBe(2)
      expect(grounded.citations[0].sourceId).toBe('1')
      expect(grounded.citations[1].sourceId).toBe('2')
    })

    it('should identify uncited factual claims', () => {
      const response = 'React is fast and efficient. It uses a virtual DOM [1].'
      const grounded = extractCitations(response, mockSources)

      expect(grounded.uncitedClaims.length).toBeGreaterThan(0)
      expect(grounded.uncitedClaims[0]).toContain('fast and efficient')
    })

    it('should not flag short sentences as uncited claims', () => {
      const response = 'Yes. React uses a virtual DOM [1].'
      const grounded = extractCitations(response, mockSources)

      expect(grounded.uncitedClaims.length).toBe(0)
    })

    it('should not flag meta-commentary as uncited claims', () => {
      const response = "I don't have information about that. React uses hooks [1]."
      const grounded = extractCitations(response, mockSources)

      const hasDontHaveClaim = grounded.uncitedClaims.some((claim) =>
        claim.includes("don't have")
      )
      expect(hasDontHaveClaim).toBe(false)
    })

    it('should validate citation quality', () => {
      const grounded = {
        answer: 'React Hooks are functions [1]. useState adds state [2].',
        citations: [
          {
            claim: 'React Hooks are functions [1]',
            sourceId: '1',
            sourceTitle: 'React Hooks Documentation',
            sourceUrl: '/docs/hooks',
          },
          {
            claim: 'useState adds state [2]',
            sourceId: '2',
            sourceTitle: 'useState Hook',
            sourceUrl: '/docs/hooks/use-state',
          },
        ],
        uncitedClaims: [],
      }

      const validation = validateCitations(grounded)
      expect(validation.isValid).toBe(true)
      expect(validation.issues.length).toBe(0)
    })

    it('should detect low citation density', () => {
      const grounded = {
        answer: 'React is great. It has many features. Hooks are useful. Components are reusable. State management is easy. Only one citation [1].',
        citations: [
          {
            claim: 'Only one citation [1]',
            sourceId: '1',
            sourceTitle: 'React Docs',
            sourceUrl: '/docs',
          },
        ],
        uncitedClaims: [],
      }

      const validation = validateCitations(grounded)
      expect(validation.isValid).toBe(false)
      expect(validation.issues.some((issue) => issue.includes('citation density'))).toBe(true)
    })
  })

  describe('Integration Tests', () => {
    it('should work end-to-end for simple query', () => {
      const query = 'What is React?'
      const classification = classifyQueryComplexity(query)
      const prompt = generateCoTPrompt(query, classification.complexity, [])

      expect(classification.complexity).toBe(QueryComplexity.SIMPLE)
      expect(prompt.systemPrompt).toBeTruthy()
      expect(prompt.userPrompt).toContain(query)
    })

    it('should work end-to-end for complex query with citations', () => {
      const query = 'Explain the difference between useMemo and useCallback'
      const classification = classifyQueryComplexity(query)
      const citationPrompt = generateCitationPrompt(query, mockSources)

      expect(classification.complexity).toBe(QueryComplexity.COMPLEX)
      expect(citationPrompt.systemPrompt).toContain('citation')
      expect(citationPrompt.userPrompt).toContain('[1]')
    })
  })
})
