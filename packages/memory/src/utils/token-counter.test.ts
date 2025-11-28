/**
 * Token Counter Tests
 */
import { describe, it, expect } from 'vitest'
import { TokenCounter, countTokens } from './token-counter'

describe('TokenCounter', () => {
  describe('count', () => {
    it('should return 0 for empty string', () => {
      expect(TokenCounter.count('')).toBe(0)
    })

    it('should return 0 for null/undefined', () => {
      expect(TokenCounter.count(null as unknown as string)).toBe(0)
      expect(TokenCounter.count(undefined as unknown as string)).toBe(0)
    })

    it('should count tokens based on ~4 chars per token', () => {
      // 12 characters = 3 tokens (ceil(12/4))
      expect(TokenCounter.count('Hello World!')).toBe(3)
    })

    it('should ceil the token count', () => {
      // 5 characters = ceil(5/4) = 2 tokens
      expect(TokenCounter.count('Hello')).toBe(2)
    })

    it('should handle longer text', () => {
      const text = 'The quick brown fox jumps over the lazy dog.'
      // 44 characters = ceil(44/4) = 11 tokens
      expect(TokenCounter.count(text)).toBe(11)
    })

    it('should handle unicode characters', () => {
      const text = '你好世界' // 4 characters
      expect(TokenCounter.count(text)).toBe(1)
    })

    it('should handle emojis', () => {
      const text = '👋🌍' // 2 characters (2 code points)
      expect(TokenCounter.count(text)).toBeGreaterThan(0)
    })

    it('should handle whitespace', () => {
      expect(TokenCounter.count('    ')).toBe(1) // 4 spaces = 1 token
      expect(TokenCounter.count('\n\n\n\n')).toBe(1) // 4 newlines = 1 token
    })
  })

  describe('countBatch', () => {
    it('should return 0 for empty array', () => {
      expect(TokenCounter.countBatch([])).toBe(0)
    })

    it('should sum tokens from multiple texts', () => {
      const texts = ['Hello', 'World', '!!!!']
      // 5 + 5 + 4 = 14 chars = ceil(5/4) + ceil(5/4) + ceil(4/4) = 2 + 2 + 1 = 5
      expect(TokenCounter.countBatch(texts)).toBe(5)
    })

    it('should handle empty strings in array', () => {
      const texts = ['Hello', '', 'World']
      expect(TokenCounter.countBatch(texts)).toBe(4) // 2 + 0 + 2
    })
  })

  describe('truncate', () => {
    it('should return unchanged text if within budget', () => {
      const text = 'Hello'
      expect(TokenCounter.truncate(text, 10)).toBe(text)
    })

    it('should truncate text exceeding budget', () => {
      const text = 'Hello World, this is a long sentence that should be truncated.'
      const result = TokenCounter.truncate(text, 5)
      // Result should be shorter than original
      expect(result.length).toBeLessThan(text.length)
      // Token count should be reduced (may not be exact due to sentence boundary logic)
      expect(TokenCounter.count(result)).toBeLessThan(TokenCounter.count(text))
    })

    it('should try to break at sentence boundary', () => {
      const text = 'First sentence. Second sentence. Third sentence.'
      const result = TokenCounter.truncate(text, 5)
      // Should break at a period if possible
      expect(result.endsWith('.') || result.endsWith('...')).toBe(true)
    })

    it('should handle text without sentence boundaries', () => {
      const text = 'onetwothreefourfivesixseveneight'
      const result = TokenCounter.truncate(text, 2)
      expect(result.endsWith('...')).toBe(true)
    })

    it('should break at question mark', () => {
      const text = 'Is this working? More text here that goes on.'
      const result = TokenCounter.truncate(text, 5)
      expect(result).toContain('?')
    })

    it('should break at exclamation mark', () => {
      const text = 'Wow amazing! More text here that goes on and on.'
      const result = TokenCounter.truncate(text, 4)
      expect(result).toContain('!')
    })
  })

  describe('splitSentences', () => {
    it('should split text by periods', () => {
      const text = 'First sentence. Second sentence.'
      const sentences = TokenCounter.splitSentences(text)
      expect(sentences).toEqual(['First sentence', 'Second sentence'])
    })

    it('should split by question marks', () => {
      const text = 'Is this a question? Yes it is.'
      const sentences = TokenCounter.splitSentences(text)
      expect(sentences).toEqual(['Is this a question', 'Yes it is'])
    })

    it('should split by exclamation marks', () => {
      const text = 'Wow! Amazing!'
      const sentences = TokenCounter.splitSentences(text)
      expect(sentences).toEqual(['Wow', 'Amazing'])
    })

    it('should handle empty strings', () => {
      expect(TokenCounter.splitSentences('')).toEqual([])
    })

    it('should trim whitespace from sentences', () => {
      const text = '  First.   Second.  '
      const sentences = TokenCounter.splitSentences(text)
      expect(sentences).toEqual(['First', 'Second'])
    })

    it('should filter empty sentences', () => {
      const text = 'One.. Two... Three.'
      const sentences = TokenCounter.splitSentences(text)
      expect(sentences.every(s => s.length > 0)).toBe(true)
    })
  })
})

describe('countTokens', () => {
  it('should be an alias for TokenCounter.count', () => {
    const text = 'Hello World'
    expect(countTokens(text)).toBe(TokenCounter.count(text))
  })
})
