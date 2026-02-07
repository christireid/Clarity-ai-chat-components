'use client'

import { useClarityChat } from '@clarity-chat/react'
import type { ChatHandle, HookMessage } from './types'

/**
 * Typed return shape from useClarityChat.
 *
 * Extends ChatHandle so that all shared hooks accept this return value
 * directly without separate interface definitions.
 */
export interface TypedChatReturn extends ChatHandle {
  messages: HookMessage[]
  setMessages: (
    msgs: HookMessage[] | ((prev: HookMessage[]) => HookMessage[])
  ) => void
  append: (
    msg: { role: string; content: string },
    options?: { data?: Record<string, unknown> }
  ) => Promise<string | null>
  reload: () => Promise<string | null>
  stop: () => void
  isLoading: boolean
  error: Error | undefined
  data: unknown
}

/**
 * Thin typed wrapper around useClarityChat.
 *
 * Centralizes the single `as unknown as TypedChatReturn` cast so that every
 * demo page can use properly typed `chat.*` methods without per-call casts.
 */
export function useTypedChat(
  options: Parameters<typeof useClarityChat>[0]
): TypedChatReturn {
  const chat = useClarityChat(options)
  return chat as unknown as TypedChatReturn
}
