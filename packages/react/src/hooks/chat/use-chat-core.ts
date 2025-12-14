/**
 * useChatCore - Mid-level hook for chat functionality
 *
 * Building block hook that provides core chat functionality without
 * the high-level conveniences. Use this when you need more control
 * than useClarityChat but don't want to wire everything manually.
 *
 * @example
 * ```tsx
 * const chat = useChatCore({ api: '/api/chat' })
 *
 * return (
 *   <ChatWindow
 *     messages={chat.messages}
 *     isLoading={chat.isLoading}
 *     onSendMessage={chat.sendMessage}
 *   />
 * )
 * ```
 */

'use client'

import * as React from 'react'
import { useClarityChat, type UseClarityChatOptions } from './use-clarity-chat'
import { convertCoreMessagesToMessages } from '../../utils/message'
import type { Message } from '@clarity-chat/types'

/**
 * Options for useChatCore
 */
export interface UseChatCoreOptions extends UseClarityChatOptions {
  /** Convert messages automatically (default: true) */
  autoConvert?: boolean
}

/**
 * Return type for useChatCore
 */
export interface UseChatCoreReturn {
  /** Messages (converted if autoConvert is true) */
  messages: Message[]
  /** Core messages (before conversion) */
  coreMessages: ReturnType<typeof useClarityChat>['messages']
  /** Send a message */
  sendMessage: (content: string) => Promise<void>
  /** Whether a message is being sent */
  isLoading: boolean
  /** Current error */
  error: Error | null
  /** All other useClarityChat returns */
  chat: ReturnType<typeof useClarityChat>
}

/**
 * useChatCore - Mid-level chat hook
 *
 * Provides core chat functionality with automatic message conversion
 * but without the high-level conveniences of useClarityChat.
 */
export function useChatCore(
  options: UseChatCoreOptions = {}
): UseChatCoreReturn {
  const { autoConvert = true, ...chatOptions } = options

  const chat = useClarityChat(chatOptions)

  const messages = React.useMemo(() => {
    if (!autoConvert) {
      // Return empty array if not converting
      // User should use chat.messages directly
      return []
    }
    return convertCoreMessagesToMessages(chat.messages)
  }, [chat.messages, autoConvert])

  const sendMessage = React.useCallback(
    async (content: string) => {
      await chat.append({ role: 'user', content })
    },
    [chat]
  )

  return {
    messages: autoConvert ? messages : ([] as Message[]),
    coreMessages: chat.messages,
    sendMessage,
    isLoading: chat.isLoading,
    error: chat.error ?? null,
    chat,
  }
}
