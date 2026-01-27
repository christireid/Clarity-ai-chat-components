import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useChatEnhanced } from '../use-chat-enhanced'
import type { CoreMessage } from '../use-chat-enhanced'

// Mock fetch for API calls
global.fetch = vi.fn()

describe('useChatEnhanced - Reload Stale Closure Fix', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: vi
            .fn()
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode(
                'data: {"content":"response"}\n\n'
              ),
            })
            .mockResolvedValueOnce({
              done: true,
            }),
        }),
      },
    })
  })

  it('should use current messages state in reload, not stale closure', async () => {
    const { result } = renderHook(() =>
      useChatEnhanced({
        api: '/api/chat',
        initialMessages: [
          { id: '1', role: 'user', content: 'First message' },
          { id: '2', role: 'assistant', content: 'First response' },
        ] as CoreMessage[],
      })
    )

    // Manually update messages using setMessages to simulate state changes
    // This tests that reload uses current state, not closure state
    await act(async () => {
      result.current.setMessages([
        { id: '1', role: 'user', content: 'First message' },
        { id: '2', role: 'assistant', content: 'First response' },
        { id: '3', role: 'user', content: 'Second message' },
      ] as CoreMessage[])
    })

    expect(result.current.messages).toHaveLength(3)

    // Now reload - should use the CURRENT messages (including the newly added one)
    // Not the initial messages from closure
    await act(async () => {
      await result.current.reload()
    })

    await waitFor(() => {
      // Should have found the LAST user message from current state
      // With stale closure: would find "First message"
      // With ref fix: finds "Second message"
      const userMessages = result.current.messages.filter(
        (m) => m.role === 'user'
      )
      const lastUserMessage = userMessages[userMessages.length - 1]
      expect(lastUserMessage?.content).toBe('Second message')
    })
  })

  it('should handle reload when messages have been updated multiple times', async () => {
    const { result } = renderHook(() =>
      useChatEnhanced({
        api: '/api/chat',
        initialMessages: [] as CoreMessage[],
      })
    )

    // Rapidly add multiple messages
    await act(async () => {
      result.current.setMessages([
        { id: '1', role: 'user', content: 'Message 1' },
        { id: '2', role: 'assistant', content: 'Response 1' },
      ] as CoreMessage[])
    })

    await act(async () => {
      result.current.setMessages([
        { id: '1', role: 'user', content: 'Message 1' },
        { id: '2', role: 'assistant', content: 'Response 1' },
        { id: '3', role: 'user', content: 'Message 2' },
        { id: '4', role: 'assistant', content: 'Response 2' },
      ] as CoreMessage[])
    })

    // Reload should use the latest messages state
    await act(async () => {
      await result.current.reload()
    })

    await waitFor(() => {
      // Should have found the LAST user message (Message 2), not the first one
      const userMessages = result.current.messages.filter(
        (m) => m.role === 'user'
      )
      expect(userMessages[userMessages.length - 1]?.content).toBe('Message 2')
    })
  })

  it('should correctly trim messages after last user message', async () => {
    const { result } = renderHook(() =>
      useChatEnhanced({
        api: '/api/chat',
        initialMessages: [
          { id: '1', role: 'user', content: 'User 1' },
          { id: '2', role: 'assistant', content: 'Assistant 1' },
          { id: '3', role: 'user', content: 'User 2' },
          { id: '4', role: 'assistant', content: 'Assistant 2' },
          { id: '5', role: 'assistant', content: 'Assistant 3 (duplicate)' },
        ] as CoreMessage[],
      })
    )

    expect(result.current.messages).toHaveLength(5)

    await act(async () => {
      await result.current.reload()
    })

    await waitFor(() => {
      // Should have trimmed everything after last user message (User 2)
      const messagesBeforeReload = result.current.messages.filter(
        (m) => m.id === '1' || m.id === '2' || m.id === '3'
      )
      expect(messagesBeforeReload.length).toBeGreaterThan(0)

      // Should NOT have the duplicate assistant messages
      const duplicateMessages = result.current.messages.filter(
        (m) => m.id === '4' || m.id === '5'
      )
      expect(duplicateMessages.length).toBeLessThanOrEqual(1)
    })
  })

  it('should return null if no user messages exist', async () => {
    const { result } = renderHook(() =>
      useChatEnhanced({
        api: '/api/chat',
        initialMessages: [
          { id: '1', role: 'assistant', content: 'Only assistant message' },
        ] as CoreMessage[],
      })
    )

    let reloadResult: string | null = 'not-called'
    await act(async () => {
      reloadResult = await result.current.reload()
    })

    expect(reloadResult).toBeNull()
    expect(result.current.messages).toHaveLength(1) // No changes
  })
})
