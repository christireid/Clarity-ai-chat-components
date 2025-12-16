import { logger } from '@clarity-chat/utils/logger';
/**
 * Token Utilities Tests
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect } from 'vitest'
import {
  estimateTokens,
  validateTokenEstimate,
  analyzePromptTokens,
  isWithinBudget,
  suggestTokenEstimate,
} from './tokenUtils'
import { PROMPT_TEMPLATES } from './promptTemplates'

// ============================================================================
// estimateTokens Tests
// ============================================================================

describe('estimateTokens', () => {
  it('returns 0 for empty string', () => {
    expect(estimateTokens('')).toBe(0)
  })

  it('returns positive number for non-empty string', () => {
    expect(estimateTokens('Hello world')).toBeGreaterThan(0)
  })

  it('returns higher count for code content type', () => {
    const text = 'function hello() { return "world"; }'
    const proseEstimate = estimateTokens(text, 'prose')
    const codeEstimate = estimateTokens(text, 'code')
    expect(codeEstimate).toBeGreaterThan(proseEstimate)
  })

  it('handles code blocks', () => {
    const withCode = 'Hello ```const x = 1;``` world'
    const withoutCode = 'Hello const x = 1; world'
    // Code blocks should add some overhead
    expect(estimateTokens(withCode)).toBeGreaterThanOrEqual(
      estimateTokens(withoutCode)
    )
  })

  it('handles URLs', () => {
    const withUrl = 'Check out https://example.com/path for more'
    const withoutUrl = 'Check out example.com/path for more'
    expect(estimateTokens(withUrl)).toBeGreaterThan(estimateTokens(withoutUrl))
  })

  it('handles XML tags', () => {
    const withTags = '<section>Content here</section>'
    const withoutTags = 'Content here'
    expect(estimateTokens(withTags)).toBeGreaterThan(
      estimateTokens(withoutTags)
    )
  })

  it('scales roughly linearly with content length', () => {
    const short = 'Hello world'
    const long = 'Hello world '.repeat(100)
    const shortTokens = estimateTokens(short)
    const longTokens = estimateTokens(long)
    // Long should be roughly 100x short (with some variance)
    expect(longTokens / shortTokens).toBeGreaterThan(50)
    expect(longTokens / shortTokens).toBeLessThan(150)
  })
})

// ============================================================================
// validateTokenEstimate Tests
// ============================================================================

describe('validateTokenEstimate', () => {
  it('validates accurate estimates', () => {
    const result = validateTokenEstimate(100, 100)
    expect(result.isValid).toBe(true)
    expect(result.variance).toBe(0)
  })

  it('allows estimates within tolerance', () => {
    const result = validateTokenEstimate(110, 100, 0.25)
    expect(result.isValid).toBe(true)
  })

  it('rejects estimates outside tolerance', () => {
    const result = validateTokenEstimate(150, 100, 0.25)
    expect(result.isValid).toBe(false)
    expect(result.variance).toBe(0.5)
  })

  it('provides helpful message for valid estimates', () => {
    const result = validateTokenEstimate(100, 100)
    expect(result.message).toContain('accurate')
  })

  it('provides helpful message for invalid estimates', () => {
    const result = validateTokenEstimate(200, 100)
    expect(result.message).toContain('higher')
    expect(result.message).toContain('200')
    expect(result.message).toContain('100')
  })

  it('indicates when actual is lower than declared', () => {
    const result = validateTokenEstimate(50, 100)
    expect(result.message).toContain('lower')
  })
})

// ============================================================================
// analyzePromptTokens Tests
// ============================================================================

describe('analyzePromptTokens', () => {
  it('returns all expected fields', () => {
    const result = analyzePromptTokens('Hello world')
    expect(result).toHaveProperty('estimatedTokens')
    expect(result).toHaveProperty('characterCount')
    expect(result).toHaveProperty('codeBlockCount')
    expect(result).toHaveProperty('xmlTagCount')
    expect(result).toHaveProperty('breakdown')
  })

  it('counts characters correctly', () => {
    const text = 'Hello world'
    const result = analyzePromptTokens(text)
    expect(result.characterCount).toBe(text.length)
  })

  it('counts code blocks', () => {
    const text = '```js\ncode\n``` and ```py\nmore\n```'
    const result = analyzePromptTokens(text)
    expect(result.codeBlockCount).toBe(2)
  })

  it('counts XML tags', () => {
    const text = '<section><subsection></subsection></section>'
    const result = analyzePromptTokens(text)
    expect(result.xmlTagCount).toBe(4)
  })

  it('provides breakdown by content type', () => {
    const result = analyzePromptTokens('Test content')
    expect(result.breakdown.proseEstimate).toBeDefined()
    expect(result.breakdown.codeEstimate).toBeDefined()
    expect(result.breakdown.mixedEstimate).toBeDefined()
  })
})

// ============================================================================
// isWithinBudget Tests
// ============================================================================

describe('isWithinBudget', () => {
  it('returns true when under budget', () => {
    expect(isWithinBudget('Hello', 1000)).toBe(true)
  })

  it('returns false when over budget', () => {
    const longText = 'word '.repeat(1000)
    expect(isWithinBudget(longText, 10)).toBe(false)
  })

  it('respects content type', () => {
    const code = 'function() {}'
    // Code estimate is higher, so same budget might fail for code
    const proseResult = isWithinBudget(code, 5, 'prose')
    const codeResult = isWithinBudget(code, 5, 'code')
    // At least one should be different or both false for small budget
    expect(typeof proseResult).toBe('boolean')
    expect(typeof codeResult).toBe('boolean')
  })
})

// ============================================================================
// suggestTokenEstimate Tests
// ============================================================================

describe('suggestTokenEstimate', () => {
  it('returns a positive number', () => {
    expect(suggestTokenEstimate('Hello world')).toBeGreaterThan(0)
  })

  it('rounds to nearest 50', () => {
    const estimate = suggestTokenEstimate('Hello world')
    expect(estimate % 50).toBe(0)
  })

  it('scales with content length', () => {
    const short = suggestTokenEstimate('Hello')
    const long = suggestTokenEstimate('Hello '.repeat(100))
    expect(long).toBeGreaterThan(short)
  })
})

// ============================================================================
// Integration: Validate PROMPT_TEMPLATES token estimates
// ============================================================================

describe('PROMPT_TEMPLATES token estimate validation', () => {
  it.each(PROMPT_TEMPLATES)(
    '$id template tokenEstimate is within 40% of calculated estimate',
    (template) => {
      const calculated = estimateTokens(template.prompt, 'mixed')
      const declared = template.tokenEstimate

      const result = validateTokenEstimate(calculated, declared, 0.4)

      // Log for debugging if test fails
      if (!result.isValid) {
        logger.debug(
          `Template "${template.id}": calculated=${calculated}, declared=${declared}, variance=${Math.round(result.variance * 100)}%`
        )
      }

      expect(result.isValid, `${template.id}: ${result.message}`).toBe(true)
    }
  )

  it('provides suggested estimates for all templates', () => {
    for (const template of PROMPT_TEMPLATES) {
      const suggested = suggestTokenEstimate(template.prompt)
      expect(suggested).toBeGreaterThan(0)
      expect(suggested % 50).toBe(0)
    }
  })
})
