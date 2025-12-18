/**
 * Clarity Chat Recipes - Common Patterns & Examples
 * 
 * This file contains copy-pasteable examples of common patterns.
 * These are not exported components, but rather documentation examples
 * that show how to use the library in different scenarios.
 * 
 * @fileoverview Common usage patterns and recipes
 */

/**
 * Recipe 1: Minimal Chat (5 lines)
 * 
 * The absolute simplest way to add AI chat to your app.
 */
export const RecipeMinimal = `
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

export default function App() {
  return <ClarityChat api="/api/chat" />
}
`

/**
 * Recipe 2: Customized Chat (10 lines)
 * 
 * Add customization while keeping it simple.
 */
export const RecipeCustomized = `
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

export default function App() {
  return (
    <ClarityChat
      api="/api/chat"
      theme="dark"
      enableMemory
      showTokenCounter
      onMessageSent={(msg) => logger.debug('Sent:', msg)}
    />
  )
}
`

/**
 * Recipe 3: Chat with Message Operations
 * 
 * Use the composed hook for edit/regenerate/delete functionality.
 */
export const RecipeWithOperations = `
import { useChatWithOperations, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

function App() {
  const {
    messages,
    append,
    isLoading,
    editMessage,
    regenerateMessage,
    deleteMessage,
    undo,
    redo,
  } = useChatWithOperations({ api: '/api/chat' })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
      onEditMessage={editMessage}
      onRegenerateMessage={regenerateMessage}
      onDeleteMessage={deleteMessage}
    />
  )
}
`

/**
 * Recipe 4: Chat with Analytics
 * 
 * Track user interactions automatically.
 */
export const RecipeWithAnalytics = `
import { useClarityChatWithAnalytics, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

function App() {
  const chat = useClarityChatWithAnalytics({
    api: '/api/chat',
    analytics: {
      trackMessageSent: (content) => {
        // Send to your analytics service
        analytics.track('message_sent', { content })
      },
      trackMessageReceived: (message) => {
        analytics.track('message_received', { message })
      },
      trackError: (error) => {
        analytics.track('chat_error', { error: error.message })
      },
    },
  })

  const messages = convertCoreMessagesToMessages(chat.messages)

  return (
    <ChatWindow
      messages={messages}
      isLoading={chat.isLoading}
      onSendMessage={async (content) => {
        await chat.append({ role: 'user', content })
      }}
    />
  )
}
`

/**
 * Recipe 5: Chat with Memory
 * 
 * Enable conversation memory for context-aware responses.
 */
export const RecipeWithMemory = `
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

export default function App() {
  return (
    <ClarityChat
      api="/api/chat"
      enableMemory
      memoryStrategy="vector-store"
    />
  )
}
`

/**
 * Recipe 6: Chat with Custom Styling
 * 
 * Customize the appearance while keeping functionality.
 */
export const RecipeCustomStyling = `
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

export default function App() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <ClarityChat
        api="/api/chat"
        className="my-custom-chat"
        showHeader
        sessionTitle="My AI Assistant"
        sessionSubtitle="Ask me anything!"
      />
    </div>
  )
}
`

/**
 * Recipe 7: Advanced Chat with Full Control
 * 
 * Use individual hooks for maximum customization.
 */
export const RecipeAdvanced = `
import {
  useClarityChat,
  ChatWindow,
  convertCoreMessagesToMessages,
  useAutoScroll,
  useTokenTracker,
  ErrorBoundary,
} from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

function App() {
  const chat = useClarityChat({
    api: '/api/chat',
    memory: { enabled: true, strategy: 'vector-store' },
    transport: 'sse',
  })

  const messages = convertCoreMessagesToMessages(chat.messages)
  const { scrollRef } = useAutoScroll({ dependencies: [messages] })
  const tokenTracker = useTokenTracker({ modelName: 'gpt-4' })

  return (
    <ErrorBoundary>
      <div ref={scrollRef} style={{ height: '100vh' }}>
        <ChatWindow
          messages={messages}
          isLoading={chat.isLoading}
          onSendMessage={async (content) => {
            await chat.append({ role: 'user', content })
          }}
        />
        <TokenCounter tokens={tokenTracker.totalTokens} />
      </div>
    </ErrorBoundary>
  )
}
`

/**
 * Recipe 8: Multi-User Chat
 * 
 * Handle multiple users with user identification.
 */
export const RecipeMultiUser = `
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

function App({ userId }: { userId: string }) {
  return (
    <ClarityChat
      api="/api/chat"
      body={{ userId }}
      headers={{ 'X-User-ID': userId }}
      sessionTitle={\`Chat - User \${userId}\`}
    />
  )
}
`

/**
 * Recipe 9: Chat with Streaming
 * 
 * Handle streaming responses with real-time updates.
 */
export const RecipeStreaming = `
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

function App() {
  const chat = useClarityChat({
    api: '/api/chat/stream',
    transport: 'sse', // Server-Sent Events for streaming
  })

  const messages = convertCoreMessagesToMessages(chat.messages)

  return (
    <ChatWindow
      messages={messages}
      isLoading={chat.isLoading}
      onSendMessage={async (content) => {
        await chat.append({ role: 'user', content })
      }}
    />
  )
}
`

/**
 * Recipe 10: Chat with Error Recovery
 * 
 * Automatic retry and error handling.
 */
export const RecipeErrorRecovery = `
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

function App() {
  return (
    <ClarityChat
      api="/api/chat"
      onError={(error) => {
        // Custom error handling
        logger.logger.error('Chat error:', error)
        // Show user-friendly message
        toast.logger.error('Failed to send message. Please try again.')
      }}
    />
  )
}
`
