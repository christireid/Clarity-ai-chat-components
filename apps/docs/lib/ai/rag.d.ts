/**
 * RAG (Retrieval-Augmented Generation)
 *
 * Core logic for retrieving relevant documentation and generating
 * context-aware responses using the indexed documentation.
 */
import { type SearchResult } from './vectorStore';
export interface RAGContext {
    /** The user's question */
    query: string;
    /** Retrieved documentation chunks */
    sources: SearchResult[];
    /** Formatted context for the LLM */
    context: string;
    /** System prompt with context */
    systemPrompt: string;
}
export interface RAGOptions {
    /** Number of documents to retrieve (default: 5) */
    topK?: number;
    /** Minimum similarity score threshold (0-1, default: 0.7) */
    minScore?: number;
    /** Include sources in response (default: true) */
    includeSources?: boolean;
    /** Current page path for contextual prompts */
    currentPath?: string;
    /** Maximum context length in characters */
    maxContextLength?: number;
}
/**
 * Retrieve relevant documentation for a query using semantic search or keyword search
 */
export declare function retrieveRelevantDocs(query: string, options?: RAGOptions): Promise<SearchResult[]>;
/**
 * Build context from retrieved documents
 */
export declare function buildContext(sources: SearchResult[], maxLength?: number): string;
/**
 * Generate a complete RAG context for a query
 */
export declare function generateRAGContext(query: string, options?: RAGOptions): Promise<RAGContext>;
/**
 * Format RAG context for LLM consumption
 */
export declare function formatRAGPrompt(ragContext: RAGContext): string;
/**
 * Enhance a user message with RAG context
 */
export declare function enhanceMessageWithRAG(userMessage: string, options?: RAGOptions): Promise<{
    enhancedMessage: string;
    ragContext: RAGContext;
    hasRelevantDocs: boolean;
}>;
/**
 * Get suggested follow-up questions based on retrieved documents
 */
export declare function getSuggestedFollowUps(sources: SearchResult[]): string[];
/**
 * Calculate relevance score for a query-document pair
 * Combines vector similarity with text-based heuristics
 */
export declare function calculateRelevanceScore(query: string, source: SearchResult): number;
/**
 * Rerank search results using multiple signals
 */
export declare function rerankResults(query: string, results: SearchResult[]): SearchResult[];
/**
 * Check if a query is likely to need documentation context
 */
export declare function shouldUseRAG(query: string): boolean;
/**
 * Format citations for display in the UI
 */
export interface Citation {
    id: string;
    source: string;
    chunkText: string;
    url: string;
    confidence: number;
}
export declare function formatCitations(sources: SearchResult[]): Citation[];
//# sourceMappingURL=rag.d.ts.map