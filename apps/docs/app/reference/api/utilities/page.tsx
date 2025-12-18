import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Utilities API Reference - Clarity Chat',
  description: 'Leverage helper modules from @clarity-chat/react/utils to orchestrate fallbacks, manage context windows, and combine search strategies.',
}

export default function UtilitiesAPIPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">API Reference</span>
        <h1>Utilities</h1>
        <p className="docs-lead">
          Leverage helper modules from <code>@clarity-chat/react/utils</code> to orchestrate fallbacks, manage context windows, and combine search strategies.
        </p>
      </div>

      <section className="docs-section">
        <h2>Model Fallback</h2>
        <p>
          <code>withModelFallback</code> automatically retries across ranked models when failures occur.
        </p>
        <CodeBlock
          language="ts"
          code={`import { withModelFallback } from '@clarity-chat/react/utils'

const result = await withModelFallback(
  async model => callProvider(model.provider, model.model, prompt),
  {
    models: [
      { provider: 'openai', model: 'gpt-4o-mini', priority: 1 },
      { provider: 'anthropic', model: 'claude-3-sonnet', priority: 2 },
    ],
    onFallback: (from, to) => logger.debug(\`Falling back from \${from.model} to \${to.model}\`),
  }
)`}
        />
      </section>

      <section className="docs-section">
        <h2>Context Window Management</h2>
        <p>
          Use <code>ContextWindowManager</code> with built-in truncation strategies (FIFO, sliding window, smart, summarisation) to keep prompts within model limits.
        </p>
        <CodeBlock
          language="ts"
          code={`import { ContextWindowManager, estimateTokens } from '@clarity-chat/react/utils'

const manager = new ContextWindowManager('smart', {
  maxTokens: 16_000,
  reservedTokens: 2_000,
  countTokens: estimateTokens,
})

const truncated = await manager.truncate(messages)`}
        />
      </section>

      <section className="docs-section">
        <h2>Rate Limiting</h2>
        <p>
          Guard API calls with the token bucket or sliding window limiters.
        </p>
        <CodeBlock
          language="ts"
          code={`import {
  MemoryRateLimitStorage,
  TokenBucketRateLimiter,
  withRateLimit,
} from '@clarity-chat/react/utils'

const limiter = new TokenBucketRateLimiter({
  maxRequests: 60,
  windowMs: 60_000,
  storage: new MemoryRateLimitStorage(),
})

await withRateLimit(() => processRequest(), userId, limiter)`}
        />
      </section>

      <section className="docs-section">
        <h2>Hybrid Search</h2>
        <p>
          Blend keyword and vector search results for retrieval augmented generation (RAG) pipelines.
        </p>
        <CodeBlock
          language="ts"
          code={`import { HybridSearch } from '@clarity-chat/react/utils'

const search = new HybridSearch({
  keywordSearcher: bm25Searcher,
  vectorSearcher: vectorStore,
  keywordWeight: 0.3,
  vectorWeight: 0.7,
})

const results = await search.search('responsible AI policies', 8)`}
        />
      </section>

      <section className="docs-section">
        <p>
          Explore the source files in <code>packages/react/src/utils</code> for additional helpers such as mobile optimisations and hybrid reranking utilities.
        </p>
      </section>
    </div>
  )
}
