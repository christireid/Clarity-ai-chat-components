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
import { convertCoreMessagesToMessages } from '../utils/message-conversion'

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
  const messages = React.useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
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
