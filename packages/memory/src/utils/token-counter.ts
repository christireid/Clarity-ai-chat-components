/**
 * Clarity Memory - Token Counter
 * 
 * Utilities for counting tokens in text
 */

/**
 * Estimate token count for a given text
 * Uses a simple approximation: ~4 characters per token
 * For more accurate counting, use a proper tokenizer library
 */
export function estimateTokens(text: string): number {
  if (!text) return 0
  
  // Simple approximation: ~4 characters per token
  // This is a rough estimate; for production, use a proper tokenizer
  return Math.ceil(text.length / 4)
}

/**
 * Estimate tokens for multiple texts
 */
export function estimateTokensBatch(texts: string[]): number {
  return texts.reduce((total, text) => total + estimateTokens(text), 0)
}

/**
 * Estimate tokens for a memory item
 */
export function estimateMemoryTokens(item: { content: string }): number {
  return estimateTokens(item.content)
}

/**
 * Estimate tokens for multiple memory items
 */
export function estimateMemoriesTokens(items: Array<{ content: string }>): number {
  return items.reduce((total, item) => total + estimateMemoryTokens(item), 0)
}

/**
 * Truncate text to fit within a token budget
 */
export function truncateToTokens(text: string, maxTokens: number): string {
  const estimatedTokens = estimateTokens(text)
  
  if (estimatedTokens <= maxTokens) {
    return text
  }
  
  // Calculate approximate character limit
  const maxChars = maxTokens * 4
  
  // Truncate and add ellipsis
  if (text.length > maxChars) {
    return text.substring(0, maxChars - 3) + '...'
  }
  
  return text
}

/**
 * Split text into chunks that fit within token budget
 */
export function chunkByTokens(text: string, maxTokensPerChunk: number): string[] {
  const chunks: string[] = []
  const words = text.split(/\s+/)
  
  let currentChunk = ''
  let currentTokens = 0
  
  for (const word of words) {
    const wordTokens = estimateTokens(word)
    
    if (currentTokens + wordTokens > maxTokensPerChunk && currentChunk) {
      chunks.push(currentChunk.trim())
      currentChunk = word
      currentTokens = wordTokens
    } else {
      currentChunk += (currentChunk ? ' ' : '') + word
      currentTokens += wordTokens
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }
  
  return chunks
}
