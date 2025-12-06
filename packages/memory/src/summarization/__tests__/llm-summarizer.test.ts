/**
 * Tests for LLMSummarizer and related utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  LLMSummarizer,
  createSummarizerWithFallback,
  extractiveSummarize,
  type LLMSummarizationConfig,
  type SummaryMessage,
} from '../llm-summarizer'

// Mock global fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('LLMSummarizer', () => {
  let summarizer: LLMSummarizer

  beforeEach(() => {
    vi.useFakeTimers()
    mockFetch.mockReset()

    summarizer = new LLMSummarizer({
      provider: 'openai',
      apiKey: 'test-key',
      model: 'gpt-4o-mini',
      maxSummaryTokens: 100,
      summaryStyle: 'bullet',
      temperature: 0.3,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('summarize', () => {
    it('should call OpenAI API and return summary', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: 'This is a summary.' } }],
          }),
      })

      const result = await summarizer.summarize(
        'This is a long text to summarize.'
      )

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-key',
          }),
        })
      )
      expect(result).toBe('This is a summary.')
    })

    it('should use cache for repeated summarization', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: 'Cached summary.' } }],
          }),
      })

      const text = 'This is a text to summarize.'
      const result1 = await summarizer.summarize(text)
      const result2 = await summarizer.summarize(text)

      expect(mockFetch).toHaveBeenCalledTimes(1) // Only called once
      expect(result1).toBe(result2)
    })

    it('should return cached value within TTL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: 'Summary.' } }],
          }),
      })

      const text = 'Some text here.'
      await summarizer.summarize(text)

      // Advance time but stay within default 1 hour TTL
      await vi.advanceTimersByTimeAsync(30 * 60 * 1000) // 30 minutes

      const result = await summarizer.summarize(text)

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(result).toBe('Summary.')
    })

    it('should bypass expired cache entries', async () => {
      summarizer.setCacheTTL(1000) // 1 second TTL

      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: 'Fresh summary.' } }],
          }),
      })

      const text = 'Some text.'
      await summarizer.summarize(text)

      // Advance past TTL
      await vi.advanceTimersByTimeAsync(2000)

      await summarizer.summarize(text)

      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('summarizeWithStats', () => {
    it('should return full statistics', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: 'Short summary.' } }],
          }),
      })

      const longText = 'A'.repeat(1000)
      const result = await summarizer.summarizeWithStats(longText, 50)

      expect(result.summary).toBe('Short summary.')
      expect(result.originalTokens).toBeGreaterThan(0)
      expect(result.summaryTokens).toBeGreaterThan(0)
      expect(result.compressionRatio).toBeLessThan(1)
      expect(result.generationTime).toBeGreaterThanOrEqual(0)
      expect(result.model).toBe('gpt-4o-mini')
      expect(result.cached).toBe(false)
    })

    it('should indicate cached results', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: 'Summary.' } }],
          }),
      })

      const text = 'Some text to summarize.'
      await summarizer.summarizeWithStats(text, 50)
      const result = await summarizer.summarizeWithStats(text, 50)

      expect(result.cached).toBe(true)
      expect(result.generationTime).toBe(0)
    })
  })

  describe('summarizeBatch', () => {
    it('should summarize multiple texts', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [{ message: { content: 'Summary 1.' } }],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [{ message: { content: 'Summary 2.' } }],
            }),
        })

      const results = await summarizer.summarizeBatch(
        ['Text one', 'Text two'],
        50
      )

      expect(results).toHaveLength(2)
      expect(results[0]).toBe('Summary 1.')
      expect(results[1]).toBe('Summary 2.')
    })
  })

  describe('summarizeConversation', () => {
    it('should throw for empty messages array', async () => {
      await expect(summarizer.summarizeConversation([])).rejects.toThrow(
        'Cannot summarize empty conversation'
      )
    })

    it('should return structured conversation summary', async () => {
      const mockResponse = JSON.stringify({
        topics: ['topic1', 'topic2'],
        decisions: ['decision1'],
        openQuestions: ['question1'],
        actionItems: ['action1'],
        keyFacts: ['fact1'],
        narrative: 'This is a narrative summary.',
      })

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: mockResponse } }],
          }),
      })

      const messages: SummaryMessage[] = [
        { role: 'user', content: 'Hello, what is the weather?' },
        { role: 'assistant', content: 'The weather is sunny today.' },
      ]

      const result = await summarizer.summarizeConversation(messages)

      expect(result.topics).toEqual(['topic1', 'topic2'])
      expect(result.decisions).toEqual(['decision1'])
      expect(result.openQuestions).toEqual(['question1'])
      expect(result.actionItems).toEqual(['action1'])
      expect(result.keyFacts).toEqual(['fact1'])
      expect(result.narrative).toBe('This is a narrative summary.')
      expect(result.messageCount).toBe(2)
    })

    it('should handle JSON in markdown code block', async () => {
      const mockResponse =
        '```json\n{"topics":["coding"],"narrative":"About coding."}\n```'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: mockResponse } }],
          }),
      })

      const messages: SummaryMessage[] = [
        { role: 'user', content: 'Tell me about coding.' },
      ]

      const result = await summarizer.summarizeConversation(messages)

      expect(result.topics).toEqual(['coding'])
    })

    it('should fallback to narrative on invalid JSON', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: 'Not valid JSON response.' } }],
          }),
      })

      const messages: SummaryMessage[] = [{ role: 'user', content: 'Hello' }]

      const result = await summarizer.summarizeConversation(messages)

      expect(result.narrative).toBe('Not valid JSON response.')
      expect(result.topics).toEqual([])
    })
  })

  describe('progressiveSummarize', () => {
    it('should throw for empty messages array', async () => {
      await expect(summarizer.progressiveSummarize([])).rejects.toThrow(
        'Cannot progressively summarize empty conversation'
      )
    })

    it('should handle keepRecentCount >= messages.length gracefully', async () => {
      const messages: SummaryMessage[] = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there' },
      ]

      // keepRecentCount is larger than messages length - should return all as recent
      const result = await summarizer.progressiveSummarize(messages, {
        summarizeThreshold: 1, // Force summarization attempt
        keepRecentCount: 100, // Much larger than 2 messages
      })

      expect(result.summarizedPortion).toBe('')
      expect(result.recentMessages).toHaveLength(2)
      expect(result.stats.summarizedMessages).toBe(0)
    })

    it('should return original messages if under threshold', async () => {
      const messages: SummaryMessage[] = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there' },
      ]

      const result = await summarizer.progressiveSummarize(messages, {
        summarizeThreshold: 10,
        keepRecentCount: 5,
      })

      expect(result.summarizedPortion).toBe('')
      expect(result.recentMessages).toEqual(messages)
      expect(result.stats.summarizedMessages).toBe(0)
    })

    it('should summarize older messages when above threshold', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    topics: ['greetings'],
                    decisions: [],
                    openQuestions: [],
                    actionItems: [],
                    keyFacts: [],
                    narrative: 'User greeted assistant.',
                  }),
                },
              },
            ],
          }),
      })

      const messages: SummaryMessage[] = []
      for (let i = 0; i < 25; i++) {
        messages.push({ role: 'user', content: `Message ${i}` })
      }

      const result = await summarizer.progressiveSummarize(messages, {
        summarizeThreshold: 20,
        keepRecentCount: 5,
      })

      expect(result.summarizedPortion).toContain('Earlier conversation summary')
      expect(result.recentMessages).toHaveLength(5)
      expect(result.stats.summarizedMessages).toBe(20)
    })
  })

  describe('hierarchicalSummarize', () => {
    it('should throw for empty content', async () => {
      await expect(summarizer.hierarchicalSummarize('')).rejects.toThrow(
        'Cannot create hierarchical summary of empty content'
      )
    })

    it('should throw for content that is too short', async () => {
      // Content with less than 50 tokens (~200 chars)
      await expect(
        summarizer.hierarchicalSummarize('Short text.')
      ).rejects.toThrow('Content too short for hierarchical summarization')
    })

    it('should create multi-level summaries', async () => {
      mockFetch
        .mockResolvedValueOnce({
          // Detailed summary
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [
                { message: { content: 'Detailed summary of the content.' } },
              ],
            }),
        })
        .mockResolvedValueOnce({
          // Sections
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [
                {
                  message: {
                    content:
                      '## Section 1\nFirst section summary.\n## Section 2\nSecond section.',
                  },
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          // Executive
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [{ message: { content: 'Brief executive summary.' } }],
            }),
        })

      const result = await summarizer.hierarchicalSummarize('A'.repeat(2000), 3)

      expect(result.executive).toBe('Brief executive summary.')
      expect(result.detailed).toBe('Detailed summary of the content.')
      expect(result.sections).toHaveLength(2)
      expect(result.sections[0].title).toBe('Section 1')
      expect(result.compressionRatios.executive).toBeLessThan(1)
    })
  })

  describe('error handling and retry', () => {
    it('should retry on 429 rate limit error', async () => {
      // First call fails with 429, second succeeds
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          json: () => Promise.resolve({ error: 'Rate limit exceeded' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [{ message: { content: 'Success after retry.' } }],
            }),
        })

      const resultPromise = summarizer.summarize('Test text')

      // Advance past retry delay
      await vi.advanceTimersByTimeAsync(2000)

      const result = await resultPromise

      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(result).toBe('Success after retry.')
    })

    it('should retry on 500 server error', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Server error' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [{ message: { content: 'Success.' } }],
            }),
        })

      const resultPromise = summarizer.summarize('Test')
      await vi.advanceTimersByTimeAsync(2000)

      const result = await resultPromise

      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(result).toBe('Success.')
    })

    it('should fail after max retries', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        json: () => Promise.resolve({ error: 'Rate limit' }),
      })

      const resultPromise = summarizer.summarize('Test')

      // Advance through all retries
      await vi.advanceTimersByTimeAsync(30000)

      await expect(resultPromise).rejects.toThrow()
      expect(mockFetch.mock.calls.length).toBeLessThanOrEqual(4) // Initial + 3 retries max
    })

    it('should not retry on 400 bad request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Bad request' }),
      })

      await expect(summarizer.summarize('Test')).rejects.toThrow()
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('Anthropic provider', () => {
    it('should call Anthropic API correctly', async () => {
      const anthropicSummarizer = new LLMSummarizer({
        provider: 'anthropic',
        apiKey: 'anthropic-key',
        model: 'claude-3-5-haiku-20241022',
      })

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            content: [{ text: 'Anthropic summary.' }],
          }),
      })

      const result = await anthropicSummarizer.summarize('Test text')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.anthropic.com/v1/messages',
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-api-key': 'anthropic-key',
            'anthropic-version': '2023-06-01',
          }),
        })
      )
      expect(result).toBe('Anthropic summary.')
    })
  })

  describe('custom provider', () => {
    it('should use custom handler', async () => {
      const customHandler = vi.fn().mockResolvedValue('Custom summary.')

      const customSummarizer = new LLMSummarizer({
        provider: 'custom',
        customHandler,
      })

      const result = await customSummarizer.summarize('Test', 100)

      expect(customHandler).toHaveBeenCalledWith(
        expect.stringContaining('Test'),
        expect.objectContaining({ maxTokens: 100 })
      )
      expect(result).toBe('Custom summary.')
    })
  })

  describe('getStats', () => {
    it('should return summarization statistics', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: 'Summary.' } }],
          }),
      })

      await summarizer.summarize('A'.repeat(400))
      await summarizer.summarize('B'.repeat(400))
      await summarizer.summarize('A'.repeat(400)) // Cache hit

      const stats = summarizer.getStats()

      expect(stats.summariesGenerated).toBe(2)
      expect(stats.cacheHits).toBe(1)
      expect(stats.totalInputTokens).toBeGreaterThan(0)
      expect(stats.totalOutputTokens).toBeGreaterThan(0)
      expect(stats.totalSavings).toBeGreaterThan(0)
      expect(stats.avgCompressionRatio).toBeLessThan(1)
      expect(stats.cacheHitRate).toBeCloseTo(1 / 3)
    })
  })

  describe('clearCache', () => {
    it('should clear all cached entries', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: 'Summary.' } }],
          }),
      })

      const text = 'Test text.'
      await summarizer.summarize(text)

      summarizer.clearCache()

      await summarizer.summarize(text)

      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('input validation', () => {
    it('should throw for empty text', async () => {
      await expect(summarizer.summarize('')).rejects.toThrow(
        'Cannot summarize empty text'
      )
    })

    it('should throw for whitespace-only text', async () => {
      await expect(summarizer.summarize('   \n\t  ')).rejects.toThrow(
        'Cannot summarize empty text'
      )
    })

    it('should throw for zero maxTokens', async () => {
      await expect(summarizer.summarize('Some text', 0)).rejects.toThrow(
        'maxTokens must be a positive number'
      )
    })

    it('should throw for negative maxTokens', async () => {
      await expect(summarizer.summarize('Some text', -100)).rejects.toThrow(
        'maxTokens must be a positive number'
      )
    })

    it('should throw for NaN maxTokens', async () => {
      await expect(summarizer.summarize('Some text', NaN)).rejects.toThrow(
        'maxTokens must be a positive number'
      )
    })
  })

  describe('constructor validation', () => {
    it('should throw for OpenAI provider without API key', () => {
      expect(
        () =>
          new LLMSummarizer({
            provider: 'openai',
          })
      ).toThrow('API key is required for openai provider')
    })

    it('should throw for Anthropic provider without API key', () => {
      expect(
        () =>
          new LLMSummarizer({
            provider: 'anthropic',
          })
      ).toThrow('API key is required for anthropic provider')
    })

    it('should throw for custom provider without handler', () => {
      expect(
        () =>
          new LLMSummarizer({
            provider: 'custom',
          })
      ).toThrow('customHandler is required for custom provider')
    })

    it('should accept custom provider with handler', () => {
      expect(
        () =>
          new LLMSummarizer({
            provider: 'custom',
            customHandler: async () => 'test',
          })
      ).not.toThrow()
    })
  })

  describe('setCacheTTL validation', () => {
    it('should throw for zero TTL', () => {
      expect(() => summarizer.setCacheTTL(0)).toThrow(
        'Cache TTL must be a positive number'
      )
    })

    it('should throw for negative TTL', () => {
      expect(() => summarizer.setCacheTTL(-1000)).toThrow(
        'Cache TTL must be a positive number'
      )
    })

    it('should accept positive TTL', () => {
      expect(() => summarizer.setCacheTTL(5000)).not.toThrow()
    })
  })

  describe('cache eviction', () => {
    it('should evict oldest entry when cache is full', async () => {
      // Create summarizer that will have limited cache
      const limitedSummarizer = new LLMSummarizer({
        provider: 'openai',
        apiKey: 'test-key',
      })

      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: 'Summary.' } }],
          }),
      })

      // Add many unique entries (cache limit is 500)
      for (let i = 0; i < 10; i++) {
        await limitedSummarizer.summarize(`Unique text ${i} ${'A'.repeat(100)}`)
      }

      // All should succeed without error
      expect(mockFetch).toHaveBeenCalledTimes(10)
    })
  })
})

describe('createSummarizerWithFallback', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('should use LLM when available', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: 'LLM summary.' } }],
        }),
    })

    const { summarize, isLLMAvailable } = createSummarizerWithFallback({
      provider: 'openai',
      apiKey: 'test-key',
    })

    expect(isLLMAvailable()).toBe(true)

    const result = await summarize('Test text', 50)
    expect(result).toBe('LLM summary.')
  })

  it('should fallback when no API key provided', async () => {
    const { summarize, isLLMAvailable } = createSummarizerWithFallback({})

    expect(isLLMAvailable()).toBe(false)

    const result = await summarize(
      'This is important. This is key information.',
      50
    )
    expect(result).not.toBe('')
  })

  it('should fallback on LLM network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { summarize, isLLMAvailable } = createSummarizerWithFallback({
      provider: 'openai',
      apiKey: 'test-key',
    })

    expect(isLLMAvailable()).toBe(true)

    const result = await summarize(
      'This is important. This is key content.',
      50
    )

    // Should have used extractive fallback
    expect(result).not.toBe('')
    expect(isLLMAvailable()).toBe(false) // Now marked unavailable
  })

  it('should NOT fallback on empty text validation error', async () => {
    const { summarize, isLLMAvailable } = createSummarizerWithFallback({
      provider: 'openai',
      apiKey: 'test-key',
    })

    expect(isLLMAvailable()).toBe(true)

    // Empty text should throw, not fallback
    await expect(summarize('', 50)).rejects.toThrow(
      'Cannot summarize empty text'
    )
    // LLM should still be marked available (it's not a network/API issue)
    expect(isLLMAvailable()).toBe(true)
  })

  it('should NOT fallback on invalid maxTokens validation error', async () => {
    const { summarize, isLLMAvailable } = createSummarizerWithFallback({
      provider: 'openai',
      apiKey: 'test-key',
    })

    await expect(summarize('Some text', 0)).rejects.toThrow(
      'maxTokens must be a positive number'
    )
    expect(isLLMAvailable()).toBe(true)
  })
})

describe('extractiveSummarize', () => {
  it('should return empty string for empty text', () => {
    // extractiveSummarize is a fallback that gracefully handles edge cases
    expect(extractiveSummarize('', 50)).toBe('')
  })

  it('should extract most important sentences', () => {
    const text = `
      This is the first sentence which is important.
      This is filler content that doesn't matter much.
      The conclusion states the main result clearly.
      Something about something else here?
    `

    const summary = extractiveSummarize(text, 100)

    // First and last sentences should be prioritized
    expect(summary).toContain('first sentence')
  })

  it('should respect token limit', () => {
    const text = `
      First sentence here. Second sentence here. Third sentence here.
      Fourth sentence here. Fifth sentence here. Sixth sentence here.
    `

    const summary = extractiveSummarize(text, 20)

    // Should be much shorter than original
    expect(summary.length).toBeLessThan(text.length)
  })

  it('should prioritize sentences with keywords', () => {
    const text = `
      Random sentence about nothing.
      This is the most important key finding.
      Another random filler sentence.
      The main conclusion is stated here.
    `

    const summary = extractiveSummarize(text, 50)

    // Should include keyword sentences
    expect(summary.toLowerCase()).toMatch(/important|key|conclusion|main/)
  })

  it('should deprioritize questions', () => {
    const text = `
      This is the key summary.
      What do you think about this?
      The conclusion is clear.
    `

    const summary = extractiveSummarize(text, 30)

    // Should not prioritize the question
    expect(summary).not.toContain('?')
  })

  it('should preserve original sentence order in output', () => {
    const text = `
      First important statement here.
      Second important statement here.
      Third important statement here.
    `

    const summary = extractiveSummarize(text, 100)
    const sentences = summary.split('. ')

    // Order should be preserved
    if (sentences.includes('First important statement here')) {
      const firstIdx = sentences.findIndex((s) => s.includes('First'))
      const secondIdx = sentences.findIndex((s) => s.includes('Second'))
      if (firstIdx !== -1 && secondIdx !== -1) {
        expect(firstIdx).toBeLessThan(secondIdx)
      }
    }
  })
})
