/**
 * Hybrid Search Utilities
 *
 * Combine keyword (BM25) and semantic (vector) search for better results.
 * Flexible and composable - bring your own search implementations.
 */
export interface SearchResult {
    /** Document ID */
    id: string;
    /** Search score */
    score: number;
    /** Document content */
    content: string;
    /** Metadata */
    metadata?: Record<string, any>;
}
export interface KeywordSearcher {
    /**
     * Search using keywords
     */
    search(query: string, topK?: number): Promise<SearchResult[]> | SearchResult[];
}
export interface VectorSearcher {
    /**
     * Search using vector similarity
     */
    search(query: string, topK?: number): Promise<SearchResult[]>;
}
export interface HybridSearchOptions {
    /** Keyword searcher */
    keywordSearcher: KeywordSearcher;
    /** Vector searcher */
    vectorSearcher: VectorSearcher;
    /** Weight for keyword search (0-1) */
    keywordWeight?: number;
    /** Weight for vector search (0-1) */
    vectorWeight?: number;
    /** Fusion method */
    fusionMethod?: 'rrf' | 'weighted' | 'custom';
    /** Custom fusion function */
    customFusion?: (keyword: SearchResult[], vector: SearchResult[]) => SearchResult[];
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
export declare class HybridSearch {
    private options;
    constructor(options: HybridSearchOptions);
    /**
     * Perform hybrid search
     */
    search(query: string, topK?: number): Promise<SearchResult[]>;
    /**
     * Reciprocal Rank Fusion (RRF)
     *
     * Combines rankings without needing score normalization.
     * More robust when search scores are in different ranges.
     */
    private reciprocalRankFusion;
    /**
     * Weighted score fusion
     *
     * Combines normalized scores with weights.
     * Requires score normalization.
     */
    private weightedFusion;
    /**
     * Normalize scores to 0-1 range
     */
    private normalizeScores;
}
/**
 * Simple BM25 keyword searcher (in-memory)
 *
 * For production, use a proper search engine like Elasticsearch or Typesense.
 */
export declare class SimpleBM25Searcher implements KeywordSearcher {
    private documents;
    private index;
    private idf;
    constructor(documents: Array<{
        id: string;
        content: string;
        metadata?: any;
    }>);
    private buildIndex;
    search(query: string, topK?: number): SearchResult[];
    private tokenize;
    private getTermFrequency;
}
//# sourceMappingURL=hybrid-search.d.ts.map