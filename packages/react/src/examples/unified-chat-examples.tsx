/**
 * Unified Chat Hook Examples
 *
 * Demonstrates the simplified useChat hook API
 */

import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

/**
 * Basic Example - Simplest usage
 */
export function BasicUseChatExample() {
  const { messages, sendMessage, isLoading } = useChat({
    api: '/api/chat',
  })

  return (
    <div style={{ height: '600px' }}>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={sendMessage}
      />
    </div>
  )
}

/**
 * With Persistence - Messages saved to localStorage
 */
export function PersistentChatExample() {
  const { messages, sendMessage, isLoading, clearMessages } = useChat({
    api: '/api/chat',
    persistMessages: true,
    storageKey: 'my-chat-session',
  })

  return (
    <div style={{ height: '600px' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <button onClick={clearMessages}>Clear Chat</button>
      </div>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={sendMessage}
      />
    </div>
  )
}

/**
 * With Memory - Enterprise features
 */
export function MemoryChatExample() {
  const { messages, sendMessage, isLoading, chat } = useChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'vector-store',
    },
  })

  return (
    <div style={{ height: '600px' }}>
      {chat.memoryInfo.enabled && (
        <div
          style={{
            padding: '0.5rem',
            background: '#f3f4f6',
            fontSize: '0.875rem',
          }}
        >
          Memory: {chat.memoryInfo.memoryCount} memories stored
        </div>
      )}
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={sendMessage}
      />
    </div>
  )
}

/**
 * Full Control - Access to underlying chat object
 */
export function FullControlExample() {
  const { messages, sendMessage, isLoading, chat, error } = useChat({
    api: '/api/chat',
    autoScroll: true,
  })

  return (
    <div style={{ height: '600px' }}>
      {error && (
        <div
          style={{ padding: '1rem', background: '#fef2f2', color: '#991b1b' }}
        >
          Error: {error.message}
        </div>
      )}
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={sendMessage}
      />
      {/* Access to full chat API */}
      <div style={{ padding: '1rem', fontSize: '0.875rem' }}>
        <div>Input: {chat.input}</div>
        <div>Messages: {chat.messages.length}</div>
      </div>
    </div>
  )
}
