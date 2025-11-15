/**
 * Basic Clarity Chat Example
 * 
 * Demonstrates the simplest possible end-to-end chat using:
 * - useClarityChat hook (flagship API)
 * - ChatWindow component (production-ready UI)
 * 
 * This example shows the recommended way to use Clarity for most use cases.
 */

import * as React from 'react'
import { useClarityChat } from '../hooks/use-clarity-chat'
import { ChatWindow } from '../components/chat-window'
import { convertCoreMessagesToMessages } from '../utils/message-conversion'

/**
 * Basic Clarity Chat Example Component
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
export function BasicClarityChatExample() {
  const {
    messages: coreMessages,
    append,
    isLoading,
  } = useClarityChat({
    api: '/api/chat',
    // Optional: Enable memory for context-aware conversations
    // memory: {
    //   enabled: true,
    //   strategy: 'semantic-chunks',
    //   autoCapture: true,
    // },
    // Optional: Use WebSocket instead of SSE
    // transport: 'websocket',
  })

  // Convert CoreMessage[] to Message[] for ChatWindow
  const messages = React.useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  // Handle sending messages
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
    <div className="flex h-screen flex-col">
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        showHeader
        sessionTitle="Clarity Chat"
        sessionSubtitle="Powered by useClarityChat"
        showMessageCount
        onClear={() => {
          // Clear messages by resetting to empty array
          // Note: This would require exposing a clear method from useClarityChat
          // For now, users can reload the component
          window.location.reload()
        }}
      />
    </div>
  )
}

/**
 * Minimal Example - Even simpler version
 * 
 * Shows the absolute minimum code needed for a working chat.
 */
export function MinimalClarityChatExample() {
  const chat = useClarityChat({
    api: '/api/chat',
  })

  const messages = React.useMemo(
    () => convertCoreMessagesToMessages(chat.messages),
    [chat.messages]
  )

  return (
    <div className="h-screen">
      <ChatWindow
        messages={messages}
        isLoading={chat.isLoading}
        onSendMessage={async (content) => {
          await chat.append({ role: 'user', content })
        }}
      />
      {chat.error && (
        <div className="fixed bottom-4 right-4 rounded-lg border border-red-200 bg-red-50 p-4 shadow-lg">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {chat.error.message}
          </p>
        </div>
      )}
    </div>
  )
}
