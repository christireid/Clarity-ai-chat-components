import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'State Management Patterns - Clarity Chat Components',
  description:
    'Learn state management patterns for chat applications including message state, conversation state, and global state.',
}

export default function StateManagementPatternsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>State Management Patterns</h1>
        <p className="docs-lead">
          Learn state management patterns for chat applications including
          message state, conversation state, global state, and persistence.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Manage message state',
          'Handle conversation state',
          'Use global state patterns',
          'Persist state to storage',
          'Sync state across components',
        ]}
      />

      <section className="docs-section">
        <h2>Message State Management</h2>
        <p>Manage message state with hooks:</p>
        <CodePlayground
          initialCode={`import { useClarityChat } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function ChatWithState() {
  const {
    messages,
    setMessages,
    isLoading,
    error,
    sendMessage,
  } = useClarityChat({
    api: '/api/chat',
  })

  // Messages are automatically managed
  // setMessages is available for manual updates
  // sendMessage handles adding new messages

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Conversation State</h2>
        <p>Manage conversation state:</p>
        <CodePlayground
          initialCode={`import { useState, useEffect } from 'react'
import { useClarityChat } from '@clarity-chat/react'

function ConversationManager() {
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState([])

  const chat = useClarityChat({
    api: '/api/chat',
    conversationId,
  })

  // Load conversation
  const loadConversation = async (id: string) => {
    const conversation = await fetch(\`/api/conversations/\${id}\`).then(r => r.json())
    setConversationId(id)
    // Messages are loaded automatically via conversationId
  }

  // Create new conversation
  const createConversation = async () => {
    const newConv = await fetch('/api/conversations', {
      method: 'POST',
    }).then(r => r.json())
    setConversationId(newConv.id)
  }

  return (
    <div>
      <ConversationList
        conversations={conversations}
        onSelect={loadConversation}
      />
      <ChatWindow messages={chat.messages} />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Global State with Context</h2>
        <p>Use Context for global state:</p>
        <CodePlayground
          initialCode={`import { createContext, useContext, useState } from 'react'
import { useClarityChat } from '@clarity-chat/react'

interface ChatContextType {
  currentConversation: string | null
  setCurrentConversation: (id: string | null) => void
  chat: ReturnType<typeof useClarityChat>
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const chat = useClarityChat({
    api: '/api/chat',
    conversationId: currentConversation,
  })

  return (
    <ChatContext.Provider value={{ currentConversation, setCurrentConversation, chat }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) throw new Error('useChatContext must be used within ChatProvider')
  return context
}

// Usage
function ChatComponent() {
  const { chat, setCurrentConversation } = useChatContext()
  return <ChatWindow messages={chat.messages} />
}`}
        />
      </section>

      <section className="docs-section">
        <h2>State Persistence</h2>
        <p>Persist state to localStorage or IndexedDB:</p>
        <CodePlayground
          initialCode={`import { useClarityChat } from '@clarity-chat/react'
import { useLocalStorage } from '@clarity-chat/react'

function PersistentChat() {
  // Persist conversation ID
  const [conversationId, setConversationId] = useLocalStorage('conversationId', null)

  const chat = useClarityChat({
    api: '/api/chat',
    conversationId,
  })

  // Persist messages to IndexedDB
  React.useEffect(() => {
    if (chat.messages.length > 0) {
      saveToIndexedDB('messages', chat.messages)
    }
  }, [chat.messages])

  // Load messages from IndexedDB on mount
  React.useEffect(() => {
    loadFromIndexedDB('messages').then(setMessages)
  }, [])

  return <ChatWindow messages={chat.messages} />
}`}
        />
      </section>

      <section className="docs-section">
        <h2>State Synchronization</h2>
        <p>Sync state across multiple components:</p>
        <CodePlayground
          initialCode={`import { useClarityChat } from '@clarity-chat/react'
import { useTokenTracker } from '@clarity-chat/react'

function SyncedChat() {
  const chat = useClarityChat({ api: '/api/chat' })
  
  // Token tracking syncs with messages
  const tokens = useTokenTracker(chat.messages)
  
  // Both components use same message state
  return (
    <div>
      <ChatWindow messages={chat.messages} />
      <TokenCounter
        inputTokens={tokens.inputTokens}
        outputTokens={tokens.outputTokens}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Optimistic Updates</h2>
        <p>Use optimistic updates for better UX:</p>
        <CodePlayground
          initialCode={`import { useClarityChat } from '@clarity-chat/react'
import { useOptimistic } from 'react'

function OptimisticChat() {
  const chat = useClarityChat({ api: '/api/chat' })
  
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    chat.messages,
    (state, newMessage: Message) => [...state, newMessage]
  )

  const handleSend = async (content: string) => {
    // Add optimistically
    const optimisticMsg: Message = {
      id: 'temp-' + Date.now(),
      role: 'user',
      content,
    }
    addOptimisticMessage(optimisticMsg)

    // Send to server
    await chat.sendMessage(content)
  }

  return (
    <ChatWindow
      messages={optimisticMessages}
      onSendMessage={handleSend}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use hooks for automatic state management</li>
          <li>Use Context for shared state across components</li>
          <li>Persist important state to storage</li>
          <li>Use optimistic updates for better UX</li>
          <li>Sync related state automatically</li>
          <li>Handle loading and error states</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/hooks/use-clarity-chat">useClarityChat</a> -
            Main chat hook
          </li>
          <li>
            <a href="/reference/hooks/use-local-storage">useLocalStorage</a> -
            Local storage hook
          </li>
          <li>
            <a href="/guides/composition-patterns">
              Composition Patterns Guide
            </a>{' '}
            - Composition guide
          </li>
        </ul>
      </section>
    </div>
  )
}
