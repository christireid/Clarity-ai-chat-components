import { logger } from '@clarity-chat/utils/logger';
import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Offline-First Chat Recipe - Clarity Chat Components',
  description:
    'Build an offline-first chat application with IndexedDB storage and automatic sync.',
}

export default function OfflineFirstChatRecipePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Recipe</span>
        <h1>Offline-First Chat</h1>
        <p className="docs-lead">
          Build an offline-first chat application with IndexedDB storage,
          automatic sync, and pending operation queue.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Set up IndexedDB storage',
          'Implement offline message storage',
          'Queue pending operations',
          'Handle automatic sync',
          'Resolve sync conflicts',
          'Show offline indicators',
        ]}
      />

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          This recipe shows how to build an offline-first chat application that
          works seamlessly when the user is offline, storing messages locally
          and automatically syncing when connection is restored.
        </p>
      </section>

      <section className="docs-section">
        <h2>Basic Setup</h2>
        <p>Set up offline chat with automatic sync:</p>
        <CodePlayground
          initialCode={`import { OfflineChatSync, useOfflineChat } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function OfflineChatApp() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const { isOnline, syncStatus, pendingOperations } = useOfflineChat()

  return (
    <div>
      <OfflineChatSync
        messages={messages}
        onStatusChange={(status) => {
          logger.debug('Sync status:', status)
        }}
        onSyncComplete={(synced) => {
          logger.debug(\`Synced \${synced} messages\`)
        }}
      />
      {!isOnline && (
        <div className="offline-banner">
          Offline - {pendingOperations.length} operations pending
        </div>
      )}
      <ChatWindow messages={messages} />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Send Messages Offline</h2>
        <p>Send messages that queue when offline:</p>
        <CodePlayground
          initialCode={`import { useOfflineChat } from '@clarity-chat/react'

function OfflineMessageSender() {
  const { isOnline, sync } = useOfflineChat()

  const sendMessage = async (content: string) => {
    const message = {
      id: generateId(),
      content,
      role: 'user' as const,
      timestamp: Date.now(),
    }

    if (isOnline) {
      // Send immediately
      await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify(message),
      })
    } else {
      // Store locally - will sync when online
      // OfflineChatSync handles this automatically
    }

    setMessages([...messages, message])
  }

  return <ChatInput onSend={sendMessage} />
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Load Stored Messages</h2>
        <p>Load messages from IndexedDB on app start:</p>
        <CodePlayground
          initialCode={`import { useOfflineChat } from '@clarity-chat/react'

function LoadStoredMessages() {
  const { storedMessages, loadStoredMessages, isOnline } = useOfflineChat()
  const [messages, setMessages] = React.useState<Message[]>([])

  React.useEffect(() => {
    loadStoredMessages()
  }, [])

  React.useEffect(() => {
    if (storedMessages.length > 0) {
      setMessages(storedMessages)
    }
  }, [storedMessages])

  return (
    <div>
      {!isOnline && storedMessages.length > 0 && (
        <div>Showing {storedMessages.length} stored messages</div>
      )}
      <ChatWindow messages={messages} />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Sync Status Indicator</h2>
        <p>Show sync status to users:</p>
        <CodePlayground
          initialCode={`function SyncStatus({ syncStatus, pendingCount }: { syncStatus: string, pendingCount: number }) {
  return (
    <div className={\`sync-status \${syncStatus}\`}>
      {syncStatus === 'online' && <div>✓ Online</div>}
      {syncStatus === 'offline' && (
        <div>⚠ Offline - {pendingCount} pending</div>
      )}
      {syncStatus === 'syncing' && <div>⟳ Syncing...</div>}
      {syncStatus === 'error' && <div>✗ Sync error</div>}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Complete Example</h2>
        <p>Complete offline-first chat implementation:</p>
        <CodePlayground
          initialCode={`import { OfflineChatSync, useOfflineChat } from '@clarity-chat/react'
import { ChatWindow, ChatInput } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function CompleteOfflineChat() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const {
    isOnline,
    syncStatus,
    pendingOperations,
    storedMessages,
    sync,
    loadStoredMessages,
  } = useOfflineChat({
    config: {
      maxMessages: 2000,
      maxPending: 200,
      syncInterval: 10000,
    },
    autoSync: true,
  })

  // Load stored messages on mount
  React.useEffect(() => {
    loadStoredMessages()
  }, [])

  // Use stored messages when offline
  React.useEffect(() => {
    if (!isOnline && storedMessages.length > 0) {
      setMessages(storedMessages)
    }
  }, [isOnline, storedMessages])

  const handleSend = async (content: string) => {
    const message: Message = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: Date.now(),
    }

    setMessages([...messages, message])

    if (isOnline) {
      try {
        await fetch('/api/messages', {
          method: 'POST',
          body: JSON.stringify(message),
        })
      } catch (error) {
        logger.logger.error('Failed to send message:', error)
      }
    }
  }

  return (
    <div>
      <OfflineChatSync
        messages={messages}
        onStatusChange={(status) => {
          if (status === 'online') {
            sync()
          }
        }}
      />
      <SyncStatus
        syncStatus={syncStatus}
        pendingCount={pendingOperations.length}
      />
      <ChatWindow messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Store messages in IndexedDB for offline access</li>
          <li>Queue operations when offline and sync when online</li>
          <li>Show clear offline indicators to users</li>
          <li>Load stored messages on app initialization</li>
          <li>Handle sync conflicts gracefully</li>
          <li>Set appropriate storage limits</li>
          <li>Provide manual sync option</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/offline-chat-sync">
              OfflineChatSync
            </a>{' '}
            - Offline sync component
          </li>
          <li>
            <a href="/reference/hooks/use-offline-chat">useOfflineChat</a> -
            Offline chat hook
          </li>
        </ul>
      </section>
    </div>
  )
}
