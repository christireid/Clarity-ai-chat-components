/**
 * Keyword-Based Search for Documentation
 *
 * Provides semantic search without requiring embeddings or API keys.
 * Uses TF-IDF-like scoring with keyword matching.
 */
interface DocChunk {
    id: string;
    title: string;
    content: string;
    url: string;
    category: 'component' | 'hook' | 'guide' | 'cookbook' | 'example' | 'concept';
    keywords: string[];
    metadata: {
        lastUpdated: string;
        tags: string[];
        section?: string;
        headings?: string[];
    };
}
interface SearchResult {
    chunk: DocChunk;
    score: number;
    matches: {
        title: number;
        keywords: number;
        content: number;
        headings: number;
    };
}
interface SearchOptions {
    topK?: number;
    minScore?: number;
    category?: DocChunk['category'];
    currentPath?: string;
}
/**
 * Search documentation using keyword matching
 */
export declare function searchDocumentation(query: string, options?: SearchOptions): SearchResult[];
/**
 * Format search results for RAG context
 */
export declare function formatSearchResultsForRAG(results: SearchResult[]): {
    sources: Array<{
        url: string;
        title: string;
        score: number;
    }>;
    context: string;
};
/**
 * Get related documentation for a specific page
 */
export declare function getRelatedDocumentation(currentPath: string, limit?: number): DocChunk[];
export {};
//# sourceMappingURL=keywordSearch.d.ts.map