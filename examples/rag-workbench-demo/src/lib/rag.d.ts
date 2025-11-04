/**
 * RAG (Retrieval Augmented Generation) utilities
 */
import type { Document, DocumentChunk, SearchResult, RAGConfig } from '../types/document';
export declare const RAG_CONFIG: RAGConfig;
/**
 * Simple tokenization (approximate - production should use tiktoken)
 */
export declare function approximateTokenCount(text: string): number;
/**
 * Chunk document into overlapping segments
 */
export declare function chunkDocument(content: string, config?: RAGConfig): DocumentChunk[];
/**
 * Simple keyword-based search
 * Production should use vector embeddings (OpenAI, Cohere, etc.)
 */
export declare function searchChunks(query: string, documents: Document[], topK?: number, documentIds?: string[]): SearchResult[];
/**
 * Build context from search results
 */
export declare function buildContext(searchResults: SearchResult[], maxTokens?: number): string;
/**
 * Create RAG prompt
 */
export declare function createRAGPrompt(query: string, context: string): string;
/**
 * Extract sources from search results
 */
export declare function extractSources(searchResults: SearchResult[]): {
    documentId: string;
    documentName: string;
    chunkIndex: number;
    text: string;
    relevanceScore: number;
}[];
/**
 * Calculate cost estimate
 */
export declare function estimateCost(promptTokens: number, completionTokens: number, model: string): number;
//# sourceMappingURL=rag.d.ts.map