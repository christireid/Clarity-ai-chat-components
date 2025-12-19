/**
 * QA Battle Tests for Token Optimization Package
 *
 * Tests the implementation under stress conditions:
 * - Long conversations
 * - High message volume
 * - Large tool schemas
 * - Edge cases and failures
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  AccurateTokenCounter,
  ChatMessage,
} from '../tokenizers/accurate-counter'
import { TextChunker, ChunkingStrategy } from '../chunking/text-chunker'

describe('QA Battle Tests', () => {
  describe('AccurateTokenCounter Stress Tests', () => {
    let counter: AccurateTokenCounter

    beforeEach(() => {
      counter = new AccurateTokenCounter({
        model: 'gpt-4o',
        enableCaching: true,
        enableMonitoring: true,
        cacheSize: 1000,
      })
    })

    it('should handle very long text (100KB+)', () => {
      // Generate ~100KB of text (~25,000 tokens)
      const longText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(2000)

      const start = performance.now()
      const tokens = counter.count(longText)
      const duration = performance.now() - start

      expect(tokens).toBeGreaterThan(10000)
      expect(duration).toBeLessThan(5000) // Should complete within 5 seconds
    })

    it('should handle high-volume batch counting (1000 items)', () => {
      const texts = Array(1000).fill(
        'This is a test message for batch processing.'
      )

      const start = performance.now()
      const total = counter.countBatch(texts)
      const duration = performance.now() - start

      expect(total).toBeGreaterThan(5000)
      expect(duration).toBeLessThan(10000) // Should complete within 10 seconds
    })

    it('should handle long conversations (100+ messages)', () => {
      const messages: ChatMessage[] = Array(100)
        .fill(null)
        .map((_, i) => ({
          role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
          content: `This is message number ${i + 1} in a very long conversation thread.`,
        }))

      const start = performance.now()
      const tokens = counter.countChat(messages)
      const duration = performance.now() - start

      expect(tokens).toBeGreaterThan(500)
      expect(duration).toBeLessThan(2000)
    })

    it('should handle large tool schemas (JSON with nested objects)', () => {
      const largeSchema = JSON.stringify({
        tools: Array(50)
          .fill(null)
          .map((_, i) => ({
            name: `tool_${i}`,
            description: `This is a tool for performing operation ${i}`,
            parameters: {
              type: 'object',
              properties: {
                input: { type: 'string', description: 'Input parameter' },
                options: {
                  type: 'object',
                  properties: {
                    flag1: { type: 'boolean' },
                    flag2: { type: 'boolean' },
                    nested: {
                      type: 'object',
                      properties: {
                        deep1: { type: 'string' },
                        deep2: { type: 'number' },
                      },
                    },
                  },
                },
              },
            },
          })),
      })

      const tokens = counter.count(largeSchema)
      expect(tokens).toBeGreaterThan(1000)
    })

    it('should handle repeated isWithinLimit checks efficiently', () => {
      const text = 'This is a test message for limit checking. '.repeat(100)

      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        counter.isWithinLimit(text, 1000)
      }
      const duration = performance.now() - start

      expect(duration).toBeLessThan(5000)
    })

    it('should handle cache pressure gracefully', () => {
      // Generate more unique texts than cache size
      const uniqueTexts = Array(1500)
        .fill(null)
        .map(
          (_, i) =>
            `Unique text number ${i} with some additional content to make it different.`
        )

      // Count all texts (should cause cache evictions)
      uniqueTexts.forEach((text) => counter.count(text))

      const stats = counter.getCacheStats()
      expect(stats.size).toBeLessThanOrEqual(1000) // Should not exceed cache limit
    })

    it('should handle unicode and emoji-heavy text', () => {
      const unicodeText =
        '你好世界 🌍🎉🚀 مرحبا بالعالم こんにちは世界 '.repeat(100)

      const tokens = counter.count(unicodeText)
      expect(tokens).toBeGreaterThan(100)
    })

    it('should handle code blocks and special characters', () => {
      const codeText = `
        function example() {
          const x = { a: 1, b: "test" };
          return x.a + x.b.length;
        }

        // Comments with special chars: @#$%^&*()
        const regex = /[a-z]+\\d+/gi;
        const template = \`Hello \${name}\`;
      `.repeat(100)

      const tokens = counter.count(codeText)
      expect(tokens).toBeGreaterThan(500)
    })

    it('should handle whitespace-heavy text', () => {
      const whitespaceText =
        '   \n\n\t   word   \n\n   another   \t\t   '.repeat(500)

      const tokens = counter.count(whitespaceText)
      expect(tokens).toBeGreaterThan(100)
    })

    it('should handle empty and null-like inputs gracefully', () => {
      expect(counter.count('')).toBe(0)
      expect(counter.count(null as any)).toBe(0)
      expect(counter.count(undefined as any)).toBe(0)
      expect(counter.countBatch([])).toBe(0)
      expect(counter.countChat([])).toBe(0)
    })
  })

  describe('TextChunker Stress Tests', () => {
    it('should chunk very long documents efficiently', () => {
      const chunker = TextChunker.balanced()
      const longDoc = 'This is paragraph content. '.repeat(10000)

      const start = performance.now()
      const result = chunker.chunk(longDoc)
      const duration = performance.now() - start

      expect(result.chunks.length).toBeGreaterThan(10)
      expect(duration).toBeLessThan(10000)
    })

    it('should handle all strategy presets with large documents', () => {
      const longDoc = 'Sentence with many words. '.repeat(5000)

      const preciseResult = TextChunker.precise().chunk(longDoc)
      const balancedResult = TextChunker.balanced().chunk(longDoc)
      const contextResult = TextChunker.context().chunk(longDoc)

      // Precise should create more chunks (smaller size)
      expect(preciseResult.chunks.length).toBeGreaterThan(
        balancedResult.chunks.length
      )
      expect(balancedResult.chunks.length).toBeGreaterThan(
        contextResult.chunks.length
      )
    })

    it('should maintain chunk integrity with overlap', () => {
      const chunker = new TextChunker({
        maxTokens: 100,
        overlapPercentage: 0.2,
      })
      const text =
        'Word number one. Word number two. Word number three. '.repeat(100)

      const result = chunker.chunk(text)

      // Check all chunks have valid positions
      result.chunks.forEach((chunk, i) => {
        expect(chunk.startPosition).toBeGreaterThanOrEqual(0)
        expect(chunk.endPosition).toBeGreaterThan(chunk.startPosition)
        expect(chunk.tokenCount).toBeGreaterThan(0)

        // Non-first chunks should have overlap
        if (i > 0) {
          expect(chunk.metadata.overlapTokens).toBeGreaterThan(0)
        }
      })
    })

    it('should handle mixed content documents', () => {
      const mixedDoc = `
# Title

This is regular paragraph text.

\`\`\`javascript
function test() {
  return "hello";
}
\`\`\`

| Column1 | Column2 |
|---------|---------|
| data1   | data2   |

- List item 1
- List item 2
- List item 3

> Blockquote text here

---

More paragraphs...
      `.repeat(100)

      const chunker = TextChunker.balanced()
      const result = chunker.chunk(mixedDoc)

      expect(result.chunks.length).toBeGreaterThan(5)
      result.chunks.forEach((chunk) => {
        expect(chunk.text.length).toBeGreaterThan(0)
      })
    })

    it('should estimate chunk counts accurately', () => {
      const chunker = new TextChunker({ maxTokens: 200 })
      const text = 'Test word content. '.repeat(500)

      const estimated = chunker.estimateChunkCount(text)
      const actual = chunker.chunk(text).totalChunks

      // Estimation should be within 50% of actual
      expect(Math.abs(estimated - actual)).toBeLessThan(actual * 0.5)
    })

    it('should handle edge case configurations', () => {
      // Very small chunks
      const tinyChunker = new TextChunker({
        maxTokens: 10,
        overlapPercentage: 0.1,
      })
      const result1 = tinyChunker.chunk('Small text here.')
      expect(result1.chunks.length).toBeGreaterThan(0)

      // Very large chunks
      const largeChunker = new TextChunker({
        maxTokens: 10000,
        overlapPercentage: 0.3,
      })
      const result2 = largeChunker.chunk('Large chunk test text. '.repeat(100))
      expect(result2.chunks.length).toBeGreaterThan(0)

      // Zero overlap - overhead should be minimal (may not be exactly 0 due to chunking algorithm)
      const noOverlapChunker = new TextChunker({
        maxTokens: 100,
        overlapPercentage: 0,
      })
      const result3 = noOverlapChunker.chunk('No overlap test. '.repeat(50))
      expect(result3.overheadPercentage).toBeLessThan(5) // Minimal overhead expected
    })

    it('should correctly detect chunking needs', () => {
      const chunker = new TextChunker({ maxTokens: 50 })

      expect(chunker.needsChunking('Short')).toBe(false)
      // Use a much longer text to ensure it exceeds 50 tokens
      const longText =
        'This is a very long sentence with many words that we need to make sure exceeds the fifty token limit by quite a significant margin. '.repeat(
          5
        )
      expect(chunker.needsChunking(longText)).toBe(true)
    })
  })

  describe('Integration Stress Tests', () => {
    it('should work together in a real-world scenario', () => {
      const counter = new AccurateTokenCounter({
        model: 'gpt-4o',
        enableCaching: true,
      })

      const chunker = TextChunker.balanced()

      // Simulate processing a large document
      const document = 'Long document content. '.repeat(2000)

      // Check if chunking is needed
      const needsChunking = chunker.needsChunking(document)
      expect(needsChunking).toBe(true)

      // Chunk the document
      const result = chunker.chunk(document)

      // Count tokens for each chunk using the counter
      let totalVerifiedTokens = 0
      result.chunks.forEach((chunk) => {
        const tokens = counter.count(chunk.text)
        totalVerifiedTokens += tokens
        // Verify chunk token count matches counter
        expect(Math.abs(tokens - chunk.tokenCount)).toBeLessThan(5) // Allow small variance
      })

      expect(totalVerifiedTokens).toBeGreaterThan(1000)
    })

    it('should handle concurrent-like operations', async () => {
      const counter = new AccurateTokenCounter({
        model: 'gpt-4o',
        enableCaching: true,
      })

      // Simulate concurrent counting
      const promises = Array(100)
        .fill(null)
        .map(async (_, i) => {
          const text = `Concurrent text number ${i} with some content.`
          return counter.count(text)
        })

      const results = await Promise.all(promises)
      results.forEach((count) => {
        expect(count).toBeGreaterThan(0)
      })
    })
  })
})
