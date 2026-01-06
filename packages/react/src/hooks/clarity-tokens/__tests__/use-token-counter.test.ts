import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTokenCounter } from '../use-token-counter'

// Mock the clarity-tokens package
vi.mock('@clarity-chat/clarity-tokens', () => ({
  countTokens: vi.fn((text: string) => Math.ceil(text.length / 4)),
  countChatTokens: vi.fn((messages: Array<{ content: string }>) =>
    messages.reduce((sum, msg) => sum + Math.ceil(msg.content.length / 4) + 4, 3)
  ),
  checkWithinLimit: vi.fn(
    (text: string, limit: number) => Math.ceil(text.length / 4) <= limit
  ),
  getModelConfig: vi.fn(() => ({
    contextWindow: 128000,
    inputPer1M: 2.5,
    outputPer1M: 10.0,
    encoding: 'o200k_base',
  })),
  getModelEncoding: vi.fn(() => 'o200k_base'),
}))

describe('useTokenCounter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() =>
        useTokenCounter({ model: 'gpt-4o' })
      )

      expect(result.current.tokenCount).toBe(0)
      expect(result.current.streamTokenCount).toBe(0)
      expect(result.current.modelMaxTokens).toBe(128000)
      expect(result.current.encodingName).toBe('o200k_base')
    })

    it('should provide countTokens function', () => {
      const { result } = renderHook(() =>
        useTokenCounter({ model: 'gpt-4o' })
      )

      expect(typeof result.current.countTokens).toBe('function')
    })
  })

  describe('token counting', () => {
    it('should count tokens synchronously', () => {
      const { result } = renderHook(() =>
        useTokenCounter({ model: 'gpt-4o' })
      )

      const count = result.current.countTokens('Hello, world!')
      expect(count).toBeGreaterThan(0)
    })

    it('should count chat message tokens', () => {
      const { result } = renderHook(() =>
        useTokenCounter({ model: 'gpt-4o' })
      )

      const messages = [
        { id: '1', role: 'user' as const, content: 'Hello!' },
        { id: '2', role: 'assistant' as const, content: 'Hi there!' },
      ]

      const count = result.current.countChatTokens(messages)
      expect(count).toBeGreaterThan(0)
    })
  })

  describe('reactive counting', () => {
    it('should update tokenCount with debounce', async () => {
      const { result } = renderHook(() =>
        useTokenCounter({ model: 'gpt-4o', debounceMs: 100 })
      )

      act(() => {
        result.current.setInput('Hello, this is a test message')
      })

      // Token count should not update immediately
      expect(result.current.tokenCount).toBe(0)

      // Advance timers past debounce
      await act(async () => {
        vi.advanceTimersByTime(150)
      })

      // Now it should be updated
      expect(result.current.tokenCount).toBeGreaterThan(0)
    })
  })

  describe('limit checking', () => {
    it('should check if text is within limit', () => {
      const { result } = renderHook(() =>
        useTokenCounter({ model: 'gpt-4o' })
      )

      expect(result.current.isWithinLimit('Short text', 100)).toBe(true)
    })
  })

  describe('streaming', () => {
    it('should count streaming tokens', () => {
      const { result } = renderHook(() =>
        useTokenCounter({ model: 'gpt-4o' })
      )

      act(() => {
        result.current.onStreamChunk('Hello ')
        result.current.onStreamChunk('world!')
      })

      expect(result.current.streamTokenCount).toBeGreaterThan(0)
    })

    it('should reset stream count', () => {
      const { result } = renderHook(() =>
        useTokenCounter({ model: 'gpt-4o' })
      )

      act(() => {
        result.current.onStreamChunk('Hello world!')
      })

      expect(result.current.streamTokenCount).toBeGreaterThan(0)

      act(() => {
        result.current.resetStreamCount()
      })

      expect(result.current.streamTokenCount).toBe(0)
    })
  })
})
