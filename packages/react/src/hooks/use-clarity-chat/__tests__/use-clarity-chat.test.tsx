/**
 * Tests for useClarityChat hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useClarityChat } from '../use-clarity-chat'
import type { UseClarityChatOptions } from '../types'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock the underlying useChat hook
vi.mock('../../use-chat-enhanced', () => ({
  useChat: vi.fn(() => ({
    messages: [],
    append: vi.fn(),
    setMessages: vi.fn(),
    input: '',
    setInput: vi.fn(),
    isLoading: false,
    error: undefined,
    reload: vi.fn(),
    stop: vi.fn(),
  })),
}))

describe('useClarityChat', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should throw error when api is not provided', () => {
      expect(() => {
        renderHook(() => useClarityChat({} as UseClarityChatOptions))
      }).toThrow('api')
    })

    it('should throw error when api is empty string', () => {
      expect(() => {
        renderHook(() => useClarityChat({ api: '' }))
      }).toThrow('api')
    })

    it('should initialize successfully with valid api', () => {
      const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))

      expect(result.current).toBeDefined()
      expect(result.current.messages).toBeDefined()
      expect(result.current.append).toBeDefined()
      expect(result.current.memoryInfo).toBeDefined()
    })

    it('should have default memoryInfo when memory is not enabled', () => {
      const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))

      expect(result.current.memoryInfo.enabled).toBe(false)
      expect(result.current.memoryInfo.memoryCount).toBe(0)
    })
  })

  describe('memoryInfo', () => {
    it('should report memory as disabled when MemoryProvider is not available', () => {
      // Note: memoryInfo.enabled is only true when BOTH memory.enabled AND memoryContext.service exist
      // Without MemoryProvider, memoryContext is null, so enabled will be false
      const { result } = renderHook(() =>
        useClarityChat({
          api: '/api/chat',
          memory: { enabled: true },
        })
      )

      // Without MemoryProvider, memoryInfo.enabled is false
      expect(result.current.memoryInfo.enabled).toBe(false)
    })

    it('should report memory as disabled by default', () => {
      const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))

      expect(result.current.memoryInfo.enabled).toBe(false)
    })

    it('should accept strategy option when memory is enabled', () => {
      // The hook accepts the strategy option - strategy is passed through options
      const { result } = renderHook(() =>
        useClarityChat({
          api: '/api/chat',
          memory: { enabled: true, strategy: 'vector-store' },
        })
      )

      // memoryInfo.enabled is only true when BOTH memory.enabled AND memoryContext.service exist
      // without MemoryProvider, memoryContext is null, so enabled will be false
      expect(result.current.memoryInfo.enabled).toBe(false)
      expect(result.current.memoryInfo.memoryCount).toBe(0)
    })
  })

  describe('memoryErrorInfo', () => {
    it('should have null error initially', () => {
      const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))

      expect(result.current.memoryErrorInfo.memoryError).toBeNull()
      expect(result.current.memoryErrorInfo.memoryErrorOperation).toBeNull()
      expect(result.current.memoryErrorInfo.memoryErrorType).toBeNull()
    })
  })

  describe('transport configuration', () => {
    it('should default to SSE transport', () => {
      const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))

      // The hook should work without specifying transport
      expect(result.current).toBeDefined()
    })

    it('should accept websocket transport', () => {
      const { result } = renderHook(() =>
        useClarityChat({
          api: '/api/chat',
          transport: 'websocket',
        })
      )

      expect(result.current).toBeDefined()
    })

    it('should accept sse transport', () => {
      const { result } = renderHook(() =>
        useClarityChat({
          api: '/api/chat',
          transport: 'sse',
        })
      )

      expect(result.current).toBeDefined()
    })
  })

  describe('prompt optimization', () => {
    it('should not have tokenStats when promptOptimization is disabled', () => {
      const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))

      // tokenStats is optional when optimization is not enabled
      expect(result.current.tokenStats).toBeUndefined()
    })

    it('should accept promptOptimization options', () => {
      const { result } = renderHook(() =>
        useClarityChat({
          api: '/api/chat',
          promptOptimization: {
            enabled: true,
            targetTokens: 4000,
            strategy: 'sliding-window',
          },
        })
      )

      expect(result.current).toBeDefined()
    })
  })

  describe('without MemoryProvider', () => {
    it('should work without MemoryProvider when memory is disabled', () => {
      const { result } = renderHook(() =>
        useClarityChat({
          api: '/api/chat',
          memory: { enabled: false },
        })
      )

      expect(result.current).toBeDefined()
      expect(result.current.memoryInfo.enabled).toBe(false)
    })

    it('should gracefully handle missing MemoryProvider when memory is enabled', () => {
      // Hook should work even without MemoryProvider, just memory features won't work
      const { result } = renderHook(() =>
        useClarityChat({
          api: '/api/chat',
          memory: { enabled: true },
        })
      )

      expect(result.current).toBeDefined()
      // memoryInfo.enabled is false because memoryContext.service is not available
      expect(result.current.memoryInfo.enabled).toBe(false)
      expect(result.current.memoryInfo.memoryCount).toBe(0)
    })
  })

  describe('return type', () => {
    it('should return all expected properties', () => {
      const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))

      // Core chat properties
      expect(result.current.messages).toBeDefined()
      expect(result.current.append).toBeDefined()
      expect(result.current.setMessages).toBeDefined()
      expect(result.current.input).toBeDefined()
      expect(result.current.setInput).toBeDefined()
      expect(result.current.isLoading).toBeDefined()

      // Clarity-specific properties
      expect(result.current.memoryInfo).toBeDefined()
      expect(result.current.memoryErrorInfo).toBeDefined()
    })

    it('should have correct memoryInfo shape', () => {
      const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))

      expect(result.current.memoryInfo).toHaveProperty('memoryCount')
      expect(result.current.memoryInfo).toHaveProperty('enabled')
    })

    it('should have correct memoryErrorInfo shape', () => {
      const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))

      expect(result.current.memoryErrorInfo).toHaveProperty('memoryError')
      expect(result.current.memoryErrorInfo).toHaveProperty(
        'memoryErrorOperation'
      )
      expect(result.current.memoryErrorInfo).toHaveProperty('memoryErrorType')
    })
  })
})
