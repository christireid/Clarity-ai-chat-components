import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Real-time Collaboration Recipe - Clarity Chat Components',
  description:
    'Build a real-time collaborative chat application with cursor tracking and presence indicators.',
}

export default function RealTimeCollaborationRecipePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Recipe</span>
        <h1>Real-time Collaboration</h1>
        <p className="docs-lead">
          Build a real-time collaborative chat application with cursor tracking,
          presence indicators, and conflict resolution.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Set up WebSocket connection for real-time sync',
          'Implement collaborative editing',
          'Track cursor positions and presence',
          'Handle conflict resolution',
          'Manage message locking',
        ]}
      />

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          This recipe shows how to build a real-time collaborative chat
          application where multiple users can edit messages simultaneously with
          cursor tracking and presence indicators.
        </p>
      </section>

      <section className="docs-section">
        <h2>Setup WebSocket Connection</h2>
        <p>
          First, set up a WebSocket connection for real-time synchronization:
        </p>
        <CodePlayground
          initialCode={`import { useEffect, useRef } from 'react'
import { CollaborativeEditor } from '@clarity-chat/react/internal'
import type { Message } from '@clarity-chat/types'

function CollaborativeChat({ messageId }: { messageId: string }) {
  const wsRef = useRef<WebSocket | null>(null)
  const [activeUsers, setActiveUsers] = React.useState([])

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket(\`ws://localhost:3001/chat/\${messageId}\`)

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      switch (data.type) {
        case 'cursor-move':
          // Update cursor position
          updateCursorPosition(data.userId, data.position)
          break
        case 'edit':
          // Apply edit operation
          applyEditOperation(data.operation)
          break
        case 'presence':
          // Update active users
          setActiveUsers(data.users)
          break
      }
    }

    wsRef.current = ws

    return () => {
      ws.close()
    }
  }, [messageId])

  return (
    <CollaborativeEditor
      message={message}
      currentUser={currentUser}
      activeUsers={activeUsers}
      onCursorMove={(position) => {
        // Broadcast cursor position
        wsRef.current?.send(JSON.stringify({
          type: 'cursor-move',
          position,
        }))
      }}
      onChange={(content, operation) => {
        // Broadcast edit operation
        wsRef.current?.send(JSON.stringify({
          type: 'edit',
          operation,
        }))
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Message Locking</h2>
        <p>Implement message locking to prevent conflicts:</p>
        <CodePlayground
          initialCode={`function WithLocking({ messageId }: { messageId: string }) {
  const [hasLock, setHasLock] = React.useState(false)

  const requestLock = async () => {
    const response = await fetch(\`/api/messages/\${messageId}/lock\`, {
      method: 'POST',
    })
    
    if (response.ok) {
      setHasLock(true)
      return true
    }
    return false
  }

  const releaseLock = async () => {
    await fetch(\`/api/messages/\${messageId}/lock\`, {
      method: 'DELETE',
    })
    setHasLock(false)
  }

  return (
    <CollaborativeEditor
      message={message}
      currentUser={currentUser}
      activeUsers={activeUsers}
      onRequestLock={requestLock}
      onReleaseLock={releaseLock}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Conflict Resolution</h2>
        <p>Use operational transform for conflict resolution:</p>
        <CodePlayground
          initialCode={`function WithConflictResolution() {
  const [operations, setOperations] = React.useState([])

  const applyOperation = (operation) => {
    // Transform operation against pending operations
    let transformedOp = operation
    for (const pendingOp of operations) {
      transformedOp = transformOperation(pendingOp, transformedOp)
    }

    // Apply transformed operation
    applyEdit(transformedOp)
    
    // Add to pending operations
    setOperations([...operations, transformedOp])
  }

  return (
    <CollaborativeEditor
      message={message}
      currentUser={currentUser}
      activeUsers={activeUsers}
      conflictStrategy="operational-transform"
      onChange={(content, operation) => {
        applyOperation(operation)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Complete Example</h2>
        <p>Complete collaborative chat implementation:</p>
        <CodePlayground
          initialCode={`import { CollaborativeEditor, useCollaborativeSession } from '@clarity-chat/react/internal'
import { useEffect, useRef } from 'react'

function CollaborativeChatApp({ messageId }: { messageId: string }) {
  const wsRef = useRef<WebSocket | null>(null)
  const { session, joinSession, leaveSession } = useCollaborativeSession()

  useEffect(() => {
    // Join session
    joinSession(messageId)

    // Connect WebSocket
    const ws = new WebSocket(\`ws://localhost:3001/chat/\${messageId}\`)
    wsRef.current = ws

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      // Handle real-time updates
    }

    return () => {
      leaveSession()
      ws.close()
    }
  }, [messageId])

  return (
    <CollaborativeEditor
      message={message}
      currentUser={session.currentUser}
      activeUsers={session.activeUsers}
      showCursors={true}
      showPresence={true}
      conflictStrategy="operational-transform"
      onRequestLock={async (id) => {
        const response = await fetch(\`/api/messages/\${id}/lock\`, {
          method: 'POST',
        })
        return response.ok
      }}
      onReleaseLock={(id) => {
        fetch(\`/api/messages/\${id}/lock\`, {
          method: 'DELETE',
        })
      }}
      onChange={(content, operation) => {
        wsRef.current?.send(JSON.stringify({
          type: 'edit',
          operation,
        }))
      }}
      onCursorMove={(position) => {
        wsRef.current?.send(JSON.stringify({
          type: 'cursor-move',
          position,
        }))
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use WebSocket for real-time synchronization</li>
          <li>Implement message locking for critical edits</li>
          <li>Use operational transform for conflict resolution</li>
          <li>Throttle cursor position updates to reduce network traffic</li>
          <li>Show presence indicators for better UX</li>
          <li>Handle connection errors gracefully</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/collaborative-editing">
              CollaborativeEditor
            </a>{' '}
            - Collaborative editing component
          </li>
          <li>
            <a href="/reference/hooks/use-collaborative-session">
              useCollaborativeSession
            </a>{' '}
            - Session management hook
          </li>
        </ul>
      </section>
    </div>
  )
}
