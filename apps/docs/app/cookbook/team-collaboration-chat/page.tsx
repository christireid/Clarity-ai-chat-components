import Link from 'next/link'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'Cookbook: Team Collaboration Chat',
  description:
    'Build a multi-user chat experience with presence, typing indicators, and WebSocket synchronization.',
}

export default function TeamCollaborationRecipePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <h1>Team Collaboration Chat</h1>
        <p className="docs-lead">
          Implement a shared workspace where multiple teammates can chat, see
          who is online, and view typing indicators in real time.
        </p>
      </div>

      <section className="docs-section">
        <h2>What You’ll Build</h2>
        <ul>
          <li>🌐 Real-time message sync via WebSockets</li>
          <li>👥 Presence list showing who is online</li>
          <li>⌨️ Typing indicators for active users</li>
          <li>🪄 AI assistant sharing the same transcript</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>1. WebSocket Server</h2>
        <p>
          Use your favourite backend (Node, Bun, Deno). The example below uses
          <code>socket.io</code>.
        </p>
        <CodeBlock
          language="ts"
          code={`// server.ts
import { Server } from 'socket.io'
import type { Message } from '@clarity-chat/types'

const io = new Server(3001, {
  cors: { origin: '*' },
})

interface Presence {
  userId: string
  name: string
}

let presence: Presence[] = []
let messages: Message[] = []

io.on('connection', (socket) => {
  logger.debug('Client connected', socket.id)

  socket.emit('bootstrap', { messages, presence })

  socket.on('join', (user: Presence) => {
    presence = [...presence.filter((p) => p.userId !== user.userId), user]
    io.emit('presence', presence)
  })

  socket.on('typing', (payload) => {
    socket.broadcast.emit('typing', payload)
  })

  socket.on('message', (message: Message) => {
    messages = [...messages, message]
    io.emit('message', message)
  })

  socket.on('disconnect', () => {
    presence = presence.filter((p) => p.userId !== socket.id)
    io.emit('presence', presence)
  })
})
`}
        />
      </section>

      <section className="docs-section">
        <h2>2. Client Hook</h2>
        <p>
          Combine <code>useChat</code> with <code>socket.io-client</code> to
          keep the transcript in sync for all participants.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { useChat, useTyping } from '@clarity-chat/react/internal'
import type { Message } from '@clarity-chat/types'

interface Presence {
  userId: string
  name: string
}

const socket: Socket = io('http://localhost:3001')

export function useTeamChat(user: Presence) {
  const chat = useChat({ id: 'team', api: '/api/chat/team' })
  const typing = useTyping()
  const [presence, setPresence] = React.useState<Presence[]>([])

  useEffect(() => {
    socket.emit('join', user)

    socket.on('bootstrap', ({ messages, presence }) => {
      chat.setMessages(messages)
      setPresence(presence)
    })

    socket.on('presence', (list) => setPresence(list))
    socket.on('message', (message: Message) => {
      chat.setMessages((prev) => [...prev, message])
    })
    socket.on('typing', typing.handleRemoteTyping)

    return () => {
      socket.off('bootstrap')
      socket.off('presence')
      socket.off('message')
      socket.off('typing')
    }
  }, [user.userId])

  const sendMessage = async (content: string) => {
    const draft = chat.createUserMessage(content, { author: user.name })
    socket.emit('message', draft)
    chat.setMessages((prev) => [...prev, draft])

    const assistant = await chat.generateAssistantMessage(draft)
    socket.emit('message', assistant)
    chat.setMessages((prev) => [...prev, assistant])
  }

  const handleTyping = (isTyping: boolean) => {
    typing.setTyping(isTyping ? [{ id: user.userId, name: user.name }] : [])
    socket.emit('typing', { user, typing: isTyping })
  }

  return {
    ...chat,
    presence,
    typingUsers: typing.typingUsers,
    handleTyping,
    sendMessage,
  }
}
`}
        />
      </section>

      <section className="docs-section">
        <h2>3. UI Composition</h2>
        <CodeBlock
          language="tsx"
          code={`import {
  ChatWindow,
  PresenceAvatarStack,
  TypingIndicator,
} from '@clarity-chat/react/internal'

export function TeamChatPage({ user }: { user: Presence }) {
  const chat = useTeamChat(user)

  return (
    <div className="grid lg:grid-cols-[240px,minmax(0,1fr)] h-[calc(100vh-64px)]">
      <aside className="border-r border-border p-4 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Online</h2>
        <ul className="space-y-2 text-sm">
          {chat.presence.map((member) => (
            <li key={member.userId} className="flex items-center gap-2">
              <PresenceAvatarStack users={[member]} size="xs" />
              {member.name}
            </li>
          ))}
        </ul>
      </aside>

      <ChatWindow
        messages={chat.messages}
        onSendMessage={chat.sendMessage}
        onInputFocus={() => chat.handleTyping(true)}
        onInputBlur={() => chat.handleTyping(false)}
        typingUsers={chat.typingUsers}
        header={
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold">Team Workspace</h1>
              <TypingIndicator typingUsers={chat.typingUsers} />
            </div>
            <PresenceAvatarStack users={chat.presence.map((p) => ({ id: p.userId, name: p.name }))} />
          </div>
        }
      />
    </div>
  )
}
`}
        />
      </section>

      <section className="docs-section">
        <h2>Scaling Tips</h2>
        <ul>
          <li>
            Persist messages in your database and broadcast from the server
          </li>
          <li>
            Integrate <code>QuotaManager</code> to prevent abuse in high-traffic
            rooms
          </li>
          <li>
            Use <code>TenantManager</code> to isolate conversations per
            workspace
          </li>
          <li>
            Log events with <code>AuditLogger</code> for compliance (e.g.
            finance, healthcare)
          </li>
          <li>
            Use <code>PresenceAvatarStack</code> or custom UI to display status
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <Callout type="success">
          Related recipes:{' '}
          <Link href="/cookbook/analytics-tracking">
            Analytics &amp; Tracking
          </Link>{' '}
          to measure engagement,{' '}
          <Link href="/cookbook/error-handling">Robust Error Handling</Link> for
          resilient WebSocket reconnection flows.
        </Callout>
      </section>
    </div>
  )
}
