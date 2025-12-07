import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Cookbook: Team Collaboration Chat',
    description: 'Build a multi-user chat experience with presence, typing indicators, and WebSocket synchronization.',
};
export default function TeamCollaborationRecipePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Cookbook" }), _jsx("h1", { children: "Team Collaboration Chat" }), _jsx("p", { className: "docs-lead", children: "Implement a shared workspace where multiple teammates can chat, see who is online, and view typing indicators in real time." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "What You\u2019ll Build" }), _jsxs("ul", { children: [_jsx("li", { children: "\uD83C\uDF10 Real-time message sync via WebSockets" }), _jsx("li", { children: "\uD83D\uDC65 Presence list showing who is online" }), _jsx("li", { children: "\u2328\uFE0F Typing indicators for active users" }), _jsx("li", { children: "\uD83E\uDE84 AI assistant sharing the same transcript" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "1. WebSocket Server" }), _jsxs("p", { children: ["Use your favourite backend (Node, Bun, Deno). The example below uses", _jsx("code", { children: "socket.io" }), "."] }), _jsx(CodeBlock, { language: "ts", code: `// server.ts
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
  console.log('Client connected', socket.id)

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
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "2. Client Hook" }), _jsxs("p", { children: ["Combine ", _jsx("code", { children: "useChat" }), " with ", _jsx("code", { children: "socket.io-client" }), " to keep the transcript in sync for all participants."] }), _jsx(CodeBlock, { language: "tsx", code: `import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { useChat, useTyping } from '@clarity-chat/react'
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
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "3. UI Composition" }), _jsx(CodeBlock, { language: "tsx", code: `import {
  ChatWindow,
  PresenceAvatarStack,
  TypingIndicator,
} from '@clarity-chat/react'

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
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Scaling Tips" }), _jsxs("ul", { children: [_jsx("li", { children: "Persist messages in your database and broadcast from the server" }), _jsxs("li", { children: ["Integrate ", _jsx("code", { children: "QuotaManager" }), " to prevent abuse in high-traffic rooms"] }), _jsxs("li", { children: ["Use ", _jsx("code", { children: "TenantManager" }), " to isolate conversations per workspace"] }), _jsxs("li", { children: ["Log events with ", _jsx("code", { children: "AuditLogger" }), " for compliance (e.g. finance, healthcare)"] }), _jsxs("li", { children: ["Use ", _jsx("code", { children: "PresenceAvatarStack" }), " or custom UI to display status"] })] })] }), _jsx("section", { className: "docs-section", children: _jsxs(Callout, { type: "success", children: ["Related recipes: ", _jsx(Link, { href: "/cookbook/analytics-tracking", children: "Analytics & Tracking" }), ' ', "to measure engagement, ", _jsx(Link, { href: "/cookbook/error-handling", children: "Robust Error Handling" }), ' ', "for resilient WebSocket reconnection flows."] }) })] }));
}
//# sourceMappingURL=page.js.map