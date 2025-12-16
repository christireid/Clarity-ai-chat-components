import { logger } from '@clarity-chat/utils/logger';
import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'MessageThreadView & ThreadList - Clarity Chat Components',
  description:
    'Threaded conversations with nested replies, participant tracking, and thread management.',
}

const threadViewProps: Prop[] = [
  {
    name: 'parentMessage',
    type: 'Message',
    required: true,
    description: 'Parent message for the thread',
  },
  {
    name: 'thread',
    type: 'Thread',
    description: 'Thread data',
  },
  {
    name: 'threads',
    type: 'Map<string, Thread>',
    description: 'All threads (for context)',
  },
  {
    name: 'config',
    type: 'Partial<ThreadViewConfig>',
    description: 'Thread configuration',
  },
  {
    name: 'onSendMessage',
    type: '(threadId: string, content: string) => void',
    description: 'Callback when sending message to thread',
  },
  {
    name: 'onCreateThread',
    type: '(parentMessageId: string) => void',
    description: 'Callback when thread is created',
  },
  {
    name: 'onOpenThread',
    type: '(threadId: string) => void',
    description: 'Callback when thread is opened',
  },
  {
    name: 'onCloseThread',
    type: '(threadId: string) => void',
    description: 'Callback when thread is closed',
  },
  {
    name: 'onArchiveThread',
    type: '(threadId: string) => void',
    description: 'Callback when thread is archived',
  },
  {
    name: 'currentUser',
    type: 'ThreadParticipant',
    description: 'Current user',
  },
  {
    name: 'layout',
    type: '"inline" | "sidebar"',
    description: 'Show thread in sidebar vs inline',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function MessageThreadViewPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>MessageThreadView & ThreadList</h1>
        <p className="docs-lead">
          Threaded conversations with nested replies, participant tracking,
          unread counts, and thread management.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Create and manage threaded conversations',
          'Display thread previews and expanded views',
          'Track participants and unread counts',
          'Archive and manage threads',
          'Configure thread display options',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Display a thread view for a message:</p>
        <CodePlayground
          initialCode={`import { MessageThreadView } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function ThreadedMessage({ message, thread }: { message: Message, thread?: Thread }) {
  return (
    <MessageThreadView
      parentMessage={message}
      thread={thread}
      onSendMessage={(threadId, content) => {
        logger.debug('Sending to thread:', threadId, content)
      }}
      onCreateThread={(parentMessageId) => {
        logger.debug('Creating thread for:', parentMessageId)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Thread List</h2>
        <p>Display a list of all threads:</p>
        <CodePlayground
          initialCode={`import { ThreadList } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function AllThreads({ threads, parentMessages }: { threads: Thread[], parentMessages: Map<string, Message> }) {
  return (
    <ThreadList
      threads={threads}
      parentMessages={parentMessages}
      onSelectThread={(threadId) => {
        logger.debug('Selected thread:', threadId)
      }}
      onArchiveThread={(threadId) => {
        logger.debug('Archived thread:', threadId)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Thread Configuration</h2>
        <p>Configure thread display and behavior:</p>
        <CodePlayground
          initialCode={`import { MessageThreadView } from '@clarity-chat/react'

function ConfiguredThread({ message, thread }: { message: Message, thread?: Thread }) {
  return (
    <MessageThreadView
      parentMessage={message}
      thread={thread}
      config={{
        maxDepth: 5,              // Maximum nesting depth
        showPreview: true,        // Show thread preview
        previewLength: 100,       // Preview character length
        collapseThreshold: 10,    // Auto-collapse threads with 10+ messages
        notificationsEnabled: true,
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Layout Options</h2>
        <p>Use inline or sidebar layout:</p>
        <CodePlayground
          initialCode={`import { MessageThreadView } from '@clarity-chat/react'

function InlineThread({ message, thread }: { message: Message, thread?: Thread }) {
  return (
    <MessageThreadView
      parentMessage={message}
      thread={thread}
      layout="inline"  // Thread appears inline below message
    />
  )
}

function SidebarThread({ message, thread }: { message: Message, thread?: Thread }) {
  return (
    <MessageThreadView
      parentMessage={message}
      thread={thread}
      layout="sidebar"  // Thread appears in sidebar
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Participant Tracking</h2>
        <p>Track thread participants and unread counts:</p>
        <CodePlayground
          initialCode={`import { MessageThreadView } from '@clarity-chat/react'

function WithParticipants({ message, thread }: { message: Message, thread?: Thread }) {
  return (
    <MessageThreadView
      parentMessage={message}
      thread={thread}
      currentUser={{
        id: 'user-1',
        name: 'Current User',
        role: 'user',
      }}
      onOpenThread={(threadId) => {
        // Mark thread as read when opened
        markThreadAsRead(threadId)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={threadViewProps} />
      </section>

      <section className="docs-section">
        <h2>Thread Data Structure</h2>
        <ul>
          <li>
            <code>id</code>: Unique thread identifier
          </li>
          <li>
            <code>parentMessageId</code>: ID of parent message
          </li>
          <li>
            <code>messages</code>: Array of thread messages
          </li>
          <li>
            <code>participants</code>: Array of thread participants
          </li>
          <li>
            <code>unreadCount</code>: Number of unread messages
          </li>
          <li>
            <code>lastActivity</code>: Timestamp of last activity
          </li>
          <li>
            <code>isArchived</code>: Whether thread is archived
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Use <code>showPreview</code> to reduce visual clutter
          </li>
          <li>
            Set <code>collapseThreshold</code> to auto-collapse long threads
          </li>
          <li>
            Track <code>unreadCount</code> to show notification badges
          </li>
          <li>
            Use <code>layout="sidebar"</code> for better UX on larger screens
          </li>
          <li>Archive old threads to keep the interface clean</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/chat-window">ChatWindow</a> - Main
            chat interface
          </li>
          <li>
            <a href="/reference/components/message-list">MessageList</a> -
            Message display
          </li>
        </ul>
      </section>
    </div>
  )
}
