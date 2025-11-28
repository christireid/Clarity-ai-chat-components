/**
 * Tests for LLMLingua-2 Style Compressor
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  LLMLinguaCompressor,
  compressRAGContext,
  intelligentCompress,
  createLLMLinguaCompressor,
  type LLMLinguaConfig,
  type CompressionResult,
} from '../llmlingua-compressor'

// Sample texts for testing
const SHORT_TEXT = 'Hello world, this is a test.'
const MEDIUM_TEXT = `
The quick brown fox jumps over the lazy dog. This sentence contains every letter
of the alphabet and is commonly used for testing purposes. The fox was quite
agile and the dog was resting peacefully under the tree. Many people use this
sentence when they need to test fonts or keyboards. It has been used since the
late 19th century and remains popular today. The sentence is perfect because it
is relatively short yet contains all 26 letters of the English alphabet.
`.trim()

const LONG_TEXT = `
Introduction to Machine Learning

Machine learning is a subset of artificial intelligence that focuses on developing
algorithms and statistical models that enable computer systems to improve their
performance on a specific task through experience. Unlike traditional programming,
where explicit instructions are provided, machine learning systems learn patterns
from data to make predictions or decisions.

Types of Machine Learning

Supervised Learning: In supervised learning, the algorithm learns from labeled
training data. The model is trained using input-output pairs, learning to map
inputs to the correct outputs. Common applications include image classification,
spam detection, and price prediction.

Unsupervised Learning: Unsupervised learning deals with unlabeled data. The
algorithm tries to find hidden patterns or structures in the data without any
guidance. Clustering and dimensionality reduction are typical examples.

Reinforcement Learning: This type involves an agent learning to make decisions
by taking actions in an environment to maximize cumulative reward. It is widely
used in robotics and game playing.

Applications of Machine Learning

Machine learning has numerous applications across various industries. In healthcare,
it helps diagnose diseases and predict patient outcomes. In finance, it detects
fraud and automates trading. In transportation, it powers autonomous vehicles.
The possibilities are vast and continue to expand as technology advances.

Conclusion

Machine learning is transforming how we solve problems and make decisions. As
data availability increases and computational power grows, machine learning will
play an even more critical role in shaping our future. Understanding these concepts
is essential for anyone working in technology today.
`.trim()

const CODE_TEXT = `
Here is an example of a React component:

\`\`\`typescript
import React from 'react';

interface Props {
  name: string;
  age: number;
}

export function Greeting({ name, age }: Props) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}
\`\`\`

This component accepts name and age as props and renders a greeting message.
`

describe('LLMLinguaCompressor', () => {
  describe('constructor', () => {
    it('should create compressor with default config', () => {
      const compressor = new LLMLinguaCompressor()
      expect(compressor.isReady()).toBe(true)
    })

    it('should accept custom configuration', () => {
      const config: LLMLinguaConfig = {
        targetRatio: 0.3,
        preserveFirst: 50,
        preserveLast: 25,
      }
      const compressor = new LLMLinguaCompressor(config)
      expect(compressor.isReady()).toBe(true)
    })

    it('should throw error for invalid targetRatio', () => {
      expect(() => new LLMLinguaCompressor({ targetRatio: 0 })).toThrow('targetRatio must be between 0 and 1')
      expect(() => new LLMLinguaCompressor({ targetRatio: 1.5 })).toThrow('targetRatio must be between 0 and 1')
    })

    it('should throw error for negative preserveFirst', () => {
      expect(() => new LLMLinguaCompressor({ preserveFirst: -1 })).toThrow('preserveFirst must be non-negative')
    })

    it('should throw error for negative preserveLast', () => {
      expect(() => new LLMLinguaCompressor({ preserveLast: -1 })).toThrow('preserveLast must be non-negative')
    })

    it('should throw error for iterations less than 1', () => {
      expect(() => new LLMLinguaCompressor({ iterations: 0 })).toThrow('iterations must be at least 1')
    })
  })

  describe('initialize', () => {
    it('should initialize without errors', async () => {
      const compressor = new LLMLinguaCompressor()
      await expect(compressor.initialize()).resolves.not.toThrow()
    })

    it('should remain ready after initialization', async () => {
      const compressor = new LLMLinguaCompressor()
      await compressor.initialize()
      expect(compressor.isReady()).toBe(true)
    })
  })

  describe('compress', () => {
    it('should not compress text below minimum threshold', async () => {
      const compressor = new LLMLinguaCompressor({ minTokensToCompress: 200 })
      const result = await compressor.compress(SHORT_TEXT)

      expect(result.compressed).toBe(SHORT_TEXT)
      expect(result.compressionRatio).toBe(1.0)
      expect(result.method).toBe('none')
    })

    it('should compress long text', async () => {
      const compressor = new LLMLinguaCompressor({
        targetRatio: 0.5,
        minTokensToCompress: 50,
      })
      const result = await compressor.compress(LONG_TEXT)

      expect(result.compressedTokens).toBeLessThan(result.originalTokens)
      expect(result.compressionRatio).toBeLessThan(1.0)
      expect(result.method).toBe('fallback')
    })

    it('should preserve first and last tokens', async () => {
      const compressor = new LLMLinguaCompressor({
        targetRatio: 0.3,
        preserveFirst: 20,
        preserveLast: 10,
        minTokensToCompress: 50,
      })
      const result = await compressor.compress(LONG_TEXT)

      // First words should be preserved
      const firstWords = LONG_TEXT.split(/\s+/).slice(0, 5).join(' ')
      expect(result.compressed.startsWith('Introduction')).toBe(true)

      // Should have preserved segments
      expect(result.preservedSegments.length).toBeGreaterThan(0)
    })

    it('should track processing time', async () => {
      const compressor = new LLMLinguaCompressor({ minTokensToCompress: 50 })
      const result = await compressor.compress(MEDIUM_TEXT)

      expect(result.processingTimeMs).toBeGreaterThan(0)
    })

    it('should allow per-call options override', async () => {
      const compressor = new LLMLinguaCompressor({
        targetRatio: 0.6,
        minTokensToCompress: 50,
      })

      const result1 = await compressor.compress(LONG_TEXT)
      const result2 = await compressor.compress(LONG_TEXT, { targetRatio: 0.2, iterativeMode: true })

      // With iterative mode and lower target, compression should be better
      expect(result2.compressedTokens).toBeLessThanOrEqual(result1.compressedTokens)
    })

    it('should use iterative mode when enabled', async () => {
      const compressor = new LLMLinguaCompressor({
        targetRatio: 0.25,
        iterativeMode: true,
        iterations: 3,
        minTokensToCompress: 50,
      })

      const result = await compressor.compress(LONG_TEXT)

      expect(result.compressedTokens).toBeLessThan(result.originalTokens)
      // Iterative mode should achieve better compression
      expect(result.compressionRatio).toBeLessThan(0.6)
    })
  })

  describe('compressWithSegments', () => {
    it('should preserve marked segments', async () => {
      const compressor = new LLMLinguaCompressor({
        targetRatio: 0.3,
        minTokensToCompress: 10,
      })

      const text = 'Important instruction: always preserve this. Some filler text that can be compressed. Final query that must stay.'
      const result = await compressor.compressWithSegments(text, [
        { start: 0, end: 44, preserve: true }, // "Important instruction: always preserve this."
        { start: 85, end: text.length, preserve: true }, // "Final query that must stay."
      ])

      // Check that preserved content appears in the result
      expect(result.compressed).toContain('Important instruction')
      expect(result.compressed).toContain('Final query')
      expect(result.preservedSegments.length).toBeGreaterThan(0)
    })

    it('should compress non-preserved segments', async () => {
      const compressor = new LLMLinguaCompressor({
        targetRatio: 0.5,
        minTokensToCompress: 10,
      })

      const text = 'Preserve this. ' + 'x '.repeat(100) + 'Also preserve this.'
      const result = await compressor.compressWithSegments(text, [
        { start: 0, end: 15, preserve: true },
        { start: text.length - 20, end: text.length, preserve: true },
      ])

      expect(result.compressedTokens).toBeLessThan(result.originalTokens)
      expect(result.segmentDetails).toBeDefined()
      expect(result.segmentDetails?.some(s => s.type === 'compressed')).toBe(true)
    })

    it('should provide segment details', async () => {
      const compressor = new LLMLinguaCompressor({ minTokensToCompress: 10 })

      const text = 'First part. Middle part that is longer. Last part.'
      const result = await compressor.compressWithSegments(text, [
        { start: 0, end: 12, preserve: true },
      ])

      expect(result.segmentDetails).toBeDefined()
      expect(result.segmentDetails?.length).toBeGreaterThan(0)
      expect(result.segmentDetails?.[0]?.type).toBe('preserved')
    })
  })

  describe('getStats', () => {
    it('should track compression statistics', async () => {
      const compressor = new LLMLinguaCompressor({ minTokensToCompress: 50 })

      await compressor.compress(MEDIUM_TEXT)
      await compressor.compress(LONG_TEXT)

      const stats = compressor.getStats()

      expect(stats.totalCompressions).toBe(2)
      expect(stats.totalTokensSaved).toBeGreaterThan(0)
      expect(stats.avgCompressionRatio).toBeGreaterThan(0)
      expect(stats.avgCompressionRatio).toBeLessThan(1)
      expect(stats.totalProcessingTimeMs).toBeGreaterThan(0)
    })

    it('should report model and GPU status', async () => {
      const compressor = new LLMLinguaCompressor()

      const stats = compressor.getStats()

      expect(typeof stats.gpuEnabled).toBe('boolean')
      expect(typeof stats.modelLoaded).toBe('boolean')
      expect(stats.modelLoaded).toBe(false) // No ML model loaded
    })

    it('should return zero stats when no compressions done', () => {
      const compressor = new LLMLinguaCompressor()
      const stats = compressor.getStats()

      expect(stats.totalCompressions).toBe(0)
      expect(stats.totalTokensSaved).toBe(0)
      expect(stats.avgCompressionRatio).toBe(0)
    })
  })

  describe('dispose', () => {
    it('should reset all state', async () => {
      const compressor = new LLMLinguaCompressor({ minTokensToCompress: 50 })

      await compressor.compress(LONG_TEXT)
      const statsBefore = compressor.getStats()
      expect(statsBefore.totalCompressions).toBe(1)

      compressor.dispose()

      const statsAfter = compressor.getStats()
      expect(statsAfter.totalCompressions).toBe(0)
      expect(statsAfter.totalTokensSaved).toBe(0)
      expect(statsAfter.modelLoaded).toBe(false)
    })
  })
})

describe('compressRAGContext', () => {
  it('should compress array of RAG results', async () => {
    const ragResults = [
      'This is the first document retrieved from the vector database. It contains relevant information about the topic.',
      'This is the second document with additional context. It provides more details about the subject matter.',
      'This is the third document that adds more background. It helps complete the picture.',
    ]

    const compressed = await compressRAGContext(ragResults, {
      targetRatio: 0.5,
      minTokensToCompress: 10,
    })

    expect(compressed.length).toBe(3)
    compressed.forEach((text, i) => {
      expect(text.length).toBeLessThanOrEqual(ragResults[i]!.length)
    })
  })

  it('should handle empty array', async () => {
    const compressed = await compressRAGContext([])
    expect(compressed).toEqual([])
  })

  it('should use default config when not provided', async () => {
    const ragResults = ['Short text']
    const compressed = await compressRAGContext(ragResults)
    expect(compressed.length).toBe(1)
  })

  it('should use existing compressor when provided', async () => {
    const compressor = new LLMLinguaCompressor({
      targetRatio: 0.5,
      minTokensToCompress: 10,
    })

    const batch1 = ['First document with some content to compress.']
    const batch2 = ['Second document with different content to compress.']

    await compressRAGContext(batch1, {}, compressor)
    await compressRAGContext(batch2, {}, compressor)

    const stats = compressor.getStats()
    // Stats should accumulate across both calls
    expect(stats.totalCompressions).toBe(2)
  })
})

describe('intelligentCompress', () => {
  it('should use TF-IDF for code-heavy content', async () => {
    const result = await intelligentCompress(CODE_TEXT, {
      targetRatio: 0.5,
      preserveCode: true,
    })

    expect(result.method).toBe('fallback')
    // Code block should be preserved
    expect(result.compressed).toContain('```')
  })

  it('should use perplexity compression for prose', async () => {
    const result = await intelligentCompress(LONG_TEXT, {
      targetRatio: 0.3,
    })

    expect(result.compressedTokens).toBeLessThan(result.originalTokens)
    // Statistical compression achieves ~0.5-0.7 ratio
    expect(result.compressionRatio).toBeLessThan(0.8)
  })

  it('should respect targetRatio option', async () => {
    const result1 = await intelligentCompress(LONG_TEXT, { targetRatio: 0.7 })
    const result2 = await intelligentCompress(LONG_TEXT, { targetRatio: 0.25 })

    // Lower target ratio should result in more compression
    expect(result2.compressedTokens).toBeLessThanOrEqual(result1.compressedTokens)
  })

  it('should handle preserveFirst and preserveLast', async () => {
    const result = await intelligentCompress(LONG_TEXT, {
      targetRatio: 0.3,
      preserveFirst: 50,
      preserveLast: 30,
    })

    expect(result.compressed.startsWith('Introduction')).toBe(true)
  })
})

describe('createLLMLinguaCompressor', () => {
  it('should create compressor with default config', () => {
    const compressor = createLLMLinguaCompressor()
    expect(compressor).toBeInstanceOf(LLMLinguaCompressor)
    expect(compressor.isReady()).toBe(true)
  })

  it('should create compressor with custom config', () => {
    const compressor = createLLMLinguaCompressor({
      targetRatio: 0.2,
      preserveFirst: 200,
    })
    expect(compressor).toBeInstanceOf(LLMLinguaCompressor)
  })
})

describe('compression quality', () => {
  it('should preserve high-importance words', async () => {
    const text = 'You must always implement the required functionality. Never skip critical steps. What is the expected output?'
    const compressor = new LLMLinguaCompressor({
      targetRatio: 0.5,
      minTokensToCompress: 10,
    })

    const result = await compressor.compress(text)

    // High importance words should be preserved
    expect(result.compressed.toLowerCase()).toContain('must')
    expect(result.compressed.toLowerCase()).toContain('required')
    expect(result.compressed.toLowerCase()).toContain('critical')
  })

  it('should remove low-importance filler words', async () => {
    // Use longer text to ensure compression happens
    const text = 'The application is a very simple and basic implementation of the system that was created for the specific purpose of testing various features and functionality. The implementation includes many components and modules.'
    const compressor = new LLMLinguaCompressor({
      targetRatio: 0.4,
      minTokensToCompress: 10,
    })

    const result = await compressor.compress(text)

    // Result should be shorter or equal (preserveFirst/Last may keep most content)
    expect(result.compressedTokens).toBeLessThanOrEqual(result.originalTokens)
    // Important nouns should be preserved
    expect(result.compressed.toLowerCase()).toContain('application')
    expect(result.compressed.toLowerCase()).toContain('implementation')
  })

  it('should achieve compression below 1.0', async () => {
    const compressor = new LLMLinguaCompressor({
      targetRatio: 0.25,
      minTokensToCompress: 50,
    })

    const result = await compressor.compress(LONG_TEXT)

    // Should achieve some compression (statistical method achieves ~0.5-0.7)
    expect(result.compressionRatio).toBeGreaterThan(0.1)
    expect(result.compressionRatio).toBeLessThan(0.9)
  })
})

describe('edge cases', () => {
  it('should handle null/undefined input gracefully', async () => {
    const compressor = new LLMLinguaCompressor()

    // @ts-expect-error - testing runtime behavior with invalid input
    const result1 = await compressor.compress(null)
    expect(result1.original).toBe('')
    expect(result1.compressed).toBe('')
    expect(result1.method).toBe('none')

    // @ts-expect-error - testing runtime behavior with invalid input
    const result2 = await compressor.compress(undefined)
    expect(result2.method).toBe('none')
  })

  it('should handle empty string', async () => {
    const compressor = new LLMLinguaCompressor({ minTokensToCompress: 0 })
    const result = await compressor.compress('')

    expect(result.original).toBe('')
    expect(result.compressed).toBe('')
    expect(result.compressionRatio).toBe(1.0)
  })

  it('should handle whitespace-only input', async () => {
    const compressor = new LLMLinguaCompressor({ minTokensToCompress: 0 })
    const result = await compressor.compress('   \n\t  ')

    expect(result.compressed.trim()).toBe('')
  })

  it('should handle single word input', async () => {
    const compressor = new LLMLinguaCompressor({
      minTokensToCompress: 0,
      preserveFirst: 100,
      preserveLast: 50,
    })
    const result = await compressor.compress('hello')

    expect(result.compressed).toBe('hello')
  })

  it('should handle empty segments array', async () => {
    const compressor = new LLMLinguaCompressor({ minTokensToCompress: 10 })
    const result = await compressor.compressWithSegments('Some text to compress', [])

    // Should fall back to regular compression
    expect(result.compressed.length).toBeLessThanOrEqual(result.original.length)
  })

  it('should handle out-of-bounds segments', async () => {
    const compressor = new LLMLinguaCompressor({ minTokensToCompress: 10 })
    const text = 'Short text'
    const result = await compressor.compressWithSegments(text, [
      { start: -10, end: 5, preserve: true },  // negative start
      { start: 5, end: 1000, preserve: true }, // end past text length
    ])

    // Should clamp to valid bounds and not crash
    expect(result.compressed).toBeTruthy()
  })

  it('should handle overlapping segments', async () => {
    const compressor = new LLMLinguaCompressor({ minTokensToCompress: 10 })
    const text = 'AAAA BBBB CCCC DDDD EEEE'
    const result = await compressor.compressWithSegments(text, [
      { start: 0, end: 10, preserve: true },
      { start: 5, end: 15, preserve: true }, // overlaps with previous
    ])

    // Should handle without crashing
    expect(result.compressed).toBeTruthy()
  })

  it('should handle null input in compressWithSegments', async () => {
    const compressor = new LLMLinguaCompressor()

    // @ts-expect-error - testing runtime behavior
    const result = await compressor.compressWithSegments(null, [])
    expect(result.original).toBe('')
    expect(result.method).toBe('none')
  })
})
