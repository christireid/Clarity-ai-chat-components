/**
 * Enhanced RAG Example
 *
 * Demonstrates the new document parsing and chunking system
 * in a real RAG pipeline.
 */

import { loadLibraryDocs, getRelevantChunks, formatLibraryDocsForRAG } from '../libraryContext'

/**
 * Example 1: Basic Enhanced RAG
 */
export async function basicEnhancedRAG() {
  console.log('=== Example 1: Basic Enhanced RAG ===\n')

  // Load documents with enhanced parsing
  const docs = await loadLibraryDocs({
    parseDocuments: true,
    chunkDocuments: true,
  })

  console.log(`Loaded ${docs.length} documents`)
  console.log(`Total chunks: ${docs.reduce((sum, d) => sum + (d.chunks?.length || 0), 0)}`)

  // Search for relevant chunks
  const query = 'How do I implement streaming messages?'
  const chunks = getRelevantChunks(docs, query, 5, {
    includeCodeBlocks: true,
  })

  console.log(`\nQuery: "${query}"`)
  console.log(`Found ${chunks.length} relevant chunks:\n`)

  chunks.forEach((chunk, i) => {
    console.log(`${i + 1}. ${chunk.title}`)
    console.log(`   Type: ${chunk.type}`)
    console.log(`   Path: ${chunk.sectionPath.join(' > ')}`)
    console.log(`   Has code: ${chunk.codeBlocks.length > 0}`)
    console.log(`   Languages: ${chunk.metadata.languages.join(', ') || 'none'}`)
    console.log(`   Tokens: ~${chunk.metadata.estimatedTokens}`)
    console.log()
  })

  // Format for RAG
  const context = formatLibraryDocsForRAG(docs, query, {
    includeChunks: true,
    includeCodeBlocks: true,
    maxLength: 4000,
  })

  console.log('RAG Context Preview:')
  console.log(context.slice(0, 500) + '...\n')

  return { docs, chunks, context }
}

/**
 * Example 2: Code-Focused Search
 */
export async function codeFocusedSearch() {
  console.log('=== Example 2: Code-Focused Search ===\n')

  const docs = await loadLibraryDocs({
    parseDocuments: true,
    chunkDocuments: true,
    chunkingOptions: {
      strategy: 'hierarchical',
      separateCodeBlocks: true, // Create separate chunks for code
    },
  })

  const query = 'React component example'
  const chunks = getRelevantChunks(docs, query, 8, {
    includeCodeBlocks: true, // Only code examples
    filterByCategory: ['component', 'example'],
  })

  console.log(`Query: "${query}"`)
  console.log(`Found ${chunks.length} code-focused chunks:\n`)

  // Filter for chunks with executable code
  const executableChunks = chunks.filter(c => c.metadata.hasExecutableCode)

  console.log(`Executable examples: ${executableChunks.length}\n`)

  executableChunks.forEach((chunk, i) => {
    console.log(`${i + 1}. ${chunk.title}`)
    console.log(`   Language: ${chunk.metadata.languages.join(', ')}`)
    console.log(`   Complete: ${chunk.metadata.isCompleteExample ? 'Yes' : 'No'}`)

    if (chunk.codeBlocks.length > 0) {
      const codeBlock = chunk.codeBlocks[0]
      console.log(`   Keywords: ${codeBlock.keywords.slice(0, 5).join(', ')}`)
      console.log(`   Preview: ${codeBlock.code.slice(0, 80)}...`)
    }
    console.log()
  })

  return { executableChunks }
}

/**
 * Example 3: Category-Filtered Search
 */
export async function categoryFilteredSearch() {
  console.log('=== Example 3: Category-Filtered Search ===\n')

  const docs = await loadLibraryDocs({
    parseDocuments: true,
    chunkDocuments: true,
  })

  const query = 'authentication'

  // Search only in guides and hooks
  const chunks = getRelevantChunks(docs, query, 5, {
    filterByCategory: ['guide', 'hook'],
  })

  console.log(`Query: "${query}"`)
  console.log(`Categories: guide, hook`)
  console.log(`Found ${chunks.length} chunks:\n`)

  chunks.forEach((chunk, i) => {
    console.log(`${i + 1}. ${chunk.title}`)
    console.log(`   Category: ${chunk.category}`)
    console.log(`   Section: ${chunk.sectionPath.join(' > ')}`)
    console.log(`   Tags: ${chunk.metadata.tags.slice(0, 3).join(', ')}`)
    console.log()
  })

  return { chunks }
}

/**
 * Example 4: Custom Chunking Strategy
 */
export async function customChunkingStrategy() {
  console.log('=== Example 4: Custom Chunking Strategy ===\n')

  // Use hybrid strategy with custom settings
  const docs = await loadLibraryDocs({
    parseDocuments: true,
    chunkDocuments: true,
    chunkingOptions: {
      strategy: 'hybrid',
      maxChunkSize: 1500,
      minChunkSize: 200,
      overlapSize: 300,
      separateCodeBlocks: true,
      includeParentContext: true,
      maxHeadingLevel: 3,
    },
  })

  console.log('Chunking Configuration:')
  console.log('  Strategy: hybrid')
  console.log('  Max size: 1500 chars')
  console.log('  Overlap: 300 chars')
  console.log('  Separate code: Yes')
  console.log('  Parent context: Yes')
  console.log('  Max heading level: 3')
  console.log()

  const totalChunks = docs.reduce((sum, d) => sum + (d.chunks?.length || 0), 0)
  console.log(`Total chunks created: ${totalChunks}`)

  // Analyze chunk sizes
  const allChunks = docs.flatMap(d => d.chunks || [])
  const sizes = allChunks.map(c => c.content.length)
  const avgSize = sizes.reduce((a, b) => a + b, 0) / sizes.length
  const maxSize = Math.max(...sizes)
  const minSize = Math.min(...sizes)

  console.log(`\nChunk Statistics:`)
  console.log(`  Average size: ${Math.round(avgSize)} chars`)
  console.log(`  Max size: ${maxSize} chars`)
  console.log(`  Min size: ${minSize} chars`)

  // Analyze chunk types
  const typeCount = new Map<string, number>()
  allChunks.forEach(c => {
    typeCount.set(c.type, (typeCount.get(c.type) || 0) + 1)
  })

  console.log(`\nChunk Types:`)
  typeCount.forEach((count, type) => {
    console.log(`  ${type}: ${count}`)
  })

  return { docs, allChunks }
}

/**
 * Example 5: Complete RAG Pipeline
 */
export async function completeRAGPipeline(userQuery: string) {
  console.log('=== Example 5: Complete RAG Pipeline ===\n')
  console.log(`User Query: "${userQuery}"\n`)

  // Step 1: Load and parse documents
  console.log('Step 1: Loading documents...')
  const startLoad = Date.now()
  const docs = await loadLibraryDocs({
    parseDocuments: true,
    chunkDocuments: true,
  })
  const loadTime = Date.now() - startLoad
  console.log(`  ✓ Loaded ${docs.length} documents in ${loadTime}ms\n`)

  // Step 2: Search for relevant chunks
  console.log('Step 2: Searching for relevant chunks...')
  const startSearch = Date.now()
  const chunks = getRelevantChunks(docs, userQuery, 8, {
    includeCodeBlocks: true,
    filterByCategory: ['component', 'hook', 'guide'],
  })
  const searchTime = Date.now() - startSearch
  console.log(`  ✓ Found ${chunks.length} relevant chunks in ${searchTime}ms\n`)

  // Step 3: Analyze results
  console.log('Step 3: Analyzing results...')
  const hasCode = chunks.filter(c => c.codeBlocks.length > 0).length
  const executableCode = chunks.filter(c => c.metadata.hasExecutableCode).length
  console.log(`  Code examples: ${hasCode}`)
  console.log(`  Executable: ${executableCode}`)
  console.log(`  Total tokens: ~${chunks.reduce((sum, c) => sum + c.metadata.estimatedTokens, 0)}`)
  console.log()

  // Step 4: Format for LLM
  console.log('Step 4: Formatting context...')
  const startFormat = Date.now()
  const context = formatLibraryDocsForRAG(docs, userQuery, {
    includeChunks: true,
    includeCodeBlocks: true,
    includeMetadata: true,
    maxLength: 4000,
  })
  const formatTime = Date.now() - startFormat
  console.log(`  ✓ Generated context (${context.length} chars) in ${formatTime}ms\n`)

  // Step 5: Show sample chunks
  console.log('Step 5: Top relevant chunks:')
  chunks.slice(0, 3).forEach((chunk, i) => {
    console.log(`\n  ${i + 1}. ${chunk.title}`)
    console.log(`     Type: ${chunk.type}`)
    console.log(`     Path: ${chunk.sectionPath.join(' > ')}`)
    console.log(`     Preview: ${chunk.content.slice(0, 100)}...`)
  })

  console.log('\n=== Pipeline Complete ===\n')

  return {
    docs,
    chunks,
    context,
    metrics: {
      loadTime,
      searchTime,
      formatTime,
      totalTime: loadTime + searchTime + formatTime,
    },
  }
}

/**
 * Example 6: Cross-Reference Analysis
 */
export async function crossReferenceAnalysis() {
  console.log('=== Example 6: Cross-Reference Analysis ===\n')

  const docs = await loadLibraryDocs({
    parseDocuments: true,
    chunkDocuments: true,
  })

  // Find all cross-references
  const allRefs = docs.flatMap(d => d.parsed?.crossReferences || [])

  console.log(`Total cross-references found: ${allRefs.length}\n`)

  // Group by type
  const refsByType = new Map<string, number>()
  allRefs.forEach(ref => {
    refsByType.set(ref.type, (refsByType.get(ref.type) || 0) + 1)
  })

  console.log('By Type:')
  refsByType.forEach((count, type) => {
    console.log(`  ${type}: ${count}`)
  })
  console.log()

  // Show sample references
  console.log('Sample References:\n')

  const sampleTypes = ['component-ref', 'hook-ref', 'internal-link']
  sampleTypes.forEach(type => {
    const sample = allRefs.find(r => r.type === type)
    if (sample) {
      console.log(`${type}:`)
      console.log(`  Text: ${sample.text}`)
      console.log(`  Target: ${sample.target}`)
      console.log(`  Context: ${sample.context.slice(0, 60)}...`)
      console.log()
    }
  })

  return { allRefs, refsByType }
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('\n'.repeat(2))
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║         Enhanced RAG System - Usage Examples              ║')
  console.log('╚═══════════════════════════════════════════════════════════╝')
  console.log()

  try {
    // Example 1
    await basicEnhancedRAG()
    console.log('─'.repeat(60))
    console.log()

    // Example 2
    await codeFocusedSearch()
    console.log('─'.repeat(60))
    console.log()

    // Example 3
    await categoryFilteredSearch()
    console.log('─'.repeat(60))
    console.log()

    // Example 4
    await customChunkingStrategy()
    console.log('─'.repeat(60))
    console.log()

    // Example 5
    await completeRAGPipeline('How do I use the ChatWindow component?')
    console.log('─'.repeat(60))
    console.log()

    // Example 6
    await crossReferenceAnalysis()
    console.log('─'.repeat(60))
    console.log()

    console.log('✓ All examples completed successfully!')
  } catch (error) {
    console.error('Error running examples:', error)
    throw error
  }
}

// Export for use in other files
export default {
  basicEnhancedRAG,
  codeFocusedSearch,
  categoryFilteredSearch,
  customChunkingStrategy,
  completeRAGPipeline,
  crossReferenceAnalysis,
  runAllExamples,
}
