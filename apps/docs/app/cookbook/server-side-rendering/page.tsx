import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Server-Side Rendering Patterns - Clarity Chat Components',
  description:
    'Learn how to use Clarity Chat Components with server-side rendering in Next.js, Remix, and other frameworks.',
}

export default function ServerSideRenderingPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Recipe</span>
        <h1>Server-Side Rendering Patterns</h1>
        <p className="docs-lead">
          Learn how to use Clarity Chat Components with server-side rendering in
          Next.js, Remix, and other frameworks.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Use SSR with Next.js App Router',
          'Hydrate client components',
          'Load initial data server-side',
          'Handle streaming in SSR',
          'Optimize SSR performance',
        ]}
      />

      <section className="docs-section">
        <h2>Next.js App Router SSR</h2>
        <p>Server-side render chat with initial data:</p>
        <CodePlayground
          initialCode={`// app/chat/page.tsx (Server Component)
import { ChatClient } from './chat-client'

export default async function ChatPage() {
  // Fetch initial messages server-side
  const initialMessages = await fetchMessages()

  return (
    <div>
      <h1>Chat</h1>
      <ChatClient initialMessages={initialMessages} />
    </div>
  )
}

// app/chat/chat-client.tsx (Client Component)


import { ClarityChat } from '@clarity-chat/react/internal'

export function ChatClient({ initialMessages }: { initialMessages: Message[] }) {
  return (
    <ClarityChat
      api="/api/chat"
      initialMessages={initialMessages}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Server Actions</h2>
        <p>Use Server Actions for chat operations:</p>
        <CodePlayground
          initialCode={`// app/actions/chat.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function sendMessage(formData: FormData) {
  const message = formData.get('message') as string
  
  // Process on server
  const response = await createChatResponse(message)
  
  // Revalidate
  revalidatePath('/chat')
  
  return response
}

// app/chat/page.tsx


import { sendMessage } from '@/app/actions/chat'
import { ChatInput } from '@clarity-chat/react/internal'

export default function ChatPage() {
  return (
    <ChatInput
      onSend={async (content) => {
        const formData = new FormData()
        formData.append('message', content)
        await sendMessage(formData)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Streaming with SSR</h2>
        <p>Handle streaming in SSR context:</p>
        <CodePlayground
          initialCode={`// app/api/chat/route.ts
import { StreamingTextResponse } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  // Create streaming response
  const stream = await createStream(messages)
  
  return new StreamingTextResponse(stream)
}

// Client component handles streaming


import { useClarityChat } from '@clarity-chat/react/internal'

export function StreamingChat() {
  const chat = useClarityChat({
    api: '/api/chat',
    enableStreaming: true,
  })
  
  return <ChatWindow messages={chat.messages} />
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Remix SSR</h2>
        <p>Use with Remix loader:</p>
        <CodePlayground
          initialCode={`// app/routes/chat.tsx
import { useLoaderData } from '@remix-run/react'
import { ClarityChat } from '@clarity-chat/react/internal'

export async function loader() {
  // Load initial data server-side
  const messages = await loadMessages()
  return { messages }
}

export default function ChatRoute() {
  const { messages } = useLoaderData()
  
  return (
    <ClarityChat
      api="/api/chat"
      initialMessages={messages}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Load initial data server-side for faster initial render</li>
          <li>Use Server Components for configuration</li>
          <li>Use Client Components for interactive UI</li>
          <li>Handle streaming client-side</li>
          <li>Revalidate paths after mutations</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/cookbook/nextjs-integration">Next.js Integration</a> -
            Next.js deep dive
          </li>
          <li>
            <a href="/reference/components/clarity-chat">ClarityChat</a> - Main
            chat component
          </li>
        </ul>
      </section>
    </div>
  )
}
