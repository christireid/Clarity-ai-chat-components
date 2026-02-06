'use client'

import { useClarityChat } from '@clarity-chat/react'
import type { HookMessage } from './types'

/**
 * Typed return shape from useClarityChat.
 *
 * The @clarity-chat/react package doesn't ship generated .d.ts declarations,
 * so the actual return of useClarityChat is typed as `any`. This interface
 * provides a safe, narrow type for the properties the demos actually use.
 */
export interface TypedChatReturn {
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
