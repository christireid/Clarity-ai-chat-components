import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'


export const metadata: Metadata = {
  title: 'Next.js Integration Deep Dive - Clarity Chat Components',
  description: 'Complete guide to integrating Clarity Chat Components with Next.js App Router, Server Components, and API routes.',
}

export default function NextJSIntegrationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Recipe</span>
        <h1>Next.js Integration Deep Dive</h1>
        <p className="docs-lead">
          Complete guide to integrating Clarity Chat Components with Next.js App Router, Server Components, API routes, and streaming.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Set up Clarity Chat in Next.js App Router',
          'Use Server Components for configuration',
          'Create API routes for chat endpoints',
          'Implement streaming responses',
          'Handle authentication and middleware',
        ]}
      />

      <section className="docs-section">
        <h2>App Router Setup</h2>
        <p>
          Set up Clarity Chat in Next.js App Router:
        </p>
        <CodePlayground
          initialCode={`// app/chat/page.tsx
'use client'

import { ClarityChat } from '@clarity-chat/react'

export default function ChatPage() {
  return (
    <div className="container mx-auto p-4">
      <ClarityChat
        api="/api/chat"
        config={{
          theme: 'light',
          enableMemory: true,
        }}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Server Component Configuration</h2>
        <p>
          Use Server Components for secure configuration:
        </p>
        <CodePlayground
          initialCode={`// app/chat/layout.tsx
import { ClarityChat } from '@clarity-chat/react'

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  // Server-side configuration
  const config = {
    apiEndpoint: process.env.CHAT_API_ENDPOINT,
    enableMemory: true,
    maxTokens: 8000,
  }

  return (
    <div>
      <ClarityChatProvider config={config}>
        {children}
      </ClarityChatProvider>
    </div>
  )
}

// app/chat/page.tsx (Client Component)
'use client'
import { useClarityChat } from '@clarity-chat/react'

export default function ChatPage() {
  const chat = useClarityChat()
  return <ChatWindow {...chat} />
}`}
        />
      </section>

      <section className="docs-section">
        <h2>API Route with Streaming</h2>
        <p>
          Create streaming API route:
        </p>
        <CodePlayground
          initialCode={`// app/api/chat/route.ts
import { NextRequest } from 'next/server'
import { StreamingTextResponse } from 'ai'

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  // Create streaming response
  const stream = await createChatStream(messages)

  return new StreamingTextResponse(stream)
}

async function createChatStream(messages: any[]) {
  // Use OpenAI or other provider
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages,
      stream: true,
    }),
  })

  return response.body
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Authentication Middleware</h2>
        <p>
          Add authentication to chat routes:
        </p>
        <CodePlayground
          initialCode={`// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check authentication
  const token = request.cookies.get('auth-token')
  
  if (!token && request.nextUrl.pathname.startsWith('/chat')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Add tenant ID from session
  const tenantId = request.headers.get('x-tenant-id')
  if (tenantId) {
    request.headers.set('x-tenant-id', tenantId)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/chat/:path*', '/api/chat/:path*'],
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Server Actions</h2>
        <p>
          Use Server Actions for chat operations:
        </p>
        <CodePlayground
          initialCode={`// app/actions/chat.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function sendMessage(formData: FormData) {
  const message = formData.get('message') as string
  const conversationId = formData.get('conversationId') as string

  // Process message server-side
  const response = await createChatResponse(message, conversationId)

  // Revalidate chat page
  revalidatePath('/chat')

  return response
}

export async function deleteConversation(conversationId: string) {
  await deleteConversationFromDB(conversationId)
  revalidatePath('/chat')
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Complete Next.js Integration</h2>
        <p>
          Complete Next.js integration example:
        </p>
        <CodePlayground
          initialCode={`// app/chat/page.tsx
'use client'

import { ClarityChat } from '@clarity-chat/react'
import { useSession } from 'next-auth/react'

export default function ChatPage() {
  const { data: session } = useSession()

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b p-4">
        <h1>Chat</h1>
        <div>User: {session?.user?.name}</div>
      </header>
      
      <div className="flex-1">
        <ClarityChat
          api="/api/chat"
          headers={{
            'Authorization': \`Bearer \${session?.accessToken}\`,
          }}
          config={{
            enableMemory: true,
            enableStreaming: true,
          }}
        />
      </div>
    </div>
  )
}

// app/api/chat/route.ts
import { auth } from '@/auth'
import { StreamingTextResponse } from 'ai'

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages } = await req.json()
  const stream = await createChatStream(messages, session.user.id)

  return new StreamingTextResponse(stream)
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use Server Components for configuration and data fetching</li>
          <li>Use Client Components for interactive chat UI</li>
          <li>Implement streaming for better UX</li>
          <li>Add authentication middleware for protected routes</li>
          <li>Use Server Actions for mutations</li>
          <li>Handle errors gracefully</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/components/clarity-chat">ClarityChat</a> - Main chat component</li>
          <li><a href="/reference/hooks/use-clarity-chat">useClarityChat</a> - Chat hook</li>
        </ul>
      </section>
    </div>
  )
}
