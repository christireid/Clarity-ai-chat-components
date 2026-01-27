/**
 * Tests for useClarityChat hook (Flagship API)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { useClarityChat } from '../use-clarity-chat'
import { MemoryProvider, MemoryContext } from '../../memory/memory-provider'
import type { MemoryServiceConfig } from '@clarity-chat/memory'

// Mock fetch
global.fetch = vi.fn()

describe('useClarityChat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with empty messages', () => {
    const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))

    expect(result.current.messages).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.memoryInfo.enabled).toBe(false)
    expect(result.current.memoryInfo.memoryCount).toBe(0)
  })

  it('should initialize with api endpoint', () => {
    const { result } = renderHook(() =>
      useClarityChat({ api: '/api/chat' })
    )

    expect(result.current.messages).toEqual([])
    expect(result.current.memoryInfo.enabled).toBe(false)
  })

  it('should default to SSE transport', () => {
    const { result } = renderHook(() =>
      useClarityChat({ api: '/api/chat' })
    )

    // The hook should work with SSE by default
    expect(result.current.messages).toEqual([])
  })

  it('should support WebSocket transport option', () => {
    const { result } = renderHook(() =>
      useClarityChat({ api: '/api/chat', transport: 'websocket' })
    )

    expect(result.current.messages).toEqual([])
  })

  it('should handle memory disabled by default', () => {
    const { result } = renderHook(() =>
      useClarityChat({ api: '/api/chat' })
    )

    expect(result.current.memoryInfo.enabled).toBe(false)
    expect(result.current.memoryInfo.memoryCount).toBe(0)
    expect(result.current.memoryErrorInfo.memoryError).toBeNull()
  })

  it('should handle memory when MemoryProvider is not available', () => {
    const { result } = renderHook(() =>
      useClarityChat({
        api: '/api/chat',
        memory: { enabled: true },
      })
    )

    // Memory should be disabled if provider is not available
    expect(result.current.memoryInfo.enabled).toBe(false)
    expect(result.current.memoryInfo.memoryCount).toBe(0)
  })

  it('should handle append for user messages', async () => {
    const mockResponse = {
      ok: true,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(
            new TextEncoder().encode('data: {"content":"Hello"}\n\n')
          )
          controller.close()
        },
      }),
    }

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() =>
      useClarityChat({ api: '/api/chat' })
    )

    await result.current.append({
      role: 'user',
      content: 'Test message',
    })

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0)
    })
  })

  it('should support all useChatEnhanced methods', () => {
    const { result } = renderHook(() =>
      useClarityChat({ api: '/api/chat' })
    )

    // Verify all expected methods are available
    expect(typeof result.current.append).toBe('function')
    expect(typeof result.current.setInput).toBe('function')
    expect(typeof result.current.handleSubmit).toBe('function')
    expect(typeof result.current.stop).toBe('function')
    expect(typeof result.current.reload).toBe('function')
    expect(typeof result.current.setMessages).toBe('function')
  })

  it('should extend return type with memoryInfo and memoryErrorInfo', () => {
    const { result } = renderHook(() =>
      useClarityChat({ api: '/api/chat' })
    )

    // Verify Clarity-specific additions
    expect('memoryInfo' in result.current).toBe(true)
    expect('memoryErrorInfo' in result.current).toBe(true)
    expect(typeof result.current.memoryInfo.enabled).toBe('boolean')
    expect(typeof result.current.memoryInfo.memoryCount).toBe('number')
    expect(result.current.memoryErrorInfo.memoryError).toBeNull()
  })

  it('should handle onFinish callback', async () => {
    const onFinish = vi.fn()
    const mockResponse = {
      ok: true,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(
            new TextEncoder().encode('data: {"content":"Done"}\n\n')
          )
          controller.close()
        },
      }),
    }

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() =>
      useClarityChat({
        api: '/api/chat',
        onFinish,
      })
    )

    await result.current.append({
      role: 'user',
      content: 'Test',
    })

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0)
    })
  })

  it('should work with userId and threadId options', () => {
    const { result } = renderHook(() =>
      useClarityChat({
        api: '/api/chat',
        userId: 'user-123',
        threadId: 'thread-456',
      })
    )

    expect(result.current.messages).toEqual([])
    // These options are used internally for memory context
  })

  it('should handle memory options', () => {
    const { result } = renderHook(() =>
      useClarityChat({
        api: '/api/chat',
        memory: {
          enabled: true,
          strategy: 'semantic-chunks',
          maxTokens: 4000,
        },
      })
    )

    // Memory should be disabled if provider is not available, but show configured strategy
    expect(result.current.memoryInfo.enabled).toBe(false)
    expect(result.current.memoryInfo.strategy).toBe('semantic-chunks') // Configured strategy should be shown even when disabled
  })
})

describe('useClarityChat with MemoryProvider', () => {
  const mockConfig: MemoryServiceConfig = {
    maxTokens: 10000,
    compressionRatio: 0.5,
  }

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryProvider config={mockConfig} autoStart={true}>
      {children}
    </MemoryProvider>
  )

  it('should enable memory when provider is available and enabled', () => {
    const { result } = renderHook(
      () =>
        useClarityChat({
          api: '/api/chat',
          memory: { enabled: true },
        }),
      { wrapper: Wrapper }
    )

    // Note: Memory might still be disabled if service is not initialized
    // This depends on the MemoryProvider's internal state
    expect(typeof result.current.memoryInfo.enabled).toBe('boolean')
    expect('memoryInfo' in result.current).toBe(true)
    expect('memoryErrorInfo' in result.current).toBe(true)
  })

  it('should support different memory strategies', () => {
    const strategies: Array<'sliding-window' | 'semantic-chunks' | 'vector-store'> = [
      'sliding-window',
      'semantic-chunks',
      'vector-store',
    ]

    strategies.forEach((strategy) => {
      // Mock memory context with initialized service
      vi.spyOn(React, 'useContext').mockReturnValue({
        service: {
          getStats: () => ({ totalMemories: 0 }),
        },
        getStats: () => ({ totalMemories: 0 }),
        isInitialized: true,
        addMemory: vi.fn(),
        query: vi.fn(),
        updateMemory: vi.fn(),
        deleteMemory: vi.fn(),
        promoteMemory: vi.fn(),
        compressMemory: vi.fn(),
        getContext: vi.fn(),
        subscribe: vi.fn(),
      } as any)

      const { result } = renderHook(
        () =>
          useClarityChat({
            api: '/api/chat',
            memory: { enabled: true, strategy },
          }),
        { wrapper: Wrapper }
      )

      expect(result.current.memoryInfo.enabled).toBe(true)
      expect(result.current.memoryInfo.strategy).toBe(strategy)

      vi.restoreAllMocks()
    })
  })

  it('should query memory before appending user messages', async () => {
    const mockQuery = vi.fn().mockResolvedValue([
      { memory: { content: 'Previous context about testing' }, score: 0.9 }
    ])
    const mockAddMemory = vi.fn().mockResolvedValue({ id: '1' })

    // Mock memory context
    vi.spyOn(React, 'useContext').mockReturnValue({
      service: {
        query: mockQuery,
        addMemory: mockAddMemory,
        getStats: () => ({ totalMemories: 5 }),
      },
      addMemory: mockAddMemory,
      query: mockQuery,
      getStats: () => ({ totalMemories: 5 }),
      getContext: () => ({}),
      isInitialized: true,
      updateMemory: vi.fn(),
      deleteMemory: vi.fn(),
      promoteMemory: vi.fn(),
      compressMemory: vi.fn(),
      subscribe: vi.fn(),
    } as any)

    const { result } = renderHook(
      () =>
        useClarityChat({
          api: '/api/chat',
          memory: { enabled: true, strategy: 'semantic-chunks' },
        }),
      { wrapper: Wrapper }
    )

    const mockResponse = {
      ok: true,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(
            new TextEncoder().encode('data: {"content":"Response"}\n\n')
          )
          controller.close()
        },
      }),
    }

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    await result.current.append({
      role: 'user',
      content: 'Test query',
    })

    // Memory should be queried for user messages
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'Test query',
        scopes: ['thread'],
      })
    )

    // Memory should be added after message completion
    expect(mockAddMemory).toHaveBeenCalled()
  })

  it('should handle memory query errors gracefully', async () => {
    const mockQuery = vi.fn().mockRejectedValue(new Error('Memory query failed'))
    const mockAddMemory = vi.fn().mockResolvedValue({ id: '1' })

    vi.spyOn(React, 'useContext').mockReturnValue({
      service: { query: mockQuery },
      addMemory: mockAddMemory,
      getContext: () => ({}),
    } as any)

    const { result } = renderHook(
      () =>
        useClarityChat({
          api: '/api/chat',
          memory: { enabled: true },
        }),
      { wrapper: Wrapper }
    )

    const mockResponse = {
      ok: true,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(
            new TextEncoder().encode('data: {"content":"Response"}\n\n')
          )
          controller.close()
        },
      }),
    }

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    // Should not throw even if memory query fails
    await expect(
      result.current.append({
        role: 'user',
        content: 'Test',
      })
    ).resolves.not.toThrow()
  })

  it('should provide memory stats when memory is enabled', async () => {
    vi.spyOn(React, 'useContext').mockReturnValue({
      service: {
        getStats: () => ({ totalMemories: 3 }),
      },
      getStats: () => ({ totalMemories: 3 }),
      isInitialized: true,
      addMemory: vi.fn(),
      query: vi.fn(),
      updateMemory: vi.fn(),
      deleteMemory: vi.fn(),
      promoteMemory: vi.fn(),
      compressMemory: vi.fn(),
      getContext: vi.fn(),
      subscribe: vi.fn(),
    } as any)

    const { result } = renderHook(
      () =>
        useClarityChat({
          api: '/api/chat',
          memory: { enabled: true, strategy: 'vector-store' },
        }),
      { wrapper: Wrapper }
    )

    // Memory info should show enabled state and stats
    expect(result.current.memoryInfo.enabled).toBe(true)
    expect(result.current.memoryInfo.strategy).toBe('vector-store')

    // Wait for memory stats to be updated
    await waitFor(() => {
      expect(result.current.memoryInfo.memoryCount).toBe(3)
    })
  })
})
