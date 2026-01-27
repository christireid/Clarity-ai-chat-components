/**
 * Enhanced Embeddings Generation
 *
 * Production-grade embedding strategy with:
 * - Semantic chunking (code-aware)
 * - Rich metadata enrichment
 * - Optimal model selection
 * - Advanced preprocessing
 * - Intelligent overlap strategies
 *
 * @version 2.0.0
 * @lastUpdated January 2026
 */

import OpenAI from 'openai'
import { estimateTokens } from './tokenUtils'

// ============================================================================
// Types & Configuration
// ============================================================================

export interface EmbeddingConfig {
  /** Embedding model selection */
  model: 'text-embedding-3-small' | 'text-embedding-3-large' | 'text-embedding-ada-002'
  /** Dimensions (only for text-embedding-3-* models) */
  dimensions?: number
  /** Maximum chunk size in tokens */
  maxChunkTokens: number
  /** Overlap size in tokens */
  overlapTokens: number
  /** Content type for specialized handling */
  contentType: 'prose' | 'code' | 'mixed' | 'api-reference'
}

export interface ChunkMetadata {
  /** Document title */
  title: string
  /** Document URL */
  url: string
  /** Document category */
  category: 'component' | 'hook' | 'guide' | 'cookbook' | 'example' | 'concept' | 'api'
  /** Section within document */
  section?: string
  /** Heading hierarchy */
  headings: string[]
  /** Tags for filtering */
  tags: string[]
  /** Code language if applicable */
  language?: 'typescript' | 'javascript' | 'jsx' | 'tsx' | 'json' | 'markdown'
  /** Function/class names in chunk */
  symbols?: string[]
  /** Import statements */
  imports?: string[]
  /** Chunk position in document */
  chunkIndex: number
  /** Total chunks in document */
  totalChunks: number
  /** Estimated complexity (1-5) */
  complexity?: number
  /** Last updated timestamp */
  lastUpdated: string
  /** Content fingerprint for deduplication */
  fingerprint: string
}

export interface EnhancedChunk {
  id: string
  content: string
  embedding?: number[]
  metadata: ChunkMetadata
  /** Approximate token count */
  tokenCount: number
  /** Relevance keywords */
  keywords: string[]
}

// Default configurations by content type
const EMBEDDING_CONFIGS: Record<string, EmbeddingConfig> = {
  // API documentation - high quality, precise retrieval
  'api-reference': {
    model: 'text-embedding-3-large',
    dimensions: 1536,
    maxChunkTokens: 512, // Smaller chunks for precise API lookups
    overlapTokens: 64,
    contentType: 'api-reference',
  },
  // Code examples - high quality, semantic understanding
  code: {
    model: 'text-embedding-3-large',
    dimensions: 1536,
    maxChunkTokens: 1024, // Larger chunks to preserve code context
    overlapTokens: 128,
    contentType: 'code',
  },
  // Prose documentation - balanced quality/cost
  prose: {
    model: 'text-embedding-3-small',
    dimensions: 1536,
    maxChunkTokens: 768,
    overlapTokens: 96,
    contentType: 'prose',
  },
  // Mixed content - balanced approach
  mixed: {
    model: 'text-embedding-3-small',
    dimensions: 1536,
    maxChunkTokens: 768,
    overlapTokens: 96,
    contentType: 'mixed',
  },
}

// ============================================================================
// OpenAI Client
// ============================================================================

let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY environment variable is not set. ' +
          'Please add it to your .env.local file.'
      )
    }

    openaiClient = new OpenAI({ apiKey })
  }

  return openaiClient
}

// ============================================================================
// Text Preprocessing
// ============================================================================

/**
 * Normalize text for consistent embedding quality
 */
export function normalizeText(text: string): string {
  let normalized = text

  // Remove excessive whitespace
  normalized = normalized.replace(/\s+/g, ' ')

  // Remove multiple consecutive newlines (keep max 2)
  normalized = normalized.replace(/\n{3,}/g, '\n\n')

  // Normalize unicode quotes
  normalized = normalized.replace(/['']/g, "'")
  normalized = normalized.replace(/[""]/g, '"')

  // Remove zero-width characters
  normalized = normalized.replace(/[\u200B-\u200D\uFEFF]/g, '')

  // Trim
  normalized = normalized.trim()

  return normalized
}

/**
 * Extract code blocks from markdown
 */
export function extractCodeBlocks(text: string): Array<{ code: string; language: string; start: number; end: number }> {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  const blocks: Array<{ code: string; language: string; start: number; end: number }> = []

  let match
  while ((match = codeBlockRegex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
      start: match.index,
      end: match.index + match[0].length,
    })
  }

  return blocks
}

/**
 * Extract symbols (function/class names) from code
 */
export function extractSymbols(code: string, language: string): string[] {
  const symbols: string[] = []

  if (language === 'typescript' || language === 'javascript' || language === 'tsx' || language === 'jsx') {
    // Function declarations
    const functionRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)/g
    let match
    while ((match = functionRegex.exec(code)) !== null) {
      symbols.push(match[1])
    }

    // Arrow functions and const assignments
    const arrowFunctionRegex = /(?:export\s+)?const\s+(\w+)\s*=\s*(?:\([^)]*\)|[a-zA-Z_$][\w$]*)\s*=>/g
    while ((match = arrowFunctionRegex.exec(code)) !== null) {
      symbols.push(match[1])
    }

    // Class declarations
    const classRegex = /(?:export\s+)?class\s+(\w+)/g
    while ((match = classRegex.exec(code)) !== null) {
      symbols.push(match[1])
    }

    // Interface declarations
    const interfaceRegex = /(?:export\s+)?interface\s+(\w+)/g
    while ((match = interfaceRegex.exec(code)) !== null) {
      symbols.push(match[1])
    }

    // Type declarations
    const typeRegex = /(?:export\s+)?type\s+(\w+)/g
    while ((match = typeRegex.exec(code)) !== null) {
      symbols.push(match[1])
    }
  }

  return [...new Set(symbols)] // Deduplicate
}

/**
 * Extract import statements from code
 */
export function extractImports(code: string): string[] {
  const imports: string[] = []
  const importRegex = /import\s+(?:{[^}]+}|[\w*]+)\s+from\s+['"]([^'"]+)['"]/g

  let match
  while ((match = importRegex.exec(code)) !== null) {
    imports.push(match[1])
  }

  return imports
}

/**
 * Generate a content fingerprint for deduplication
 */
export function generateFingerprint(content: string): string {
  // Simple hash function for content fingerprinting
  let hash = 0
  const normalized = content.replace(/\s+/g, ' ').trim().toLowerCase()

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36)
}

/**
 * Extract keywords from text for metadata
 */
export function extractKeywords(text: string, maxKeywords = 10): string[] {
  const normalized = text.toLowerCase()

  // Common Clarity Chat domain terms
  const domainTerms = [
    'chat', 'message', 'stream', 'streaming', 'component', 'hook', 'props',
    'typescript', 'react', 'nextjs', 'api', 'rag', 'ai', 'llm', 'openai',
    'anthropic', 'claude', 'gpt', 'token', 'context', 'memory', 'conversation',
    'assistant', 'user', 'avatar', 'attachment', 'typing', 'indicator',
    'theme', 'styling', 'customization', 'authentication', 'authorization',
  ]

  const keywords = domainTerms.filter(term => normalized.includes(term))

  // Add component names (PascalCase words)
  const componentRegex = /\b[A-Z][a-z]+(?:[A-Z][a-z]+)+\b/g
  const components = text.match(componentRegex) || []
  keywords.push(...components.map(c => c.toLowerCase()))

  // Deduplicate and limit
  return [...new Set(keywords)].slice(0, maxKeywords)
}

// ============================================================================
// Semantic Chunking
// ============================================================================

/**
 * Semantic chunking strategy that preserves code structure and prose coherence
 */
export class SemanticChunker {
  private config: EmbeddingConfig

  constructor(config: Partial<EmbeddingConfig> = {}) {
    // Select default config based on content type
    const contentType = config.contentType || 'mixed'
    const defaultConfig = EMBEDDING_CONFIGS[contentType]

    this.config = {
      ...defaultConfig,
      ...config,
    }
  }

  /**
   * Chunk text with semantic awareness
   */
  chunk(text: string, metadata: Partial<ChunkMetadata>): EnhancedChunk[] {
    const normalized = normalizeText(text)

    // Detect if text is primarily code
    const codeBlocks = extractCodeBlocks(normalized)
    const isCodeHeavy = codeBlocks.length > 0 || (normalized.match(/```/g) || []).length > 2

    if (isCodeHeavy) {
      return this.chunkCode(normalized, metadata)
    } else {
      return this.chunkProse(normalized, metadata)
    }
  }

  /**
   * Chunk code-heavy content preserving structure
   */
  private chunkCode(text: string, metadata: Partial<ChunkMetadata>): EnhancedChunk[] {
    const chunks: EnhancedChunk[] = []
    const codeBlocks = extractCodeBlocks(text)

    if (codeBlocks.length === 0) {
      // No markdown code blocks, split by logical boundaries
      return this.splitByCodeStructure(text, metadata)
    }

    let currentPos = 0
    let chunkIndex = 0

    for (const block of codeBlocks) {
      // Get prose before code block
      const proseBefore = text.slice(currentPos, block.start).trim()

      if (proseBefore.length > 0) {
        // Add prose chunk with context
        chunks.push(
          this.createChunk(proseBefore, metadata, chunkIndex++, codeBlocks.length + 1)
        )
      }

      // Handle code block
      const codeTokens = estimateTokens(block.code, 'code')

      if (codeTokens <= this.config.maxChunkTokens) {
        // Code fits in one chunk - include with surrounding context
        const contextBefore = proseBefore.slice(-200) // Last 200 chars of prose
        const contextAfter = text.slice(block.end, block.end + 200).replace(/```[\w]*\n[\s\S]*?```/, '').trim()

        const chunkContent = [
          contextBefore ? `...${contextBefore}` : '',
          `\`\`\`${block.language}\n${block.code}\n\`\`\``,
          contextAfter ? `${contextAfter}...` : '',
        ].filter(Boolean).join('\n\n')

        const chunk = this.createChunk(chunkContent, metadata, chunkIndex++, codeBlocks.length + 1)

        // Enrich with code metadata
        chunk.metadata.language = block.language as any
        chunk.metadata.symbols = extractSymbols(block.code, block.language)
        chunk.metadata.imports = extractImports(block.code)

        chunks.push(chunk)
      } else {
        // Code is too large - split into logical sections
        const codeChunks = this.splitLargeCode(block.code, block.language, metadata, chunkIndex)
        chunks.push(...codeChunks)
        chunkIndex += codeChunks.length
      }

      currentPos = block.end
    }

    // Handle remaining prose after last code block
    const proseAfter = text.slice(currentPos).trim()
    if (proseAfter.length > 0) {
      chunks.push(
        this.createChunk(proseAfter, metadata, chunkIndex++, codeBlocks.length + 1)
      )
    }

    // Update total chunks
    chunks.forEach(chunk => {
      chunk.metadata.totalChunks = chunks.length
    })

    return chunks
  }

  /**
   * Split large code into logical sections
   */
  private splitLargeCode(
    code: string,
    language: string,
    metadata: Partial<ChunkMetadata>,
    startIndex: number
  ): EnhancedChunk[] {
    const chunks: EnhancedChunk[] = []

    // Try to split by function/class boundaries
    const lines = code.split('\n')
    let currentChunk: string[] = []
    let currentTokens = 0
    let chunkIndex = startIndex

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineTokens = estimateTokens(line, 'code')

      // Check if this is a boundary (function/class declaration)
      const isBoundary = /^\s*(?:export\s+)?(?:async\s+)?(?:function|class|interface|type|const\s+\w+\s*=)/.test(line)

      if (isBoundary && currentChunk.length > 0 && currentTokens > this.config.maxChunkTokens * 0.5) {
        // Save current chunk
        const chunkContent = `\`\`\`${language}\n${currentChunk.join('\n')}\n\`\`\``
        chunks.push(this.createChunk(chunkContent, metadata, chunkIndex++, 0))
        currentChunk = []
        currentTokens = 0
      }

      currentChunk.push(line)
      currentTokens += lineTokens

      // Force split if too large
      if (currentTokens >= this.config.maxChunkTokens) {
        const chunkContent = `\`\`\`${language}\n${currentChunk.join('\n')}\n\`\`\``
        chunks.push(this.createChunk(chunkContent, metadata, chunkIndex++, 0))

        // Create overlap by keeping last few lines
        const overlapLines = Math.ceil(this.config.overlapTokens / (currentTokens / currentChunk.length))
        currentChunk = currentChunk.slice(-overlapLines)
        currentTokens = estimateTokens(currentChunk.join('\n'), 'code')
      }
    }

    // Add remaining
    if (currentChunk.length > 0) {
      const chunkContent = `\`\`\`${language}\n${currentChunk.join('\n')}\n\`\`\``
      chunks.push(this.createChunk(chunkContent, metadata, chunkIndex++, 0))
    }

    return chunks
  }

  /**
   * Split code without markdown blocks by structure
   */
  private splitByCodeStructure(text: string, metadata: Partial<ChunkMetadata>): EnhancedChunk[] {
    // For now, fall back to prose chunking
    // In production, you'd parse the AST for proper structure
    return this.chunkProse(text, metadata)
  }

  /**
   * Chunk prose content preserving semantic coherence
   */
  private chunkProse(text: string, metadata: Partial<ChunkMetadata>): EnhancedChunk[] {
    const chunks: EnhancedChunk[] = []

    // Split into sentences (improved regex)
    const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [text]

    let currentChunk: string[] = []
    let currentTokens = 0
    let chunkIndex = 0

    for (const sentence of sentences) {
      const trimmed = sentence.trim()
      if (!trimmed) continue

      const sentenceTokens = estimateTokens(trimmed, 'prose')

      // Check if adding this sentence would exceed limit
      if (currentTokens + sentenceTokens > this.config.maxChunkTokens && currentChunk.length > 0) {
        // Save current chunk
        chunks.push(
          this.createChunk(currentChunk.join(' '), metadata, chunkIndex++, 0)
        )

        // Start new chunk with overlap (last few sentences)
        const overlapSentences = this.calculateOverlapSentences(currentChunk, this.config.overlapTokens)
        currentChunk = currentChunk.slice(-overlapSentences)
        currentTokens = estimateTokens(currentChunk.join(' '), 'prose')
      }

      currentChunk.push(trimmed)
      currentTokens += sentenceTokens
    }

    // Add remaining chunk
    if (currentChunk.length > 0) {
      chunks.push(
        this.createChunk(currentChunk.join(' '), metadata, chunkIndex++, 0)
      )
    }

    // Update total chunks
    chunks.forEach(chunk => {
      chunk.metadata.totalChunks = chunks.length
    })

    return chunks
  }

  /**
   * Calculate how many sentences to keep for overlap
   */
  private calculateOverlapSentences(sentences: string[], targetTokens: number): number {
    let tokens = 0
    let count = 0

    for (let i = sentences.length - 1; i >= 0 && tokens < targetTokens; i--) {
      tokens += estimateTokens(sentences[i], 'prose')
      count++
    }

    return Math.max(1, count)
  }

  /**
   * Create a chunk with full metadata
   */
  private createChunk(
    content: string,
    metadata: Partial<ChunkMetadata>,
    chunkIndex: number,
    totalChunks: number
  ): EnhancedChunk {
    const normalized = normalizeText(content)
    const tokenCount = estimateTokens(normalized, this.config.contentType)
    const keywords = extractKeywords(normalized)
    const fingerprint = generateFingerprint(normalized)

    // Generate chunk ID
    const baseId = metadata.url?.replace(/[^a-z0-9]/gi, '-') || 'unknown'
    const id = `${baseId}-chunk-${chunkIndex}`

    return {
      id,
      content: normalized,
      tokenCount,
      keywords,
      metadata: {
        title: metadata.title || 'Untitled',
        url: metadata.url || '',
        category: metadata.category || 'guide',
        section: metadata.section,
        headings: metadata.headings || [],
        tags: metadata.tags || [],
        language: metadata.language,
        symbols: metadata.symbols,
        imports: metadata.imports,
        chunkIndex,
        totalChunks,
        complexity: this.estimateComplexity(normalized),
        lastUpdated: metadata.lastUpdated || new Date().toISOString(),
        fingerprint,
      },
    }
  }

  /**
   * Estimate content complexity (1-5 scale)
   */
  private estimateComplexity(content: string): number {
    let score = 1

    // Check for code
    if (content.includes('```') || content.includes('function') || content.includes('class')) {
      score += 1
    }

    // Check for technical terms
    const technicalTerms = ['api', 'async', 'promise', 'typescript', 'generics', 'interface']
    if (technicalTerms.some(term => content.toLowerCase().includes(term))) {
      score += 1
    }

    // Check for nested structures (parentheses depth)
    const maxDepth = this.calculateMaxNestingDepth(content)
    if (maxDepth > 3) score += 1
    if (maxDepth > 5) score += 1

    return Math.min(score, 5)
  }

  /**
   * Calculate maximum nesting depth in content
   */
  private calculateMaxNestingDepth(text: string): number {
    let depth = 0
    let maxDepth = 0

    for (const char of text) {
      if (char === '(' || char === '{' || char === '[') {
        depth++
        maxDepth = Math.max(maxDepth, depth)
      } else if (char === ')' || char === '}' || char === ']') {
        depth--
      }
    }

    return maxDepth
  }
}

// ============================================================================
// Embedding Generation
// ============================================================================

export interface EmbeddingOptions {
  model?: 'text-embedding-3-small' | 'text-embedding-3-large' | 'text-embedding-ada-002'
  dimensions?: number
  /** Prefix to add before text (useful for retrieval optimization) */
  prefix?: string
  /** Batch size for processing */
  batchSize?: number
}

/**
 * Generate embedding for a single chunk
 */
export async function generateEmbedding(
  chunk: EnhancedChunk,
  options: EmbeddingOptions = {}
): Promise<EnhancedChunk> {
  const {
    model = 'text-embedding-3-small',
    dimensions = 1536,
    prefix = '',
  } = options

  const client = getOpenAIClient()

  // Prepare text with optional prefix
  const text = prefix ? `${prefix} ${chunk.content}` : chunk.content

  try {
    const response = await client.embeddings.create({
      model,
      input: text,
      dimensions,
    })

    return {
      ...chunk,
      embedding: response.data[0].embedding,
    }
  } catch (error) {
    console.error(`Error generating embedding for chunk ${chunk.id}:`, error)
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate embeddings for multiple chunks in batch
 */
export async function generateEmbeddingsBatch(
  chunks: EnhancedChunk[],
  options: EmbeddingOptions = {}
): Promise<EnhancedChunk[]> {
  const {
    model = 'text-embedding-3-small',
    dimensions = 1536,
    prefix = '',
    batchSize = 100, // OpenAI limit is 2048, but use smaller batches for reliability
  } = options

  if (chunks.length === 0) return []

  const client = getOpenAIClient()
  const embeddedChunks: EnhancedChunk[] = []

  // Process in batches
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize)
    const texts = batch.map(chunk => prefix ? `${prefix} ${chunk.content}` : chunk.content)

    try {
      const response = await client.embeddings.create({
        model,
        input: texts,
        dimensions,
      })

      // Match embeddings to chunks
      const embeddings = response.data
        .sort((a, b) => a.index - b.index)
        .map(item => item.embedding)

      for (let j = 0; j < batch.length; j++) {
        embeddedChunks.push({
          ...batch[j],
          embedding: embeddings[j],
        })
      }

      console.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}`)
    } catch (error) {
      console.error(`Error processing batch ${i / batchSize + 1}:`, error)
      throw error
    }
  }

  return embeddedChunks
}

// ============================================================================
// Deduplication
// ============================================================================

/**
 * Deduplicate chunks based on content fingerprint
 */
export function deduplicateChunks(chunks: EnhancedChunk[]): EnhancedChunk[] {
  const seen = new Set<string>()
  const unique: EnhancedChunk[] = []

  for (const chunk of chunks) {
    if (!seen.has(chunk.metadata.fingerprint)) {
      seen.add(chunk.metadata.fingerprint)
      unique.push(chunk)
    }
  }

  console.log(`Deduplicated ${chunks.length} chunks to ${unique.length} unique chunks`)
  return unique
}

// ============================================================================
// Utility Functions (backward compatibility)
// ============================================================================

/**
 * Legacy chunking function for backward compatibility
 */
export function chunkText(text: string, options: {
  maxChunkSize?: number
  overlap?: number
  splitOnSentences?: boolean
} = {}): string[] {
  const chunker = new SemanticChunker({
    contentType: 'mixed',
    maxChunkTokens: Math.floor((options.maxChunkSize || 1000) / 4), // Approx char to token
    overlapTokens: Math.floor((options.overlap || 200) / 4),
  } as EmbeddingConfig)

  const chunks = chunker.chunk(text, {
    title: 'Legacy Chunk',
    url: '',
    category: 'guide',
    headings: [],
    tags: [],
    lastUpdated: new Date().toISOString(),
  })

  return chunks.map(c => c.content)
}

/**
 * Estimate token count (legacy)
 */
export function estimateTokenCount(text: string): number {
  return estimateTokens(text, 'mixed')
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have the same dimensions')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Estimate embedding cost
 */
export function estimateEmbeddingCost(
  tokenCount: number,
  model: 'text-embedding-3-small' | 'text-embedding-3-large' | 'text-embedding-ada-002' = 'text-embedding-3-small'
): number {
  // Prices per 1M tokens (as of January 2026)
  const prices = {
    'text-embedding-3-small': 0.02,
    'text-embedding-3-large': 0.13,
    'text-embedding-ada-002': 0.10,
  }

  return (tokenCount / 1_000_000) * prices[model]
}

// ============================================================================
// Exports
// ============================================================================

export {
  EMBEDDING_CONFIGS,
  type ChunkMetadata,
  type EnhancedChunk,
  type EmbeddingConfig,
}
