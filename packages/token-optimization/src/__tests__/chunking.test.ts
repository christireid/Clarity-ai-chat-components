/**
 * Tests for TextChunker
 */

import { describe, it, expect } from 'vitest'
import { TextChunker, ChunkingStrategy } from '../chunking/text-chunker'

describe('TextChunker', () => {
  describe('Basic Chunking', () => {
    it('should chunk text into smaller pieces', () => {
      const chunker = new TextChunker({ strategy: ChunkingStrategy.BALANCED })
      const text = 'This is a long piece of text. '.repeat(100)

      const result = chunker.chunk(text)

      expect(result.chunks.length).toBeGreaterThan(1)
      expect(result.totalChunks).toBe(result.chunks.length)
      expect(result.originalTokens).toBeGreaterThan(0)
    })

    it('should handle empty text', () => {
      const chunker = new TextChunker()
      const result = chunker.chunk('')

      expect(result.chunks).toEqual([])
      expect(result.totalChunks).toBe(0)
      expect(result.totalTokens).toBe(0)
    })

    it('should not chunk short text', () => {
      const chunker = new TextChunker({ maxTokens: 1000 })
      const shortText = 'This is a short text.'

      const result = chunker.chunk(shortText)

      expect(result.chunks.length).toBe(1)
      expect(result.chunks[0].text).toBe(shortText)
    })

    it('should provide chunk metadata', () => {
      const chunker = new TextChunker({ strategy: ChunkingStrategy.PRECISE })
      const text = 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.'

      const result = chunker.chunk(text)

      for (const chunk of result.chunks) {
        expect(chunk.index).toBeGreaterThanOrEqual(0)
        expect(chunk.startPosition).toBeGreaterThanOrEqual(0)
        expect(chunk.endPosition).toBeGreaterThan(chunk.startPosition)
        expect(chunk.tokenCount).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('Strategy Presets', () => {
    it('should use PRECISE strategy correctly', () => {
      const chunker = TextChunker.precise()
      const config = chunker.getConfig()

      expect(config.maxTokens).toBe(256)
      expect(config.overlapPercentage).toBe(0.1)
    })

    it('should use BALANCED strategy correctly', () => {
      const chunker = TextChunker.balanced()
      const config = chunker.getConfig()

      expect(config.maxTokens).toBe(512)
      expect(config.overlapPercentage).toBe(0.15)
    })

    it('should use CONTEXT strategy correctly', () => {
      const chunker = TextChunker.context()
      const config = chunker.getConfig()

      expect(config.maxTokens).toBe(1024)
      expect(config.overlapPercentage).toBe(0.2)
    })
  })

  describe('Utility Methods', () => {
    it('should estimate chunk count', () => {
      const chunker = new TextChunker({ maxTokens: 100 })
      const text = 'Word '.repeat(200)

      const estimated = chunker.estimateChunkCount(text)

      expect(estimated).toBeGreaterThan(1)
    })

    it('should detect when chunking is needed', () => {
      const chunker = new TextChunker({ maxTokens: 10 })

      expect(chunker.needsChunking('Short')).toBe(false)
      expect(
        chunker.needsChunking(
          'This is a longer text that exceeds the token limit'
        )
      ).toBe(true)
    })

    it('should return simple string array', () => {
      const chunker = new TextChunker({ maxTokens: 50 })
      const text = 'Sentence one. Sentence two. Sentence three. '.repeat(10)

      const strings = chunker.chunkToStrings(text)

      expect(Array.isArray(strings)).toBe(true)
      strings.forEach((s) => {
        expect(typeof s).toBe('string')
      })
    })
  })

  describe('Configuration', () => {
    it('should create new chunker with updated config', () => {
      const original = new TextChunker({ maxTokens: 256 })
      const modified = original.withConfig({ maxTokens: 512 })

      expect(original.getConfig().maxTokens).toBe(256)
      expect(modified.getConfig().maxTokens).toBe(512)
    })

    it('should use custom configuration', () => {
      const chunker = new TextChunker({
        strategy: ChunkingStrategy.CUSTOM,
        maxTokens: 300,
        minTokens: 50,
        overlapPercentage: 0.25,
      })

      const config = chunker.getConfig()

      expect(config.maxTokens).toBe(300)
      expect(config.minTokens).toBe(50)
      expect(config.overlapPercentage).toBe(0.25)
    })
  })

  describe('Edge Cases', () => {
    it('should handle text with only whitespace', () => {
      const chunker = new TextChunker()
      const result = chunker.chunk('   \n\n   ')

      expect(result.chunks).toEqual([])
    })

    it('should handle very long text', () => {
      const chunker = new TextChunker({ maxTokens: 100 })
      const longText = 'Lorem ipsum dolor sit amet. '.repeat(1000)

      const result = chunker.chunk(longText)

      expect(result.chunks.length).toBeGreaterThan(10)
      expect(result.overheadPercentage).toBeGreaterThan(0) // Should have overlap overhead
    })

    it('should handle text with special characters', () => {
      const chunker = new TextChunker()
      const text = 'Hello! @#$% 世界 🌍 Special chars: <>&"'

      expect(() => chunker.chunk(text)).not.toThrow()
    })

    it('should handle multilingual text', () => {
      const chunker = new TextChunker({ maxTokens: 50 })
      const text = 'English text. 日本語のテキスト. Русский текст. العربية'

      const result = chunker.chunk(text)

      expect(result.originalTokens).toBeGreaterThan(0)
    })
  })

  describe('Overlap Behavior', () => {
    it('should include overlap in subsequent chunks', () => {
      const chunker = new TextChunker({
        maxTokens: 50,
        overlapPercentage: 0.2,
      })
      const text =
        'Sentence number one. Sentence number two. Sentence number three. '.repeat(
          10
        )

      const result = chunker.chunk(text)

      if (result.chunks.length > 1) {
        // Second chunk should have overlap metadata
        expect(result.chunks[1].metadata.overlapTokens).toBeGreaterThan(0)
      }
    })

    it('should calculate overhead percentage', () => {
      const chunker = new TextChunker({
        maxTokens: 50,
        overlapPercentage: 0.2,
      })
      const text = 'Word '.repeat(200)

      const result = chunker.chunk(text)

      // With 20% overlap, there should be some overhead
      if (result.chunks.length > 1) {
        expect(result.overheadPercentage).toBeGreaterThan(0)
      }
    })
  })
})
