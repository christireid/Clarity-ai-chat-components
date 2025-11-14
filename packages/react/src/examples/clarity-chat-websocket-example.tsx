/**
 * Clarity Chat with WebSocket Example
 * 
 * Example demonstrating useClarityChat with WebSocket transport.
 * Shows how to use WebSocket for bidirectional real-time chat.
 * 
 * @example
 * ```tsx
 * import { ClarityChatWebSocketExample } from '@clarity-chat/react/examples'
 * 
 * function App() {
 *   return <ClarityChatWebSocketExample />
 * }
 * ```
 */

import * as React from 'react'
import { useClarityChat } from '../hooks/use-clarity-chat'
import { ChatWindow } from '../components/chat-window'
import { coreMessagesToMessages } from '../utils/message-converter'
import { Badge } from '@clarity-chat/primitives'

/**
 * Clarity Chat with WebSocket Example Component
 * 
 * Demonstrates useClarityChat with WebSocket transport for real-time chat.
 * WebSocket provides bidirectional communication and lower latency.
 */
export function ClarityChatWebSocketExample() {
  const {
    messages: coreMessages,
    append,
    isLoading,
    memoryInfo,
  } = useClarityChat({
    api: '/api/chat/ws', // WebSocket endpoint
    transport: 'websocket',
    websocket: {
      autoReconnect: true,
      maxReconnectAttempts: 5,
      enableHeartbeat: true,
    },
    memory: {
      enabled: true,
      strategy: 'sliding-window',
    },
  })

  // Convert CoreMessage[] to Message[] for ChatWindow
  const messages = React.useMemo(
    () => coreMessagesToMessages(coreMessages),
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
      <div className="border-b bg-card px-4 py-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">WebSocket Chat</h2>
            <p className="text-sm text-muted-foreground">
              Real-time bidirectional communication
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">WebSocket</Badge>
            {memoryInfo.enabled && (
              <Badge variant="secondary">
                Memory: {memoryInfo.memoryCount} items
              </Badge>
            )}
          </div>
        </div>
      </div>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        showHeader={false}
      />
    </div>
  )
}
