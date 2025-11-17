# Phase 4: Integration Patterns

## Executive Summary

This document outlines how Clarity Memory integrates with various environments, frameworks, and AI SDKs. It provides concrete examples for React, Node.js, serverless functions, browser apps, and integration with popular AI SDKs.

---

## 1. Integration with useClarityChat

### 1.1 Basic Integration

```typescript
// packages/react/src/hooks/useClarityChat.ts (enhanced)

import { clarityMemory } from '@clarity-chat/memory'
import { useClarityChat } from './useClarityChat'

export function useClarityChatWithMemory(config?: {
  memoryConfig?: MemoryConfig
  enableMemory?: boolean
}) {
  const chat = useClarityChat(config)
  const memory = clarityMemory({
    userId: chat.userId,
    sessionId: chat.sessionId,
    ...config?.memoryConfig
  })
  
  // Enhanced send function
  const sendWithMemory = async (message: string) => {
    // 1. Get relevant context from memory
    const context = await memory.context({
      maxTokens: 2000,
      includePreferences: true
    })
    
    // 2. Send message with context
    const response = await chat.send(message, {
      systemPrompt: context.formatted,
      context: {
        memories: context.semanticMemories,
        preferences: context.userPreferences
      }
    })
    
    // 3. Store interaction in memory
    await memory.add(message, {
      type: 'episodic',
      scope: 'session',
      tags: ['user-message']
    })
    
    await memory.add(response, {
      type: 'episodic',
      scope: 'session',
      tags: ['assistant-response']
    })
    
    // 4. Extract preferences/facts from conversation
    const extracted = await memory.extractFromMessages([
      { role: 'user', content: message },
      { role: 'assistant', content: response }
    ], {
      extractPreferences: true,
      extractFacts: true
    })
    
    return response
  }
  
  return {
    ...chat,
    memory,
    send: sendWithMemory,
    recall: (query: string) => memory.recall(query),
    getContext: (options?: ContextOptions) => memory.context(options)
  }
}
```

### 1.2 Automatic Memory Extraction

```typescript
// Auto-extract preferences and facts from conversations

const chat = useClarityChatWithMemory({
  enableMemory: true,
  memoryConfig: {
    summarization: {
      enabled: true,
      interval: 5  // Extract every 5 messages
    }
  }
})

// Automatically extracts:
// - User preferences ("I prefer dark mode")
// - Facts ("My deadline is Friday")
// - Topics (conversation themes)
```

### 1.3 Memory-Aware Responses

```typescript
// Chat automatically uses memory context

const chat = useClarityChatWithMemory()

// User: "What's my favorite color?"
// System automatically includes: "User mentioned they like blue" in context
// Assistant responds with memory-aware answer
```

---

## 2. Standalone Usage with Any LLM

### 2.1 OpenAI SDK

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import OpenAI from 'openai'

const memory = clarityMemory({
  embeddingProvider: { provider: 'openai', apiKey: process.env.OPENAI_API_KEY }
})

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function chat(userId: string, message: string) {
  // 1. Get context from memory
  const context = await memory.context({
    maxTokens: 2000,
    userId
  })
  
  // 2. Call OpenAI with context
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: context.formatted },
      { role: 'user', content: message }
    ]
  })
  
  // 3. Store interaction
  await memory.add(message, { userId, type: 'episodic' })
  await memory.add(response.choices[0].message.content, { userId, type: 'episodic' })
  
  return response.choices[0].message.content
}
```

### 2.2 Anthropic SDK

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import Anthropic from '@anthropic-ai/sdk'

const memory = clarityMemory({
  embeddingProvider: { provider: 'anthropic', apiKey: process.env.ANTHROPIC_API_KEY }
})

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function chat(userId: string, message: string) {
  const context = await memory.context({ maxTokens: 2000, userId })
  
  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    system: context.formatted,
    messages: [{ role: 'user', content: message }]
  })
  
  await memory.add(message, { userId, type: 'episodic' })
  
  return response.content[0].text
}
```

### 2.3 Vercel AI SDK

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import { streamText } from 'ai'
import { openai } from 'ai/openai'

const memory = clarityMemory()

export async function POST(req: Request) {
  const { messages, userId } = await req.json()
  
  // Get context from memory
  const context = await memory.context({
    maxTokens: 2000,
    userId
  })
  
  // Stream response with context
  const result = await streamText({
    model: openai('gpt-4'),
    system: context.formatted,
    messages: messages
  })
  
  // Store last user message
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1]
    await memory.add(lastMessage.content, {
      userId,
      type: 'episodic',
      scope: 'session'
    })
  }
  
  return result.toDataStreamResponse()
}
```

### 2.4 LangChain

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

const memory = clarityMemory()
const llm = new ChatOpenAI({ modelName: 'gpt-4' })

async function chat(userId: string, message: string) {
  // Get context
  const context = await memory.context({ maxTokens: 2000, userId })
  
  // Call LLM
  const response = await llm.invoke([
    new SystemMessage(context.formatted),
    new HumanMessage(message)
  ])
  
  // Store
  await memory.add(message, { userId, type: 'episodic' })
  
  return response.content
}
```

---

## 3. Serverless Functions

### 3.1 Vercel Functions

```typescript
// app/api/chat/route.ts

import { clarityMemory } from '@clarity-chat/memory'
import { NextRequest, NextResponse } from 'next/server'

// Use in-memory storage (stateless, but fast)
// Or use Redis/Postgres for persistence
const memory = clarityMemory({
  storage: {
    type: process.env.NODE_ENV === 'production' ? 'redis' : 'in-memory',
    url: process.env.REDIS_URL
  },
  embeddingProvider: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY
  }
})

export async function POST(req: NextRequest) {
  const { message, userId, sessionId } = await req.json()
  
  // Get context
  const context = await memory.context({
    maxTokens: 2000,
    userId,
    sessionId
  })
  
  // Call your LLM
  const response = await callLLM(message, context.formatted)
  
  // Store (async, don't wait)
  memory.add(message, { userId, sessionId, type: 'episodic' }).catch(console.error)
  
  return NextResponse.json({ response })
}
```

### 3.2 AWS Lambda

```typescript
// lambda/chat.ts

import { clarityMemory } from '@clarity-chat/memory'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

// Use DynamoDB adapter (custom implementation)
const memory = clarityMemory({
  storage: {
    type: 'dynamodb',
    tableName: 'clarity-memory',
    region: 'us-east-1'
  },
  embeddingProvider: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY
  }
})

export const handler = async (event: any) => {
  const { message, userId } = JSON.parse(event.body)
  
  const context = await memory.context({ maxTokens: 2000, userId })
  const response = await callLLM(message, context.formatted)
  
  await memory.add(message, { userId, type: 'episodic' })
  
  return {
    statusCode: 200,
    body: JSON.stringify({ response })
  }
}
```

### 3.3 Cloudflare Workers

```typescript
// workers/chat.ts

import { clarityMemory } from '@clarity-chat/memory'

// Use Cloudflare Durable Objects or KV for storage
const memory = clarityMemory({
  storage: {
    type: 'custom',
    adapter: new CloudflareKVAdapter(env.MEMORY_KV)
  },
  embeddingProvider: {
    provider: 'local',  // Use Transformers.js for edge
    model: 'Xenova/all-MiniLM-L6-v2'
  }
})

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { message, userId } = await request.json()
    
    const context = await memory.context({ maxTokens: 2000, userId })
    const response = await callLLM(message, context.formatted)
    
    await memory.add(message, { userId, type: 'episodic' })
    
    return new Response(JSON.stringify({ response }))
  }
}
```

---

## 4. Browser Applications

### 4.1 React App

```typescript
// App.tsx

import { clarityMemory } from '@clarity-chat/memory'
import { useMemory } from '@clarity-chat/memory/react'
import { useState, useEffect } from 'react'

function ChatApp() {
  const { memory, add, recall, getContext } = useMemory({
    storage: { type: 'indexeddb' },  // Persists in browser
    embeddingProvider: {
      provider: 'local',  // No API key needed
      model: 'Xenova/all-MiniLM-L6-v2'
    }
  })
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  
  const handleSend = async () => {
    // Get context
    const context = await getContext({ maxTokens: 2000 })
    
    // Call your API or local LLM
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: input,
        context: context.formatted
      })
    }).then(r => r.json())
    
    // Store
    await add(input, { type: 'episodic', scope: 'session' })
    await add(response.text, { type: 'episodic', scope: 'session' })
    
    setMessages(prev => [...prev,
      { role: 'user', content: input },
      { role: 'assistant', content: response.text }
    ])
    
    setInput('')
  }
  
  return (
    <div>
      {/* Chat UI */}
      <MemoryInspector memory={memory} />
    </div>
  )
}
```

### 4.2 Vue 3 App

```typescript
// App.vue

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory({
  storage: { type: 'indexeddb' },
  embeddingProvider: { provider: 'local', model: 'Xenova/all-MiniLM-L6-v2' }
})

const messages = ref<Message[]>([])
const input = ref('')

onMounted(async () => {
  await memory.initialize()
})

const sendMessage = async () => {
  const context = await memory.context({ maxTokens: 2000 })
  
  const response = await callLLM(input.value, context.formatted)
  
  await memory.add(input.value, { type: 'episodic' })
  
  messages.value.push(
    { role: 'user', content: input.value },
    { role: 'assistant', content: response }
  )
  
  input.value = ''
}
</script>
```

### 4.3 Svelte App

```typescript
// App.svelte

<script lang="ts">
  import { onMount } from 'svelte'
  import { clarityMemory } from '@clarity-chat/memory'
  
  let memory = clarityMemory({
    storage: { type: 'indexeddb' },
    embeddingProvider: { provider: 'local' }
  })
  
  let messages: Message[] = []
  let input = ''
  
  onMount(async () => {
    await memory.initialize()
  })
  
  async function sendMessage() {
    const context = await memory.context({ maxTokens: 2000 })
    const response = await callLLM(input, context.formatted)
    
    await memory.add(input, { type: 'episodic' })
    
    messages = [...messages,
      { role: 'user', content: input },
      { role: 'assistant', content: response }
    ]
    
    input = ''
  }
</script>
```

### 4.4 Vanilla JavaScript

```html
<!-- index.html -->

<script type="module">
  import { clarityMemory } from 'https://cdn.jsdelivr.net/npm/@clarity-chat/memory@latest/dist/index.js'
  
  const memory = clarityMemory({
    storage: { type: 'indexeddb' },
    embeddingProvider: { provider: 'local' }
  })
  
  await memory.initialize()
  
  document.getElementById('send').addEventListener('click', async () => {
    const input = document.getElementById('input').value
    const context = await memory.context({ maxTokens: 2000 })
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: input, context: context.formatted })
    }).then(r => r.json())
    
    await memory.add(input, { type: 'episodic' })
    
    document.getElementById('messages').innerHTML += `
      <div>${input}</div>
      <div>${response.text}</div>
    `
  })
</script>
```

---

## 5. Node.js Scripts

### 5.1 CLI Tool

```typescript
// cli/chat.ts

#!/usr/bin/env node

import { clarityMemory } from '@clarity-chat/memory'
import { createInterface } from 'readline'

const memory = clarityMemory({
  storage: { type: 'sqlite', path: './memory.db' },
  embeddingProvider: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY
  }
})

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

async function chat() {
  await memory.initialize()
  
  console.log('Chat with memory! Type "exit" to quit.\n')
  
  rl.on('line', async (input) => {
    if (input === 'exit') {
      await memory.close()
      process.exit(0)
    }
    
    // Get context
    const context = await memory.context({ maxTokens: 2000 })
    
    // Call LLM (your implementation)
    const response = await callLLM(input, context.formatted)
    
    // Store
    await memory.add(input, { type: 'episodic' })
    
    console.log(`Assistant: ${response}\n`)
  })
}

chat()
```

### 5.2 Express.js Server

```typescript
// server.ts

import express from 'express'
import { clarityMemory } from '@clarity-chat/memory'

const app = express()
app.use(express.json())

const memory = clarityMemory({
  storage: { type: 'postgres', connectionString: process.env.DATABASE_URL },
  embeddingProvider: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY
  }
})

await memory.initialize()

app.post('/chat', async (req, res) => {
  const { userId, message } = req.body
  
  // Get context
  const context = await memory.context({
    maxTokens: 2000,
    userId
  })
  
  // Call LLM
  const response = await callLLM(message, context.formatted)
  
  // Store (async)
  memory.add(message, { userId, type: 'episodic' }).catch(console.error)
  
  res.json({ response })
})

app.get('/memory/search', async (req, res) => {
  const { query, userId } = req.query
  const results = await memory.recall(query as string, { userId })
  res.json({ results })
})

app.listen(3000)
```

---

## 6. Integration Patterns Summary

| Environment | Storage | Embedding | Example Use Case |
|------------|---------|-----------|-----------------|
| **React** | IndexedDB | Local/OpenAI | Browser chat app |
| **Node.js** | Postgres/Redis | OpenAI | Backend API |
| **Serverless** | Redis/In-Memory | OpenAI/Local | Vercel/Netlify functions |
| **Edge** | KV/Durable Objects | Local | Cloudflare Workers |
| **CLI** | SQLite | OpenAI | Command-line tool |
| **Mobile** | AsyncStorage | Local | React Native app |

---

## 7. Best Practices

### 7.1 Memory Initialization

```typescript
// Always initialize before use
await memory.initialize()

// Clean up when done (serverless)
await memory.close()
```

### 7.2 Error Handling

```typescript
try {
  const context = await memory.context({ maxTokens: 2000 })
} catch (error) {
  // Fallback to no context
  console.error('Memory error:', error)
}
```

### 7.3 Performance Optimization

```typescript
// Batch operations
await memory.batchAdd([
  { content: 'Memory 1' },
  { content: 'Memory 2' },
  { content: 'Memory 3' }
])

// Cache embeddings
const memory = clarityMemory({
  embeddingProvider: {
    provider: 'openai',
    cache: true,
    cacheTTL: 3600
  }
})
```

### 7.4 Memory Management

```typescript
// Set TTL for temporary memories
await memory.add('Temporary note', { ttl: 3600 })  // Expires in 1 hour

// Regular cleanup
setInterval(async () => {
  await memory.flush({ scope: 'session' })
}, 24 * 60 * 60 * 1000)  // Daily
```

---

## 8. Next Steps

Proceed to Phase 5: Documentation with complete README, tutorials, and migration guide.
