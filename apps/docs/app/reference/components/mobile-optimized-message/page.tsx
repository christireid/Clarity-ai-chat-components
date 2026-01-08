import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'MobileOptimizedMessage & MobileChatWindow - Clarity Chat Components',
  description:
    'Mobile-optimized chat components with swipe gestures, pull-to-refresh, haptic feedback, and touch-optimized interactions.',
}

const messageProps: Prop[] = [
  {
    name: 'message',
    type: 'Message',
    required: true,
    description: 'Message to display',
  },
  {
    name: 'swipeActions',
    type: 'SwipeAction[]',
    description: 'Custom swipe actions',
  },
  {
    name: 'config',
    type: 'Partial<MobileChatConfig>',
    description: 'Mobile chat configuration',
  },
  {
    name: 'onDelete',
    type: '(message: Message) => void',
    description: 'Callback when message deleted',
  },
  {
    name: 'onReply',
    type: '(message: Message) => void',
    description: 'Callback when message replied to',
  },
  {
    name: 'onCopy',
    type: '(message: Message) => void',
    description: 'Callback when message copied',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

const windowProps: Prop[] = [
  {
    name: 'messages',
    type: 'Message[]',
    required: true,
    description: 'Messages to display',
  },
  {
    name: 'config',
    type: 'Partial<MobileChatConfig>',
    description: 'Mobile chat configuration',
  },
  {
    name: 'onRefresh',
    type: '() => Promise<void>',
    description: 'Callback for pull-to-refresh',
  },
  {
    name: 'onDelete',
    type: '(message: Message) => void',
    description: 'Callback when message deleted',
  },
  {
    name: 'onReply',
    type: '(message: Message) => void',
    description: 'Callback when message replied to',
  },
  {
    name: 'onCopy',
    type: '(message: Message) => void',
    description: 'Callback when message copied',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function MobileOptimizedMessagePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>MobileOptimizedMessage & MobileChatWindow</h1>
        <p className="docs-lead">
          Mobile-optimized chat components with swipe gestures, pull-to-refresh,
          haptic feedback, large tap targets, and touch-optimized interactions.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Create mobile-optimized messages',
          'Implement swipe gestures',
          'Add pull-to-refresh',
          'Use haptic feedback',
          'Optimize for touch interactions',
        ]}
      />

      <Callout type="info">
        <p>
          <strong>Mobile-First:</strong> These components are specifically
          designed for mobile devices with touch-optimized interactions and
          gestures.
        </p>
      </Callout>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Use mobile-optimized message component:</p>
        <CodePlayground
          code={`import { MobileOptimizedMessage } from '@clarity-chat/react/internal'
import type { Message } from '@clarity-chat/types'

function MobileMessage({ message }: { message: Message }) {
  return (
    <MobileOptimizedMessage
      message={message}
      onReply={(msg) => {
        logger.debug('Reply to:', msg.id)
      }}
      onCopy={(msg) => {
        navigator.clipboard.writeText(msg.content)
      }}
      onDelete={(msg) => {
        logger.debug('Delete:', msg.id)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Mobile Chat Window</h2>
        <p>Complete mobile-optimized chat window:</p>
        <CodePlayground
          code={`import { MobileChatWindow } from '@clarity-chat/react/internal'
import type { Message } from '@clarity-chat/types'

function MobileChat({ messages }: { messages: Message[] }) {
  return (
    <MobileChatWindow
      messages={messages}
      onRefresh={async () => {
        // Refresh messages
        await refreshMessages()
      }}
      onReply={(message) => {
        // Handle reply
      }}
      onCopy={(message) => {
        navigator.clipboard.writeText(message.content)
      }}
      onDelete={(message) => {
        // Handle delete
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Swipe Gestures</h2>
        <p>Configure swipe actions:</p>
        <CodePlayground
          code={`import { MobileOptimizedMessage } from '@clarity-chat/react/internal'

function WithSwipeActions({ message }: { message: Message }) {
  return (
    <MobileOptimizedMessage
      message={message}
      swipeActions={[
        {
          id: 'reply',
          icon: '↩️',
          label: 'Reply',
          color: 'bg-blue-500',
          threshold: 80,
          onAction: (msg) => handleReply(msg),
        },
        {
          id: 'delete',
          icon: '🗑️',
          label: 'Delete',
          color: 'bg-red-500',
          threshold: 120,
          onAction: (msg) => handleDelete(msg),
        },
      ]}
      config={{
        enableSwipe: true,
        swipeThreshold: 80,
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Pull-to-Refresh</h2>
        <p>Enable pull-to-refresh:</p>
        <CodePlayground
          code={`import { MobileChatWindow } from '@clarity-chat/react/internal'

function WithRefresh({ messages }: { messages: Message[] }) {
  return (
    <MobileChatWindow
      messages={messages}
      config={{
        enablePullToRefresh: true,
        pullThreshold: 100,
      }}
      onRefresh={async () => {
        await fetchNewMessages()
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Haptic Feedback</h2>
        <p>Enable haptic feedback for better UX:</p>
        <CodePlayground
          code={`import { MobileOptimizedMessage } from '@clarity-chat/react/internal'

function WithHaptics({ message }: { message: Message }) {
  return (
    <MobileOptimizedMessage
      message={message}
      config={{
        enableHaptics: true,
      }}
      onReply={(msg) => {
        // Haptic feedback triggered automatically
        handleReply(msg)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Large Tap Targets</h2>
        <p>Use large tap targets for better mobile UX:</p>
        <CodePlayground
          code={`import { MobileOptimizedMessage } from '@clarity-chat/react/internal'

function LargeTargets({ message }: { message: Message }) {
  return (
    <MobileOptimizedMessage
      message={message}
      config={{
        largeTapTargets: true, // Minimum 48x48px tap targets
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>MobileOptimizedMessage Props</h2>
        <PropsTable props={messageProps} />
      </section>

      <section className="docs-section">
        <h2>MobileChatWindow Props</h2>
        <PropsTable props={windowProps} />
      </section>

      <section className="docs-section">
        <h2>Mobile Chat Configuration</h2>
        <ul>
          <li>
            <code>enableSwipe</code>: Enable swipe gestures (default: true)
          </li>
          <li>
            <code>enablePullToRefresh</code>: Enable pull-to-refresh (default:
            true)
          </li>
          <li>
            <code>largeTapTargets</code>: Use large tap targets (default: true)
          </li>
          <li>
            <code>enableHaptics</code>: Enable haptic feedback (default: true)
          </li>
          <li>
            <code>swipeThreshold</code>: Swipe threshold in pixels (default: 80)
          </li>
          <li>
            <code>pullThreshold</code>: Pull-to-refresh threshold in pixels
            (default: 100)
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Enable swipe gestures for quick actions</li>
          <li>Use pull-to-refresh for message updates</li>
          <li>Enable haptic feedback for better user experience</li>
          <li>Use large tap targets (minimum 48x48px)</li>
          <li>Configure appropriate swipe thresholds</li>
          <li>Test on real mobile devices</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/hooks/use-mobile-optimization">
              useMobileOptimization
            </a>{' '}
            - Mobile optimization hook
          </li>
          <li>
            <a href="/reference/hooks/use-mobile-keyboard">useMobileKeyboard</a>{' '}
            - Mobile keyboard detection
          </li>
          <li>
            <a href="/reference/hooks/use-battery-aware">useBatteryAware</a> -
            Battery-aware optimizations
          </li>
          <li>
            <a href="/guides/mobile-optimization">Mobile Optimization Guide</a>{' '}
            - Mobile best practices
          </li>
        </ul>
      </section>
    </div>
  )
}
