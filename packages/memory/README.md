# @clarity-chat/memory

> **Zero-config AI memory system** - Drop-in memory management for any LLM application

Framework-agnostic AI memory and context management. Works with **any JavaScript/TypeScript application** - React, Node.js, serverless, browser, or any AI SDK.

## ✨ Features

- 🚀 **Zero Config** - Works out of the box, no setup required
- 💾 **Multiple Storage** - In-memory, file, IndexedDB (Redis, Postgres coming soon)
- 🔍 **Semantic Search** - Vector similarity search with embeddings
- 💰 **Token Optimization** - Smart context bundling to reduce LLM costs
- 🎯 **Type Safe** - Full TypeScript support
- 📦 **Framework Agnostic** - Use anywhere JavaScript runs
- 🔌 **Drop-in Ready** - Works with OpenAI, Anthropic, Vercel AI SDK, LangChain

## 📦 Installation

```bash
npm install @clarity-chat/memory
# or
pnpm add @clarity-chat/memory
# or
yarn add @clarity-chat/memory
```

## 🚀 Quick Start

> 📖 **New to Clarity Memory?** Check the [Getting Started Guide](../../docs/getting-started.md) or browse the [Cookbook](../../docs/cookbook/) for copy-paste ready patterns.

### Zero-Config (In-Memory)

```typescript
import { clarityMemory } from '@clarity-chat/memory'

// Create memory instance - zero config!
const mem = clarityMemory()

// Add memories
await mem.add("User prefers TypeScript", {
  type: 'semantic',
  importance: 0.9
})

// Search memories
const results = await mem.search("user preferences")

// Get optimized context for LLM
const context = await mem.context({
  maxTokens: 1000,
  query: "user preferences"
})

console.log(context.text) // Ready to send to LLM
```

### With File Storage (Node.js)

```typescript
import { clarityMemory } from '@clarity-chat/memory'

const mem = clarityMemory({
  vectorStore: {
    type: 'file',
    path: './memories.json'
  }
})

await mem.add("User prefers dark mode")
// Automatically persisted to file
```

### With IndexedDB (Browser)

```typescript
import { clarityMemory } from '@clarity-chat/memory'

const mem = clarityMemory({
  vectorStore: {
    type: 'indexeddb',
    dbName: 'my-app-memory'
  }
})

await mem.add("User prefers mobile view")
// Persisted in browser IndexedDB
```

## 📖 Core API

### Adding Memories

```typescript
// Simple
const id = await mem.add("User loves React")

// With options
const id = await mem.add("User prefers TypeScript", {
  type: 'semantic',        // 'episodic' | 'semantic' | 'profile'
  importance: 0.9,         // 0-1, default 0.5
  tags: ['preferences'],    // Optional tags
  metadata: {              // Custom metadata
    userId: 'user-123',
    category: 'ui'
  }
})
```

### Searching Memories

```typescript
// Simple search
const results = await mem.search("user preferences")

// Advanced search
const results = await mem.search("TypeScript", {
  limit: 10,
  minScore: 0.7,
  types: ['semantic'],
  tags: ['preferences'],
  filters: {
    userId: 'user-123'
  }
})

// Results include score and memory
results.forEach(result => {
  console.log(result.score, result.memory.content)
})
```

### Getting Context for LLM

```typescript
// Get optimized context bundle
const bundle = await mem.context({
  maxTokens: 1000,
  query: "user preferences",
  types: ['semantic', 'profile'],
  prioritizeRecent: true
})

// Use in LLM call
const response = await openai.chat.completions.create({
  messages: [
    { role: 'system', content: bundle.text },
    { role: 'user', content: userMessage }
  ]
})
```

### Memory Management

```typescript
// Update memory
await mem.update(memoryId, {
  importance: 0.95,
  content: "Updated content"
})

// Promote memory (increase importance)
await mem.promote(memoryId)

// Forget memory
await mem.forget(memoryId)

// Get memory
const memory = await mem.get(memoryId)

// Batch operations
const ids = await mem.addBatch([
  { content: "Memory 1" },
  { content: "Memory 2", options: { type: 'semantic' } }
])
```

### Statistics & Inspection

```typescript
// Get statistics
const stats = await mem.getStats()
console.log(stats.total)        // Total memories
console.log(stats.byType)       // Counts by type
console.log(stats.totalTokens)  // Total tokens

// Inspect state
const state = await mem.inspect()
console.log(state.memories)     // All memories
console.log(state.config)       // Current config
```

## 🎯 Use Cases

### Chatbot with Memory

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import OpenAI from 'openai'

const mem = clarityMemory({ vectorStore: { type: 'file', path: './chat-memory.json' } })
const openai = new OpenAI()

async function chat(userId: string, message: string) {
  // Get relevant context
  const context = await mem.context({
    maxTokens: 1000,
    query: message,
    filters: { userId }
  })
  
  // Call LLM
  const response = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: `Context: ${context.text}` },
      { role: 'user', content: message }
    ]
  })
  
  // Store interaction
  await mem.add(message, {
    type: 'episodic',
    metadata: { userId }
  })
  
  return response.choices[0].message.content
}
```

### User Preferences

```typescript
// Store preferences
await mem.add("User prefers dark mode", {
  type: 'semantic',
  importance: 0.9,
  tags: ['preferences', 'ui']
})

// Retrieve preferences
const prefs = await mem.search("preferences", {
  types: ['semantic'],
  tags: ['preferences']
})
```

### Knowledge Base

```typescript
// Store knowledge
await mem.add("API endpoint: POST /api/users", {
  type: 'semantic',
  importance: 1.0,
  tags: ['api', 'docs']
})

// Query knowledge
const docs = await mem.search("how to create user", {
  types: ['semantic'],
  tags: ['api']
})
```

## 🔧 Configuration

```typescript
import { clarityMemory } from '@clarity-chat/memory'

const mem = clarityMemory({
  // Storage backend
  vectorStore: {
    type: 'file',           // 'in-memory' | 'file' | 'indexeddb'
    path: './memories.json' // For file store
  },
  
  // Embedding provider (optional - for semantic search)
  embeddingProvider: {
    embed: async (text) => {
      // Your embedding function
      return embeddingVector
    },
    model: 'text-embedding-ada-002',
    dimensions: 1536
  },
  
  // Token budget (optional)
  tokenBudget: {
    maxContextWindow: 4096,
    allocation: {
      systemPrompt: 400,
      userPreferences: 600,
      recentContext: 1200,
      semanticMemory: 1000,
      episodicMemory: 600,
      responseReserve: 200
    }
  },
  
  // Debug mode
  debug: true
})
```

## 📚 Examples

Run examples:

```bash
# Basic usage
npm run example:basic

# File storage
npm run example:file

# IndexedDB (browser)
npm run example:indexeddb
```

See [`examples/`](./examples/) directory for more.

## 🏗️ Architecture

### Memory Types

- **Episodic**: Short-term conversational memory (recent messages)
- **Semantic**: Long-term facts and knowledge (preferences, facts)
- **Profile**: User characteristics and traits

### Storage Backends

- **In-Memory**: Default, no persistence (great for testing)
- **File**: JSON file persistence (Node.js)
- **IndexedDB**: Browser-native storage (client-side apps)
- **Redis**: Coming soon
- **PostgreSQL**: Coming soon
- **Vector DBs**: Chroma, Qdrant, Pinecone (coming soon)

## 🔌 Integration Examples

### With Vercel AI SDK

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import { streamText } from 'ai'

const mem = clarityMemory()

export async function POST(req: Request) {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]
  
  // Get context
  const context = await mem.context({
    maxTokens: 1000,
    query: lastMessage.content
  })
  
  // Stream response
  const result = await streamText({
    model: openai('gpt-4'),
    messages: [
      { role: 'system', content: context.text },
      ...messages
    ]
  })
  
  return result.toDataStreamResponse()
}
```

### With LangChain

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import { ChatOpenAI } from '@langchain/openai'

const mem = clarityMemory()
const llm = new ChatOpenAI()

async function chat(message: string) {
  const context = await mem.context({ maxTokens: 1000, query: message })
  
  const response = await llm.invoke([
    ['system', context.text],
    ['human', message]
  ])
  
  await mem.add(message, { type: 'episodic' })
  return response.content
}
```

## 📖 Documentation

- [Getting Started Guide](../../docs/getting-started.md)
- [Cookbook](../../docs/cookbook/) - Copy-paste ready patterns
- [Troubleshooting](../../docs/TROUBLESHOOTING.md) - Common issues and solutions
- [API Reference](./API.md) - Complete API documentation
- [Storage Backends](./docs/storage.md) - Storage configuration
- [Memory Types](./docs/memory-types.md) - Understanding memory types
- [Token Optimization](./docs/token-optimization.md) - Cost optimization strategies

## 🧪 Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Type check
pnpm typecheck

# Test
pnpm test

# Run examples
pnpm example:basic
```

## 📄 License

MIT

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## 🔗 Links

- [GitHub](https://github.com/christireid/Clarity-ai-chat-components)
- [Documentation](../../apps/docs/)
- [Examples](../../examples/)
