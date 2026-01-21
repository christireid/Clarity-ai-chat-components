import { describe, it, expect, beforeEach } from 'vitest'
import {
  ComplexityAnalyzer,
  ComplexityLevel,
  ComplexityFactors,
} from '../../routing/complexity-analyzer'

describe('ComplexityAnalyzer', () => {
  let analyzer: ComplexityAnalyzer

  beforeEach(() => {
    analyzer = new ComplexityAnalyzer()
  })

  describe('basic complexity analysis', () => {
    it('classifies simple greetings as LOW complexity', () => {
      const result = analyzer.analyze('Hello, how are you?')

      expect(result.level).toBe(ComplexityLevel.Low)
      expect(result.score).toBeLessThan(0.3)
    })

    it('classifies factual questions as LOW complexity', () => {
      const result = analyzer.analyze('What is the capital of France?')

      expect(result.level).toBe(ComplexityLevel.Low)
    })

    it('classifies coding tasks as MEDIUM-HIGH complexity', () => {
      const result = analyzer.analyze(
        'Write a function to sort an array using quicksort'
      )

      expect([ComplexityLevel.Medium, ComplexityLevel.High]).toContain(
        result.level
      )
    })

    it('classifies multi-step reasoning as HIGH complexity', () => {
      const result = analyzer.analyze(`
        Analyze the trade-offs between microservices and monolithic architecture
        for a startup with limited resources. Consider:
        1. Development speed
        2. Operational complexity
        3. Scalability requirements
        4. Team expertise
        Then provide a recommendation with justification.
      `)

      expect(result.level).toBe(ComplexityLevel.High)
    })

    it('classifies very complex analysis as HIGH or CRITICAL complexity', () => {
      const result = analyzer.analyze(`
        Design a complete distributed system architecture for a global e-commerce platform
        that handles 10 million daily users. Include:
        - Database sharding strategy with failover
        - Microservices communication patterns (sync and async)
        - Global CDN and caching layers
        - Real-time inventory management across regions
        - Payment processing with PCI compliance
        - A/B testing infrastructure
        - Machine learning recommendation engine integration
        Provide detailed diagrams and implementation timelines.
      `)

      // Very complex prompts should be at least HIGH complexity
      expect([ComplexityLevel.High, ComplexityLevel.Critical]).toContain(
        result.level
      )
      expect(result.score).toBeGreaterThanOrEqual(0.45)
    })
  })

  describe('complexity factors', () => {
    it('detects code-related keywords', () => {
      const result = analyzer.analyze(
        'Write a Python function to calculate fibonacci'
      )

      expect(result.factors.hasCodeTask).toBe(true)
    })

    it('detects multi-step requirements', () => {
      const result = analyzer.analyze(`
        First, fetch the data from the API.
        Then, transform it to the required format.
        Finally, save it to the database.
      `)

      expect(result.factors.multiStep).toBe(true)
      expect(result.factors.stepCount).toBeGreaterThanOrEqual(3)
    })

    it('detects reasoning requirements', () => {
      const result = analyzer.analyze(
        'Explain why functional programming is better than OOP for this use case'
      )

      expect(result.factors.requiresReasoning).toBe(true)
    })

    it('detects domain expertise requirements', () => {
      const result = analyzer.analyze(
        'Implement a HIPAA-compliant data encryption strategy for medical records'
      )

      expect(result.factors.requiresDomainExpertise).toBe(true)
    })

    it('measures prompt length factor', () => {
      const shortPrompt = 'Hello'
      const longPrompt = 'A'.repeat(5000)

      const shortResult = analyzer.analyze(shortPrompt)
      const longResult = analyzer.analyze(longPrompt)

      expect(longResult.factors.lengthFactor).toBeGreaterThan(
        shortResult.factors.lengthFactor
      )
    })
  })

  describe('scoring', () => {
    it('returns score between 0 and 1', () => {
      const prompts = [
        'Hi',
        'What is 2+2?',
        'Write a complex algorithm with error handling',
        'Design a complete system architecture',
      ]

      for (const prompt of prompts) {
        const result = analyzer.analyze(prompt)
        expect(result.score).toBeGreaterThanOrEqual(0)
        expect(result.score).toBeLessThanOrEqual(1)
      }
    })

    it('increases score with more complexity indicators', () => {
      const simple = analyzer.analyze('Hello there')
      const moderate = analyzer.analyze('Write a function to sort an array')
      const complex = analyzer.analyze(
        'Design and implement a distributed caching system with HIPAA compliance. First analyze requirements, then create the architecture, finally implement the solution.'
      )

      expect(simple.score).toBeLessThan(moderate.score)
      expect(moderate.score).toBeLessThan(complex.score)
    })
  })

  describe('model recommendation', () => {
    it('recommends smaller models for simple prompts', () => {
      const result = analyzer.analyze('What time is it?')

      expect(result.recommendedModelTier).toBe('small')
    })

    it('recommends medium models for moderate prompts', () => {
      const result = analyzer.analyze(
        'Write a function to validate email addresses with regex'
      )

      expect(result.recommendedModelTier).toBe('medium')
    })

    it('recommends large models for complex prompts', () => {
      const result = analyzer.analyze(`
        Analyze the security vulnerabilities in this authentication system
        and propose a comprehensive fix that addresses OWASP top 10.
      `)

      expect(['large', 'premium']).toContain(result.recommendedModelTier)
    })
  })

  describe('custom configuration', () => {
    it('allows custom complexity thresholds', () => {
      const strictAnalyzer = new ComplexityAnalyzer({
        lowThreshold: 0.1,
        mediumThreshold: 0.2,
        highThreshold: 0.3,
      })

      const result = strictAnalyzer.analyze('Explain how databases work')

      // With strict thresholds, more prompts become "complex"
      expect(result.level).not.toBe(ComplexityLevel.Low)
    })

    it('allows custom weights for factors', () => {
      const codeHeavyAnalyzer = new ComplexityAnalyzer({
        weights: {
          codeTask: 0.5, // Heavy weight on code tasks
          multiStep: 0.1,
          reasoning: 0.1,
          domain: 0.1,
          length: 0.2,
        },
      })

      const codeResult = codeHeavyAnalyzer.analyze('Write a sorting function')
      const textResult = codeHeavyAnalyzer.analyze(
        'Explain quantum physics in detail'
      )

      expect(codeResult.score).toBeGreaterThan(textResult.score)
    })
  })

  describe('edge cases', () => {
    it('handles empty input', () => {
      const result = analyzer.analyze('')

      expect(result.level).toBe(ComplexityLevel.Low)
      expect(result.score).toBe(0)
    })

    it('handles very long input', () => {
      const longInput = 'Analyze this: ' + 'context '.repeat(10000)
      const result = analyzer.analyze(longInput)

      expect(result.level).toBeDefined()
      expect(result.score).toBeLessThanOrEqual(1)
    })

    it('handles special characters', () => {
      const result = analyzer.analyze('What is 2+2? → ∑∏∫√')

      expect(result.level).toBeDefined()
    })

    it('handles code snippets in prompt', () => {
      const result = analyzer.analyze(`
        Fix this code:
        \`\`\`javascript
        function broken() {
          return undefined
        }
        \`\`\`
      `)

      expect(result.factors.hasCodeTask).toBe(true)
    })
  })
})
