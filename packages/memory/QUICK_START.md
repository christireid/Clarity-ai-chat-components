# Clarity Memory - Quick Start Guide

## Zero-Config Setup (Recommended)

The easiest way to get started - Clarity Memory auto-detects your environment and configures itself:

```typescript
import { clarityMemory } from '@clarity-chat/memory'

// That's it! Works everywhere
const memory = clarityMemory()
await memory.initialize()

// Start using immediately
await memory.add('User prefers dark mode')
const results = await memory.recall('preferences')
```

## Environment-Specific Helpers

For explicit environment setup:

```typescript
import { clarityMemoryHelpers } from '@clarity-chat/memory'

// Browser (uses IndexedDB automatically)
const memory = clarityMemoryHelpers.browser()

// Serverless (uses in-memory)
const memory = clarityMemoryHelpers.serverless()

// Node.js (uses in-memory)
const memory = clarityMemoryHelpers.node()
```

## Common Configurations

### Basic Setup with Embeddings

```typescript
const memory = clarityMemory({
  embeddingProvider: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY, // or your API key
  },
})
```

### Full-Featured Setup

```typescript
const memory = clarityMemory({
  // Storage
  storage: { type: 'indexeddb' }, // or 'in-memory', 'redis', 'postgres'
  
  // Embeddings
  embeddingProvider: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'text-embedding-3-small',
  },
  
  // Token Budgeting
  tokenBudget: {
    maxTokens: 4096,
    allocation: {
      systemPrompt: 0.10,
      userPreferences: 0.15,
      recentContext: 0.30,
      semanticMemory: 0.25,
      episodicMemory: 0.15,
      responseReserve: 0.05,
    },
    dynamicAllocation: true,
  },
  
  // Compression
  compression: {
    enabled: true,
    strategy: 'adaptive',
    threshold: 0.8,
  },
  
  // Debug mode
  debug: true,
})
```

## React Setup

```typescript
import { useMemory } from '@clarity-chat/memory/react'

function ChatComponent() {
  const { add, recall, context, initialized } = useMemory({
    userId: 'user123',
    // Auto-detects browser and uses IndexedDB
  })
  
  // Use memory operations...
}
```

## Validation & Health Checks

### Configuration Validation

Clarity Memory validates your configuration and provides helpful errors:

```typescript
const memory = clarityMemory({
  storage: { type: 'indexeddb' }, // ❌ Error if not in browser
  embeddingProvider: {
    provider: 'openai',
    // ❌ Error if apiKey missing
  },
})
```

### Health Check

```typescript
const health = await memory.healthCheck()
console.log(health)
// {
//   healthy: true,
//   checks: {
//     storage: { status: 'ok', message: '...' },
//     embedding: { status: 'ok', message: '...' },
//     ...
//   }
// }
```

## Troubleshooting

### "IndexedDB not available"
- **Solution**: Use `storage: { type: 'in-memory' }` or ensure you're in a browser environment

### "OpenAI API key required"
- **Solution**: Set `OPENAI_API_KEY` environment variable or pass `apiKey` in config

### "Token allocation must sum to 1.0"
- **Solution**: Ensure all allocation percentages sum to exactly 1.0

### Storage Issues
- **In-memory**: Fast but data lost on restart
- **IndexedDB**: Browser-only, persistent
- **Redis/Postgres**: Requires connection URL

## Next Steps

- See [README.md](./README.md) for full documentation
- Check [examples](./src/examples/) for more usage patterns
- Review [API Reference](./API.md) for complete method list
