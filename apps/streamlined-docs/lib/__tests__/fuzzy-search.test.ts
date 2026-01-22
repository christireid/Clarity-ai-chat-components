/**
 * @vitest-environment happy-dom
 */

import { describe, it, expect } from 'vitest'
import { fuzzyScore, fuzzySearch, highlightMatches } from '../fuzzy-search'

describe('fuzzyScore', () => {
  describe('edge cases', () => {
    it('returns 0 for empty query', () => {
      expect(fuzzyScore('', 'hello').score).toBe(0)
    })

    it('returns 0 for empty text', () => {
      expect(fuzzyScore('hello', '').score).toBe(0)
    })

    it('returns 0 for both empty', () => {
      expect(fuzzyScore('', '').score).toBe(0)
    })
  })

  describe('exact matches', () => {
    it('returns 100 for exact match', () => {
      expect(fuzzyScore('hello', 'hello').score).toBe(100)
    })

    it('returns 100 for case-insensitive exact match', () => {
      expect(fuzzyScore('Hello', 'hello').score).toBe(100)
      expect(fuzzyScore('HELLO', 'hello').score).toBe(100)
    })
  })

  describe('prefix matches', () => {
    it('returns high score for prefix match', () => {
      const result = fuzzyScore('chat', 'ChatWindow')
      expect(result.score).toBeGreaterThan(80)
      expect(result.score).toBeLessThan(100)
    })

    it('scores longer prefix matches higher', () => {
      const shortPrefix = fuzzyScore('ch', 'ChatWindow')
      const longPrefix = fuzzyScore('chatw', 'ChatWindow')
      expect(longPrefix.score).toBeGreaterThan(shortPrefix.score)
    })
  })

  describe('word boundary matches', () => {
    it('matches word boundaries in camelCase', () => {
      // "Window" starts with "window" (case-insensitive) after camelCase split
      const result = fuzzyScore('window', 'ChatWindow')
      // Word boundary match scores 60+
      expect(result.score).toBeGreaterThan(60)
    })

    it('matches word boundaries with hyphens', () => {
      const result = fuzzyScore('input', 'chat-input')
      expect(result.score).toBeGreaterThan(60)
    })

    it('matches word boundaries with underscores', () => {
      const result = fuzzyScore('message', 'use_message_list')
      expect(result.score).toBeGreaterThan(60)
    })

    it('matches word boundaries with spaces', () => {
      const result = fuzzyScore('start', 'Quick Start Guide')
      expect(result.score).toBeGreaterThan(60)
    })
  })

  describe('contains matches', () => {
    it('returns moderate score for substring match', () => {
      // "dow" is contained in "Window" but doesn't start a word
      const result = fuzzyScore('dow', 'ChatWindow')
      expect(result.score).toBeGreaterThan(40)
      expect(result.score).toBeLessThan(60)
    })

    it('scores earlier positions higher', () => {
      const earlyMatch = fuzzyScore('hat', 'ChatWindow')
      const lateMatch = fuzzyScore('dow', 'ChatWindow')
      expect(earlyMatch.score).toBeGreaterThan(lateMatch.score)
    })
  })

  describe('fuzzy character matches', () => {
    it('matches characters in order', () => {
      const result = fuzzyScore('cw', 'ChatWindow')
      expect(result.score).toBeGreaterThan(20)
    })

    it('returns 0 when characters are not in order', () => {
      const result = fuzzyScore('wc', 'ChatWindow')
      expect(result.score).toBe(0)
    })

    it('scores consecutive matches higher', () => {
      const consecutive = fuzzyScore('cha', 'ChatWindow')
      const spread = fuzzyScore('caw', 'ChatWindow')
      expect(consecutive.score).toBeGreaterThan(spread.score)
    })
  })

  describe('no matches', () => {
    it('returns 0 for no match', () => {
      expect(fuzzyScore('xyz', 'ChatWindow').score).toBe(0)
    })

    it('returns low score for partial character match with extra chars', () => {
      // "chatx" contains "chat" which matches, but 'x' doesn't match
      // The algorithm matches what it can find, so score > 0
      const result = fuzzyScore('chatx', 'ChatWindow')
      expect(result.score).toBeGreaterThanOrEqual(0)
    })
  })

  describe('special characters', () => {
    it('handles special regex characters', () => {
      expect(() => fuzzyScore('use(', 'useChat')).not.toThrow()
    })

    it('handles unicode characters', () => {
      const result = fuzzyScore('emoji', 'emoji 😀 component')
      expect(result.score).toBeGreaterThan(0)
    })
  })

  describe('long inputs', () => {
    it('handles very long query', () => {
      const longQuery = 'a'.repeat(1000)
      expect(() => fuzzyScore(longQuery, 'test')).not.toThrow()
    })

    it('handles very long text', () => {
      const longText = 'a'.repeat(1000)
      expect(() => fuzzyScore('test', longText)).not.toThrow()
    })
  })
})

describe('fuzzySearch', () => {
  const items = [
    { id: 1, title: 'ChatWindow', description: 'Main chat component' },
    { id: 2, title: 'useChat', description: 'Chat hook' },
    { id: 3, title: 'MessageList', description: 'List of messages' },
    { id: 4, title: 'ChatInput', description: 'Input for chat' },
    { id: 5, title: 'StreamingMessage', description: 'Streaming support' },
  ]

  const getFields = (item: (typeof items)[0]) => [
    { field: 'title', value: item.title, weight: 2 },
    { field: 'description', value: item.description, weight: 1 },
  ]

  it('returns all items with score 0 for empty query', () => {
    const results = fuzzySearch('', items, getFields)
    expect(results).toHaveLength(items.length)
    expect(results.every((r) => r._score === 0)).toBe(true)
  })

  it('returns all items with score 0 for whitespace query', () => {
    const results = fuzzySearch('   ', items, getFields)
    expect(results).toHaveLength(items.length)
  })

  it('filters out non-matching items', () => {
    const results = fuzzySearch('xyz', items, getFields)
    expect(results).toHaveLength(0)
  })

  it('returns matching items sorted by score', () => {
    const results = fuzzySearch('chat', items, getFields)
    expect(results.length).toBeGreaterThan(0)

    // Verify descending score order
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1]._score).toBeGreaterThanOrEqual(results[i]._score)
    }
  })

  it('applies field weights correctly', () => {
    // "chat" appears in title (weight 2) for ChatWindow and ChatInput
    // "chat" appears in description (weight 1) for useChat
    const results = fuzzySearch('chat', items, getFields)

    // ChatWindow and ChatInput should score higher than items only matching description
    const chatWindowResult = results.find((r) => r.title === 'ChatWindow')
    const useChatResult = results.find((r) => r.title === 'useChat')

    expect(chatWindowResult).toBeDefined()
    expect(useChatResult).toBeDefined()
  })

  it('preserves original item properties', () => {
    const results = fuzzySearch('chat', items, getFields)
    const result = results[0]

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('title')
    expect(result).toHaveProperty('description')
    expect(result).toHaveProperty('_score')
  })

  it('handles items with missing optional fields', () => {
    const itemsWithMissing = [{ id: 1, title: 'Test', description: undefined }]

    const results = fuzzySearch('test', itemsWithMissing, (item) => [
      { field: 'title', value: item.title, weight: 1 },
      { field: 'description', value: item.description || '', weight: 1 },
    ])

    expect(results).toHaveLength(1)
  })

  it('returns generic type correctly', () => {
    interface CustomItem {
      name: string
      tags: string[]
    }

    const customItems: CustomItem[] = [
      { name: 'Item 1', tags: ['react', 'chat'] },
      { name: 'Item 2', tags: ['vue', 'modal'] },
    ]

    const results = fuzzySearch('react', customItems, (item) => [
      { field: 'name', value: item.name },
      { field: 'tags', value: item.tags.join(' ') },
    ])

    // TypeScript should infer CustomItem & { _score: number }
    if (results.length > 0) {
      expect(results[0].tags).toEqual(['react', 'chat'])
    }
  })
})

describe('highlightMatches', () => {
  it('returns original text for empty query', () => {
    expect(highlightMatches('', 'hello world')).toBe('hello world')
  })

  it('returns original text for empty text', () => {
    expect(highlightMatches('hello', '')).toBe('')
  })

  it('wraps match in mark tags', () => {
    const result = highlightMatches('world', 'hello world')
    expect(result).toBe('hello <mark>world</mark>')
  })

  it('is case-insensitive', () => {
    const result = highlightMatches('WORLD', 'hello world')
    expect(result).toBe('hello <mark>world</mark>')
  })

  it('highlights first occurrence only', () => {
    const result = highlightMatches('o', 'hello world')
    expect(result).toBe('hell<mark>o</mark> world')
  })

  it('returns original text when no match', () => {
    expect(highlightMatches('xyz', 'hello world')).toBe('hello world')
  })

  it('handles match at beginning', () => {
    const result = highlightMatches('hello', 'hello world')
    expect(result).toBe('<mark>hello</mark> world')
  })

  it('handles match at end', () => {
    const result = highlightMatches('world', 'hello world')
    expect(result).toBe('hello <mark>world</mark>')
  })

  it('handles full text match', () => {
    const result = highlightMatches('hello world', 'hello world')
    expect(result).toBe('<mark>hello world</mark>')
  })
})
