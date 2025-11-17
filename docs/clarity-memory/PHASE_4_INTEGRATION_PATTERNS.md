# Phase 4: Integration Patterns

## Executive Summary

This document covers how Clarity Memory integrates with various platforms, frameworks, and use cases. It provides concrete examples for React, Node.js, serverless functions, browser apps, and AI SDKs.

---

## 1. Integration with Clarity Chat

### 1.1 Basic Integration

```typescript
// In your Clarity Chat component
import { useClarityChat } from '@clarity-chat/react'
import { clarityMemory } from '@clarity-chat/memory'

function ChatComponent() {
  const memory = clarityMemory({ context: "user123" })
  const { messages, sendMessage } = useClarityChat({
    // ... chat config
  })
  
  // Extract memories from messages
  useEffect(() => {
    if (messages.length > 0) {
      memory.extractFromMessages(messages)
    }
  }, [messages])
  
  // Use memory for context
  const handleSend = async (content: string) => {
    const context = await memory.recall(content)
    // Include context in your chat
    sendMessage(content, { context })
  }
  
  return (
    // ... your chat UI
  )
}
```

### 1.2 Advanced Integration with Context

```typescript
import { useClarityChat } from '@clarity-chat/react'
import { clarityMemory, createMemoryAdapter } from '@clarity-chat/memory'

function AdvancedChatComponent() {
  const memory = clarityMemory({
    context: "user123",
    tokenBudget: {
      maxTokens: 4000,
      reserveTokens: 500,
    },
  })
  
  const memoryAdapter = createMemoryAdapter(memory)
  
  const { messages, sendMessage } = useClarityChat({
    // Use memory adapter for context
    getContext: async (query: string) => {
      return memoryAdapter.getContext(query, 4000)
    },
  })
  
  // Auto-extract memories
  useEffect(() => {
    if (messages.length > 0) {
      memory.extractFromMessages(messages, {
        extractPreferences: true,
        extractFacts: true,
      })
    }
  }, [messages])
  
  return (
    <div>
      <ChatInterface />
      <MemoryInspector memory={memory} />
    </div>
  )
}
```

### 1.3 Hook-Based Integration

```typescript
import { useMemory } from '@clarity-chat/memory/react'
import { useClarityChat } from '@clarity-chat/react'

function ChatWithMemory() {
  const { memory, add, recall, stats } = useMemory({
    context: "user123",
  })
  
  const { messages, sendMessage } = useClarityChat({
    getContext: async (query: string) => {
      const result = await recall(query, { includeSummary: true })
      return {
        messages: result.memories.map(m => ({
          role: 'system' as const,
          content: m.content,
        })),
        tokens: result.tokens,
      }
    },
  })
  
  return (
    <div>
      <Chat messages={messages} onSend={sendMessage} />
      <MemoryStats stats={stats} />
    </div>
  )
}
```

---

## 2. Standalone Usage

### 2.1 Node.js Script

```typescript
// scripts/remember-user.ts
import { clarityMemory } from '@clarity-chat/memory'

async function main() {
  // Zero-config usage
  const memory = clarityMemory({ context: "user123" })
  
  // Add memories
  await memory.add("User likes pizza")
  await memory.add("User works as a software engineer")
  await memory.add("User lives in San Francisco")
  
  // Recall memories
  const results = await memory.recall("What does the user like?")
  console.log(results.memories)
  
  // Get context for LLM
  const context = await memory.context({
    query: "Tell me about the user",
    maxTokens: 2000,
  })
  
  console.log(context.messages)
  
  // Cleanup
  await memory.close()
}

main()
```

### 2.2 File-Based Persistence

```typescript
// scripts/persistent-memory.ts
import { clarityMemory } from '@clarity-chat/memory'

async function main() {
  // Use file storage for persistence
  const memory = clarityMemory({
    context: "user123",
    store: {
      type: 'file',
      path: './memory.json',
    },
    longTerm: {
      enabled: true,
      store: {
        type: 'file',
        path: './memory-longterm.json',
      },
    },
  })
  
  // Memories persist across runs
  await memory.add("User preference: dark mode")
  
  await memory.close()
}
```

### 2.3 Command-Line Tool

```typescript
// cli/memory-cli.ts
import { clarityMemory } from '@clarity-chat/memory'
import { program } from 'commander'

program
  .command('add <content>')
  .option('-c, --context <context>', 'Context ID', 'default')
  .action(async (content, options) => {
    const memory = clarityMemory({ context: options.context })
    await memory.add(content)
    console.log('Memory added!')
    await memory.close()
  })

program
  .command('recall <query>')
  .option('-c, --context <context>', 'Context ID', 'default')
  .action(async (query, options) => {
    const memory = clarityMemory({ context: options.context })
    const results = await memory.recall(query)
    console.log(results.memories.map(m => m.content))
    await memory.close()
  })

program.parse()
```

---

## 3. Serverless Functions

### 3.1 Vercel Serverless Function

```typescript
// api/memory.ts (Vercel)
import { clarityMemory } from '@clarity-chat/memory'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Use file storage (persists in Vercel's filesystem)
  const memory = clarityMemory({
    context: req.headers['x-user-id'] as string,
    store: {
      type: 'file',
      path: `/tmp/memory-${req.headers['x-user-id']}.json`,
    },
  })
  
  if (req.method === 'POST') {
    // Add memory
    const { content, metadata } = req.body
    const item = await memory.add(content, metadata)
    res.json({ success: true, id: item.id })
  } else if (req.method === 'GET') {
    // Search memories
    const { query } = req.query
    const results = await memory.recall(query as string)
    res.json(results)
  }
  
  await memory.close()
}
```

### 3.2 AWS Lambda Function

```typescript
// lambda/memory-handler.ts
import { clarityMemory } from '@clarity-chat/memory'
import { S3Client } from '@aws-sdk/client-s3'

export const handler = async (event: any) => {
  // Use S3 for persistence (via custom store adapter)
  const memory = clarityMemory({
    context: event.userId,
    store: {
      type: 's3',  // Custom adapter
      bucket: process.env.MEMORY_BUCKET,
      key: `memory/${event.userId}.json`,
    },
  })
  
  if (event.action === 'add') {
    const item = await memory.add(event.content, event.metadata)
    return { statusCode: 200, body: JSON.stringify({ id: item.id }) }
  } else if (event.action === 'recall') {
    const results = await memory.recall(event.query)
    return { statusCode: 200, body: JSON.stringify(results) }
  }
  
  await memory.close()
}
```

### 3.3 Cloudflare Workers

```typescript
// workers/memory-worker.ts
import { clarityMemory } from '@clarity-chat/memory'

export default {
  async fetch(request: Request): Promise<Response> {
    // Use Cloudflare KV for persistence
    const memory = clarityMemory({
      context: request.headers.get('x-user-id') || 'default',
      store: {
        type: 'cloudflare-kv',  // Custom adapter
        namespace: MEMORY_KV,
      },
    })
    
    const url = new URL(request.url)
    
    if (url.pathname === '/add' && request.method === 'POST') {
      const { content, metadata } = await request.json()
      const item = await memory.add(content, metadata)
      return new Response(JSON.stringify({ id: item.id }))
    } else if (url.pathname === '/recall' && request.method === 'GET') {
      const query = url.searchParams.get('query')
      const results = await memory.recall(query || '')
      return new Response(JSON.stringify(results))
    }
    
    await memory.close()
    return new Response('Not found', { status: 404 })
  },
}
```

---

## 4. Browser Applications

### 4.1 React App with IndexedDB

```typescript
// App.tsx
import { MemoryProvider, useMemory } from '@clarity-chat/memory/react'

function App() {
  return (
    <MemoryProvider
      config={{
        context: "user123",
        store: {
          type: 'indexeddb',  // Persists in browser
        },
      }}
    >
      <ChatApp />
    </MemoryProvider>
  )
}

function ChatApp() {
  const { memory, add, recall } = useMemory()
  
  const handleMessage = async (content: string) => {
    // Add user message to memory
    await add(content)
    
    // Recall relevant context
    const context = await recall(content)
    
    // Use context in your chat
    // ...
  }
  
  return (
    <div>
      <Chat onMessage={handleMessage} />
      <MemoryInspector memory={memory} />
    </div>
  )
}
```

### 4.2 Vanilla JavaScript

```typescript
// app.js
import { clarityMemory } from '@clarity-chat/memory'

// Use IndexedDB in browser
const memory = clarityMemory({
  context: "user123",
  store: {
    type: 'indexeddb',
  },
})

// Add memory
await memory.add("User prefers dark mode")

// Recall
const results = await memory.recall("What are user preferences?")
console.log(results.memories)
```

### 4.3 Next.js App Router

```typescript
// app/chat/page.tsx
'use client'

import { useMemory } from '@clarity-chat/memory/react'
import { useClarityChat } from '@clarity-chat/react'

export default function ChatPage() {
  const { memory, recall } = useMemory({
    context: "user123",
    store: {
      type: 'indexeddb',
    },
  })
  
  const { messages, sendMessage } = useClarityChat({
    getContext: async (query: string) => {
      const result = await recall(query)
      return {
        messages: result.memories.map(m => ({
          role: 'system' as const,
          content: m.content,
        })),
      }
    },
  })
  
  return (
    <div>
      <Chat messages={messages} onSend={sendMessage} />
    </div>
  )
}
```

---

## 5. Integration with AI SDKs

### 5.1 Vercel AI SDK

```typescript
// app/api/chat/route.ts
import { clarityMemory } from '@clarity-chat/memory'
import { openai } from 'ai/openai'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages, userId } = await req.json()
  
  // Create memory instance
  const memory = clarityMemory({
    context: userId,
    store: { type: 'file', path: `/tmp/memory-${userId}.json` },
  })
  
  // Extract memories from conversation
  await memory.extractFromMessages(messages)
  
  // Get context for current query
  const lastMessage = messages[messages.length - 1]
  const context = await memory.context({
    query: lastMessage.content,
    maxTokens: 2000,
    format: 'openai',
  })
  
  // Combine context with messages
  const systemMessage = {
    role: 'system' as const,
    content: context.messages.map(m => m.content).join('\n\n'),
  }
  
  const result = await streamText({
    model: openai('gpt-4'),
    messages: [systemMessage, ...messages],
  })
  
  await memory.close()
  return result.toDataStreamResponse()
}
```

### 5.2 LangChain Integration

```typescript
// langchain-memory.ts
import { clarityMemory } from '@clarity-chat/memory'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'

export async function chatWithMemory(query: string, userId: string) {
  const memory = clarityMemory({ context: userId })
  
  // Get context from memory
  const context = await memory.context({
    query,
    maxTokens: 2000,
  })
  
  // Create LangChain prompt with context
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', context.messages.map(m => m.content).join('\n\n')],
    ['human', query],
  ])
  
  const model = new ChatOpenAI({ modelName: 'gpt-4' })
  const chain = prompt.pipe(model)
  
  const response = await chain.invoke({})
  
  // Add response to memory
  await memory.add(response.content)
  
  await memory.close()
  return response.content
}
```

### 5.3 OpenAI API Direct

```typescript
// openai-direct.ts
import { clarityMemory } from '@clarity-chat/memory'
import OpenAI from 'openai'

const openai = new OpenAI()

export async function chat(userId: string, message: string) {
  const memory = clarityMemory({ context: userId })
  
  // Get context
  const context = await memory.context({
    query: message,
    maxTokens: 2000,
    format: 'openai',
  })
  
  // Call OpenAI API
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      ...context.messages,
      { role: 'user', content: message },
    ],
  })
  
  const response = completion.choices[0].message.content
  
  // Add to memory
  await memory.add(message, { role: 'user' })
  await memory.add(response!, { role: 'assistant' })
  
  await memory.close()
  return response
}
```

### 5.4 Anthropic API

```typescript
// anthropic-direct.ts
import { clarityMemory } from '@clarity-chat/memory'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

export async function chat(userId: string, message: string) {
  const memory = clarityMemory({ context: userId })
  
  // Get context
  const context = await memory.context({
    query: message,
    maxTokens: 2000,
    format: 'anthropic',
  })
  
  // Call Anthropic API
  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    messages: [
      ...context.messages,
      { role: 'user', content: message },
    ],
  })
  
  const content = response.content[0].type === 'text' 
    ? response.content[0].text 
    : ''
  
  // Add to memory
  await memory.add(message, { role: 'user' })
  await memory.add(content, { role: 'assistant' })
  
  await memory.close()
  return content
}
```

---

## 6. Multi-User Applications

### 6.1 User-Specific Memory

```typescript
// multi-user-app.ts
import { clarityMemory } from '@clarity-chat/memory'

class UserMemoryManager {
  private memories: Map<string, Memory> = new Map()
  
  getMemory(userId: string): Memory {
    if (!this.memories.has(userId)) {
      this.memories.set(
        userId,
        clarityMemory({
          context: userId,
          store: {
            type: 'file',
            path: `./memory-${userId}.json`,
          },
        })
      )
    }
    return this.memories.get(userId)!
  }
  
  async addMemory(userId: string, content: string) {
    const memory = this.getMemory(userId)
    return memory.add(content)
  }
  
  async recall(userId: string, query: string) {
    const memory = this.getMemory(userId)
    return memory.recall(query)
  }
}

// Usage
const manager = new UserMemoryManager()
await manager.addMemory('user1', 'I like pizza')
await manager.addMemory('user2', 'I like sushi')
```

### 6.2 Session-Based Memory

```typescript
// session-memory.ts
import { clarityMemory } from '@clarity-chat/memory'

class SessionMemoryManager {
  private memories: Map<string, Memory> = new Map()
  
  getMemory(sessionId: string): Memory {
    if (!this.memories.has(sessionId)) {
      this.memories.set(
        sessionId,
        clarityMemory({
          context: sessionId,
          store: {
            type: 'in-memory',  // Ephemeral per session
          },
        })
      )
    }
    return this.memories.get(sessionId)!
  }
  
  async endSession(sessionId: string) {
    const memory = this.memories.get(sessionId)
    if (memory) {
      await memory.close()
      this.memories.delete(sessionId)
    }
  }
}
```

---

## 7. Production Patterns

### 7.1 Connection Pooling

```typescript
// connection-pool.ts
import { clarityMemory } from '@clarity-chat/memory'

class MemoryPool {
  private pool: Map<string, Memory> = new Map()
  private maxSize: number = 100
  
  get(context: string): Memory {
    if (this.pool.has(context)) {
      return this.pool.get(context)!
    }
    
    if (this.pool.size >= this.maxSize) {
      // Evict least recently used
      const lru = this.getLRU()
      this.pool.delete(lru)
    }
    
    const memory = clarityMemory({ context })
    this.pool.set(context, memory)
    return memory
  }
  
  private getLRU(): string {
    // Implementation
    return ''
  }
  
  async closeAll() {
    await Promise.all(
      Array.from(this.pool.values()).map(m => m.close())
    )
    this.pool.clear()
  }
}
```

### 7.2 Error Handling

```typescript
// error-handling.ts
import { clarityMemory, MemoryError } from '@clarity-chat/memory'

async function safeMemoryOperation(context: string, operation: () => Promise<void>) {
  const memory = clarityMemory({ context })
  
  try {
    await operation()
  } catch (error) {
    if (error instanceof MemoryError) {
      console.error(`Memory error: ${error.code}`, error.message)
      // Handle specific error codes
      if (error.code === 'TOKEN_BUDGET_EXCEEDED') {
        // Retry with smaller budget
      }
    } else {
      console.error('Unexpected error:', error)
    }
    throw error
  } finally {
    await memory.close()
  }
}
```

### 7.3 Monitoring & Metrics

```typescript
// monitoring.ts
import { clarityMemory } from '@clarity-chat/memory'

class MonitoredMemory {
  private memory: Memory
  
  constructor(context: string) {
    this.memory = clarityMemory({ context })
    
    // Track operations
    this.memory.on('ingestion', (memories) => {
      metrics.increment('memory.ingestion', { count: memories.length })
    })
    
    this.memory.on('compression', (result) => {
      metrics.histogram('memory.compression.ratio', result.ratio)
    })
  }
  
  async add(content: string) {
    const start = Date.now()
    const result = await this.memory.add(content)
    metrics.timing('memory.add', Date.now() - start)
    return result
  }
  
  async recall(query: string) {
    const start = Date.now()
    const result = await this.memory.recall(query)
    metrics.timing('memory.recall', Date.now() - start)
    metrics.histogram('memory.recall.tokens', result.tokens)
    return result
  }
}
```

---

## 8. Migration Examples

### 8.1 From MemMachine REST API

```typescript
// migration-from-memmachine.ts
import { clarityMemory } from '@clarity-chat/memory'

// Old MemMachine code
// const client = MemMachineClient(base_url="http://localhost:8080")
// const memory = client.memory(group_id="group", agent_id=["agent"], user_id=["user"], session_id="session")

// New Clarity Memory code
const memory = clarityMemory({
  context: "user:session",  // Simplified from 4 IDs to 1
})

// Old: memory.add("Hello")
// New: await memory.add("Hello")  // Same API, just async
```

### 8.2 From MemMachine Python SDK

```typescript
// migration-from-python.ts
// Old Python code:
// memory = client.memory(group_id="group", user_id=["user"], session_id="session")
// memory.add("Hello")

// New TypeScript code:
const memory = clarityMemory({ context: "user:session" })
await memory.add("Hello")
```

---

## Conclusion

Clarity Memory integrates seamlessly with:
- ✅ React applications (hooks, providers, components)
- ✅ Node.js scripts and servers
- ✅ Serverless functions (Vercel, AWS Lambda, Cloudflare Workers)
- ✅ Browser applications (IndexedDB persistence)
- ✅ AI SDKs (Vercel AI SDK, LangChain, OpenAI, Anthropic)
- ✅ Multi-user applications
- ✅ Production environments (monitoring, error handling, pooling)

The key advantage is **zero-config defaults** - it works everywhere with minimal setup, while allowing full customization when needed.
