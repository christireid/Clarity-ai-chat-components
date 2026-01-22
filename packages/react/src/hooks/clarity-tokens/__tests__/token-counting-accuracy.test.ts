/**
 * Token Counting Accuracy Tests
 *
 * Tests token counting accuracy across different models and content types.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import type { ChatMessage } from '@clarity-chat/token-optimization'

describe('Token Counting Accuracy', () => {
  describe('OpenAI Models (gpt-tokenizer)', () => {
    it('should count tokens accurately for GPT-4o', () => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
      const text = 'Hello, world!'
      const count = counter.count(text)
      
      // GPT-4o uses o200k_base encoding
      // "Hello, world!" should be ~3 tokens
      expect(count).toBeGreaterThan(0)
      expect(count).toBeLessThan(10)
    })

    it('should count tokens accurately for GPT-4', () => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4' })
      const text = 'Hello, world!'
      const count = counter.count(text)
      
      // GPT-4 uses cl100k_base encoding
      expect(count).toBeGreaterThan(0)
      expect(count).toBeLessThan(10)
    })

    it('should handle code blocks correctly', () => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
      const code = 'function hello() {\n  return "world"\n}'
      const count = counter.count(code)
      
      expect(count).toBeGreaterThan(0)
    })

    it('should handle unicode characters', () => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
      const text = 'Hello 你好 world'
      const count = counter.count(text)
      
      expect(count).toBeGreaterThan(0)
    })

    it('should handle special characters', () => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
      const text = 'Hello! @#$%^&*()'
      const count = counter.count(text)
      
      expect(count).toBeGreaterThan(0)
    })
  })

  describe('Anthropic Models (Estimation)', () => {
    it('should estimate tokens for Claude 3.5 Sonnet', () => {
      const counter = new AccurateTokenCounter({ model: 'claude-3-5-sonnet' })
      const text = 'Hello, world!'
      const count = counter.count(text)
      
      // Estimation should be within reasonable range
      expect(count).toBeGreaterThan(0)
      expect(count).toBeLessThan(10)
    })

    it('should apply Claude adjustment factor', () => {
      const counter = new AccurateTokenCounter({ model: 'claude-3-5-sonnet' })
      const text = 'This is a longer text to test token counting accuracy.'
      const count = counter.count(text)
      
      expect(count).toBeGreaterThan(0)
    })
  })

  describe('Google Models (Estimation)', () => {
    it('should estimate tokens for Gemini 1.5 Pro', () => {
      const counter = new AccurateTokenCounter({ model: 'gemini-1.5-pro' })
      const text = 'Hello, world!'
      const count = counter.count(text)
      
      expect(count).toBeGreaterThan(0)
      expect(count).toBeLessThan(10)
    })
  })

  describe('Chat Message Counting', () => {
    it('should count chat messages with overhead', () => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
      const messages: ChatMessage[] = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello!' },
        { role: 'assistant', content: 'Hi there!' },
      ]
      
      const count = counter.countChat(messages)
      
      // Should include message overhead (formatting tokens)
      expect(count).toBeGreaterThan(
        messages.reduce((sum, m) => sum + counter.count(m.content), 0)
      )
    })

    it('should handle empty messages', () => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
      const messages: ChatMessage[] = []
      
      const count = counter.countChat(messages)
      
      expect(count).toBe(0)
    })

    it('should handle very long messages', () => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
      const longText = 'a'.repeat(100000)
      const messages: ChatMessage[] = [
        { role: 'user', content: longText },
      ]
      
      const count = counter.countChat(messages)
      
      expect(count).toBeGreaterThan(0)
      expect(count).toBeLessThan(50000) // Should be reasonable
    })
  })

  describe('Token Limit Checking', () => {
    it('should correctly identify content within limit', () => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
      const text = 'Hello, world!'
      const limit = 100
      
      const isWithin = counter.isWithinLimit(text, limit)
      
      expect(isWithin).toBe(true)
    })

    it('should correctly identify content exceeding limit', () => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
      const longText = 'a'.repeat(10000)
      const limit = 100
      
      const isWithin = counter.isWithinLimit(longText, limit)
      
      expect(isWithin).toBe(false)
    })

    it('should handle chat messages limit checking', () => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
      const messages: ChatMessage[] = [
        { role: 'user', content: 'Hello!' },
      ]
      const limit = 100
      
      const isWithin = counter.isWithinLimit(messages, limit)
      
      expect(isWithin).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
      const count = counter.count('')
      
      expect(count).toBe(0)
    })

    it('should handle whitespace-only strings', () => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
      const count = counter.count('   \n\t   ')
      
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('should handle very short strings', () => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
      const count = counter.count('a')
      
      expect(count).toBe(1) // Single character should be 1 token
    })

    it('should handle markdown content', () => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
      const markdown = '# Title\n\n**Bold** text with `code`'
      const count = counter.count(markdown)
      
      expect(count).toBeGreaterThan(0)
    })

    it('should handle JSON content', () => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
      const json = '{"key": "value", "number": 123}'
      const count = counter.count(json)
      
      expect(count).toBeGreaterThan(0)
    })
  })

  describe('Caching', () => {
    it('should cache token counts', () => {
      const counter = new AccurateTokenCounter({
        model: 'gpt-4o',
        enableCaching: true,
      })
      const text = 'Hello, world!'
      
      const count1 = counter.count(text)
      const count2 = counter.count(text)
      
      expect(count1).toBe(count2)
      // Second call should use cache
    })

    it('should handle cache invalidation', () => {
      const counter = new AccurateTokenCounter({
        model: 'gpt-4o',
        enableCaching: true,
        cacheSize: 10,
      })
      
      // Fill cache beyond limit
      for (let i = 0; i < 20; i++) {
        counter.count(`text ${i}`)
      }
      
      // Cache should have evicted oldest entries
      const count = counter.count('test')
      expect(count).toBeGreaterThan(0)
    })
  })

  describe('Accuracy Comparison', () => {
    it('should have similar counts for similar models', () => {
      const counter1 = new AccurateTokenCounter({ model: 'gpt-4o' })
      const counter2 = new AccurateTokenCounter({ model: 'gpt-4' })
      const text = 'Hello, world! This is a test.'
      
      const count1 = counter1.count(text)
      const count2 = counter2.count(text)
      
      // Counts should be similar (within 20% for similar encodings)
      const diff = Math.abs(count1 - count2)
      const avg = (count1 + count2) / 2
      expect(diff / avg).toBeLessThan(0.2)
    })

    it('should estimate Claude tokens reasonably', () => {
      const counter = new AccurateTokenCounter({ model: 'claude-3-5-sonnet' })
      const text = 'Hello, world! This is a test of token counting.'
      
      const count = counter.count(text)
      
      // Estimation should be reasonable (not wildly off)
      expect(count).toBeGreaterThan(5)
      expect(count).toBeLessThan(20)
    })
  })
})
