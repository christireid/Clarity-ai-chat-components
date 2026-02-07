import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useChatDerivedState } from '../use-chat-derived-state'
import type { TypedChatReturn } from '../use-typed-chat'
import type { HookMessage } from '../types'
import type { PromptSuggestion } from '@clarity-chat/react'

function createMockChat(
  messages: HookMessage[] = [],
  isLoading = false
): TypedChatReturn {
  return {
    messages,
    setMessages: vi.fn(),
    append: vi.fn().mockResolvedValue(null),
    reload: vi.fn().mockResolvedValue(null),
    stop: vi.fn(),
    isLoading,
    error: undefined,
    data: undefined,
  }
}

const defaultFollowUps: PromptSuggestion[] = [
  { id: 'default-1', text: 'What can you do?', type: 'follow-up' },
  { id: 'default-2', text: 'Help me get started', type: 'follow-up' },
]

describe('useChatDerivedState', () => {
  it('showThinkingIndicator is true when loading and no assistant message', () => {
    const chat = createMockChat(
      [{ id: 'msg-1', role: 'user', content: 'hello' }],
      true
    )
    const { result } = renderHook(() =>
      useChatDerivedState(chat, defaultFollowUps)
    )

    expect(result.current.showThinkingIndicator).toBe(true)
  })

  it('showThinkingIndicator is true when loading and last assistant message has no content', () => {
    const chat = createMockChat(
      [
        { id: 'msg-1', role: 'user', content: 'hello' },
        { id: 'msg-2', role: 'assistant', content: '' },
      ],
      true
    )
    const { result } = renderHook(() =>
      useChatDerivedState(chat, defaultFollowUps)
    )

    expect(result.current.showThinkingIndicator).toBe(true)
  })

  it('showThinkingIndicator is false when assistant message has content', () => {
    const chat = createMockChat(
      [
        { id: 'msg-1', role: 'user', content: 'hello' },
        { id: 'msg-2', role: 'assistant', content: 'Here is my response' },
      ],
      true
    )
    const { result } = renderHook(() =>
      useChatDerivedState(chat, defaultFollowUps)
    )

    expect(result.current.showThinkingIndicator).toBe(false)
  })

  it('showThinkingIndicator is false when not loading', () => {
    const chat = createMockChat([], false)
    const { result } = renderHook(() =>
      useChatDerivedState(chat, defaultFollowUps)
    )

    expect(result.current.showThinkingIndicator).toBe(false)
  })

  it('showFollowUp is true when last message is assistant and not loading', () => {
    const chat = createMockChat(
      [
        { id: 'msg-1', role: 'user', content: 'hello' },
        { id: 'msg-2', role: 'assistant', content: 'response' },
      ],
      false
    )
    const { result } = renderHook(() =>
      useChatDerivedState(chat, defaultFollowUps)
    )

    expect(result.current.showFollowUp).toBe(true)
  })

  it('showFollowUp is false when loading', () => {
    const chat = createMockChat(
      [
        { id: 'msg-1', role: 'user', content: 'hello' },
        { id: 'msg-2', role: 'assistant', content: 'response' },
      ],
      true
    )
    const { result } = renderHook(() =>
      useChatDerivedState(chat, defaultFollowUps)
    )

    expect(result.current.showFollowUp).toBe(false)
  })

  it('showFollowUp is false when last message is from user', () => {
    const chat = createMockChat(
      [
        { id: 'msg-1', role: 'assistant', content: 'response' },
        { id: 'msg-2', role: 'user', content: 'follow up' },
      ],
      false
    )
    const { result } = renderHook(() =>
      useChatDerivedState(chat, defaultFollowUps)
    )

    expect(result.current.showFollowUp).toBe(false)
  })

  it('showFollowUp is false when there are no messages', () => {
    const chat = createMockChat([], false)
    const { result } = renderHook(() =>
      useChatDerivedState(chat, defaultFollowUps)
    )

    expect(result.current.showFollowUp).toBe(false)
  })

  it('streamingMsgId returns correct id when streaming', () => {
    const chat = createMockChat(
      [
        { id: 'msg-1', role: 'user', content: 'hello' },
        { id: 'msg-2', role: 'assistant', content: 'streaming response...' },
      ],
      true
    )
    const { result } = renderHook(() =>
      useChatDerivedState(chat, defaultFollowUps)
    )

    expect(result.current.streamingMsgId).toBe('msg-2')
  })

  it('streamingMsgId returns null when not loading', () => {
    const chat = createMockChat(
      [
        { id: 'msg-1', role: 'user', content: 'hello' },
        { id: 'msg-2', role: 'assistant', content: 'done' },
      ],
      false
    )
    const { result } = renderHook(() =>
      useChatDerivedState(chat, defaultFollowUps)
    )

    expect(result.current.streamingMsgId).toBeNull()
  })

  it('streamingMsgId returns null when loading but no assistant content yet', () => {
    const chat = createMockChat(
      [{ id: 'msg-1', role: 'user', content: 'hello' }],
      true
    )
    const { result } = renderHook(() =>
      useChatDerivedState(chat, defaultFollowUps)
    )

    expect(result.current.streamingMsgId).toBeNull()
  })

  it('thinkingBarStatus returns idle when not loading', () => {
    const chat = createMockChat(
      [{ id: 'msg-1', role: 'assistant', content: 'done' }],
      false
    )
    const { result } = renderHook(() =>
      useChatDerivedState(chat, defaultFollowUps)
    )

    expect(result.current.thinkingBarStatus).toBe('idle')
  })

  it('thinkingBarStatus returns thinking when loading with no assistant content', () => {
    const chat = createMockChat(
      [{ id: 'msg-1', role: 'user', content: 'hello' }],
      true
    )
    const { result } = renderHook(() =>
      useChatDerivedState(chat, defaultFollowUps)
    )

    expect(result.current.thinkingBarStatus).toBe('thinking')
  })

  it('thinkingBarStatus returns generating when loading with assistant content', () => {
    const chat = createMockChat(
      [
        { id: 'msg-1', role: 'user', content: 'hello' },
        { id: 'msg-2', role: 'assistant', content: 'generating...' },
      ],
      true
    )
    const { result } = renderHook(() =>
      useChatDerivedState(chat, defaultFollowUps)
    )

    expect(result.current.thinkingBarStatus).toBe('generating')
  })

  it('followUpSuggestions returns defaults when no assistant messages', () => {
    const chat = createMockChat(
      [{ id: 'msg-1', role: 'user', content: 'hello' }],
      false
    )
    const { result } = renderHook(() =>
      useChatDerivedState(chat, defaultFollowUps)
    )

    expect(result.current.followUpSuggestions).toEqual(defaultFollowUps)
  })
})
