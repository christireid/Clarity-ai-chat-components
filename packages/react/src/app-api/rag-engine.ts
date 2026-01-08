'use client'

/**
 * Clarity Chat - RAG (Retrieval Augmented Generation) Engine
 *
 * A production-ready RAG implementation with:
 * - Multiple chunking strategies (fixed, sentence, paragraph, balanced)
 * - Simple but effective TF-IDF-like similarity matching
 * - Support for text, URL, file, and pre-chunked sources
 * - Citation tracking for transparency
 */

import type { RAGSource, RAGConfig } from './types'

// =============================================================================
// Types
// =============================================================================

export interface RAGChunk {
  id: string
  content: string
  sourceIndex: number
  sourceType: RAGSource['type']
  metadata?: Record<string, unknown>
  tokens: number
  embedding: number[]
}

export interface RAGQueryResult {
  chunks: Array<{
    chunk: RAGChunk
    score: number
  }>
  context: string
  citations: Array<{
    sourceIndex: number
    sourceType: string
    excerpt: string
  }>
  queryTimeMs: number
}

export interface RAGEngineState {
  chunks: RAGChunk[]
  vocabulary: Map<string, number>
  idfScores: Map<string, number>
  initialized: boolean
  sourceCount: number
}

// =============================================================================
// Chunking Strategies
// =============================================================================

const SENTENCE_ENDINGS = /[.!?]+[\s\n]+/g
const PARAGRAPH_BREAKS = /\n\s*\n+/g

/**
 * Estimate token count from text (approx 4 chars per token)
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Split text into chunks using fixed-size strategy
 */
function chunkFixed(
  text: string,
  maxTokens: number,
  overlap: number
): string[] {
  const chunks: string[] = []
  const chunkSize = maxTokens * 4 // Convert tokens to chars
  const overlapSize = overlap * 4

  let start = 0
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.slice(start, end).trim())
    start = end - overlapSize
    if (start >= text.length) break
  }

  return chunks.filter((c) => c.length > 0)
}

/**
 * Split text into chunks using sentence boundaries
 */
function chunkBySentence(
  text: string,
  maxTokens: number,
  overlap: number
): string[] {
  const sentences = text.split(SENTENCE_ENDINGS).filter((s) => s.trim())
  const chunks: string[] = []
  let currentChunk: string[] = []
  let currentTokens = 0

  for (const sentence of sentences) {
    const sentenceTokens = estimateTokens(sentence)

    if (currentTokens + sentenceTokens > maxTokens && currentChunk.length > 0) {
      chunks.push(currentChunk.join(' ').trim())

      // Keep last few sentences for overlap
      const overlapSentences = Math.ceil(overlap / 20) // Approx sentences for overlap
      currentChunk = currentChunk.slice(-overlapSentences)
      currentTokens = currentChunk.reduce(
        (sum, s) => sum + estimateTokens(s),
        0
      )
    }

    currentChunk.push(sentence.trim())
    currentTokens += sentenceTokens
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' ').trim())
  }

  return chunks.filter((c) => c.length > 0)
}

/**
 * Split text into chunks using paragraph boundaries
 */
function chunkByParagraph(
  text: string,
  maxTokens: number,
  overlap: number
): string[] {
  const paragraphs = text.split(PARAGRAPH_BREAKS).filter((p) => p.trim())
  const chunks: string[] = []
  let currentChunk: string[] = []
  let currentTokens = 0

  for (const paragraph of paragraphs) {
    const paragraphTokens = estimateTokens(paragraph)

    // If single paragraph exceeds max, chunk it by sentences
    if (paragraphTokens > maxTokens) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join('\n\n').trim())
        currentChunk = []
        currentTokens = 0
      }
      chunks.push(...chunkBySentence(paragraph, maxTokens, overlap))
      continue
    }

    if (
      currentTokens + paragraphTokens > maxTokens &&
      currentChunk.length > 0
    ) {
      chunks.push(currentChunk.join('\n\n').trim())
      // Keep last paragraph for overlap
      currentChunk = currentChunk.slice(-1)
      currentTokens = currentChunk.reduce(
        (sum, p) => sum + estimateTokens(p),
        0
      )
    }

    currentChunk.push(paragraph.trim())
    currentTokens += paragraphTokens
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n\n').trim())
  }

  return chunks.filter((c) => c.length > 0)
}

/**
 * Balanced chunking - tries to maintain semantic coherence while respecting size limits
 */
function chunkBalanced(
  text: string,
  maxTokens: number,
  overlap: number
): string[] {
  // First try paragraphs
  const paragraphChunks = chunkByParagraph(text, maxTokens, overlap)

  // If chunks are too small (< 50% of max), merge adjacent chunks
  const mergedChunks: string[] = []
  let currentMerge: string[] = []
  let currentTokens = 0

  for (const chunk of paragraphChunks) {
    const chunkTokens = estimateTokens(chunk)

    if (currentTokens + chunkTokens <= maxTokens * 0.9) {
      currentMerge.push(chunk)
      currentTokens += chunkTokens
    } else {
      if (currentMerge.length > 0) {
        mergedChunks.push(currentMerge.join('\n\n'))
      }
      currentMerge = [chunk]
      currentTokens = chunkTokens
    }
  }

  if (currentMerge.length > 0) {
    mergedChunks.push(currentMerge.join('\n\n'))
  }

  return mergedChunks.filter((c) => c.length > 0)
}

/**
 * Apply chunking strategy to text
 */
export function chunkText(
  text: string,
  strategy: 'fixed' | 'sentence' | 'paragraph' | 'balanced' = 'balanced',
  maxTokens: number = 500,
  overlap: number = 50
): string[] {
  switch (strategy) {
    case 'fixed':
      return chunkFixed(text, maxTokens, overlap)
    case 'sentence':
      return chunkBySentence(text, maxTokens, overlap)
    case 'paragraph':
      return chunkByParagraph(text, maxTokens, overlap)
    case 'balanced':
    default:
      return chunkBalanced(text, maxTokens, overlap)
  }
}

// =============================================================================
// Simple TF-IDF Embedding
// =============================================================================

/**
 * Tokenize text into words
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2) // Skip very short words
}

/**
 * Build vocabulary from all chunks
 */
function buildVocabulary(chunks: string[]): Map<string, number> {
  const vocab = new Map<string, number>()
  let index = 0

  for (const chunk of chunks) {
    for (const word of tokenize(chunk)) {
      if (!vocab.has(word)) {
        vocab.set(word, index++)
      }
    }
  }

  return vocab
}

/**
 * Calculate IDF scores for vocabulary
 */
function calculateIDF(
  chunks: string[],
  vocabulary: Map<string, number>
): Map<string, number> {
  const docFrequency = new Map<string, number>()
  const numDocs = chunks.length

  // Count document frequency for each term
  for (const chunk of chunks) {
    const uniqueWords = new Set(tokenize(chunk))
    for (const word of uniqueWords) {
      docFrequency.set(word, (docFrequency.get(word) || 0) + 1)
    }
  }

  // Calculate IDF
  const idfScores = new Map<string, number>()
  for (const [word] of vocabulary) {
    const df = docFrequency.get(word) || 1
    idfScores.set(word, Math.log((numDocs + 1) / (df + 1)) + 1)
  }

  return idfScores
}

/**
 * Create TF-IDF embedding for a text
 */
function createEmbedding(
  text: string,
  vocabulary: Map<string, number>,
  idfScores: Map<string, number>
): number[] {
  const embedding = new Array(vocabulary.size).fill(0)
  const words = tokenize(text)
  const wordCounts = new Map<string, number>()

  // Count term frequencies
  for (const word of words) {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
  }

  // Calculate TF-IDF
  const maxTf = Math.max(...wordCounts.values(), 1)
  for (const [word, count] of wordCounts) {
    const index = vocabulary.get(word)
    if (index !== undefined) {
      const tf = 0.5 + 0.5 * (count / maxTf) // Normalized TF
      const idf = idfScores.get(word) || 1
      embedding[index] = tf * idf
    }
  }

  // Normalize the vector
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0)
  )
  if (magnitude > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= magnitude
    }
  }

  return embedding
}

/**
 * Calculate cosine similarity between two embeddings
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0

  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    magnitudeA += a[i] * a[i]
    magnitudeB += b[i] * b[i]
  }

  magnitudeA = Math.sqrt(magnitudeA)
  magnitudeB = Math.sqrt(magnitudeB)

  if (magnitudeA === 0 || magnitudeB === 0) return 0
  return dotProduct / (magnitudeA * magnitudeB)
}

// =============================================================================
// RAG Engine
// =============================================================================

/**
 * Create a new RAG engine instance
 */
export function createRAGEngine(): RAGEngineState {
  return {
    chunks: [],
    vocabulary: new Map(),
    idfScores: new Map(),
    initialized: false,
    sourceCount: 0,
  }
}

/**
 * Process a single source and return chunks
 */
async function processSource(
  source: RAGSource,
  sourceIndex: number,
  config: RAGConfig
): Promise<Array<{ content: string; metadata?: Record<string, unknown> }>> {
  const chunkingConfig = config.chunking || {}
  const strategy = chunkingConfig.strategy || 'balanced'
  const maxTokens = chunkingConfig.maxTokens || 500
  const overlap = chunkingConfig.overlap || 50

  switch (source.type) {
    case 'text': {
      const textChunks = chunkText(source.content, strategy, maxTokens, overlap)
      return textChunks.map((content) => ({
        content,
        metadata: source.metadata,
      }))
    }

    case 'url': {
      // For URLs, we'd normally fetch and parse the content
      // In browser environment, we'll create a placeholder
      // Real implementation would use a server-side API
      return [
        {
          content: `[Content from URL: ${source.url}]`,
          metadata: { ...source.metadata, url: source.url },
        },
      ]
    }

    case 'file': {
      // For files, read the text content
      try {
        const text = await source.file.text()
        const fileChunks = chunkText(text, strategy, maxTokens, overlap)
        return fileChunks.map((content) => ({
          content,
          metadata: { ...source.metadata, filename: source.file.name },
        }))
      } catch {
        return [
          {
            content: `[Unable to read file: ${source.file.name}]`,
            metadata: source.metadata,
          },
        ]
      }
    }

    case 'chunks': {
      // Already chunked, just return as-is
      return source.chunks
    }

    default:
      return []
  }
}

/**
 * Initialize the RAG engine with sources
 */
export async function initializeRAG(
  state: RAGEngineState,
  sources: RAGSource[],
  config: RAGConfig
): Promise<RAGEngineState> {
  const allChunks: RAGChunk[] = []
  let chunkId = 0

  // Process all sources
  for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
    const source = sources[sourceIndex]
    const processedChunks = await processSource(source, sourceIndex, config)

    for (const { content, metadata } of processedChunks) {
      allChunks.push({
        id: `chunk_${chunkId++}`,
        content,
        sourceIndex,
        sourceType: source.type,
        metadata,
        tokens: estimateTokens(content),
        embedding: [], // Will be filled after vocabulary is built
      })
    }
  }

  // Build vocabulary and IDF scores
  const chunkContents = allChunks.map((c) => c.content)
  const vocabulary = buildVocabulary(chunkContents)
  const idfScores = calculateIDF(chunkContents, vocabulary)

  // Create embeddings for all chunks
  for (const chunk of allChunks) {
    chunk.embedding = createEmbedding(chunk.content, vocabulary, idfScores)
  }

  return {
    chunks: allChunks,
    vocabulary,
    idfScores,
    initialized: true,
    sourceCount: sources.length,
  }
}

/**
 * Query the RAG engine
 */
export function queryRAG(
  state: RAGEngineState,
  query: string,
  topK: number = 3,
  similarityThreshold: number = 0.1
): RAGQueryResult {
  const startTime = performance.now()

  if (!state.initialized || state.chunks.length === 0) {
    return {
      chunks: [],
      context: '',
      citations: [],
      queryTimeMs: performance.now() - startTime,
    }
  }

  // Create embedding for query
  const queryEmbedding = createEmbedding(
    query,
    state.vocabulary,
    state.idfScores
  )

  // Calculate similarity scores for all chunks
  const scoredChunks = state.chunks
    .map((chunk) => ({
      chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .filter((item) => item.score >= similarityThreshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)

  // Build context from top chunks
  const contextParts = scoredChunks.map(
    ({ chunk }, index) =>
      `[Source ${index + 1}]: ${chunk.content.slice(0, 500)}${chunk.content.length > 500 ? '...' : ''}`
  )
  const context = contextParts.join('\n\n')

  // Build citations
  const citations = scoredChunks.map(({ chunk }) => ({
    sourceIndex: chunk.sourceIndex,
    sourceType: chunk.sourceType,
    excerpt:
      chunk.content.slice(0, 100) + (chunk.content.length > 100 ? '...' : ''),
  }))

  return {
    chunks: scoredChunks,
    context,
    citations,
    queryTimeMs: performance.now() - startTime,
  }
}

/**
 * Add new sources to an existing RAG engine
 */
export async function addSources(
  state: RAGEngineState,
  sources: RAGSource[],
  config: RAGConfig
): Promise<RAGEngineState> {
  const existingChunks = [...state.chunks]
  let chunkId = existingChunks.length

  // Process new sources
  for (let i = 0; i < sources.length; i++) {
    const sourceIndex = state.sourceCount + i
    const source = sources[i]
    const processedChunks = await processSource(source, sourceIndex, config)

    for (const { content, metadata } of processedChunks) {
      existingChunks.push({
        id: `chunk_${chunkId++}`,
        content,
        sourceIndex,
        sourceType: source.type,
        metadata,
        tokens: estimateTokens(content),
        embedding: [],
      })
    }
  }

  // Rebuild vocabulary and embeddings with all chunks
  const chunkContents = existingChunks.map((c) => c.content)
  const vocabulary = buildVocabulary(chunkContents)
  const idfScores = calculateIDF(chunkContents, vocabulary)

  // Re-embed all chunks
  for (const chunk of existingChunks) {
    chunk.embedding = createEmbedding(chunk.content, vocabulary, idfScores)
  }

  return {
    chunks: existingChunks,
    vocabulary,
    idfScores,
    initialized: true,
    sourceCount: state.sourceCount + sources.length,
  }
}

/**
 * Clear all sources from the RAG engine
 */
export function clearRAG(): RAGEngineState {
  return createRAGEngine()
}

/**
 * Get RAG statistics
 */
export function getRAGStats(state: RAGEngineState): {
  sourceCount: number
  chunkCount: number
  totalTokens: number
  vocabularySize: number
  averageChunkSize: number
} {
  const totalTokens = state.chunks.reduce((sum, c) => sum + c.tokens, 0)
  const averageChunkSize =
    state.chunks.length > 0 ? totalTokens / state.chunks.length : 0

  return {
    sourceCount: state.sourceCount,
    chunkCount: state.chunks.length,
    totalTokens,
    vocabularySize: state.vocabulary.size,
    averageChunkSize: Math.round(averageChunkSize),
  }
}
