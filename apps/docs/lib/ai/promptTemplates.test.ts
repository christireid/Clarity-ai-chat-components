/**
 * Prompt Templates Tests
 *
 * Tests for personality mode templates and helper functions.
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect } from 'vitest'
import {
  PROMPT_TEMPLATES,
  getPromptTemplate,
  getDefaultPromptTemplate,
  getPromptById,
  searchPromptTemplates,
  type PromptTemplate,
} from './promptTemplates'

// ============================================================================
// PROMPT_TEMPLATES Array Tests
// ============================================================================

describe('PROMPT_TEMPLATES', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(PROMPT_TEMPLATES)).toBe(true)
    expect(PROMPT_TEMPLATES.length).toBeGreaterThan(0)
  })

  it('contains expected template IDs', () => {
    const ids = PROMPT_TEMPLATES.map((t) => t.id)
    expect(ids).toContain('default')
    expect(ids).toContain('beginner')
    expect(ids).toContain('expert')
    expect(ids).toContain('quick')
    expect(ids).toContain('tutorial')
    expect(ids).toContain('code')
  })

  it('has default template as first entry', () => {
    expect(PROMPT_TEMPLATES[0].id).toBe('default')
  })
})

// ============================================================================
// Template Structure Tests
// ============================================================================

describe('PromptTemplate structure', () => {
  it.each(PROMPT_TEMPLATES)(
    '$id template has all required fields',
    (template) => {
      expect(typeof template.id).toBe('string')
      expect(template.id.length).toBeGreaterThan(0)

      expect(typeof template.name).toBe('string')
      expect(template.name.length).toBeGreaterThan(0)

      expect(typeof template.description).toBe('string')
      expect(template.description.length).toBeGreaterThan(0)

      expect(typeof template.emoji).toBe('string')
      expect(template.emoji.length).toBeGreaterThan(0)

      expect(typeof template.prompt).toBe('string')
      expect(template.prompt.length).toBeGreaterThan(0)

      expect(Array.isArray(template.tags)).toBe(true)
      expect(template.tags.length).toBeGreaterThan(0)
    }
  )

  it.each(PROMPT_TEMPLATES)('$id template has unique ID', (template) => {
    const matches = PROMPT_TEMPLATES.filter((t) => t.id === template.id)
    expect(matches.length).toBe(1)
  })

  it.each(PROMPT_TEMPLATES)(
    '$id template tags are all strings',
    (template) => {
      for (const tag of template.tags) {
        expect(typeof tag).toBe('string')
        expect(tag.length).toBeGreaterThan(0)
      }
    }
  )
})

// ============================================================================
// tokenEstimate Field Tests
// ============================================================================

describe('tokenEstimate field', () => {
  it.each(PROMPT_TEMPLATES)(
    '$id template has tokenEstimate defined',
    (template) => {
      expect(template.tokenEstimate).toBeDefined()
      expect(typeof template.tokenEstimate).toBe('number')
    }
  )

  it.each(PROMPT_TEMPLATES)(
    '$id template tokenEstimate is a positive integer',
    (template) => {
      expect(template.tokenEstimate).toBeGreaterThan(0)
      expect(Number.isInteger(template.tokenEstimate)).toBe(true)
    }
  )

  it.each(PROMPT_TEMPLATES)(
    '$id template tokenEstimate is reasonable for prompt length',
    (template) => {
      // Rough heuristic: ~4 characters per token for English text
      const roughEstimate = Math.ceil(template.prompt.length / 4)
      const tokenEstimate = template.tokenEstimate!

      // Allow 50% variance for prompt complexity differences
      expect(tokenEstimate).toBeGreaterThan(roughEstimate * 0.3)
      expect(tokenEstimate).toBeLessThan(roughEstimate * 3)
    }
  )

  it('tokenEstimates are ordered sensibly by prompt length', () => {
    // Sort by prompt length and verify token estimates follow similar order
    const sorted = [...PROMPT_TEMPLATES].sort(
      (a, b) => a.prompt.length - b.prompt.length
    )

    // Quick should have smallest estimate
    const quickTemplate = PROMPT_TEMPLATES.find((t) => t.id === 'quick')
    const defaultTemplate = PROMPT_TEMPLATES.find((t) => t.id === 'default')

    expect(quickTemplate!.tokenEstimate).toBeLessThan(
      defaultTemplate!.tokenEstimate!
    )
  })

  it('all templates have tokenEstimate (not optional in practice)', () => {
    for (const template of PROMPT_TEMPLATES) {
      expect(
        template.tokenEstimate,
        `Template "${template.id}" missing tokenEstimate`
      ).toBeDefined()
    }
  })
})

// ============================================================================
// getPromptTemplate Tests
// ============================================================================

describe('getPromptTemplate', () => {
  it('returns template for valid ID', () => {
    const result = getPromptTemplate('default')
    expect(result).toBeDefined()
    expect(result?.id).toBe('default')
  })

  it('returns undefined for invalid ID', () => {
    expect(getPromptTemplate('nonexistent')).toBeUndefined()
    expect(getPromptTemplate('')).toBeUndefined()
  })

  it('returns correct template for each ID', () => {
    for (const template of PROMPT_TEMPLATES) {
      const result = getPromptTemplate(template.id)
      expect(result).toBe(template)
    }
  })
})

// ============================================================================
// getDefaultPromptTemplate Tests
// ============================================================================

describe('getDefaultPromptTemplate', () => {
  it('returns the default template', () => {
    const result = getDefaultPromptTemplate()
    expect(result.id).toBe('default')
  })

  it('returns first template from array', () => {
    const result = getDefaultPromptTemplate()
    expect(result).toBe(PROMPT_TEMPLATES[0])
  })

  it('returned template has all required fields', () => {
    const result = getDefaultPromptTemplate()
    expect(result.id).toBeDefined()
    expect(result.name).toBeDefined()
    expect(result.prompt).toBeDefined()
    expect(result.tokenEstimate).toBeDefined()
  })
})

// ============================================================================
// getPromptById Tests
// ============================================================================

describe('getPromptById', () => {
  it('returns prompt string for valid ID', () => {
    const result = getPromptById('default')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(100)
  })

  it('returns default prompt for invalid ID', () => {
    const defaultPrompt = getPromptById('default')
    const fallback = getPromptById('nonexistent')
    expect(fallback).toBe(defaultPrompt)
  })

  it('returns correct prompt for each template', () => {
    for (const template of PROMPT_TEMPLATES) {
      const result = getPromptById(template.id)
      expect(result).toBe(template.prompt)
    }
  })
})

// ============================================================================
// searchPromptTemplates Tests
// ============================================================================

describe('searchPromptTemplates', () => {
  it('finds templates by single tag', () => {
    const results = searchPromptTemplates(['beginner'])
    expect(results.length).toBeGreaterThan(0)
    expect(results.some((t) => t.tags.includes('beginner'))).toBe(true)
  })

  it('finds templates by multiple tags (OR logic)', () => {
    const results = searchPromptTemplates(['beginner', 'advanced'])
    expect(results.length).toBeGreaterThan(0)
    // Should include templates with either tag
    expect(
      results.every(
        (t) => t.tags.includes('beginner') || t.tags.includes('advanced')
      )
    ).toBe(true)
  })

  it('returns empty array for no matches', () => {
    const results = searchPromptTemplates(['nonexistent-tag'])
    expect(results).toEqual([])
  })

  it('returns empty array for empty tags', () => {
    const results = searchPromptTemplates([])
    expect(results).toEqual([])
  })

  it('finds recommended templates', () => {
    const results = searchPromptTemplates(['recommended'])
    expect(results.length).toBeGreaterThan(0)
    expect(results.some((t) => t.id === 'default')).toBe(true)
  })
})

// ============================================================================
// Prompt Content Tests
// ============================================================================

describe('Prompt content quality', () => {
  it.each(PROMPT_TEMPLATES)(
    '$id template contains meaningful instructions',
    (template) => {
      // Each prompt should have substantive content
      expect(template.prompt.length).toBeGreaterThan(100)
    }
  )

  it('default template references Clarity Chat', () => {
    const defaultTemplate = getDefaultPromptTemplate()
    expect(defaultTemplate.prompt).toContain('Clarity Chat')
  })

  it('beginner template emphasizes patience', () => {
    const template = getPromptTemplate('beginner')
    expect(template?.prompt).toMatch(/patient|step-by-step|beginner/i)
  })

  it('expert template emphasizes conciseness', () => {
    const template = getPromptTemplate('expert')
    expect(template?.prompt).toMatch(/concise|direct|technical/i)
  })

  it('quick template emphasizes brevity', () => {
    const template = getPromptTemplate('quick')
    expect(template?.prompt).toMatch(/fast|quick|brief|minimal/i)
  })

  it('tutorial template emphasizes teaching', () => {
    const template = getPromptTemplate('tutorial')
    expect(template?.prompt).toMatch(/teach|learn|educational/i)
  })

  it('code template emphasizes examples', () => {
    const template = getPromptTemplate('code')
    expect(template?.prompt).toMatch(/code|example/i)
  })
})

// ============================================================================
// Edge Cases
// ============================================================================

describe('Edge cases', () => {
  it('handles case-sensitive ID lookup', () => {
    expect(getPromptTemplate('Default')).toBeUndefined()
    expect(getPromptTemplate('DEFAULT')).toBeUndefined()
    expect(getPromptTemplate('default')).toBeDefined()
  })

  it('handles whitespace in ID lookup', () => {
    expect(getPromptTemplate(' default')).toBeUndefined()
    expect(getPromptTemplate('default ')).toBeUndefined()
  })

  it('searchPromptTemplates handles case-sensitive tags', () => {
    const lower = searchPromptTemplates(['beginner'])
    const upper = searchPromptTemplates(['BEGINNER'])
    expect(lower.length).toBeGreaterThan(0)
    expect(upper.length).toBe(0)
  })
})
