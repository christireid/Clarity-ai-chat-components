import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { useConversationManager } from '../use-conversation-manager'
import type { ChatHandle, HookMessage } from '../types'

function createMockChat(messages: HookMessage[] = []): ChatHandle {
  return {
    messages,
    setMessages: vi.fn(),
    append: vi.fn().mockResolvedValue(null),
    reload: vi.fn().mockResolvedValue(null),
    stop: vi.fn(),
  }
}

describe('useConversationManager', () => {
  it('initializes with one conversation', () => {
    const chat = createMockChat()
    const { result } = renderHook(() =>
      useConversationManager({ defaultTitle: 'New Chat', chat })
    )

    expect(result.current.conversations).toHaveLength(1)
    expect(result.current.conversations[0].title).toBe('New Chat')
    expect(result.current.activeConvId).toBe(result.current.conversations[0].id)
  })

  it('creates a new conversation', () => {
    const chat = createMockChat()
    const { result } = renderHook(() =>
      useConversationManager({ defaultTitle: 'New Chat', chat })
    )

    const originalId = result.current.activeConvId

    act(() => result.current.handleNewConversation())

    expect(result.current.conversations).toHaveLength(2)
    expect(result.current.activeConvId).not.toBe(originalId)
    expect(chat.stop).toHaveBeenCalled()
    expect(chat.setMessages).toHaveBeenCalledWith([])
  })

  it('selects a different conversation', () => {
    const chat = createMockChat()
    const { result } = renderHook(() =>
      useConversationManager({ defaultTitle: 'New Chat', chat })
    )

    // Create a second conversation
    act(() => result.current.handleNewConversation())
    const secondId = result.current.activeConvId

    // Create a third
    act(() => result.current.handleNewConversation())
    const thirdId = result.current.activeConvId
    expect(thirdId).not.toBe(secondId)

    // Select the second
    act(() => result.current.handleSelectConversation(secondId))
    expect(result.current.activeConvId).toBe(secondId)
    expect(chat.stop).toHaveBeenCalled()
  })

  it('deletes a conversation and selects another', () => {
    const chat = createMockChat()
    const { result } = renderHook(() =>
      useConversationManager({ defaultTitle: 'New Chat', chat })
    )

    // Create a second conversation
    act(() => result.current.handleNewConversation())
    const secondId = result.current.activeConvId

    expect(result.current.conversations).toHaveLength(2)

    // Delete the active conversation
    act(() => result.current.handleDeleteConversation(secondId))

    expect(result.current.conversations).toHaveLength(1)
    // Should have switched to the remaining conversation
    expect(result.current.activeConvId).not.toBe(secondId)
  })

  it('prevents deleting the last conversation', () => {
    const chat = createMockChat()
    const { result } = renderHook(() =>
      useConversationManager({ defaultTitle: 'New Chat', chat })
    )

    const onlyId = result.current.activeConvId

    act(() => result.current.handleDeleteConversation(onlyId))

    // Should still have one conversation
    expect(result.current.conversations).toHaveLength(1)
  })

  it('syncs chat messages to the active conversation', () => {
    const chat = createMockChat()
    const { result, rerender } = renderHook(() =>
      useConversationManager({ defaultTitle: 'New Chat', chat })
    )

    // Simulate chat messages arriving
    chat.messages = [
      { id: 'msg-1', role: 'user', content: 'hello' },
      { id: 'msg-2', role: 'assistant', content: 'hi there' },
    ]
    rerender()

    // The active conversation should now have messages
    const active = result.current.conversations.find(
      (c) => c.id === result.current.activeConvId
    )
    expect(active?.messages).toHaveLength(2)
    expect(active?.messages[0].content).toBe('hello')
    expect(active?.messages[1].content).toBe('hi there')
  })

  it('applies deriveTitle from sync options', () => {
    const chat = createMockChat()
    const deriveTitle = vi.fn(
      (currentTitle: string, messages: HookMessage[]) => {
        if (currentTitle === 'New Chat' && messages.length > 0) {
          return 'Derived Title'
        }
        return currentTitle
      }
    )

    const { result, rerender } = renderHook(() =>
      useConversationManager({
        defaultTitle: 'New Chat',
        chat,
        sync: { deriveTitle },
      })
    )

    // Simulate messages
    chat.messages = [{ id: 'msg-1', role: 'user', content: 'test' }]
    rerender()

    const active = result.current.conversations.find(
      (c) => c.id === result.current.activeConvId
    )
    expect(active?.title).toBe('Derived Title')
  })
})
