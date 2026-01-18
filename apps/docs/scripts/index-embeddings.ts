#!/usr/bin/env tsx

/**
 * Embedding Indexer for RAG System
 *
 * Reads the documentation index (docs-index.json) and generates embeddings
 * for each chunk, storing them in the vector store for semantic search.
 *
 * Usage: npm run index-embeddings
 */

import fs from 'fs/promises'
import path from 'path'
import { generateEmbeddingsBatch } from '../lib/ai/embeddings'
import { getVectorStore, type DocChunk } from '../lib/ai/vectorStore'

interface IndexChunk {
  id: string
  title: string
  content: string
  url: string
  category: 'component' | 'hook' | 'guide' | 'cookbook' | 'example' | 'concept'
  keywords: string[]
  metadata: {
    lastUpdated: string
    tags: string[]
    section?: string
    headings?: string[]
  }
}

const BATCH_SIZE = 100 // Process embeddings in batches to avoid rate limits

/**
 * Load documentation index from JSON file
 */
async function loadDocumentationIndex(): Promise<IndexChunk[]> {
  const indexPath = path.join(process.cwd(), 'lib', 'ai', 'docs-index.json')
  
  try {
    const indexData = await fs.readFile(indexPath, 'utf-8')
    const chunks = JSON.parse(indexData) as IndexChunk[]
    console.log(`📖 Loaded ${chunks.length} chunks from index`)
    return chunks
  } catch (error) {
    console.error('❌ Failed to load documentation index:', error)
    console.error(`   Make sure to run 'npm run index-docs' first`)
    process.exit(1)
  }
}

/**
 * Convert index chunk to vector store chunk format
 */
function convertToVectorChunk(chunk: IndexChunk, embedding: number[]): DocChunk {
  return {
    id: chunk.id,
    title: chunk.title,
    content: chunk.content,
    url: chunk.url,
    category: chunk.category,
    embedding,
    metadata: {
      lastUpdated: chunk.metadata.lastUpdated,
      tags: chunk.metadata.tags,
      section: chunk.metadata.section,
      headings: chunk.metadata.headings || [],
    },
  }
}

/**
 * Main indexing function
 */
async function indexEmbeddings() {
  console.log('🔮 Clarity Chat Embedding Indexer')
  console.log('=================================\n')

  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable is not set')
    console.error('   Please add it to your .env.local file')
    process.exit(1)
  }

  // Load documentation index
  const chunks = await loadDocumentationIndex()

  if (chunks.length === 0) {
    console.error('❌ No chunks found in index')
    console.error('   Run "npm run index-docs" first to create the index')
    process.exit(1)
  }

  // Initialize vector store
  const vectorStore = getVectorStore()
  console.log('🔧 Initializing vector store...')
  await vectorStore.initialize()

  // Check existing stats
  try {
    const stats = await vectorStore.getStats()
    console.log(`📊 Existing vector store: ${stats.count} chunks\n`)
  } catch (error) {
    console.log('📊 Starting fresh vector store\n')
  }

  // Process chunks in batches
  let processed = 0
  let failed = 0
  const totalBatches = Math.ceil(chunks.length / BATCH_SIZE)

  console.log(`🚀 Processing ${chunks.length} chunks in ${totalBatches} batches...\n`)

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1

    try {
      console.log(`📦 Batch ${batchNum}/${totalBatches}: Generating embeddings for ${batch.length} chunks...`)

      // Generate embeddings for batch
      const texts = batch.map((chunk) => chunk.content)
      const embeddings = await generateEmbeddingsBatch(texts, {
        model: 'text-embedding-3-small',
      })

      console.log(`   ✅ Generated ${embeddings.length} embeddings`)

      // Convert to vector store format
      const vectorChunks = batch.map((chunk, idx) =>
        convertToVectorChunk(chunk, embeddings[idx])
      )

      // Store in vector store
      await vectorStore.upsertBatch(vectorChunks)
      processed += batch.length

      console.log(`   💾 Stored ${vectorChunks.length} chunks in vector store`)
      console.log(`   📈 Progress: ${processed}/${chunks.length} (${Math.round((processed / chunks.length) * 100)}%)\n`)

      // Small delay to avoid rate limits
      if (i + BATCH_SIZE < chunks.length) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.error(`   ❌ Error processing batch ${batchNum}:`, error)
      failed += batch.length
    }
  }

  // Final stats
  const finalStats = await vectorStore.getStats()
  
  console.log('\n📊 Indexing Complete!')
  console.log('====================')
  console.log(`✅ Successfully processed: ${processed} chunks`)
  if (failed > 0) {
    console.log(`❌ Failed: ${failed} chunks`)
  }
  console.log(`📦 Total chunks in vector store: ${finalStats.count}`)
  console.log(`🔢 Embedding dimensions: ${finalStats.dimensions}`)
  console.log('\n🎉 Embeddings are now ready for RAG-powered search!')
}

// Run the indexer
indexEmbeddings().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
