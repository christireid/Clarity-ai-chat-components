'use client'

import { useMemo } from 'react'
import type { PromptSuggestion } from '@clarity-chat/react'
import type { TypedChatReturn } from './use-typed-chat'
import { getTextContent } from './types'
import { deriveFollowUpSuggestions } from './dynamic-follow-ups'

/**
 * Derives common chat UI state from the chat hook return value.
 *
 * Eliminates ~26 lines of identical useMemo calls that were duplicated
 * across every demo page (showThinkingIndicator, showFollowUp,
 * followUpSuggestions, streamingMsgId, thinkingBarStatus).
 */
export function useChatDerivedState(
  chat: TypedChatReturn,
  defaultFollowUps: PromptSuggestion[]
) {
  const showThinkingIndicator = useMemo(() => {
    const lastMsg =
      chat.messages.length > 0
        ? chat.messages[chat.messages.length - 1]
        : undefined
    return (
      chat.isLoading &&
      (!lastMsg ||
        lastMsg.role !== 'assistant' ||
        !getTextContent(lastMsg.content))
    )
  }, [chat.messages, chat.isLoading])

  const showFollowUp = useMemo(() => {
    if (chat.isLoading || chat.messages.length === 0) return false
    const last = chat.messages[chat.messages.length - 1]
    return last?.role === 'assistant'
  }, [chat.isLoading, chat.messages])

  const followUpSuggestions = useMemo(
    () => deriveFollowUpSuggestions(chat.messages, defaultFollowUps),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chat.messages]
  )

  const streamingMsgId = useMemo(() => {
    if (!chat.isLoading) return null
    const last = chat.messages[chat.messages.length - 1]
    if (last?.role === 'assistant' && getTextContent(last.content).length > 0) {
      return last.id || null
    }
    return null
  }, [chat.messages, chat.isLoading])

  const thinkingBarStatus = useMemo(() => {
    if (!chat.isLoading) return 'idle' as const
    if (showThinkingIndicator) return 'thinking' as const
    return 'generating' as const
  }, [chat.isLoading, showThinkingIndicator])

  return {
    showThinkingIndicator,
    showFollowUp,
    followUpSuggestions,
    streamingMsgId,
    thinkingBarStatus,
  }
}
