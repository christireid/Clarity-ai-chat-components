import { logger } from '@clarity-chat/utils/logger'
/**
 * Mid-Level Examples - Composable Building Blocks
 *
 * These examples demonstrate using mid-level APIs for more control
 * while maintaining ergonomics. Each example is 40-60 lines of code.
 */

import * as React from 'react'
import '@clarity-chat/react/styles.css'
import { useClarityChat } from '../hooks/chat/use-clarity-chat'
import { useChatHandlers } from '../hooks/use-chat-handlers'
import { ChatWindow } from '../components/chat-window'
import { ChatInput } from '../components/chat-input'
import { useChatEnhanced } from '../hooks/use-chat-enhanced'
import { useClarityChatWithTools } from '../hooks/use-clarity-chat-with-tools'
import { createToolUIRegistry } from '../agents/tool-ui-registry'
import { MemoryProvider, useMemoryContext } from '../memory/memory-provider'

// ============================================================================
// Example 1: Custom Chat with Handlers (45 lines)
// ============================================================================

/**
 * Custom chat interface using mid-level APIs
 * Shows how to compose ChatWindow with handlers for custom UI
 */
export function CustomChatWithHandlers() {
  const chat = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
    },
  })

  const handlers = useChatHandlers({
    chat,
    onMessageSent: (content) => {
      logger.debug('Message sent:', content)
      // Analytics tracking, etc.
    },
    onMessageError: (error) => {
      logger.error('Failed to send:', error)
      // Error reporting, etc.
    },
  })

  return (
    <div className="custom-chat-container">
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={handlers.onSendMessage}
        onClear={handlers.onClear}
        onMessageRetry={handlers.onRetry}
        showHeader
        sessionTitle="Custom Chat"
      />
    </div>
  )
}

// ============================================================================
// Example 2: Vercel-Compatible Chat (50 lines)
// ============================================================================

/**
 * Chat using Vercel AI SDK compatible hook
 * Shows how to use useChatEnhanced for Vercel compatibility
 */
export function VercelCompatibleChat() {
  const chat = useChatEnhanced({
    api: '/api/chat',
    initialMessages: [
      { role: 'system', content: 'You are a helpful assistant.' },
    ],
    onFinish: (message) => {
      logger.debug('Message finished:', message)
    },
    onError: (error) => {
      logger.error('Chat error:', error)
    },
  })

  const handlers = useChatHandlers({ chat })

  return (
    <div>
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={handlers.onSendMessage}
      />
      <ChatInput
        value={chat.input}
        onChange={chat.setInput}
        onSubmit={handlers.onSendMessage}
      />
    </div>
  )
}

// ============================================================================
// Example 3: Chat with Tools (55 lines)
// ============================================================================

/**
 * Chat with tool calling integration
 * Shows how to use useClarityChatWithTools for tool rendering
 */
interface WeatherResult {
  location: string
  temperature: number
  condition: string
}

function WeatherToolResult({ result }: { result: WeatherResult }) {
  return (
    <div className="weather-result">
      <h4>Weather in {result.location}</h4>
      <p>
        {result.temperature}°F - {result.condition}
      </p>
    </div>
  )
}

export function ChatWithTools() {
  const toolRegistry = React.useMemo(
    () =>
      createToolUIRegistry({
        weather: WeatherToolResult,
      }),
    []
  )

  const { messages, toolResults, isLoading, append } = useClarityChatWithTools({
    api: '/api/chat',
    toolRegistry,
  })

  // Create a compatible chat object for handlers
  const chatForHandlers = React.useMemo(
    () => ({
      messages,
      append,
      isLoading,
      setMessages: () => {}, // Not used in this example
    }),
    [messages, append, isLoading]
  )

  const handlers = useChatHandlers({ chat: chatForHandlers as any })

  return (
    <div>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handlers.onSendMessage}
      />
      {/* Render tool results */}
      <div className="tool-results">
        {toolResults.map((result, idx) => {
          const Component = toolRegistry['get'](result.toolCall.function.name)
          return Component ? (
            <Component key={idx} result={result.result} />
          ) : null
        })}
      </div>
    </div>
  )
}

// ============================================================================
// Example 4: Memory-Aware Chat (60 lines)
// ============================================================================

/**
 * Chat with memory context integration
 * Shows how to use MemoryProvider and useMemoryContext
 */
export function MemoryAwareChat() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <MemoryChatInner />
    </MemoryProvider>
  )
}

function MemoryChatInner() {
  const memory = useMemoryContext()
  const chat = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'vector-store',
    },
  })

  const handlers = useChatHandlers({
    chat,
    onMessageSent: async (content) => {
      // Add to memory before sending
      if (memory?.addMemory) {
        await memory.addMemory(content, 'conversation', 'session', {
          timestamp: Date.now(),
        })
      }
    },
  })

  return (
    <div>
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={handlers.onSendMessage}
      />
      {memory && (
        <div className="memory-info">
          <p>Memory: {memory.stats?.totalItems || 0} items</p>
        </div>
      )}
    </div>
  )
}
