<!-- markdownlint-disable MD013 -->
# Enterprise Features - Quick Reference

One-page reference for all enterprise AI features.

---

## 🗄️ Vector Stores

```tsx
import { createVectorStore } from '@clarity-chat/react'

// Pinecone
const store = createVectorStore({ provider: 'pinecone', apiKey: '...', indexName: 'docs' })

// Qdrant
const store = createVectorStore({ provider: 'qdrant', endpoint: 'https://...', indexName: 'docs' })

// Operations
await store.upsert(vectors)
const results = await store.query({ vector, topK: 10 })
await store.delete(ids)
```

**Providers**: Pinecone | Qdrant | Weaviate | Chroma

---

## 🔤 Embeddings

```tsx
import { createCachedEmbeddingProvider, MemoryEmbeddingCache } from '@clarity-chat/react'

const embeddings = createCachedEmbeddingProvider(
  { provider: 'openai', apiKey: '...' },
  { cache: new MemoryEmbeddingCache() }
)

const vector = await embeddings.embedText('Hello')
const vectors = await embeddings.embedBatch(['Text 1', 'Text 2'])
```

**Providers**: OpenAI | Cohere  
**Cache**: Memory | LocalStorage | Semantic

---

## 🤖 Agents

```tsx
import { createAgent, webSearchTool } from '@clarity-chat/react'

const agent = createAgent({
  name: 'Assistant',
  tools: [webSearchTool],
})

const execution = await agent.execute('What is the weather?')
console.log(execution.answer)
```

**Tools**: Calculator | Web Search | Database | File | API | Code Execution

---

## 📝 Prompts

```tsx
import { renderPrompt } from '@clarity-chat/react'

const prompt = renderPrompt('Hello {{name}}!', { name: 'Alice' })
```

**Features**: Variables | Validation | Library | Versioning

---

## 📄 Document Loaders

```tsx
import { LoaderRegistry, RecursiveTextSplitter } from '@clarity-chat/react'

const loader = new LoaderRegistry()
const docs = await loader.load(file)

const splitter = new RecursiveTextSplitter()
const chunks = splitter.splitDocuments(docs, { chunkSize: 1000, chunkOverlap: 200 })
```

**Formats**: Text | JSON | CSV | HTML | Markdown

---

## 🔄 Model Fallback

```tsx
import { withModelFallback } from '@clarity-chat/react'

const result = await withModelFallback(
  async (model) => callAI(model),
  {
    models: [
      { provider: 'openai', model: 'gpt-4', priority: 1 },
      { provider: 'anthropic', model: 'claude-3', priority: 2 },
    ],
  }
)
```

**Features**: Auto-retry | Exponential backoff | Priority-based

---

## 🪟 Context Window

```tsx
import { ContextWindowManager, estimateTokens } from '@clarity-chat/react'

const manager = new ContextWindowManager('smart', {
  maxTokens: 128000,
  countTokens: estimateTokens,
})

const truncated = manager.truncate(messages)
```

**Strategies**: FIFO | Smart | Sliding Window | Summarization

---

## ⏱️ Rate Limiting

```tsx
import { TokenBucketRateLimiter, MemoryRateLimitStorage } from '@clarity-chat/react'

const limiter = new TokenBucketRateLimiter({
  maxRequests: 10,
  windowMs: 60000,
  storage: new MemoryRateLimitStorage(),
})

const result = await limiter.checkLimit('user-123')
if (!result.allowed) {
  console.log(`Retry after ${result.retryAfter}ms`)
}
```

**Algorithms**: Token Bucket | Sliding Window

---

## 🔍 Hybrid Search

```tsx
import { HybridSearch, SimpleBM25Searcher } from '@clarity-chat/react'

const hybrid = new HybridSearch({
  keywordSearcher: new SimpleBM25Searcher(docs),
  vectorSearcher: vectorStore,
  keywordWeight: 0.3,
  vectorWeight: 0.7,
})

const results = await hybrid.search('machine learning', 10)
```

**Fusion**: RRF (Reciprocal Rank) | Weighted | Custom

---

## 🛡️ AI Safety

```tsx
import { SafetyChecker, PIIGuardrail, PromptInjectionGuardrail } from '@clarity-chat/react'

const safety = new SafetyChecker([
  new PIIGuardrail(),
  new PromptInjectionGuardrail(),
])

const result = await safety.check(userInput)
if (!result.safe) {
  // Handle unsafe content
}
```

**Guardrails**: PII Detection | Content Filter | Prompt Injection

---

## 📊 Observability

```tsx
import { getTracer } from '@clarity-chat/react'

const tracer = getTracer()

tracer.startTrace('chat-completion')
const llmSpan = tracer.startSpan('openai-call', 'llm')

// Do work
tracer.endSpan(result)
await tracer.endTrace()
```

**Types**: LLM | Chain | Tool | Retrieval

---

## 🔃 Reranking

```tsx
import { SimpleReranker } from '@clarity-chat/react'

const reranker = new SimpleReranker()
const reranked = await reranker.rerank({
  query: 'machine learning',
  documents: searchResults,
  topK: 5,
})
```

**Rerankers**: Simple | Diversity

---

## 🪝 Webhooks

```tsx
import { WebhookManager, WebhookEvents } from '@clarity-chat/react'

const webhooks = new WebhookManager()

webhooks.register({
  id: 'my-webhook',
  url: 'https://example.com/webhook',
  events: [WebhookEvents.CHAT_COMPLETION],
})

await webhooks.emit({
  id: 'evt-123',
  type: WebhookEvents.CHAT_COMPLETION,
  data: { messageId: '456' },
  timestamp: Date.now(),
})
```

---

## 🔌 Plugins

```tsx
import { PluginManager } from '@clarity-chat/react'

const manager = new PluginManager()

await manager.register({
  plugin: {
    name: 'analytics',
    version: '1.0.0',
    hooks: {
      afterReceiveMessage: async (msg) => {
        analytics.track('message', msg)
      },
    },
  },
})

await manager.callHook('afterReceiveMessage', message)
```

---

## 📝 Audit Logging

```tsx
import { AuditLogger, MemoryAuditStorage } from '@clarity-chat/react'

const audit = new AuditLogger({
  storage: new MemoryAuditStorage(),
  retentionDays: 90,
})

await audit.log('chat.message.sent', { messageId: '123' }, {
  userId: 'user-456',
  result: 'success',
})

const events = await audit.query({ userId: 'user-456' })
```

---

## 💰 Usage Quotas

```tsx
import { QuotaManager, MemoryQuotaStorage } from '@clarity-chat/react'

const quotas = new QuotaManager({
  limits: { tokens: 100000, requests: 1000 },
  resetPeriod: 'monthly',
  storage: new MemoryQuotaStorage(),
})

const check = await quotas.checkQuota('user-123', 'tokens', 500)
if (check.allowed) {
  await doOperation()
  await quotas.recordUsage('user-123', 'tokens', 500)
}
```

---

## 🏢 Multi-Tenancy

```tsx
import { TenantManager, MemoryTenantStorage } from '@clarity-chat/react'

const tenants = new TenantManager(new MemoryTenantStorage())

tenants.setContext({ tenant: { id: 'acme', name: 'Acme Corp', status: 'active' } })

const namespace = tenants.getNamespace('acme')
await vectorStore.query({ namespace, vector, topK: 10 })
```

---

## 🔐 RBAC

```tsx
import { RBACManager, MemoryRBACStorage, CommonRoles } from '@clarity-chat/react'

const storage = new MemoryRBACStorage()
storage.addRole(CommonRoles.ADMIN)
storage.assignRoles('user-123', ['admin'])

const rbac = new RBACManager(storage)

const canDelete = await rbac.hasPermission(
  { userId: 'user-123', roles: ['admin'] },
  'document.delete'
)
```

---

## 📦 Import Summary

```tsx
// All enterprise features in one import
import {
  // Vector storage
  createVectorStore,

  // Embeddings
  createCachedEmbeddingProvider,

  // Agents
  createAgent,

  // Safety
  SafetyChecker,
  PIIGuardrail,

  // Observability
  getTracer,

  // Utilities
  withModelFallback,
  ContextWindowManager,
  HybridSearch,

  // Multi-tenancy
  TenantManager,

  // RBAC
  RBACManager,

  // Quotas
  QuotaManager,

  // Audit
  AuditLogger,

  // Webhooks
  WebhookManager,

  // Plugins
  PluginManager,
} from '@clarity-chat/react'
```

---

**All features are optional - import only what you need!** 🎯

