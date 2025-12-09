/**
 * System Prompt Utilities Tests
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect } from 'vitest'
import {
  DOCS_ASSISTANT_SYSTEM_PROMPT,
  DOC_LINKS,
  type DocLinkKey,
  type PersonalityMode,
  getSystemPromptWithPersonality,
  formatDocLink,
  formatDocLinks,
  getDocLink,
  buildLearnMoreSection,
  buildComparisonTable,
  buildQuickChecks,
} from './systemPrompt'

// ============================================================================
// Constants Tests
// ============================================================================

describe('DOCS_ASSISTANT_SYSTEM_PROMPT', () => {
  it('is a non-empty string', () => {
    expect(typeof DOCS_ASSISTANT_SYSTEM_PROMPT).toBe('string')
    expect(DOCS_ASSISTANT_SYSTEM_PROMPT.length).toBeGreaterThan(100)
  })

  it('contains core identity information', () => {
    expect(DOCS_ASSISTANT_SYSTEM_PROMPT).toContain('Clarity Chat')
    expect(DOCS_ASSISTANT_SYSTEM_PROMPT).toContain('documentation assistant')
  })

  it('contains response patterns', () => {
    expect(DOCS_ASSISTANT_SYSTEM_PROMPT).toContain('Pattern 1')
    expect(DOCS_ASSISTANT_SYSTEM_PROMPT).toContain('Troubleshooting')
  })
})

describe('DOC_LINKS', () => {
  it('contains expected keys', () => {
    expect(DOC_LINKS.installation).toBe('/guides/installation')
    expect(DOC_LINKS.streaming).toBe('/guides/streaming')
    expect(DOC_LINKS.hooks).toBe('/reference/hooks')
    expect(DOC_LINKS.components).toBe('/reference/components')
  })

  it('all values are valid path strings starting with /', () => {
    for (const [key, value] of Object.entries(DOC_LINKS)) {
      expect(value).toMatch(/^\//)
      expect(typeof value).toBe('string')
    }
  })
})

// ============================================================================
// getSystemPromptWithPersonality Tests
// ============================================================================

describe('getSystemPromptWithPersonality', () => {
  it('returns base prompt with technical modifier', () => {
    const result = getSystemPromptWithPersonality('technical')
    expect(result).toContain(DOCS_ASSISTANT_SYSTEM_PROMPT)
    expect(result).toContain('Technical Mode')
    expect(result).toContain('code-first responses')
  })

  it('returns base prompt with friendly modifier', () => {
    const result = getSystemPromptWithPersonality('friendly')
    expect(result).toContain(DOCS_ASSISTANT_SYSTEM_PROMPT)
    expect(result).toContain('Friendly Mode')
    expect(result).toContain('encouragement')
  })

  it('returns base prompt with concise modifier', () => {
    const result = getSystemPromptWithPersonality('concise')
    expect(result).toContain(DOCS_ASSISTANT_SYSTEM_PROMPT)
    expect(result).toContain('Concise Mode')
    expect(result).toContain('essentials')
  })

  it('modifier is appended after base prompt', () => {
    const result = getSystemPromptWithPersonality('technical')
    const baseIndex = result.indexOf('Clarity Chat')
    const modifierIndex = result.indexOf('Technical Mode')
    expect(modifierIndex).toBeGreaterThan(baseIndex)
  })
})

// ============================================================================
// formatDocLink Tests
// ============================================================================

describe('formatDocLink', () => {
  it('formats path with label', () => {
    expect(formatDocLink('/guides/streaming', 'Streaming Guide')).toBe(
      '[Streaming Guide](/guides/streaming)'
    )
  })

  it('uses path as label when no label provided', () => {
    expect(formatDocLink('/guides/streaming')).toBe(
      '[/guides/streaming](/guides/streaming)'
    )
  })

  it('returns empty string for empty path', () => {
    expect(formatDocLink('')).toBe('')
    expect(formatDocLink('', 'Label')).toBe('')
  })

  it('returns empty string for non-string path', () => {
    expect(formatDocLink(null as unknown as string)).toBe('')
    expect(formatDocLink(undefined as unknown as string)).toBe('')
    expect(formatDocLink(123 as unknown as string)).toBe('')
  })

  it('escapes markdown special characters in labels', () => {
    expect(formatDocLink('/test', 'Label [with] brackets')).toBe(
      '[Label \\[with\\] brackets](/test)'
    )
    expect(formatDocLink('/test', 'Label (with) parens')).toBe(
      '[Label \\(with\\) parens](/test)'
    )
  })

  it('handles label with mixed special characters', () => {
    expect(formatDocLink('/test', '[foo](bar)')).toBe(
      '[\\[foo\\]\\(bar\\)](/test)'
    )
  })

  it('ignores non-string labels and uses path', () => {
    expect(formatDocLink('/test', 123 as unknown as string)).toBe(
      '[/test](/test)'
    )
    expect(formatDocLink('/test', null as unknown as string)).toBe(
      '[/test](/test)'
    )
  })
})

// ============================================================================
// formatDocLinks Tests
// ============================================================================

describe('formatDocLinks', () => {
  it('formats multiple links with pipe separator', () => {
    const result = formatDocLinks([
      { path: '/guides/a', label: 'Guide A' },
      { path: '/guides/b', label: 'Guide B' },
    ])
    expect(result).toBe('[Guide A](/guides/a) | [Guide B](/guides/b)')
  })

  it('returns empty string for empty array', () => {
    expect(formatDocLinks([])).toBe('')
  })

  it('returns empty string for non-array', () => {
    expect(
      formatDocLinks(null as unknown as Array<{ path: string; label: string }>)
    ).toBe('')
    expect(
      formatDocLinks(
        undefined as unknown as Array<{ path: string; label: string }>
      )
    ).toBe('')
    expect(
      formatDocLinks(
        'string' as unknown as Array<{ path: string; label: string }>
      )
    ).toBe('')
  })

  it('filters out invalid entries', () => {
    const result = formatDocLinks([
      { path: '/valid', label: 'Valid' },
      { path: '', label: 'Empty path' },
      null as unknown as { path: string; label: string },
      { path: '/another', label: 'Another' },
    ])
    expect(result).toBe('[Valid](/valid) | [Another](/another)')
  })

  it('handles single link', () => {
    const result = formatDocLinks([{ path: '/single', label: 'Single' }])
    expect(result).toBe('[Single](/single)')
  })

  it('handles entries with missing path property', () => {
    const result = formatDocLinks([
      { path: '/valid', label: 'Valid' },
      { label: 'No path' } as { path: string; label: string },
    ])
    expect(result).toBe('[Valid](/valid)')
  })
})

// ============================================================================
// getDocLink Tests
// ============================================================================

describe('getDocLink', () => {
  it('returns formatted link for valid key', () => {
    expect(getDocLink('streaming', 'Streaming')).toBe(
      '[Streaming](/guides/streaming)'
    )
    expect(getDocLink('hooks', 'Hooks Reference')).toBe(
      '[Hooks Reference](/reference/hooks)'
    )
  })

  it('uses path as label when no label provided', () => {
    expect(getDocLink('installation')).toBe(
      '[/guides/installation](/guides/installation)'
    )
  })

  it('works with all DOC_LINKS keys', () => {
    const keys = Object.keys(DOC_LINKS) as DocLinkKey[]
    for (const key of keys) {
      const result = getDocLink(key, 'Test')
      expect(result).toMatch(/^\[Test\]\(\/[a-z/-]+\)$/)
    }
  })
})

// ============================================================================
// buildLearnMoreSection Tests
// ============================================================================

describe('buildLearnMoreSection', () => {
  it('builds learn more section with links', () => {
    const result = buildLearnMoreSection([
      { key: 'streaming', label: 'Streaming Guide' },
      { key: 'hooks', label: 'Hooks Reference' },
    ])
    expect(result).toBe(
      '\n\n📖 **Learn more**: [Streaming Guide](/guides/streaming) | [Hooks Reference](/reference/hooks)'
    )
  })

  it('returns empty string for empty array', () => {
    expect(buildLearnMoreSection([])).toBe('')
  })

  it('handles single link', () => {
    const result = buildLearnMoreSection([
      { key: 'installation', label: 'Installation' },
    ])
    expect(result).toBe(
      '\n\n📖 **Learn more**: [Installation](/guides/installation)'
    )
  })

  it('starts with double newline', () => {
    const result = buildLearnMoreSection([{ key: 'testing', label: 'Tests' }])
    expect(result.startsWith('\n\n')).toBe(true)
  })
})

// ============================================================================
// buildComparisonTable Tests
// ============================================================================

describe('buildComparisonTable', () => {
  it('builds valid markdown table', () => {
    const result = buildComparisonTable(
      [
        { name: 'Speed', optionA: 'Fast', optionB: 'Slow' },
        { name: 'Size', optionA: 'Small', optionB: 'Large' },
      ],
      'Option A',
      'Option B'
    )
    expect(result).toContain('| Feature | Option A | Option B |')
    expect(result).toContain('| Speed | Fast | Slow |')
    expect(result).toContain('| Size | Small | Large |')
  })

  it('includes separator row with dashes', () => {
    const result = buildComparisonTable([], 'A', 'B')
    expect(result).toContain('|---------|')
    expect(result).toContain('---') // At least 3 dashes for short labels
  })

  it('handles empty features array', () => {
    const result = buildComparisonTable([], 'Col A', 'Col B')
    const lines = result.split('\n')
    expect(lines.length).toBe(2) // Header + separator only
  })

  it('handles long column labels', () => {
    const result = buildComparisonTable(
      [{ name: 'Test', optionA: 'A', optionB: 'B' }],
      'Very Long Label A',
      'Very Long Label B'
    )
    expect(result).toContain('Very Long Label A')
    expect(result).toContain('Very Long Label B')
  })

  it('separator width matches label length', () => {
    const result = buildComparisonTable([], 'AAAA', 'BB')
    // AAAA = 4 chars + 2 = 6, minimum 3
    expect(result).toContain('------')
    // BB = 2 chars + 2 = 4, minimum 3
    expect(result).toContain('----')
  })
})

// ============================================================================
// buildQuickChecks Tests
// ============================================================================

describe('buildQuickChecks', () => {
  it('builds numbered list', () => {
    const result = buildQuickChecks(['Check A', 'Check B', 'Check C'])
    expect(result).toBe(
      '**Quick checks first:**\n1. Check A\n2. Check B\n3. Check C'
    )
  })

  it('returns empty string for empty array', () => {
    expect(buildQuickChecks([])).toBe('')
  })

  it('handles single check', () => {
    expect(buildQuickChecks(['Only check'])).toBe(
      '**Quick checks first:**\n1. Only check'
    )
  })

  it('numbers start at 1', () => {
    const result = buildQuickChecks(['First', 'Second'])
    expect(result).toContain('1. First')
    expect(result).toContain('2. Second')
    expect(result).not.toContain('0.')
  })

  it('preserves check content exactly', () => {
    const result = buildQuickChecks(['Check with **markdown** and `code`'])
    expect(result).toContain('Check with **markdown** and `code`')
  })
})

// ============================================================================
// Edge Case Tests
// ============================================================================

describe('Edge Cases', () => {
  describe('buildComparisonTable edge cases', () => {
    it('handles empty string labels', () => {
      const result = buildComparisonTable(
        [{ name: 'Test', optionA: 'A', optionB: 'B' }],
        '',
        ''
      )
      // Should still generate valid markdown
      expect(result).toContain('| Feature |')
      expect(result).toContain('|---------|')
    })

    it('handles labels with pipe characters', () => {
      const result = buildComparisonTable(
        [{ name: 'Test', optionA: 'A', optionB: 'B' }],
        'A|B',
        'C|D'
      )
      // Note: This will produce invalid markdown, but function still works
      expect(result).toContain('A|B')
    })

    it('handles features with special characters', () => {
      const result = buildComparisonTable(
        [{ name: 'Test|Name', optionA: 'Val|A', optionB: 'Val|B' }],
        'ColA',
        'ColB'
      )
      expect(result).toContain('Test|Name')
    })
  })

  describe('buildQuickChecks edge cases', () => {
    it('handles checks with newlines', () => {
      const result = buildQuickChecks(['Line1\nLine2', 'Check2'])
      expect(result).toContain('1. Line1\nLine2')
      expect(result).toContain('2. Check2')
    })
  })

  describe('formatDocLink edge cases', () => {
    it('handles path with special URL characters', () => {
      const result = formatDocLink('/path/with spaces', 'Label')
      expect(result).toBe('[Label](/path/with spaces)')
    })

    it('handles very long labels', () => {
      const longLabel = 'A'.repeat(1000)
      const result = formatDocLink('/test', longLabel)
      expect(result).toContain(longLabel)
    })
  })

  describe('getDocLink type safety', () => {
    it('all DOC_LINKS keys produce valid output', () => {
      const keys: DocLinkKey[] = [
        'installation',
        'quickStart',
        'gettingStarted',
        'streaming',
        'tokenOptimization',
        'memory',
        'stateManagement',
        'dataFlow',
        'components',
        'hooks',
        'utilities',
        'customization',
        'theming',
        'accessibility',
        'performance',
        'testing',
        'bestPractices',
        'security',
        'migration',
        'integration',
        'playground',
        'examples',
        'cookbook',
      ]

      for (const key of keys) {
        const result = getDocLink(key)
        expect(result).toMatch(/^\[\/[a-z/-]+\]\(\/[a-z/-]+\)$/)
      }
    })
  })
})
