/**
 * Intermediate Examples - Real-World Usage Patterns
 * 
 * These examples show slightly customized usage with basic real-world
 * features. Each example is 30-50 lines of code.
 */

import * as React from 'react'
import {
  ClarityChat,
  useChat,
  ChatWindow,
  ChatWithMemory,
  useAnalytics,
  AnalyticsProvider,
} from '../index'

/**
 * Example 1: Custom Chat with Header (35 lines)
 * 
 * Chat with custom header, session info, and message actions.
 * 
 * LOC: 35
 */
export function Intermediate_CustomChat() {
  const { messages, sendMessage, isLoading, clearMessages } = useChat({
    api: '/api/chat',
  })
  
  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={sendMessage}
      showHeader
      sessionTitle="Customer Support"
      sessionSubtitle="We're here to help"
      showMessageCount
      onClear={clearMessages}
      onMessageCopy={(id, content) => {
        navigator.clipboard.writeText(content)
        console.log('Message copied:', id)
      }}
      onMessageFeedback={(id, type) => {
        console.log('Feedback:', { id, type })
      }}
    />
  )
}

/**
 * Example 2: Chat with Analytics (40 lines)
 * 
 * Chat with analytics tracking integrated.
 * 
 * LOC: 40
 */
export function Intermediate_ChatWithAnalytics() {
  return (
    <AnalyticsProvider config={{ endpoint: '/api/analytics' }}>
      <ClarityChat
        api="/api/chat"
        showHeader
        sessionTitle="Analytics Chat"
        onMessageFeedback={(id, type) => {
          // Analytics tracked automatically via provider
          console.log('Feedback tracked:', { id, type })
        }}
      />
    </AnalyticsProvider>
  )
}

/**
 * Example 3: Chat with Memory and Customization (45 lines)
 * 
 * Chat with memory enabled and custom styling.
 * 
 * LOC: 45
 */
export function Intermediate_ChatWithMemoryCustom() {
  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold">AI Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Powered by Clarity Chat with Memory
        </p>
      </div>
      <div className="flex-1">
        <ChatWithMemory
          api="/api/chat"
          strategy="vector-store"
          showHeader={false}
          className="h-full"
        />
      </div>
    </div>
  )
}

/**
 * Example 4: Chat with Error Handling (50 lines)
 * 
 * Chat with custom error handling and retry logic.
 * 
 * LOC: 50
 */
export function Intermediate_ChatWithErrorHandling() {
  const { messages, sendMessage, isLoading, error, chat } = useChat({
    api: '/api/chat',
  })
  
  React.useEffect(() => {
    if (error) {
      console.error('Chat error:', error)
      // Could integrate with error tracking service
    }
  }, [error])
  
  return (
    <div className="h-screen flex flex-col">
      {error && (
        <div className="bg-red-50 border border-red-200 p-4">
          <p className="text-red-800">Error: {error.message}</p>
          <button
            onClick={() => chat.setMessages([])}
            className="mt-2 text-sm text-red-600 underline"
          >
            Clear and retry
          </button>
        </div>
      )}
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={sendMessage}
        onMessageRetry={(id) => {
          // Custom retry logic
          console.log('Retrying message:', id)
        }}
      />
    </div>
  )
}
