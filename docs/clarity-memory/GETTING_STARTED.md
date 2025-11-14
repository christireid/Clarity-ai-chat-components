# Getting Started with Clarity Memory

Welcome to Clarity Memory! This guide will help you get started in minutes.

## Installation

```bash
npm install @clarity-chat/memory
# or
yarn add @clarity-chat/memory
# or
pnpm add @clarity-chat/memory
```

## Quick Start (30 seconds)

```typescript
import { clarityMemory } from '@clarity-chat/memory'

// Create a memory instance (zero config!)
const memory = clarityMemory()

// Add a memory
await memory.add("User likes pizza")

// Recall memories
const results = await memory.recall("What does the user like?")
console.log(results.memories) // [{ content: "User likes pizza", ... }]
```

That's it! You're using Clarity Memory. 🎉

## Basic Concepts

### Memory Instance

A memory instance stores and retrieves memories for a specific context (user, session, etc.).

```typescript
// Default context
const memory = clarityMemory()

// User-specific context
const memory = clarityMemory({ context: "user123" })

// Session-specific context
const memory = clarityMemory({ context: "user123:session456" })
```

### Adding Memories

```typescript
// Simple add
await memory.add("User prefers dark mode")

// With metadata
await memory.add("User prefers dark mode", {
  type: "preference",
  category: "ui",
  importance: "high",
})
```

### Recalling Memories

```typescript
// Simple recall
const results = await memory.recall("What are user preferences?")

// With options
const results = await memory.recall("What are user preferences?", {
  limit: 10,
  minScore: 0.7,
  includeSummary: true,
})

// results.memories - array of relevant memories
// results.tokens - token count
// results.summary - summary of older memories (if requested)
```

## Common Use Cases

### 1. Chat Application

```typescript
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory({ context: "user123" })

// When user sends a message
async function handleUserMessage(content: string) {
  // Add user message to memory
  await memory.add(content, { role: "user" })
  
  // Get relevant context for AI
  const context = await memory.recall(content)
  
  // Use context in your AI call
  const aiResponse = await callAI(content, context.memories)
  
  // Add AI response to memory
  await memory.add(aiResponse, { role: "assistant" })
  
  return aiResponse
}
```

### 2. React Application

```typescript
import { useMemory } from '@clarity-chat/memory/react'

function ChatComponent() {
  const { memory, add, recall } = useMemory({ context: "user123" })
  
  const handleSend = async (message: string) => {
    await add(message)
    const context = await recall(message)
    // Use context...
  }
  
  return (
    // Your chat UI
  )
}
```

### 3. Serverless Function

```typescript
// api/memory.ts (Vercel)
import { clarityMemory } from '@clarity-chat/memory'

export default async function handler(req, res) {
  const userId = req.headers['x-user-id']
  const memory = clarityMemory({
    context: userId,
    store: {
      type: 'file',
      path: `/tmp/memory-${userId}.json`,
    },
  })
  
  if (req.method === 'POST') {
    await memory.add(req.body.content)
    res.json({ success: true })
  } else {
    const results = await memory.recall(req.query.q)
    res.json(results)
  }
  
  await memory.close()
}
```

### 4. Node.js Script

```typescript
import { clarityMemory } from '@clarity-chat/memory'

async function main() {
  const memory = clarityMemory({ context: "script" })
  
  // Add memories
  await memory.add("Important information 1")
  await memory.add("Important information 2")
  
  // Recall
  const results = await memory.recall("What's important?")
  console.log(results.memories)
  
  // Cleanup
  await memory.close()
}

main()
```

## Configuration

### Basic Configuration

```typescript
const memory = clarityMemory({
  context: "user123",
  
  // Embedding provider
  embedding: {
    provider: "openai",
    model: "text-embedding-3-small",
    apiKey: process.env.OPENAI_API_KEY,
  },
  
  // Storage
  store: {
    type: "file",
    path: "./memory.json",
  },
})
```

### Advanced Configuration

```typescript
const memory = clarityMemory({
  context: "user123",
  
  // Embedding
  embedding: {
    provider: "openai",
    model: "text-embedding-3-small",
    apiKey: process.env.OPENAI_API_KEY,
    cache: true,
  },
  
  // Storage
  store: {
    type: "postgres",
    connectionString: process.env.DATABASE_URL,
  },
  
  // Short-term memory
  shortTerm: {
    maxMessages: 50,
    maxTokens: 32000,
    autoSummarize: true,
  },
  
  // Long-term memory
  longTerm: {
    enabled: true,
    store: {
      type: "file",
      path: "./longterm.json",
    },
  },
  
  // Token budgeting
  tokenBudget: {
    maxTokens: 4000,
    reserveTokens: 500,
    strategy: "priority",
  },
  
  // Scoring
  scoring: {
    recencyWeight: 0.4,
    frequencyWeight: 0.3,
    relevanceWeight: 0.3,
  },
})
```

## Storage Options

### In-Memory (Default)

```typescript
const memory = clarityMemory({
  store: { type: "in-memory" },
})
// Fast, ephemeral - good for testing
```

### File Storage

```typescript
const memory = clarityMemory({
  store: {
    type: "file",
    path: "./memory.json",
  },
})
// Persistent JSON file - good for scripts
```

### IndexedDB (Browser)

```typescript
const memory = clarityMemory({
  store: { type: "indexeddb" },
})
// Browser persistence - good for web apps
```

### PostgreSQL

```typescript
const memory = clarityMemory({
  store: {
    type: "postgres",
    connectionString: process.env.DATABASE_URL,
  },
})
// Production database - good for scale
```

### Redis

```typescript
const memory = clarityMemory({
  store: {
    type: "redis",
    url: process.env.REDIS_URL,
  },
})
// Fast, distributed - good for caching
```

## Advanced Features

### Context Bundling for LLMs

```typescript
// Get optimized context for your LLM
const bundle = await memory.context({
  query: "Tell me about the user",
  maxTokens: 4000,
  format: "openai", // or "anthropic"
  includeSummary: true,
})

// bundle.messages - formatted for LLM API
// bundle.tokens - actual token count
// bundle.summary - summary of older memories
```

### Memory Compression

```typescript
// Compress memory to reduce size
const result = await memory.compress({
  strategy: "adaptive", // or "summarize", "deduplicate", "prune"
  targetSize: "50%", // Reduce to 50% of current size
})

console.log(`Compressed from ${result.before} to ${result.after} memories`)
```

### Automatic Extraction

```typescript
// Extract memories from chat messages
await memory.extractFromMessages([
  { role: "user", content: "I like pizza and pasta" },
  { role: "assistant", content: "Got it!" },
], {
  extractPreferences: true,
  extractFacts: true,
})
```

### Memory Topics

```typescript
// Get memory topics (semantic groups)
const topics = await memory.topics()
// [{ topic: "food preferences", memories: [...], score: 0.9 }, ...]

// Get memories for a specific topic
const foodMemories = await memory.getTopic("food preferences")
```

## React Integration

### Using the Hook

```typescript
import { useMemory } from '@clarity-chat/memory/react'

function MyComponent() {
  const { memory, add, recall, stats } = useMemory({
    context: "user123",
  })
  
  // Use memory operations
  const handleAdd = async (content: string) => {
    await add(content)
  }
  
  const handleRecall = async (query: string) => {
    const results = await recall(query)
    return results.memories
  }
  
  return (
    <div>
      <p>Total memories: {stats.totalMemories}</p>
      {/* Your UI */}
    </div>
  )
}
```

### Using the Provider

```typescript
import { MemoryProvider } from '@clarity-chat/memory/react'

function App() {
  return (
    <MemoryProvider config={{ context: "user123" }}>
      <YourApp />
    </MemoryProvider>
  )
}
```

### DevTools Inspector

```typescript
import { MemoryInspector } from '@clarity-chat/memory/react'

function App() {
  const { memory } = useMemory()
  
  return (
    <div>
      <YourApp />
      <MemoryInspector memory={memory} />
    </div>
  )
}
```

## Next Steps

- Read the [API Reference](./API_REFERENCE.md) for complete API documentation
- Check out [Examples](./examples/) for more code samples
- See the [Migration Guide](./MIGRATION_GUIDE.md) if coming from MemMachine
- Explore [Architecture](./ARCHITECTURE.md) for system design details

## Need Help?

- Check the [FAQ](./FAQ.md)
- Browse [Examples](./examples/)
- Open an issue on GitHub

Happy coding! 🚀
