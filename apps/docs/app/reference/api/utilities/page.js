import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const metadata = {
    title: 'Utilities API Reference - Clarity Chat',
    description: 'Leverage helper modules from @clarity-chat/react/utils to orchestrate fallbacks, manage context windows, and combine search strategies.',
};
export default function UtilitiesAPIPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "API Reference" }), _jsx("h1", { children: "Utilities" }), _jsxs("p", { className: "docs-lead", children: ["Leverage helper modules from ", _jsx("code", { children: "@clarity-chat/react/utils" }), " to orchestrate fallbacks, manage context windows, and combine search strategies."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Model Fallback" }), _jsxs("p", { children: [_jsx("code", { children: "withModelFallback" }), " automatically retries across ranked models when failures occur."] }), _jsx(CodeBlock, { language: "ts", code: `import { withModelFallback } from '@clarity-chat/react/utils'

const result = await withModelFallback(
  async model => callProvider(model.provider, model.model, prompt),
  {
    models: [
      { provider: 'openai', model: 'gpt-4o-mini', priority: 1 },
      { provider: 'anthropic', model: 'claude-3-sonnet', priority: 2 },
    ],
    onFallback: (from, to) => console.log(\`Falling back from \${from.model} to \${to.model}\`),
  }
)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Context Window Management" }), _jsxs("p", { children: ["Use ", _jsx("code", { children: "ContextWindowManager" }), " with built-in truncation strategies (FIFO, sliding window, smart, summarisation) to keep prompts within model limits."] }), _jsx(CodeBlock, { language: "ts", code: `import { ContextWindowManager, estimateTokens } from '@clarity-chat/react/utils'

const manager = new ContextWindowManager('smart', {
  maxTokens: 16_000,
  reservedTokens: 2_000,
  countTokens: estimateTokens,
})

const truncated = await manager.truncate(messages)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Rate Limiting" }), _jsx("p", { children: "Guard API calls with the token bucket or sliding window limiters." }), _jsx(CodeBlock, { language: "ts", code: `import {
  MemoryRateLimitStorage,
  TokenBucketRateLimiter,
  withRateLimit,
} from '@clarity-chat/react/utils'

const limiter = new TokenBucketRateLimiter({
  maxRequests: 60,
  windowMs: 60_000,
  storage: new MemoryRateLimitStorage(),
})

await withRateLimit(() => processRequest(), userId, limiter)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Hybrid Search" }), _jsx("p", { children: "Blend keyword and vector search results for retrieval augmented generation (RAG) pipelines." }), _jsx(CodeBlock, { language: "ts", code: `import { HybridSearch } from '@clarity-chat/react/utils'

const search = new HybridSearch({
  keywordSearcher: bm25Searcher,
  vectorSearcher: vectorStore,
  keywordWeight: 0.3,
  vectorWeight: 0.7,
})

const results = await search.search('responsible AI policies', 8)` })] }), _jsx("section", { className: "docs-section", children: _jsxs("p", { children: ["Explore the source files in ", _jsx("code", { children: "packages/react/src/utils" }), " for additional helpers such as mobile optimisations and hybrid reranking utilities."] }) })] }));
}
//# sourceMappingURL=page.js.map