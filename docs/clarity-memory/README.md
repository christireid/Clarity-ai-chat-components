# Clarity Memory

> A superior, developer-friendly memory system for AI applications. Zero-config, standalone, and works everywhere.

[![npm version](https://badge.fury.io/js/%40clarity-chat%2Fmemory.svg)](https://badge.fury.io/js/%40clarity-chat%2Fmemory)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)

Clarity Memory is a powerful memory layer for AI applications that enables your apps to remember, learn, and adapt. It's designed to be **simpler**, **more powerful**, and **easier to use** than alternatives like MemMachine.

## ✨ Features

- 🚀 **Zero-Config**: Works out of the box with sensible defaults
- 📦 **Standalone**: No server required - works in scripts, serverless, and browsers
- 🔄 **Universal**: Works with React, Node.js, serverless functions, and any AI SDK
- 🎯 **Type-Safe**: Full TypeScript support with excellent type inference
- 🧠 **Smart**: Automatic token budgeting, adaptive compression, and importance scoring
- 💾 **Flexible Storage**: In-memory, file, IndexedDB, Redis, Postgres, or vector DBs
- 🔍 **Semantic Search**: Vector-based semantic search with multiple embedding providers
- 📊 **DevTools**: Built-in React inspector for debugging

## 🚀 Quick Start

### Installation

```bash
npm install @clarity-chat/memory
# or
yarn add @clarity-chat/memory
# or
pnpm add @clarity-chat/memory
```

### Basic Usage

```typescript
import { clarityMemory } from '@clarity-chat/memory'

// Zero-config - works immediately
const memory = clarityMemory()

// Add a memory
await memory.add("User prefers sarcastic humor.")

// Recall memories
const context = await memory.recall("Tell me your favorite jokes.")
console.log(context.memories)
```

### With Context

```typescript
// User-specific memory
const memory = clarityMemory({ context: "user123" })

await memory.add("I like pizza")
const results = await memory.recall("What do I like?")
```

### With Configuration

```typescript
const memory = clarityMemory({
  context: "user123",
  embedding: {
    provider: "openai",
    model: "text-embedding-3-small",
    apiKey: process.env.OPENAI_API_KEY,
  },
  store: {
    type: "file",
    path: "./memory.json",
  },
  tokenBudget: {
    maxTokens: 4000,
    reserveTokens: 500,
  },
})
```

## 📚 Documentation

- [Getting Started](./GETTING_STARTED.md) - Complete guide to using Clarity Memory
- [API Reference](./API_REFERENCE.md) - Full API documentation
- [Migration Guide](./MIGRATION_GUIDE.md) - Migrating from MemMachine
- [Architecture](./ARCHITECTURE.md) - System architecture and design decisions

## 🎯 Use Cases

### Chat Applications

```typescript
import { useMemory } from '@clarity-chat/memory/react'

function ChatApp() {
  const { memory, add, recall } = useMemory({ context: "user123" })
  
  const handleMessage = async (content: string) => {
    await add(content)
    const context = await recall(content)
    // Use context in your chat
  }
}
```

### Serverless Functions

```typescript
// Vercel API route
import { clarityMemory } from '@clarity-chat/memory'

export default async function handler(req, res) {
  const memory = clarityMemory({
    context: req.headers['x-user-id'],
    store: { type: 'file', path: `/tmp/memory.json` },
  })
  
  if (req.method === 'POST') {
    await memory.add(req.body.content)
  } else {
    const results = await memory.recall(req.query.q)
    res.json(results)
  }
}
```

### Node.js Scripts

```typescript
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory({ context: "script" })
await memory.add("Important information")
const results = await memory.recall("What's important?")
await memory.close()
```

## 🔄 Comparison with MemMachine

| Feature | MemMachine | Clarity Memory |
|---------|-----------|----------------|
| **Setup** | Server + Docker + Config | Zero-config |
| **Context IDs** | 4 IDs (group, agent, user, session) | 1 ID (context) |
| **Standalone** | ❌ Requires server | ✅ Works standalone |
| **TypeScript** | ❌ Python only | ✅ Full TypeScript |
| **Storage** | Neo4j only | Multiple adapters |
| **Token Budgeting** | ❌ Manual | ✅ Automatic |
| **React Support** | ❌ | ✅ Hooks + Components |
| **API Complexity** | High (7+ params) | Low (1-2 params) |

## 🏗️ Architecture

Clarity Memory consists of:

- **Core Memory Engine**: Manages memory lifecycle and operations
- **Storage Adapters**: Multiple storage backends (in-memory, file, IndexedDB, etc.)
- **Embedding Providers**: OpenAI, Anthropic, or local models
- **Scoring System**: Importance, recency, frequency, and relevance scoring
- **Context Engine**: Token-aware context bundling for LLMs
- **Compression Pipeline**: Adaptive memory compression strategies

## 📦 Storage Options

- **In-Memory**: Fast, ephemeral (default)
- **File**: Persistent JSON files
- **IndexedDB**: Browser-based persistence
- **Redis**: Fast, distributed storage
- **PostgreSQL**: Production-ready SQL storage
- **Vector DBs**: Chroma, Qdrant, Pinecone, LanceDB

## 🔌 Integrations

- ✅ **Vercel AI SDK**: Native adapter
- ✅ **LangChain**: Compatible adapter
- ✅ **OpenAI API**: Direct integration
- ✅ **Anthropic API**: Direct integration
- ✅ **React**: Hooks and components
- ✅ **Next.js**: App Router support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

Licensed under the [MIT License](../../LICENSE).

## 🙏 Acknowledgments

Clarity Memory is inspired by [MemMachine](https://github.com/MemMachine/MemMachine) but designed with a focus on developer experience, simplicity, and universal compatibility.

---

**Ready to get started?** Check out the [Getting Started Guide](./GETTING_STARTED.md) or browse the [API Reference](./API_REFERENCE.md).
