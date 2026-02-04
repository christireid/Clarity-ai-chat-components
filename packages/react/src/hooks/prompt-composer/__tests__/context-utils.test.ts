/**
 * Context Utilities Tests
 */

import { describe, it, expect } from 'vitest'
import {
  createContextItem,
  calculateContextTokens,
  rankByRelevance,
  buildPromptWithContext,
  calculateTokenSavings,
  fuzzyMatch,
  filterContextItems,
  shouldAutoExpand,
} from '../context-utils'
import type { ContextItem } from '../types'

describe('Context Utilities', () => {
  // ==========================================================================
  // Token Calculation Tests
  // ==========================================================================

  describe('calculateContextTokens', () => {
    it('calculates tokens for summary only', () => {
      const tokens = calculateContextTokens({
        summary: 'Button.tsx - 250 lines',
      })

      expect(tokens.summary).toBeGreaterThan(0)
      expect(tokens.preview).toBe(0)
      expect(tokens.full).toBe(0)
    })

    it('calculates tokens for all levels', () => {
      const tokens = calculateContextTokens({
        summary: 'Button.tsx - 250 lines',
        preview: 'File: src/components/Button.tsx\nExports: Button, ButtonProps',
        full: 'Complete file content here',
      })

      expect(tokens.summary).toBeGreaterThan(0)
      expect(tokens.preview).toBeGreaterThan(tokens.summary)
      expect(tokens.full).toBeGreaterThan(tokens.preview)
    })
  })

  describe('createContextItem', () => {
    it('creates context item with token calculations', () => {
      const item = createContextItem({
        id: 'test',
        type: 'file',
        label: 'test.ts',
        summary: 'Test file',
      })

      expect(item.id).toBe('test')
      expect(item.type).toBe('file')
      expect(item.tokens).toBeDefined()
      expect(item.tokens.summary).toBeGreaterThan(0)
    })

    it('handles items with all detail levels', () => {
      const item = createContextItem({
        id: 'test',
        type: 'file',
        label: 'test.ts',
        summary: 'Test file',
        preview: 'File exports',
        full: 'Full content',
      })

      expect(item.tokens.summary).toBeGreaterThan(0)
      expect(item.tokens.preview).toBeGreaterThan(0)
      expect(item.tokens.full).toBeGreaterThan(0)
    })
  })

  // ==========================================================================
  // Relevance Ranking Tests
  // ==========================================================================

  describe('rankByRelevance', () => {
    const createTestItem = (id: string, label: string, summary: string): ContextItem => {
      return createContextItem({
        id,
        type: 'file',
        label,
        summary,
      })
    }

    it('ranks items with direct mention higher', () => {
      const items = [
        createTestItem('file1', 'Button.tsx', 'Button component'),
        createTestItem('file2', 'Input.tsx', 'Input component'),
        createTestItem('file3', 'Modal.tsx', 'Modal component'),
      ]

      const ranked = rankByRelevance(items, 'How do I use the Button component?')

      expect(ranked[0].label).toBe('Button.tsx')
    })

    it('ranks items by keyword overlap', () => {
      const items = [
        createTestItem('file1', 'Button.tsx', 'Button component with props'),
        createTestItem('file2', 'Input.tsx', 'Input component with validation'),
        createTestItem('file3', 'utils.ts', 'Utility functions'),
      ]

      const ranked = rankByRelevance(items, 'component props validation')

      // Items with more keyword matches should rank higher
      expect(ranked[0].relevance).toBeGreaterThanOrEqual(ranked[1].relevance!)
    })

    it('boosts recently accessed items', () => {
      const now = Date.now()
      const items = [
        { ...createTestItem('file1', 'Button.tsx', 'Button'), lastAccessed: now - 1000 }, // 1 second ago
        { ...createTestItem('file2', 'Input.tsx', 'Input'), lastAccessed: now - 10 * 60 * 1000 }, // 10 minutes ago
      ]

      const ranked = rankByRelevance(items, 'component')

      // Recently accessed should have boost
      expect(ranked[0].id).toBe('file1')
    })

    it('respects existing relevance scores', () => {
      const items = [
        { ...createTestItem('file1', 'Button.tsx', 'Button'), relevance: 0.9 },
        { ...createTestItem('file2', 'Input.tsx', 'Input'), relevance: 0.1 },
      ]

      const ranked = rankByRelevance(items, 'test')

      expect(ranked[0].id).toBe('file1')
      expect(ranked[0].relevance).toBeGreaterThanOrEqual(0.9)
    })

    it('factors in priority', () => {
      const items = [
        { ...createTestItem('file1', 'Button.tsx', 'Button'), priority: 10 },
        { ...createTestItem('file2', 'Input.tsx', 'Input'), priority: 90 },
      ]

      const ranked = rankByRelevance(items, 'test')

      expect(ranked[0].id).toBe('file2')
    })
  })

  // ==========================================================================
  // Prompt Building Tests
  // ==========================================================================

  describe('buildPromptWithContext', () => {
    it('includes message and summaries within budget', () => {
      const items = [
        createContextItem({
          id: 'file1',
          type: 'file',
          label: 'test.ts',
          summary: 'Test file',
        }),
      ]

      const result = buildPromptWithContext({
        message: 'Hello',
        contextItems: items,
        maxTokens: 1000,
      })

      expect(result.prompt).toContain('Hello')
      expect(result.prompt).toContain('Test file')
      expect(result.totalTokens).toBeLessThanOrEqual(1000)
      expect(result.itemsIncluded).toHaveLength(1)
      expect(result.itemsIncluded[0].level).toBe('summary')
    })

    it('expands to preview for relevant items', () => {
      const items = [
        createContextItem({
          id: 'file1',
          type: 'file',
          label: 'Button.tsx',
          summary: 'Button component',
          preview: 'Exports: Button, ButtonProps',
        }),
      ]

      const result = buildPromptWithContext({
        message: 'How do I use Button?',
        contextItems: items,
        maxTokens: 10000,
      })

      expect(result.prompt).toContain('Exports')
      const item = result.itemsIncluded.find((i) => i.id === 'file1')
      expect(item?.level).toBe('preview')
    })

    it('respects token budget', () => {
      const items = Array.from({ length: 10 }, (_, i) =>
        createContextItem({
          id: `file${i}`,
          type: 'file',
          label: `test${i}.ts`,
          summary: `Test file ${i}`,
        })
      )

      const result = buildPromptWithContext({
        message: 'Hello',
        contextItems: items,
        maxTokens: 100,
      })

      expect(result.totalTokens).toBeLessThanOrEqual(100)
      // Should include some but not all items
      expect(result.itemsIncluded.length).toBeLessThan(items.length)
    })

    it('auto-expands high relevance items', () => {
      const items = [
        createContextItem({
          id: 'file1',
          type: 'file',
          label: 'Button.tsx',
          summary: 'Button component',
          preview: 'Preview content',
          full: 'Full content',
          autoExpand: true,
        }),
      ]

      const result = buildPromptWithContext({
        message: 'Button',
        contextItems: items,
        maxTokens: 10000,
      })

      const item = result.itemsIncluded.find((i) => i.id === 'file1')
      expect(item?.level).toBe('full')
    })
  })

  // ==========================================================================
  // Token Savings Tests
  // ==========================================================================

  describe('calculateTokenSavings', () => {
    it('calculates savings correctly', () => {
      const contextItems = [
        createContextItem({
          id: 'file1',
          type: 'file',
          label: 'test.ts',
          summary: 'Test file',
          preview: 'Preview with more details',
          full: 'Full content with all the code',
        }),
      ]

      const itemsIncluded = [
        { id: 'file1', level: 'summary' as const, tokens: contextItems[0].tokens.summary },
      ]

      const savings = calculateTokenSavings(contextItems, itemsIncluded)

      expect(savings.traditional).toBeGreaterThan(savings.clarity)
      expect(savings.saved).toBe(savings.traditional - savings.clarity)
      expect(savings.savedPercentage).toBeGreaterThan(0)
      expect(savings.savedPercentage).toBeLessThanOrEqual(100)
      expect(savings.costSaved).toBeGreaterThanOrEqual(0)
    })

    it('shows zero savings when using full context', () => {
      const contextItems = [
        createContextItem({
          id: 'file1',
          type: 'file',
          label: 'test.ts',
          summary: 'Test',
          preview: 'Preview',
          full: 'Full content',
        }),
      ]

      const itemsIncluded = [
        { id: 'file1', level: 'full' as const, tokens: contextItems[0].tokens.full },
      ]

      const savings = calculateTokenSavings(contextItems, itemsIncluded)

      expect(savings.saved).toBe(0)
      expect(savings.savedPercentage).toBe(0)
    })

    it('handles items without full content', () => {
      const contextItems = [
        createContextItem({
          id: 'file1',
          type: 'file',
          label: 'test.ts',
          summary: 'Test file',
        }),
      ]

      const itemsIncluded = [
        { id: 'file1', level: 'summary' as const, tokens: contextItems[0].tokens.summary },
      ]

      const savings = calculateTokenSavings(contextItems, itemsIncluded)

      expect(savings.saved).toBe(0)
      expect(savings.savedPercentage).toBe(0)
    })
  })

  // ==========================================================================
  // Fuzzy Match Tests
  // ==========================================================================

  describe('fuzzyMatch', () => {
    it('matches exact substring', () => {
      expect(fuzzyMatch('button', 'Button.tsx')).toBe(true)
      expect(fuzzyMatch('Button', 'Button.tsx')).toBe(true)
    })

    it('matches fuzzy pattern', () => {
      expect(fuzzyMatch('btn', 'Button.tsx')).toBe(true)
      expect(fuzzyMatch('btntsx', 'Button.tsx')).toBe(true)
    })

    it('handles case insensitivity', () => {
      expect(fuzzyMatch('BUTTON', 'button.tsx')).toBe(true)
      expect(fuzzyMatch('button', 'BUTTON.TSX')).toBe(true)
    })

    it('returns false for no match', () => {
      expect(fuzzyMatch('input', 'Button.tsx')).toBe(false)
      expect(fuzzyMatch('xyz', 'Button.tsx')).toBe(false)
    })
  })

  describe('filterContextItems', () => {
    const items = [
      createContextItem({
        id: 'file1',
        type: 'file',
        label: 'Button.tsx',
        description: 'Button component',
        summary: 'Button',
      }),
      createContextItem({
        id: 'file2',
        type: 'file',
        label: 'Input.tsx',
        description: 'Input component',
        summary: 'Input',
      }),
    ]

    it('filters by label', () => {
      const filtered = filterContextItems(items, 'button')
      expect(filtered).toHaveLength(1)
      expect(filtered[0].label).toBe('Button.tsx')
    })

    it('filters by description', () => {
      const filtered = filterContextItems(items, 'component')
      expect(filtered).toHaveLength(2)
    })

    it('returns all items for empty query', () => {
      const filtered = filterContextItems(items, '')
      expect(filtered).toHaveLength(2)
    })

    it('supports fuzzy matching', () => {
      const filtered = filterContextItems(items, 'btn', true)
      expect(filtered).toHaveLength(1)
      expect(filtered[0].label).toBe('Button.tsx')
    })
  })

  // ==========================================================================
  // Auto-Expand Tests
  // ==========================================================================

  describe('shouldAutoExpand', () => {
    it('respects explicit autoExpand setting', () => {
      const item = createContextItem({
        id: 'file1',
        type: 'file',
        label: 'test.ts',
        summary: 'Test',
        autoExpand: true,
      })

      expect(shouldAutoExpand(item, 'anything')).toBe(true)
    })

    it('does not expand when explicitly disabled', () => {
      const item = createContextItem({
        id: 'file1',
        type: 'file',
        label: 'test.ts',
        summary: 'Test',
        autoExpand: false,
      })

      expect(shouldAutoExpand(item, 'test')).toBe(false)
    })

    it('auto-expands on direct mention', () => {
      const item = createContextItem({
        id: 'file1',
        type: 'file',
        label: 'Button.tsx',
        summary: 'Button',
      })

      expect(shouldAutoExpand(item, 'How do I use Button.tsx?')).toBe(true)
    })

    it('auto-expands on high relevance', () => {
      const item = createContextItem({
        id: 'file1',
        type: 'file',
        label: 'test.ts',
        summary: 'Test',
        relevance: 0.8,
      })

      expect(shouldAutoExpand(item, 'anything')).toBe(true)
    })

    it('does not auto-expand low relevance', () => {
      const item = createContextItem({
        id: 'file1',
        type: 'file',
        label: 'test.ts',
        summary: 'Test',
        relevance: 0.3,
      })

      expect(shouldAutoExpand(item, 'unrelated')).toBe(false)
    })
  })
})
