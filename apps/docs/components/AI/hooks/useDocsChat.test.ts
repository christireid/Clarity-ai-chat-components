import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDocsChat } from './useDocsChat'

// Mock dependencies
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
}

vi.mock('@clarity-chat/react', () => ({
  useToast: () => mockToast,
  useLocalStorage: (key: string, initial: any) => [initial, vi.fn(), vi.fn()],
  useThrottledCallback: (cb: any) => cb,
  useTokenTracker: () => ({
    tokens: 0,
    addMessage: vi.fn(),
    clear: vi.fn(),
  }),
  createFadeVariant: vi.fn(),
  createSlideVariant: vi.fn(),
}))

vi.mock('./useOfflineQueue', () => ({
  useOfflineQueue: ({ onStatusChange }: any) => ({
    isOnline: true,
    messageQueue: [],
    queueMessage: vi.fn(),
    handleNetworkStatusChange: onStatusChange,
  }),
  createPendingMessage: (content: string) => ({
    id: 'pending-1',
    role: 'user',
    content,
    status: 'pending',
  }),
}))

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('useDocsChat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useDocsChat())

    expect(result.current.messages).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.streamingStatus).toBe('idle')
  })

  it('handles sending a message', async () => {
    const { result } = renderHook(() => useDocsChat())

    // Mock successful fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => ({
          read: vi
            .fn()
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode(
                'data: {"type":"text","content":"Hello"}\n\n'
              ),
            })
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode('data: {"type":"done"}\n\n'),
            })
            .mockResolvedValueOnce({ done: true }),
        }),
      },
    })

    await act(async () => {
      await result.current.handleSendMessage('Hello AI')
    })

    expect(result.current.messages).toHaveLength(2) // User + Assistant
    expect(result.current.messages[0].content).toBe('Hello AI')
    expect(result.current.messages[1].content).toBe('Hello')
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/docs-assistant',
      expect.any(Object)
    )
  })

  it('handles feedback optimistically', async () => {
    const { result } = renderHook(() => useDocsChat())

    // Add a dummy message first
    act(() => {
      result.current.setMessages([
        {
          id: 'msg-1',
          chatId: 'chat-1',
          role: 'assistant',
          content: 'Test',
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'sent',
        },
      ])
    })

    // Mock feedback API
    mockFetch.mockResolvedValueOnce({ ok: true })

    await act(async () => {
      await result.current.handleFeedback('msg-1', 'up')
    })

    expect(result.current.messages[0].feedback?.type).toBe('up')
    expect(mockToast.success).toHaveBeenCalled()
  })

  it('generates follow-up suggestions', async () => {
    const { result } = renderHook(() => useDocsChat())

    // Mock successful fetch with content that triggers suggestions
    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => ({
          read: vi
            .fn()
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode(
                'data: {"type":"text","content":"You can install using npm install @clarity-chat/react"}\n\n'
              ),
            })
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode('data: {"type":"done"}\n\n'),
            })
            .mockResolvedValueOnce({ done: true }),
        }),
      },
    })

    await act(async () => {
      await result.current.handleSendMessage('How to install?')
    })

    expect(result.current.suggestedFollowUps).toContain(
      'How do I configure the theme?'
    )
  })

  it('handles clearing conversation', () => {
    const { result } = renderHook(() => useDocsChat())

    act(() => {
      result.current.setMessages([
        {
          id: '1',
          chatId: '1',
          role: 'user',
          content: 'hi',
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'sent',
        },
      ])
    })

    act(() => {
      result.current.handleClear()
    })

    expect(result.current.messages).toEqual([])
    expect(mockToast.info).toHaveBeenCalledWith('Conversation cleared')
  })
})
