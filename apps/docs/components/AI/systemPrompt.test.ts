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
  extractXmlTags,
  validateXmlTagBalance,
  validateXmlNesting,
  validatePromptXml,
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

  // XML structure tests (v2.0.0 optimization)
  it('uses XML tags for structure (Anthropic best practice)', () => {
    expect(DOCS_ASSISTANT_SYSTEM_PROMPT).toContain('<assistant_identity>')
    expect(DOCS_ASSISTANT_SYSTEM_PROMPT).toContain('</assistant_identity>')
    expect(DOCS_ASSISTANT_SYSTEM_PROMPT).toContain('<technical_context>')
    expect(DOCS_ASSISTANT_SYSTEM_PROMPT).toContain('</technical_context>')
    expect(DOCS_ASSISTANT_SYSTEM_PROMPT).toContain('<response_guidelines>')
    expect(DOCS_ASSISTANT_SYSTEM_PROMPT).toContain('</response_guidelines>')
  })

  it('has KV-cache optimized structure (static content first)', () => {
    const identityIndex = DOCS_ASSISTANT_SYSTEM_PROMPT.indexOf(
      '<assistant_identity>'
    )
    const guidelinesIndex = DOCS_ASSISTANT_SYSTEM_PROMPT.indexOf(
      '<response_guidelines>'
    )
    // Static identity should come before dynamic guidelines
    expect(identityIndex).toBeLessThan(guidelinesIndex)
  })

  it('contains example response for few-shot guidance', () => {
    expect(DOCS_ASSISTANT_SYSTEM_PROMPT).toContain('<example_response>')
    expect(DOCS_ASSISTANT_SYSTEM_PROMPT).toContain('</example_response>')
  })

  it('uses positive instructions over negative ones', () => {
    // Should have "Required behaviors" section for positive framing
    expect(DOCS_ASSISTANT_SYSTEM_PROMPT).toContain('Required behaviors')

    // Positive instruction patterns should outnumber negative patterns
    const positivePatterns = [
      'Lead with',
      'Include',
      'Link to',
      'Offer',
      'Mirror',
      'Acknowledge',
      'Use',
      'Give',
      'Explain',
      'Follow',
    ]
    const negativePatterns = ["Don't", 'Never', 'Avoid', 'Do not']

    const positiveCount = positivePatterns.filter((p) =>
      DOCS_ASSISTANT_SYSTEM_PROMPT.includes(p)
    ).length
    const negativeCount = negativePatterns.filter((p) =>
      DOCS_ASSISTANT_SYSTEM_PROMPT.includes(p)
    ).length

    // Positive patterns should significantly outnumber negative ones
    expect(positiveCount).toBeGreaterThan(negativeCount * 2)
  })

  it('has balanced XML tags', () => {
    const validation = validateXmlTagBalance(DOCS_ASSISTANT_SYSTEM_PROMPT)
    expect(
      validation.isBalanced,
      `Unbalanced XML tags: ${validation.issues.join(', ')}`
    ).toBe(true)
    expect(validation.tagCount).toBeGreaterThan(0)
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
// Route Validation Tests (Build-time verification)
// ============================================================================

describe('DOC_LINKS Route Validation', () => {
  /**
   * This test verifies that all DOC_LINKS paths are valid documentation routes.
   * It helps catch when routes are renamed or removed without updating DOC_LINKS.
   */

  const VALID_ROUTE_PREFIXES = [
    '/guides/',
    '/reference/',
    '/examples',
    '/cookbook',
    '/playground',
    '/learn',
  ]

  it('all DOC_LINKS paths start with valid route prefixes', () => {
    for (const [key, path] of Object.entries(DOC_LINKS)) {
      const hasValidPrefix = VALID_ROUTE_PREFIXES.some(
        (prefix) =>
          path === prefix.replace(/\/$/, '') || path.startsWith(prefix)
      )
      expect(
        hasValidPrefix,
        `DOC_LINKS.${key} has invalid path "${path}". Must start with one of: ${VALID_ROUTE_PREFIXES.join(', ')}`
      ).toBe(true)
    }
  })

  it('all DOC_LINKS paths start with /', () => {
    for (const [key, path] of Object.entries(DOC_LINKS)) {
      expect(
        path.startsWith('/'),
        `DOC_LINKS.${key} path "${path}" must start with /`
      ).toBe(true)
    }
  })

  it('no DOC_LINKS paths end with /', () => {
    for (const [key, path] of Object.entries(DOC_LINKS)) {
      expect(
        !path.endsWith('/'),
        `DOC_LINKS.${key} path "${path}" should not end with /`
      ).toBe(true)
    }
  })

  it('no DOC_LINKS paths contain double slashes', () => {
    for (const [key, path] of Object.entries(DOC_LINKS)) {
      expect(
        !path.includes('//'),
        `DOC_LINKS.${key} path "${path}" contains double slashes`
      ).toBe(true)
    }
  })

  // Specific route existence checks
  const EXPECTED_ROUTES: Array<{ key: keyof typeof DOC_LINKS; path: string }> =
    [
      { key: 'installation', path: '/guides/installation' },
      { key: 'quickStart', path: '/guides/quick-start' },
      { key: 'streaming', path: '/guides/streaming' },
      { key: 'memory', path: '/guides/memory' },
      { key: 'components', path: '/reference/components' },
      { key: 'hooks', path: '/reference/hooks' },
      { key: 'playground', path: '/playground' },
      { key: 'examples', path: '/examples' },
      { key: 'cookbook', path: '/cookbook' },
    ]

  it.each(EXPECTED_ROUTES)('DOC_LINKS.$key equals $path', ({ key, path }) => {
    expect(DOC_LINKS[key]).toBe(path)
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

    it('escapes pipe characters in labels', () => {
      const result = buildComparisonTable(
        [{ name: 'Test', optionA: 'A', optionB: 'B' }],
        'A|B',
        'C|D'
      )
      // Pipes should be escaped for valid markdown
      expect(result).toContain('A\\|B')
      expect(result).toContain('C\\|D')
    })

    it('escapes pipe characters in feature values', () => {
      const result = buildComparisonTable(
        [{ name: 'Test|Name', optionA: 'Val|A', optionB: 'Val|B' }],
        'ColA',
        'ColB'
      )
      expect(result).toContain('Test\\|Name')
      expect(result).toContain('Val\\|A')
      expect(result).toContain('Val\\|B')
    })

    it('handles null/undefined features array', () => {
      const result = buildComparisonTable(
        null as unknown as Array<{
          name: string
          optionA: string
          optionB: string
        }>,
        'A',
        'B'
      )
      expect(result).toContain('| Feature |')
      // Should just have header and separator, no data rows
      expect(result.split('\n').length).toBe(2)
    })

    it('filters out invalid feature entries', () => {
      const result = buildComparisonTable(
        [
          { name: 'Valid', optionA: 'A', optionB: 'B' },
          null as unknown as { name: string; optionA: string; optionB: string },
          { name: 'Also Valid', optionA: 'C', optionB: 'D' },
        ],
        'ColA',
        'ColB'
      )
      expect(result).toContain('Valid')
      expect(result).toContain('Also Valid')
      expect(result.split('\n').length).toBe(4) // header + separator + 2 rows
    })
  })

  describe('buildQuickChecks edge cases', () => {
    it('handles checks with newlines', () => {
      const result = buildQuickChecks(['Line1\nLine2', 'Check2'])
      expect(result).toContain('1. Line1\nLine2')
      expect(result).toContain('2. Check2')
    })

    it('returns empty string for non-array input', () => {
      expect(buildQuickChecks(null as unknown as string[])).toBe('')
      expect(buildQuickChecks(undefined as unknown as string[])).toBe('')
    })

    it('filters out null/undefined entries', () => {
      const result = buildQuickChecks([
        'Valid check',
        null as unknown as string,
        'Another valid',
        undefined as unknown as string,
      ])
      expect(result).toContain('1. Valid check')
      expect(result).toContain('2. Another valid')
      expect(result).not.toContain('3.')
    })
  })

  describe('buildLearnMoreSection edge cases', () => {
    it('returns empty string for non-array input', () => {
      expect(
        buildLearnMoreSection(
          null as unknown as Array<{ key: DocLinkKey; label: string }>
        )
      ).toBe('')
    })

    it('filters out invalid link entries', () => {
      const result = buildLearnMoreSection([
        { key: 'streaming', label: 'Streaming' },
        null as unknown as { key: DocLinkKey; label: string },
        { key: 'hooks', label: 'Hooks' },
      ])
      expect(result).toContain('Streaming')
      expect(result).toContain('Hooks')
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

// ============================================================================
// XML Tag Validation Tests
// ============================================================================

describe('extractXmlTags', () => {
  it('extracts opening and closing tags', () => {
    const result = extractXmlTags('<foo>content</foo>')
    expect(result.openingTags).toContain('foo')
    expect(result.closingTags).toContain('foo')
    expect(result.unmatched).toHaveLength(0)
  })

  it('handles multiple tags', () => {
    const result = extractXmlTags('<a><b>text</b></a>')
    expect(result.openingTags).toEqual(['a', 'b'])
    expect(result.closingTags).toEqual(['b', 'a'])
    expect(result.unmatched).toHaveLength(0)
  })

  it('detects missing closing tag', () => {
    const result = extractXmlTags('<foo>content')
    expect(result.openingTags).toContain('foo')
    expect(result.closingTags).toHaveLength(0)
    expect(result.unmatched.length).toBeGreaterThan(0)
    expect(result.unmatched[0]).toContain('foo')
  })

  it('detects missing opening tag', () => {
    const result = extractXmlTags('content</bar>')
    expect(result.openingTags).toHaveLength(0)
    expect(result.closingTags).toContain('bar')
    expect(result.unmatched.length).toBeGreaterThan(0)
    expect(result.unmatched[0]).toContain('bar')
  })

  it('handles snake_case tag names', () => {
    const result = extractXmlTags('<my_tag>text</my_tag>')
    expect(result.openingTags).toContain('my_tag')
    expect(result.closingTags).toContain('my_tag')
    expect(result.unmatched).toHaveLength(0)
  })

  it('ignores uppercase tags (TypeScript generics like <TMessage>)', () => {
    // Uppercase tags are ignored to prevent false positives from TypeScript generics
    const result = extractXmlTags('<FOO>text</foo>')
    // Only lowercase </foo> is detected, <FOO> is ignored
    expect(result.openingTags).toHaveLength(0)
    expect(result.closingTags).toContain('foo')
    expect(result.unmatched.length).toBeGreaterThan(0) // Unmatched closing tag
  })

  it('correctly matches lowercase tags', () => {
    const result = extractXmlTags('<section>content</section>')
    expect(result.openingTags).toContain('section')
    expect(result.closingTags).toContain('section')
    expect(result.unmatched).toHaveLength(0)
  })

  it('handles empty string', () => {
    const result = extractXmlTags('')
    expect(result.openingTags).toHaveLength(0)
    expect(result.closingTags).toHaveLength(0)
    expect(result.unmatched).toHaveLength(0)
  })

  it('ignores non-XML content like code blocks', () => {
    // Generic angle brackets in code shouldn't be counted
    const result = extractXmlTags('if (x < 10 && y > 5) {}')
    // This shouldn't match since < is followed by space or not a valid tag
    expect(result.openingTags).toHaveLength(0)
  })
})

describe('validateXmlTagBalance', () => {
  it('validates balanced tags', () => {
    const result = validateXmlTagBalance('<a><b></b></a>')
    expect(result.isBalanced).toBe(true)
    expect(result.issues).toHaveLength(0)
    expect(result.tagCount).toBe(2)
  })

  it('detects unbalanced tags', () => {
    const result = validateXmlTagBalance('<a><b></a>')
    expect(result.isBalanced).toBe(false)
    expect(result.issues.length).toBeGreaterThan(0)
  })

  it('returns tag count', () => {
    const result = validateXmlTagBalance('<a><b><c></c></b></a>')
    expect(result.tagCount).toBe(3)
  })

  it('handles text without XML tags', () => {
    const result = validateXmlTagBalance('Just plain text')
    expect(result.isBalanced).toBe(true)
    expect(result.tagCount).toBe(0)
  })

  it('provides helpful issue messages', () => {
    const result = validateXmlTagBalance('<orphan>')
    expect(result.issues[0]).toContain('orphan')
    expect(result.issues[0]).toContain('missing')
    expect(result.issues[0]).toContain('closing')
  })
})

// ============================================================================
// XML Nesting Validation Tests
// ============================================================================

describe('validateXmlNesting', () => {
  it('validates properly nested tags', () => {
    const result = validateXmlNesting('<a><b></b></a>')
    expect(result.isValid).toBe(true)
    expect(result.issues).toHaveLength(0)
  })

  it('detects improper nesting order', () => {
    const result = validateXmlNesting('<a><b></a></b>')
    expect(result.isValid).toBe(false)
    expect(result.issues.length).toBeGreaterThan(0)
    expect(result.issues[0]).toContain('Improper nesting')
  })

  it('detects unexpected closing tags', () => {
    const result = validateXmlNesting('</orphan>')
    expect(result.isValid).toBe(false)
    expect(result.issues[0]).toContain('Unexpected closing tag')
  })

  it('detects unclosed tags', () => {
    const result = validateXmlNesting('<unclosed>')
    expect(result.isValid).toBe(false)
    expect(result.issues[0]).toContain('Unclosed tag')
  })

  it('handles deeply nested structures', () => {
    const result = validateXmlNesting('<a><b><c><d></d></c></b></a>')
    expect(result.isValid).toBe(true)
    expect(result.structure).toEqual([
      '<a>',
      '<b>',
      '<c>',
      '<d>',
      '</d>',
      '</c>',
      '</b>',
      '</a>',
    ])
  })

  it('handles empty string', () => {
    const result = validateXmlNesting('')
    expect(result.isValid).toBe(true)
    expect(result.issues).toHaveLength(0)
    expect(result.structure).toHaveLength(0)
  })

  it('handles text without tags', () => {
    const result = validateXmlNesting('Just plain text here')
    expect(result.isValid).toBe(true)
    expect(result.structure).toHaveLength(0)
  })

  it('reports position of errors', () => {
    const result = validateXmlNesting('<a></b>')
    expect(result.issues[0]).toContain('position')
  })

  it('validates DOCS_ASSISTANT_SYSTEM_PROMPT has proper nesting', () => {
    const result = validateXmlNesting(DOCS_ASSISTANT_SYSTEM_PROMPT)
    expect(result.isValid, `Nesting issues: ${result.issues.join(', ')}`).toBe(
      true
    )
  })
})

describe('validatePromptXml', () => {
  it('returns combined validation result', () => {
    const result = validatePromptXml('<a><b></b></a>')
    expect(result.isValid).toBe(true)
    expect(result.balanceIssues).toHaveLength(0)
    expect(result.nestingIssues).toHaveLength(0)
    expect(result.tagCount).toBe(2)
  })

  it('detects both balance and nesting issues', () => {
    const result = validatePromptXml('<a><b></a>')
    expect(result.isValid).toBe(false)
    // Should have issues from nesting check
    expect(result.nestingIssues.length).toBeGreaterThan(0)
  })

  it('provides structure for valid prompts', () => {
    const result = validatePromptXml('<section><content></content></section>')
    expect(result.structure).toContain('<section>')
    expect(result.structure).toContain('</section>')
  })

  it('validates DOCS_ASSISTANT_SYSTEM_PROMPT completely', () => {
    const result = validatePromptXml(DOCS_ASSISTANT_SYSTEM_PROMPT)
    expect(
      result.isValid,
      `Issues: ${[...result.balanceIssues, ...result.nestingIssues].join(', ')}`
    ).toBe(true)
    expect(result.tagCount).toBeGreaterThan(0)
  })
})
