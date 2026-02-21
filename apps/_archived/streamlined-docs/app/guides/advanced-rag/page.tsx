'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ScrollReveal,
  KineticText,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from '@/components/Enhanced/ScrollReveal'
import { EnhancedCopyButton } from '@/components/Enhanced/EnhancedCopyButton'
import { CollapsibleSection } from '@/components/CollapsibleSection/CollapsibleSection'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import {
  DollarSign,
  TrendingDown,
  Zap,
  Database,
  Search,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lightbulb,
  ArrowRight,
  ChevronRight,
  Layers,
  RefreshCw,
  Shield,
  Target,
  FileCode,
  Cpu,
  Filter,
  GitBranch,
  Hash,
  Box,
  Percent,
} from 'lucide-react'
import Link from 'next/link'

// RAG cost comparison data
const ragCostComparison = [
  {
    scenario: 'Standard RAG',
    tokensPerQuery: '8,000',
    costPer1kQueries: '$160',
    approach: 'Full document chunks',
  },
  {
    scenario: 'Compressed RAG',
    tokensPerQuery: '2,400',
    costPer1kQueries: '$48',
    approach: 'Token-optimized chunks',
  },
  {
    scenario: 'Cached RAG',
    tokensPerQuery: '800',
    costPer1kQueries: '$16',
    approach: 'Provider caching + compression',
  },
  {
    scenario: 'Optimized RAG',
    tokensPerQuery: '600',
    costPer1kQueries: '$12',
    approach: 'All strategies combined',
  },
]

// Savings examples
const ragSavingsExamples = [
  {
    scenario: 'Knowledge Base Search',
    before: '$3,200/mo',
    after: '$960/mo',
    savings: '70%',
    techniques: ['Smart Chunking', 'Reranking', 'Provider Caching'],
    breakdown: [
      { strategy: 'Provider caching (document chunks)', savings: '45%' },
      { strategy: 'Compression (2-5x)', savings: '20%' },
      { strategy: 'Reranking (reduce context)', savings: '5%' },
    ],
    note: 'Knowledge base queries benefit massively from caching frequently accessed chunks.',
  },
  {
    scenario: 'Document Q&A System',
    before: '$5,800/mo',
    after: '$1,740/mo',
    savings: '70%',
    techniques: ['Hybrid Search', 'Context Compression', 'Embedding Cache'],
    breakdown: [
      { strategy: 'Embedding cache (90% hit rate)', savings: '40%' },
      { strategy: 'Smart chunking (optimal sizes)', savings: '20%' },
      { strategy: 'Hybrid search (precision)', savings: '10%' },
    ],
    note: 'Document analysis with cached embeddings and compressed chunks achieves 70% savings.',
  },
  {
    scenario: 'Code Assistant with RAG',
    before: '$9,600/mo',
    after: '$2,400/mo',
    savings: '75%',
    techniques: ['Semantic Chunking', 'Provider Caching', 'Query Optimization'],
    breakdown: [
      { strategy: 'Provider caching (codebase chunks)', savings: '50%' },
      { strategy: 'Semantic chunking (boundaries)', savings: '15%' },
      { strategy: 'Query optimization', savings: '10%' },
    ],
    note: 'Code-heavy RAG benefits from caching large codebase chunks and semantic boundaries.',
  },
]

// Code examples
const codeExamples = {
  basicRag: `import { createRAGPipeline } from '@clarity-chat/token-optimization'
import { OpenAIEmbeddings } from '@langchain/openai'
import { Pinecone } from '@pinecone-database/pinecone'

// Basic RAG setup with token optimization
const rag = createRAGPipeline({
  // Vector store configuration
  vectorStore: {
    provider: 'pinecone',
    index: 'documents',
    namespace: 'knowledge-base',
  },

  // Embeddings with caching
  embeddings: new OpenAIEmbeddings({
    model: 'text-embedding-3-small',
    cache: true, // Cache embeddings for repeated queries
  }),

  // Token optimization settings
  optimization: {
    chunkSize: 512,          // Optimal for most use cases
    chunkOverlap: 50,        // Balance context and efficiency
    compression: true,        // Compress retrieved chunks
    providerCaching: true,   // Enable Anthropic/OpenAI caching
    maxTokens: 4000,         // Budget per query
  },

  // Retrieval settings
  retrieval: {
    topK: 5,                 // Initial retrieval count
    rerank: true,            // Rerank for relevance
    finalK: 3,               // Final chunks to use
    minSimilarity: 0.7,      // Relevance threshold
  },
})

// Query with automatic optimization
const result = await rag.query({
  query: "How do I implement authentication?",
  model: 'claude-3-5-sonnet',
})

console.log('Answer:', result.answer)
console.log('Sources:', result.sources)
console.log('Tokens used:', result.tokensUsed)
console.log('Tokens saved:', result.tokensSaved)
console.log('Cost saved:', result.costSaved)`,

  hybridSearch: `import { HybridSearchRetriever } from '@clarity-chat/token-optimization'

// Combine semantic (vector) and keyword (BM25) search
const retriever = new HybridSearchRetriever({
  vectorStore: pineconeStore,
  bm25Store: elasticsearchStore,

  // Hybrid search weights
  weights: {
    semantic: 0.7,  // 70% weight to vector similarity
    keyword: 0.3,   // 30% weight to BM25 scoring
  },

  // Token optimization
  optimization: {
    compressChunks: true,
    targetTokensPerChunk: 400,
    preserveKeyPhrases: true,
  },

  // Advanced reranking
  reranking: {
    enabled: true,
    model: 'cross-encoder/ms-marco-MiniLM-L-6-v2',
    topK: 3,  // Rerank top 3 from initial 10
  },
})

// Retrieve optimized chunks
const chunks = await retriever.retrieve({
  query: "What is the pricing model?",
  initialK: 10,  // Broad initial search
  finalK: 3,     // Narrow to best matches
})

console.log(\`Retrieved \${chunks.length} chunks\`)
console.log(\`Total tokens: \${chunks.reduce((sum, c) => sum + c.tokens, 0)}\`)
console.log(\`Relevance scores: \${chunks.map(c => c.score.toFixed(2)).join(', ')}\`)`,

  smartChunking: `import {
  SemanticChunker,
  RecursiveChunker,
  MarkdownChunker,
  ChunkingStrategy,
} from '@clarity-chat/token-optimization'

// Semantic chunking - splits on meaning boundaries
const semanticChunker = new SemanticChunker({
  model: 'text-embedding-3-small',
  maxChunkSize: 512,
  similarityThreshold: 0.8,  // Higher = more coherent chunks
  preserveStructure: true,    // Keep paragraphs intact
})

const semanticChunks = await semanticChunker.chunk(document)
console.log(\`Created \${semanticChunks.length} semantic chunks\`)

// Recursive chunking - hierarchical splitting
const recursiveChunker = new RecursiveChunker({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\\n\\n', '\\n', '. ', ' '],  // Try in order
  keepSeparator: true,
})

const recursiveChunks = recursiveChunker.chunk(document)

// Markdown-aware chunking - respects headers
const markdownChunker = new MarkdownChunker({
  chunkSize: 800,
  respectHeaders: true,     // Don't split across headers
  includeHeaders: true,     // Prepend headers to chunks
  maxHeaderDepth: 3,        // H1-H3 only
})

const mdChunks = markdownChunker.chunk(markdownDoc)

// Compare strategies
console.log('Chunking Strategy Comparison:')
console.log(\`- Semantic: \${semanticChunks.length} chunks (avg \${avgTokens(semanticChunks)} tokens)\`)
console.log(\`- Recursive: \${recursiveChunks.length} chunks (avg \${avgTokens(recursiveChunks)} tokens)\`)
console.log(\`- Markdown: \${mdChunks.length} chunks (avg \${avgTokens(mdChunks)} tokens)\`)`,

  embeddingCache: `import {
  CachedEmbeddings,
  EmbeddingCache,
  estimateEmbeddingCost,
} from '@clarity-chat/token-optimization'

// Create cached embeddings wrapper
const cache = new EmbeddingCache({
  ttl: 3600,              // 1 hour cache
  maxSize: 10000,         // Cache up to 10k embeddings
  persistToDisk: true,    // Survive restarts
  cachePath: './.cache/embeddings',
})

const embeddings = new CachedEmbeddings({
  baseEmbeddings: new OpenAIEmbeddings({
    model: 'text-embedding-3-small',
  }),
  cache,
})

// First call - generates embedding
const embedding1 = await embeddings.embedQuery("How to optimize tokens?")
console.log('Cache miss - generated embedding')

// Second call - returns from cache (instant + free!)
const embedding2 = await embeddings.embedQuery("How to optimize tokens?")
console.log('Cache hit - returned from cache')

// Get cache statistics
const stats = cache.getStats()
console.log(\`Cache hit rate: \${stats.hitRate.toFixed(1)}%\`)
console.log(\`Embeddings cached: \${stats.size}\`)
console.log(\`Cost saved: $\${stats.costSaved.toFixed(4)}\`)

// Estimate costs with/without caching
const cost = estimateEmbeddingCost({
  totalQueries: 10000,
  cacheHitRate: 0.85,  // 85% cache hits
  model: 'text-embedding-3-small',
})

console.log(\`Without cache: $\${cost.withoutCache.toFixed(2)}\`)
console.log(\`With cache: $\${cost.withCache.toFixed(2)}\`)
console.log(\`Savings: $\${cost.savings.toFixed(2)} (\${cost.savingsPercent.toFixed(0)}%)\`)`,

  contextCompression: `import {
  compressRAGContext,
  LLMChainExtractor,
  EmbeddingsFilter,
  ContextualCompressionRetriever,
} from '@clarity-chat/token-optimization'

// Method 1: Simple compression with target ratio
const simpleCompressed = await compressRAGContext({
  chunks: retrievedChunks,
  query: userQuery,
  targetRatio: 0.5,  // Compress to 50% of original
  preserveRelevance: true,
})

console.log(\`Compressed from \${simpleCompressed.originalTokens} to \${simpleCompressed.compressedTokens} tokens\`)

// Method 2: LLM-based extraction (highest quality)
const llmExtractor = new LLMChainExtractor({
  model: 'gpt-4o-mini',  // Cheap model for extraction
  maxTokensPerChunk: 300,
  preserveQuotes: true,
})

const extracted = await llmExtractor.compress({
  documents: retrievedChunks,
  query: userQuery,
})

// Method 3: Embeddings filter (fast, no LLM calls)
const embeddingsFilter = new EmbeddingsFilter({
  embeddings: new OpenAIEmbeddings(),
  similarityThreshold: 0.76,
  topK: 3,
})

const filtered = await embeddingsFilter.compress({
  documents: retrievedChunks,
  query: userQuery,
})

// Method 4: Contextual compression retriever (all-in-one)
const compressor = new ContextualCompressionRetriever({
  baseRetriever: vectorStoreRetriever,
  baseCompressor: llmExtractor,
  fallbackCompressor: embeddingsFilter,  // Fallback if LLM fails
})

const compressedDocs = await compressor.getRelevantDocuments(userQuery)
console.log(\`Retrieved and compressed: \${compressedDocs.length} documents\`)`,

  reranking: `import {
  CrossEncoderReranker,
  ColBERTReranker,
  LLMReranker,
  ChainReranker,
} from '@clarity-chat/token-optimization'

// Cross-encoder reranking (most accurate)
const crossEncoder = new CrossEncoderReranker({
  model: 'cross-encoder/ms-marco-MiniLM-L-6-v2',
  topK: 3,  // Return top 3 after reranking
  batchSize: 32,
})

const reranked = await crossEncoder.rerank({
  query: userQuery,
  documents: initialResults,  // Top 20 from vector search
})

console.log('Reranked scores:', reranked.map(d => d.score.toFixed(3)))

// ColBERT reranking (faster, still accurate)
const colbert = new ColBERTReranker({
  model: 'colbert-ir/colbertv2.0',
  maxTokensPerDoc: 500,
})

const colbertReranked = await colbert.rerank({
  query: userQuery,
  documents: initialResults,
})

// LLM-based reranking (most expensive, highest quality)
const llmReranker = new LLMReranker({
  model: 'gpt-4o-mini',
  criteria: 'relevance to user query',
  returnScores: true,
})

const llmReranked = await llmReranker.rerank({
  query: userQuery,
  documents: initialResults,
})

// Chain multiple rerankers (fast → slow)
const chain = new ChainReranker({
  rerankers: [
    { reranker: embeddingsFilter, topK: 10 },  // Fast first pass
    { reranker: crossEncoder, topK: 5 },       // Accurate second pass
    { reranker: llmReranker, topK: 3 },        // Final LLM pass
  ],
})

const bestResults = await chain.rerank({
  query: userQuery,
  documents: initialResults,  // Start with 50 docs
})

console.log(\`Narrowed from 50 → 10 → 5 → 3 documents\`)
console.log(\`Final results: \${bestResults.length}\`)`,

  queryOptimization: `import {
  QueryOptimizer,
  MultiQueryRetriever,
  StepBackRetriever,
  HyDERetriever,
} from '@clarity-chat/token-optimization'

// Query expansion - generate multiple search queries
const multiQuery = new MultiQueryRetriever({
  retriever: baseRetriever,
  llm: 'gpt-4o-mini',
  numQueries: 3,  // Generate 3 variations
  deduplicate: true,
})

const expanded = await multiQuery.getRelevantDocuments(
  "How to reduce costs?"
)
// Internally searches:
// 1. "How to reduce costs?"
// 2. "What are cost-saving strategies?"
// 3. "Ways to optimize spending?"

// Step-back prompting - abstract to principles
const stepBack = new StepBackRetriever({
  retriever: baseRetriever,
  llm: 'gpt-4o-mini',
})

const abstract = await stepBack.getRelevantDocuments(
  "How to fix error X?"
)
// Internally:
// 1. Step back: "What are common debugging approaches?"
// 2. Retrieve on abstraction
// 3. Retrieve on original query
// 4. Combine results

// HyDE - Hypothetical Document Embeddings
const hyde = new HyDERetriever({
  retriever: baseRetriever,
  llm: 'gpt-4o-mini',
  numHypotheticals: 2,
})

const hypothetical = await hyde.getRelevantDocuments(
  "What is token optimization?"
)
// Internally:
// 1. Generate hypothetical answer
// 2. Embed hypothetical answer
// 3. Search using hypothetical embedding
// 4. Return actual documents

// Combined optimizer
const optimizer = new QueryOptimizer({
  strategies: ['multi-query', 'step-back', 'hyde'],
  baseRetriever,
  llm: 'gpt-4o-mini',
  maxTokensPerStrategy: 2000,
})

const optimized = await optimizer.retrieve({
  query: userQuery,
  topK: 5,
})

console.log(\`Retrieved \${optimized.length} optimized results\`)
console.log(\`Total tokens: \${optimized.reduce((sum, d) => sum + d.tokens, 0)}\`)`,

  productionPipeline: `import {
  createOptimizedRAGPipeline,
  RAGMetrics,
  RAGMonitor,
} from '@clarity-chat/token-optimization'
import { Pinecone } from '@pinecone-database/pinecone'

// Production RAG with full optimization
const rag = await createOptimizedRAGPipeline({
  // Vector store
  vectorStore: {
    provider: 'pinecone',
    client: new Pinecone({ apiKey: process.env.PINECONE_API_KEY }),
    index: 'production-docs',
    namespace: 'v1',
  },

  // Embeddings with caching
  embeddings: {
    model: 'text-embedding-3-small',
    cache: {
      enabled: true,
      ttl: 3600,
      persistToDisk: true,
    },
  },

  // Chunking strategy
  chunking: {
    strategy: 'semantic',  // or 'recursive', 'markdown'
    chunkSize: 512,
    chunkOverlap: 50,
    respectBoundaries: true,
  },

  // Retrieval configuration
  retrieval: {
    // Initial search
    searchType: 'hybrid',  // Combine semantic + keyword
    initialK: 20,

    // Reranking
    reranking: {
      enabled: true,
      model: 'cross-encoder/ms-marco-MiniLM-L-6-v2',
      topK: 5,
    },

    // Compression
    compression: {
      enabled: true,
      method: 'llm-extraction',  // or 'embeddings-filter'
      targetRatio: 0.6,
      preserveRelevance: true,
    },

    // Final selection
    finalK: 3,
    minSimilarity: 0.7,
  },

  // Token optimization
  optimization: {
    // Provider caching
    providerCaching: {
      enabled: true,
      provider: 'anthropic',  // or 'openai', 'google'
      minTokens: 1024,
    },

    // Budget management
    maxTokensPerQuery: 4000,
    autoTrim: true,
    warningThreshold: 0.8,

    // Cost tracking
    trackCosts: true,
    costModel: 'claude-3-5-sonnet',
  },

  // Monitoring
  monitoring: {
    enabled: true,
    logQueries: true,
    trackMetrics: true,
  },
})

// Query with full optimization
const result = await rag.query({
  query: "How do I implement authentication with JWT?",
  model: 'claude-3-5-sonnet',
  stream: true,
  onChunk: (chunk) => console.log(chunk),
})

// Get detailed metrics
const metrics = result.metrics
console.log('RAG Metrics:', {
  tokensUsed: metrics.tokensUsed,
  tokensSaved: metrics.tokensSaved,
  savingsPercent: metrics.savingsPercent,
  costSaved: metrics.costSaved,
  retrievalTime: metrics.retrievalTime,
  compressionRatio: metrics.compressionRatio,
  chunksRetrieved: metrics.chunksRetrieved,
  chunksUsed: metrics.chunksUsed,
  averageRelevance: metrics.averageRelevance,
})

// Monitor performance over time
const monitor = new RAGMonitor({
  rag,
  alertThresholds: {
    costPerQuery: 0.05,        // Alert if >$0.05 per query
    tokensPerQuery: 5000,      // Alert if >5k tokens
    retrievalTime: 2000,       // Alert if >2s
    relevanceScore: 0.6,       // Alert if <0.6 relevance
  },
})

monitor.on('threshold-exceeded', (event) => {
  console.warn('Threshold exceeded:', event)
})

// Get aggregate statistics
const stats = monitor.getStats()
console.log('Pipeline Statistics:', {
  totalQueries: stats.totalQueries,
  avgTokensPerQuery: stats.avgTokensPerQuery,
  avgCostPerQuery: stats.avgCostPerQuery,
  avgRetrievalTime: stats.avgRetrievalTime,
  cacheHitRate: stats.cacheHitRate,
  totalCostSaved: stats.totalCostSaved,
})`,

  costAnalysis: `import {
  analyzeRAGCosts,
  compareRAGStrategies,
  optimizeRAGBudget,
  RAGCostTracker,
} from '@clarity-chat/token-optimization'

// Analyze current RAG costs
const analysis = await analyzeRAGCosts({
  queries: last30DaysQueries,
  model: 'claude-3-5-sonnet',
  breakdown: true,
})

console.log('Cost Breakdown:')
console.log(\`- Embeddings: $\${analysis.embeddingsCost.toFixed(2)}\`)
console.log(\`- Retrieval: $\${analysis.retrievalCost.toFixed(2)}\`)
console.log(\`- Generation: $\${analysis.generationCost.toFixed(2)}\`)
console.log(\`- Total: $\${analysis.totalCost.toFixed(2)}\`)
console.log(\`\\nOptimization opportunities:\`)
analysis.recommendations.forEach(rec => {
  console.log(\`- \${rec.strategy}: save $\${rec.savings.toFixed(2)}/mo (\${rec.percent}%)\`)
})

// Compare different RAG strategies
const comparison = await compareRAGStrategies({
  strategies: [
    { name: 'Basic', chunkSize: 1000, topK: 5, compression: false },
    { name: 'Compressed', chunkSize: 500, topK: 5, compression: true },
    { name: 'Cached', chunkSize: 500, topK: 3, compression: true, cache: true },
    { name: 'Optimized', chunkSize: 512, topK: 3, compression: true, cache: true, rerank: true },
  ],
  sampleQueries: benchmarkQueries,
  model: 'claude-3-5-sonnet',
})

comparison.forEach(result => {
  console.log(\`\${result.name}:\`)
  console.log(\`  Cost per query: $\${result.costPerQuery.toFixed(4)}\`)
  console.log(\`  Tokens per query: \${result.tokensPerQuery}\`)
  console.log(\`  Avg relevance: \${result.avgRelevance.toFixed(2)}\`)
  console.log(\`  Retrieval time: \${result.retrievalTime}ms\`)
})

// Optimize for budget constraints
const optimized = await optimizeRAGBudget({
  monthlyBudget: 500,  // $500/mo budget
  expectedQueries: 10000,
  model: 'claude-3-5-sonnet',
  qualityThreshold: 0.7,  // Maintain 0.7+ relevance
})

console.log('Optimized Configuration:')
console.log(\`- Chunk size: \${optimized.chunkSize}\`)
console.log(\`- Top K: \${optimized.topK}\`)
console.log(\`- Compression: \${optimized.compression ? 'enabled' : 'disabled'}\`)
console.log(\`- Caching: \${optimized.caching ? 'enabled' : 'disabled'}\`)
console.log(\`- Estimated cost: $\${optimized.estimatedCost.toFixed(2)}/mo\`)
console.log(\`- Expected quality: \${optimized.expectedQuality.toFixed(2)}\`)

// Track costs in production
const tracker = new RAGCostTracker({
  trackEmbeddings: true,
  trackRetrieval: true,
  trackGeneration: true,
})

// Record each query
tracker.recordQuery({
  embeddingTokens: 50,
  retrievedChunks: 5,
  inputTokens: 3000,
  outputTokens: 500,
  model: 'claude-3-5-sonnet',
  cached: true,
})

// Get cost report
const report = tracker.generateReport({
  period: 'month',
  groupBy: 'day',
})

console.log('Monthly Cost Report:')
console.log(\`- Total queries: \${report.totalQueries}\`)
console.log(\`- Total cost: $\${report.totalCost.toFixed(2)}\`)
console.log(\`- Avg cost per query: $\${report.avgCostPerQuery.toFixed(4)}\`)
console.log(\`- Total savings: $\${report.totalSavings.toFixed(2)}\`)
console.log(\`- Cache hit rate: \${report.cacheHitRate.toFixed(1)}%\`)`,
}

// Troubleshooting items
const troubleshootingItems = [
  {
    title: 'Retrieved chunks are not relevant',
    description: 'Vector search returns documents but they do not answer the query well.',
    solution: `Try hybrid search with reranking:

const retriever = new HybridSearchRetriever({
  vectorStore: pineconeStore,
  bm25Store: elasticsearchStore,
  weights: { semantic: 0.7, keyword: 0.3 },
  reranking: {
    enabled: true,
    model: 'cross-encoder/ms-marco-MiniLM-L-6-v2',
    topK: 3,
  },
})

// Or use query expansion
const multiQuery = new MultiQueryRetriever({
  retriever: baseRetriever,
  llm: 'gpt-4o-mini',
  numQueries: 3,
})`,
  },
  {
    title: 'RAG costs are too high',
    description: 'Token usage exceeds budget even with basic optimization.',
    solution: `Enable all cost-saving strategies:

const rag = createOptimizedRAGPipeline({
  // Use smaller chunks
  chunking: { chunkSize: 400, chunkOverlap: 40 },

  // Aggressive reranking
  retrieval: {
    initialK: 20,
    reranking: { enabled: true, topK: 3 },
    compression: { enabled: true, targetRatio: 0.5 },
  },

  // Provider caching
  optimization: {
    providerCaching: { enabled: true, provider: 'anthropic' },
    maxTokensPerQuery: 3000,
  },
})`,
  },
  {
    title: 'Embedding cache not reducing costs',
    description: 'Embedding cache is enabled but costs remain high.',
    solution: `Ensure queries are normalized for cache hits:

import { normalizeQuery } from '@clarity-chat/token-optimization'

// Normalize before embedding
const normalized = normalizeQuery(userQuery, {
  lowercase: true,
  removeStopWords: true,
  stemming: true,
})

const embedding = await cachedEmbeddings.embedQuery(normalized)

// Check cache statistics
const stats = cache.getStats()
if (stats.hitRate < 0.5) {
  console.log('Low hit rate - queries may be too unique')
  console.log('Consider increasing cache TTL or using fuzzy matching')
}`,
  },
  {
    title: 'Chunks lose context after compression',
    description: 'Compressed chunks are missing important context.',
    solution: `Use gentler compression or include chunk metadata:

// Gentler compression
const compressed = await compressRAGContext({
  chunks: retrievedChunks,
  targetRatio: 0.7,  // Less aggressive (70% of original)
  preserveFirst: true,
  preserveLast: true,
  preserveKeyPhrases: true,
})

// Include metadata in chunks
const chunksWithMetadata = chunks.map(chunk => ({
  ...chunk,
  metadata: {
    source: chunk.metadata.source,
    title: chunk.metadata.title,
    // Metadata doesn't count toward token limit
  },
}))`,
  },
  {
    title: 'Semantic chunking is slow',
    description: 'SemanticChunker takes too long for large documents.',
    solution: `Use recursive chunking or batch processing:

// Faster recursive chunking
const recursive = new RecursiveChunker({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\\n\\n', '\\n', '. '],
})

const chunks = recursive.chunk(largeDocument)

// Or batch semantic chunking
const semantic = new SemanticChunker({
  batchSize: 10,  // Process 10 chunks at a time
  maxChunkSize: 512,
})

const semanticChunks = await semantic.chunkBatch(documents)`,
  },
]

// Vector store examples
const vectorStoreExamples = [
  {
    name: 'Pinecone',
    icon: <Database className="w-5 h-5" />,
    features: ['Managed service', 'Serverless', 'Real-time updates', 'Metadata filtering'],
    bestFor: 'Production applications with high query volume',
  },
  {
    name: 'Weaviate',
    icon: <Box className="w-5 h-5" />,
    features: ['Open source', 'Hybrid search', 'GraphQL API', 'Multi-tenancy'],
    bestFor: 'Complex queries with multiple filters and relationships',
  },
  {
    name: 'Qdrant',
    icon: <Target className="w-5 h-5" />,
    features: ['Open source', 'High performance', 'Payload filtering', 'Quantization'],
    bestFor: 'Self-hosted deployments requiring maximum performance',
  },
  {
    name: 'Chroma',
    icon: <Layers className="w-5 h-5" />,
    features: ['Embedded', 'Simple API', 'Local-first', 'Python/JS'],
    bestFor: 'Development and prototyping with local databases',
  },
]

export default function AdvancedRAGGuidePage() {
  const [selectedChunking, setSelectedChunking] = useState<'semantic' | 'recursive' | 'markdown'>(
    'semantic'
  )

  return (
    <div className="container-docs py-8 sm:py-12">
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 rounded-full mb-6">
            <TrendingDown className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Reduce RAG Costs by 60-75%
            </span>
          </div>

          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Advanced RAG with Token Optimization
          </KineticText>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
            Build robust RAG systems that combine retrieval excellence with aggressive cost
            optimization. From smart chunking to provider caching and intelligent reranking.
          </p>

          {/* Savings Highlight */}
          <div className="inline-flex items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">60-75%</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Cost Reduction</div>
            </div>
            <div className="h-12 w-px bg-emerald-200 dark:bg-emerald-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">8+</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Strategies</div>
            </div>
            <div className="h-12 w-px bg-emerald-200 dark:bg-emerald-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">4</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Vector Stores</div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* What You'll Learn */}
      <ScrollReveal direction="up" delay={0.15}>
        <section className="mb-16">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500 text-white flex-shrink-0">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-3">What You&apos;ll Learn</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    'Hybrid search combining semantic and keyword matching',
                    'Cross-encoder reranking for precision retrieval',
                    'Smart chunking strategies for optimal compression',
                    'Provider caching for embedding and context reuse',
                    'Query optimization with multi-query and HyDE',
                    'Production deployment patterns with monitoring',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* RAG + Token Optimization Synergy */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">RAG + Token Optimization Synergy</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Retrieval-Augmented Generation (RAG) systems naturally benefit from token optimization because
            they process large amounts of context. Every retrieved chunk is an opportunity for savings.
          </p>

          {/* Cost Breakdown Table */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden mb-6">
            <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-semibold">RAG Cost Comparison (GPT-4o, per 1,000 queries)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <th className="px-4 py-3 text-left font-medium">Scenario</th>
                    <th className="px-4 py-3 text-right font-medium">Tokens/Query</th>
                    <th className="px-4 py-3 text-right font-medium">Cost</th>
                    <th className="px-4 py-3 text-left font-medium">Approach</th>
                  </tr>
                </thead>
                <tbody>
                  {ragCostComparison.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-neutral-200/60 dark:border-neutral-800/60 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                    >
                      <td className="px-4 py-3 font-medium">{row.scenario}</td>
                      <td className="px-4 py-3 text-right font-mono">{row.tokensPerQuery}</td>
                      <td
                        className={cn(
                          'px-4 py-3 text-right font-mono font-semibold',
                          i === 0 && 'text-red-500',
                          i === ragCostComparison.length - 1 && 'text-emerald-500'
                        )}
                      >
                        {row.costPer1kQueries}
                      </td>
                      <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                        {row.approach}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
            <div className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-emerald-600 dark:text-emerald-400">Key Insight:</strong> RAG
                systems can achieve 60-75% cost reduction by combining smart chunking, provider caching,
                compression, and reranking. Each strategy compounds with the others.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Basic RAG Setup */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Basic RAG Setup</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Start with a simple RAG pipeline that includes built-in token optimization. The{' '}
            <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-brand-500">
              createRAGPipeline
            </code>{' '}
            function handles embeddings, retrieval, and optimization automatically.
          </p>

          <CodeBlock code={codeExamples.basicRag} filename="BasicRAG.tsx" />

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-500" />
                Automatic Caching
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Embeddings and chunks are automatically cached based on content hash. Repeated queries
                return instantly.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                Budget Management
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Set <code className="text-brand-500">maxTokens</code> to automatically limit context size
                and prevent runaway costs.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Hybrid Search & Reranking */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <Search className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Hybrid Search & Reranking</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Combine semantic (vector) search with keyword (BM25) search for better recall. Then use
            cross-encoder reranking to improve precision without increasing costs.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <div className="text-2xl font-bold text-blue-500 mb-1">Vector Search</div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Semantic similarity using embeddings. Great for conceptual matches.
              </p>
              <div className="text-xs text-neutral-500">70% weight (typical)</div>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <div className="text-2xl font-bold text-purple-500 mb-1">Keyword Search</div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                BM25 ranking for exact term matches. Catches specific entities.
              </p>
              <div className="text-xs text-neutral-500">30% weight (typical)</div>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <div className="text-2xl font-bold text-emerald-500 mb-1">Reranking</div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Cross-encoder scores query-document pairs for final ranking.
              </p>
              <div className="text-xs text-neutral-500">Final precision boost</div>
            </div>
          </div>

          <CodeBlock code={codeExamples.hybridSearch} filename="HybridSearch.tsx" />
        </section>
      </ScrollReveal>

      {/* Smart Chunking Strategies */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Smart Chunking Strategies</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Chunking directly impacts both retrieval quality and token costs. Choose the right strategy
            based on your content type and performance requirements.
          </p>

          {/* Chunking Strategy Tabs */}
          <div className="flex items-center gap-2 mb-6">
            {(['semantic', 'recursive', 'markdown'] as const).map((strategy) => (
              <button
                key={strategy}
                onClick={() => setSelectedChunking(strategy)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize',
                  selectedChunking === strategy
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700'
                )}
              >
                {strategy}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedChunking}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: durations.normal }}
            >
              <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] mb-6">
                {selectedChunking === 'semantic' && (
                  <div>
                    <h4 className="font-semibold mb-2 text-teal-600 dark:text-teal-400">
                      Semantic Chunking
                    </h4>
                    <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                      <li>- Splits on meaning boundaries using embeddings</li>
                      <li>- Most coherent chunks for better retrieval quality</li>
                      <li>- Slower due to embedding computation</li>
                      <li>- Best for: Long-form content, articles, documentation</li>
                    </ul>
                  </div>
                )}
                {selectedChunking === 'recursive' && (
                  <div>
                    <h4 className="font-semibold mb-2 text-emerald-600 dark:text-emerald-400">
                      Recursive Chunking
                    </h4>
                    <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                      <li>- Hierarchical splitting by separators (paragraphs → sentences → words)</li>
                      <li>- Fast and reliable for most content types</li>
                      <li>- Balances chunk coherence and performance</li>
                      <li>- Best for: General purpose, mixed content types</li>
                    </ul>
                  </div>
                )}
                {selectedChunking === 'markdown' && (
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">
                      Markdown Chunking
                    </h4>
                    <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                      <li>- Respects markdown structure (headers, lists, code blocks)</li>
                      <li>- Preserves formatting and hierarchy</li>
                      <li>- Ideal for technical documentation</li>
                      <li>- Best for: API docs, README files, technical guides</li>
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <CodeBlock code={codeExamples.smartChunking} filename="SmartChunking.tsx" />
        </section>
      </ScrollReveal>

      {/* Embedding Cache */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Embedding Cache - Save 40-50% on Embeddings</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Embeddings are expensive and slow. Cache them aggressively to save costs and improve latency.
            A 90% cache hit rate can save 40-50% of your total RAG costs.
          </p>

          <CodeBlock code={codeExamples.embeddingCache} filename="EmbeddingCache.tsx" />

          <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-amber-600 dark:text-amber-400">Pro Tip:</strong> Normalize
                queries before embedding (lowercase, remove stop words) to increase cache hit rate.
                Similar queries should produce identical cache keys.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Context Compression */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Context Compression for RAG</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Retrieved chunks often contain irrelevant information. Compress them while preserving
            query-relevant content to reduce tokens by 40-60%.
          </p>

          <CodeBlock code={codeExamples.contextCompression} filename="ContextCompression.tsx" />

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h4 className="font-semibold mb-2">LLM Extraction</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Highest quality, uses cheap model (gpt-4o-mini) to extract relevant sentences.
              </p>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">Best for: Quality-critical apps</div>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h4 className="font-semibold mb-2">Embeddings Filter</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Fast, no LLM calls, uses similarity scores to filter sentences.
              </p>
              <div className="text-xs text-blue-600 dark:text-blue-400">Best for: High-volume apps</div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Reranking */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white">
              <Filter className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Advanced Reranking</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Retrieve more documents initially, then rerank to select the best ones. This two-stage
            approach improves precision without increasing context size.
          </p>

          <CodeBlock code={codeExamples.reranking} filename="Reranking.tsx" />

          <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-blue-600 dark:text-blue-400">Strategy:</strong> Start with 20-50
                documents from vector search, then narrow to top 3-5 with reranking. This maximizes recall
                while minimizing token usage.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Query Optimization */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
              <GitBranch className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Query Optimization</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Transform user queries to improve retrieval quality. Multi-query, step-back, and HyDE
            techniques help find more relevant documents.
          </p>

          <CodeBlock code={codeExamples.queryOptimization} filename="QueryOptimization.tsx" />
        </section>
      </ScrollReveal>

      {/* Production Pipeline */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 text-white">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Production Deployment</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Complete production RAG setup with monitoring, cost tracking, and all optimizations enabled:
          </p>

          <CodeBlock code={codeExamples.productionPipeline} filename="ProductionRAG.tsx" />
        </section>
      </ScrollReveal>

      {/* Cost Analysis */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Cost Analysis & Optimization</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Analyze RAG costs, compare strategies, and optimize for your budget constraints:
          </p>

          <CodeBlock code={codeExamples.costAnalysis} filename="CostAnalysis.tsx" />
        </section>
      </ScrollReveal>

      {/* Vector Store Guide */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 text-white">
              <Box className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Vector Store Selection</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Choose the right vector store based on your requirements. All work with Clarity&apos;s
            optimization toolkit.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {vectorStoreExamples.map((store, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500">
                    {store.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{store.name}</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-neutral-500 uppercase tracking-wide">Features</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {store.features.map((feature, j) => (
                        <span
                          key={j}
                          className="px-2 py-0.5 text-xs rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500 uppercase tracking-wide">Best For</span>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {store.bestFor}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Real-World Savings */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 text-white">
              <Percent className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Real-World RAG Savings</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {ragSavingsExamples.map((example, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <h3 className="font-semibold text-lg mb-4">{example.scenario}</h3>

                {/* Cost comparison */}
                <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Before:</span>
                      <span className="font-mono font-semibold text-red-500">{example.before}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">After:</span>
                      <span className="font-mono font-semibold text-emerald-500">{example.after}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                        Savings:
                      </span>
                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {example.savings}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-brand-500/10 border border-brand-500/30 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2 text-sm">How We Achieved {example.savings}:</p>
                  <ul className="space-y-1 text-xs text-neutral-700 dark:text-neutral-300">
                    {example.breakdown.map((item, j) => (
                      <li key={j}>
                        ✓ {item.strategy}: {item.savings}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 italic">
                    {example.note}
                  </p>
                </div>

                {/* Techniques */}
                <div className="space-y-2">
                  <span className="text-xs text-neutral-500 uppercase tracking-wide">Techniques:</span>
                  <div className="flex flex-wrap gap-1">
                    {example.techniques.map((tech, j) => (
                      <span
                        key={j}
                        className="px-2 py-0.5 text-xs rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Troubleshooting */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-white">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Troubleshooting</h2>
          </div>

          <div className="space-y-4">
            {troubleshootingItems.map((item, i) => (
              <CollapsibleSection key={i} title={item.title} badge="Common Issue">
                <div className="space-y-3">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
                  <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                    <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 border-b border-neutral-200 dark:border-neutral-700">
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        Solution
                      </span>
                    </div>
                    <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
                      <code>{item.solution}</code>
                    </pre>
                  </div>
                </div>
              </CollapsibleSection>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal direction="up" delay={0.2}>
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Build Your Optimized RAG</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Ready to build a production RAG system? Explore examples, check the API reference, or dive
              into related cookbooks.
            </p>
          </div>

          <ScrollRevealStagger staggerDelay={0.1}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <FileCode className="w-5 h-5" />,
                  title: 'API Reference',
                  description: 'Complete documentation for RAG optimization APIs',
                  href: '/api/rag-optimization',
                },
                {
                  icon: <Database className="w-5 h-5" />,
                  title: 'Vector Stores Guide',
                  description: 'Setup guides for Pinecone, Weaviate, Qdrant, and Chroma',
                  href: '/guides/vector-stores',
                },
                {
                  icon: <Lightbulb className="w-5 h-5" />,
                  title: 'RAG Cookbook',
                  description: 'Production patterns and best practices',
                  href: '/cookbook/rag-patterns',
                },
              ].map((item, i) => (
                <ScrollRevealStaggerItem key={i}>
                  <Link
                    href={item.href}
                    className="block p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-lg group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500 mb-4 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-brand-500 transition-colors flex items-center gap-2">
                      {item.title}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </Link>
                </ScrollRevealStaggerItem>
              ))}
            </div>
          </ScrollRevealStagger>
        </section>
      </ScrollReveal>
    </div>
  )
}

// Helper Components
interface CodeBlockProps {
  code: string
  filename: string
}

function CodeBlock({ code, filename }: CodeBlockProps) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-neutral-400">
          <FileCode className="w-4 h-4" />
          <span className="text-sm font-mono">{filename}</span>
        </div>
        <EnhancedCopyButton
          text={code}
          label={`Copy ${filename}`}
          size="sm"
          celebration="pulse"
        />
      </div>
      <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}
