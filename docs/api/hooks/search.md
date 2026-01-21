# Search & RAG Hooks

Powerful hooks for semantic search, vector databases, and Retrieval-Augmented Generation (RAG) pipelines.

## Overview

| Hook | Category | Purpose | Level |
|------|----------|---------|-------|
| [`useRAGPipeline`](#useragpipeline) | RAG | Complete RAG pipeline with vector stores and embeddings | Top |
| [`useSemanticCache`](#usesemanticcache) | Caching | Semantic similarity-based response caching | Top |
| [`useVectorSearch`](#usevectorsearch) | Search | Vector database search with MMR diversity filtering | Mid |
| [`useDeferredSearch`](#usedeferredsearch) | Performance | React 18 concurrent search with fuzzy matching | Mid |
| [`useVectorStore`](#usevectorstore) | Storage | Low-level vector store operations (Pinecone, Qdrant, etc.) | Low |

---

## useRAGPipeline

**Complete RAG pipeline with automatic vector store and embedding management.**

Drop-in ready hook for Retrieval-Augmented Generation that combines vector search, embeddings, and optional reranking into a single, ergonomic API.

### Signature

```typescript
function useRAGPipeline(
  options: UseRAGPipelineOptions
): UseRAGPipelineReturn

interface UseRAGPipelineOptions {
  /** Vector store provider */
  vectorStore: 'pinecone' | 'qdrant' | 'weaviate' | 'chroma'
  /** Embedding provider */
  embeddingProvider: 'openai' | 'cohere' | 'custom'
  /** API keys for services */
  apiKeys?: {
    vectorStore?: string
    embeddings?: string
  }
  /** Optional reranker for result refinement */
  reranker?: 'cohere' | 'jina' | 'voyage'
}

interface UseRAGPipelineReturn {
  /** Retrieve relevant documents */
  retrieve: (query: string, limit?: number) => Promise<any[]>
  /** Rerank retrieved results */
  rerank: (query: string, documents: any[]) => Promise<any[]>
  /** Current context state */
  context: {
    documents: any[]
    query: string
  }
}
```

### Examples

#### Basic RAG with Pinecone + OpenAI

```tsx
import { useRAGPipeline } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

function RAGChat() {
  const rag = useRAGPipeline({
    vectorStore: 'pinecone',
    embeddingProvider: 'openai',
    apiKeys: {
      vectorStore: process.env.PINECONE_API_KEY,
      embeddings: process.env.OPENAI_API_KEY,
    },
  })

  const chat = useClarityChat({
    api: '/api/chat',
    onSubmit: async (messages) => {
      const userMessage = messages[messages.length - 1].content

      // Retrieve relevant context
      const docs = await rag.retrieve(userMessage, 5)

      // Add context to prompt
      const context = docs.map(d => d.content).join('\n\n')

      return {
        messages: [
          {
            role: 'system',
            content: `Answer using the following context:\n\n${context}`,
          },
          ...messages,
        ],
      }
    },
  })

  return (
    <div>
      <ChatMessages messages={chat.messages} />
      <ChatInput onSend={chat.sendMessage} />

      {/* Show retrieved context */}
      {rag.context.documents.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold">Retrieved Context:</h3>
          <ul className="mt-2 space-y-2">
            {rag.context.documents.map((doc, i) => (
              <li key={i} className="text-sm">
                <span className="font-mono text-xs">Score: {doc.score}</span>
                <p className="mt-1">{doc.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

#### RAG with Reranking (Cohere)

```tsx
function RerankedRAG() {
  const rag = useRAGPipeline({
    vectorStore: 'qdrant',
    embeddingProvider: 'cohere',
    reranker: 'cohere', // Enable reranking
    apiKeys: {
      vectorStore: process.env.QDRANT_API_KEY,
      embeddings: process.env.COHERE_API_KEY,
    },
  })

  const handleQuery = async (query: string) => {
    // Step 1: Initial retrieval (get more than needed)
    const candidates = await rag.retrieve(query, 20)

    // Step 2: Rerank to get best matches
    const reranked = await rag.rerank(query, candidates)
    const topResults = reranked.slice(0, 5)

    // Step 3: Use in chat
    const context = topResults.map(d => d.content).join('\n\n')

    return fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'system', content: `Context:\n${context}` },
          { role: 'user', content: query },
        ],
      }),
    })
  }

  return <SearchInterface onSearch={handleQuery} />
}
```

#### Multi-Source RAG (Knowledge Base + Web Search)

```tsx
import { useWebSearch } from '@clarity-chat/react'

function HybridRAG() {
  // Internal knowledge base
  const knowledgeBase = useRAGPipeline({
    vectorStore: 'pinecone',
    embeddingProvider: 'openai',
    apiKeys: {
      vectorStore: process.env.PINECONE_API_KEY,
      embeddings: process.env.OPENAI_API_KEY,
    },
  })

  // External web search
  const webSearch = useWebSearch({
    provider: 'brave',
    apiKey: process.env.BRAVE_API_KEY,
  })

  const chat = useClarityChat({
    api: '/api/chat',
    onSubmit: async (messages) => {
      const query = messages[messages.length - 1].content

      // Search both sources in parallel
      const [kbDocs, webResults] = await Promise.all([
        knowledgeBase.retrieve(query, 3),
        webSearch.search(query, { count: 2 }),
      ])

      const context = [
        '# Knowledge Base:',
        ...kbDocs.map(d => `- ${d.content}`),
        '',
        '# Web Search:',
        ...webResults.map(r => `- ${r.snippet} (${r.url})`),
      ].join('\n')

      return {
        messages: [
          { role: 'system', content: `Answer using:\n${context}` },
          ...messages,
        ],
      }
    },
  })

  return <ClarityChat {...chat} />
}
```

#### Custom Embedding Provider

```tsx
function CustomEmbeddingRAG() {
  const rag = useRAGPipeline({
    vectorStore: 'weaviate',
    embeddingProvider: 'custom', // Use custom embeddings
    apiKeys: {
      vectorStore: process.env.WEAVIATE_API_KEY,
    },
  })

  // Override embedding function with your own
  const customRetrieve = async (query: string) => {
    // Generate custom embeddings
    const embedding = await fetch('/api/embed', {
      method: 'POST',
      body: JSON.stringify({ text: query }),
    }).then(r => r.json())

    // Use with vector store
    return rag.retrieve(embedding, 5)
  }

  return <SearchInterface onSearch={customRetrieve} />
}
```

### When to Use

✅ **Use `useRAGPipeline` when you need:**
- Complete RAG pipeline with minimal configuration
- Drop-in solution for document Q&A
- Automatic embedding and vector search
- Support for multiple vector stores (Pinecone, Qdrant, Weaviate, Chroma)
- Optional reranking for improved results

❌ **Don't use when:**
- You only need simple keyword search → Use `useDeferredSearch`
- You need full control over retrieval logic → Use `useVectorSearch` + `useEmbeddings` separately
- You're building a custom RAG pipeline → Use low-level primitives

---

## useSemanticCache

**Semantic similarity-based response caching for LLM responses.**

Wraps the AdvancedSemanticCache to provide React-friendly semantic caching. Achieves 40-60% cache hit rates for applications with repetitive query patterns by matching semantically similar prompts.

### Signature

```typescript
function useSemanticCache<T = string>(
  config?: UseSemanticCacheConfig
): UseSemanticCacheReturn<T>

interface UseSemanticCacheConfig {
  /** Similarity threshold (0-1, default: 0.85) */
  similarityThreshold?: number
  /** Cache TTL in milliseconds (default: 3600000 = 1 hour) */
  ttlMs?: number
  /** Maximum cache size (default: 1000) */
  maxCacheSize?: number
  /** Embedding model for similarity calculation */
  embeddingModel?: string
}

interface UseSemanticCacheReturn<T> {
  /** Search cache for similar prompt */
  search: (prompt: string) => Promise<{
    entry: { prompt: string; response: T } | null
    similarity: number
    isHit: boolean
    searchTimeMs: number
  }>
  /** Store response in cache */
  set: (
    prompt: string,
    response: T,
    metadata?: { model?: string; tokensSaved?: number }
  ) => Promise<string>
  /** Invalidate cached entry by ID */
  invalidate: (id: string) => Promise<void>
  /** Invalidate by similar prompts */
  invalidateByPrompt: (prompt: string, threshold?: number) => Promise<number>
  /** Pre-warm cache with entries */
  warmCache: (entries: Array<{ prompt: string; response: T }>) => Promise<void>
  /** Export cache contents */
  exportCache: () => Promise<Array<{ prompt: string; response: T }>>
  /** Import cache contents */
  importCache: (
    entries: Array<{
      prompt: string
      response: T
      embedding?: Float32Array
    }>
  ) => Promise<void>
  /** Whether cache is ready */
  isReady: boolean
  /** Whether search is in progress */
  isSearching: boolean
  /** Cache statistics */
  stats: {
    totalEntries: number
    hitRate: number
    totalTokensSaved: number
    totalCostSaved: number
    avgSearchTimeMs: number
  }
  /** Update similarity threshold */
  updateThreshold: (threshold: number) => void
  /** Clear entire cache */
  clearCache: () => Promise<void>
}
```

### Examples

#### Basic Semantic Caching

```tsx
import { useSemanticCache } from '@clarity-chat/react'

function SemanticCachedChat() {
  const cache = useSemanticCache<string>({
    similarityThreshold: 0.92, // High threshold for precision
    ttlMs: 3600000, // 1 hour
  })

  const chat = useClarityChat({
    api: '/api/chat',
    onSubmit: async (messages) => {
      const userMessage = messages[messages.length - 1].content

      // Check semantic cache
      const cached = await cache.search(userMessage)

      if (cached.isHit && cached.entry) {
        console.log(`Cache hit! Similarity: ${cached.similarity.toFixed(2)}`)

        // Return cached response immediately
        return {
          messages: [
            ...messages,
            {
              role: 'assistant',
              content: cached.entry.response,
              metadata: { cached: true, similarity: cached.similarity },
            },
          ],
        }
      }

      // Cache miss - call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages }),
      }).then(r => r.json())

      const assistantMessage = response.messages.find(m => m.role === 'assistant')

      // Store in cache for future queries
      await cache.set(userMessage, assistantMessage.content, {
        model: 'gpt-4o',
        tokensSaved: 1000, // Estimated tokens saved
      })

      return response
    },
  })

  return (
    <div>
      <ClarityChat {...chat} />

      {/* Cache statistics */}
      <div className="mt-4 p-4 border rounded">
        <h3 className="font-semibold">Cache Performance</h3>
        <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <dt>Hit Rate:</dt>
          <dd className="font-mono">{(cache.stats.hitRate * 100).toFixed(1)}%</dd>

          <dt>Total Entries:</dt>
          <dd className="font-mono">{cache.stats.totalEntries}</dd>

          <dt>Status:</dt>
          <dd>
            {!cache.isReady && <span className="text-yellow-600">Initializing...</span>}
            {cache.isReady && <span className="text-green-600">Ready</span>}
          </dd>
        </dl>
      </div>
    </div>
  )
}
```

#### Pre-warming Cache with FAQ

```tsx
function FAQCachedChat() {
  const cache = useSemanticCache()

  useEffect(() => {
    if (cache.isReady) {
      // Pre-warm with common questions
      cache.warmCache([
        {
          prompt: 'What are your business hours?',
          response: 'We are open Monday-Friday, 9 AM - 5 PM EST.',
        },
        {
          prompt: 'How do I reset my password?',
          response: 'Click "Forgot Password" on the login page and follow the email instructions.',
        },
        {
          prompt: 'Do you offer refunds?',
          response: 'Yes, we offer full refunds within 30 days of purchase. Contact support@example.com.',
        },
        {
          prompt: 'How can I contact support?',
          response: 'Email support@example.com or use the live chat (bottom right corner).',
        },
      ])
    }
  }, [cache.isReady])

  return <ClarityChat {...chat} />
}
```

#### Persisting Cache Across Sessions

```tsx
import { useLocalStorage } from '@clarity-chat/react'

function PersistedSemanticCache() {
  const cache = useSemanticCache()
  const [cachedEntries, setCachedEntries] = useLocalStorage('semantic-cache', [])

  // Load cache on mount
  useEffect(() => {
    if (cache.isReady && cachedEntries.length > 0) {
      cache.importCache(cachedEntries)
    }
  }, [cache.isReady])

  // Save cache on unmount
  useEffect(() => {
    return () => {
      cache.exportCache().then(setCachedEntries)
    }
  }, [])

  return <ClarityChat {...chat} />
}
```

#### Adaptive Similarity Threshold

```tsx
function AdaptiveCache() {
  const cache = useSemanticCache({
    similarityThreshold: 0.85, // Start conservative
  })

  useEffect(() => {
    // Adjust threshold based on hit rate
    const interval = setInterval(() => {
      const hitRate = cache.stats.hitRate

      if (hitRate < 0.2) {
        // Hit rate too low - relax threshold
        cache.updateThreshold(0.80)
        console.log('Lowering threshold to increase hits')
      } else if (hitRate > 0.6) {
        // Hit rate high - tighten for precision
        cache.updateThreshold(0.90)
        console.log('Raising threshold for precision')
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  return <ClarityChat {...chat} />
}
```

#### Cache Invalidation on Model Updates

```tsx
function CacheWithInvalidation() {
  const cache = useSemanticCache()
  const [modelVersion, setModelVersion] = useState('v1')

  // Clear cache when model updates
  useEffect(() => {
    const handleModelUpdate = async (newVersion: string) => {
      console.log(`Model updated to ${newVersion}, clearing cache`)
      await cache.clearCache()
      setModelVersion(newVersion)
    }

    window.addEventListener('model-update', (e: CustomEvent) => {
      handleModelUpdate(e.detail.version)
    })
  }, [])

  return <ClarityChat {...chat} />
}
```

### When to Use

✅ **Use `useSemanticCache` when you have:**
- Repetitive query patterns (FAQ, support, documentation)
- High LLM costs that can be reduced through caching
- Questions phrased differently but with same intent ("How do I login?" vs "What's the sign-in process?")
- Need for 40-60% cache hit rates

❌ **Don't use when:**
- Every query is unique (no repetition)
- Responses must be real-time and never cached
- You need exact string matching → Use standard caching (Redis, etc.)

---

## useVectorSearch

**Vector database search with MMR diversity filtering.**

Low-level hook for embedding-based semantic search. Supports optional diversity filtering using Maximal Marginal Relevance (MMR) to reduce redundancy in results.

### Signature

```typescript
function useVectorSearch(
  config: UseVectorSearchConfig
): UseVectorSearchReturn

interface UseVectorSearchConfig {
  /** Embedding function */
  embed: (text: string) => Promise<number[]>
  /** Retriever implementation */
  retriever: Retriever
  /** Number of results to return (default: 5) */
  k?: number
  /** Minimum score threshold (default: 0) */
  minScore?: number
  /** Enable MMR diversity filtering (default: false) */
  enableDiversity?: boolean
  /** Diversity vs relevance tradeoff (0-1, default: 0.7) */
  diversityThreshold?: number
}

interface Retriever {
  query: (embedding: number[], k: number) => Promise<RetrievedChunk[]>
}

interface RetrievedChunk {
  id: string
  text: string
  score: number
  source?: string
  metadata?: Record<string, unknown>
}

interface UseVectorSearchReturn {
  /** Search for relevant chunks */
  search: (query: string) => Promise<RetrievedChunk[]>
  /** Search with full metadata */
  searchWithMetadata: (query: string) => Promise<SearchResult>
  /** Batch search multiple queries */
  batchSearch: (queries: string[]) => Promise<RetrievedChunk[][]>
  /** Whether search is in progress */
  isSearching: boolean
  /** Last search result */
  lastResult: SearchResult | null
  /** Search statistics */
  stats: {
    totalSearches: number
    avgSearchTimeMs: number
    avgResultCount: number
  }
}
```

### Examples

#### Basic Vector Search

```tsx
import { useVectorSearch } from '@clarity-chat/react'
import { OpenAIEmbeddings } from '@clarity-chat/embeddings'
import { PineconeRetriever } from '@clarity-chat/vector-stores'

function VectorSearchExample() {
  const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY })
  const retriever = new PineconeRetriever({ apiKey: process.env.PINECONE_API_KEY })

  const { search, isSearching, stats } = useVectorSearch({
    embed: (text) => embeddings.embed(text),
    retriever,
    k: 5,
    minScore: 0.7, // Only return results with >70% relevance
  })

  const handleSearch = async (query: string) => {
    const chunks = await search(query)

    console.log(`Found ${chunks.length} relevant chunks`)
    chunks.forEach(chunk => {
      console.log(`[${chunk.score.toFixed(2)}] ${chunk.text}`)
    })
  }

  return (
    <div>
      <SearchInput onSearch={handleSearch} disabled={isSearching} />
      <SearchStats {...stats} />
    </div>
  )
}
```

#### Search with MMR Diversity

```tsx
function DiverseVectorSearch() {
  const { search, searchWithMetadata } = useVectorSearch({
    embed: embedQuery,
    retriever: vectorStore,
    k: 10,
    enableDiversity: true, // Enable MMR
    diversityThreshold: 0.7, // Balance relevance (30%) vs diversity (70%)
  })

  const handleSearch = async (query: string) => {
    const result = await searchWithMetadata(query)

    console.log(`Query: ${result.query}`)
    console.log(`Embedding time: ${result.embeddingTimeMs}ms`)
    console.log(`Search time: ${result.searchTimeMs}ms`)
    console.log(`Total time: ${result.totalTimeMs}ms`)

    // Results are diverse (less redundancy)
    result.chunks.forEach((chunk, i) => {
      console.log(`${i + 1}. [${chunk.score.toFixed(2)}] ${chunk.text}`)
    })
  }

  return <SearchInterface onSearch={handleSearch} />
}
```

#### Batch Search for Related Queries

```tsx
function BatchSearchExample() {
  const { batchSearch, isSearching } = useVectorSearch({
    embed: embedQuery,
    retriever: vectorStore,
    k: 3,
  })

  const handleBatchSearch = async () => {
    const queries = [
      'What is React?',
      'How does useState work?',
      'React hooks tutorial',
    ]

    const results = await batchSearch(queries)

    results.forEach((chunks, i) => {
      console.log(`\nQuery: ${queries[i]}`)
      chunks.forEach(chunk => {
        console.log(`  - [${chunk.score.toFixed(2)}] ${chunk.text}`)
      })
    })
  }

  return (
    <button onClick={handleBatchSearch} disabled={isSearching}>
      {isSearching ? 'Searching...' : 'Search All Topics'}
    </button>
  )
}
```

#### Custom Retriever with Filtering

```tsx
class CustomRetriever implements Retriever {
  async query(embedding: number[], k: number): Promise<RetrievedChunk[]> {
    // Custom retrieval logic with metadata filtering
    const response = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({
        embedding,
        k,
        filter: {
          category: 'documentation',
          language: 'en',
          date: { $gte: '2024-01-01' },
        },
      }),
    })

    return response.json()
  }
}

function FilteredVectorSearch() {
  const retriever = new CustomRetriever()

  const { search } = useVectorSearch({
    embed: embedQuery,
    retriever,
    k: 5,
    minScore: 0.75,
  })

  return <SearchInterface onSearch={search} />
}
```

### When to Use

✅ **Use `useVectorSearch` when you need:**
- Fine-grained control over vector search
- Custom retrieval logic with filters
- MMR diversity to reduce redundant results
- Batch searching multiple queries efficiently
- Performance monitoring (timing, stats)

❌ **Don't use when:**
- You need a complete RAG pipeline → Use `useRAGPipeline`
- You're doing simple text search → Use `useDeferredSearch`

---

## useDeferredSearch

**React 18 concurrent search with fuzzy matching and highlighting.**

Performance-optimized search hook using `useDeferredValue` to keep UI responsive during expensive search operations. Includes fuzzy matching, regex support, and match highlighting.

### Signature

```typescript
function useDeferredSearch(
  messages: Message[],
  searchQuery: string,
  options?: DeferredSearchOptions
): DeferredSearchResult

interface DeferredSearchOptions {
  /** Case-sensitive search (default: false) */
  caseSensitive?: boolean
  /** Match whole words only (default: false) */
  wholeWord?: boolean
  /** Use regex matching (default: false) */
  useRegex?: boolean
  /** Minimum query length (default: 1) */
  minQueryLength?: number
  /** Fields to search (default: ['content']) */
  searchFields?: ('content' | 'metadata' | 'role' | 'id')[]
  /** Enable fuzzy matching (default: false) */
  fuzzyMatch?: boolean
  /** Fuzzy threshold 0-1 (default: 0.6) */
  fuzzyThreshold?: number
  /** Maximum results (default: unlimited) */
  maxResults?: number
  /** Debounce delay in ms (default: 0) */
  debounceMs?: number
}

interface DeferredSearchResult {
  /** Filtered messages matching query */
  filteredMessages: Message[]
  /** Whether search is pending (UI responsive during this) */
  isPending: boolean
  /** Original query */
  searchQuery: string
  /** Deferred query being processed */
  deferredQuery: string
  /** Match info for highlighting */
  matchInfo: Map<string, SearchMatch>
  /** Total matches found */
  totalMatches: number
  /** Clear search */
  clearSearch: () => void
}

interface SearchMatch {
  message: Message
  score: number
  matches: {
    field: string
    indices: [number, number][]
  }[]
}
```

### Examples

#### Basic Fuzzy Search

```tsx
import { useDeferredSearch } from '@clarity-chat/react'

function FuzzySearchChat() {
  const [searchQuery, setSearchQuery] = useState('')
  const { messages } = useClarityChat({ api: '/api/chat' })

  const {
    filteredMessages,
    isPending,
    matchInfo,
    totalMatches,
  } = useDeferredSearch(messages, searchQuery, {
    fuzzyMatch: true,
    fuzzyThreshold: 0.7,
    searchFields: ['content', 'metadata'],
    maxResults: 50,
    debounceMs: 300, // Debounce user input
  })

  return (
    <div>
      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search messages..."
      />

      {isPending && (
        <div className="text-sm text-gray-500">
          Searching... (UI remains responsive)
        </div>
      )}

      <div className="mt-2 text-sm text-gray-600">
        Found {totalMatches} matches
      </div>

      <div className="mt-4 space-y-2">
        {filteredMessages.map(msg => {
          const match = matchInfo.get(msg.id)

          return (
            <div key={msg.id} className="p-4 border rounded">
              <div className="text-xs text-gray-500 mb-2">
                Score: {match?.score.toFixed(2)}
              </div>

              {/* Highlight matches */}
              <HighlightedMessage
                message={msg}
                matches={match?.matches}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

#### Regex Search with Highlighting

```tsx
import { useDeferredSearch, highlightText } from '@clarity-chat/react'

function RegexSearchChat() {
  const [searchQuery, setSearchQuery] = useState('')
  const { messages } = useClarityChat({ api: '/api/chat' })

  const { filteredMessages, matchInfo, isPending } = useDeferredSearch(
    messages,
    searchQuery,
    {
      useRegex: true,
      caseSensitive: false,
    }
  )

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Regex search (e.g., \d{3}-\d{4})"
        className="w-full p-2 border rounded"
      />

      {filteredMessages.map(msg => {
        const match = matchInfo.get(msg.id)
        const contentMatch = match?.matches.find(m => m.field === 'content')

        return (
          <div key={msg.id}>
            {contentMatch ? (
              <div>
                {highlightText(
                  msg.content,
                  contentMatch.indices,
                  (text, isHighlight, index) => isHighlight ? (
                    <mark key={index} className="bg-yellow-200">{text}</mark>
                  ) : (
                    <span key={index}>{text}</span>
                  )
                )}
              </div>
            ) : (
              <div>{msg.content}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

#### Advanced Search with Multiple Fields

```tsx
function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMode, setSearchMode] = useState<'fuzzy' | 'exact' | 'regex'>('fuzzy')
  const { messages } = useClarityChat({ api: '/api/chat' })

  const searchOptions = {
    fuzzy: {
      fuzzyMatch: true,
      fuzzyThreshold: 0.6,
      searchFields: ['content', 'metadata', 'role'] as const,
    },
    exact: {
      fuzzyMatch: false,
      wholeWord: true,
      searchFields: ['content'] as const,
    },
    regex: {
      useRegex: true,
      searchFields: ['content', 'metadata'] as const,
    },
  }

  const { filteredMessages, isPending, totalMatches } = useDeferredSearch(
    messages,
    searchQuery,
    {
      ...searchOptions[searchMode],
      debounceMs: 300,
      maxResults: 100,
    }
  )

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="flex-1 p-2 border rounded"
        />

        <select
          value={searchMode}
          onChange={(e) => setSearchMode(e.target.value as any)}
          className="p-2 border rounded"
        >
          <option value="fuzzy">Fuzzy</option>
          <option value="exact">Exact</option>
          <option value="regex">Regex</option>
        </select>
      </div>

      {isPending && <SearchingSpinner />}

      <div className="text-sm text-gray-600 mb-2">
        {totalMatches} results (mode: {searchMode})
      </div>

      <MessageList messages={filteredMessages} />
    </div>
  )
}
```

#### Search with Highlighting Component

```tsx
import { HighlightedText } from '@clarity-chat/react'

function HighlightedSearchResults() {
  const [searchQuery, setSearchQuery] = useState('')
  const { messages } = useClarityChat({ api: '/api/chat' })

  const { filteredMessages } = useDeferredSearch(messages, searchQuery, {
    fuzzyMatch: true,
    debounceMs: 200,
  })

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search messages..."
      />

      {filteredMessages.map(msg => (
        <div key={msg.id} className="p-4 border rounded mb-2">
          <HighlightedText
            text={msg.content}
            query={searchQuery}
            className="text-gray-900"
            highlightClassName="bg-yellow-200 dark:bg-yellow-900/50"
          />
        </div>
      ))}
    </div>
  )
}
```

### When to Use

✅ **Use `useDeferredSearch` when you need:**
- Fast, responsive UI during expensive searches
- Fuzzy matching for typo tolerance ("Reatc" → "React")
- Regex search for patterns (phone numbers, emails, etc.)
- Match highlighting for search results
- Multi-field search (content, metadata, role, id)

❌ **Don't use when:**
- You need semantic search → Use `useVectorSearch` or `useRAGPipeline`
- Simple array filtering is sufficient → Use `messages.filter()`

---

## useVectorStore

**Low-level vector store operations.**

Direct access to vector database operations (search, upsert, delete) for Pinecone, Qdrant, Weaviate, and Chroma.

### Signature

```typescript
function useVectorStore(
  config: VectorStoreConfig
): UseVectorStoreReturn

interface VectorStoreConfig {
  /** Vector store provider */
  provider: 'pinecone' | 'qdrant' | 'weaviate' | 'chroma'
  /** API configuration */
  config?: {
    apiKey?: string
    indexName?: string
    [key: string]: unknown
  }
}

interface UseVectorStoreReturn {
  /** Search for vectors */
  search: (
    query: string | number[],
    options?: VectorSearchOptions
  ) => Promise<VectorStoreResult[]>
  /** Insert or update documents */
  upsert: (
    documents: Array<{
      id: string
      content: string
      metadata?: Record<string, unknown>
    }>
  ) => Promise<void>
  /** Delete documents by ID */
  delete: (ids: string[]) => Promise<void>
  /** Whether vector store is ready */
  isReady: boolean
  /** Connection error if any */
  error: Error | null
}
```

### Examples

#### Basic Vector Store Operations

```tsx
import { useVectorStore } from '@clarity-chat/react'

function VectorStoreManager() {
  const store = useVectorStore({
    provider: 'pinecone',
    config: {
      apiKey: process.env.PINECONE_API_KEY,
      indexName: 'my-knowledge-base',
    },
  })

  const handleUpsert = async () => {
    await store.upsert([
      {
        id: 'doc1',
        content: 'React is a JavaScript library for building user interfaces.',
        metadata: { category: 'framework', language: 'javascript' },
      },
      {
        id: 'doc2',
        content: 'Vue.js is a progressive framework for building web applications.',
        metadata: { category: 'framework', language: 'javascript' },
      },
    ])

    console.log('Documents upserted successfully')
  }

  const handleSearch = async (query: string) => {
    const results = await store.search(query, { topK: 5 })

    results.forEach(result => {
      console.log(`[${result.score.toFixed(2)}] ${result.content}`)
      console.log('Metadata:', result.metadata)
    })
  }

  const handleDelete = async (ids: string[]) => {
    await store.delete(ids)
    console.log(`Deleted ${ids.length} documents`)
  }

  if (!store.isReady) {
    return <div>Initializing vector store...</div>
  }

  if (store.error) {
    return <div>Error: {store.error.message}</div>
  }

  return (
    <div>
      <button onClick={handleUpsert}>Upsert Documents</button>
      <button onClick={() => handleSearch('JavaScript frameworks')}>
        Search
      </button>
      <button onClick={() => handleDelete(['doc1', 'doc2'])}>
        Delete Documents
      </button>
    </div>
  )
}
```

#### Document Uploader with Progress

```tsx
function DocumentUploader() {
  const store = useVectorStore({
    provider: 'qdrant',
    config: {
      apiKey: process.env.QDRANT_API_KEY,
      indexName: 'documents',
    },
  })

  const [progress, setProgress] = useState(0)

  const handleFileUpload = async (file: File) => {
    const text = await file.text()

    // Split into chunks
    const chunks = text.match(/.{1,500}/g) || []

    // Batch upsert
    const batchSize = 100
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize).map((chunk, idx) => ({
        id: `${file.name}-${i + idx}`,
        content: chunk,
        metadata: {
          filename: file.name,
          chunkIndex: i + idx,
        },
      }))

      await store.upsert(batch)
      setProgress(Math.min(100, ((i + batchSize) / chunks.length) * 100))
    }

    console.log(`Uploaded ${chunks.length} chunks from ${file.name}`)
  }

  return (
    <div>
      <input
        type="file"
        accept=".txt,.md"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileUpload(file)
        }}
      />

      {progress > 0 && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded">
            <div
              className="bg-blue-500 h-2 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {progress.toFixed(0)}% uploaded
          </div>
        </div>
      )}
    </div>
  )
}
```

### When to Use

✅ **Use `useVectorStore` when you need:**
- Direct control over vector database operations
- Custom upsert/delete workflows
- Building custom RAG pipelines
- Document management and indexing

❌ **Don't use when:**
- You need a complete RAG solution → Use `useRAGPipeline`
- You only need search → Use `useVectorSearch`

---

## Common Patterns

### Complete RAG Stack

Combine all search hooks for a production RAG system:

```tsx
import {
  useRAGPipeline,
  useSemanticCache,
  useContextMonitor,
  useClarityChat,
} from '@clarity-chat/react'

function ProductionRAGChat() {
  // 1. Semantic cache for repeated queries
  const cache = useSemanticCache({
    similarityThreshold: 0.92,
    ttlMs: 3600000, // 1 hour
  })

  // 2. RAG pipeline
  const rag = useRAGPipeline({
    vectorStore: 'pinecone',
    embeddingProvider: 'openai',
    reranker: 'cohere',
    apiKeys: {
      vectorStore: process.env.PINECONE_API_KEY,
      embeddings: process.env.OPENAI_API_KEY,
    },
  })

  // 3. Context monitoring
  const contextMonitor = useContextMonitor({
    maxTokens: 128000,
    warningThreshold: 0.8,
  })

  // 4. Chat integration
  const chat = useClarityChat({
    api: '/api/chat',
    onSubmit: async (messages) => {
      const userMessage = messages[messages.length - 1].content

      // Check cache first
      const cached = await cache.search(userMessage)
      if (cached.isHit && cached.entry) {
        return {
          messages: [
            ...messages,
            {
              role: 'assistant',
              content: cached.entry.response,
              metadata: { cached: true },
            },
          ],
        }
      }

      // Retrieve context
      const docs = await rag.retrieve(userMessage, 20)
      const reranked = await rag.rerank(userMessage, docs)
      const topDocs = reranked.slice(0, 5)

      const context = topDocs.map(d => d.content).join('\n\n')

      // Monitor context usage
      const contextMessages = [
        { role: 'system', content: `Context:\n${context}` },
        ...messages,
      ]
      contextMonitor.analyzeMessages(contextMessages)

      if (contextMonitor.isCritical) {
        console.warn('Context window critical - compressing context')
        // Implement compression or summarization
      }

      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: contextMessages }),
      }).then(r => r.json())

      // Cache response
      const assistantMessage = response.messages.find(m => m.role === 'assistant')
      await cache.set(userMessage, assistantMessage.content)

      return response
    },
  })

  return (
    <div className="grid grid-cols-[1fr_300px] gap-4">
      {/* Main chat */}
      <ClarityChat {...chat} />

      {/* Sidebar with stats */}
      <div className="space-y-4">
        {/* Cache stats */}
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Cache</h3>
          <div className="text-sm space-y-1">
            <div>Hit rate: {(cache.stats.hitRate * 100).toFixed(1)}%</div>
            <div>Entries: {cache.stats.totalEntries}</div>
          </div>
        </div>

        {/* Context stats */}
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Context</h3>
          <div className="text-sm space-y-1">
            <div>Usage: {(contextMonitor.utilization * 100).toFixed(1)}%</div>
            <div>
              Status:{' '}
              {contextMonitor.isCritical ? (
                <span className="text-red-600">Critical</span>
              ) : contextMonitor.isWarning ? (
                <span className="text-yellow-600">Warning</span>
              ) : (
                <span className="text-green-600">OK</span>
              )}
            </div>
          </div>
        </div>

        {/* RAG context */}
        {rag.context.documents.length > 0 && (
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Retrieved Docs</h3>
            <div className="text-xs space-y-2">
              {rag.context.documents.map((doc, i) => (
                <div key={i} className="border-l-2 border-blue-500 pl-2">
                  <div className="font-mono text-gray-500">
                    Score: {doc.score.toFixed(2)}
                  </div>
                  <div className="mt-1 text-gray-700 line-clamp-2">
                    {doc.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

### Hybrid Search (Keyword + Semantic)

Combine keyword and vector search for best results:

```tsx
function HybridSearch() {
  const { messages } = useClarityChat({ api: '/api/chat' })
  const [searchQuery, setSearchQuery] = useState('')

  // Keyword search (fast)
  const keywordSearch = useDeferredSearch(messages, searchQuery, {
    fuzzyMatch: true,
    maxResults: 20,
  })

  // Semantic search (slow but accurate)
  const semanticSearch = useVectorSearch({
    embed: embedQuery,
    retriever: vectorStore,
    k: 20,
  })

  const [hybridResults, setHybridResults] = useState<Message[]>([])

  useEffect(() => {
    const performHybridSearch = async () => {
      if (!searchQuery) {
        setHybridResults(messages)
        return
      }

      // Run both searches in parallel
      const [keywordResults, semanticChunks] = await Promise.all([
        Promise.resolve(keywordSearch.filteredMessages),
        semanticSearch.search(searchQuery),
      ])

      // Merge results (simple union - can be improved with score fusion)
      const keywordIds = new Set(keywordResults.map(m => m.id))
      const semanticIds = new Set(
        semanticChunks.map(c => c.metadata?.messageId as string)
      )

      const allIds = new Set([...keywordIds, ...semanticIds])
      const merged = messages.filter(m => allIds.has(m.id))

      setHybridResults(merged)
    }

    performHybridSearch()
  }, [searchQuery, keywordSearch.filteredMessages])

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Hybrid search (keyword + semantic)"
      />

      <div className="text-sm text-gray-600 mt-2">
        Keyword: {keywordSearch.totalMatches} | Hybrid: {hybridResults.length}
      </div>

      <MessageList messages={hybridResults} />
    </div>
  )
}
```

---

## Troubleshooting

### Semantic Cache Low Hit Rate

**Problem:** Cache hit rate is below 20%

**Solutions:**
```tsx
// 1. Lower similarity threshold
const cache = useSemanticCache({
  similarityThreshold: 0.80, // Lower from 0.85
})

// 2. Pre-warm with common queries
useEffect(() => {
  if (cache.isReady) {
    cache.warmCache(commonQuestions)
  }
}, [cache.isReady])

// 3. Check embedding model quality
const cache = useSemanticCache({
  embeddingModel: 'text-embedding-3-large', // Better model
})
```

### Vector Search Returns No Results

**Problem:** `search()` returns empty array

**Solutions:**
```tsx
// 1. Lower minScore threshold
const { search } = useVectorSearch({
  embed,
  retriever,
  minScore: 0.5, // Lower from 0.7
})

// 2. Increase k (results to retrieve)
const { search } = useVectorSearch({
  embed,
  retriever,
  k: 20, // Higher from 5
})

// 3. Check embedding function
const testEmbedding = await embed('test query')
console.log('Embedding dimensions:', testEmbedding.length)
// Should match your vector store dimensions (e.g., 1536 for OpenAI)
```

### Deferred Search Performance Issues

**Problem:** Search feels slow despite `useDeferredValue`

**Solutions:**
```tsx
// 1. Add debounce
const { filteredMessages } = useDeferredSearch(messages, searchQuery, {
  debounceMs: 300, // Wait 300ms before searching
})

// 2. Limit results
const { filteredMessages } = useDeferredSearch(messages, searchQuery, {
  maxResults: 50, // Stop after 50 matches
})

// 3. Disable expensive features
const { filteredMessages } = useDeferredSearch(messages, searchQuery, {
  fuzzyMatch: false, // Disable fuzzy matching
  useRegex: false, // Disable regex
  searchFields: ['content'], // Search fewer fields
})
```

### RAG Pipeline Initialization Errors

**Problem:** `useRAGPipeline` throws validation error

**Solutions:**
```tsx
// 1. Check API keys are set
const rag = useRAGPipeline({
  vectorStore: 'pinecone',
  embeddingProvider: 'openai',
  apiKeys: {
    vectorStore: process.env.PINECONE_API_KEY, // Must be set
    embeddings: process.env.OPENAI_API_KEY, // Must be set
  },
})

// 2. Verify provider names are correct
const rag = useRAGPipeline({
  vectorStore: 'pinecone', // Not 'Pinecone' (lowercase)
  embeddingProvider: 'openai', // Not 'OpenAI'
})

// 3. Check development mode warnings
if (process.env.NODE_ENV === 'development') {
  console.log('RAG initialized:', rag)
}
```

---

## Related Hooks

### Embedding Hooks
- `useEmbeddings` - Generate embeddings for text (used by RAG and vector search)

### Memory Hooks
- [`useMemoryStore`](./memory.md#usememorystore) - Store conversation memories for context
- [`useContextMonitor`](./memory.md#usecontextmonitor) - Monitor token usage in RAG contexts

### Performance Hooks
- `useDebounce` - Debounce search input
- `useThrottle` - Throttle search requests

### Storage Hooks
- `useIndexedDB` - Store large datasets in browser
- `useLocalStorage` - Persist search preferences
