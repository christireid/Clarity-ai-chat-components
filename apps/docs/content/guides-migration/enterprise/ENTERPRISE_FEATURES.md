# Enterprise Features Guide

Complete guide to enterprise-grade AI features in Clarity Chat.

---

## 📚 Table of Contents

1. [Vector Stores](#vector-stores)
2. [Embeddings](#embeddings)
3. [Agent Orchestration](#agent-orchestration)
4. [Prompt Templates](#prompt-templates)
5. [Document Loaders](#document-loaders)
6. [Model Fallback](#model-fallback)
7. [Context Window Management](#context-window-management)
8. [Rate Limiting](#rate-limiting)
9. [Hybrid Search](#hybrid-search)
10. [AI Safety](#ai-safety)
11. [Observability](#observability)
12. [Reranking](#reranking)
13. [Webhooks](#webhooks)
14. [Plugins](#plugins)
15. [Audit Logging](#audit-logging)
16. [Usage Quotas](#usage-quotas)
17. [Multi-Tenancy](#multi-tenancy)
18. [RBAC](#rbac)

---

## Vector Stores

**Purpose**: Enterprise RAG with multiple vector database providers.

**Providers**: Pinecone, Qdrant, Weaviate, Chroma

### Quick Start

```tsx
import { createVectorStore } from '@clarity-chat/react'

const store = createVectorStore({
  provider: 'pinecone',
  apiKey: process.env.PINECONE_API_KEY,
  environment: 'us-east1-gcp',
  indexName: 'documents',
})

await store.initialize()

// Upsert vectors
await store.upsert([
  {
    id: 'doc-1',
    values: [0.1, 0.2, 0.3, ...], // 1536 dims for OpenAI
    metadata: { title: 'Document 1' },
  },
])

// Query
const results = await store.query({
  vector: queryVector,
  topK: 10,
  minScore: 0.7,
})
```

### Switching Providers

```tsx
// Switch from Pinecone to Qdrant - just change config!
const store = createVectorStore({
  provider: 'qdrant',
  endpoint: 'https://xyz.qdrant.io',
  apiKey: process.env.QDRANT_API_KEY,
  indexName: 'documents',
})
// Same API, different provider!
```

---

## Embeddings

**Purpose**: Generate embeddings with automatic caching.

**Providers**: OpenAI, Cohere

### Quick Start

```tsx
import { createCachedEmbeddingProvider, MemoryEmbeddingCache } from '@clarity-chat/react'

const embeddings = createCachedEmbeddingProvider(
  {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'text-embedding-3-small',
  },
  {
    cache: new MemoryEmbeddingCache(),
  }
)

// Generate embeddings
const vector = await embeddings.embedText('Hello world')

// Batch embeddings
const vectors = await embeddings.embedBatch(['Text 1', 'Text 2', 'Text 3'])

// Check cache stats
const stats = await embeddings.getCacheStats()
console.log(`Hit rate: ${stats.hitRate}`) // 60-80% typical
```

---

## Agent Orchestration

**Purpose**: Build agentic AI systems with tool calling.

### Quick Start

```tsx
import { createAgent, webSearchTool, calculatorTool } from '@clarity-chat/react'

const agent = createAgent(
  {
    name: 'ResearchAgent',
    tools: [webSearchTool, calculatorTool],
    maxIterations: 10,
  },
  {
    onThought: (thought) => console.log('Thinking:', thought),
    onAction: (tool, args) => console.log('Using:', tool, args),
    onAnswer: (answer) => console.log('Answer:', answer),
  }
)

const execution = await agent.execute('What is the population of Tokyo times 2?')

console.log(execution.answer)
console.log(execution.steps) // See reasoning process
```

### Custom Tools

```tsx
const weatherTool: Tool = {
  name: 'get_weather',
  description: 'Get current weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: { type: 'string' },
    },
    required: ['location'],
  },
  async execute(args) {
    const response = await fetch(`/api/weather?location=${args.location}`)
    return await response.json()
  },
}

agent.addTool(weatherTool)
```

---

## AI Safety

**Purpose**: Content moderation, PII detection, and guardrails.

### Quick Start

```tsx
import {
  SafetyChecker,
  PIIGuardrail,
  ContentFilterGuardrail,
  PromptInjectionGuardrail,
} from '@clarity-chat/react'

const safety = new SafetyChecker([
  new PIIGuardrail({ action: 'redact' }),
  new ContentFilterGuardrail({
    keywords: {
      profanity: ['bad', 'words'],
    },
  }),
  new PromptInjectionGuardrail(),
])

const result = await safety.check(userInput)

if (!result.safe) {
  console.log('Issues found:', result.issues)
  console.log('Action:', result.action) // 'allow', 'block', or 'review'
}
```

---

## Complete RAG Example

```tsx
import {
  // Vector storage
  createVectorStore,
  // Embeddings
  createCachedEmbeddingProvider,
  MemoryEmbeddingCache,
  // Document processing
  LoaderRegistry,
  RecursiveTextSplitter,
  // Search
  HybridSearch,
  SimpleBM25Searcher,
  // Reranking
  SimpleReranker,
  // Safety
  SafetyChecker,
  PIIGuardrail,
  // Utilities
  withModelFallback,
  ContextWindowManager,
  // Observability
  getTracer,
} from '@clarity-chat/react'

async function buildRAGSystem() {
  // 1. Setup infrastructure
  const embeddings = createCachedEmbeddingProvider({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
  })

  const vectorStore = createVectorStore({
    provider: 'pinecone',
    apiKey: process.env.PINECONE_API_KEY,
    indexName: 'docs',
  })

  const safety = new SafetyChecker([new PIIGuardrail()])
  const tracer = getTracer({ enabled: true })

  // 2. Ingest documents
  const loader = new LoaderRegistry()
  const docs = await loader.load(files)

  const splitter = new RecursiveTextSplitter()
  const chunks = splitter.splitDocuments(docs, {
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  for (const chunk of chunks) {
    const vector = await embeddings.embedText(chunk.content)
    await vectorStore.upsert([
      {
        id: chunk.id,
        values: vector,
        metadata: chunk.metadata,
      },
    ])
  }

  // 3. Query function
  async function query(question: string) {
    // Check safety
    const safetyCheck = await safety.check(question)
    if (!safetyCheck.safe) {
      throw new Error('Unsafe query')
    }

    // Start tracing
    tracer.startTrace('rag-query')

    // Get embeddings
    const queryVector = await embeddings.embedText(question)

    // Search
    const results = await vectorStore.query({
      vector: queryVector,
      topK: 10,
    })

    // Rerank
    const reranker = new SimpleReranker()
    const reranked = await reranker.rerank({
      query: question,
      documents: results,
      topK: 5,
    })

    // Generate answer with fallback
    const answer = await withModelFallback(
      async (model) => {
        // Your AI call here
        return 'Answer based on context'
      },
      {
        models: [
          { provider: 'openai', model: 'gpt-4', priority: 1 },
          { provider: 'anthropic', model: 'claude-3', priority: 2 },
        ],
      }
    )

    await tracer.endTrace()

    return answer
  }

  return { query }
}
```

**Result**: Production-grade RAG in ~80 lines of code!

---

## Best Practices

### 1. Always Use Caching
```tsx
// ✅ Good - saves 60-80% on embedding costs
const embeddings = createCachedEmbeddingProvider(...)

// ❌ Bad - pays full price every time
const embeddings = createEmbeddingProvider(...)
```

### 2. Implement Safety Checks
```tsx
// ✅ Good - protects from PII leaks and injections
const safety = new SafetyChecker([...])
await safety.check(userInput)

// ❌ Bad - no protection
```

### 3. Use Model Fallback
```tsx
// ✅ Good - automatic retry on failures
await withModelFallback(fn, { models: [...] })

// ❌ Bad - single point of failure
await callModel('gpt-4', prompt)
```

### 4. Monitor with Observability
```tsx
// ✅ Good - track everything
const tracer = getTracer()
tracer.startTrace('operation')
// ... work
await tracer.endTrace()

// ❌ Bad - flying blind
```

---

## Integration Examples

### With Next.js

```tsx
// app/api/chat/route.ts
import {
  createVectorStore,
  createCachedEmbeddingProvider,
  SafetyChecker,
  PIIGuardrail,
} from '@clarity-chat/react'

export async function POST(request: Request) {
  const { query } = await request.json()

  // Safety check
  const safety = new SafetyChecker([new PIIGuardrail()])
  const safetyResult = await safety.check(query)

  if (!safetyResult.safe) {
    return Response.json({ error: 'Unsafe query' }, { status: 400 })
  }

  // Query RAG system
  const embeddings = createCachedEmbeddingProvider(...)
  const vector = await embeddings.embedText(query)

  const vectorStore = createVectorStore(...)
  const results = await vectorStore.query({ vector, topK: 5 })

  return Response.json({ results })
}
```

---

## Performance Tips

### 1. Use Namespaces for Multi-Tenancy
```tsx
// Isolate tenant data
await vectorStore.upsert(vectors, {
  namespace: tenants.getNamespace('tenant-123'),
})
```

### 2. Batch Operations
```tsx
// ✅ Good - batch embeddings
const vectors = await embeddings.embedBatch(texts)

// ❌ Bad - one at a time
for (const text of texts) {
  await embeddings.embedText(text)
}
```

### 3. Smart Context Management
```tsx
const contextMgr = new ContextWindowManager('smart', {
  maxTokens: 128000,
  reservedTokens: 4000,
  countTokens: estimateTokens,
})

const truncated = contextMgr.truncate(messages)
```

---

## Security Checklist

- [ ] Enable PII detection
- [ ] Configure content filtering
- [ ] Add prompt injection detection
- [ ] Implement rate limiting
- [ ] Enable audit logging
- [ ] Set usage quotas
- [ ] Use RBAC for access control
- [ ] Enable multi-tenancy isolation
- [ ] Monitor with observability
- [ ] Test safety guardrails

---

## Cost Optimization

1. **Use embedding cache**: 60-80% savings
2. **Implement rate limiting**: Prevent abuse
3. **Set usage quotas**: Control costs per user/tenant
4. **Model fallback**: Use cheaper models when possible
5. **Context management**: Don't send unnecessary tokens
6. **Batch operations**: Reduce API calls

---

## Support

- 📚 [Full API Documentation](../api/)
- 💡 [Examples](../../examples/)
- 🐛 [Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- 💬 [Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)

---

**All features are optional, flexible, and production-ready** 🚀

