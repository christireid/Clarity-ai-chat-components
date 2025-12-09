/**
 * Tests for utility functions
 */

import { describe, it, expect } from 'vitest'
import {
  escapeTableCell,
  escapeType,
  toSlug,
  toKebabCase,
  createTable,
  createPropsTable,
  createParametersTable,
  codeBlock,
  createCallout,
  createDeprecationWarning,
  normalizeWhitespace,
} from '../utils/markdown.js'
import { getContentHash, createCacheKey, LRUCache } from '../utils/cache.js'

describe('Markdown Utilities', () => {
  describe('escapeTableCell', () => {
    it('should escape pipe characters', () => {
      expect(escapeTableCell('a | b')).toBe('a \\| b')
    })

    it('should replace newlines with br tags', () => {
      expect(escapeTableCell('line1\nline2')).toBe('line1<br/>line2')
    })

    it('should escape backticks', () => {
      expect(escapeTableCell('`code`')).toBe('\\`code\\`')
    })
  })

  describe('escapeType', () => {
    it('should escape angle brackets', () => {
      expect(escapeType('Array<string>')).toBe('Array&lt;string&gt;')
    })

    it('should escape pipe characters', () => {
      expect(escapeType('string | number')).toBe('string \\| number')
    })
  })

  describe('toSlug', () => {
    it('should convert PascalCase to slug', () => {
      expect(toSlug('ChatWindow')).toBe('chat-window')
    })

    it('should handle camelCase', () => {
      expect(toSlug('useChat')).toBe('use-chat')
    })

    it('should remove special characters', () => {
      expect(toSlug('My Component!')).toBe('my-component')
    })

    it('should handle consecutive dashes', () => {
      expect(toSlug('Some--Thing')).toBe('some-thing')
    })
  })

  describe('toKebabCase', () => {
    it('should convert camelCase', () => {
      expect(toKebabCase('camelCase')).toBe('camel-case')
    })

    it('should convert PascalCase', () => {
      expect(toKebabCase('PascalCase')).toBe('pascal-case')
    })

    it('should handle consecutive uppercase', () => {
      expect(toKebabCase('HTMLParser')).toBe('html-parser')
    })
  })

  describe('createTable', () => {
    it('should create a markdown table', () => {
      const headers = ['Name', 'Type']
      const rows = [
        ['foo', 'string'],
        ['bar', 'number'],
      ]

      const table = createTable(headers, rows)

      expect(table).toContain('| Name | Type |')
      expect(table).toContain('| --- | --- |')
      expect(table).toContain('| foo | string |')
      expect(table).toContain('| bar | number |')
    })
  })

  describe('createPropsTable', () => {
    it('should create a props table', () => {
      const props = [
        {
          name: 'value',
          type: 'string',
          required: true,
          default: null,
          description: 'The value',
        },
        {
          name: 'onChange',
          type: '(value: string) => void',
          required: false,
          default: 'undefined',
          description: 'Change handler',
        },
      ]

      const table = createPropsTable(props)

      expect(table).toContain(
        '| Prop | Type | Required | Default | Description |'
      )
      expect(table).toContain('`value`')
      expect(table).toContain('Yes')
      expect(table).toContain('No')
    })
  })

  describe('createParametersTable', () => {
    it('should create a parameters table', () => {
      const params = [
        {
          name: 'options',
          type: 'Options',
          required: true,
          description: 'Configuration options',
        },
      ]

      const table = createParametersTable(params)

      expect(table).toContain('| Parameter | Type | Required | Description |')
      expect(table).toContain('`options`')
    })
  })

  describe('codeBlock', () => {
    it('should create a code block with language', () => {
      const code = codeBlock('const x = 1', 'typescript')

      expect(code).toBe('```typescript\nconst x = 1\n```')
    })

    it('should default to typescript', () => {
      const code = codeBlock('const x = 1')

      expect(code).toContain('```typescript')
    })
  })

  describe('createCallout', () => {
    it('should create a note callout', () => {
      const callout = createCallout('note', 'This is a note')

      expect(callout).toContain('<Callout type="note" title="Note">')
      expect(callout).toContain('This is a note')
      expect(callout).toContain('</Callout>')
    })

    it('should create a warning callout', () => {
      const callout = createCallout('warning', 'Be careful!')

      expect(callout).toContain('type="warning"')
      expect(callout).toContain('title="Warning"')
    })
  })

  describe('createDeprecationWarning', () => {
    it('should create a deprecation warning', () => {
      const warning = createDeprecationWarning('This is deprecated')

      expect(warning).toContain('type="warning"')
      expect(warning).toContain('**Deprecated:**')
      expect(warning).toContain('This is deprecated')
    })

    it('should include alternative if provided', () => {
      const warning = createDeprecationWarning(
        'This is deprecated',
        'useNewAPI'
      )

      expect(warning).toContain('Use `useNewAPI` instead')
    })
  })

  describe('normalizeWhitespace', () => {
    it('should normalize line endings', () => {
      const input = 'line1\r\nline2\r\nline3'
      const normalized = normalizeWhitespace(input)

      expect(normalized).toBe('line1\nline2\nline3')
    })

    it('should limit consecutive newlines', () => {
      const input = 'line1\n\n\n\nline2'
      const normalized = normalizeWhitespace(input)

      expect(normalized).toBe('line1\n\nline2')
    })

    it('should trim trailing whitespace', () => {
      const input = 'line1   \nline2\t\n'
      const normalized = normalizeWhitespace(input)

      expect(normalized).toBe('line1\nline2')
    })
  })
})

describe('Cache Utilities', () => {
  describe('getContentHash', () => {
    it('should return consistent hash for same content', () => {
      const hash1 = getContentHash('test content')
      const hash2 = getContentHash('test content')

      expect(hash1).toBe(hash2)
    })

    it('should return different hash for different content', () => {
      const hash1 = getContentHash('content a')
      const hash2 = getContentHash('content b')

      expect(hash1).not.toBe(hash2)
    })

    it('should return 16 character hash', () => {
      const hash = getContentHash('test')

      expect(hash).toHaveLength(16)
    })
  })

  describe('createCacheKey', () => {
    it('should create consistent key from inputs', () => {
      const key1 = createCacheKey('a', 'b', 'c')
      const key2 = createCacheKey('a', 'b', 'c')

      expect(key1).toBe(key2)
    })

    it('should create different keys for different inputs', () => {
      const key1 = createCacheKey('a', 'b')
      const key2 = createCacheKey('a', 'c')

      expect(key1).not.toBe(key2)
    })
  })

  describe('LRUCache', () => {
    it('should store and retrieve values', () => {
      const cache = new LRUCache<string, number>(10)

      cache.set('a', 1)
      cache.set('b', 2)

      expect(cache.get('a')).toBe(1)
      expect(cache.get('b')).toBe(2)
    })

    it('should evict oldest entries when full', () => {
      const cache = new LRUCache<string, number>(2)

      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)

      expect(cache.get('a')).toBeUndefined()
      expect(cache.get('b')).toBe(2)
      expect(cache.get('c')).toBe(3)
    })

    it('should update LRU order on get', () => {
      const cache = new LRUCache<string, number>(2)

      cache.set('a', 1)
      cache.set('b', 2)
      cache.get('a') // Access 'a' to make it recently used
      cache.set('c', 3) // This should evict 'b'

      expect(cache.get('a')).toBe(1)
      expect(cache.get('b')).toBeUndefined()
      expect(cache.get('c')).toBe(3)
    })

    it('should report correct size', () => {
      const cache = new LRUCache<string, number>(10)

      expect(cache.size).toBe(0)

      cache.set('a', 1)
      expect(cache.size).toBe(1)

      cache.set('b', 2)
      expect(cache.size).toBe(2)
    })

    it('should clear all entries', () => {
      const cache = new LRUCache<string, number>(10)

      cache.set('a', 1)
      cache.set('b', 2)
      cache.clear()

      expect(cache.size).toBe(0)
      expect(cache.get('a')).toBeUndefined()
    })

    it('should check if key exists', () => {
      const cache = new LRUCache<string, number>(10)

      cache.set('a', 1)

      expect(cache.has('a')).toBe(true)
      expect(cache.has('b')).toBe(false)
    })
  })
})
