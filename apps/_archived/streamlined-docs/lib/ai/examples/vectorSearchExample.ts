/**
 * Vector Search Examples
 *
 * Demonstrates how to use HNSW vector indexing and hybrid search
 * in the Clarity AI documentation site.
 */

import { createHNSWIndex, type APIMetadata } from '../vectorIndexHNSW'
import { createHybridSearchEngine } from '../hybridSearchHNSW'
import { getSearchService } from '../searchService'

// ============================================================================
// Example 1: Basic HNSW Search
// ============================================================================

export async function example1_BasicHNSWSearch() {
  console.log('\n=== Example 1: Basic HNSW Search ===\n')

  // Sample documents
  const documents: APIMetadata[] = [
    {
      id: 'chat-component',
      title: 'Chat Component',
      content:
        'The Chat component provides a complete chat interface with message history, input, and streaming support.',
      url: '/docs/components/chat',
      category: 'component',
      metadata: {
        lastUpdated: '2026-01-25',
        tags: ['chat', 'messaging', 'ui'],
        headings: ['Props', 'Examples', 'Styling'],
      },
    },
    {
      id: 'use-streaming',
      title: 'useStreaming Hook',
      content:
        'React hook for handling streaming responses from AI models. Supports SSE and WebSocket protocols.',
      url: '/docs/hooks/use-streaming',
      category: 'hook',
      metadata: {
        lastUpdated: '2026-01-25',
        tags: ['streaming', 'sse', 'websocket'],
        headings: ['Usage', 'Parameters', 'Return Value'],
      },
    },
    {
      id: 'streaming-guide',
      title: 'Streaming Guide',
      content:
        'Learn how to implement real-time streaming in your chat applications using server-sent events.',
      url: '/docs/guides/streaming',
      category: 'guide',
      metadata: {
        lastUpdated: '2026-01-25',
        tags: ['guide', 'streaming', 'tutorial'],
        headings: ['Overview', 'Setup', 'Advanced'],
      },
    },
  ]

  // Generate sample embeddings (in production, use real embeddings)
  const embeddings = documents.map(() =>
    Array.from({ length: 1536 }, () => Math.random() * 2 - 1)
  )

  // Create and build HNSW index
  const index = createHNSWIndex(1536)
  await index.build(documents, embeddings)

  // Search
  const queryEmbedding = Array.from(
    { length: 1536 },
    () => Math.random() * 2 - 1
  )
  const results = await index.search(queryEmbedding, 3)

  console.log('Search Results:')
  results.forEach((result, i) => {
    console.log(`${i + 1}. ${result.document.title}`)
    console.log(`   Score: ${result.score.toFixed(3)}`)
    console.log(`   URL: ${result.document.url}`)
  })

  // Get statistics
  const stats = index.getStats()
  console.log('\nIndex Statistics:')
  console.log(`  Documents: ${stats.numDocuments}`)
  console.log(`  Average degree: ${stats.avgDegree.toFixed(2)}`)
  console.log(`  Max level: ${stats.maxLevel}`)
  console.log(`  Memory usage: ${(stats.indexSizeBytes / 1024).toFixed(2)} KB`)
}

// ============================================================================
// Example 2: Hybrid Search with RRF
// ============================================================================

export async function example2_HybridSearch() {
  console.log('\n=== Example 2: Hybrid Search with RRF ===\n')

  const documents: APIMetadata[] = [
    {
      id: 'chat-1',
      title: 'Chat Component',
      content: 'Complete chat interface with message history and streaming.',
      url: '/docs/components/chat',
      category: 'component',
      metadata: { lastUpdated: '2026-01-25', tags: ['chat', 'ui'] },
    },
    {
      id: 'stream-1',
      title: 'Streaming Guide',
      content: 'Learn how to implement real-time streaming in chat apps.',
      url: '/docs/guides/streaming',
      category: 'guide',
      metadata: { lastUpdated: '2026-01-25', tags: ['streaming', 'guide'] },
    },
  ]

  const embeddings = documents.map(() =>
    Array.from({ length: 1536 }, () => Math.random() * 2 - 1)
  )

  // Create hybrid search engine
  const engine = await createHybridSearchEngine(documents, embeddings)

  // Test different alpha values
  const query = 'How to use streaming in chat components?'

  console.log(`Query: "${query}"\n`)

  // Pure vector search (alpha = 1.0)
  console.log('Pure Vector Search (α = 1.0):')
  const vectorResults = await engine.search(query, { k: 2, alpha: 1.0 })
  vectorResults.forEach((r, i) => {
    console.log(
      `  ${i + 1}. ${r.document.title} (score: ${r.score.toFixed(3)})`
    )
  })

  // Balanced hybrid (alpha = 0.5)
  console.log('\nBalanced Hybrid (α = 0.5):')
  const hybridResults = await engine.search(query, { k: 2, alpha: 0.5 })
  hybridResults.forEach((r, i) => {
    console.log(
      `  ${i + 1}. ${r.document.title} (score: ${r.score.toFixed(3)})`
    )
    console.log(
      `     Vector: ${r.vectorScore.toFixed(3)}, Keyword: ${r.keywordScore.toFixed(3)}`
    )
    console.log(`     Match type: ${r.matchType}`)
  })

  // Pure keyword search (alpha = 0.0)
  console.log('\nPure Keyword Search (α = 0.0):')
  const keywordResults = await engine.search(query, { k: 2, alpha: 0.0 })
  keywordResults.forEach((r, i) => {
    console.log(
      `  ${i + 1}. ${r.document.title} (score: ${r.score.toFixed(3)})`
    )
  })

  // Show engine stats
  const stats = engine.getStats()
  console.log('\nEngine Statistics:')
  console.log(`  HNSW documents: ${stats.hnsw.numDocuments}`)
  console.log(`  BM25 documents: ${stats.bm25.numDocuments}`)
  console.log(`  BM25 unique terms: ${stats.bm25.uniqueTerms}`)
}

// ============================================================================
// Example 3: Search Service with Caching
// ============================================================================

export async function example3_SearchService() {
  console.log('\n=== Example 3: Search Service with Caching ===\n')

  const service = getSearchService({
    enableHNSW: true,
    enableHybrid: true,
  })

  await service.initialize()

  const query = 'streaming chat components'

  // First search (cold - no cache)
  console.log('First search (cold):')
  const { results: results1, metrics: metrics1 } = await service.search(query, {
    k: 3,
    alpha: 0.5,
  })

  console.log(`  Time: ${metrics1.searchTime.toFixed(2)}ms`)
  console.log(`  Method: ${metrics1.method}`)
  console.log(`  Cache hit: ${metrics1.cacheHit}`)
  console.log(`  Results: ${metrics1.numResults}`)

  // Second search (hot - cached)
  console.log('\nSecond search (cached):')
  const { results: results2, metrics: metrics2 } = await service.search(query, {
    k: 3,
    alpha: 0.5,
  })

  console.log(`  Time: ${metrics2.searchTime.toFixed(2)}ms`)
  console.log(`  Method: ${metrics2.method}`)
  console.log(`  Cache hit: ${metrics2.cacheHit}`)
  console.log(`  Results: ${metrics2.numResults}`)

  // Service statistics
  const serviceStats = service.getStats()
  console.log('\nService Statistics:')
  console.log(`  Initialized: ${serviceStats.initialized}`)
  console.log(`  Cache size: ${serviceStats.cacheSize}`)

  // Clear cache
  service.clearCache()
  console.log('  Cache cleared')
}

// ============================================================================
// Example 4: Performance Comparison
// ============================================================================

export async function example4_PerformanceComparison() {
  console.log('\n=== Example 4: Performance Comparison ===\n')

  // Generate large dataset
  const NUM_DOCS = 1000
  const DIMENSION = 1536

  console.log(`Generating ${NUM_DOCS} documents...`)

  const documents: APIMetadata[] = Array.from({ length: NUM_DOCS }, (_, i) => ({
    id: `doc-${i}`,
    title: `Document ${i}`,
    content: `This is document ${i} with sample content about components, hooks, and guides.`,
    url: `/docs/doc-${i}`,
    category: ['component', 'hook', 'guide'][i % 3] as any,
    metadata: {
      lastUpdated: '2026-01-25',
      tags: [`tag-${i % 10}`],
    },
  }))

  const embeddings = documents.map(() =>
    Array.from({ length: DIMENSION }, () => Math.random() * 2 - 1)
  )

  // Build HNSW index
  console.log('Building HNSW index...')
  const buildStart = performance.now()
  const index = createHNSWIndex(DIMENSION)
  await index.build(documents, embeddings)
  const buildTime = performance.now() - buildStart

  console.log(`Index built in ${buildTime.toFixed(2)}ms`)

  // Run search benchmark
  const NUM_QUERIES = 100
  const latencies: number[] = []

  console.log(`Running ${NUM_QUERIES} search queries...`)

  for (let i = 0; i < NUM_QUERIES; i++) {
    const query = Array.from({ length: DIMENSION }, () => Math.random() * 2 - 1)

    const searchStart = performance.now()
    await index.search(query, 10)
    latencies.push(performance.now() - searchStart)
  }

  // Calculate statistics
  latencies.sort((a, b) => a - b)
  const avg = latencies.reduce((sum, val) => sum + val, 0) / latencies.length
  const p50 = latencies[Math.floor(latencies.length * 0.5)]
  const p95 = latencies[Math.floor(latencies.length * 0.95)]
  const p99 = latencies[Math.floor(latencies.length * 0.99)]

  console.log('\nSearch Performance:')
  console.log(`  Average: ${avg.toFixed(2)}ms`)
  console.log(`  p50: ${p50.toFixed(2)}ms`)
  console.log(`  p95: ${p95.toFixed(2)}ms`)
  console.log(`  p99: ${p99.toFixed(2)}ms`)
  console.log(`  Min: ${latencies[0].toFixed(2)}ms`)
  console.log(`  Max: ${latencies[latencies.length - 1].toFixed(2)}ms`)

  const stats = index.getStats()
  console.log('\nIndex Statistics:')
  console.log(`  Documents: ${stats.numDocuments.toLocaleString()}`)
  console.log(`  Avg degree: ${stats.avgDegree.toFixed(2)}`)
  console.log(`  Max level: ${stats.maxLevel}`)
  console.log(`  Memory: ${(stats.indexSizeBytes / 1024 / 1024).toFixed(2)} MB`)
}

// ============================================================================
// Example 5: Index Persistence
// ============================================================================

export async function example5_IndexPersistence() {
  console.log('\n=== Example 5: Index Persistence ===\n')

  const documents: APIMetadata[] = [
    {
      id: 'doc-1',
      title: 'Test Document',
      content: 'Sample content',
      url: '/test',
      category: 'guide',
      metadata: { lastUpdated: '2026-01-25', tags: ['test'] },
    },
  ]

  const embeddings = [Array.from({ length: 1536 }, () => Math.random() * 2 - 1)]

  // Build and save index
  console.log('Building index...')
  const index1 = createHNSWIndex(1536)
  await index1.build(documents, embeddings)

  const savePath = '.test-index.json'
  console.log(`Saving index to ${savePath}...`)
  await index1.save(savePath)

  // Load index
  console.log('Loading index from disk...')
  const loadStart = performance.now()
  const index2 = createHNSWIndex(1536)
  await index2.load(savePath)
  const loadTime = performance.now() - loadStart

  console.log(`Index loaded in ${loadTime.toFixed(2)}ms`)

  // Verify search works
  const query = Array.from({ length: 1536 }, () => Math.random() * 2 - 1)
  const results = await index2.search(query, 1)

  console.log('\nSearch after loading:')
  console.log(`  Found: ${results[0].document.title}`)
  console.log(`  Score: ${results[0].score.toFixed(3)}`)

  // Clean up
  const fs = await import('fs/promises')
  await fs.unlink(savePath)
  console.log('\nCleanup: Test index file deleted')
}

// ============================================================================
// Run All Examples
// ============================================================================

export async function runAllExamples() {
  console.log('\n' + '='.repeat(60))
  console.log('HNSW Vector Search Examples')
  console.log('='.repeat(60))

  try {
    await example1_BasicHNSWSearch()
    await example2_HybridSearch()
    await example3_SearchService()
    await example4_PerformanceComparison()
    await example5_IndexPersistence()

    console.log('\n' + '='.repeat(60))
    console.log('All examples completed successfully!')
    console.log('='.repeat(60) + '\n')
  } catch (error) {
    console.error('\nError running examples:', error)
  }
}

// Run if executed directly
if (require.main === module) {
  runAllExamples()
}
