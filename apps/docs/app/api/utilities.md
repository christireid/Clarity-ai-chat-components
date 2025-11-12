# Utilities

Leverage helper modules from `@clarity-chat/react/utils` to orchestrate fallbacks, manage context windows, and combine search strategies.

## Model Fallback

`withModelFallback` automatically retries across ranked models when failures occur.

```ts
import { withModelFallback } from '@clarity-chat/react/utils'

const result = await withModelFallback(
  async model => callProvider(model.provider, model.model, prompt),
  {
    models: [
      { provider: 'openai', model: 'gpt-4o-mini', priority: 1 },
      { provider: 'anthropic', model: 'claude-3-sonnet', priority: 2 },
    ],
    onFallback: (from, to) => console.log(`Falling back from ${from.model} to ${to.model}`),
  }
)
```

## Context Window Management

Use `ContextWindowManager` with built-in truncation strategies (FIFO, sliding window, smart, summarisation) to keep prompts within model limits.

```ts
import { ContextWindowManager, estimateTokens } from '@clarity-chat/react/utils'

const manager = new ContextWindowManager('smart', {
  maxTokens: 16_000,
  reservedTokens: 2_000,
  countTokens: estimateTokens,
})

const truncated = await manager.truncate(messages)
```

## Rate Limiting

Guard API calls with the token bucket or sliding window limiters.

```ts
import {
  MemoryRateLimitStorage,
  TokenBucketRateLimiter,
  withRateLimit,
} from '@clarity-chat/react/utils'

const limiter = new TokenBucketRateLimiter({
  maxRequests: 60,
  windowMs: 60_000,
  storage: new MemoryRateLimitStorage(),
})

await withRateLimit(() => processRequest(), userId, limiter)
```

## Hybrid Search

Blend keyword and vector search results for retrieval augmented generation (RAG) pipelines.

```ts
import { HybridSearch } from '@clarity-chat/react/utils'

const search = new HybridSearch({
  keywordSearcher: bm25Searcher,
  vectorSearcher: vectorStore,
  keywordWeight: 0.3,
  vectorWeight: 0.7,
})

const results = await search.search('responsible AI policies', 8)
```

Explore the source files in `packages/react/src/utils` for additional helpers such as mobile optimisations and hybrid reranking utilities.
