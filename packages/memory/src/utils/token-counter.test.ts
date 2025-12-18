/**
 * Token Counter Tests
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { TokenCounter, countTokens, countTokensWithConfidence } from './token-counter'

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

describe('TokenCounter - Enhanced Features', () => {
  beforeEach(() => {
    // Reset to default model before each test
    TokenCounter.setModel('generic')
  })

  describe('setModel/getModel', () => {
    it('should set and get model family', () => {
      TokenCounter.setModel('gpt-4')
      expect(TokenCounter.getModel()).toBe('gpt-4')

      TokenCounter.setModel('claude')
      expect(TokenCounter.getModel()).toBe('claude')
    })

    it('should default to generic model', () => {
      expect(TokenCounter.getModel()).toBe('generic')
    })
  })

  describe('countWithConfidence', () => {
    it('should return TokenCountResult with all fields', () => {
      const result = TokenCounter.countWithConfidence('Hello World')

      expect(result).toHaveProperty('count')
      expect(result).toHaveProperty('confidence')
      expect(result).toHaveProperty('contentType')
      expect(typeof result.count).toBe('number')
    })

    it('should return exact confidence for empty text', () => {
      const result = TokenCounter.countWithConfidence('')

      expect(result.count).toBe(0)
      expect(result.confidence).toBe('exact')
      expect(result.contentType).toBe('unknown')
    })

    it('should detect prose content', () => {
      const text = 'The quick brown fox jumps over the lazy dog. This is a simple sentence.'
      const result = TokenCounter.countWithConfidence(text)

      expect(result.contentType).toBe('prose')
      expect(result.confidence).toBe('high')
    })

    it('should detect code content', () => {
      const code = `
        function hello() {
          const message = 'Hello';
          console.log(message);
          return message;
        }
      `
      const result = TokenCounter.countWithConfidence(code)

      expect(result.contentType).toBe('code')
      expect(result.confidence).toBe('high')
    })

    it('should detect mixed content', () => {
      const mixed = `
        Here is some code:
        const x = 5;
        And here is more text explaining what it does.
      `
      const result = TokenCounter.countWithConfidence(mixed)

      expect(['code', 'mixed']).toContain(result.contentType)
    })

    it('should use specified model for counting', () => {
      const text = 'Hello World'

      const gpt4Result = TokenCounter.countWithConfidence(text, 'gpt-4')
      const claudeResult = TokenCounter.countWithConfidence(text, 'claude')

      // Claude uses slightly different ratios (3.8 vs 4.0)
      // Results may differ slightly
      expect(gpt4Result.count).toBeGreaterThan(0)
      expect(claudeResult.count).toBeGreaterThan(0)
    })
  })

  describe('countBatchWithConfidence', () => {
    it('should return combined result for multiple texts', () => {
      const texts = ['Hello World', 'How are you?']
      const result = TokenCounter.countBatchWithConfidence(texts)

      expect(result.count).toBeGreaterThan(0)
      expect(result).toHaveProperty('confidence')
      expect(result).toHaveProperty('contentType')
    })

    it('should return exact confidence for empty array', () => {
      const result = TokenCounter.countBatchWithConfidence([])

      expect(result.count).toBe(0)
      expect(result.confidence).toBe('exact')
    })

    it('should sum token counts from all texts', () => {
      const texts = ['Hello', 'World']
      const result = TokenCounter.countBatchWithConfidence(texts)

      const individual1 = TokenCounter.count('Hello')
      const individual2 = TokenCounter.count('World')

      expect(result.count).toBe(individual1 + individual2)
    })
  })

  describe('remaining', () => {
    it('should calculate remaining tokens in budget', () => {
      const text = 'Hello' // ~2 tokens
      const remaining = TokenCounter.remaining(text, 10)

      expect(remaining).toBe(10 - TokenCounter.count(text))
    })

    it('should return 0 if text exceeds budget', () => {
      const text = 'Hello World this is a long text'
      const remaining = TokenCounter.remaining(text, 1)

      expect(remaining).toBe(0)
    })
  })

  describe('fitsInBudget', () => {
    it('should return true if text fits in budget', () => {
      const text = 'Hello'
      expect(TokenCounter.fitsInBudget(text, 10)).toBe(true)
    })

    it('should return false if text exceeds budget', () => {
      const text = 'Hello World this is a very long text that exceeds the budget'
      expect(TokenCounter.fitsInBudget(text, 1)).toBe(false)
    })

    it('should return true if text exactly matches budget', () => {
      const text = 'Hi' // 1 token
      expect(TokenCounter.fitsInBudget(text, 1)).toBe(true)
    })
  })

  describe('getTokenRatio', () => {
    it('should return ratio for prose', () => {
      const ratio = TokenCounter.getTokenRatio('prose')
      expect(ratio).toBeGreaterThan(0)
    })

    it('should return ratio for code', () => {
      const ratio = TokenCounter.getTokenRatio('code')
      expect(ratio).toBeGreaterThan(0)
    })

    it('should return different ratios for different content types', () => {
      const proseRatio = TokenCounter.getTokenRatio('prose')
      const codeRatio = TokenCounter.getTokenRatio('code')

      // Code typically has more tokens per character
      expect(codeRatio).toBeLessThanOrEqual(proseRatio)
    })

    it('should reflect current model settings', () => {
      TokenCounter.setModel('claude')
      const claudeRatio = TokenCounter.getTokenRatio('prose')

      TokenCounter.setModel('gpt-4')
      const gptRatio = TokenCounter.getTokenRatio('prose')

      // Claude has slightly different ratios
      expect(claudeRatio).not.toBe(gptRatio)
    })
  })

  describe('URL and number handling', () => {
    it('should handle URLs in text', () => {
      const textWithUrl = 'Check out https://example.com/very/long/path/to/resource for more info'
      const result = TokenCounter.countWithConfidence(textWithUrl)

      expect(result.count).toBeGreaterThan(0)
    })

    it('should handle long numbers', () => {
      const textWithNumbers = 'The order number is 1234567890 and the amount is 9876543210'
      const result = TokenCounter.countWithConfidence(textWithNumbers)

      expect(result.count).toBeGreaterThan(0)
    })
  })
})

describe('countTokensWithConfidence', () => {
  it('should be a convenience function for TokenCounter.countWithConfidence', () => {
    const text = 'Hello World'
    const result = countTokensWithConfidence(text)

    expect(result).toEqual(TokenCounter.countWithConfidence(text))
  })

  it('should accept optional model parameter', () => {
    const text = 'Hello World'
    const result = countTokensWithConfidence(text, 'claude')

    expect(result).toHaveProperty('count')
    expect(result).toHaveProperty('confidence')
  })
})
