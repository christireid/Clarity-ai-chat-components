import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'


export const metadata: Metadata = {
  title: 'useCollaborativeSession - Clarity Chat Components',
  description: 'Hook for managing collaborative editing sessions with user presence, cursor tracking, and session management.',
}

const optionsProps: Prop[] = [
  {
    name: 'sessionId',
    type: 'string',
    description: 'Session ID for the collaborative session',
  },
  {
    name: 'currentUser',
    type: 'CollaborativeUser',
    required: true,
    description: 'Current user information',
  },
  {
    name: 'onUserJoin',
    type: '(user: CollaborativeUser) => void',
    description: 'Callback when user joins session',
  },
  {
    name: 'onUserLeave',
    type: '(userId: string) => void',
    description: 'Callback when user leaves session',
  },
]

export default function UseCollaborativeSessionPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useCollaborativeSession</h1>
        <p className="docs-lead">
          Hook for managing collaborative editing sessions with user presence, cursor tracking, message locking, and session lifecycle.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Manage collaborative sessions',
          'Track active users',
          'Handle user presence',
          'Manage message locks',
          'Handle session lifecycle',
        ]}
      />

      <Callout type="info">
        <p>
          <strong>Real-time Collaboration:</strong> This hook requires a WebSocket or similar real-time connection to sync session state between users.
        </p>
      </Callout>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>
          Manage a collaborative session:
        </p>
        <CodePlayground
          initialCode={`import { useCollaborativeSession } from '@clarity-chat/react'

function CollaborativeChat({ sessionId }: { sessionId: string }) {
  const currentUser = {
    id: 'user-1',
    name: 'Current User',
    avatar: '/avatar.jpg',
    color: '#3b82f6',
    status: 'online' as const,
    lastSeen: Date.now(),
  }

  const {
    session,
    activeUsers,
    joinSession,
    leaveSession,
    updatePresence,
  } = useCollaborativeSession({
    sessionId,
    currentUser,
    onUserJoin: (user) => {
      console.log('User joined:', user.name)
    },
    onUserLeave: (userId) => {
      console.log('User left:', userId)
    },
  })

  React.useEffect(() => {
    joinSession()
    return () => {
      leaveSession()
    }
  }, [])

  return (
    <div>
      <div>Active users: {activeUsers.length}</div>
      {activeUsers.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>User Presence</h2>
        <p>
          Update and track user presence:
        </p>
        <CodePlayground
          initialCode={`import { useCollaborativeSession } from '@clarity-chat/react'

function PresenceTracking() {
  const { updatePresence, activeUsers } = useCollaborativeSession({
    sessionId: 'session-123',
    currentUser,
  })

  React.useEffect(() => {
    // Update presence periodically
    const interval = setInterval(() => {
      updatePresence({
        status: 'online',
        lastSeen: Date.now(),
      })
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {activeUsers.map(user => (
        <div key={user.id}>
          {user.name} - {user.status}
        </div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Message Locking</h2>
        <p>
          Request and release message locks:
        </p>
        <CodePlayground
          initialCode={`import { useCollaborativeSession } from '@clarity-chat/react'

function MessageLocking() {
  const { requestLock, releaseLock, session } = useCollaborativeSession({
    sessionId: 'session-123',
    currentUser,
  })

  const handleEdit = async (messageId: string) => {
    const lockGranted = await requestLock(messageId)
    if (lockGranted) {
      // User can now edit the message
      startEditing(messageId)
    } else {
      // Another user has the lock
      showLockedMessage()
    }
  }

  const handleSave = (messageId: string) => {
    releaseLock(messageId)
  }

  return (
    <div>
      {session.locks.size > 0 && (
        <div>Active locks: {session.locks.size}</div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Cursor Tracking</h2>
        <p>
          Track cursor positions:
        </p>
        <CodePlayground
          initialCode={`import { useCollaborativeSession } from '@clarity-chat/react'

function CursorTracking() {
  const { updateCursor, session } = useCollaborativeSession({
    sessionId: 'session-123',
    currentUser,
  })

  const handleCursorMove = (messageId: string, position: number) => {
    updateCursor({
      messageId,
      position,
    })
  }

  return (
    <div>
      {Array.from(session.cursors.values()).map(cursor => (
        <div key={cursor.userId}>
          User {cursor.userId} at position {cursor.position}
        </div>
      ))}
    </div>
  )
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
          <li><code>session</code>: Collaborative session object</li>
          <li><code>activeUsers</code>: Array of active users</li>
          <li><code>joinSession</code>: Function to join session</li>
          <li><code>leaveSession</code>: Function to leave session</li>
          <li><code>updatePresence</code>: Function to update user presence</li>
          <li><code>requestLock</code>: Function to request message lock</li>
          <li><code>releaseLock</code>: Function to release message lock</li>
          <li><code>updateCursor</code>: Function to update cursor position</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Join session when component mounts</li>
          <li>Leave session when component unmounts</li>
          <li>Update presence periodically to show active status</li>
          <li>Request locks before editing messages</li>
          <li>Release locks after editing is complete</li>
          <li>Track cursor positions for better UX</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/components/collaborative-editing">CollaborativeEditor</a> - Collaborative editing component</li>
          <li><a href="/cookbook/real-time-collaboration">Real-time Collaboration Recipe</a> - Complete collaboration setup</li>
        </ul>
      </section>
    </div>
  )
}
