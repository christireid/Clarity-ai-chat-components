import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'CollaborativeEditor - Clarity Chat Components',
  description: 'Real-time collaborative editing with cursor tracking, presence indicators, and conflict resolution.',
}

const props: Prop[] = [
  {
    name: 'message',
    type: 'Message',
    required: true,
    description: 'Message being edited',
  },
  {
    name: 'currentUser',
    type: 'CollaborativeUser',
    required: true,
    description: 'Current user',
  },
  {
    name: 'activeUsers',
    type: 'CollaborativeUser[]',
    required: true,
    description: 'Other active users',
  },
  {
    name: 'lockTimeout',
    type: 'number',
    description: 'Lock timeout in milliseconds (default: 30000)',
  },
  {
    name: 'conflictStrategy',
    type: '"last-write-wins" | "operational-transform" | "manual"',
    description: 'Conflict resolution strategy',
  },
  {
    name: 'showCursors',
    type: 'boolean',
    description: 'Show cursor positions (default: true)',
  },
  {
    name: 'showPresence',
    type: 'boolean',
    description: 'Show presence indicators (default: true)',
  },
  {
    name: 'onChange',
    type: '(content: string, operation: EditOperation) => void',
    description: 'Callback when content changes',
  },
  {
    name: 'onRequestLock',
    type: '(messageId: string) => Promise<boolean>',
    description: 'Callback when user requests lock',
  },
  {
    name: 'onReleaseLock',
    type: '(messageId: string) => void',
    description: 'Callback when user releases lock',
  },
  {
    name: 'onCursorMove',
    type: '(position: CursorPosition) => void',
    description: 'Callback when cursor moves',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function CollaborativeEditorPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>CollaborativeEditor</h1>
        <p className="docs-lead">
          Real-time collaborative editing with cursor tracking, presence indicators, message locking, and conflict resolution.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Enable real-time collaborative editing',
          'Track cursor positions and presence',
          'Implement message locking',
          'Handle conflict resolution',
          'Manage edit operations',
        ]}
      />

      <Callout type="info">
        <p>
          <strong>Real-time Collaboration:</strong> This component requires a WebSocket or similar real-time connection to sync edits between users.
        </p>
      </Callout>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>
          Enable collaborative editing for a message:
        </p>
        <CodePlayground
          initialCode={`import { CollaborativeEditor } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function CollaborativeMessage({ message }: { message: Message }) {
  const currentUser = {
    id: 'user-1',
    name: 'Current User',
    avatar: '/avatar.jpg',
    color: '#3b82f6',
    status: 'online' as const,
    lastSeen: Date.now(),
  }

  const activeUsers = [
    {
      id: 'user-2',
      name: 'Other User',
      avatar: '/avatar2.jpg',
      color: '#ef4444',
      status: 'online' as const,
      lastSeen: Date.now(),
      currentMessageId: message.id,
      cursorPosition: 10,
    },
  ]

  return (
    <CollaborativeEditor
      message={message}
      currentUser={currentUser}
      activeUsers={activeUsers}
      onChange={(content, operation) => {
        console.log('Content changed:', content)
        console.log('Operation:', operation)
        // Sync to server
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Message Locking</h2>
        <p>
          Implement message locking to prevent conflicts:
        </p>
        <CodePlayground
          initialCode={`import { CollaborativeEditor } from '@clarity-chat/react'

function WithLocking({ message }: { message: Message }) {
  return (
    <CollaborativeEditor
      message={message}
      currentUser={currentUser}
      activeUsers={activeUsers}
      lockTimeout={30000}  // 30 seconds
      onRequestLock={async (messageId) => {
        // Request lock from server
        const response = await fetch(\`/api/messages/\${messageId}/lock\`, {
          method: 'POST',
        })
        return response.ok
      }}
      onReleaseLock={(messageId) => {
        // Release lock
        fetch(\`/api/messages/\${messageId}/lock\`, {
          method: 'DELETE',
        })
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Conflict Resolution</h2>
        <p>
          Configure conflict resolution strategy:
        </p>
        <CodePlayground
          initialCode={`import { CollaborativeEditor } from '@clarity-chat/react'

function WithConflictResolution({ message }: { message: Message }) {
  return (
    <CollaborativeEditor
      message={message}
      currentUser={currentUser}
      activeUsers={activeUsers}
      conflictStrategy="operational-transform"  // or "last-write-wins" or "manual"
      onChange={(content, operation) => {
        // Operations are automatically transformed
        syncOperation(operation)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Cursor Tracking</h2>
        <p>
          Track and display cursor positions:
        </p>
        <CodePlayground
          initialCode={`import { CollaborativeEditor } from '@clarity-chat/react'

function WithCursors({ message }: { message: Message }) {
  return (
    <CollaborativeEditor
      message={message}
      currentUser={currentUser}
      activeUsers={activeUsers}
      showCursors={true}
      onCursorMove={(position) => {
        console.log('Cursor moved:', position)
        // Broadcast cursor position
        broadcastCursorPosition(position)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Presence Indicators</h2>
        <p>
          Show presence indicators for active editors:
        </p>
        <CodePlayground
          initialCode={`import { CollaborativeEditor } from '@clarity-chat/react'

function WithPresence({ message }: { message: Message }) {
  return (
    <CollaborativeEditor
      message={message}
      currentUser={currentUser}
      activeUsers={activeUsers}
      showPresence={true}
      // Active users with currentMessageId matching message.id will be shown
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={props} />
      </section>

      <section className="docs-section">
        <h2>Conflict Resolution Strategies</h2>
        <ul>
          <li><strong>last-write-wins</strong>: Most recent edit wins (simple, fast)</li>
          <li><strong>operational-transform</strong>: Transform operations to resolve conflicts (complex, accurate)</li>
          <li><strong>manual</strong>: Handle conflicts manually (full control)</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Edit Operations</h2>
        <p>
          Edit operations include:
        </p>
        <ul>
          <li><code>insert</code>: Insert text at position</li>
          <li><code>delete</code>: Delete text at position</li>
          <li><code>replace</code>: Replace text at position</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use message locking for critical edits</li>
          <li>Set appropriate <code>lockTimeout</code> based on edit duration</li>
          <li>Use <code>operational-transform</code> for complex collaborative editing</li>
          <li>Broadcast cursor positions for better UX</li>
          <li>Show presence indicators to indicate active editors</li>
          <li>Sync operations to server in real-time</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/hooks/use-collaborative-session">useCollaborativeSession</a> - Collaborative session management</li>
          <li><a href="/reference/components/chat-window">ChatWindow</a> - Main chat interface</li>
        </ul>
      </section>
    </div>
  )
}
