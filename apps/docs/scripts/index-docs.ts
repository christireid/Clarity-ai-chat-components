#!/usr/bin/env tsx
import { logger } from '@clarity-chat/utils/logger';

/**
 * Documentation Indexer for AI Assistant
 *
 * Crawls all documentation pages, extracts content, and creates a searchable index
 * for the RAG-powered AI assistant.
 *
 * Usage: npm run index-docs
 */

import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { glob } from 'glob'
import matter from 'gray-matter'

interface DocChunk {
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

interface IndexStats {
  totalPages: number
  totalChunks: number
  byCategory: Record<string, number>
  avgChunkSize: number
  totalSize: number
}

/**
 * Extract all text content from TypeScript/TSX files
 */
function extractContentFromTSX(content: string): string {
  let text = content

  // Remove imports
  text = text.replace(/import\s+.*?from\s+['"].*?['"]\s*;?\n?/g, '')

  // Extract text from JSX strings
  const jsxStrings: string[] = []

  // Extract from string literals
  const stringMatches = text.matchAll(/['"`]([^'"`]{10,}?)['"`]/g)
  for (const match of stringMatches) {
    jsxStrings.push(match[1])
  }

  // Extract from JSX text content
  const jsxTextMatches = text.matchAll(/>([^<]{10,})</g)
  for (const match of jsxTextMatches) {
    const cleaned = match[1].trim()
    if (cleaned && !cleaned.startsWith('{') && !cleaned.includes('className')) {
      jsxStrings.push(cleaned)
    }
  }

  // Extract from code blocks
  const codeBlockMatches = text.matchAll(/`{3}[\w]*\n([\s\S]*?)`{3}/g)
  for (const match of codeBlockMatches) {
    jsxStrings.push(match[1])
  }

  return jsxStrings.join('\n')
}

/**
 * Extract content from markdown files
 */
function extractContentFromMarkdown(content: string): { content: string; metadata: any } {
  try {
    const { content: mdContent, data: frontMatter } = matter(content)
    return { content: mdContent, metadata: frontMatter }
  } catch {
    return { content, metadata: {} }
  }
}

/**
 * Extract headings from content
 */
function extractHeadings(content: string): string[] {
  const headings: string[] = []

  // Markdown headings
  const mdHeadings = content.matchAll(/^#{1,6}\s+(.+)$/gm)
  for (const match of mdHeadings) {
    headings.push(match[1].trim())
  }

  // JSX headings
  const jsxHeadings = content.matchAll(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/g)
  for (const match of jsxHeadings) {
    headings.push(match[1].trim())
  }

  return [...new Set(headings)]
}

/**
 * Generate keywords from content
 */
function generateKeywords(content: string, title: string): string[] {
  const words = new Set<string>()

  // Add title words
  title.toLowerCase().split(/\W+/).forEach(w => words.add(w))

  // Add significant words from content (length > 4, common in docs)
  const contentWords = content.toLowerCase().match(/\b\w{5,}\b/g) || []
  const wordFreq = new Map<string, number>()

  contentWords.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
  })

  // Take top 20 most frequent words
  const topWords = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word)

  topWords.forEach(w => words.add(w))

  // Remove common English stop words
  const stopWords = new Set(['that', 'this', 'with', 'from', 'have', 'will', 'your', 'their', 'which', 'these', 'those', 'about', 'would', 'there', 'could', 'should'])
  return Array.from(words).filter(w => w.length > 3 && !stopWords.has(w))
}

/**
 * Chunk content into smaller pieces (for better search)
 */
function chunkContent(content: string, chunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = []
  const sentences = content.split(/[.!?]+\s+/)

  let currentChunk = ''

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim())
      // Keep some overlap
      const words = currentChunk.split(/\s+/)
      currentChunk = words.slice(-overlap / 10).join(' ') + ' '
    }
    currentChunk += sentence + '. '
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim())
  }

  return chunks.length > 0 ? chunks : [content]
}

/**
 * Get category from file path
 */
function getCategoryFromPath(filePath: string): DocChunk['category'] {
  if (filePath.includes('/reference/components/')) return 'component'
  if (filePath.includes('/reference/hooks/')) return 'hook'
  if (filePath.includes('/examples/')) return 'example'
  if (filePath.includes('/cookbook/')) return 'cookbook'
  if (filePath.includes('/learn/concepts/')) return 'concept'
  return 'guide'
}

/**
 * Convert file path to URL
 */
function pathToUrl(filePath: string, appDir: string): string {
  const relativePath = path.relative(appDir, filePath)
  const url = '/' + relativePath
    .replace(/\\/g, '/')
    .replace(/\/page\.(tsx|mdx|md)$/, '')
    .replace(/^\//, '')

  return url === '/' ? '/' : `/${url}`
}

/**
 * Extract metadata from file
 */
function extractMetadata(content: string, filePath: string): { title?: string; description?: string } {
  const metadata: { title?: string; description?: string } = {}

  // Try Next.js metadata export
  const metadataMatch = content.match(/export\s+const\s+metadata[:\s]*=\s*{([^}]*)}/s)
  if (metadataMatch) {
    const metadataContent = metadataMatch[1]
    const titleMatch = metadataContent.match(/title:\s*['"]([^'"]+)['"]/s)
    if (titleMatch) metadata.title = titleMatch[1]
    const descMatch = metadataContent.match(/description:\s*['"]([^'"]+)['"]/s)
    if (descMatch) metadata.description = descMatch[1]
  }

  // Fallback to h1
  if (!metadata.title) {
    const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/)
    if (h1Match) metadata.title = h1Match[1].trim()
  }

  // Fallback to filename
  if (!metadata.title) {
    const basename = path.basename(path.dirname(filePath))
    metadata.title = basename
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  }

  return metadata
}

/**
 * Main indexing function
 */
async function indexDocumentation() {
  logger.debug('📚 Clarity Chat Documentation Indexer')
  logger.debug('=====================================\n')

  const appDir = path.join(process.cwd(), 'app')
  const pattern = path.join(appDir, '**/page.{tsx,mdx}')

  logger.debug('🔍 Scanning for documentation pages...\n')

  const files = await glob(pattern, {
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**']
  })

  logger.debug(`Found ${files.length} documentation pages\n`)

  const allChunks: DocChunk[] = []
  const stats: IndexStats = {
    totalPages: 0,
    totalChunks: 0,
    byCategory: {},
    avgChunkSize: 0,
    totalSize: 0
  }

  for (const filePath of files) {
    try {
      const rawContent = await fs.readFile(filePath, 'utf-8')
      const meta = extractMetadata(rawContent, filePath)

      if (!meta.title) {
        logger.debug(`⚠️  Skipping ${filePath} - no title found`)
        continue
      }

      // Extract content
      let content = ''
      if (filePath.endsWith('.mdx') || filePath.endsWith('.md')) {
        const { content: mdContent } = extractContentFromMarkdown(rawContent)
        content = mdContent
      } else {
        content = extractContentFromTSX(rawContent)
      }

      if (!content || content.length < 100) {
        logger.debug(`⚠️  Skipping ${filePath} - insufficient content`)
        continue
      }

      const category = getCategoryFromPath(filePath)
      const url = pathToUrl(filePath, appDir)
      const headings = extractHeadings(content)
      const keywords = generateKeywords(content, meta.title)

      // Chunk the content
      const chunks = chunkContent(content)

      chunks.forEach((chunk, idx) => {
        const chunkId = `${category}-${path.basename(filePath, path.extname(filePath))}-${idx}`

        allChunks.push({
          id: chunkId,
          title: idx === 0 ? meta.title! : `${meta.title} (${idx + 1})`,
          content: chunk,
          url,
          category,
          keywords,
          metadata: {
            lastUpdated: new Date().toISOString(),
            tags: keywords.slice(0, 10),
            section: idx === 0 ? undefined : `Part ${idx + 1}`,
            headings: idx === 0 ? headings : []
          }
        })

        stats.totalSize += chunk.length
      })

      stats.totalPages++
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1

      logger.debug(`✅ ${meta.title} → ${chunks.length} chunks`)
    } catch (error) {
      logger.logger.error(`❌ Error processing ${filePath}:`, error)
    }
  }

  stats.totalChunks = allChunks.length
  stats.avgChunkSize = Math.round(stats.totalSize / stats.totalChunks)

  // Save index
  const outputPath = path.join(process.cwd(), 'lib', 'ai', 'docs-index.json')
  await fs.writeFile(outputPath, JSON.stringify(allChunks, null, 2), 'utf-8')

  logger.debug('\n📊 Indexing Statistics:')
  logger.debug('=======================')
  logger.debug(`Total Pages: ${stats.totalPages}`)
  logger.debug(`Total Chunks: ${stats.totalChunks}`)
  logger.debug(`Average Chunk Size: ${stats.avgChunkSize} characters`)
  logger.debug(`\nBy Category:`)
  Object.entries(stats.byCategory).forEach(([cat, count]) => {
    logger.debug(`  ${cat}: ${count}`)
  })
  logger.debug(`\n✅ Index saved to: ${outputPath}`)
  logger.debug(`📦 Total index size: ${(stats.totalSize / 1024).toFixed(2)} KB`)
}

// Run the indexer
indexDocumentation().catch(console.error)
