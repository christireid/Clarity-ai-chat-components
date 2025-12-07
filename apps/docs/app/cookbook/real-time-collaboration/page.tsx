'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Real-Time Collaboration Recipe | Clarity Chat Cookbook',
  description: 'Learn how to build real-time collaborative chat applications with multiple users and live updates.',
}

export default function RealTimeCollaborationPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Real-Time Collaboration Recipe</h1>

      <p className="lead">
        Build real-time collaborative chat applications where multiple users can
        chat together with live updates, presence indicators, and synchronized state.
      </p>

      <Callout type="info" title="Real-Time Collaboration">
        <p>
          Real-time collaboration allows multiple users to participate in the same
          conversation simultaneously, seeing each other's messages and typing indicators
          in real-time.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Use WebSocket for real-time collaboration:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useStreamingWebSocket, ClarityChat } from '@clarity-chat/react'

function CollaborativeChat() {
  const { messages, send, isConnected } = useStreamingWebSocket({
    url: 'wss://api.example.com/chat/room-123',
    onMessage: (data) => {
      // Handle incoming messages from other users
      if (data.type === 'message') {
        addMessage(data.message)
      } else if (data.type === 'typing') {
        updateTypingIndicator(data.userId, data.isTyping)
      }
    },
    autoReconnect: true,
  })

  return (
    <ClarityChat
      api="/api/chat"
      onSendMessage={(content) => {
        send({ type: 'message', content, userId: currentUser.id })
      }}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Presence Indicators</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Show who's online and typing:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useStreamingWebSocket } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function CollaborativeChat() {
  const [onlineUsers, setOnlineUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState(new Set())

  const { send, isConnected } = useStreamingWebSocket({
    url: 'wss://api.example.com/chat/room-123',
    onMessage: (data) => {
      if (data.type === 'presence') {
        setOnlineUsers(data.users)
      } else if (data.type === 'typing') {
        if (data.isTyping) {
          setTypingUsers(prev => new Set([...prev, data.userId]))
        } else {
          setTypingUsers(prev => {
            const next = new Set(prev)
            next.delete(data.userId)
            return next
          })
        }
      }
    },
  })

  // Send typing indicator
  const handleTyping = (isTyping: boolean) => {
    send({
      type: 'typing',
      userId: currentUser.id,
      isTyping,
    })
  }

  return (
    <div>
      <div className="presence">
        <div>Online: {onlineUsers.length} users</div>
        {typingUsers.size > 0 && (
          <div>
            {Array.from(typingUsers).map(userId => (
              <span key={userId}>{getUserName(userId)} is typing...</span>
            ))}
          </div>
        )}
      </div>
      <ChatWindow onTyping={handleTyping} />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Message Broadcasting</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Broadcast messages to all users in a room:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`function useChatRoom(roomId: string) {
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])

  const { send, isConnected } = useStreamingWebSocket({
    url: \`wss://api.example.com/chat/\${roomId}\`,
    onMessage: (data) => {
      switch (data.type) {
        case 'message':
          setMessages(prev => [...prev, data.message])
          break
        case 'user_joined':
          setUsers(prev => [...prev, data.user])
          break
        case 'user_left':
          setUsers(prev => prev.filter(u => u.id !== data.userId))
          break
        case 'message_updated':
          setMessages(prev => prev.map(m =>
            m.id === data.messageId ? { ...m, ...data.updates } : m
          ))
          break
      }
    },
  })

  const sendMessage = (content: string) => {
    const message = {
      id: generateId(),
      content,
      userId: currentUser.id,
      timestamp: Date.now(),
    }
    
    // Optimistic update
    setMessages(prev => [...prev, message])
    
    // Broadcast to server
    send({
      type: 'message',
      message,
    })
  }

  return { messages, users, sendMessage, isConnected }
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Conflict Resolution</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Handle simultaneous edits:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`function useConflictResolution() {
  const [messageVersions, setMessageVersions] = useState(new Map())

  const handleMessageUpdate = (messageId: string, updates: Partial<Message>) => {
    const current = messageVersions.get(messageId)
    const serverVersion = updates.version || 0

    if (current && current.version > serverVersion) {
      // Local version is newer - show conflict resolution UI
      showConflictDialog({
        local: current,
        server: updates,
        onResolve: (resolved) => {
          send({ type: 'message_resolve', messageId, resolved })
        },
      })
    } else {
      // Accept server version
      updateMessage(messageId, updates)
    }
  }

  return { handleMessageUpdate }
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Server Implementation</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          WebSocket server for real-time collaboration:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`// server.ts
import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })
const rooms = new Map<string, Set<WebSocket>>()

wss.on('connection', (ws, req) => {
  const roomId = new URL(req.url, 'http://localhost').searchParams.get('room')
  if (!roomId) {
    ws.close()
    return
  }

  // Add to room
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set())
  }
  rooms.get(roomId)!.add(ws)

  // Broadcast join
  broadcast(roomId, {
    type: 'user_joined',
    userId: ws.userId,
  })

  ws.on('message', (data) => {
    const message = JSON.parse(data.toString())
    
    switch (message.type) {
      case 'message':
        // Broadcast to all users in room
        broadcast(roomId, {
          type: 'message',
          message: {
            ...message.message,
            id: generateId(),
            timestamp: Date.now(),
          },
        })
        break
      case 'typing':
        // Broadcast typing indicator
        broadcast(roomId, {
          type: 'typing',
          userId: message.userId,
          isTyping: message.isTyping,
        }, ws) // Exclude sender
        break
    }
  })

  ws.on('close', () => {
    rooms.get(roomId)?.delete(ws)
    broadcast(roomId, {
      type: 'user_left',
      userId: ws.userId,
    })
  })
})

function broadcast(roomId: string, data: any, exclude?: WebSocket) {
  const room = rooms.get(roomId)
  if (!room) return

  room.forEach(client => {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Use optimistic updates</strong> - Show messages immediately</li>
          <li><strong>Handle reconnection</strong> - Sync state when reconnecting</li>
          <li><strong>Resolve conflicts</strong> - Handle simultaneous edits gracefully</li>
          <li><strong>Show presence</strong> - Indicate who's online and typing</li>
          <li><strong>Rate limit typing indicators</strong> - Don't spam the server</li>
          <li><strong>Use message IDs</strong> - Track message versions for conflict resolution</li>
          <li><strong>Handle disconnections</strong> - Queue messages when offline</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/hooks/use-streaming-websocket" className="docs-card">
            <h3>useStreamingWebSocket Hook</h3>
            <p>WebSocket hook for real-time communication</p>
          </a>
          <a href="/cookbook/offline-first" className="docs-card">
            <h3>Offline-First Recipe</h3>
            <p>Handle offline scenarios</p>
          </a>
          <a href="/cookbook/error-handling" className="docs-card">
            <h3>Error Handling Recipe</h3>
            <p>Handle connection errors</p>
          </a>
          <a href="/guides/streaming" className="docs-card">
            <h3>Streaming Guide</h3>
            <p>Complete streaming guide</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'Offline-First', href: '/cookbook/offline-first' }}
        next={{ title: 'Next.js Deep Integration', href: '/cookbook/nextjs-deep-integration' }}
      />
    </>
  )
}
