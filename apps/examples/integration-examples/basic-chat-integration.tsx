/**
 * Basic Chat Integration Example
 * 
 * Demonstrates a simple chat implementation using Clarity Chat components.
 * This example shows the minimum setup required to get started.
 * 
 * Features:
 * - Message display
 * - Input handling
 * - Streaming responses
 * - Error handling
 */

import * as React from 'react'
import {
  ChatWindow,
  ThemeProvider,
  themes,
  useChat,
  useStreamingSSE,
  MessageList,
  ChatInput,
  ErrorBoundary,
} from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export function BasicChatIntegration() {
  const { messages, sendMessage, isLoading, error } = useChat({
    initialMessages: [],
  })

  const { connect, disconnect, isConnected } = useStreamingSSE({
    url: '/api/chat/stream',
    autoReconnect: true,
    onMessage: (event) => {
      // Handle streaming message chunks
      SecureLogger.debug('Stream event:', event)
    },
  })

  const handleSend = async (content: string) => {
    await sendMessage(content)
    // Connect to streaming endpoint
    connect()
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={themes.ocean}>
        <div className="flex flex-col h-screen">
          <ChatWindow>
            <MessageList messages={messages} />
            <ChatInput
              onSendMessage={handleSend}
              disabled={isLoading}
              placeholder="Type your message..."
            />
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                Error: {error.message}
              </div>
            )}
          </ChatWindow>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default BasicChatIntegration
