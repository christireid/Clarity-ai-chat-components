# Tutorials

Step-by-step tutorials for building common chat applications with Clarity Chat.

## Table of Contents

1. [Building Your First Chat App](#building-your-first-chat-app)
2. [Adding Streaming Responses](#adding-streaming-responses)
3. [Implementing RAG](#implementing-rag)
4. [Building a Multi-Tenant SaaS](#building-a-multi-tenant-saas)
5. [Creating an AI Agent](#creating-an-ai-agent)

## Building Your First Chat App

In this tutorial, you'll build a complete chat application from scratch.

### Step 1: Setup

Create a new Next.js project:

```bash
npx create-next-app@latest my-chat-app
cd my-chat-app
npm install @clarity-chat/react
```

### Step 2: Create the Chat Component

Create `app/components/Chat.tsx`:

```tsx
'use client'

import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Call your API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      const data = await response.json()
      
      // Add assistant message
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
      }])
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSend}
    />
  )
}
```

### Step 3: Create API Route

Create `app/api/chat/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { OpenAIAdapter } from '@clarity-chat/react'

const adapter = new OpenAIAdapter({
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'gpt-4',
})

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    const response = await adapter.complete({
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    return NextResponse.json({
      message: response.content,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

### Step 4: Use in Your Page

Update `app/page.tsx`:

```tsx
import { Chat } from './components/Chat'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Chat App</h1>
      <Chat />
    </main>
  )
}
```

### Step 5: Add Environment Variables

Create `.env.local`:

```env
OPENAI_API_KEY=your-api-key-here
```

### Step 6: Run Your App

```bash
npm run dev
```

Visit `http://localhost:3000` and start chatting!

## Adding Streaming Responses

Learn how to add real-time streaming to your chat app.

### Step 1: Update API Route

Modify `app/api/chat/route.ts` to support streaming:

```typescript
import { NextRequest } from 'next/server'
import { OpenAIAdapter } from '@clarity-chat/react'

const adapter = new OpenAIAdapter({
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'gpt-4',
})

export async function POST(request: NextRequest) {
  const { messages } = await request.json()

  const stream = await adapter.stream({
    messages: messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    })),
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

### Step 2: Update Chat Component

Modify `app/components/Chat.tsx` to handle streaming:

```tsx
'use client'

import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Create placeholder for assistant message
    const assistantMessageId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, assistantMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ''

      if (!reader) return

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              setIsLoading(false)
              break
            }

            try {
              const parsed = JSON.parse(data)
              accumulatedContent += parsed.content || ''
              
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: accumulatedContent }
                    : msg
                )
              )
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setIsLoading(false)
    }
  }

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSend}
    />
  )
}
```

## Implementing RAG

Build a RAG-powered chat that retrieves information from your documents.

### Step 1: Install Dependencies

```bash
npm install @clarity-chat/react
```

### Step 2: Set Up Vector Store

Create `lib/vector-store.ts`:

```typescript
import { PineconeVectorStore, OpenAIEmbeddings } from '@clarity-chat/react'

export const vectorStore = new PineconeVectorStore({
  apiKey: process.env.PINECONE_API_KEY!,
  indexName: 'documents',
})

export const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY!,
})
```

### Step 3: Create Document Loader

Create `lib/document-loader.ts`:

```typescript
import { PDFLoader } from '@clarity-chat/react'

export async function loadDocuments(files: File[]) {
  const loader = new PDFLoader()
  const documents = []

  for (const file of files) {
    const chunks = await loader.load(file)
    documents.push(...chunks)
  }

  // Generate embeddings
  const vectors = await Promise.all(
    documents.map(async (doc) => ({
      id: doc.id,
      values: await embeddings.embedText(doc.content),
      metadata: {
        content: doc.content,
        source: doc.metadata.source,
      },
    }))
  )

  // Store in vector database
  await vectorStore.upsert(vectors)

  return documents
}
```

### Step 4: Create RAG API Route

Create `app/api/rag/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { OpenAIAdapter } from '@clarity-chat/react'
import { vectorStore, embeddings } from '@/lib/vector-store'

const adapter = new OpenAIAdapter({
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'gpt-4',
})

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Generate query embedding
    const queryEmbedding = await embeddings.embedQuery(message)

    // Retrieve relevant documents
    const results = await vectorStore.similaritySearch({
      query: queryEmbedding,
      topK: 5,
    })

    // Build context
    const context = results
      .map(r => r.content)
      .join('\n\n')

    // Generate response with context
    const response = await adapter.complete({
      messages: [
        {
          role: 'system',
          content: `Answer questions using the following context:\n\n${context}`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    })

    return NextResponse.json({
      message: response.content,
      sources: results.map(r => r.metadata.source),
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

### Step 5: Update Chat Component

Modify `app/components/Chat.tsx` to use RAG:

```tsx
'use client'

import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

export function RAGChat() {
  const [messages, setMessages] = useState<Message[]>([])

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMessage])

    const response = await fetch('/api/rag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: content }),
    })

    const data = await response.json()
    
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: data.message,
      timestamp: Date.now(),
      metadata: {
        sources: data.sources,
      },
    }])
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
    />
  )
}
```

## Building a Multi-Tenant SaaS

Create a multi-tenant chat application with tenant isolation.

### Step 1: Set Up Tenant Management

Create `lib/tenants.ts`:

```typescript
import { TenantManager, MemoryTenantStorage } from '@clarity-chat/react'

const storage = new MemoryTenantStorage()
export const tenants = new TenantManager(storage)

// Initialize tenants
export async function initializeTenants() {
  await storage.addTenant({
    id: 'acme-corp',
    name: 'Acme Corp',
    status: 'active',
    quotas: { tokens: 1000000 },
    createdAt: Date.now(),
  })
}
```

### Step 2: Create Middleware

Create `middleware.ts`:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { tenants } from './lib/tenants'

export async function middleware(request: NextRequest) {
  // Extract tenant ID from subdomain or header
  const hostname = request.headers.get('host') || ''
  const tenantId = hostname.split('.')[0] || request.headers.get('x-tenant-id')

  if (tenantId) {
    const tenant = await tenants.getTenant(tenantId)
    if (tenant) {
      // Set tenant context
      tenants.setContext({
        tenant,
        userId: request.headers.get('x-user-id') || 'anonymous',
      })

      // Add tenant ID to request headers
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-tenant-id', tenantId)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
  }

  return NextResponse.json(
    { error: 'Invalid tenant' },
    { status: 403 }
  )
}

export const config = {
  matcher: '/api/:path*',
}
```

### Step 3: Update API Routes

Modify your API routes to use tenant context:

```typescript
import { tenants } from '@/lib/tenants'
import { vectorStore } from '@/lib/vector-store'

export async function POST(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id')
  if (!tenantId) {
    return NextResponse.json({ error: 'No tenant' }, { status: 403 })
  }

  // Use tenant namespace for data isolation
  const namespace = tenants.getNamespace(tenantId)

  // All vector store operations are tenant-isolated
  const results = await vectorStore.query({
    namespace,
    vector: queryEmbedding,
    topK: 10,
  })

  // ...
}
```

## Creating an AI Agent

Build an AI agent with tool calling capabilities.

### Step 1: Define Tools

Create `lib/tools.ts`:

```typescript
import type { Tool } from '@clarity-chat/react'

export const searchTool: Tool = {
  name: 'search',
  description: 'Search the web for information',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query',
      },
    },
    required: ['query'],
  },
  execute: async ({ query }) => {
    // Implement your search logic
    const results = await fetch(`https://api.example.com/search?q=${query}`)
    return await results.json()
  },
}

export const calculatorTool: Tool = {
  name: 'calculator',
  description: 'Perform mathematical calculations',
  parameters: {
    type: 'object',
    properties: {
      expression: {
        type: 'string',
        description: 'Mathematical expression to evaluate',
      },
    },
    required: ['expression'],
  },
  execute: async ({ expression }) => {
    try {
      // Safe evaluation (use a proper math parser in production)
      const result = Function(`"use strict"; return (${expression})`)()
      return { result }
    } catch (error) {
      return { error: 'Invalid expression' }
    }
  },
}
```

### Step 2: Create Agent

Create `lib/agent.ts`:

```typescript
import { Agent, OpenAIAdapter } from '@clarity-chat/react'
import { searchTool, calculatorTool } from './tools'

const adapter = new OpenAIAdapter({
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'gpt-4',
})

export const agent = new Agent({
  model: adapter,
  tools: [searchTool, calculatorTool],
  systemPrompt: 'You are a helpful assistant with access to search and calculator tools.',
})
```

### Step 3: Create Agent API Route

Create `app/api/agent/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { agent } from '@/lib/agent'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    const result = await agent.run({
      input: message,
    })

    return NextResponse.json({
      output: result.output,
      toolCalls: result.toolCalls,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

### Step 4: Use Agent in Chat

Update your chat component to use the agent:

```tsx
const handleSend = async (content: string) => {
  const response = await fetch('/api/agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: content }),
  })

  const data = await response.json()
  
  setMessages(prev => [...prev, {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: data.output,
    toolCalls: data.toolCalls,
    timestamp: Date.now(),
  }])
}
```

## Next Steps

- Explore the [Cookbook](/cookbook) for more patterns
- Check out [API Reference](/api/components) for detailed documentation
- Read [Advanced Guides](/guide/agents) for more complex features
