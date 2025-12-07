/**
 * Embeddings Generation
 *
 * Handles generating vector embeddings for documentation content using OpenAI's API.
 * Embeddings enable semantic search across documentation.
 */
export interface EmbeddingOptions {
    /** The model to use for embeddings (default: text-embedding-3-small) */
    model?: 'text-embedding-3-small' | 'text-embedding-3-large' | 'text-embedding-ada-002';
    /** Dimensions for the embedding (only for text-embedding-3-* models) */
    dimensions?: number;
}
/**
 * Generate embedding for a single text string
 */
export declare function generateEmbedding(text: string, options?: EmbeddingOptions): Promise<number[]>;
/**
 * Generate embeddings for multiple texts in batch
 * More efficient than calling generateEmbedding multiple times
 */
export declare function generateEmbeddingsBatch(texts: string[], options?: EmbeddingOptions): Promise<number[][]>;
/**
 * Split large text into chunks for embedding
 * Documents longer than the model's token limit need to be chunked
 */
export interface ChunkOptions {
    /** Maximum chunk size in characters (approximate) */
    maxChunkSize?: number;
    /** Overlap between chunks in characters */
    overlap?: number;
    /** Split on sentence boundaries when possible */
    splitOnSentences?: boolean;
}
export declare function chunkText(text: string, options?: ChunkOptions): string[];
/**
 * Calculate cosine similarity between two embeddings
 * Returns a value between -1 and 1, where 1 means identical
 */
export declare function cosineSimilarity(a: number[], b: number[]): number;
/**
 * Estimate token count for a text string
 * This is a rough approximation: ~4 characters per token for English
 */
export declare function estimateTokenCount(text: string): number;
/**
 * Estimate cost for embedding generation
 * Prices as of 2024 (subject to change)
 */
export declare function estimateEmbeddingCost(tokenCount: number, model?: 'text-embedding-3-small' | 'text-embedding-3-large' | 'text-embedding-ada-002'): number;
//# sourceMappingURL=embeddings.d.ts.map