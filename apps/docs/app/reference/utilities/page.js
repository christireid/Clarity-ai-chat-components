import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
export const metadata = {
    title: 'Utilities - Clarity Chat Reference',
    description: 'Helper functions and utilities for building AI applications.',
};
export default function UtilitiesPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Reference" }), _jsx("h1", { children: "Utilities" }), _jsx("p", { className: "docs-lead", children: "Helper functions, formatters, and utilities to enhance your AI applications." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Import" }), _jsx("pre", { children: _jsx("code", { children: `import {
  // Token & Cost
  countTokens,
  estimateCost,
  formatTokens,
  
  // Text Processing
  splitIntoChunks,
  semanticChunker,
  extractCodeBlocks,
  formatMarkdown,
  
  // Search & Retrieval
  hybridSearch,
  rerankDocuments,
  vectorSimilarity,
  
  // Rate Limiting
  RateLimiter,
  RequestBatcher,
  SmartCache,
  
  // Performance
  measureLatency,
  optimizePrompt,
  compressContext,
  
  // Validation
  validateMessage,
  sanitizeInput,
  detectPII,
  
  // Error Handling
  retryWithBackoff,
  timeout,
  gracefulDegradation
} from '@clarity-chat/react/utils'` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Token & Cost Utilities" }), _jsx("h3", { children: "countTokens" }), _jsx("p", { children: "Count tokens in text for a specific model:" }), _jsx("pre", { children: _jsx("code", { children: `import { countTokens } from '@clarity-chat/react/utils'

const text = 'Hello, how are you?'
const tokens = countTokens(text, 'gpt-4')
console.log(\`Tokens: \${tokens}\`) // Tokens: 6

// With messages
const messages = [
  { role: 'system', content: 'You are helpful' },
  { role: 'user', content: 'Hello!' }
]
const total = countTokens(messages, 'gpt-4')
console.log(\`Total tokens: \${total}\`)` }) }), _jsx("h3", { children: "estimateCost" }), _jsx("p", { children: "Estimate API costs:" }), _jsx("pre", { children: _jsx("code", { children: `import { estimateCost } from '@clarity-chat/react/utils'

const cost = estimateCost({
  model: 'gpt-4',
  inputTokens: 1000,
  outputTokens: 500
})
console.log(\`Cost: $\${cost}\`) // Cost: $0.045` }) }), _jsx("h3", { children: "formatTokens" }), _jsx("p", { children: "Human-readable token formatting:" }), _jsx("pre", { children: _jsx("code", { children: `import { formatTokens } from '@clarity-chat/react/utils'

formatTokens(1000) // "1K tokens"
formatTokens(1500000) // "1.5M tokens"
formatTokens(150, { includeEstimate: true }) // "150 tokens (~$0.0001)"` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Text Processing" }), _jsx("h3", { children: "splitIntoChunks" }), _jsx("p", { children: "Split text into fixed-size chunks with overlap:" }), _jsx("pre", { children: _jsx("code", { children: `import { splitIntoChunks } from '@clarity-chat/react/utils'

const text = 'Very long document...'
const chunks = splitIntoChunks(text, {
  size: 500,  // Max chunk size in tokens
  overlap: 50,  // Overlap between chunks
  model: 'gpt-4'
})

chunks.forEach((chunk, i) => {
  console.log(\`Chunk \${i}: \${chunk.length} chars\`)
})` }) }), _jsx("h3", { children: "semanticChunker" }), _jsx("p", { children: "Intelligent chunking that preserves semantic boundaries:" }), _jsx("pre", { children: _jsx("code", { children: `import { semanticChunker } from '@clarity-chat/react/utils'

const chunks = await semanticChunker(text, {
  maxChunkSize: 800,
  embeddings: openaiEmbeddings,
  strategy: 'paragraph'  // or 'sentence', 'topic'
})

// Chunks are split at natural boundaries (paragraphs, sections, etc.)` }) }), _jsx("h3", { children: "extractCodeBlocks" }), _jsx("p", { children: "Extract and parse code blocks from markdown:" }), _jsx("pre", { children: _jsx("code", { children: `import { extractCodeBlocks } from '@clarity-chat/react/utils'

const markdown = \`\`\`
Here's some code:

\\\`\\\`\\\`typescript
function hello() {
  console.log('Hello')
}
\\\`\\\`\\\`
\`\`\`

const blocks = extractCodeBlocks(markdown)
// [{ language: 'typescript', code: "function hello() {...}", line: 3 }]` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Search & Retrieval" }), _jsx("h3", { children: "hybridSearch" }), _jsx("p", { children: "Combine vector and keyword search:" }), _jsx("pre", { children: _jsx("code", { children: `import { HybridSearch } from '@clarity-chat/react/utils'

const search = new HybridSearch({
  vectorStore: pineconeIndex,
  fullTextSearch: elasticClient,
  alpha: 0.7  // Vector weight (0.3 for keyword)
})

const results = await search.search({
  query: 'machine learning algorithms',
  k: 10,
  filters: { category: 'technical' }
})` }) }), _jsx("h3", { children: "rerankDocuments" }), _jsx("p", { children: "Rerank search results for relevance:" }), _jsx("pre", { children: _jsx("code", { children: `import { rerankDocuments } from '@clarity-chat/react/utils'

const docs = await vectorSearch(query, 20)
const reranked = await rerankDocuments(query, docs, {
  model: 'cohere-rerank-v3',
  topK: 5
})

// Returns top 5 most relevant documents` }) }), _jsx("h3", { children: "vectorSimilarity" }), _jsx("p", { children: "Calculate similarity between embeddings:" }), _jsx("pre", { children: _jsx("code", { children: `import { vectorSimilarity } from '@clarity-chat/react/utils'

const similarity = vectorSimilarity(embedding1, embedding2, 'cosine')
console.log(\`Similarity: \${similarity}\`) // 0.0 to 1.0` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Rate Limiting & Caching" }), _jsx("h3", { children: "RateLimiter" }), _jsx("p", { children: "Token bucket rate limiting:" }), _jsx("pre", { children: _jsx("code", { children: `import { RateLimiter } from '@clarity-chat/react/utils'

const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'minute',
  fireImmediately: true
})

// In your API route
if (!await limiter.tryRemoveTokens(1)) {
  return new Response('Rate limit exceeded', { status: 429 })
}` }) }), _jsx("h3", { children: "RequestBatcher" }), _jsx("p", { children: "Batch multiple requests into one:" }), _jsx("pre", { children: _jsx("code", { children: `import { RequestBatcher } from '@clarity-chat/react/utils'

const batcher = new RequestBatcher({
  maxBatchSize: 10,
  maxWaitMs: 100,
  executor: async (items) => {
    return await openai.embeddings.create({
      input: items,
      model: 'text-embedding-3-small'
    })
  }
})

// Individual calls are automatically batched
const embedding1 = await batcher.add('text 1')
const embedding2 = await batcher.add('text 2')
// Both sent in single API call` }) }), _jsx("h3", { children: "SmartCache" }), _jsx("p", { children: "Intelligent caching with TTL and LRU:" }), _jsx("pre", { children: _jsx("code", { children: `import { SmartCache } from '@clarity-chat/react/utils'

const cache = new SmartCache({
  maxSize: 1000,
  ttl: 3600000,  // 1 hour
  strategy: 'lru'
})

// Cache embeddings
const embedding = await cache.getOrSet(
  \`embedding:\${text}\`,
  async () => await openai.embeddings.create({ input: text })
)` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Performance Utilities" }), _jsx("h3", { children: "measureLatency" }), _jsx("p", { children: "Measure operation latency:" }), _jsx("pre", { children: _jsx("code", { children: `import { measureLatency } from '@clarity-chat/react/utils'

const { result, latency } = await measureLatency(async () => {
  return await openai.chat.completions.create(...)
})

console.log(\`Request took \${latency}ms\`)` }) }), _jsx("h3", { children: "optimizePrompt" }), _jsx("p", { children: "Optimize prompts for token efficiency:" }), _jsx("pre", { children: _jsx("code", { children: `import { optimizePrompt } from '@clarity-chat/react/utils'

const optimized = await optimizePrompt(prompt, {
  algorithm: 'llmlingua',
  targetRatio: 0.6,
  preserveStructure: true
})

console.log(\`Reduced from \${prompt.length} to \${optimized.length}\`)` }) }), _jsx("h3", { children: "compressContext" }), _jsx("p", { children: "Compress conversation context:" }), _jsx("pre", { children: _jsx("code", { children: `import { compressContext } from '@clarity-chat/react/utils'

const compressed = await compressContext(messages, {
  maxTokens: 4000,
  strategy: 'semantic',  // Keep most important messages
  preserveRecent: 5  // Always keep last 5 messages
})` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Validation & Safety" }), _jsx("h3", { children: "validateMessage" }), _jsx("p", { children: "Validate message structure and content:" }), _jsx("pre", { children: _jsx("code", { children: `import { validateMessage } from '@clarity-chat/react/utils'

try {
  validateMessage(message, {
    maxLength: 10000,
    allowedRoles: ['user', 'assistant', 'system'],
    requireContent: true
  })
} catch (error) {
  console.error('Invalid message:', error.message)
}` }) }), _jsx("h3", { children: "sanitizeInput" }), _jsx("p", { children: "Sanitize user input:" }), _jsx("pre", { children: _jsx("code", { children: `import { sanitizeInput } from '@clarity-chat/react/utils'

const sanitized = sanitizeInput(userInput, {
  stripHTML: true,
  maxLength: 5000,
  allowedTags: [],
  preventPromptInjection: true
})` }) }), _jsx("h3", { children: "detectPII" }), _jsx("p", { children: "Detect personally identifiable information:" }), _jsx("pre", { children: _jsx("code", { children: `import { detectPII } from '@clarity-chat/react/utils'

const pii = detectPII(text)
if (pii.length > 0) {
  console.warn('PII detected:', pii)
  // pii: [{ type: 'email', value: 'user@example.com', offset: 45 }]
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Error Handling" }), _jsx("h3", { children: "retryWithBackoff" }), _jsx("p", { children: "Retry failed operations with exponential backoff:" }), _jsx("pre", { children: _jsx("code", { children: `import { retryWithBackoff } from '@clarity-chat/react/utils'

const result = await retryWithBackoff(
  async () => await unstableAPICall(),
  {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    factor: 2,
    onRetry: (error, attempt) => {
      console.log(\`Retry \${attempt}: \${error.message}\`)
    }
  }
)` }) }), _jsx("h3", { children: "timeout" }), _jsx("p", { children: "Add timeout to promises:" }), _jsx("pre", { children: _jsx("code", { children: `import { timeout } from '@clarity-chat/react/utils'

try {
  const result = await timeout(
    openai.chat.completions.create(...),
    5000  // 5 second timeout
  )
} catch (error) {
  if (error.name === 'TimeoutError') {
    console.error('Request timed out')
  }
}` }) }), _jsx("h3", { children: "gracefulDegradation" }), _jsx("p", { children: "Fallback to alternatives on failure:" }), _jsx("pre", { children: _jsx("code", { children: `import { gracefulDegradation } from '@clarity-chat/react/utils'

const result = await gracefulDegradation([
  async () => await primaryService(),
  async () => await fallbackService(),
  async () => await cachedResponse()
])

// Returns first successful result` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs(Callout, { type: "tip", title: "Utility Tips", children: ["\u2022 Cache expensive operations (embeddings, API calls)", _jsx("br", {}), "\u2022 Use rate limiting to prevent quota exhaustion", _jsx("br", {}), "\u2022 Batch similar requests when possible", _jsx("br", {}), "\u2022 Always validate and sanitize user input", _jsx("br", {}), "\u2022 Implement retries with backoff for reliability"] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/hooks", className: "docs-card", children: [_jsx("h3", { children: "Hooks" }), _jsx("p", { children: "React hooks for common patterns" })] }), _jsxs("a", { href: "/guides/performance", className: "docs-card", children: [_jsx("h3", { children: "Performance Guide" }), _jsx("p", { children: "Optimization techniques" })] }), _jsxs("a", { href: "/guides/token-optimization", className: "docs-card", children: [_jsx("h3", { children: "Token Optimization" }), _jsx("p", { children: "Reduce costs" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map