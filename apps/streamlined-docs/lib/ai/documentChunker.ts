/**
 * Advanced Document Chunking
 *
 * Section-aware chunking strategies for optimal RAG retrieval:
 * - Semantic chunking (preserve meaning boundaries)
 * - Hierarchical chunking (maintain context hierarchy)
 * - Code-aware chunking (keep code blocks intact)
 * - Overlap strategies for better retrieval
 */

import type {
  ParsedDocument,
  DocumentSection,
  CodeBlock,
  CrossReference,
} from './documentParser'

export interface DocumentChunk {
  /** Unique chunk ID */
  id: string
  /** Chunk title (from section or generated) */
  title: string
  /** Chunk content (markdown) */
  content: string
  /** Document URL/path */
  url: string
  /** Document category */
  category: string
  /** Chunk type */
  type: ChunkType
  /** Section ID this chunk belongs to */
  sectionId?: string
  /** Parent section hierarchy (breadcrumb) */
  sectionPath: string[]
  /** Code blocks in this chunk */
  codeBlocks: CodeBlock[]
  /** Cross-references in this chunk */
  crossReferences: CrossReference[]
  /** Keywords for keyword-based search */
  keywords: string[]
  /** Metadata for filtering and scoring */
  metadata: {
    /** Heading level (for sections) */
    headingLevel?: number
    /** Programming languages in code blocks */
    languages: string[]
    /** Whether chunk contains executable code */
    hasExecutableCode: boolean
    /** Whether chunk is a complete example */
    isCompleteExample: boolean
    /** Tags from document */
    tags: string[]
    /** Last updated timestamp */
    lastUpdated: string
    /** Section hierarchy (H1 > H2 > H3) */
    headings: string[]
    /** Word count */
    wordCount: number
    /** Estimated token count */
    estimatedTokens: number
  }
}

export type ChunkType =
  | 'section'           // Regular document section
  | 'code-example'      // Standalone code example
  | 'api-reference'     // API/props documentation
  | 'overview'          // Document overview/introduction
  | 'conceptual'        // Conceptual explanation

export interface ChunkingOptions {
  /** Maximum chunk size in characters */
  maxChunkSize?: number
  /** Minimum chunk size in characters */
  minChunkSize?: number
  /** Overlap size in characters */
  overlapSize?: number
  /** Strategy for chunking */
  strategy?: ChunkingStrategy
  /** Whether to create separate chunks for code blocks */
  separateCodeBlocks?: boolean
  /** Whether to include context from parent sections */
  includeParentContext?: boolean
  /** Maximum heading level to chunk at (1-6) */
  maxHeadingLevel?: number
}

export type ChunkingStrategy =
  | 'semantic'      // Chunk at natural boundaries (sections, paragraphs)
  | 'fixed-size'    // Fixed-size chunks with overlap
  | 'hierarchical'  // Preserve section hierarchy
  | 'hybrid'        // Combination of semantic and fixed-size

const DEFAULT_OPTIONS: Required<ChunkingOptions> = {
  maxChunkSize: 1000,
  minChunkSize: 100,
  overlapSize: 200,
  strategy: 'hierarchical',
  separateCodeBlocks: true,
  includeParentContext: true,
  maxHeadingLevel: 3,
}

/**
 * Chunk a parsed document into searchable chunks
 */
export function chunkDocument(
  document: ParsedDocument,
  options: ChunkingOptions = {}
): DocumentChunk[] {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  switch (opts.strategy) {
    case 'semantic':
      return semanticChunking(document, opts)
    case 'fixed-size':
      return fixedSizeChunking(document, opts)
    case 'hierarchical':
      return hierarchicalChunking(document, opts)
    case 'hybrid':
      return hybridChunking(document, opts)
    default:
      return hierarchicalChunking(document, opts)
  }
}

/**
 * Hierarchical chunking - preserve section boundaries
 */
function hierarchicalChunking(
  document: ParsedDocument,
  options: Required<ChunkingOptions>
): DocumentChunk[] {
  const chunks: DocumentChunk[] = []

  // Create overview chunk from document title and first paragraph
  const overviewChunk = createOverviewChunk(document)
  if (overviewChunk) {
    chunks.push(overviewChunk)
  }

  // Process each section
  for (const section of document.sections) {
    // Skip deeply nested sections (handled by parent)
    if (section.level > options.maxHeadingLevel) continue

    // Get section hierarchy
    const sectionPath = getSectionPath(section, document.sections)

    // Create chunk for this section
    const chunk = createSectionChunk(
      section,
      document,
      sectionPath,
      options
    )

    if (chunk) {
      chunks.push(chunk)
    }

    // Create separate chunks for code blocks if enabled
    if (options.separateCodeBlocks && section.codeBlockIds.length > 0) {
      const codeChunks = createCodeBlockChunks(
        section,
        document,
        sectionPath
      )
      chunks.push(...codeChunks)
    }
  }

  return chunks
}

/**
 * Semantic chunking - chunk at natural boundaries
 */
function semanticChunking(
  document: ParsedDocument,
  options: Required<ChunkingOptions>
): DocumentChunk[] {
  const chunks: DocumentChunk[] = []

  // Start with hierarchical base
  const baseChunks = hierarchicalChunking(document, options)

  // Split large chunks at paragraph boundaries
  for (const chunk of baseChunks) {
    if (chunk.content.length <= options.maxChunkSize) {
      chunks.push(chunk)
      continue
    }

    // Split at paragraph boundaries
    const subChunks = splitAtParagraphs(chunk, options.maxChunkSize)
    chunks.push(...subChunks)
  }

  return chunks
}

/**
 * Fixed-size chunking with overlap
 */
function fixedSizeChunking(
  document: ParsedDocument,
  options: Required<ChunkingOptions>
): DocumentChunk[] {
  const chunks: DocumentChunk[] = []

  // Combine all sections into full text
  const fullText = document.sections
    .map(s => `${'#'.repeat(s.level)} ${s.heading}\n\n${s.content}`)
    .join('\n\n')

  const { maxChunkSize, overlapSize } = options
  let start = 0
  let chunkIndex = 0

  while (start < fullText.length) {
    const end = Math.min(start + maxChunkSize, fullText.length)
    let chunkContent = fullText.slice(start, end)

    // Try to break at sentence boundary
    if (end < fullText.length) {
      const sentenceEnd = chunkContent.lastIndexOf('. ')
      if (sentenceEnd > maxChunkSize * 0.7) {
        chunkContent = chunkContent.slice(0, sentenceEnd + 1)
      }
    }

    const chunk: DocumentChunk = {
      id: `${document.path}-chunk-${chunkIndex}`,
      title: `${document.title} - Part ${chunkIndex + 1}`,
      content: chunkContent.trim(),
      url: document.path,
      category: document.category,
      type: 'section',
      sectionPath: [],
      codeBlocks: [],
      crossReferences: [],
      keywords: extractKeywords(chunkContent),
      metadata: {
        languages: [],
        hasExecutableCode: false,
        isCompleteExample: false,
        tags: document.tags,
        lastUpdated: document.lastModified.toISOString(),
        headings: [],
        wordCount: chunkContent.split(/\s+/).length,
        estimatedTokens: Math.ceil(chunkContent.length / 4),
      },
    }

    chunks.push(chunk)

    // Move forward with overlap
    start = end - overlapSize
    chunkIndex++
  }

  return chunks
}

/**
 * Hybrid chunking - semantic with fixed-size fallback
 */
function hybridChunking(
  document: ParsedDocument,
  options: Required<ChunkingOptions>
): DocumentChunk[] {
  // Start with hierarchical chunking
  const semanticChunks = hierarchicalChunking(document, options)

  // Split oversized chunks with fixed-size strategy
  const finalChunks: DocumentChunk[] = []

  for (const chunk of semanticChunks) {
    if (chunk.content.length <= options.maxChunkSize) {
      finalChunks.push(chunk)
    } else {
      // Use fixed-size splitting for large chunks
      const subChunks = splitChunkFixedSize(chunk, options)
      finalChunks.push(...subChunks)
    }
  }

  return finalChunks
}

/**
 * Create overview chunk from document introduction
 */
function createOverviewChunk(document: ParsedDocument): DocumentChunk | null {
  // Get content before first heading
  const firstSection = document.sections[0]
  if (!firstSection) return null

  // Look for introduction content
  let introContent = ''

  // Check frontmatter description
  if (document.frontmatter.description) {
    introContent = String(document.frontmatter.description) + '\n\n'
  }

  // Get first paragraph
  const firstParagraph = firstSection.content.split('\n\n')[0]
  if (firstParagraph) {
    introContent += firstParagraph
  }

  if (!introContent.trim()) return null

  return {
    id: `${document.path}-overview`,
    title: document.title,
    content: introContent.trim(),
    url: document.path,
    category: document.category,
    type: 'overview',
    sectionPath: [],
    codeBlocks: [],
    crossReferences: [],
    keywords: extractKeywords(introContent),
    metadata: {
      languages: [],
      hasExecutableCode: false,
      isCompleteExample: false,
      tags: document.tags,
      lastUpdated: document.lastModified.toISOString(),
      headings: [document.title],
      wordCount: introContent.split(/\s+/).length,
      estimatedTokens: Math.ceil(introContent.length / 4),
    },
  }
}

/**
 * Create a chunk from a section
 */
function createSectionChunk(
  section: DocumentSection,
  document: ParsedDocument,
  sectionPath: string[],
  options: Required<ChunkingOptions>
): DocumentChunk | null {
  let content = section.content

  // Skip empty sections
  if (!content.trim() && section.codeBlockIds.length === 0) {
    return null
  }

  // Include parent context if enabled
  if (options.includeParentContext && section.parentId) {
    const parentSection = document.sections.find(s => s.id === section.parentId)
    if (parentSection) {
      // Add parent heading as context
      content = `Parent: ${parentSection.heading}\n\n${content}`
    }
  }

  // Get code blocks for this section
  const codeBlocks = document.codeBlocks.filter(cb =>
    section.codeBlockIds.includes(cb.id)
  )

  // Get cross-references
  const crossReferences = document.crossReferences.filter(ref =>
    section.crossReferenceIds.includes(ref.id)
  )

  // Determine chunk type
  const type = inferChunkType(section, content, codeBlocks)

  // Extract languages from code blocks
  const languages = [...new Set(codeBlocks.map(cb => cb.language))]

  // Check if has executable code
  const hasExecutableCode = codeBlocks.some(cb => cb.isExecutable)

  // Check if is complete example
  const isCompleteExample =
    hasExecutableCode &&
    (content.toLowerCase().includes('example') ||
      section.heading.toLowerCase().includes('example'))

  return {
    id: section.id,
    title: section.heading,
    content,
    url: document.path,
    category: document.category,
    type,
    sectionId: section.id,
    sectionPath,
    codeBlocks,
    crossReferences,
    keywords: extractKeywords(content),
    metadata: {
      headingLevel: section.level,
      languages,
      hasExecutableCode,
      isCompleteExample,
      tags: document.tags,
      lastUpdated: document.lastModified.toISOString(),
      headings: sectionPath,
      wordCount: content.split(/\s+/).length,
      estimatedTokens: Math.ceil(content.length / 4),
    },
  }
}

/**
 * Create separate chunks for code blocks
 */
function createCodeBlockChunks(
  section: DocumentSection,
  document: ParsedDocument,
  sectionPath: string[]
): DocumentChunk[] {
  const chunks: DocumentChunk[] = []

  const codeBlocks = document.codeBlocks.filter(cb =>
    section.codeBlockIds.includes(cb.id)
  )

  for (const codeBlock of codeBlocks) {
    // Only create separate chunks for substantial code blocks
    if (codeBlock.code.length < 50) continue

    const content = [
      codeBlock.caption ? `**${codeBlock.caption}**\n` : '',
      `Language: ${codeBlock.language}\n`,
      `\`\`\`${codeBlock.language}`,
      codeBlock.code,
      '```',
    ].join('\n')

    chunks.push({
      id: codeBlock.id,
      title: codeBlock.caption || `${section.heading} - Code Example`,
      content,
      url: `${document.path}#${section.id}`,
      category: document.category,
      type: 'code-example',
      sectionId: section.id,
      sectionPath,
      codeBlocks: [codeBlock],
      crossReferences: [],
      keywords: codeBlock.keywords,
      metadata: {
        headingLevel: section.level,
        languages: [codeBlock.language],
        hasExecutableCode: codeBlock.isExecutable,
        isCompleteExample: codeBlock.isExecutable,
        tags: document.tags,
        lastUpdated: document.lastModified.toISOString(),
        headings: sectionPath,
        wordCount: codeBlock.code.split(/\s+/).length,
        estimatedTokens: Math.ceil(codeBlock.code.length / 4),
      },
    })
  }

  return chunks
}

/**
 * Get section hierarchy path (breadcrumb)
 */
function getSectionPath(
  section: DocumentSection,
  allSections: DocumentSection[]
): string[] {
  const path: string[] = []
  let current: DocumentSection | undefined = section

  while (current) {
    path.unshift(current.heading)
    current = current.parentId
      ? allSections.find(s => s.id === current!.parentId)
      : undefined
  }

  return path
}

/**
 * Infer chunk type from content
 */
function inferChunkType(
  section: DocumentSection,
  content: string,
  codeBlocks: CodeBlock[]
): ChunkType {
  const headingLower = section.heading.toLowerCase()
  const contentLower = content.toLowerCase()

  // API reference
  if (
    headingLower.includes('api') ||
    headingLower.includes('props') ||
    headingLower.includes('parameters') ||
    contentLower.includes('| prop |') ||
    contentLower.includes('| parameter |')
  ) {
    return 'api-reference'
  }

  // Code example
  if (
    codeBlocks.length > 0 &&
    (headingLower.includes('example') ||
      headingLower.includes('usage') ||
      contentLower.includes('example:'))
  ) {
    return 'code-example'
  }

  // Overview
  if (
    section.level === 1 ||
    headingLower.includes('overview') ||
    headingLower.includes('introduction')
  ) {
    return 'overview'
  }

  // Conceptual
  if (
    headingLower.includes('concept') ||
    headingLower.includes('understanding') ||
    headingLower.includes('how it works')
  ) {
    return 'conceptual'
  }

  return 'section'
}

/**
 * Extract keywords from content
 */
function extractKeywords(content: string): string[] {
  const keywords = new Set<string>()

  // Extract words (3+ characters)
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3)

  // Common stopwords to exclude
  const stopwords = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'with',
    'this', 'that', 'from', 'have', 'has', 'was', 'were',
    'been', 'being', 'will', 'can', 'could', 'would', 'should',
  ])

  // Calculate word frequency
  const wordFreq = new Map<string, number>()
  for (const word of words) {
    if (!stopwords.has(word)) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
    }
  }

  // Sort by frequency and take top keywords
  const sortedWords = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word)

  return sortedWords
}

/**
 * Split chunk at paragraph boundaries
 */
function splitAtParagraphs(
  chunk: DocumentChunk,
  maxSize: number
): DocumentChunk[] {
  const paragraphs = chunk.content.split('\n\n')
  const subChunks: DocumentChunk[] = []

  let currentContent = ''
  let subChunkIndex = 0

  for (const paragraph of paragraphs) {
    if ((currentContent + paragraph).length > maxSize && currentContent) {
      // Save current chunk
      subChunks.push(createSubChunk(chunk, currentContent, subChunkIndex))
      subChunkIndex++
      currentContent = paragraph
    } else {
      currentContent += (currentContent ? '\n\n' : '') + paragraph
    }
  }

  // Save remaining content
  if (currentContent) {
    subChunks.push(createSubChunk(chunk, currentContent, subChunkIndex))
  }

  return subChunks
}

/**
 * Split chunk with fixed-size strategy
 */
function splitChunkFixedSize(
  chunk: DocumentChunk,
  options: Required<ChunkingOptions>
): DocumentChunk[] {
  const subChunks: DocumentChunk[] = []
  const { maxChunkSize, overlapSize } = options

  let start = 0
  let subChunkIndex = 0

  while (start < chunk.content.length) {
    const end = Math.min(start + maxChunkSize, chunk.content.length)
    const content = chunk.content.slice(start, end)

    subChunks.push(createSubChunk(chunk, content, subChunkIndex))

    start = end - overlapSize
    subChunkIndex++
  }

  return subChunks
}

/**
 * Create a sub-chunk from parent chunk
 */
function createSubChunk(
  parent: DocumentChunk,
  content: string,
  index: number
): DocumentChunk {
  return {
    ...parent,
    id: `${parent.id}-${index}`,
    title: `${parent.title} (Part ${index + 1})`,
    content: content.trim(),
    keywords: extractKeywords(content),
    metadata: {
      ...parent.metadata,
      wordCount: content.split(/\s+/).length,
      estimatedTokens: Math.ceil(content.length / 4),
    },
  }
}
