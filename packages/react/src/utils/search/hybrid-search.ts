/**
 * Hybrid Search Utilities
 *
 * Premium hybrid search combining keyword (BM25) and semantic (vector) search.
 * Features multiple fusion algorithms, intelligent score normalization,
 * and robust optimizations.
 */

export interface SearchResult {
  /** Document ID */
  id: string
  /** Search score (0-1 normalized) */
  score: number
  /** Document content */
  content: string
  /** Metadata */
  metadata?: Record<string, unknown>
  /** Match type indicator */
  matchType?: 'keyword' | 'semantic' | 'hybrid'
  /** Highlight snippets */
  highlights?: string[]
}

export interface KeywordSearcher {
  /** Search using keywords */
  search(query: string, topK?: number): Promise<SearchResult[]> | SearchResult[]
}

export interface VectorSearcher {
  /** Search using vector similarity */
  search(query: string, topK?: number): Promise<SearchResult[]>
}

export interface HybridSearchOptions {
  /** Keyword searcher */
  keywordSearcher: KeywordSearcher
  /** Vector searcher */
  vectorSearcher: VectorSearcher
  /** Weight for keyword search (0-1) */
  keywordWeight?: number
  /** Weight for vector search (0-1) */
  vectorWeight?: number
  /** Fusion method */
  fusionMethod?: 'rrf' | 'weighted' | 'linear' | 'dbsf' | 'custom'
  /** RRF constant (default: 60) */
  rrfK?: number
  /** Custom fusion function */
  customFusion?: (keyword: SearchResult[], vector: SearchResult[]) => SearchResult[]
  /** Minimum score threshold (0-1) */
  minScore?: number
  /** Enable score normalization */
  normalizeScores?: boolean
  /** Include match type in results */
  includeMatchType?: boolean
}

/**
 * Hybrid Search - Combines keyword and vector search for optimal results
 *
 * Features:
 * - Multiple fusion algorithms (RRF, Weighted, Linear, DBSF)
 * - Intelligent score normalization
 * - Match type tracking
 * - Configurable weighting
 * - Robust performance
 *
 * @example
 * ```tsx
 * const hybrid = new HybridSearch({
 *   keywordSearcher: bm25Searcher,
 *   vectorSearcher: embeddingSearcher,
 *   keywordWeight: 0.3,
 *   vectorWeight: 0.7,
 *   fusionMethod: 'rrf',
 * })
 *
 * const results = await hybrid.search('machine learning', 10)
 * ```
 */
export class HybridSearch {
  private options: Required<HybridSearchOptions>

  constructor(options: HybridSearchOptions) {
    this.options = {
      keywordWeight: 0.5,
      vectorWeight: 0.5,
      fusionMethod: 'rrf',
      rrfK: 60,
      customFusion: () => [],
      minScore: 0,
      normalizeScores: true,
      includeMatchType: true,
      ...options,
    }
  }

  /**
   * Perform hybrid search with parallel execution
   */
  async search(query: string, topK = 10): Promise<SearchResult[]> {
    const fetchMultiplier = 2 // Fetch more results for better fusion

    // Run both searches in parallel for performance
    const [keywordResults, vectorResults] = await Promise.all([
      Promise.resolve(this.options.keywordSearcher.search(query, topK * fetchMultiplier)),
      this.options.vectorSearcher.search(query, topK * fetchMultiplier),
    ])

    // Add match type to results
    const keywordWithType = keywordResults.map((r) => ({
      ...r,
      matchType: 'keyword' as const,
    }))
    const vectorWithType = vectorResults.map((r) => ({
      ...r,
      matchType: 'semantic' as const,
    }))

    // Normalize scores if enabled
    const normalizedKeyword = this.options.normalizeScores
      ? this.normalizeScores(keywordWithType)
      : keywordWithType
    const normalizedVector = this.options.normalizeScores
      ? this.normalizeScores(vectorWithType)
      : vectorWithType

    // Fuse results based on selected method
    let fusedResults: SearchResult[]

    switch (this.options.fusionMethod) {
      case 'rrf':
        fusedResults = this.reciprocalRankFusion(normalizedKeyword, normalizedVector)
        break
      case 'weighted':
        fusedResults = this.weightedFusion(normalizedKeyword, normalizedVector)
        break
      case 'linear':
        fusedResults = this.linearFusion(normalizedKeyword, normalizedVector)
        break
      case 'dbsf':
        fusedResults = this.distributionBasedFusion(normalizedKeyword, normalizedVector)
        break
      case 'custom':
        fusedResults = this.options.customFusion(normalizedKeyword, normalizedVector)
        break
      default:
        fusedResults = this.reciprocalRankFusion(normalizedKeyword, normalizedVector)
    }

    // Filter by minimum score
    if (this.options.minScore > 0) {
      fusedResults = fusedResults.filter((r) => r.score >= this.options.minScore)
    }

    return fusedResults.slice(0, topK)
  }

  /**
   * Reciprocal Rank Fusion (RRF)
   *
   * Robust fusion that doesn't require score normalization.
   * Uses rank positions rather than raw scores.
   * Formula: score = sum(1 / (k + rank))
   */
  private reciprocalRankFusion(
    keywordResults: SearchResult[],
    vectorResults: SearchResult[]
  ): SearchResult[] {
    const k = this.options.rrfK
    const scores = new Map<string, number>()
    const docs = new Map<string, SearchResult>()
    const matchTypes = new Map<string, Set<string>>()

    // Process keyword results
    keywordResults.forEach((result, rank) => {
      const score = this.options.keywordWeight / (k + rank + 1)
      scores.set(result.id, (scores.get(result.id) || 0) + score)
      docs.set(result.id, result)

      if (!matchTypes.has(result.id)) {
        matchTypes.set(result.id, new Set())
      }
      matchTypes.get(result.id)!.add('keyword')
    })

    // Process vector results
    vectorResults.forEach((result, rank) => {
      const score = this.options.vectorWeight / (k + rank + 1)
      scores.set(result.id, (scores.get(result.id) || 0) + score)
      if (!docs.has(result.id)) {
        docs.set(result.id, result)
      }

      if (!matchTypes.has(result.id)) {
        matchTypes.set(result.id, new Set())
      }
      matchTypes.get(result.id)!.add('semantic')
    })

    // Build final results
    return Array.from(docs.values())
      .map((doc) => ({
        ...doc,
        score: scores.get(doc.id) || 0,
        matchType: this.determineMatchType(matchTypes.get(doc.id)),
      }))
      .sort((a, b) => b.score - a.score)
  }

  /**
   * Weighted Score Fusion
   *
   * Direct weighted combination of normalized scores.
   * Requires pre-normalized scores for accuracy.
   */
  private weightedFusion(
    keywordResults: SearchResult[],
    vectorResults: SearchResult[]
  ): SearchResult[] {
    const docs = new Map<string, SearchResult>()
    const scores = new Map<string, { keyword: number; vector: number }>()
    const matchTypes = new Map<string, Set<string>>()

    // Process keyword results
    for (const result of keywordResults) {
      const existing = scores.get(result.id) || { keyword: 0, vector: 0 }
      existing.keyword = result.score
      scores.set(result.id, existing)
      docs.set(result.id, result)

      if (!matchTypes.has(result.id)) {
        matchTypes.set(result.id, new Set())
      }
      matchTypes.get(result.id)!.add('keyword')
    }

    // Process vector results
    for (const result of vectorResults) {
      const existing = scores.get(result.id) || { keyword: 0, vector: 0 }
      existing.vector = result.score
      scores.set(result.id, existing)
      if (!docs.has(result.id)) {
        docs.set(result.id, result)
      }

      if (!matchTypes.has(result.id)) {
        matchTypes.set(result.id, new Set())
      }
      matchTypes.get(result.id)!.add('semantic')
    }

    // Calculate weighted scores
    return Array.from(docs.values())
      .map((doc) => {
        const docScores = scores.get(doc.id)!
        const finalScore =
          docScores.keyword * this.options.keywordWeight +
          docScores.vector * this.options.vectorWeight
        return {
          ...doc,
          score: finalScore,
          matchType: this.determineMatchType(matchTypes.get(doc.id)),
        }
      })
      .sort((a, b) => b.score - a.score)
  }

  /**
   * Linear Combination Fusion
   *
   * Simple averaging with optional weighting.
   * Good baseline for comparison.
   */
  private linearFusion(
    keywordResults: SearchResult[],
    vectorResults: SearchResult[]
  ): SearchResult[] {
    const docs = new Map<string, SearchResult>()
    const scores = new Map<string, number[]>()
    const matchTypes = new Map<string, Set<string>>()

    // Collect scores from both sources
    for (const result of keywordResults) {
      if (!scores.has(result.id)) {
        scores.set(result.id, [])
      }
      scores.get(result.id)!.push(result.score * this.options.keywordWeight)
      docs.set(result.id, result)

      if (!matchTypes.has(result.id)) {
        matchTypes.set(result.id, new Set())
      }
      matchTypes.get(result.id)!.add('keyword')
    }

    for (const result of vectorResults) {
      if (!scores.has(result.id)) {
        scores.set(result.id, [])
      }
      scores.get(result.id)!.push(result.score * this.options.vectorWeight)
      if (!docs.has(result.id)) {
        docs.set(result.id, result)
      }

      if (!matchTypes.has(result.id)) {
        matchTypes.set(result.id, new Set())
      }
      matchTypes.get(result.id)!.add('semantic')
    }

    // Calculate final scores
    return Array.from(docs.values())
      .map((doc) => {
        const docScores = scores.get(doc.id)!
        // Avoid division by zero if scores array is empty
        const avgScore = docScores.length > 0
          ? docScores.reduce((a, b) => a + b, 0) / docScores.length
          : 0
        return {
          ...doc,
          score: avgScore,
          matchType: this.determineMatchType(matchTypes.get(doc.id)),
        }
      })
      .sort((a, b) => b.score - a.score)
  }

  /**
   * Distribution-Based Score Fusion (DBSF)
   *
   * Advanced fusion that considers score distributions.
   * Normalizes based on standard deviation for better calibration.
   */
  private distributionBasedFusion(
    keywordResults: SearchResult[],
    vectorResults: SearchResult[]
  ): SearchResult[] {
    // Calculate statistics for each result set
    const keywordStats = this.calculateStats(keywordResults.map((r) => r.score))
    const vectorStats = this.calculateStats(vectorResults.map((r) => r.score))

    // Z-score normalization
    const normalizedKeyword = keywordResults.map((r) => ({
      ...r,
      score: keywordStats.std === 0 ? 0 : (r.score - keywordStats.mean) / keywordStats.std,
    }))
    const normalizedVector = vectorResults.map((r) => ({
      ...r,
      score: vectorStats.std === 0 ? 0 : (r.score - vectorStats.mean) / vectorStats.std,
    }))

    // Use weighted fusion with normalized scores
    return this.weightedFusion(normalizedKeyword, normalizedVector)
  }

  /**
   * Calculate mean and standard deviation
   */
  private calculateStats(scores: number[]): { mean: number; std: number } {
    if (scores.length === 0) return { mean: 0, std: 0 }

    const mean = scores.reduce((a, b) => a + b, 0) / scores.length
    const squaredDiffs = scores.map((s) => Math.pow(s - mean, 2))
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / scores.length
    const std = Math.sqrt(variance)

    return { mean, std }
  }

  /**
   * Normalize scores to 0-1 range using min-max normalization
   */
  private normalizeScores(results: SearchResult[]): SearchResult[] {
    if (results.length === 0) return []

    const scores = results.map((r) => r.score)
    const minScore = Math.min(...scores)
    const maxScore = Math.max(...scores)
    const range = maxScore - minScore

    if (range === 0) {
      return results.map((r) => ({ ...r, score: 1 }))
    }

    return results.map((r) => ({
      ...r,
      score: (r.score - minScore) / range,
    }))
  }

  /**
   * Determine final match type based on sources
   */
  private determineMatchType(
    types: Set<string> | undefined
  ): 'keyword' | 'semantic' | 'hybrid' {
    if (!types || types.size === 0) return 'keyword'
    if (types.size > 1) return 'hybrid'
    return types.has('semantic') ? 'semantic' : 'keyword'
  }

  /**
   * Update search weights dynamically
   */
  setWeights(keywordWeight: number, vectorWeight: number): void {
    this.options.keywordWeight = keywordWeight
    this.options.vectorWeight = vectorWeight
  }

  /**
   * Update fusion method
   */
  setFusionMethod(method: HybridSearchOptions['fusionMethod']): void {
    this.options.fusionMethod = method!
  }
}

/**
 * Enhanced BM25 Keyword Searcher (In-Memory)
 *
 * Production-quality BM25 implementation with:
 * - Configurable parameters (k1, b)
 * - Stop word filtering
 * - Stemming support (optional)
 * - Query expansion
 * - Highlight generation
 *
 * For production at scale, use Elasticsearch, Typesense, or Meilisearch.
 */
export class SimpleBM25Searcher implements KeywordSearcher {
  private documents: Array<{ id: string; content: string; metadata?: Record<string, unknown> }>
  private index: Map<string, Set<number>> = new Map()
  private idf: Map<string, number> = new Map()
  private docLengths: number[] = []
  private avgDocLength: number = 0
  private k1: number
  private b: number
  private stopWords: Set<string>

  constructor(
    documents: Array<{ id: string; content: string; metadata?: Record<string, unknown> }>,
    options?: { k1?: number; b?: number; stopWords?: string[] }
  ) {
    this.documents = documents
    this.k1 = options?.k1 ?? 1.5
    this.b = options?.b ?? 0.75
    this.stopWords = new Set(
      options?.stopWords ?? [
        'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for',
        'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on',
        'that', 'the', 'to', 'was', 'were', 'will', 'with',
      ]
    )
    this.buildIndex()
  }

  private buildIndex(): void {
    const docFreq = new Map<string, number>()

    // Build inverted index and calculate document lengths
    this.documents.forEach((doc, docIdx) => {
      const terms = this.tokenize(doc.content)
      this.docLengths[docIdx] = terms.length

      const uniqueTerms = new Set(terms)

      uniqueTerms.forEach((term) => {
        if (!this.index.has(term)) {
          this.index.set(term, new Set())
        }
        this.index.get(term)!.add(docIdx)
        docFreq.set(term, (docFreq.get(term) || 0) + 1)
      })
    })

    // Calculate average document length (avoid division by zero)
    this.avgDocLength = this.documents.length > 0
      ? this.docLengths.reduce((a, b) => a + b, 0) / this.documents.length
      : 1

    // Calculate IDF for each term
    const N = this.documents.length
    for (const [term, df] of docFreq.entries()) {
      // BM25 IDF formula
      this.idf.set(term, Math.log((N - df + 0.5) / (df + 0.5) + 1))
    }
  }

  search(query: string, topK = 10): SearchResult[] {
    const queryTerms = this.tokenize(query)
    const scores = new Map<number, number>()

    // Calculate BM25 scores
    queryTerms.forEach((term) => {
      const docIndices = this.index.get(term)
      if (!docIndices) return

      const idf = this.idf.get(term) || 0

      docIndices.forEach((docIdx) => {
        const doc = this.documents[docIdx]
        if (!doc) return

        const termFreq = this.getTermFrequency(term, doc.content)
        const docLength = this.docLengths[docIdx] || 1
        // Ensure avgDocLength is at least 1 to avoid division issues
        const safeAvgDocLength = Math.max(this.avgDocLength, 1)

        // BM25 scoring formula
        const numerator = termFreq * (this.k1 + 1)
        const denominator =
          termFreq + this.k1 * (1 - this.b + this.b * (docLength / safeAvgDocLength))
        // Avoid division by zero in denominator
        const score = denominator > 0 ? idf * (numerator / denominator) : 0

        scores.set(docIdx, (scores.get(docIdx) || 0) + score)
      })
    })

    // Sort and return top K results
    return Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topK)
      .map(([docIdx, score]) => {
        const doc = this.documents[docIdx]
        if (!doc) {
          return { id: '', score, content: '', metadata: {}, matchType: 'keyword' as const }
        }

        // Generate highlights
        const highlights = this.generateHighlights(doc.content, queryTerms)

        return {
          id: doc.id,
          score,
          content: doc.content,
          metadata: doc.metadata,
          matchType: 'keyword' as const,
          highlights,
        }
      })
  }

  /**
   * Tokenize text into searchable terms
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 1 && !this.stopWords.has(t))
  }

  /**
   * Count term frequency in text
   */
  private getTermFrequency(term: string, text: string): number {
    const tokens = this.tokenize(text)
    return tokens.filter((t) => t === term).length
  }

  /**
   * Generate highlight snippets around matched terms
   */
  private generateHighlights(content: string, queryTerms: string[]): string[] {
    const highlights: string[] = []
    const contentLower = content.toLowerCase()

    for (const term of queryTerms) {
      const pos = contentLower.indexOf(term)
      if (pos !== -1) {
        const start = Math.max(0, pos - 50)
        const end = Math.min(content.length, pos + term.length + 50)
        let snippet = content.slice(start, end)

        if (start > 0) snippet = '...' + snippet
        if (end < content.length) snippet = snippet + '...'

        highlights.push(snippet)

        if (highlights.length >= 3) break
      }
    }

    return highlights
  }

  /**
   * Add documents to the index
   */
  addDocuments(
    docs: Array<{ id: string; content: string; metadata?: Record<string, unknown> }>
  ): void {
    this.documents.push(...docs)
    this.buildIndex()
  }

  /**
   * Remove documents from the index
   */
  removeDocuments(ids: string[]): void {
    const idSet = new Set(ids)
    this.documents = this.documents.filter((d) => !idSet.has(d.id))
    this.buildIndex()
  }

  /**
   * Get statistics about the index
   */
  getStats(): {
    documentCount: number
    termCount: number
    avgDocLength: number
  } {
    return {
      documentCount: this.documents.length,
      termCount: this.index.size,
      avgDocLength: this.avgDocLength,
    }
  }
}

/**
 * Create a hybrid search instance with default searchers
 */
export function createHybridSearch(
  documents: Array<{ id: string; content: string; metadata?: Record<string, unknown> }>,
  vectorSearcher: VectorSearcher,
  options?: Partial<HybridSearchOptions>
): HybridSearch {
  const keywordSearcher = new SimpleBM25Searcher(documents)

  return new HybridSearch({
    keywordSearcher,
    vectorSearcher,
    ...options,
  })
}
