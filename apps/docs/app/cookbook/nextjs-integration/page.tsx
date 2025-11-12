import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Next.js 14 Integration - Cookbook - Clarity Chat',
  description: 'Complete Next.js App Router setup with Server Components, API routes, and Clarity Chat.',
}

export default function NextJSIntegrationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <h1>Next.js 14 App Router Integration</h1>
        <p className="docs-lead">
          Set up Clarity Chat in Next.js 14+ with App Router, Server Components, and proper TypeScript configuration.
        </p>
      </div>

      <section className="docs-section">
        <h2>Project Structure</h2>
        <CodeBlock
          language="text"
          code={`app/
├── layout.tsx          # Root layout with providers
├── page.tsx           # Home page
├── chat/
│   └── page.tsx       # Chat page (client component)
└── api/
    └── chat/
        └── route.ts   # Chat API endpoint

lib/
├── openai.ts          # OpenAI client
└── utils.ts           # Helper functions`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 1: Install Dependencies</h2>
        <CodeBlock
          language="bash"
          code={`npx create-next-app@latest my-chat-app --typescript --tailwind --app
cd my-chat-app
npm install @clarity-chat/react openai ai`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 2: Root Layout</h2>
        <CodeBlock
          language="typescript"
          code={`// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@clarity-chat/react/styles.css'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My AI Chat App',
  description: 'Powered by Clarity Chat Components',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 3: Chat API Route</h2>
        <CodeBlock
          language="typescript"
          code={`// app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant. Be concise and friendly.'
      },
      ...messages
    ]
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 4: Chat Page Component</h2>
        <CodeBlock
          language="typescript"
          code={`// app/chat/page.tsx
'use client'

import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      createdAt: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    // Create AI message placeholder
    const aiMessageId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      createdAt: new Date(),
      status: 'streaming'
    }])

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      })

      if (!response.ok) throw new Error('API error')

      // Stream the response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        accumulated += chunk

        setMessages(prev => prev.map(m =>
          m.id === aiMessageId
            ? { ...m, content: accumulated }
            : m
        ))
      }

      // Mark as complete
      setMessages(prev => prev.map(m =>
        m.id === aiMessageId
          ? { ...m, status: undefined }
          : m
      ))

    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => prev.map(m =>
        m.id === aiMessageId
          ? {
              ...m,
              content: 'Sorry, something went wrong.',
              status: 'error'
            }
          : m
      ))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">My AI Chat</h1>
      </header>
      <div className="flex-1">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 5: Environment Variables</h2>
        <CodeBlock
          language="bash"
          code={`# .env.local
OPENAI_API_KEY=sk-your-key-here

# .env.example (commit this to git)
OPENAI_API_KEY=sk-...`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 6: TypeScript Configuration</h2>
        <CodeBlock
          language="json"
          code={`// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Production Improvements</h2>

        <h3>1. Add Conversation Persistence</h3>
        <CodeBlock
          language="typescript"
          code={`// Save to database (Supabase example)
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)

// Save message
await supabase.from('messages').insert({
  conversation_id: conversationId,
  role: message.role,
  content: message.content,
  created_at: message.createdAt
})

// Load conversation
const { data } = await supabase
  .from('messages')
  .select('*')
  .eq('conversation_id', conversationId)
  .order('created_at', { ascending: true })`}
        />

        <h3>2. Add Authentication</h3>
        <CodeBlock
          language="typescript"
          code={`// Use NextAuth.js
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = session.user.id
  // Now you can save messages per user
}`}
        />

        <h3>3. Add Rate Limiting</h3>
        <CodeBlock
          language="typescript"
          code={`// Use Upstash Rate Limit
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m') // 10 requests per minute
})

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return new Response('Too many requests', { status: 429 })
  }
  
  // Continue with chat...
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Related Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/cookbook/authentication" className="docs-card">
            <h3>Add Authentication</h3>
            <p>Secure with NextAuth</p>
          </a>
          <a href="/cookbook/rate-limiting" className="docs-card">
            <h3>Rate Limiting</h3>
            <p>Protect your API</p>
          </a>
          <a href="/cookbook/analytics-tracking" className="docs-card">
            <h3>Analytics</h3>
            <p>Track usage</p>
          </a>
        </div>
      </section>
    </div>
  )
}

