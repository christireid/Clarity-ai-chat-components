/**
 * RAG (Retrieval Augmented Generation) utilities
 */

import type { Document, DocumentChunk, SearchResult, RAGConfig } from '../types/document'

export const RAG_CONFIG: RAGConfig = {
  chunkSize: 500,         // tokens per chunk
  overlap: 50,            // overlap between chunks
  topK: 3,                // chunks to retrieve
  maxContextTokens: 3000, // max context size
  temperature: 0.3,       // lower for factual responses
}

/**
 * Simple tokenization (approximate - production should use tiktoken)
 */
export function approximateTokenCount(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4)
}

/**
 * Chunk document into overlapping segments
 */
export function chunkDocument(content: string, config = RAG_CONFIG): DocumentChunk[] {
  const words = content.split(/\s+/)
  const chunks: DocumentChunk[] = []
  
  // Approximate tokens per word
  const tokensPerWord = 1.3
  const wordsPerChunk = Math.floor(config.chunkSize / tokensPerWord)
  const overlapWords = Math.floor(config.overlap / tokensPerWord)
  
  let index = 0
  let chunkId = 0
  
  while (index < words.length) {
    const end = Math.min(index + wordsPerChunk, words.length)
    const chunkWords = words.slice(index, end)
    const chunkText = chunkWords.join(' ')
    
    chunks.push({
      id: `chunk-${chunkId++}`,
      documentId: '', // Set by caller
      text: chunkText,
      startIndex: index,
      endIndex: end,
      tokens: approximateTokenCount(chunkText)
    })
    
    // Move forward with overlap
    index = end - overlapWords
    
    // Prevent infinite loop
    if (index >= words.length - overlapWords) break
  }
  
  return chunks
}

/**
 * Simple keyword-based search
 * Production should use vector embeddings (OpenAI, Cohere, etc.)
 */
export function searchChunks(
  query: string,
  documents: Document[],
  topK: number = RAG_CONFIG.topK,
  documentIds?: string[]
): SearchResult[] {
  // Filter documents if specified
  const filteredDocs = documentIds 
    ? documents.filter(doc => documentIds.includes(doc.id))
    : documents
  
  // Collect all chunks
  const allChunks: Array<{ chunk: DocumentChunk; document: Document }> = []
  
  for (const doc of filteredDocs) {
    for (const chunk of doc.chunks) {
      allChunks.push({ chunk, document: doc })
    }
  }
  
  // Score each chunk
  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2)
  
  const scored = allChunks.map(({ chunk, document }) => {
    const score = calculateRelevanceScore(queryTerms, chunk.text.toLowerCase())
    return { chunk, document, score }
  })
  
  // Sort by score and return top K
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}

/**
 * Calculate relevance score (TF-IDF inspired)
 */
function calculateRelevanceScore(queryTerms: string[], text: string): number {
  let score = 0
  const textWords = text.split(/\s+/)
  
  for (const term of queryTerms) {
    // Count occurrences
    const occurrences = textWords.filter(word => word.includes(term)).length
    
    // Weight by term frequency
    if (occurrences > 0) {
      score += Math.log(1 + occurrences) * 10
    }
    
    // Boost for exact phrase matches
    if (text.includes(queryTerms.join(' '))) {
      score += 50
    }
  }
  
  return score
}

/**
 * Build context from search results
 */
export function buildContext(
  searchResults: SearchResult[],
  maxTokens: number = RAG_CONFIG.maxContextTokens
): string {
  let context = ''
  let tokenCount = 0
  
  for (let i = 0; i < searchResults.length; i++) {
    const { chunk, document } = searchResults[i]
    const chunkTokens = chunk.tokens
    
    // Check if adding this chunk exceeds limit
    if (tokenCount + chunkTokens > maxTokens) {
      break
    }
    
    // Add chunk with source information
    const sourceLabel = `[Source: ${document.name}, Chunk ${i + 1}]`
    context += `${sourceLabel}\n${chunk.text}\n\n`
    tokenCount += chunkTokens
  }
  
  return context.trim()
}

/**
 * Create RAG prompt
 */
export function createRAGPrompt(query: string, context: string): string {
  return `You are a helpful AI assistant. Answer the user's question based ONLY on the provided context. If the context doesn't contain relevant information, say so.

Context:
${context}

User Question: ${query}

Answer:`
}

/**
 * Extract sources from search results
 */
export function extractSources(searchResults: SearchResult[]) {
  return searchResults.map((result, index) => ({
    documentId: result.document.id,
    documentName: result.document.name,
    chunkIndex: index,
    text: result.chunk.text.substring(0, 200) + '...',
    relevanceScore: result.score
  }))
}

/**
 * Calculate cost estimate
 */
export function estimateCost(
  promptTokens: number,
  completionTokens: number,
  model: string
): number {
  const costs: Record<string, { input: number; output: number }> = {
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
    'claude-3-opus': { input: 0.015, output: 0.075 },
    'claude-3-sonnet': { input: 0.003, output: 0.015 },
    'claude-3-haiku': { input: 0.00025, output: 0.00125 },
    'gemini-pro': { input: 0.00025, output: 0.0005 },
  }
  
  const pricing = costs[model] || { input: 0.001, output: 0.002 }
  
  return (promptTokens * pricing.input / 1000) + (completionTokens * pricing.output / 1000)
}
