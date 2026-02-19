/**
 * @vitest-environment node
 *
 * Tests for streaming utilities including demo mode fallback
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  streamFromDemo,
  getStreamingFunction,
  getStreamingFunctionWithRouting,
  classifyQueryComplexity,
  checkRateLimit,
  estimateMessageTokens,
  validateRequest,
  handleStreamError,
  withRetry,
} from '../streaming'
import { LIBRARY_STATS } from '../../library-stats'

describe('streaming utilities', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetAllMocks()
    process.env = { ...originalEnv }
    // Clear all API keys for demo mode tests
    delete process.env.OPENAI_API_KEY
    delete process.env.ANTHROPIC_API_KEY
    delete process.env.GEMINI_API_KEY
  })

  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  describe('streamFromDemo', () => {
    it('returns welcoming default response for unknown queries', async () => {
      const messages = [{ role: 'user', content: 'random unknown query xyz' }]
      const chunks: string[] = []

      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'text' && chunk.content) {
          chunks.push(chunk.content)
        }
      }

      const response = chunks.join('')
      expect(response).toContain('Welcome to Clarity Chat Demo Mode')
      expect(response).toContain('Quick Links')
      expect(response).toContain('/guides/quick-start')
    })

    it('includes token count footer in demo responses', async () => {
      const messages = [{ role: 'user', content: 'How do I install?' }]
      const chunks: string[] = []

      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'text' && chunk.content) {
          chunks.push(chunk.content)
        }
      }

      const response = chunks.join('')
      expect(response).toContain('Demo Mode Stats')
      expect(response).toContain('input tokens')
      expect(response).toContain('output tokens')
    })

    it('yields thinking chunk with metadata', async () => {
      const messages = [{ role: 'user', content: 'How do I install?' }]
      let thinkingChunk: { type: string; data?: unknown } | null = null

      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'thinking') {
          thinkingChunk = chunk
        }
      }

      expect(thinkingChunk).not.toBeNull()
      const data = thinkingChunk?.data as Record<string, unknown>
      expect(data).toHaveProperty('demoMode', true)
      expect(data).toHaveProperty('matchedTopic', 'install')
      expect(data).toHaveProperty('tokenEstimate')
    })

    it('responds to getting started queries', async () => {
      const messages = [{ role: 'user', content: 'Help with getting started' }]
      const chunks: string[] = []

      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'text' && chunk.content) {
          chunks.push(chunk.content)
        }
      }

      const response = chunks.join('')
      expect(response).toContain('npm install @clarity-chat/react')
      expect(response).toContain('Quick Start Guide')
    })

    it('responds to installation queries', async () => {
      const messages = [
        { role: 'user', content: 'How do I install the package?' },
      ]
      const chunks: string[] = []

      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'text' && chunk.content) {
          chunks.push(chunk.content)
        }
      }

      const response = chunks.join('')
      expect(response).toContain('npm')
      expect(response).toContain('yarn')
      expect(response).toContain('pnpm')
    })

    it('responds to streaming queries', async () => {
      const messages = [{ role: 'user', content: 'How does streaming work?' }]
      const chunks: string[] = []

      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'text' && chunk.content) {
          chunks.push(chunk.content)
        }
      }

      const response = chunks.join('')
      expect(response).toContain('Server-Sent Events')
      expect(response).toContain('SSE')
    })

    it('responds to component queries', async () => {
      const messages = [
        { role: 'user', content: 'What components are available?' },
      ]
      const chunks: string[] = []

      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'text' && chunk.content) {
          chunks.push(chunk.content)
        }
      }

      const response = chunks.join('')
      expect(response).toContain(
        `${LIBRARY_STATS.components} pre-built components`
      )
      expect(response).toContain('ChatWindow')
      expect(response).toContain('MessageList')
    })

    it('responds to hook queries', async () => {
      const messages = [{ role: 'user', content: 'What hooks are available?' }]
      const chunks: string[] = []

      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'text' && chunk.content) {
          chunks.push(chunk.content)
        }
      }

      const response = chunks.join('')
      expect(response).toContain(`${LIBRARY_STATS.hooks} custom hooks`)
      expect(response).toContain('useClarityChat')
    })

    it('responds to theme queries', async () => {
      const messages = [
        { role: 'user', content: 'How do I customize the theme?' },
      ]
      const chunks: string[] = []

      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'text' && chunk.content) {
          chunks.push(chunk.content)
        }
      }

      const response = chunks.join('')
      expect(response).toContain('11 built-in themes')
      expect(response).toContain('CSS variables')
    })

    it('responds to memory queries', async () => {
      const messages = [
        { role: 'user', content: 'How do I manage conversation memory?' },
      ]
      const chunks: string[] = []

      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'text' && chunk.content) {
          chunks.push(chunk.content)
        }
      }

      const response = chunks.join('')
      expect(response).toContain('MemoryProvider')
      expect(response).toContain('sliding-window')
    })

    it('responds to token queries', async () => {
      const messages = [
        { role: 'user', content: 'How can I optimize token usage?' },
      ]
      const chunks: string[] = []

      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'text' && chunk.content) {
          chunks.push(chunk.content)
        }
      }

      const response = chunks.join('')
      expect(response).toContain('useTokenBudgetMonitor')
      expect(response).toContain('50-80%')
    })

    it('responds to accessibility queries', async () => {
      const messages = [{ role: 'user', content: 'Is the library accessible?' }]
      const chunks: string[] = []

      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'text' && chunk.content) {
          chunks.push(chunk.content)
        }
      }

      const response = chunks.join('')
      expect(response).toContain('WCAG 2.1 AAA')
      expect(response).toContain('keyboard navigation')
    })

    it('responds to error handling queries', async () => {
      const messages = [{ role: 'user', content: 'How do I handle errors?' }]
      const chunks: string[] = []

      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'text' && chunk.content) {
          chunks.push(chunk.content)
        }
      }

      const response = chunks.join('')
      expect(response).toContain('ErrorBoundary')
      expect(response).toContain('useErrorRecovery')
    })

    it('responds to testing queries', async () => {
      const messages = [{ role: 'user', content: 'How do I test my chat?' }]
      const chunks: string[] = []

      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'text' && chunk.content) {
          chunks.push(chunk.content)
        }
      }

      const response = chunks.join('')
      expect(response).toContain('@testing-library/react')
    })

    it('responds to example queries', async () => {
      const messages = [{ role: 'user', content: 'Show me some examples' }]
      const chunks: string[] = []

      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'text' && chunk.content) {
          chunks.push(chunk.content)
        }
      }

      const response = chunks.join('')
      expect(response).toContain('30+ ready-to-use examples')
      expect(response).toContain('Examples Gallery')
    })

    it('responds to performance queries', async () => {
      const messages = [
        { role: 'user', content: 'How can I optimize performance?' },
      ]
      const chunks: string[] = []

      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'text' && chunk.content) {
          chunks.push(chunk.content)
        }
      }

      const response = chunks.join('')
      expect(response).toContain('Virtual scrolling')
      expect(response).toContain('VirtualizedMessageList')
    })

    it('streams response in chunks with delays', async () => {
      const messages = [{ role: 'user', content: 'How do I install?' }]
      let chunkCount = 0

      const startTime = Date.now()
      for await (const chunk of streamFromDemo(messages)) {
        if (chunk.type === 'text') {
          chunkCount++
        }
      }
      const elapsed = Date.now() - startTime

      // Should have multiple chunks
      expect(chunkCount).toBeGreaterThan(1)
      // Should have delays between chunks (at least some time elapsed)
      expect(elapsed).toBeGreaterThan(50)
    })
  })

  describe('getStreamingFunction', () => {
    it('returns streamFromDemo when no API keys configured', () => {
      delete process.env.OPENAI_API_KEY
      delete process.env.ANTHROPIC_API_KEY
      delete process.env.GEMINI_API_KEY

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const fn = getStreamingFunction()

      expect(fn).toBe(streamFromDemo)
      expect(consoleSpy).toHaveBeenCalledWith(
        '⚠️  No API keys configured - using demo mode'
      )
    })

    it('returns appropriate function when OpenAI key is set', () => {
      process.env.OPENAI_API_KEY = 'test-key'
      process.env.AI_MODEL = 'gpt-4-turbo-preview'

      const fn = getStreamingFunction()

      expect(fn.name).toBe('streamFromOpenAI')
    })

    it('returns Claude function when Anthropic key is set and model is claude', () => {
      process.env.ANTHROPIC_API_KEY = 'test-key'
      process.env.AI_MODEL = 'claude-3-5-sonnet-20241022'

      const fn = getStreamingFunction()

      expect(fn.name).toBe('streamFromClaude')
    })

    it('returns Gemini function when Gemini key is set and model is gemini', () => {
      process.env.GEMINI_API_KEY = 'test-key'
      process.env.AI_MODEL = 'gemini-1.5-flash'

      const fn = getStreamingFunction()

      expect(fn.name).toBe('streamFromGemini')
    })
  })

  describe('getStreamingFunctionWithRouting', () => {
    it('returns demo mode with classification when no API keys', () => {
      const result = getStreamingFunctionWithRouting('What is Clarity Chat?')

      expect(result.model).toBe('demo')
      expect(result.streamFn).toBe(streamFromDemo)
      expect(result.classification).toBeDefined()
      expect(result.classification.complexity).toBeDefined()
    })

    it('respects forceModel config', () => {
      process.env.OPENAI_API_KEY = 'test-key'

      const result = getStreamingFunctionWithRouting('Test query', 0, {
        forceModel: 'gpt-3.5-turbo',
      })

      expect(result.model).toBe('gpt-3.5-turbo')
    })

    it('routes simple queries to cheaper models', () => {
      process.env.OPENAI_API_KEY = 'test-key'

      const result = getStreamingFunctionWithRouting('What is ChatWindow?', 0, {
        optimizeForCost: true,
      })

      expect(result.classification.complexity).toBe('simple')
      expect(result.model).toBe('gpt-3.5-turbo')
    })
  })

  describe('classifyQueryComplexity', () => {
    it('classifies simple queries correctly', () => {
      const result = classifyQueryComplexity('What is ChatWindow?')
      expect(result.complexity).toBe('simple')
    })

    it('classifies complex queries correctly', () => {
      const result = classifyQueryComplexity(
        'How do I implement a complete chat system with streaming, memory, and authentication?'
      )
      expect(result.complexity).toBe('complex')
    })

    it('considers conversation length in complexity', () => {
      const shortConv = classifyQueryComplexity('Continue', 2)
      const longConv = classifyQueryComplexity('Continue', 15)

      expect(longConv.complexity).not.toBe('simple')
    })

    it('detects code in queries', () => {
      const withCode = classifyQueryComplexity(
        'Why does this code fail? ```const x = 1```'
      )
      expect(withCode.complexity).not.toBe('simple')
    })

    it('returns estimated tokens', () => {
      const result = classifyQueryComplexity('Test query')
      expect(result.estimatedTokens).toBeGreaterThan(0)
    })
  })

  describe('checkRateLimit', () => {
    it('allows requests within limit', () => {
      const result = checkRateLimit('test-user', 10, 60000)
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(9)
    })

    it('blocks requests over limit', () => {
      const identifier = 'rate-limit-test'

      // Make max requests
      for (let i = 0; i < 5; i++) {
        checkRateLimit(identifier, 5, 60000)
      }

      // Next should be blocked
      const result = checkRateLimit(identifier, 5, 60000)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('resets after window expires', async () => {
      const identifier = 'reset-test'

      // Fill the limit with a very short window
      for (let i = 0; i < 3; i++) {
        checkRateLimit(identifier, 3, 50) // 50ms window
      }

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Should be allowed again
      const result = checkRateLimit(identifier, 3, 50)
      expect(result.allowed).toBe(true)
    })
  })

  describe('estimateMessageTokens', () => {
    it('estimates tokens from character count', () => {
      const messages = [{ role: 'user', content: 'Hello world!' }] // 12 chars
      const tokens = estimateMessageTokens(messages)
      expect(tokens).toBe(3) // 12 / 4 = 3
    })

    it('handles multiple messages', () => {
      const messages = [
        { role: 'user', content: 'Hello' }, // 5 chars
        { role: 'assistant', content: 'Hi there!' }, // 9 chars
        { role: 'user', content: 'Thanks' }, // 6 chars
      ] // Total: 20 chars
      const tokens = estimateMessageTokens(messages)
      expect(tokens).toBe(5) // 20 / 4 = 5
    })

    it('handles empty messages', () => {
      const tokens = estimateMessageTokens([])
      expect(tokens).toBe(0)
    })
  })

  describe('validateRequest', () => {
    it('rejects empty messages', () => {
      const result = validateRequest([])
      expect(result.valid).toBe(false)
      expect(result.error).toBe('No messages provided')
    })

    it('rejects if last message is not from user', () => {
      const result = validateRequest([
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi!' },
      ])
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Last message must be from user')
    })

    it('rejects requests exceeding token limit', () => {
      const longContent = 'x'.repeat(50000) // Way over default limit
      const result = validateRequest([{ role: 'user', content: longContent }])
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Request too large')
    })

    it('accepts valid requests', () => {
      const result = validateRequest([{ role: 'user', content: 'Hello!' }])
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  describe('handleStreamError', () => {
    it('handles rate limit errors', () => {
      const error = Object.assign(new Error('Rate limited'), { status: 429 })
      const result = handleStreamError(error)

      expect(result.type).toBe('error')
      expect(result.content).toContain('Rate limit')
    })

    it('handles auth errors', () => {
      const error = Object.assign(new Error('Unauthorized'), { status: 401 })
      const result = handleStreamError(error)

      expect(result.type).toBe('error')
      expect(result.content).toContain('Authentication')
    })

    it('handles generic errors', () => {
      const error = new Error('Something went wrong')
      const result = handleStreamError(error)

      expect(result.type).toBe('error')
      expect(result.content).toBe('Something went wrong')
    })

    it('handles non-Error objects', () => {
      const result = handleStreamError('string error')

      expect(result.type).toBe('error')
      expect(result.content).toBe('An unexpected error occurred')
    })
  })

  describe('withRetry', () => {
    it('returns result on success', async () => {
      const fn = vi.fn().mockResolvedValue('success')
      const result = await withRetry(fn, 3, 10)

      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('retries on failure', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const result = await withRetry(fn, 3, 10)

      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(3)
      consoleSpy.mockRestore()
    })

    it('throws after max retries', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('always fails'))
      vi.spyOn(console, 'warn').mockImplementation(() => {})

      await expect(withRetry(fn, 2, 10)).rejects.toThrow('always fails')
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })
})
