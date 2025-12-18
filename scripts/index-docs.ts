#!/usr/bin/env tsx
/**
 * Documentation Indexing Script
 *
 * Crawls all documentation files (MDX/MD), generates embeddings,
 * and stores them in the vector database for semantic search.
 *
 * Usage:
 *   pnpm index-docs           # Index all docs
 *   pnpm index-docs --clear   # Clear existing index first
 *   pnpm index-docs --dry-run # Show what would be indexed without actually indexing
 */

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import {
  generateEmbeddingsBatch,
  chunkText,
  estimateTokenCount,
  estimateEmbeddingCost,
} from '../apps/docs/lib/ai/embeddings'
import { getVectorStore, type DocChunk } from '../apps/docs/lib/ai/vectorStore'

interface DocFile {
  path: string
  category: DocChunk['category']
}

interface IndexStats {
  totalFiles: number
  totalChunks: number
  totalTokens: number
  estimatedCost: number
  startTime: number
  endTime?: number
}

// Documentation directories to index
const DOC_DIRS: { path: string; category: DocChunk['category'] }[] = [
  { path: 'apps/docs/app/reference/components', category: 'component' },
  { path: 'apps/docs/app/reference/hooks', category: 'hook' },
  { path: 'apps/docs/app/guides', category: 'guide' },
  { path: 'apps/docs/app/cookbook', category: 'cookbook' },
  { path: 'apps/docs/app/examples', category: 'example' },
  { path: 'docs', category: 'concept' }, // Root docs folder
]

// Files/directories to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  'dist',
  'build',
  '.git',
  'CHANGELOG.md',
  'LICENSE.md',
  'CONTRIBUTING.md',
  '.md', // Hidden files
  'layout.tsx',
  'page.tsx', // Skip Next.js layout files (not content)
]

/**
 * Check if a file should be excluded
 */
function shouldExclude(filePath: string): boolean {
  return EXCLUDE_PATTERNS.some((pattern) => filePath.includes(pattern))
}

/**
 * Recursively find all MDX/MD files in a directory
 */
async function findDocFiles(
  dirPath: string,
  category: DocChunk['category'],
  files: DocFile[] = []
): Promise<DocFile[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)

      if (shouldExclude(fullPath)) {
        continue
      }

      if (entry.isDirectory()) {
        await findDocFiles(fullPath, category, files)
      } else if (entry.isFile() && /\.(mdx?|tsx?)$/i.test(entry.name)) {
        // Only process MDX, MD, and TSX files (for page.tsx content)
        if (
          entry.name === 'page.tsx' ||
          entry.name.endsWith('.md') ||
          entry.name.endsWith('.mdx')
        ) {
          files.push({ path: fullPath, category })
        }
      }
    }
  } catch {
    console.warn(`Warning: Could not read directory ${dirPath}:`, error)
  }

  return files
}

/**
 * Extract content and metadata from a documentation file
 */
async function processDocFile(file: DocFile): Promise<DocChunk[]> {
  const content = await fs.readFile(file.path, 'utf-8')

  let title = ''
  let cleanContent = ''
  let tags: string[] = []
  let section: string | undefined

  // Extract metadata based on file type
  if (file.path.endsWith('.md') || file.path.endsWith('.mdx')) {
    // Parse frontmatter
    const { data, content: markdown } = matter(content)
    title = data.title || path.basename(file.path, path.extname(file.path))
    tags = data.tags || []
    section = data.section
    cleanContent = markdown
  } else if (file.path.endsWith('page.tsx')) {
    // Extract content from TSX page files
    // Look for metadata export
    const metadataMatch = content.match(
      /export const metadata[^{]*{\s*title:\s*['"]([^'"]+)['"]/s
    )
    if (metadataMatch) {
      title = metadataMatch[1]
    }

    // Extract JSX content (strings and markdown-like content)
    const strings = content.match(/['"`]([^'"`]{20,})['"`]/g) || []
    cleanContent = strings
      .map((s) => s.slice(1, -1))
      .filter((s) => !s.includes('className') && !s.includes('import'))
      .join('\n')

    // Extract from h1, h2, p tags
    const headingMatches = content.match(/<h[12][^>]*>([^<]+)<\/h[12]>/g) || []
    const paragraphMatches = content.match(/<p[^>]*>([^<]+)<\/p>/g) || []

    const extracted = [
      ...headingMatches.map((h) => h.replace(/<[^>]+>/g, '')),
      ...paragraphMatches.map((p) => p.replace(/<[^>]+>/g, '')),
    ].join('\n')

    if (extracted) {
      cleanContent = extracted + '\n\n' + cleanContent
    }

    if (!title) {
      title = path.basename(path.dirname(file.path))
    }
  }

  // Generate URL from file path
  const url = file.path
    .replace(/^apps\/docs\/app/, '')
    .replace(/\/page\.(tsx|mdx?)$/, '')
    .replace(/\.(mdx?)$/, '')
    .replace(/^docs/, '/docs')

  // Extract headings for better context
  const headings = (cleanContent.match(/^#{1,3}\s+(.+)$/gm) || [])
    .map((h) => h.replace(/^#+\s+/, ''))
    .slice(0, 5)

  // Chunk the content
  const chunks = chunkText(cleanContent, {
    maxChunkSize: 1000,
    overlap: 200,
    splitOnSentences: true,
  })

  // Create DocChunk for each chunk
  return chunks.map((chunk, index) => ({
    id: `${url.replace(/\//g, '_')}_chunk_${index}`,
    title: `${title}${chunks.length > 1 ? ` (Part ${index + 1})` : ''}`,
    content: chunk,
    url,
    category: file.category,
    embedding: [], // Will be populated later
    metadata: {
      lastUpdated: new Date().toISOString(),
      tags,
      section,
      headings,
    },
  }))
}

/**
 * Main indexing function
 */
async function indexDocs(options: { clear?: boolean; dryRun?: boolean } = {}) {
  console.log('🚀 Starting documentation indexing...\n')

  const stats: IndexStats = {
    totalFiles: 0,
    totalChunks: 0,
    totalTokens: 0,
    estimatedCost: 0,
    startTime: Date.now(),
  }

  // Initialize vector store
  const vectorStore = getVectorStore()

  if (!options.dryRun) {
    await vectorStore.initialize()

    if (options.clear) {
      console.log('🗑️  Clearing existing index...')
      await vectorStore.clear()
    }
  }

  // Find all documentation files
  console.log('📁 Scanning documentation directories...\n')
  const allFiles: DocFile[] = []

  for (const dir of DOC_DIRS) {
    const dirPath = path.resolve(process.cwd(), dir.path)
    try {
      const files = await findDocFiles(dirPath, dir.category)
      console.log(`  ✓ ${dir.path}: ${files.length} files`)
      allFiles.push(...files)
    } catch {
      console.log(`  ⚠ ${dir.path}: Not found (skipping)`)
    }
  }

  console.log(`\n📄 Found ${allFiles.length} documentation files\n`)
  stats.totalFiles = allFiles.length

  // Process all files
  console.log('📝 Processing files and generating chunks...\n')
  const allChunks: DocChunk[] = []

  for (const file of allFiles) {
    try {
      const chunks = await processDocFile(file)
      allChunks.push(...chunks)
      console.log(
        `  ✓ ${path.relative(process.cwd(), file.path)}: ${chunks.length} chunks`
      )
    } catch {
      console.error(
        `  ✗ ${path.relative(process.cwd(), file.path)}: ${error instanceof Error ? error.message : 'Error'}`
      )
    }
  }

  console.log(`\n📦 Generated ${allChunks.length} chunks\n`)
  stats.totalChunks = allChunks.length

  // Calculate token count and cost
  const texts = allChunks.map((c) => c.content)
  stats.totalTokens = texts.reduce(
    (sum, text) => sum + estimateTokenCount(text),
    0
  )
  stats.estimatedCost = estimateEmbeddingCost(stats.totalTokens)

  console.log(
    `💰 Estimated cost: $${stats.estimatedCost.toFixed(4)} (${stats.totalTokens.toLocaleString()} tokens)\n`
  )

  if (options.dryRun) {
    console.log('🏃 Dry run complete - no embeddings generated\n')
    return stats
  }

  // Generate embeddings in batches
  console.log('🧠 Generating embeddings...\n')
  const batchSize = 100 // Process 100 chunks at a time

  for (let i = 0; i < allChunks.length; i += batchSize) {
    const batch = allChunks.slice(i, i + batchSize)
    const batchTexts = batch.map((c) => c.content)

    console.log(
      `  Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allChunks.length / batchSize)}...`
    )

    try {
      const embeddings = await generateEmbeddingsBatch(batchTexts)

      // Assign embeddings to chunks
      batch.forEach((chunk, index) => {
        chunk.embedding = embeddings[index]
      })

      // Store in vector database
      await vectorStore.upsertBatch(batch)

      console.log(`  ✓ Batch ${Math.floor(i / batchSize) + 1} complete`)
    } catch {
      console.error(`  ✗ Batch ${Math.floor(i / batchSize) + 1} failed:`, error)
    }
  }

  stats.endTime = Date.now()

  // Print final statistics
  console.log('\n✅ Indexing complete!\n')
  console.log('📊 Statistics:')
  console.log(`  Files processed: ${stats.totalFiles}`)
  console.log(`  Chunks created: ${stats.totalChunks}`)
  console.log(`  Total tokens: ${stats.totalTokens.toLocaleString()}`)
  console.log(`  Estimated cost: $${stats.estimatedCost.toFixed(4)}`)
  console.log(
    `  Time elapsed: ${((stats.endTime - stats.startTime) / 1000).toFixed(2)}s`
  )

  const storeStats = await vectorStore.getStats()
  console.log(`\n📚 Vector store stats:`)
  console.log(`  Total vectors: ${storeStats.count}`)
  console.log(`  Dimensions: ${storeStats.dimensions}`)

  return stats
}

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  clear: args.includes('--clear'),
  dryRun: args.includes('--dry-run'),
}

// Run the indexing
indexDocs(options)
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
