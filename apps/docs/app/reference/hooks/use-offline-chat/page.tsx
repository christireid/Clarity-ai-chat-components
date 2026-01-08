import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'useOfflineChat - Clarity Chat Components',
  description:
    'Hook for offline-first chat with IndexedDB storage and automatic sync.',
}

const optionsProps: Prop[] = [
  {
    name: 'config',
    type: 'Partial<OfflineStorageConfig>',
    description: 'Offline storage configuration',
  },
  {
    name: 'autoSync',
    type: 'boolean',
    description: 'Enable automatic sync when online (default: true)',
  },
  {
    name: 'syncInterval',
    type: 'number',
    description: 'Sync interval in milliseconds',
  },
]

export default function UseOfflineChatPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useOfflineChat</h1>
        <p className="docs-lead">
          Hook for offline-first chat with IndexedDB storage, automatic sync,
          and pending operation management.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Manage offline chat state',
          'Store messages in IndexedDB',
          'Queue pending operations',
          'Handle automatic sync',
          'Monitor sync status',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Enable offline chat functionality:</p>
        <CodePlayground
          initialCode={`import { useOfflineChat } from '@clarity-chat/react/internal'
import type { Message } from '@clarity-chat/types'

function OfflineChatApp({ messages }: { messages: Message[] }) {
  const {
    isOnline,
    syncStatus,
    pendingOperations,
    storedMessages,
    sync,
    clearStorage,
  } = useOfflineChat()

  React.useEffect(() => {
    // Messages are automatically stored when offline
  }, [messages])

  return (
    <div>
      <div>Status: {syncStatus}</div>
      {!isOnline && (
        <div>Offline - {pendingOperations.length} operations pending</div>
      )}
      <button onClick={sync} disabled={!isOnline}>
        Sync Now
      </button>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Manual Sync</h2>
        <p>Manually trigger sync:</p>
        <CodePlayground
          initialCode={`import { useOfflineChat } from '@clarity-chat/react/internal'

function ManualSync() {
  const { sync, isSyncing, lastSyncTime } = useOfflineChat()

  return (
    <div>
      <button onClick={sync} disabled={isSyncing}>
        {isSyncing ? 'Syncing...' : 'Sync Now'}
      </button>
      {lastSyncTime && (
        <div>Last sync: {new Date(lastSyncTime).toLocaleString()}</div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Pending Operations</h2>
        <p>Track and manage pending operations:</p>
        <CodePlayground
          initialCode={`import { useOfflineChat } from '@clarity-chat/react/internal'

function PendingOps() {
  const { pendingOperations, retryOperation, clearPending } = useOfflineChat()

  return (
    <div>
      <div>Pending: {pendingOperations.length}</div>
      {pendingOperations.map(op => (
        <div key={op.id}>
          <div>{op.type}: {op.messageId}</div>
          <div>Retries: {op.retryCount}</div>
          <button onClick={() => retryOperation(op.id)}>
            Retry
          </button>
        </div>
      ))}
      <button onClick={clearPending}>Clear All</button>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Stored Messages</h2>
        <p>Access messages stored in IndexedDB:</p>
        <CodePlayground
          initialCode={`import { useOfflineChat } from '@clarity-chat/react/internal'

function StoredMessages() {
  const { storedMessages, loadStoredMessages } = useOfflineChat()

  React.useEffect(() => {
    loadStoredMessages()
  }, [])

  return (
    <div>
      <div>Stored messages: {storedMessages.length}</div>
      {storedMessages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Configuration</h2>
        <p>Configure offline storage:</p>
        <CodePlayground
          initialCode={`import { useOfflineChat } from '@clarity-chat/react/internal'

function ConfiguredOffline() {
  const { syncStatus } = useOfflineChat({
    config: {
      maxMessages: 2000,
      maxPending: 200,
      maxRetries: 5,
      syncInterval: 10000,
    },
    autoSync: true,
  })

  return <div>Status: {syncStatus}</div>
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Options</h2>
        <PropsTable props={optionsProps} />
      </section>

      <section className="docs-section">
        <h2>Return Values</h2>
        <ul>
          <li>
            <code>isOnline</code>: Whether device is online
          </li>
          <li>
            <code>syncStatus</code>: Current sync status ('online' | 'offline' |
            'syncing' | 'error')
          </li>
          <li>
            <code>pendingOperations</code>: Array of pending operations
          </li>
          <li>
            <code>storedMessages</code>: Messages stored in IndexedDB
          </li>
          <li>
            <code>sync</code>: Function to manually trigger sync
          </li>
          <li>
            <code>clearStorage</code>: Function to clear IndexedDB storage
          </li>
          <li>
            <code>loadStoredMessages</code>: Function to load stored messages
          </li>
          <li>
            <code>retryOperation</code>: Function to retry a pending operation
          </li>
          <li>
            <code>clearPending</code>: Function to clear all pending operations
          </li>
          <li>
            <code>isSyncing</code>: Whether sync is in progress
          </li>
          <li>
            <code>lastSyncTime</code>: Timestamp of last successful sync
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Enable <code>autoSync</code> for automatic synchronization
          </li>
          <li>
            Monitor <code>syncStatus</code> to show user feedback
          </li>
          <li>
            Handle <code>pendingOperations</code> to show what's queued
          </li>
          <li>
            Use <code>storedMessages</code> to display offline content
          </li>
          <li>Set appropriate storage limits in config</li>
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
            <a href="/cookbook/offline-first-chat">Offline-First Chat Recipe</a>{' '}
            - Complete offline implementation
          </li>
        </ul>
      </section>
    </div>
  )
}
