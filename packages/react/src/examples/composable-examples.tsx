/**
 * Composable Hook Examples
 * 
 * Demonstrates how to compose multiple features together
 */

import {
  useChatComposable,
  useChatWithFeatures,
  createChatHook,
} from '../hooks/use-chat-composable'
import { ChatWindow } from '../components/chat-window'
import '@clarity-chat/react/styles.css'

/**
 * Example 1: Using useChatComposable with features object
 */
export function ComposableExample() {
  const chat = useChatComposable({
    api: '/api/chat',
    features: {
      memory: {
        enabled: true,
        strategy: 'vector-store',
        maxTokens: 8000,
      },
      persistence: {
        enabled: true,
        storageKey: 'my-chat-session',
      },
      analytics: {
        onMessageSent: (content) => {
          console.log('Message sent:', content)
        },
        onMessageReceived: (messageId) => {
          console.log('Message received:', messageId)
        },
      },
    },
  })

  return (
    <div style={{ height: '600px' }}>
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={chat.sendMessage}
      />
    </div>
  )
}

/**
 * Example 2: Using useChatWithFeatures (simpler API)
 */
export function FeaturesExample() {
  const chat = useChatWithFeatures({
    api: '/api/chat',
    memory: {
      strategy: 'vector-store',
      maxTokens: 8000,
    },
    persistence: {
      storageKey: 'my-chat',
    },
  })

  return (
    <div style={{ height: '600px' }}>
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={chat.sendMessage}
      />
    </div>
  )
}

/**
 * Example 3: Using builder pattern
 */
export function BuilderExample() {
  const chat = createChatHook('/api/chat')
    .withMemory('vector-store', 8000)
    .withPersistence('my-chat-session')
    .withAnalytics({
      onMessageSent: (content) => console.log('Sent:', content),
      onMessageReceived: (id) => console.log('Received:', id),
    })
    .withErrorRecovery(3)
    .build()

  return (
    <div style={{ height: '600px' }}>
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={chat.sendMessage}
      />
    </div>
  )
}

/**
 * Example 4: Progressive enhancement
 */
export function ProgressiveExample() {
  // Start simple
  const basicChat = useChatComposable({
    api: '/api/chat',
  })

  // Add features as needed
  const enhancedChat = useChatComposable({
    api: '/api/chat',
    features: {
      memory: { enabled: true },
      persistence: { enabled: true },
    },
  })

  return (
    <div>
      <h2>Basic Chat</h2>
      <div style={{ height: '300px' }}>
        <ChatWindow
          messages={basicChat.messages}
          isLoading={basicChat.isLoading}
          onSendMessage={basicChat.sendMessage}
        />
      </div>

      <h2>Enhanced Chat</h2>
      <div style={{ height: '300px' }}>
        <ChatWindow
          messages={enhancedChat.messages}
          isLoading={enhancedChat.isLoading}
          onSendMessage={enhancedChat.sendMessage}
        />
      </div>
    </div>
  )
}
