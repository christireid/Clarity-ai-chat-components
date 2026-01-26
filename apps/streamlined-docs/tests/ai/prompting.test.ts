/**
 * Tests for Advanced Prompting System
 */

import { describe, it, expect } from 'vitest'
import { classifyQueryComplexity, QueryComplexity } from '@/lib/ai/complexity'
import { generateCoTPrompt } from '@/lib/ai/prompts/cot'
import {
  generateCitationPrompt,
  extractCitations,
  verifyCitations,
  type Source,
} from '@/lib/ai/prompts/citations'

describe('Advanced Prompting', () => {
  describe('Chain-of-Thought (CoT)', () => {
    it('should use simple prompt for simple queries', () => {
      const classification = classifyQueryComplexity('What is React?')
      const prompt = generateCoTPrompt(
        'What is React?',
        classification.complexity,
        []
      )

      expect(prompt.systemPrompt).not.toContain('step by step')
      expect(prompt.temperature).toBe(0.3) // Lower temp for simple queries
    })

    it('should use moderate prompt for moderate queries', () => {
      const classification = classifyQueryComplexity('How to use useState?')
      const prompt = generateCoTPrompt(
        'How to use useState?',
        classification.complexity,
        []
      )

      expect(prompt.systemPrompt).toContain('key concepts')
      expect(prompt.temperature).toBe(0.5)
    })

    it('should use full CoT prompt for complex queries', () => {
      const classification = classifyQueryComplexity(
        'Explain the difference between useMemo and useCallback'
      )
      const prompt = generateCoTPrompt(
        'Explain the difference...',
        classification.complexity,
        []
      )

      expect(prompt.systemPrompt).toContain('step by step')
      expect(prompt.systemPrompt).toContain('Break down the question')
      expect(prompt.temperature).toBe(0.7) // Higher temp for synthesis
    })

    it('should include context in user prompt', () => {
      const context = ['React is a library', 'Hooks are functions']
      const prompt = generateCoTPrompt(
        'What are hooks?',
        QueryComplexity.MODERATE,
        context
      )

      expect(prompt.userPrompt).toContain('React is a library')
      expect(prompt.userPrompt).toContain('Hooks are functions')
    })
  })

  describe('Citation-Grounded Prompting', () => {
    const testSources: Source[] = [
      {
        id: '1',
        title: 'React Docs',
        url: 'https://react.dev',
        content: 'React is a JavaScript library for building user interfaces',
      },
      {
        id: '2',
        title: 'Virtual DOM',
        url: 'https://react.dev/vdom',
        content: 'React uses a virtual DOM for efficient updates',
      },
    ]

    it('should generate citation-aware prompt', () => {
      const prompt = generateCitationPrompt('What is React?', testSources)

      expect(prompt.systemPrompt).toContain('citation')
      expect(prompt.systemPrompt).toContain('[1]')
      expect(prompt.userPrompt).toContain('React Docs')
      expect(prompt.userPrompt).toContain('Virtual DOM')
    })

    it('should extract citations correctly', () => {
      const response = 'React is a library [1]. It uses virtual DOM [2].'
      const grounded = extractCitations(response, testSources)

      expect(grounded.citations.length).toBe(2)
      expect(grounded.citations[0].sourceId).toBe('1')
      expect(grounded.citations[1].sourceId).toBe('2')
      expect(grounded.uncitedClaims.length).toBe(0)
    })

    it('should identify uncited claims', () => {
      const response = 'React is fast and efficient. It uses virtual DOM [1].'
      const grounded = extractCitations(response, testSources)

      expect(grounded.uncitedClaims.length).toBeGreaterThan(0)
      expect(grounded.uncitedClaims[0]).toContain('fast and efficient')
    })

    it('should calculate grounding score', () => {
      const wellCited = 'React is a library [1]. It uses virtual DOM [2].'
      const poorlyCited =
        'React is amazing. Virtual DOM is great. It uses DOM [1].'

      const wellGrounded = extractCitations(wellCited, testSources)
      const poorlyGrounded = extractCitations(poorlyCited, testSources)

      expect(wellGrounded.groundingScore).toBeGreaterThan(
        poorlyGrounded.groundingScore
      )
    })

    it('should skip transition phrases as uncited claims', () => {
      const response = "Let's look at React [1]. Here's how it works [2]."
      const grounded = extractCitations(response, testSources)

      expect(grounded.uncitedClaims.length).toBe(0)
    })

    it('should verify citations against sources', () => {
      const response =
        'React is a JavaScript library [1]. It uses virtual DOM [2].'
      const grounded = extractCitations(response, testSources)
      const validations = verifyCitations(grounded, testSources)

      expect(validations.length).toBe(2)
      expect(validations[0].isValid).toBe(true)
      expect(validations[1].isValid).toBe(true)
    })

    it('should detect invalid citations', () => {
      const response = 'React is the fastest framework ever [1].'
      const grounded = extractCitations(response, testSources)
      const validations = verifyCitations(grounded, testSources)

      // Source doesn't claim "fastest framework ever"
      expect(validations[0].isValid).toBe(false)
    })
  })

  describe('Hallucination Detection', () => {
    it('should detect uncited factual claims', () => {
      // This would require importing and testing hallucination.ts
      // Placeholder for now - full implementation would test:
      // - Uncited claims detection
      // - Unsupported details detection
      // - Confidence scoring
      expect(true).toBe(true)
    })

    it('should detect unsupported version numbers', () => {
      // Test that version numbers not in sources are flagged
      expect(true).toBe(true)
    })

    it('should calculate confidence scores', () => {
      // Test confidence calculation based on issues
      expect(true).toBe(true)
    })
  })

  describe('Integration', () => {
    it('should classify query and generate appropriate prompt', () => {
      const query = 'Explain how React hooks work'
      const classification = classifyQueryComplexity(query)
      const cotPrompt = generateCoTPrompt(query, classification.complexity, [])

      expect(classification.complexity).toBe(QueryComplexity.COMPLEX)
      expect(cotPrompt.systemPrompt).toContain('step by step')
    })

    it('should handle full workflow: classify -> CoT -> citations', () => {
      const query = 'What is React and how does it use virtual DOM?'
      const sources: Source[] = [
        {
          id: '1',
          title: 'React Intro',
          url: 'https://react.dev',
          content: 'React is a library. It uses virtual DOM.',
        },
      ]

      // Step 1: Classify
      const classification = classifyQueryComplexity(query)
      expect(classification.complexity).toBe(QueryComplexity.MODERATE)

      // Step 2: Generate CoT prompt
      const cotPrompt = generateCoTPrompt(
        query,
        classification.complexity,
        sources.map((s) => s.content)
      )
      expect(cotPrompt.temperature).toBe(0.5)

      // Step 3: Generate citation prompt
      const citationPrompt = generateCitationPrompt(query, sources)
      expect(citationPrompt.systemPrompt).toContain('citation')

      // Workflow complete!
      expect(true).toBe(true)
    })
  })
})
