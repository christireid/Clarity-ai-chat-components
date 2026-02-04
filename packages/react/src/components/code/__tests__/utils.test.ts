import { describe, it, expect } from 'vitest'
import {
  parseLineRanges,
  escapeHtml,
  normalizeLanguage,
  detectLanguage,
  getLanguageDisplayName,
  countLines,
  truncateCode,
} from '../utils'

describe('parseLineRanges', () => {
  it('parses single numbers', () => {
    const result = parseLineRanges('2,5,10')
    expect(result).toEqual(new Set([2, 5, 10]))
  })

  it('parses ranges', () => {
    const result = parseLineRanges('5-7')
    expect(result).toEqual(new Set([5, 6, 7]))
  })

  it('parses mixed single numbers and ranges', () => {
    const result = parseLineRanges('2,5-7,10')
    expect(result).toEqual(new Set([2, 5, 6, 7, 10]))
  })

  it('handles whitespace', () => {
    const result = parseLineRanges(' 2 , 5 - 7 , 10 ')
    expect(result).toEqual(new Set([2, 5, 6, 7, 10]))
  })

  it('returns empty set for undefined', () => {
    const result = parseLineRanges(undefined)
    expect(result).toEqual(new Set())
  })

  it('returns empty set for empty string', () => {
    const result = parseLineRanges('')
    expect(result).toEqual(new Set())
  })

  it('ignores invalid values', () => {
    const result = parseLineRanges('2,abc,5')
    expect(result).toEqual(new Set([2, 5]))
  })
})

describe('escapeHtml', () => {
  it('escapes ampersand', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b')
  })

  it('escapes less than', () => {
    expect(escapeHtml('a < b')).toBe('a &lt; b')
  })

  it('escapes greater than', () => {
    expect(escapeHtml('a > b')).toBe('a &gt; b')
  })

  it('escapes quotes', () => {
    expect(escapeHtml('"test"')).toBe('&quot;test&quot;')
  })

  it('escapes single quotes', () => {
    expect(escapeHtml("'test'")).toBe('&#39;test&#39;')
  })

  it('escapes multiple special characters', () => {
    expect(escapeHtml('<div class="test">&</div>')).toBe(
      '&lt;div class=&quot;test&quot;&gt;&amp;&lt;/div&gt;'
    )
  })
})

describe('normalizeLanguage', () => {
  it('normalizes common aliases', () => {
    expect(normalizeLanguage('js')).toBe('javascript')
    expect(normalizeLanguage('ts')).toBe('typescript')
    expect(normalizeLanguage('py')).toBe('python')
    expect(normalizeLanguage('rb')).toBe('ruby')
    expect(normalizeLanguage('sh')).toBe('bash')
    expect(normalizeLanguage('yml')).toBe('yaml')
    expect(normalizeLanguage('md')).toBe('markdown')
  })

  it('handles case insensitivity', () => {
    expect(normalizeLanguage('JS')).toBe('javascript')
    expect(normalizeLanguage('TypeScript')).toBe('typescript')
  })

  it('returns text for undefined', () => {
    expect(normalizeLanguage(undefined)).toBe('text')
  })

  it('returns original for unknown languages', () => {
    expect(normalizeLanguage('unknownlang')).toBe('unknownlang')
  })
})

describe('detectLanguage', () => {
  it('detects TypeScript', () => {
    expect(detectLanguage('interface Foo { x: number }')).toBe('typescript')
    expect(detectLanguage('type Bar = string | number')).toBe('typescript')
  })

  it('detects JavaScript', () => {
    expect(detectLanguage('function foo() { return 1 }')).toBe('javascript')
    expect(detectLanguage('const x = () => {}')).toBe('javascript')
  })

  it('detects Python', () => {
    expect(detectLanguage('def foo():\n    pass')).toBe('python')
    expect(detectLanguage('import os\nfrom sys import path')).toBe('python')
  })

  it('detects JSON', () => {
    expect(detectLanguage('{"key": "value"}')).toBe('json')
    expect(detectLanguage('[1, 2, 3]')).toBe('json')
  })

  it('detects HTML', () => {
    expect(detectLanguage('<div>Hello</div>')).toBe('html')
    expect(detectLanguage('<!DOCTYPE html>')).toBe('html')
  })

  it('detects SQL', () => {
    expect(detectLanguage('SELECT * FROM users')).toBe('sql')
    expect(detectLanguage('INSERT INTO table VALUES (1)')).toBe('sql')
  })

  it('returns text for unrecognized code', () => {
    expect(detectLanguage('some random text')).toBe('text')
  })
})

describe('getLanguageDisplayName', () => {
  it('returns display names for known languages', () => {
    expect(getLanguageDisplayName('typescript')).toBe('TypeScript')
    expect(getLanguageDisplayName('javascript')).toBe('JavaScript')
    expect(getLanguageDisplayName('python')).toBe('Python')
    expect(getLanguageDisplayName('csharp')).toBe('C#')
  })

  it('returns uppercase for unknown languages', () => {
    expect(getLanguageDisplayName('unknownlang')).toBe('UNKNOWNLANG')
  })

  it('handles case insensitivity', () => {
    expect(getLanguageDisplayName('TYPESCRIPT')).toBe('TypeScript')
  })
})

describe('countLines', () => {
  it('counts lines correctly', () => {
    expect(countLines('line1\nline2\nline3')).toBe(3)
    expect(countLines('single line')).toBe(1)
    expect(countLines('')).toBe(1)
  })
})

describe('truncateCode', () => {
  it('truncates code to max lines', () => {
    const code = 'line1\nline2\nline3\nline4\nline5'
    expect(truncateCode(code, 3)).toBe('line1\nline2\nline3')
  })

  it('returns original if within limit', () => {
    const code = 'line1\nline2'
    expect(truncateCode(code, 5)).toBe(code)
  })
})
