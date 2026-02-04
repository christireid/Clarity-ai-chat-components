/**
 * Library Context Module
 *
 * Provides access to actual library files (READMEs, CLAUDE.md, source files)
 * for enhanced RAG responses with deep library knowledge.
 *
 * Enhanced with:
 * - Advanced markdown parsing
 * - Section-aware chunking
 * - Code block extraction and indexing
 * - Metadata extraction
 * - Cross-reference detection
 */

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { parseMarkdownDocument, type ParsedDocument } from './documentParser'
import { chunkDocument, type DocumentChunk, type ChunkingOptions } from './documentChunker'

const readFile = promisify(fs.readFile)
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

/**
 * Library documentation source
 */
export interface LibraryDoc {
  path: string
  content: string
  type: 'readme' | 'claude' | 'source' | 'docs'
  package?: string
  title: string
  /** Enhanced parsed structure */
  parsed?: ParsedDocument
  /** Searchable chunks */
  chunks?: DocumentChunk[]
}

/**
 * Cache for library documentation to avoid re-reading files
 */
const libraryDocsCache: Map<string, LibraryDoc[]> = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
let lastCacheTime = 0

/**
 * Get the root directory of the monorepo
 */
function getMonorepoRoot(): string {
  // From streamlined-docs app, go up to monorepo root
  return path.resolve(process.cwd(), '../..')
}

/**
 * Load all library documentation files with enhanced parsing
 */
export async function loadLibraryDocs(options?: {
  parseDocuments?: boolean
  chunkDocuments?: boolean
  chunkingOptions?: ChunkingOptions
}): Promise<LibraryDoc[]> {
  const {
    parseDocuments = true,
    chunkDocuments = true,
    chunkingOptions,
  } = options || {}

  // Check cache
  const now = Date.now()
  if (libraryDocsCache.has('all') && now - lastCacheTime < CACHE_TTL) {
    return libraryDocsCache.get('all')!
  }

  const docs: LibraryDoc[] = []
  const monorepoRoot = getMonorepoRoot()

  try {
    // 1. Load CLAUDE.md files from packages
    const packagesDir = path.join(monorepoRoot, 'packages')
    const packages = await readdir(packagesDir)

    for (const pkg of packages) {
      const pkgPath = path.join(packagesDir, pkg)
      const pkgStat = await stat(pkgPath)

      if (!pkgStat.isDirectory()) continue

      // Look for CLAUDE.md
      const claudePath = path.join(pkgPath, 'CLAUDE.md')
      try {
        const content = await readFile(claudePath, 'utf-8')
        const doc = await processDocument({
          path: claudePath,
          content,
          type: 'claude',
          package: pkg,
          title: `${pkg} - Development Guide`,
        }, parseDocuments, chunkDocuments, chunkingOptions)
        docs.push(doc)
      } catch (error) {
        // File doesn't exist, skip
      }

      // Look for README.md
      const readmePath = path.join(pkgPath, 'README.md')
      try {
        const content = await readFile(readmePath, 'utf-8')
        const doc = await processDocument({
          path: readmePath,
          content,
          type: 'readme',
          package: pkg,
          title: `${pkg} - README`,
        }, parseDocuments, chunkDocuments, chunkingOptions)
        docs.push(doc)
      } catch (error) {
        // File doesn't exist, skip
      }

      // Look for docs directory
      const docsDir = path.join(pkgPath, 'docs')
      try {
        const docsStat = await stat(docsDir)
        if (docsStat.isDirectory()) {
          const docFiles = await readdir(docsDir)
          for (const docFile of docFiles) {
            if (docFile.endsWith('.md') || docFile.endsWith('.mdx')) {
              const docPath = path.join(docsDir, docFile)
              const content = await readFile(docPath, 'utf-8')
              const doc = await processDocument({
                path: docPath,
                content,
                type: 'docs',
                package: pkg,
                title: `${pkg} - ${docFile.replace(/\.(md|mdx)$/, '')}`,
              }, parseDocuments, chunkDocuments, chunkingOptions)
              docs.push(doc)
            }
          }
        }
      } catch (error) {
        // Docs directory doesn't exist, skip
      }
    }

    // 2. Load monorepo-level docs
    const monorepoDocsDir = path.join(monorepoRoot, 'docs')
    try {
      const docFiles = await readdir(monorepoDocsDir)
      for (const docFile of docFiles) {
        if (docFile.endsWith('.md') || docFile.endsWith('.mdx')) {
          const docPath = path.join(monorepoDocsDir, docFile)
          const content = await readFile(docPath, 'utf-8')
          const doc = await processDocument({
            path: docPath,
            content,
            type: 'docs',
            title: docFile.replace(/\.(md|mdx)$/, ''),
          }, parseDocuments, chunkDocuments, chunkingOptions)
          docs.push(doc)
        }
      }
    } catch (error) {
      // Docs directory doesn't exist, skip
    }

    // Cache the results
    libraryDocsCache.set('all', docs)
    lastCacheTime = now

    return docs
  } catch (error) {
    console.error('Error loading library docs:', error)
    return []
  }
}

/**
 * Process a document with parsing and chunking
 */
async function processDocument(
  doc: LibraryDoc,
  parseDocuments: boolean,
  chunkDocuments: boolean,
  chunkingOptions?: ChunkingOptions
): Promise<LibraryDoc> {
  if (!parseDocuments) {
    return doc
  }

  try {
    // Parse the markdown document
    const parsed = parseMarkdownDocument(doc.content, doc.path)
    doc.parsed = parsed

    // Update title from parsed document if available
    if (parsed.title) {
      doc.title = parsed.title
    }

    // Chunk the document if requested
    if (chunkDocuments) {
      doc.chunks = chunkDocument(parsed, chunkingOptions)
    }
  } catch (error) {
    console.error(`Error processing document ${doc.path}:`, error)
  }

  return doc
}

/**
 * Search library docs for relevant content (enhanced with chunk-level search)
 */
export function searchLibraryDocs(
  docs: LibraryDoc[],
  query: string,
  topK: number = 3,
  options?: {
    searchChunks?: boolean
    includeCodeBlocks?: boolean
    filterByCategory?: string[]
  }
): LibraryDoc[] {
  const { searchChunks = true, includeCodeBlocks = true, filterByCategory } = options || {}
  const lowerQuery = query.toLowerCase()

  if (searchChunks && docs.some(d => d.chunks)) {
    // Use chunk-based search for more precise results
    return searchDocumentChunks(docs, query, topK, { includeCodeBlocks, filterByCategory })
  }

  // Fallback to traditional document-level search
  const scored = docs
    .map((doc) => {
      let score = 0
      const lowerContent = doc.content.toLowerCase()
      const lowerTitle = doc.title.toLowerCase()

      // Filter by category if specified
      if (filterByCategory && doc.parsed) {
        if (!filterByCategory.includes(doc.parsed.category)) {
          return { doc, score: 0 }
        }
      }

      // Title match (high weight)
      if (lowerTitle.includes(lowerQuery)) {
        score += 10
      }

      // Exact phrase match (high weight)
      if (lowerContent.includes(lowerQuery)) {
        score += 5
      }

      // Word matches (lower weight)
      const words = lowerQuery.split(/\s+/)
      for (const word of words) {
        if (word.length < 3) continue // Skip short words
        const matches = (lowerContent.match(new RegExp(word, 'g')) || []).length
        score += matches * 0.1
      }

      // Boost CLAUDE.md and README files
      if (doc.type === 'claude') score *= 1.5
      if (doc.type === 'readme') score *= 1.2

      // Boost if tags match (from parsed document)
      if (doc.parsed) {
        const matchingTags = doc.parsed.tags.filter(tag =>
          lowerQuery.includes(tag.toLowerCase())
        )
        score += matchingTags.length * 2
      }

      return { doc, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, topK).map((item) => item.doc)
}

/**
 * Search document chunks for more precise results
 */
export function searchDocumentChunks(
  docs: LibraryDoc[],
  query: string,
  topK: number = 5,
  options?: {
    includeCodeBlocks?: boolean
    filterByCategory?: string[]
  }
): LibraryDoc[] {
  const { includeCodeBlocks = true, filterByCategory } = options || {}
  const lowerQuery = query.toLowerCase()
  const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2)

  interface ScoredChunk {
    doc: LibraryDoc
    chunk: DocumentChunk
    score: number
  }

  const scoredChunks: ScoredChunk[] = []

  for (const doc of docs) {
    if (!doc.chunks) continue

    for (const chunk of doc.chunks) {
      // Filter by category
      if (filterByCategory && !filterByCategory.includes(chunk.category)) {
        continue
      }

      // Filter code blocks if not wanted
      if (!includeCodeBlocks && chunk.type === 'code-example') {
        continue
      }

      let score = 0
      const lowerTitle = chunk.title.toLowerCase()
      const lowerContent = chunk.content.toLowerCase()

      // Title exact match (highest weight)
      if (lowerTitle === lowerQuery) {
        score += 20
      } else if (lowerTitle.includes(lowerQuery)) {
        score += 10
      }

      // Section path matches (for context awareness)
      const sectionPathText = chunk.sectionPath.join(' ').toLowerCase()
      if (sectionPathText.includes(lowerQuery)) {
        score += 8
      }

      // Exact phrase in content
      if (lowerContent.includes(lowerQuery)) {
        score += 5
      }

      // Keyword matches
      const keywordMatches = chunk.keywords.filter(k =>
        queryWords.some(qw => k.toLowerCase().includes(qw) || qw.includes(k.toLowerCase()))
      ).length
      score += keywordMatches * 2

      // Word frequency in content
      for (const word of queryWords) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi')
        const matches = (lowerContent.match(regex) || []).length
        score += Math.log(matches + 1) * 0.5
      }

      // Tag matches
      const tagMatches = chunk.metadata.tags.filter(tag =>
        queryWords.some(qw => tag.toLowerCase().includes(qw))
      ).length
      score += tagMatches * 1.5

      // Boost for chunk type relevance
      if (query.toLowerCase().includes('example') && chunk.type === 'code-example') {
        score *= 1.5
      }
      if (query.toLowerCase().includes('api') && chunk.type === 'api-reference') {
        score *= 1.5
      }

      // Boost for executable code when query is about implementation
      if (chunk.metadata.hasExecutableCode &&
          (query.toLowerCase().includes('how') || query.toLowerCase().includes('implement'))) {
        score *= 1.3
      }

      // Boost recent content
      const daysSinceUpdate = (Date.now() - new Date(chunk.metadata.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceUpdate < 7) {
        score *= 1.1
      }

      if (score > 0) {
        scoredChunks.push({ doc, chunk, score })
      }
    }
  }

  // Sort by score and take top K
  scoredChunks.sort((a, b) => b.score - a.score)
  const topChunks = scoredChunks.slice(0, topK)

  // Group by document and return unique documents
  const uniqueDocs = new Map<string, LibraryDoc>()
  for (const { doc } of topChunks) {
    if (!uniqueDocs.has(doc.path)) {
      uniqueDocs.set(doc.path, doc)
    }
  }

  return Array.from(uniqueDocs.values())
}

/**
 * Get relevant chunks from documents (for detailed RAG context)
 */
export function getRelevantChunks(
  docs: LibraryDoc[],
  query: string,
  topK: number = 5,
  options?: {
    includeCodeBlocks?: boolean
    filterByCategory?: string[]
  }
): DocumentChunk[] {
  const { includeCodeBlocks = true, filterByCategory } = options || {}
  const lowerQuery = query.toLowerCase()
  const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2)

  interface ScoredChunk {
    chunk: DocumentChunk
    score: number
  }

  const scoredChunks: ScoredChunk[] = []

  for (const doc of docs) {
    if (!doc.chunks) continue

    for (const chunk of doc.chunks) {
      // Apply filters (same as searchDocumentChunks)
      if (filterByCategory && !filterByCategory.includes(chunk.category)) continue
      if (!includeCodeBlocks && chunk.type === 'code-example') continue

      let score = 0
      const lowerTitle = chunk.title.toLowerCase()
      const lowerContent = chunk.content.toLowerCase()

      // Scoring (same as searchDocumentChunks)
      if (lowerTitle === lowerQuery) score += 20
      else if (lowerTitle.includes(lowerQuery)) score += 10

      const sectionPathText = chunk.sectionPath.join(' ').toLowerCase()
      if (sectionPathText.includes(lowerQuery)) score += 8
      if (lowerContent.includes(lowerQuery)) score += 5

      const keywordMatches = chunk.keywords.filter(k =>
        queryWords.some(qw => k.toLowerCase().includes(qw) || qw.includes(k.toLowerCase()))
      ).length
      score += keywordMatches * 2

      for (const word of queryWords) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi')
        const matches = (lowerContent.match(regex) || []).length
        score += Math.log(matches + 1) * 0.5
      }

      const tagMatches = chunk.metadata.tags.filter(tag =>
        queryWords.some(qw => tag.toLowerCase().includes(qw))
      ).length
      score += tagMatches * 1.5

      if (query.toLowerCase().includes('example') && chunk.type === 'code-example') score *= 1.5
      if (query.toLowerCase().includes('api') && chunk.type === 'api-reference') score *= 1.5
      if (chunk.metadata.hasExecutableCode &&
          (query.toLowerCase().includes('how') || query.toLowerCase().includes('implement'))) {
        score *= 1.3
      }

      if (score > 0) {
        scoredChunks.push({ chunk, score })
      }
    }
  }

  // Sort and return top K chunks
  scoredChunks.sort((a, b) => b.score - a.score)
  return scoredChunks.slice(0, topK).map(sc => sc.chunk)
}

/**
 * Format library docs for RAG context (enhanced with chunk-level details)
 */
export function formatLibraryDocsForRAG(
  docs: LibraryDoc[],
  query?: string,
  options?: {
    maxLength?: number
    includeChunks?: boolean
    includeCodeBlocks?: boolean
    includeMetadata?: boolean
  }
): string {
  if (docs.length === 0) return ''

  const {
    maxLength = 4000,
    includeChunks = true,
    includeCodeBlocks = true,
    includeMetadata = true,
  } = options || {}

  // If chunks are available and query provided, use chunk-based formatting
  if (includeChunks && query && docs.some(d => d.chunks)) {
    return formatChunksForRAG(docs, query, { maxLength, includeCodeBlocks, includeMetadata })
  }

  // Fallback to document-level formatting
  const sections = docs.map((doc) => {
    let section = `## ${doc.title}\n\n`
    section += `**Source:** ${doc.path}\n`
    section += `**Type:** ${doc.type}\n`

    if (doc.package) {
      section += `**Package:** @clarity-chat/${doc.package}\n`
    }

    // Add metadata if available and requested
    if (includeMetadata && doc.parsed) {
      section += `**Category:** ${doc.parsed.category}\n`

      if (doc.parsed.tags.length > 0) {
        section += `**Tags:** ${doc.parsed.tags.slice(0, 5).join(', ')}\n`
      }

      if (doc.parsed.codeBlocks.length > 0) {
        const languages = [...new Set(doc.parsed.codeBlocks.map(cb => cb.language))]
        section += `**Languages:** ${languages.join(', ')}\n`
      }
    }

    section += '\n'

    // Truncate content to fit in context window
    const remainingLength = maxLength - section.length
    if (doc.content.length > remainingLength) {
      section += doc.content.substring(0, remainingLength - 50) + '\n\n[Content truncated...]'
    } else {
      section += doc.content
    }

    return section
  })

  return `# Library Documentation Context

The following documentation files from the actual library codebase are relevant to your query:

${sections.join('\n\n---\n\n')}`
}

/**
 * Format chunks for RAG context (more precise than full documents)
 */
function formatChunksForRAG(
  docs: LibraryDoc[],
  query: string,
  options: {
    maxLength: number
    includeCodeBlocks: boolean
    includeMetadata: boolean
  }
): string {
  const { maxLength, includeCodeBlocks, includeMetadata } = options

  // Get relevant chunks
  const chunks = getRelevantChunks(docs, query, 8, { includeCodeBlocks })

  if (chunks.length === 0) {
    return 'No relevant documentation chunks found for this query.'
  }

  let output = '# Relevant Documentation\n\n'
  let currentLength = output.length

  for (const chunk of chunks) {
    let section = `## ${chunk.title}\n\n`

    // Add breadcrumb/section path
    if (chunk.sectionPath.length > 1) {
      section += `**Section:** ${chunk.sectionPath.join(' > ')}\n`
    }

    section += `**Source:** ${chunk.url}\n`
    section += `**Type:** ${chunk.type}\n`

    if (includeMetadata) {
      if (chunk.metadata.languages.length > 0) {
        section += `**Languages:** ${chunk.metadata.languages.join(', ')}\n`
      }

      if (chunk.metadata.hasExecutableCode) {
        section += `**Executable Code:** Yes\n`
      }

      if (chunk.metadata.tags.length > 0) {
        section += `**Tags:** ${chunk.metadata.tags.slice(0, 5).join(', ')}\n`
      }
    }

    section += '\n'

    // Add content
    const remainingLength = maxLength - currentLength - section.length
    if (remainingLength < 100) {
      break // Not enough space for more chunks
    }

    if (chunk.content.length > remainingLength) {
      section += chunk.content.substring(0, remainingLength - 50) + '\n\n[Content truncated...]'
    } else {
      section += chunk.content
    }

    // Add cross-references if available
    if (chunk.crossReferences.length > 0 && includeMetadata) {
      section += '\n\n**Related:**\n'
      for (const ref of chunk.crossReferences.slice(0, 3)) {
        section += `- ${ref.text} (${ref.type})\n`
      }
    }

    section += '\n\n---\n\n'

    // Check if adding this section exceeds max length
    if (currentLength + section.length > maxLength) {
      break
    }

    output += section
    currentLength += section.length
  }

  return output
}

/**
 * Get context about the current page
 * This would ideally be passed from the client, but we can infer some info from the path
 */
export function getCurrentPageContext(currentPath?: string): string {
  if (!currentPath) return ''

  const segments = currentPath.split('/').filter(Boolean)

  // Infer page type from path
  if (segments.includes('reference')) {
    return `**Current Page:** API Reference (${segments.join(' > ')})
**Context:** User is viewing technical API documentation and may need specific prop/parameter information.`
  }

  if (segments.includes('guides')) {
    return `**Current Page:** Guide (${segments.join(' > ')})
**Context:** User is reading a tutorial or guide and may need conceptual explanations or examples.`
  }

  if (segments.includes('examples')) {
    return `**Current Page:** Examples (${segments.join(' > ')})
**Context:** User is looking at code examples and may want to understand implementation details.`
  }

  return `**Current Page:** ${segments.join(' > ')}
**Context:** User is browsing the documentation site.`
}

/**
 * Enhance RAG context with library documentation
 */
export async function enhanceRAGWithLibraryContext(
  query: string,
  currentPath?: string
): Promise<{ libraryContext: string; pageContext: string }> {
  // Load library docs
  const allDocs = await loadLibraryDocs()

  // Search for relevant docs
  const relevantDocs = searchLibraryDocs(allDocs, query, 3)

  // Format for RAG
  const libraryContext = formatLibraryDocsForRAG(relevantDocs)

  // Get page context
  const pageContext = getCurrentPageContext(currentPath)

  return { libraryContext, pageContext }
}
