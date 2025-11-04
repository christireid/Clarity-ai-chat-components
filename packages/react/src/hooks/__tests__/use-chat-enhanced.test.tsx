/**
 * Tests for enhanced useChat hook (Vercel AI SDK compatible)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useChat } from '../use-chat-enhanced'

// Mock fetch
global.fetch = vi.fn()

describe('useChat (Enhanced)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with empty messages', () => {
    const { result } = renderHook(() => useChat())

    expect(result.current.messages).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeUndefined()
  })

  it('should initialize with initialMessages', () => {
    const initialMessages = [
      { role: 'user' as const, content: 'Hello' },
      { role: 'assistant' as const, content: 'Hi there!' },
    ]

    const { result } = renderHook(() =>
      useChat({ initialMessages })
    )

    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[0].content).toBe('Hello')
  })

  it('should handle append for user messages', async () => {
    const mockResponse = {
      ok: true,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"content":"Hello"}\n\n'))
          controller.close()
        },
      }),
    }

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() =>
      useChat({ api: '/api/chat', stream: true })
    )

    await result.current.append({
      role: 'user',
      content: 'Test message',
    })

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0)
    })
  })

  it('should handle form submission', async () => {
    const mockResponse = {
      ok: true,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"content":"Response"}\n\n'))
          controller.close()
        },
      }),
    }

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() =>
      useChat({ api: '/api/chat', stream: true })
    )

    result.current.setInput('Test input')

    const formEvent = {
      preventDefault: vi.fn(),
    } as any

    result.current.handleSubmit(formEvent)

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0)
    })
  })

  it('should handle errors', async () => {
    const mockError = new Error('Network error')
    vi.mocked(fetch).mockRejectedValueOnce(mockError)

    const onError = vi.fn()

    const { result } = renderHook(() =>
      useChat({ api: '/api/chat', onError })
    )

    await expect(
      result.current.append({
        role: 'user',
        content: 'Test',
      })
    ).rejects.toThrow()

    await waitFor(() => {
      expect(onError).toHaveBeenCalled()
    })
  })

  it('should support stop functionality', async () => {
    const { result } = renderHook(() => useChat())

    result.current.stop()

    expect(result.current.isLoading).toBe(false)
  })

  it('should support reload functionality', async () => {
    const mockResponse = {
      ok: true,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"content":"Reloaded"}\n\n'))
          controller.close()
        },
      }),
    }

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() =>
      useChat({
        api: '/api/chat',
        initialMessages: [
          { role: 'user' as const, content: 'Hello' },
          { role: 'assistant' as const, content: 'Hi' },
        ],
        stream: true,
      })
    )

    await result.current.reload()

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(1)
    })
  })
})
