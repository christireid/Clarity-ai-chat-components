/**
 * Basic Clarity Chat Example
 * 
 * Minimal example demonstrating useClarityChat + ChatWindow integration.
 * This shows the simplest possible end-to-end chat implementation.
 * 
 * @example
 * ```tsx
 * import { BasicClarityChatExample } from '@clarity-chat/react/examples'
 * 
 * function App() {
 *   return <BasicClarityChatExample />
 * }
 * ```
 */

import * as React from 'react'
import { useClarityChat } from '../hooks/use-clarity-chat'
import { ChatWindow } from '../components/chat-window'
import type { CoreMessage } from '../hooks/use-chat-enhanced'
import type { Message } from '@clarity-chat/types'

/**
 * Convert CoreMessage to Message format for ChatWindow
 */
function convertCoreMessageToMessage(
  coreMessage: CoreMessage,
  chatId: string = 'default'
): Message {
  const content = typeof coreMessage.content === 'string'
    ? coreMessage.content
    : Array.isArray(coreMessage.content)
    ? coreMessage.content
        .filter((part) => part.type === 'text')
        .map((part) => (part as { type: 'text'; text: string }).text)
        .join('')
    : ''

  return {
    id: coreMessage.id || `msg-${Date.now()}-${Math.random()}`,
    chatId,
    role: coreMessage.role === 'function' || coreMessage.role === 'tool'
      ? 'assistant'
      : coreMessage.role,
    content,
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 * Basic Clarity Chat Example Component
 * 
 * Demonstrates the simplest possible integration of useClarityChat
 * with ChatWindow component.
 */
export function BasicClarityChatExample() {
  const {
    messages: coreMessages,
    append,
    isLoading,
  } = useClarityChat({
    api: '/api/chat',
  })

  // Convert CoreMessage[] to Message[] for ChatWindow
  const messages: Message[] = React.useMemo(
    () => coreMessages.map((msg) => convertCoreMessageToMessage(msg)),
    [coreMessages]
  )

  const handleSendMessage = React.useCallback(
    async (content: string) => {
      await append({
        role: 'user',
        content,
      })
    },
    [append]
  )

  return (
    <div className="flex h-screen w-full flex-col">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        showHeader={true}
        sessionTitle="Clarity Chat"
        sessionSubtitle="Powered by useClarityChat"
      />
    </div>
  )
}
