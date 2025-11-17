# Phase 4: Integration Patterns

## Executive Summary

This document defines how Clarity Memory integrates with various frameworks, AI SDKs, and use cases. It provides copy-paste-ready examples for common scenarios.

---

## 1. Clarity Chat Integration

### 1.1 useClarityChat Hook Integration

```typescript
// packages/react/src/hooks/use-clarity-chat.ts

import { useClarityChat } from '@clarity-chat/react'
import { clarityMemory } from '@clarity-chat/memory'

export function useClarityChatWithMemory(config: ChatConfig) {
  const chat = useClarityChat(config)
  const memory = clarityMemory({
    context: {
      userId: config.userId,
      sessionId: chat.sessionId,
    },
  })

  // Auto-extract memories from messages
  useEffect(() => {
    const unsubscribe = chat.onMessage((message) => {
      if (message.role === 'user') {
        // Extract important information
        memory.extractFromTool({
          tool: 'chat-message',
          result: message.content,
          metadata: { role: message.role, timestamp: message.timestamp },
        }).forEach((mem) => {
          memory.add(mem.content, mem.options)
        })
      }
    })

    return unsubscribe
  }, [chat, memory])

  // Enhanced send function with memory context
  const sendWithMemory = async (message: string) => {
    // Get relevant context
    const context = await memory.context({
      maxTokens: 1000,
      query: message,
    })

    // Send with context
    await chat.send(message, {
      systemMessage: `Relevant context:\n${context.memories.map(m => m.content).join('\n')}`,
    })
  }

  return {
    ...chat,
    send: sendWithMemory,
    memory,
  }
}
```

### 1.2 ClarityChat Component Integration

```typescript
// packages/react/src/components/clarity-chat.tsx

import { ClarityChat } from '@clarity-chat/react'
import { clarityMemory } from '@clarity-chat/memory'
import { MemoryProvider } from '@clarity-chat/memory/react'

export function ClarityChatWithMemory(props: ClarityChatProps) {
  const memory = clarityMemory({
    context: {
      userId: props.userId,
      sessionId: props.sessionId,
    },
  })

  return (
    <MemoryProvider memory={memory}>
      <ClarityChat
        {...props}
        onMessage={async (message) => {
          // Store message in memory
          await memory.add(message.content, {
            type: message.role === 'user' ? 'episodic' : 'episodic',
            metadata: { role: message.role },
          })

          // Call original handler
          props.onMessage?.(message)
        }}
        getContext={async (query) => {
          // Get relevant memories for context
          const context = await memory.context({
            maxTokens: 1000,
            query,
          })
          return context.memories.map(m => m.content).join('\n')
        }}
      />
    </MemoryProvider>
  )
}
```

---

## 2. Standalone Usage with Any LLM

### 2.1 OpenAI SDK

```typescript
import { OpenAI } from 'openai'
import { clarityMemory } from '@clarity-chat/memory'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const memory = clarityMemory({
  embeddingProvider: {
    type: 'openai',
    model: 'text-embedding-3-small',
  },
})

async function chat(userId: string, message: string) {
  // Get relevant context
  const context = await memory.context({
    maxTokens: 1000,
    query: message,
  })

  // Call OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Relevant context:\n${context.memories.map(m => m.content).join('\n')}`,
      },
      { role: 'user', content: message },
    ],
  })

  const reply = response.choices[0].message.content

  // Store interaction
  await memory.add(message, {
    type: 'episodic',
    metadata: { userId, role: 'user' },
  })
  await memory.add(reply, {
    type: 'episodic',
    metadata: { userId, role: 'assistant' },
  })

  return reply
}
```

### 2.2 Anthropic SDK

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { clarityMemory } from '@clarity-chat/memory'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const memory = clarityMemory()

async function chat(userId: string, message: string) {
  const context = await memory.context({ maxTokens: 1000, query: message })

  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    system: `Relevant context:\n${context.memories.map(m => m.content).join('\n')}`,
    messages: [{ role: 'user', content: message }],
  })

  const reply = response.content[0].text

  await memory.add(message, { type: 'episodic', metadata: { userId } })
  await memory.add(reply, { type: 'episodic', metadata: { userId } })

  return reply
}
```

### 2.3 Vercel AI SDK

```typescript
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory({
  embeddingProvider: openai('text-embedding-3-small'),
})

async function chat(userId: string, message: string) {
  const context = await memory.context({ maxTokens: 1000, query: message })

  const { text } = await generateText({
    model: openai('gpt-4'),
    system: `Relevant context:\n${context.memories.map(m => m.content).join('\n')}`,
    prompt: message,
  })

  await memory.add(message, { type: 'episodic', metadata: { userId } })
  await memory.add(text, { type: 'episodic', metadata: { userId } })

  return text
}
```

---

## 3. Serverless Functions

### 3.1 Vercel Serverless Function

```typescript
// api/chat.ts

import { clarityMemory } from '@clarity-chat/memory'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

// Initialize memory with file-based storage (persists across invocations)
const memory = clarityMemory({
  vectorStore: {
    type: 'file',
    path: '/tmp/memories.json', // Vercel allows /tmp
  },
  embeddingProvider: openai('text-embedding-3-small'),
})

export default async function handler(req: Request) {
  const { userId, message } = await req.json()

  // Get context
  const context = await memory.context({
    maxTokens: 1000,
    query: message,
  })

  // Generate response
  const { text } = await generateText({
    model: openai('gpt-4'),
    system: `Context: ${context.memories.map(m => m.content).join('\n')}`,
    prompt: message,
  })

  // Store
  await memory.add(message, { type: 'episodic', metadata: { userId } })
  await memory.add(text, { type: 'episodic', metadata: { userId } })

  return Response.json({ reply: text })
}
```

### 3.2 AWS Lambda

```typescript
// lambda/chat.ts

import { clarityMemory } from '@clarity-chat/memory'
import { DynamoDB } from '@aws-sdk/client-dynamodb'

// Use DynamoDB for persistence
const memory = clarityMemory({
  vectorStore: {
    type: 'dynamodb',
    tableName: 'memories',
    region: 'us-east-1',
  },
})

export const handler = async (event: any) => {
  const { userId, message } = JSON.parse(event.body)

  const context = await memory.context({ maxTokens: 1000, query: message })
  // ... generate response ...
  await memory.add(message, { type: 'episodic', metadata: { userId } })

  return {
    statusCode: 200,
    body: JSON.stringify({ reply: '...' }),
  }
}
```

### 3.3 Cloudflare Workers

```typescript
// worker.ts

import { clarityMemory } from '@clarity-chat/memory'

// Use Cloudflare KV or Durable Objects for storage
const memory = clarityMemory({
  vectorStore: {
    type: 'cloudflare-kv',
    namespace: MEMORIES_KV,
  },
})

export default {
  async fetch(request: Request): Promise<Response> {
    const { userId, message } = await request.json()

    const context = await memory.context({ maxTokens: 1000, query: message })
    // ... generate response ...

    return Response.json({ reply: '...' })
  },
}
```

---

## 4. Browser Applications

### 4.1 React Application

```typescript
// App.tsx

import { useState, useEffect } from 'react'
import { clarityMemory } from '@clarity-chat/memory'
import { MemoryProvider, useMemory } from '@clarity-chat/memory/react'

const memory = clarityMemory({
  vectorStore: {
    type: 'indexeddb',
    dbName: 'chat-memories',
  },
})

function ChatApp() {
  return (
    <MemoryProvider memory={memory}>
      <ChatInterface />
    </MemoryProvider>
  )
}

function ChatInterface() {
  const { add, search, context } = useMemory()
  const [messages, setMessages] = useState([])

  const handleSend = async (text: string) => {
    // Get context
    const ctx = await context({ maxTokens: 1000, query: text })

    // Call LLM (your API)
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: text,
        context: ctx.memories.map(m => m.content),
      }),
    }).then(r => r.json())

    // Store
    await add(text, { type: 'episodic' })
    await add(response.reply, { type: 'episodic' })

    setMessages(prev => [...prev, { role: 'user', content: text }, response])
  }

  return <div>{/* Your UI */}</div>
}
```

### 4.2 Vue 3 Application

```typescript
// App.vue

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory({
  vectorStore: { type: 'indexeddb', dbName: 'memories' },
})

const messages = ref([])

const sendMessage = async (text: string) => {
  const context = await memory.context({ maxTokens: 1000, query: text })
  // ... call LLM ...
  await memory.add(text, { type: 'episodic' })
  messages.value.push({ role: 'user', content: text })
}
</script>
```

### 4.3 Svelte Application

```typescript
// App.svelte

<script lang="ts">
  import { clarityMemory } from '@clarity-chat/memory'
  import { onMount } from 'svelte'

  const memory = clarityMemory({
    vectorStore: { type: 'indexeddb', dbName: 'memories' },
  })

  let messages = []

  async function sendMessage(text: string) {
    const context = await memory.context({ maxTokens: 1000, query: text })
    // ... call LLM ...
    await memory.add(text, { type: 'episodic' })
    messages = [...messages, { role: 'user', content: text }]
  }
</script>
```

### 4.4 Vanilla JavaScript

```javascript
// app.js

import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory({
  vectorStore: { type: 'indexeddb', dbName: 'memories' },
})

document.getElementById('send').addEventListener('click', async () => {
  const input = document.getElementById('input').value
  const context = await memory.context({ maxTokens: 1000, query: input })
  
  // Call LLM
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message: input, context }),
  }).then(r => r.json())
  
  await memory.add(input, { type: 'episodic' })
  // Display response
})
```

---

## 5. Node.js Applications

### 5.1 Express Server

```typescript
// server.ts

import express from 'express'
import { clarityMemory } from '@clarity-chat/memory'

const app = express()
const memory = clarityMemory({
  vectorStore: {
    type: 'postgres',
    connectionString: process.env.DATABASE_URL,
  },
})

app.post('/chat', async (req, res) => {
  const { userId, message } = req.body

  // Get context
  const context = await memory.context({
    maxTokens: 1000,
    query: message,
  })

  // Call LLM
  const reply = await callLLM(message, context)

  // Store
  await memory.add(message, {
    type: 'episodic',
    metadata: { userId },
  })
  await memory.add(reply, {
    type: 'episodic',
    metadata: { userId },
  })

  res.json({ reply })
})
```

### 5.2 Next.js API Route

```typescript
// app/api/chat/route.ts

import { clarityMemory } from '@clarity-chat/memory'
import { NextRequest, NextResponse } from 'next/server'

const memory = clarityMemory({
  vectorStore: { type: 'file', path: './data/memories.json' },
})

export async function POST(req: NextRequest) {
  const { userId, message } = await req.json()

  const context = await memory.context({ maxTokens: 1000, query: message })
  const reply = await generateResponse(message, context)

  await memory.add(message, { type: 'episodic', metadata: { userId } })
  await memory.add(reply, { type: 'episodic', metadata: { userId } })

  return NextResponse.json({ reply })
}
```

---

## 6. LangChain Integration

```typescript
// langchain-integration.ts

import { clarityMemory } from '@clarity-chat/memory'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HumanMessage, SystemMessage } from 'langchain/schema'

const memory = clarityMemory()
const model = new ChatOpenAI({ modelName: 'gpt-4' })

async function chat(message: string) {
  // Get context from Clarity Memory
  const context = await memory.context({
    maxTokens: 1000,
    query: message,
  })

  // Use with LangChain
  const response = await model.invoke([
    new SystemMessage(`Context: ${context.memories.map(m => m.content).join('\n')}`),
    new HumanMessage(message),
  ])

  // Store in Clarity Memory
  await memory.add(message, { type: 'episodic' })
  await memory.add(response.content, { type: 'episodic' })

  return response.content
}
```

---

## 7. Integration Checklist

### For React Apps
- [ ] Install `@clarity-chat/memory` and `@clarity-chat/memory/react`
- [ ] Wrap app with `MemoryProvider`
- [ ] Use `useMemory()` hook
- [ ] Configure storage (IndexedDB for browser)
- [ ] Add memory extraction from messages
- [ ] Integrate context into LLM calls

### For Node.js Apps
- [ ] Install `@clarity-chat/memory`
- [ ] Choose storage backend (file, Redis, PostgreSQL)
- [ ] Initialize memory instance
- [ ] Add context retrieval before LLM calls
- [ ] Store interactions after LLM calls
- [ ] Set up periodic compression

### For Serverless
- [ ] Choose storage (file for /tmp, or external DB)
- [ ] Initialize memory per invocation
- [ ] Use context in handler
- [ ] Store interactions
- [ ] Consider cold start optimization

### For Standalone Scripts
- [ ] Use in-memory or file storage
- [ ] Simple add/search operations
- [ ] No framework dependencies

---

## Next Steps

Proceed to **Phase 5: Documentation** for complete documentation, tutorials, and migration guides.
