import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'


export const metadata: Metadata = {
  title: 'OfflineChatSync - Clarity Chat Components',
  description: 'Offline-first chat with IndexedDB storage, automatic sync, and pending operation queue.',
}

const props: Prop[] = [
  {
    name: 'messages',
    type: 'Message[]',
    required: true,
    description: 'Messages to sync',
  },
  {
    name: 'config',
    type: 'Partial<OfflineStorageConfig>',
    description: 'Sync configuration',
  },
  {
    name: 'onStatusChange',
    type: '(status: SyncStatus) => void',
    description: 'Callback when online status changes',
  },
  {
    name: 'onSyncComplete',
    type: '(synced: number) => void',
    description: 'Callback when sync completes',
  },
  {
    name: 'onSyncError',
    type: '(error: Error) => void',
    description: 'Callback when sync fails',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function OfflineChatSyncPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>OfflineChatSync</h1>
        <p className="docs-lead">
          Offline-first chat with IndexedDB storage, automatic sync when online, pending operation queue, and conflict resolution.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Implement offline-first chat',
          'Store messages in IndexedDB',
          'Queue pending operations',
          'Handle automatic sync',
          'Resolve sync conflicts',
        ]}
      />

      <Callout type="info">
        <p>
          <strong>Offline-First:</strong> This component uses IndexedDB to store messages locally and automatically syncs when connection is restored.
        </p>
      </Callout>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>
          Enable offline chat with default configuration:
        </p>
        <CodePlayground
          initialCode={`import { OfflineChatSync } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function OfflineChat({ messages }: { messages: Message[] }) {
  return (
    <OfflineChatSync
      messages={messages}
      onStatusChange={(status) => {
        console.log('Sync status:', status)
      }}
      onSyncComplete={(synced) => {
        console.log(\`Synced \${synced} messages\`)
      }}
      onSyncError={(error) => {
        console.error('Sync error:', error)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Configuration</h2>
        <p>
          Configure storage and sync behavior:
        </p>
        <CodePlayground
          initialCode={`import { OfflineChatSync } from '@clarity-chat/react'

function ConfiguredOfflineChat({ messages }: { messages: Message[] }) {
  return (
    <OfflineChatSync
      messages={messages}
      config={{
        dbName: 'my-chat-offline',
        storeName: 'messages',
        maxMessages: 2000,      // Store up to 2000 messages
        maxPending: 200,        // Queue up to 200 operations
        maxRetries: 5,          // Retry failed operations 5 times
        syncInterval: 10000,    // Sync every 10 seconds
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Sync Status Monitoring</h2>
        <p>
          Monitor sync status and show UI feedback:
        </p>
        <CodePlayground
          initialCode={`import { OfflineChatSync } from '@clarity-chat/react'

function WithStatusIndicator({ messages }: { messages: Message[] }) {
  const [status, setStatus] = React.useState('online')

  return (
    <div>
      <OfflineChatSync
        messages={messages}
        onStatusChange={setStatus}
      />
      {status === 'offline' && (
        <div className="offline-indicator">
          Offline - Changes will sync when online
        </div>
      )}
      {status === 'syncing' && (
        <div className="syncing-indicator">
          Syncing...
        </div>
      )}
      {status === 'error' && (
        <div className="error-indicator">
          Sync error - Retrying...
        </div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Pending Operations</h2>
        <p>
          Track and display pending operations:
        </p>
        <CodePlayground
          initialCode={`import { OfflineChatSync, useOfflineChat } from '@clarity-chat/react'

function WithPendingOps({ messages }: { messages: Message[] }) {
  const { pendingOperations } = useOfflineChat()

  return (
    <div>
      <OfflineChatSync messages={messages} />
      {pendingOperations.length > 0 && (
        <div>
          <div>Pending operations: {pendingOperations.length}</div>
          {pendingOperations.map(op => (
            <div key={op.id}>
              {op.type}: {op.messageId} (Retries: {op.retryCount})
            </div>
          ))}
        </div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={props} />
      </section>

      <section className="docs-section">
        <h2>Sync Status</h2>
        <ul>
          <li><strong>online</strong>: Connected and syncing normally</li>
          <li><strong>offline</strong>: No connection, storing locally</li>
          <li><strong>syncing</strong>: Currently syncing pending operations</li>
          <li><strong>error</strong>: Sync error occurred, will retry</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Configuration Options</h2>
        <ul>
          <li><code>dbName</code>: IndexedDB database name (default: 'clarity-chat-offline')</li>
          <li><code>storeName</code>: Object store name (default: 'messages')</li>
          <li><code>maxMessages</code>: Maximum messages to store (default: 1000)</li>
          <li><code>maxPending</code>: Maximum pending operations (default: 100)</li>
          <li><code>maxRetries</code>: Maximum retry attempts (default: 3)</li>
          <li><code>syncInterval</code>: Sync interval in milliseconds (default: 30000)</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Set appropriate <code>maxMessages</code> based on storage limits</li>
          <li>Monitor <code>onStatusChange</code> to show offline indicators</li>
          <li>Handle <code>onSyncError</code> to show error messages</li>
          <li>Use <code>onSyncComplete</code> to update UI after sync</li>
          <li>Set reasonable <code>syncInterval</code> to balance performance and freshness</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/hooks/use-offline-chat">useOfflineChat</a> - Offline chat hook</li>
          <li><a href="/cookbook/offline-first-chat">Offline-First Chat Recipe</a> - Complete offline implementation</li>
        </ul>
      </section>
    </div>
  )
}
