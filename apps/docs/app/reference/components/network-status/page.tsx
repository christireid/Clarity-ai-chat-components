import { logger } from '@clarity-chat/utils/logger';
'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const metadata: Metadata = {
  title: 'NetworkStatus | Clarity Chat',
  description:
    'Indicator for online/offline status and connectivity changes with automatic reconnection.',
}

const networkStatusProps: Prop[] = [
  {
    name: 'status',
    type: "'online' | 'offline' | 'slow' | 'unstable'",
    description: 'Current connection status (auto-detected if not provided).',
  },
  {
    name: 'show',
    type: 'boolean',
    default: 'true',
    description: 'Show status indicator.',
  },
  {
    name: 'position',
    type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
    default: "'top-right'",
    description: 'Position of the status indicator.',
  },
  {
    name: 'showDetails',
    type: 'boolean',
    default: 'false',
    description: 'Show detailed connection info (RTT, downlink speed).',
  },
  {
    name: 'onStatusChange',
    type: '(status: NetworkConnectionStatus) => void',
    description: 'Callback when status changes.',
  },
  {
    name: 'pingEndpoint',
    type: 'string',
    default: "'/api/ping'",
    description: 'Custom ping endpoint for connectivity check.',
  },
  {
    name: 'pingInterval',
    type: 'number',
    default: '30000',
    description: 'Ping interval in milliseconds.',
  },
  {
    name: 'slowThreshold',
    type: 'number',
    default: '1000',
    description: 'Threshold for slow connection in milliseconds.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Custom className.',
  },
]

export default function NetworkStatusPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>NetworkStatus</h1>

      <p className="lead">
        Network connectivity status indicator that automatically detects
        online/offline state and provides visual feedback to users. Perfect for
        offline-first applications and real-time chat interfaces.
      </p>

      <Callout type="info" title="Automatic Detection">
        <p>
          NetworkStatus automatically detects connectivity changes using the
          browser's online/offline events and provides visual feedback without
          any configuration.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the component:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { NetworkStatus } from '@clarity-chat/react'

function ChatApp() {
  return (
    <div>
      <NetworkStatus />
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with NetworkStatus:
        </p>
        <CodePlayground
          initialCode={`import { NetworkStatus } from '@clarity-chat/react'

function Example() {
  return (
    <div className="p-4">
      <NetworkStatus 
        showWhenOnline
        position="top"
      />
      <p>Try disconnecting your network to see the offline indicator!</p>
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">
          With Status Change Callback
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { NetworkStatus } from '@clarity-chat/react'
import { useState } from 'react'

function ChatWithNetworkStatus() {
  const [connectionStatus, setConnectionStatus] = useState('online')

  return (
    <div>
      <NetworkStatus
        onStatusChange={(status) => {
          setConnectionStatus(status)
          if (status === 'offline') {
            logger.debug('Connection lost - queuing messages')
            // Queue messages for later
          } else if (status === 'online') {
            logger.debug('Connection restored - syncing messages')
            // Sync pending messages
          }
        }}
      />
      {connectionStatus === 'offline' && (
        <div className="warning">
          You are offline. Messages will be sent when connection is restored.
        </div>
      )}
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">
          With Details and Custom Ping
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { NetworkStatus } from '@clarity-chat/react'

function DetailedNetworkStatus() {
  return (
    <div>
      <NetworkStatus
        position="bottom-right"
        showDetails={true}
        show={true} // Show even when online
        pingEndpoint="/api/health"
        pingInterval={10000} // Check every 10 seconds
        slowThreshold={500} // >500ms = slow
      />
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">
          With Offline Chat Sync
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { NetworkStatus, OfflineChatSync } from '@clarity-chat/react'

function OfflineChat() {
  return (
    <OfflineChatSync api="/api/chat" storageKey="chat-messages">
      <NetworkStatus
        onStatusChange={(status) => {
          if (status === 'online') {
            // OfflineChatSync will automatically sync
            logger.debug('Connection restored - syncing messages...')
          }
        }}
      />
      <ClarityChat api="/api/chat" />
    </OfflineChatSync>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Props</h2>
        <PropsTable props={networkStatusProps} title="Component Props" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          NetworkStatus uses the browser's native online/offline detection:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Online Detection</strong> - Listens to <code>online</code>{' '}
            events
          </li>
          <li>
            <strong>Offline Detection</strong> - Listens to <code>offline</code>{' '}
            events
          </li>
          <li>
            <strong>Visual Feedback</strong> - Shows status badge with
            appropriate styling
          </li>
          <li>
            <strong>Automatic Updates</strong> - Updates in real-time as
            connectivity changes
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Show when offline</strong> - Always show status when offline
            to inform users
          </li>
          <li>
            <strong>Hide when online</strong> - Optionally hide when online to
            reduce UI clutter
          </li>
          <li>
            <strong>Use callbacks</strong> - Implement onReconnect/onDisconnect
            to handle state changes
          </li>
          <li>
            <strong>Combine with offline sync</strong> - Use with
            OfflineChatSync for automatic message queuing
          </li>
          <li>
            <strong>Position appropriately</strong> - Use fixed position for
            persistent visibility
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
            <p>Offline message queuing</p>
          </a>
          <a href="/cookbook/offline-first" className="docs-card">
            <h3>Offline-First Recipe</h3>
            <p>Offline-first patterns</p>
          </a>
          <a href="/cookbook/real-time-collaboration" className="docs-card">
            <h3>Real-Time Collaboration</h3>
            <p>WebSocket connectivity</p>
          </a>
          <a
            href="/reference/hooks/use-streaming-websocket"
            className="docs-card"
          >
            <h3>useStreamingWebSocket Hook</h3>
            <p>WebSocket with auto-reconnect</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{
          title: 'MessageList',
          href: '/reference/components/message-list',
        }}
        next={{
          title: 'OfflineChatSync',
          href: '/reference/components/offline-chat-sync',
        }}
      />
    </>
  )
}
