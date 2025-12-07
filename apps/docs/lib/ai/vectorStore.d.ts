/**
 * Vector Store
 *
 * Handles storing and retrieving document embeddings for semantic search.
 * Supports both Pinecone (production) and local storage (development).
 */
export interface DocChunk {
    id: string;
    title: string;
    content: string;
    url: string;
    category: 'component' | 'hook' | 'guide' | 'cookbook' | 'example' | 'concept';
    embedding: number[];
    metadata: {
        lastUpdated: string;
        tags: string[];
        section?: string;
        headings?: string[];
    };
}
export interface SearchResult {
    id: string;
    title: string;
    content: string;
    url: string;
    category: string;
    score: number;
    metadata: DocChunk['metadata'];
}
export interface VectorStore {
    /** Initialize the vector store */
    initialize(): Promise<void>;
    /** Store a single document chunk */
    upsert(chunk: DocChunk): Promise<void>;
    /** Store multiple document chunks in batch */
    upsertBatch(chunks: DocChunk[]): Promise<void>;
    /** Search for similar documents */
    search(embedding: number[], topK?: number): Promise<SearchResult[]>;
    /** Delete a document chunk */
    delete(id: string): Promise<void>;
    /** Delete all documents */
    clear(): Promise<void>;
    /** Get statistics about the store */
    getStats(): Promise<{
        count: number;
        dimensions: number;
    }>;
}
/**
 * Pinecone Vector Store (Production)
 */
export declare class PineconeVectorStore implements VectorStore {
    private client;
    private indexName;
    private namespace;
    constructor(namespace?: string);
    private getClient;
    initialize(): Promise<void>;
    upsert(chunk: DocChunk): Promise<void>;
    upsertBatch(chunks: DocChunk[]): Promise<void>;
    search(embedding: number[], topK?: number): Promise<SearchResult[]>;
    delete(id: string): Promise<void>;
    clear(): Promise<void>;
    getStats(): Promise<{
        count: number;
        dimensions: number;
    }>;
}
/**
 * Local Vector Store (Development)
 * Stores embeddings in a JSON file for development without Pinecone
 */
export declare class LocalVectorStore implements VectorStore {
    private filePath;
    private chunks;
    constructor(filePath?: string);
    initialize(): Promise<void>;
    private persist;
    upsert(chunk: DocChunk): Promise<void>;
    upsertBatch(chunks: DocChunk[]): Promise<void>;
    search(embedding: number[], topK?: number): Promise<SearchResult[]>;
    delete(id: string): Promise<void>;
    clear(): Promise<void>;
    getStats(): Promise<{
        count: number;
        dimensions: number;
    }>;
}
/**
 * Get the appropriate vector store based on environment
 */
export declare function getVectorStore(): VectorStore;
//# sourceMappingURL=vectorStore.d.ts.map