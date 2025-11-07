/**
 * Hybrid Search Utilities
 * 
 * Combine keyword (BM25) and semantic (vector) search for better results.
 * Flexible and composable - bring your own search implementations.
 */

export interface SearchResult {
  /** Document ID */
  id: string
  /** Search score */
  score: number
  /** Document content */
  content: string
  /** Metadata */
  metadata?: Record<string, any>
}

export interface KeywordSearcher {
  /**
   * Search using keywords
   */
  search(query: string, topK?: number): Promise<SearchResult[]> | SearchResult[]
}

export interface VectorSearcher {
  /**
   * Search using vector similarity
   */
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
  fusionMethod?: 'rrf' | 'weighted' | 'custom'
  /** Custom fusion function */
  customFusion?: (keyword: SearchResult[], vector: SearchResult[]) => SearchResult[]
}

/**
 * Hybrid search - combines keyword and vector search
 * 
 * @example
 * ```tsx
 * const hybrid = new HybridSearch({
 *   keywordSearcher: bm25,
 *   vectorSearcher: vectorStore,
 *   keywordWeight: 0.3,
 *   vectorWeight: 0.7,
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
      customFusion: () => [],
      ...options,
    }
  }
  
  /**
   * Perform hybrid search
   */
  async search(query: string, topK = 10): Promise<SearchResult[]> {
    // Run both searches in parallel
    const [keywordResults, vectorResults] = await Promise.all([
      Promise.resolve(this.options.keywordSearcher.search(query, topK * 2)),
      this.options.vectorSearcher.search(query, topK * 2),
    ])
    
    // Fuse results
    let fusedResults: SearchResult[]
    
    if (this.options.fusionMethod === 'rrf') {
      fusedResults = this.reciprocalRankFusion(keywordResults, vectorResults)
    } else if (this.options.fusionMethod === 'weighted') {
      fusedResults = this.weightedFusion(keywordResults, vectorResults)
    } else if (this.options.customFusion) {
      fusedResults = this.options.customFusion(keywordResults, vectorResults)
    } else {
      fusedResults = this.reciprocalRankFusion(keywordResults, vectorResults)
    }
    
    return fusedResults.slice(0, topK)
  }
  
  /**
   * Reciprocal Rank Fusion (RRF)
   * 
   * Combines rankings without needing score normalization.
   * More robust when search scores are in different ranges.
   */
  private reciprocalRankFusion(
    keywordResults: SearchResult[],
    vectorResults: SearchResult[]
  ): SearchResult[] {
    const k = 60 // RRF constant
    const scores = new Map<string, number>()
    const docs = new Map<string, SearchResult>()
    
    // Add keyword results
    keywordResults.forEach((result, rank) => {
      const score = 1 / (k + rank + 1)
      scores.set(result.id, (scores.get(result.id) || 0) + score * this.options.keywordWeight)
      docs.set(result.id, result)
    })
    
    // Add vector results
    vectorResults.forEach((result, rank) => {
      const score = 1 / (k + rank + 1)
      scores.set(result.id, (scores.get(result.id) || 0) + score * this.options.vectorWeight)
      if (!docs.has(result.id)) {
        docs.set(result.id, result)
      }
    })
    
    // Sort by fused score
    return Array.from(docs.values())
      .map(doc => ({
        ...doc,
        score: scores.get(doc.id) || 0,
      }))
      .sort((a, b) => b.score - a.score)
  }
  
  /**
   * Weighted score fusion
   * 
   * Combines normalized scores with weights.
   * Requires score normalization.
   */
  private weightedFusion(
    keywordResults: SearchResult[],
    vectorResults: SearchResult[]
  ): SearchResult[] {
    // Normalize scores
    const normalizedKeyword = this.normalizeScores(keywordResults)
    const normalizedVector = this.normalizeScores(vectorResults)
    
    // Create doc map
    const docs = new Map<string, SearchResult>()
    const scores = new Map<string, number>()
    
    // Add keyword scores
    normalizedKeyword.forEach(result => {
      const score = result.score * this.options.keywordWeight
      scores.set(result.id, score)
      docs.set(result.id, result)
    })
    
    // Add vector scores
    normalizedVector.forEach(result => {
      const score = result.score * this.options.vectorWeight
      scores.set(result.id, (scores.get(result.id) || 0) + score)
      if (!docs.has(result.id)) {
        docs.set(result.id, result)
      }
    })
    
    // Sort by fused score
    return Array.from(docs.values())
      .map(doc => ({
        ...doc,
        score: scores.get(doc.id) || 0,
      }))
      .sort((a, b) => b.score - a.score)
  }
  
  /**
   * Normalize scores to 0-1 range
   */
  private normalizeScores(results: SearchResult[]): SearchResult[] {
    if (results.length === 0) return []
    
    const scores = results.map(r => r.score)
    const minScore = Math.min(...scores)
    const maxScore = Math.max(...scores)
    const range = maxScore - minScore
    
    if (range === 0) {
      return results.map(r => ({ ...r, score: 1 }))
    }
    
    return results.map(r => ({
      ...r,
      score: (r.score - minScore) / range,
    }))
  }
}

/**
 * Simple BM25 keyword searcher (in-memory)
 * 
 * For production, use a proper search engine like Elasticsearch or Typesense.
 */
export class SimpleBM25Searcher implements KeywordSearcher {
  private documents: Array<{ id: string; content: string; metadata?: any }>
  private index: Map<string, Set<number>> = new Map()
  private idf: Map<string, number> = new Map()
  
  constructor(documents: Array<{ id: string; content: string; metadata?: any }>) {
    this.documents = documents
    this.buildIndex()
  }
  
  private buildIndex(): void {
    const docFreq = new Map<string, number>()
    
    // Build inverted index
    this.documents.forEach((doc, docIdx) => {
      const terms = this.tokenize(doc.content)
      const uniqueTerms = new Set(terms)
      
      uniqueTerms.forEach(term => {
        if (!this.index.has(term)) {
          this.index.set(term, new Set())
        }
        this.index.get(term)!.add(docIdx)
        
        docFreq.set(term, (docFreq.get(term) || 0) + 1)
      })
    })
    
    // Calculate IDF
    const N = this.documents.length
    const docFreqEntries = Array.from(docFreq.entries())
    for (const [term, df] of docFreqEntries) {
      this.idf.set(term, Math.log((N - df + 0.5) / (df + 0.5) + 1))
    }
  }
  
  search(query: string, topK = 10): SearchResult[] {
    const queryTerms = this.tokenize(query)
    const scores = new Map<number, number>()
    
    // Calculate BM25 scores
    queryTerms.forEach(term => {
      const docIndices = this.index.get(term)
      if (!docIndices) return
      
      const idf = this.idf.get(term) || 0
      
      docIndices.forEach(docIdx => {
        const doc = this.documents[docIdx]
        const termFreq = this.getTermFrequency(term, doc.content)
        const docLength = this.tokenize(doc.content).length
        const avgDocLength = this.documents.reduce((sum, d) =>
          sum + this.tokenize(d.content).length, 0) / this.documents.length
        
        const k1 = 1.5
        const b = 0.75
        
        const score = idf * (termFreq * (k1 + 1)) /
          (termFreq + k1 * (1 - b + b * docLength / avgDocLength))
        
        scores.set(docIdx, (scores.get(docIdx) || 0) + score)
      })
    })
    
    // Sort and return top K
    return Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topK)
      .map(([docIdx, score]) => ({
        id: this.documents[docIdx].id,
        score,
        content: this.documents[docIdx].content,
        metadata: this.documents[docIdx].metadata,
      }))
  }
  
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 0)
  }
  
  private getTermFrequency(term: string, text: string): number {
    const tokens = this.tokenize(text)
    return tokens.filter(t => t === term).length
  }
}

