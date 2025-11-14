# @clarity-chat/memory

> **Framework-agnostic AI memory and context management** — Dead-simple, zero-config, drop-in memory system for any LLM application.

[![npm version](https://img.shields.io/npm/v/@clarity-chat/memory)](https://www.npmjs.com/package/@clarity-chat/memory)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🚀 **Zero-config** — Works out of the box with sensible defaults
- 🔌 **Framework-agnostic** — Use with React, Vue, Node.js, Serverless, or any JS/TS app
- 🎯 **Drop-in simple** — Copy/paste a few lines → done
- 🧠 **Smart context bundling** — Automatic token management and compression
- 🔍 **Semantic search** — Find relevant memories by meaning, not just keywords
- 📦 **Multiple storage backends** — In-memory, IndexedDB, Redis, PostgreSQL, Vector DBs
- 💪 **TypeScript-first** — Full type safety and IntelliSense support
- 🎨 **Better DX** — Cleaner API than alternatives, better documented

## Quick Start

```bash
npm install @clarity-chat/memory
# or
pnpm add @clarity-chat/memory
# or
yarn add @clarity-chat/memory
```

### Basic Usage

```typescript
import { clarityMemory } from '@clarity-chat/memory'

// Create a memory instance (zero-config)
const memory = clarityMemory()

// Add memories
await memory.add("User prefers TypeScript over JavaScript")
await memory.add("User likes dark mode UI", {
  type: 'semantic',
  importance: 0.8,
})

// Search for memories
const results = await memory.search("What does user prefer?")
console.log(results) // Array of MemoryItem

// Recall with context bundling
const context = await memory.recall("Tell me about user preferences", {
  maxTokens: 500,
  includeSummary: true,
})

// Use context in your LLM call
const response = await openai.chat.completions.create({
  messages: [
    { role: 'system', content: context.toPrompt() },
    { role: 'user', content: 'What do I prefer?' }
  ]
})
```

## Core Concepts

### Memory Types

- **`episodic`** — Conversation events, messages, interactions (default)
- **`semantic`** — Facts, preferences, knowledge
- **`ephemeral`** — Temporary, short-lived data
- **`persistent`** — Long-term, cross-session data

### Importance Scoring

Each memory has an importance score (0-1). Higher scores indicate more important memories that should be prioritized during retrieval and compression.

### Context Bundles

A `ContextBundle` is a prepared set of memories ready for LLM consumption. It includes:
- Relevant memories (filtered and ranked)
- Optional summary
- Token count
- Metadata about the context

## API Reference

### `clarityMemory(config?)`

Creates a new Clarity Memory instance.

```typescript
const memory = clarityMemory({
  maxTokens: 8000,
  enableCompression: true,
  sessionId: 'session-123',
  userId: 'user-456',
})
```

### `memory.add(content, options?)`

Add a memory.

```typescript
await memory.add("User prefers TypeScript", {
  type: 'semantic',
  importance: 0.8,
  tags: ['preferences', 'coding'],
  metadata: { source: 'conversation' },
})
```

### `memory.search(query, options?)`

Search for memories by text query.

```typescript
const results = await memory.search("user preferences", {
  types: ['semantic'],
  minImportance: 0.5,
  limit: 10,
})
```

### `memory.recall(query, options?)`

Recall memories with automatic context bundling, ranking, and token management.

```typescript
const context = await memory.recall("What does user prefer?", {
  maxTokens: 1000,
  includeSummary: true,
  prioritizeRecent: true,
})
```

### `memory.context(options?)`

Get a context bundle without a query (useful for getting recent or all memories).

```typescript
const context = await memory.context({
  maxTokens: 2000,
  types: ['semantic', 'persistent'],
  since: new Date('2024-01-01'),
})
```

### `memory.compress(options?)`

Compress memories to fit within token budget.

```typescript
const result = await memory.compress({
  targetTokens: 1000,
  preserveImportant: true,
  minImportance: 0.7,
})
```

### `memory.summarize(options?)`

Generate a summary of memories.

```typescript
const summary = await memory.summarize({
  types: ['episodic'],
  since: new Date('2024-01-01'),
})
```

### `memory.stats()`

Get memory statistics.

```typescript
const stats = await memory.stats()
console.log(stats.total) // Total number of memories
console.log(stats.byType) // Distribution by type
console.log(stats.totalTokens) // Total token count
```

## Configuration

### Basic Config

```typescript
const memory = clarityMemory({
  maxTokens: 8000,              // Max tokens for context window
  enableCompression: true,       // Enable automatic compression
  enableSummarization: false,    // Enable automatic summarization
  sessionId: 'session-123',      // Session ID for isolation
  userId: 'user-456',            // User ID for multi-user support
})
```

### Advanced Config

```typescript
const memory = clarityMemory({
  // Token budget allocation
  tokenBudget: {
    systemPrompt: 0.10,    // 10% for system prompt
    memories: 0.60,        // 60% for memories
    recentContext: 0.25,    // 25% for recent context
    responseReserve: 0.05, // 5% reserved for response
  },
  
  // Importance scoring
  importanceScoring: {
    type: 'time-weighted',
    recencyWeight: 0.3,
    importanceWeight: 0.7,
  },
  
  // Storage backend
  store: 'indexeddb', // or 'memory', 'redis', 'postgres', etc.
  
  // Embedding provider (for semantic search)
  embeddingProvider: {
    embed: async (text) => {
      // Your embedding implementation
      return await generateEmbedding(text)
    }
  },
})
```

## Storage Backends

### In-Memory (Default)

```typescript
const memory = clarityMemory({
  store: 'memory', // Default, no persistence
})
```

### IndexedDB (Browser)

```typescript
const memory = clarityMemory({
  store: 'indexeddb', // Persistent browser storage
})
```

### Redis

```typescript
const memory = clarityMemory({
  store: {
    type: 'redis',
    url: 'redis://localhost:6379',
  },
})
```

### PostgreSQL

```typescript
const memory = clarityMemory({
  store: {
    type: 'postgres',
    connectionString: 'postgresql://...',
  },
})
```

### Vector Databases

```typescript
const memory = clarityMemory({
  store: {
    type: 'vector',
    provider: 'pinecone', // or 'qdrant', 'weaviate', 'chroma', 'lancedb'
    apiKey: 'your-api-key',
    index: 'your-index',
  },
})
```

## Integration Examples

### With OpenAI

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import OpenAI from 'openai'

const memory = clarityMemory()
const openai = new OpenAI()

async function chat(userMessage: string) {
  // Add user message to memory
  await memory.add(userMessage, { type: 'episodic' })
  
  // Get relevant context
  const context = await memory.recall(userMessage, {
    maxTokens: 2000,
    includeSummary: true,
  })
  
  // Call OpenAI with context
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: context.toPrompt() },
      { role: 'user', content: userMessage }
    ],
  })
  
  // Add assistant response to memory
  await memory.add(response.choices[0].message.content!, {
    type: 'episodic',
  })
  
  return response
}
```

### With Vercel AI SDK

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

const memory = clarityMemory()

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  // Get context from memory
  const context = await memory.recall(messages[messages.length - 1].content, {
    maxTokens: 2000,
  })
  
  // Stream response with context
  const result = streamText({
    model: openai('gpt-4'),
    messages: [
      { role: 'system', content: context.toPrompt() },
      ...messages,
    ],
  })
  
  return result.toDataStreamResponse()
}
```

### With React

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import { useEffect, useState } from 'react'

function useMemory(userId: string) {
  const [memory] = useState(() => clarityMemory({ userId }))
  
  return memory
}

function ChatComponent() {
  const memory = useMemory('user-123')
  const [context, setContext] = useState(null)
  
  useEffect(() => {
    async function loadContext() {
      const ctx = await memory.context({ maxTokens: 1000 })
      setContext(ctx)
    }
    loadContext()
  }, [memory])
  
  // Use context in your component
  return <div>{context?.toPrompt()}</div>
}
```

### Serverless Function (Vercel/Netlify)

```typescript
import { clarityMemory } from '@clarity-chat/memory'

// Use IndexedDB-compatible store or Redis for persistence
const memory = clarityMemory({
  store: 'indexeddb', // or Redis in production
  userId: 'user-123',
})

export default async function handler(req, res) {
  const { message } = req.body
  
  await memory.add(message)
  const context = await memory.recall(message)
  
  // Use context with your LLM
  return res.json({ context })
}
```

## Context Bundle Formats

Context bundles can be converted to different formats:

```typescript
const context = await memory.recall("query")

// String format
const string = context.toString()

// Message format (for chat APIs)
const messages = context.toMessages()
// [{ role: 'system', content: '...' }]

// Prompt format (for completion APIs)
const prompt = context.toPrompt()
// "<Summary>...</Summary>\n\n<Context>...</Context>"
```

## Advanced Features

### Token Management

Clarity Memory automatically manages tokens:

```typescript
const context = await memory.recall("query", {
  maxTokens: 1000, // Will automatically truncate/compress if needed
})
```

### Compression

```typescript
// Manual compression
const result = await memory.compress({
  targetTokens: 500,
  preserveImportant: true,
  minImportance: 0.7,
})

console.log(`Compressed ${result.before.count} to ${result.after.count} memories`)
console.log(`Token reduction: ${result.before.tokens} → ${result.after.tokens}`)
```

### Batch Operations

```typescript
// Batch add
await memory.addBatch([
  "Memory 1",
  "Memory 2",
  "Memory 3",
], { type: 'semantic' })

// Batch search
const results = await memory.searchBatch([
  "Query 1",
  "Query 2",
])
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  MemoryItem,
  MemoryConfig,
  ContextBundle,
  SearchOptions,
  RecallOptions,
} from '@clarity-chat/memory'
```

## Migration from MemMachine

See [MIGRATION.md](./MIGRATION.md) for a detailed migration guide.

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Memory Fundamentals](./docs/memory-fundamentals.md)
- [Embeddings Guide](./docs/embeddings.md)
- [Context Bundling](./docs/context-bundling.md)
- [Scaling Memory](./docs/scaling.md)

## Contributing

Contributions welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

## License

MIT © [Clarity Chat](https://github.com/christireid/Clarity-ai-chat-components)
