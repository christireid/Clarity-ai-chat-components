'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  WifiOff,
  Wifi,
  Cloud,
  CloudOff,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertCircle,
  Zap,
  Database,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'

// ISR Configuration
export const revalidate = 3600

// ============================================================================
// Interactive Demo Component
// ============================================================================

function StatusBar({
  isOnline,
  pendingCount,
  isSyncing,
}: {
  isOnline: boolean
  pendingCount: number
  isSyncing: boolean
}) {
  return (
    <div
      className={cn(
        'px-4 py-2 border-b border-border/50 flex items-center gap-2 text-xs',
        isOnline ? 'bg-green-500/10' : 'bg-orange-500/10'
      )}
    >
      {isOnline ? (
        <>
          <Cloud className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-green-600 dark:text-green-400">
            Synced with server
          </span>
        </>
      ) : (
        <>
          <CloudOff className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span className="text-orange-600 dark:text-orange-400">
            Working offline - messages will sync when connection restores
          </span>
        </>
      )}
    </div>
  )
}

function ConnectionControls({
  isOnline,
  pendingMessages,
  isSyncing,
  onToggle,
}: {
  isOnline: boolean
  pendingMessages: string[]
  isSyncing: boolean
  onToggle: () => void
}) {
  return (
    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-orange-500" />
          )}
          <span className="text-sm font-medium">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <button
          onClick={onToggle}
          className="px-3 py-1.5 text-xs rounded-md bg-brand-500 text-white hover:bg-brand-600 transition-colors"
        >
          Toggle {isOnline ? 'Offline' : 'Online'}
        </button>
      </div>

      {pendingMessages.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
          <Clock className="w-4 h-4" />
          {pendingMessages.length} message(s) pending sync
          {isOnline && isSyncing && (
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Syncing...
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function OfflineChatDemo() {
  const [isOnline, setIsOnline] = React.useState(true)
  const [messages, setMessages] = React.useState([
    {
      id: '1',
      content: 'Hello! Try going offline to see sync behavior.',
      role: 'assistant',
      synced: true,
      timestamp: Date.now() - 60000,
    },
  ])
  const [pendingMessages, setPendingMessages] = React.useState<string[]>([])
  const [inputValue, setInputValue] = React.useState('')
  const [isSyncing, setIsSyncing] = React.useState(false)

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      content: inputValue,
      role: 'user' as const,
      synced: isOnline,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, newMessage])

    if (!isOnline) {
      setPendingMessages((prev) => [...prev, newMessage.id])
    }

    setInputValue('')

    // Simulate AI response (only if online)
    if (isOnline) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            content: 'Response to: ' + inputValue,
            role: 'assistant',
            synced: true,
            timestamp: Date.now(),
          },
        ])
      }, 1000)
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setMessages((prev) =>
      prev.map((msg) => ({
        ...msg,
        synced: true,
      }))
    )
    setPendingMessages([])
    setIsSyncing(false)
  }

  React.useEffect(() => {
    if (isOnline && pendingMessages.length > 0) {
      handleSync()
    }
  }, [isOnline, pendingMessages.length])

  return (
    <div className="space-y-4">
      <ConnectionControls
        isOnline={isOnline}
        pendingMessages={pendingMessages}
        isSyncing={isSyncing}
        onToggle={() => setIsOnline(!isOnline)}
      />

      {/* Chat Window */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        <StatusBar
          isOnline={isOnline}
          pendingCount={pendingMessages.length}
          isSyncing={isSyncing}
        />

        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-3 bg-background/50">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cn(
                  'p-3 rounded-lg shadow-sm max-w-[85%]',
                  message.role === 'user'
                    ? 'ml-auto bg-brand-500 text-white'
                    : 'bg-muted/50 text-foreground'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm flex-1">{message.content}</p>
                  {message.synced ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 opacity-50" />
                  ) : (
                    <Clock className="w-4 h-4 shrink-0 opacity-50" />
                  )}
                </div>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function OfflineChatSyncPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-docs py-8">
        {/* Header */}
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
              <CloudOff className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Offline Chat with Sync</h1>
              <p className="text-muted-foreground">
                Build resilient chat applications that work offline and sync
                when connectivity returns
              </p>
            </div>
          </div>

          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                This recipe demonstrates how to build a chat application that
                continues working offline, stores messages locally, and
                automatically syncs when the network connection is restored.
                Perfect for mobile apps, PWAs, or any application where reliable
                connectivity can't be guaranteed.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3">
                What You'll Learn
              </h3>
              <ul className="space-y-2">
                <li>Detecting online/offline status</li>
                <li>Storing messages in IndexedDB for offline access</li>
                <li>Implementing automatic sync with conflict resolution</li>
                <li>Queue management for pending messages</li>
                <li>Optimistic UI updates</li>
                <li>Network status indicators</li>
              </ul>
            </div>
          </section>

          {/* Interactive Demo */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Interactive Demo</h2>
            <p className="text-muted-foreground mb-6">
              Try sending messages while toggling between online and offline
              modes:
            </p>
            <OfflineChatDemo />
          </section>

          {/* Implementation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Implementation</h2>

            <h3 className="text-xl font-semibold mb-4">
              Step 1: Network Status Detection
            </h3>
            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground">
                Create a hook to monitor online/offline status:
              </p>

              <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { useState, useEffect } from 'react'

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

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

  return isOnline
}`}</code>
                </pre>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">
              Step 2: IndexedDB Storage
            </h3>
            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground">
                Set up IndexedDB for persistent local storage:
              </p>

              <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`// lib/db.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface ChatDB extends DBSchema {
  messages: {
    key: string
    value: {
      id: string
      content: string
      role: 'user' | 'assistant'
      timestamp: number
      synced: boolean
      conversationId: string
    }
    indexes: { 'by-conversation': string; 'by-synced': boolean }
  }
  queue: {
    key: string
    value: {
      id: string
      messageId: string
      action: 'create' | 'update' | 'delete'
      data: unknown
      timestamp: number
      retryCount: number
    }
  }
}

let dbPromise: Promise<IDBPDatabase<ChatDB>>

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<ChatDB>('clarity-chat-offline', 1, {
      upgrade(db) {
        // Messages store
        const messageStore = db.createObjectStore('messages', {
          keyPath: 'id',
        })
        messageStore.createIndex('by-conversation', 'conversationId')
        messageStore.createIndex('by-synced', 'synced')

        // Sync queue store
        db.createObjectStore('queue', { keyPath: 'id' })
      },
    })
  }
  return dbPromise
}

// Message operations
export async function saveMessage(message: ChatDB['messages']['value']) {
  const db = await getDB()
  await db.put('messages', message)
}

export async function getMessages(conversationId: string) {
  const db = await getDB()
  return db.getAllFromIndex('messages', 'by-conversation', conversationId)
}

export async function getUnsyncedMessages() {
  const db = await getDB()
  return db.getAllFromIndex('messages', 'by-synced', false)
}

// Queue operations
export async function addToQueue(item: ChatDB['queue']['value']) {
  const db = await getDB()
  await db.add('queue', item)
}

export async function getQueueItems() {
  const db = await getDB()
  return db.getAll('queue')
}

export async function removeFromQueue(id: string) {
  const db = await getDB()
  await db.delete('queue', id)
}

export async function clearQueue() {
  const db = await getDB()
  await db.clear('queue')
}`}</code>
                </pre>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">
              Step 3: Offline-First Chat Hook
            </h3>
            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground">
                Combine online status and storage into a unified hook:
              </p>

              <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`// hooks/useOfflineChat.ts
import { useState, useEffect, useCallback } from 'react'
import { useOnlineStatus } from './useOnlineStatus'
import {
  getDB,
  saveMessage,
  getMessages,
  getUnsyncedMessages,
  addToQueue,
  getQueueItems,
  removeFromQueue,
} from '../lib/db'
import type { Message } from '@clarity-chat/types'

export function useOfflineChat(conversationId: string, apiEndpoint: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const isOnline = useOnlineStatus()

  // Load messages from IndexedDB on mount
  useEffect(() => {
    loadMessages()
  }, [conversationId])

  // Sync when coming back online
  useEffect(() => {
    if (isOnline) {
      syncPendingMessages()
    }
  }, [isOnline])

  const loadMessages = async () => {
    const storedMessages = await getMessages(conversationId)
    setMessages(storedMessages as Message[])

    const unsynced = await getUnsyncedMessages()
    setPendingCount(unsynced.length)
  }

  const sendMessage = async (content: string) => {
    const message: Message = {
      id: \`local-\${Date.now()}\`,
      content,
      role: 'user',
      timestamp: Date.now(),
      conversationId,
    }

    // Optimistic update - add to UI immediately
    setMessages(prev => [...prev, message])

    if (isOnline) {
      try {
        // Send to server
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, conversationId }),
        })

        if (!response.ok) throw new Error('Send failed')

        const serverMessage = await response.json()

        // Update with server ID and mark as synced
        await saveMessage({
          ...serverMessage,
          synced: true,
          conversationId,
        })

        loadMessages()
      } catch (error) {
        // Failed while online - queue for retry
        await saveMessage({
          ...message,
          synced: false,
          conversationId,
        })
        await addToQueue({
          id: \`queue-\${Date.now()}\`,
          messageId: message.id,
          action: 'create',
          data: message,
          timestamp: Date.now(),
          retryCount: 0,
        })
        setPendingCount(prev => prev + 1)
      }
    } else {
      // Offline - save locally and queue
      await saveMessage({
        ...message,
        synced: false,
        conversationId,
      })
      await addToQueue({
        id: \`queue-\${Date.now()}\`,
        messageId: message.id,
        action: 'create',
        data: message,
        timestamp: Date.now(),
        retryCount: 0,
      })
      setPendingCount(prev => prev + 1)
    }
  }

  const syncPendingMessages = async () => {
    if (isSyncing || !isOnline) return

    setIsSyncing(true)
    const queueItems = await getQueueItems()

    for (const item of queueItems) {
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: item.data,
            conversationId,
          }),
        })

        if (response.ok) {
          const serverMessage = await response.json()

          // Update local message with server ID
          await saveMessage({
            ...serverMessage,
            synced: true,
            conversationId,
          })

          // Remove from queue
          await removeFromQueue(item.id)
        }
      } catch (error) {
        console.error('Sync failed for message:', item.messageId)
        // Keep in queue for next sync attempt
      }
    }

    await loadMessages()
    setIsSyncing(false)
  }

  return {
    messages,
    sendMessage,
    isSyncing,
    pendingCount,
    isOnline,
    syncNow: syncPendingMessages,
  }
}`}</code>
                </pre>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Step 4: UI Component</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Use the hook in your chat component:
              </p>

              <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { useOfflineChat } from './hooks/useOfflineChat'
import { Cloud, CloudOff, RefreshCw } from 'lucide-react'

export function OfflineChat({ conversationId }: { conversationId: string }) {
  const {
    messages,
    sendMessage,
    isSyncing,
    pendingCount,
    isOnline,
    syncNow,
  } = useOfflineChat(conversationId, '/api/chat')

  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Status Bar */}
      <div className={cn(
        'px-4 py-2 border-b flex items-center justify-between',
        isOnline ? 'bg-green-500/10' : 'bg-orange-500/10'
      )}>
        <div className="flex items-center gap-2 text-sm">
          {isOnline ? (
            <>
              <Cloud className="w-4 h-4 text-green-600" />
              <span>Online</span>
            </>
          ) : (
            <>
              <CloudOff className="w-4 h-4 text-orange-600" />
              <span>Offline</span>
            </>
          )}
          {pendingCount > 0 && (
            <span className="text-xs text-muted-foreground">
              ({pendingCount} pending)
            </span>
          )}
        </div>

        {isOnline && pendingCount > 0 && (
          <button
            onClick={syncNow}
            disabled={isSyncing}
            className="text-sm px-2 py-1 rounded hover:bg-muted"
          >
            <RefreshCw className={cn(
              'w-4 h-4',
              isSyncing && 'animate-spin'
            )} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Advanced Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Advanced Features</h2>
            <div className="space-y-6">
              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">Conflict Resolution</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Handle conflicts when the same message is modified offline
                      and online:
                    </p>
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                      <code>{`// Last-write-wins strategy
const resolveConflict = (local, server) => {
  return local.timestamp > server.timestamp ? local : server
}

// Custom merge strategy
const mergeMessages = (local, server) => ({
  ...server,
  localMetadata: local.metadata,
})`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <div className="flex items-start gap-3">
                  <RefreshCw className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">Exponential Backoff</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Implement smart retry logic for failed syncs:
                    </p>
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                      <code>{`const retryWithBackoff = async (fn, maxRetries = 5) => {
  let attempt = 0
  while (attempt < maxRetries) {
    try {
      return await fn()
    } catch (error) {
      const delay = Math.min(1000 * 2 ** attempt, 30000)
      await new Promise(r => setTimeout(r, delay))
      attempt++
    }
  }
  throw new Error('Max retries exceeded')
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">Background Sync API</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Use the Background Sync API for reliable syncing:
                    </p>
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                      <code>{`// Register background sync in service worker
if ('serviceWorker' in navigator && 'sync' in registration) {
  await registration.sync.register('chat-sync')
}

// In service worker
self.addEventListener('sync', (event) => {
  if (event.tag === 'chat-sync') {
    event.waitUntil(syncPendingMessages())
  }
})`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <ul className="space-y-2">
                <li>
                  <strong>Optimistic Updates:</strong> Update UI immediately for
                  better UX, handle failures gracefully
                </li>
                <li>
                  <strong>Clear Indicators:</strong> Always show sync status and
                  pending message count
                </li>
                <li>
                  <strong>Limit Queue Size:</strong> Cap offline queue at
                  reasonable limit (e.g., 100 messages)
                </li>
                <li>
                  <strong>Periodic Cleanup:</strong> Remove old synced messages
                  from IndexedDB to save space
                </li>
                <li>
                  <strong>Handle Conflicts:</strong> Implement conflict
                  resolution strategy (last-write-wins, merge, prompt user)
                </li>
                <li>
                  <strong>Network Detection:</strong> Use both navigator.onLine
                  and actual API pings for accurate status
                </li>
                <li>
                  <strong>Background Sync:</strong> Use Service Worker
                  Background Sync API when available
                </li>
              </ul>
            </div>
          </section>

          {/* Related Resources */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Related Resources</h2>
            <div className="grid gap-4">
              <Link
                href="/guides/error-handling"
                className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-brand-500" />
                  <div>
                    <h4 className="font-semibold">Error Handling Guide</h4>
                    <p className="text-sm text-muted-foreground">
                      Learn how to handle network errors and retries
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/guides/streaming"
                className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-brand-500" />
                  <div>
                    <h4 className="font-semibold">Streaming Guide</h4>
                    <p className="text-sm text-muted-foreground">
                      Implement streaming with offline support
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
