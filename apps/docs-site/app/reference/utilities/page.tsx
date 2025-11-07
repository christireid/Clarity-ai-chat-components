import React from 'react'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Utilities - Clarity Chat Reference',
  description: 'Helper functions and utilities for building AI applications.',
}

export default function UtilitiesPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Reference</span>
        <h1>Utilities</h1>
        <p className="docs-lead">
          Helper functions, formatters, and utilities to enhance your AI applications.
        </p>
      </div>

      <section className="docs-section">
        <h2>Import</h2>
        <pre><code>{`import {
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
} from '@clarity-chat/react/utils'`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Token & Cost Utilities</h2>
        
        <h3>countTokens</h3>
        <p>Count tokens in text for a specific model:</p>
        <pre><code>{`import { countTokens } from '@clarity-chat/react/utils'

const text = 'Hello, how are you?'
const tokens = countTokens(text, 'gpt-4')
console.log(\`Tokens: \${tokens}\`) // Tokens: 6

// With messages
const messages = [
  { role: 'system', content: 'You are helpful' },
  { role: 'user', content: 'Hello!' }
]
const total = countTokens(messages, 'gpt-4')
console.log(\`Total tokens: \${total}\`)`}</code></pre>

        <h3>estimateCost</h3>
        <p>Estimate API costs:</p>
        <pre><code>{`import { estimateCost } from '@clarity-chat/react/utils'

const cost = estimateCost({
  model: 'gpt-4',
  inputTokens: 1000,
  outputTokens: 500
})
console.log(\`Cost: $\${cost}\`) // Cost: $0.045`}</code></pre>

        <h3>formatTokens</h3>
        <p>Human-readable token formatting:</p>
        <pre><code>{`import { formatTokens } from '@clarity-chat/react/utils'

formatTokens(1000) // "1K tokens"
formatTokens(1500000) // "1.5M tokens"
formatTokens(150, { includeEstimate: true }) // "150 tokens (~$0.0001)"`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Text Processing</h2>
        
        <h3>splitIntoChunks</h3>
        <p>Split text into fixed-size chunks with overlap:</p>
        <pre><code>{`import { splitIntoChunks } from '@clarity-chat/react/utils'

const text = 'Very long document...'
const chunks = splitIntoChunks(text, {
  size: 500,  // Max chunk size in tokens
  overlap: 50,  // Overlap between chunks
  model: 'gpt-4'
})

chunks.forEach((chunk, i) => {
  console.log(\`Chunk \${i}: \${chunk.length} chars\`)
})`}</code></pre>

        <h3>semanticChunker</h3>
        <p>Intelligent chunking that preserves semantic boundaries:</p>
        <pre><code>{`import { semanticChunker } from '@clarity-chat/react/utils'

const chunks = await semanticChunker(text, {
  maxChunkSize: 800,
  embeddings: openaiEmbeddings,
  strategy: 'paragraph'  // or 'sentence', 'topic'
})

// Chunks are split at natural boundaries (paragraphs, sections, etc.)`}</code></pre>

        <h3>extractCodeBlocks</h3>
        <p>Extract and parse code blocks from markdown:</p>
        <pre><code>{`import { extractCodeBlocks } from '@clarity-chat/react/utils'

const markdown = \`\`\`
Here's some code:

\\\`\\\`\\\`typescript
function hello() {
  console.log('Hello')
}
\\\`\\\`\\\`
\`\`\`

const blocks = extractCodeBlocks(markdown)
// [{ language: 'typescript', code: "function hello() {...}", line: 3 }]`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Search & Retrieval</h2>
        
        <h3>hybridSearch</h3>
        <p>Combine vector and keyword search:</p>
        <pre><code>{`import { HybridSearch } from '@clarity-chat/react/utils'

const search = new HybridSearch({
  vectorStore: pineconeIndex,
  fullTextSearch: elasticClient,
  alpha: 0.7  // Vector weight (0.3 for keyword)
})

const results = await search.search({
  query: 'machine learning algorithms',
  k: 10,
  filters: { category: 'technical' }
})`}</code></pre>

        <h3>rerankDocuments</h3>
        <p>Rerank search results for relevance:</p>
        <pre><code>{`import { rerankDocuments } from '@clarity-chat/react/utils'

const docs = await vectorSearch(query, 20)
const reranked = await rerankDocuments(query, docs, {
  model: 'cohere-rerank-v3',
  topK: 5
})

// Returns top 5 most relevant documents`}</code></pre>

        <h3>vectorSimilarity</h3>
        <p>Calculate similarity between embeddings:</p>
        <pre><code>{`import { vectorSimilarity } from '@clarity-chat/react/utils'

const similarity = vectorSimilarity(embedding1, embedding2, 'cosine')
console.log(\`Similarity: \${similarity}\`) // 0.0 to 1.0`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Rate Limiting & Caching</h2>
        
        <h3>RateLimiter</h3>
        <p>Token bucket rate limiting:</p>
        <pre><code>{`import { RateLimiter } from '@clarity-chat/react/utils'

const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'minute',
  fireImmediately: true
})

// In your API route
if (!await limiter.tryRemoveTokens(1)) {
  return new Response('Rate limit exceeded', { status: 429 })
}`}</code></pre>

        <h3>RequestBatcher</h3>
        <p>Batch multiple requests into one:</p>
        <pre><code>{`import { RequestBatcher } from '@clarity-chat/react/utils'

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
// Both sent in single API call`}</code></pre>

        <h3>SmartCache</h3>
        <p>Intelligent caching with TTL and LRU:</p>
        <pre><code>{`import { SmartCache } from '@clarity-chat/react/utils'

const cache = new SmartCache({
  maxSize: 1000,
  ttl: 3600000,  // 1 hour
  strategy: 'lru'
})

// Cache embeddings
const embedding = await cache.getOrSet(
  \`embedding:\${text}\`,
  async () => await openai.embeddings.create({ input: text })
)`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Performance Utilities</h2>
        
        <h3>measureLatency</h3>
        <p>Measure operation latency:</p>
        <pre><code>{`import { measureLatency } from '@clarity-chat/react/utils'

const { result, latency } = await measureLatency(async () => {
  return await openai.chat.completions.create(...)
})

console.log(\`Request took \${latency}ms\`)`}</code></pre>

        <h3>optimizePrompt</h3>
        <p>Optimize prompts for token efficiency:</p>
        <pre><code>{`import { optimizePrompt } from '@clarity-chat/react/utils'

const optimized = await optimizePrompt(prompt, {
  algorithm: 'llmlingua',
  targetRatio: 0.6,
  preserveStructure: true
})

console.log(\`Reduced from \${prompt.length} to \${optimized.length}\`)`}</code></pre>

        <h3>compressContext</h3>
        <p>Compress conversation context:</p>
        <pre><code>{`import { compressContext } from '@clarity-chat/react/utils'

const compressed = await compressContext(messages, {
  maxTokens: 4000,
  strategy: 'semantic',  // Keep most important messages
  preserveRecent: 5  // Always keep last 5 messages
})`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Validation & Safety</h2>
        
        <h3>validateMessage</h3>
        <p>Validate message structure and content:</p>
        <pre><code>{`import { validateMessage } from '@clarity-chat/react/utils'

try {
  validateMessage(message, {
    maxLength: 10000,
    allowedRoles: ['user', 'assistant', 'system'],
    requireContent: true
  })
} catch (error) {
  console.error('Invalid message:', error.message)
}`}</code></pre>

        <h3>sanitizeInput</h3>
        <p>Sanitize user input:</p>
        <pre><code>{`import { sanitizeInput } from '@clarity-chat/react/utils'

const sanitized = sanitizeInput(userInput, {
  stripHTML: true,
  maxLength: 5000,
  allowedTags: [],
  preventPromptInjection: true
})`}</code></pre>

        <h3>detectPII</h3>
        <p>Detect personally identifiable information:</p>
        <pre><code>{`import { detectPII } from '@clarity-chat/react/utils'

const pii = detectPII(text)
if (pii.length > 0) {
  console.warn('PII detected:', pii)
  // pii: [{ type: 'email', value: 'user@example.com', offset: 45 }]
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Error Handling</h2>
        
        <h3>retryWithBackoff</h3>
        <p>Retry failed operations with exponential backoff:</p>
        <pre><code>{`import { retryWithBackoff } from '@clarity-chat/react/utils'

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
)`}</code></pre>

        <h3>timeout</h3>
        <p>Add timeout to promises:</p>
        <pre><code>{`import { timeout } from '@clarity-chat/react/utils'

try {
  const result = await timeout(
    openai.chat.completions.create(...),
    5000  // 5 second timeout
  )
} catch (error) {
  if (error.name === 'TimeoutError') {
    console.error('Request timed out')
  }
}`}</code></pre>

        <h3>gracefulDegradation</h3>
        <p>Fallback to alternatives on failure:</p>
        <pre><code>{`import { gracefulDegradation } from '@clarity-chat/react/utils'

const result = await gracefulDegradation([
  async () => await primaryService(),
  async () => await fallbackService(),
  async () => await cachedResponse()
])

// Returns first successful result`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <Callout type="tip" title="Utility Tips">
          • Cache expensive operations (embeddings, API calls)<br/>
          • Use rate limiting to prevent quota exhaustion<br/>
          • Batch similar requests when possible<br/>
          • Always validate and sanitize user input<br/>
          • Implement retries with backoff for reliability
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/hooks" className="docs-card">
            <h3>Hooks</h3>
            <p>React hooks for common patterns</p>
          </a>
          <a href="/guides/performance" className="docs-card">
            <h3>Performance Guide</h3>
            <p>Optimization techniques</p>
          </a>
          <a href="/guides/token-optimization" className="docs-card">
            <h3>Token Optimization</h3>
            <p>Reduce costs</p>
          </a>
        </div>
      </section>
    </div>
  )
}
