'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Offline-First Recipe | Clarity Chat Cookbook',
  description:
    'Learn how to build chat applications that work offline with message queuing and automatic sync.',
}

export default function OfflineFirstPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Offline-First Recipe</h1>

      <p className="lead">
        Build chat applications that work offline with message queuing,
        automatic sync, and conflict resolution. Perfect for mobile apps and
        unreliable networks.
      </p>

      <Callout type="info" title="Offline-First Benefits">
        <p>
          Offline-first apps work even when the network is unavailable. Messages
          are queued locally and automatically synced when connectivity is
          restored.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Use OfflineChatSync component for automatic offline support:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { OfflineChatSync, ClarityChat } from '@clarity-chat/react/internal'
import '@clarity-chat/react/styles.css'

function OfflineChat() {
  return (
    <OfflineChatSync
      api="/api/chat"
      storageKey="chat-messages"
    >
      <ClarityChat api="/api/chat" />
    </OfflineChatSync>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">With useClarityChat</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Implement offline support manually:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat } from '@clarity-chat/react/internal'
import { useEffect, useState } from 'react'

function OfflineChat() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingMessages, setPendingMessages] = useState([])

  const chat = useClarityChat({
    api: '/api/chat',
  })

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chat-messages')
    if (saved) {
      const messages = JSON.parse(saved)
      chat.setMessages(messages)
    }
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    if (chat.messages.length > 0) {
      localStorage.setItem('chat-messages', JSON.stringify(chat.messages))
    }
  }, [chat.messages])

  // Sync pending messages when online
  useEffect(() => {
    if (isOnline && pendingMessages.length > 0) {
      pendingMessages.forEach(async (message) => {
        try {
          await chat.append(message)
          setPendingMessages(prev => prev.filter(m => m.id !== message.id))
        } catch (error) {
          console.error('Failed to sync message:', error)
        }
      })
    }
  }, [isOnline, pendingMessages])

  const handleSend = async (content: string) => {
    const message = { role: 'user', content, id: Date.now().toString() }

    if (isOnline) {
      try {
        await chat.append(message)
      } catch (error) {
        // Network error - queue for later
        setPendingMessages(prev => [...prev, message])
      }
    } else {
      // Offline - queue message
      setPendingMessages(prev => [...prev, message])
      // Show optimistic update
      chat.setMessages(prev => [...prev, message])
    }
  }

  return (
    <div>
      {!isOnline && (
        <div className="offline-banner">
          You're offline. Messages will be sent when connection is restored.
        </div>
      )}
      {pendingMessages.length > 0 && (
        <div className="pending-count">
          {pendingMessages.length} message(s) pending
        </div>
      )}
      <ChatWindow
        messages={chat.messages}
        onSendMessage={handleSend}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">IndexedDB Storage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Use IndexedDB for larger storage capacity:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useIndexedDB } from '@clarity-chat/react/internal'

function OfflineChat() {
  const { get, set } = useIndexedDB('chat-db', 'messages')

  const chat = useClarityChat({
    api: '/api/chat',
  })

  // Load from IndexedDB
  useEffect(() => {
    get('messages').then(messages => {
      if (messages) {
        chat.setMessages(messages)
      }
    })
  }, [])

  // Save to IndexedDB
  useEffect(() => {
    if (chat.messages.length > 0) {
      set('messages', chat.messages)
    }
  }, [chat.messages])

  return <ChatWindow messages={chat.messages} />
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Message Queue Management</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Implement a robust message queue:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`interface QueuedMessage {
  id: string
  message: CoreMessage
  timestamp: number
  retries: number
  status: 'pending' | 'sending' | 'sent' | 'failed'
}

function useMessageQueue() {
  const [queue, setQueue] = useState<QueuedMessage[]>([])
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  const addToQueue = (message: CoreMessage) => {
    const queued: QueuedMessage = {
      id: generateId(),
      message,
      timestamp: Date.now(),
      retries: 0,
      status: 'pending',
    }
    setQueue(prev => [...prev, queued])
    return queued.id
  }

  const processQueue = async () => {
    if (!isOnline) return

    const pending = queue.filter(m => m.status === 'pending')
    for (const item of pending) {
      try {
        setQueue(prev => prev.map(m =>
          m.id === item.id ? { ...m, status: 'sending' } : m
        ))

        await sendMessage(item.message)

        setQueue(prev => prev.map(m =>
          m.id === item.id ? { ...m, status: 'sent' } : m
        ))
      } catch (error) {
        setQueue(prev => prev.map(m =>
          m.id === item.id
            ? { ...m, status: 'failed', retries: m.retries + 1 }
            : m
        ))
      }
    }
  }

  // Process queue when online
  useEffect(() => {
    if (isOnline) {
      processQueue()
    }
  }, [isOnline, queue])

  return { queue, addToQueue, processQueue }
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Conflict Resolution</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Handle conflicts when syncing:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`function resolveConflicts(
  localMessages: Message[],
  serverMessages: Message[]
): Message[] {
  // Merge messages by timestamp
  const merged = [...localMessages, ...serverMessages]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  // Remove duplicates by ID
  const unique = merged.filter((msg, index, self) =>
    index === self.findIndex(m => m.id === msg.id)
  )

  // For messages with same ID but different content, prefer server version
  const resolved = unique.map(msg => {
    const serverVersion = serverMessages.find(m => m.id === msg.id)
    return serverVersion || msg
  })

  return resolved
}

// Usage
const localMessages = await loadFromLocalStorage()
const serverMessages = await fetchFromServer()
const resolved = resolveConflicts(localMessages, serverMessages)
chat.setMessages(resolved)`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Network Status Indicator</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Show network status to users:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { NetworkStatus } from '@clarity-chat/react/internal'

function Chat() {
  return (
    <div>
      <NetworkStatus
        showWhenOffline
        position="top-right"
      />
      <ClarityChat api="/api/chat" />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Show optimistic updates</strong> - Display messages
            immediately, even offline
          </li>
          <li>
            <strong>Queue failed messages</strong> - Retry when connection is
            restored
          </li>
          <li>
            <strong>Use IndexedDB for large data</strong> - More storage than
            localStorage
          </li>
          <li>
            <strong>Resolve conflicts intelligently</strong> - Merge local and
            server messages
          </li>
          <li>
            <strong>Show network status</strong> - Let users know when they're
            offline
          </li>
          <li>
            <strong>Limit queue size</strong> - Prevent storage overflow
          </li>
          <li>
            <strong>Sync in background</strong> - Don't block UI during sync
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/reference/components/offline-chat-sync"
            className="docs-card"
          >
            <h3>OfflineChatSync Component</h3>
            <p>Component for offline support</p>
          </a>
          <a href="/reference/hooks/use-indexed-db" className="docs-card">
            <h3>useIndexedDB Hook</h3>
            <p>IndexedDB persistence hook</p>
          </a>
          <a href="/reference/hooks/use-local-storage" className="docs-card">
            <h3>useLocalStorage Hook</h3>
            <p>LocalStorage persistence hook</p>
          </a>
          <a href="/cookbook/error-handling" className="docs-card">
            <h3>Error Handling Recipe</h3>
            <p>Handle sync errors</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{
          title: 'Custom Tool Integration',
          href: '/cookbook/custom-tool-integration',
        }}
        next={{
          title: 'Real-Time Collaboration',
          href: '/cookbook/real-time-collaboration',
        }}
      />
    </>
  )
}
