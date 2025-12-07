'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'Next.js Integration | Clarity Chat',
  description: 'Complete Next.js App Router setup with Server Components, API routes, streaming, and Clarity Chat.',
}

export default function NextJSIntegrationPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Next.js Integration</h1>

      <p className="lead">
        Complete guide to integrating Clarity Chat with Next.js 14+ App Router, including
        Server Components, API routes, streaming, authentication, and production best practices.
      </p>

      <Callout type="info" title="Next.js 14+ App Router">
        <p>
          This guide covers Next.js 14+ with the App Router. For Pages Router, see the
          backend integration patterns guide.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Get up and running in minutes:
        </p>
        
        <EnhancedCodeBlock
          language="bash"
          code={`# Create Next.js app
npx create-next-app@latest my-chat-app --typescript --tailwind --app
cd my-chat-app

# Install Clarity Chat
npm install @clarity-chat/react openai ai

# Install peer dependencies (if needed)
npm install framer-motion`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Project Structure</h2>
        <CodeBlock
          language="text"
          code={`app/
├── layout.tsx              # Root layout with providers
├── page.tsx               # Home page
├── chat/
│   └── page.tsx           # Chat page (client component)
└── api/
    └── chat/
        └── route.ts        # Chat API endpoint (streaming)

lib/
├── openai.ts              # OpenAI client configuration
└── utils.ts               # Helper functions

components/
└── chat/
    └── chat-client.tsx    # Client-side chat component`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Step 1: Root Layout</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Set up your root layout with Clarity Chat styles:
        </p>
        <EnhancedCodeBlock
          language="tsx"
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

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Step 2: Chat API Route (Streaming)</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Create a streaming API route with proper error handling:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`// app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const runtime = 'edge' // or 'nodejs' for Node.js runtime

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { messages } = await req.json()

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create streaming response
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      stream: true,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Be concise and friendly.',
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Step 3: Simple Chat Page (ClarityChat Component)</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The easiest way - using the top-level ClarityChat component:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`// app/chat/page.tsx
'use client'

import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col">
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">My AI Chat</h1>
      </header>
      <div className="flex-1">
        <ClarityChat
          api="/api/chat"
          onError={(error) => {
            console.error('Chat error:', error)
            // Handle error (show toast, etc.)
          }}
        />
      </div>
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Step 4: Advanced Chat with useClarityChat</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          For more control, use the useClarityChat hook:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`// app/chat/page.tsx
'use client'

import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'
import { useState } from 'react'

export default function AdvancedChatPage() {
  const chat = useClarityChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error)
    },
  })

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">My AI Chat</h1>
        {chat.tokenStats && (
          <div className="text-sm text-gray-500">
            Tokens: {chat.tokenStats.totalTokens}
          </div>
        )}
      </header>
      <div className="flex-1">
        <ChatWindow
          messages={chat.messages}
          onSendMessage={chat.sendMessage}
          isLoading={chat.isLoading}
          onClear={chat.clearMessages}
        />
      </div>
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Step 5: Environment Variables</h2>
        <EnhancedCodeBlock
          language="bash"
          code={`# .env.local (not committed to git)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# .env.example (commit this to git)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Advanced Patterns</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">With Memory Integration</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`// app/chat/page.tsx
'use client'

import { ClarityChat } from '@clarity-chat/react'

export default function ChatWithMemory() {
  return (
    <ClarityChat
      api="/api/chat"
      memory={{
        enabled: true,
        strategy: 'sliding-window',
        maxTokens: 8000,
      }}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Custom Headers</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`// app/chat/page.tsx
'use client'

import { useClarityChat } from '@clarity-chat/react'

export default function ChatWithHeaders() {
  const chat = useClarityChat({
    api: '/api/chat',
    headers: {
      'X-User-ID': 'user-123',
      'X-Session-ID': 'session-456',
    },
  })

  return <ChatWindow messages={chat.messages} onSendMessage={chat.sendMessage} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Server-Side Authentication</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`// app/api/chat/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  // Authenticate user
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const userId = session.user.id
  const { messages } = await req.json()

  // Add user context to system message
  const systemMessage = {
    role: 'system' as const,
    content: \`You are helping user \${userId}. Be helpful and personalized.\`,
  }

  // Continue with OpenAI call...
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Rate Limiting</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`// app/api/chat/route.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
})

export async function POST(req: Request) {
  // Get user identifier (IP or user ID)
  const identifier = req.headers.get('x-forwarded-for') || 'unknown'
  
  const { success, limit, remaining } = await ratelimit.limit(identifier)
  
  if (!success) {
    return new Response(
      JSON.stringify({ error: 'Too many requests' }),
      { 
        status: 429,
        headers: { 
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
        }
      }
    )
  }
  
  // Continue with chat...
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Production Best Practices</h2>

        <h3 className="text-lg font-semibold mt-4 mb-2">1. Error Handling</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`// app/api/chat/route.ts
export async function POST(req: Request) {
  try {
    // ... chat logic
  } catch (error) {
    // Log error for monitoring
    console.error('Chat API error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })

    // Return user-friendly error
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request',
        code: 'CHAT_ERROR'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}`}
        />

        <h3 className="text-lg font-semibold mt-4 mb-2">2. Conversation Persistence</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`// lib/db.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export async function saveMessage(
  conversationId: string,
  message: { role: string; content: string }
) {
  await supabase.from('messages').insert({
    conversation_id: conversationId,
    role: message.role,
    content: message.content,
    created_at: new Date().toISOString(),
  })
}

export async function getConversation(conversationId: string) {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  
  return data
}`}
        />

        <h3 className="text-lg font-semibold mt-4 mb-2">3. TypeScript Configuration</h3>
        <EnhancedCodeBlock
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
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Server Components Integration</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Use Server Components for initial data loading:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`// app/chat/page.tsx (Server Component)
import { getConversation } from '@/lib/db'
import ChatClient from '@/components/chat/chat-client'

export default async function ChatPage({
  searchParams,
}: {
  searchParams: { conversationId?: string }
}) {
  // Load conversation on server
  const initialMessages = searchParams.conversationId
    ? await getConversation(searchParams.conversationId)
    : []

  return <ChatClient initialMessages={initialMessages} />
}

// components/chat/chat-client.tsx (Client Component)
'use client'

import { useClarityChat, ChatWindow } from '@clarity-chat/react'

export default function ChatClient({ 
  initialMessages 
}: { 
  initialMessages: any[] 
}) {
  const chat = useClarityChat({
    api: '/api/chat',
    initialMessages,
  })

  return (
    <ChatWindow
      messages={chat.messages}
      onSendMessage={chat.sendMessage}
      isLoading={chat.isLoading}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <CodePlayground
          initialCode={`'use client'

import { ClarityChat } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="h-screen">
      <ClarityChat api="/api/chat" />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/cookbook/quick-start-3-lines" className="docs-card">
            <h3>3-Line Quick Start</h3>
            <p>Simplest integration</p>
          </a>
          <a href="/cookbook/backend-integration-patterns" className="docs-card">
            <h3>Backend Integration Patterns</h3>
            <p>More backend examples</p>
          </a>
          <a href="/cookbook/memory-integration" className="docs-card">
            <h3>Memory Integration</h3>
            <p>Add conversation memory</p>
          </a>
          <a href="/cookbook/streaming-setup" className="docs-card">
            <h3>Streaming Setup</h3>
            <p>Streaming configuration</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'Backend Integration Patterns', href: '/cookbook/backend-integration-patterns' }}
        next={{ title: 'Custom Theming', href: '/cookbook/custom-theming' }}
      />
    </>
  )
}
