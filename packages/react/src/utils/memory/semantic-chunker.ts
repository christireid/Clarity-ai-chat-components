/**
 * Semantic Chunking Utilities
 * 
 * Intelligently splits conversations and content into semantically coherent chunks
 * optimized for vector storage and retrieval.
 */

export interface SemanticChunk {
  text: string
  tokens: number
  embedding?: number[]
  topic?: string
  startIndex: number
  endIndex: number
  importanceScore?: number
}

export interface ChunkingOptions {
  chunkSize?: number // Target tokens per chunk (default: 200)
  overlap?: number // Overlap tokens between chunks (default: 50)
  similarityThreshold?: number // Minimum similarity for grouping (default: 0.75)
  preserveSentences?: boolean // Keep sentences intact (default: true)
}

/**
 * Semantic Chunker
 * 
 * Splits content into semantically coherent chunks optimized for vector storage
 */
export class SemanticChunker {
  private config: Required<ChunkingOptions>
  private countTokens: (text: string) => number
  private createEmbedding?: (text: string) => Promise<number[]> | number[]

  constructor(
    countTokens: (text: string) => number,
    createEmbedding?: (text: string) => Promise<number[]> | number[],
    options: ChunkingOptions = {}
  ) {
    this.countTokens = countTokens
    this.createEmbedding = createEmbedding
    this.config = {
      chunkSize: options.chunkSize ?? 200,
      overlap: options.overlap ?? 50,
      similarityThreshold: options.similarityThreshold ?? 0.75,
      preserveSentences: options.preserveSentences ?? true,
    }
  }

  /**
   * Chunk conversation into semantically coherent pieces
   */
  async chunkConversation(conversation: string): Promise<SemanticChunk[]> {
    // Split into sentences first
    const sentences = this.splitIntoSentences(conversation)

    // Group sentences into semantic chunks
    const chunks: SemanticChunk[] = []
    let currentChunk: string[] = []
    let currentTokens = 0
    let startIndex = 0

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i]
      const sentenceTokens = this.countTokens(sentence)

      // Check if adding this sentence exceeds chunk size
      if (currentTokens + sentenceTokens > this.config.chunkSize && currentChunk.length > 0) {
        // Finalize current chunk
        const chunkText = currentChunk.join(' ')
        const endIndex = startIndex + chunkText.length

        chunks.push({
          text: chunkText,
          tokens: currentTokens,
          topic: this.extractTopic(chunkText),
          startIndex,
          endIndex,
          importanceScore: this.calculateImportance(chunkText),
        })

        // Start new chunk with overlap
        const overlapSentences = this.config.preserveSentences
          ? currentChunk.slice(-Math.floor(this.config.overlap / 20)) // Approximate sentence count
          : []
        
        currentChunk = [...overlapSentences, sentence]
        currentTokens = overlapSentences.reduce((sum, s) => sum + this.countTokens(s), 0) + sentenceTokens
        startIndex = endIndex - (overlapSentences.join(' ').length || 0)
      } else {
        currentChunk.push(sentence)
        currentTokens += sentenceTokens
      }
    }

    // Add final chunk
    if (currentChunk.length > 0) {
      const chunkText = currentChunk.join(' ')
      chunks.push({
        text: chunkText,
        tokens: currentTokens,
        topic: this.extractTopic(chunkText),
        startIndex,
        endIndex: startIndex + chunkText.length,
        importanceScore: this.calculateImportance(chunkText),
      })
    }

    // Create embeddings if embedding function provided
    if (this.createEmbedding) {
      for (const chunk of chunks) {
        const embedding = await this.createEmbedding(chunk.text)
        chunk.embedding = Array.isArray(embedding) ? embedding : await embedding
      }
    }

    return chunks
  }

  /**
   * Retrieve optimal chunks that maximize relevance within token budget
   */
  async retrieveOptimalChunks(
    query: string,
    chunks: SemanticChunk[],
    budget: number
  ): Promise<SemanticChunk[]> {
    if (!this.createEmbedding) {
      // Fallback: simple token-based selection
      return this.selectChunksByTokens(chunks, budget)
    }

    const queryEmbedding = await this.createEmbedding(query)
    const queryVec = Array.isArray(queryEmbedding) ? queryEmbedding : await queryEmbedding

    // Calculate relevance scores
    const scoredChunks = chunks.map((chunk) => {
      if (!chunk.embedding) {
        return { ...chunk, relevance: 0.5 } // Default if no embedding
      }

      const relevance = this.cosineSimilarity(queryVec, chunk.embedding)
      return {
        ...chunk,
        relevance,
      }
    })

    // Sort by relevance
    scoredChunks.sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0))

    // Greedy selection within budget
    const selected: SemanticChunk[] = []
    let usedTokens = 0

    for (const chunk of scoredChunks) {
      if (usedTokens + chunk.tokens <= budget) {
        selected.push(chunk)
        usedTokens += chunk.tokens
      } else if (selected.length === 0) {
        // Must include at least one chunk - truncate if needed
        const truncated = this.truncateToBudget(chunk.text, budget)
        selected.push({
          ...chunk,
          text: truncated,
          tokens: this.countTokens(truncated),
        })
        break
      }
    }

    return selected
  }

  /**
   * Split text into sentences
   */
  private splitIntoSentences(text: string): string[] {
    // Simple sentence splitting (enhance with NLP library in production)
    return text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  }

  /**
   * Extract topic from text (simplified - use NLP in production)
   */
  private extractTopic(text: string): string {
    // Simple keyword extraction
    const words = text.toLowerCase().split(/\s+/)
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    ])

    const wordFreq = new Map<string, number>()
    words.forEach((word) => {
      const cleaned = word.replace(/[^\w]/g, '')
      if (cleaned.length > 4 && !commonWords.has(cleaned)) {
        wordFreq.set(cleaned, (wordFreq.get(cleaned) || 0) + 1)
      }
    })

    const topWords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word)

    return topWords.join('_') || 'general'
  }

  /**
   * Calculate importance score (simplified)
   */
  private calculateImportance(text: string): number {
    // Factors: length, question marks, exclamation marks, keywords
    const hasQuestion = text.includes('?') ? 0.2 : 0
    const hasExclamation = text.includes('!') ? 0.15 : 0
    const lengthFactor = Math.min(text.length / 500, 0.3)
    const keywordFactor = this.hasImportantKeywords(text) ? 0.35 : 0

    return Math.min(1.0, hasQuestion + hasExclamation + lengthFactor + keywordFactor)
  }

  /**
   * Check for important keywords
   */
  private hasImportantKeywords(text: string): boolean {
    const keywords = [
      'important', 'critical', 'remember', 'note', 'key', 'essential', 'crucial',
      'prefer', 'like', 'dislike', 'hate', 'love', 'favorite', 'never', 'always',
    ]
    const lowerText = text.toLowerCase()
    return keywords.some((keyword) => lowerText.includes(keyword))
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length')
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB)
    return denominator === 0 ? 0 : dotProduct / denominator
  }

  /**
   * Select chunks by token count (fallback method)
   */
  private selectChunksByTokens(chunks: SemanticChunk[], budget: number): SemanticChunk[] {
    const selected: SemanticChunk[] = []
    let usedTokens = 0

    for (const chunk of chunks) {
      if (usedTokens + chunk.tokens <= budget) {
        selected.push(chunk)
        usedTokens += chunk.tokens
      } else {
        break
      }
    }

    return selected
  }

  /**
   * Truncate text to fit token budget
   */
  private truncateToBudget(text: string, budget: number): string {
    // Rough estimate: tokens ≈ chars / 4
    const maxChars = budget * 4
    if (text.length <= maxChars) return text

    // Truncate at sentence boundary if possible
    const sentences = this.splitIntoSentences(text)
    let result = ''
    
    for (const sentence of sentences) {
      if (this.countTokens(result + sentence) <= budget) {
        result += (result ? ' ' : '') + sentence
      } else {
        break
      }
    }

    return result || text.substring(0, maxChars)
  }
}
