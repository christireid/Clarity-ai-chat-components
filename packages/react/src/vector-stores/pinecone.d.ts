/**
 * Pinecone Vector Store Implementation
 *
 * Enterprise-grade vector database with excellent performance
 * and scalability. Ideal for production RAG systems.
 */
import type { VectorStore, VectorStoreConfig, Vector, VectorQuery, VectorMatch, VectorUpsertOptions, VectorStats } from './types';
export interface PineconeConfig extends VectorStoreConfig {
    provider: 'pinecone';
    environment: string;
    projectId?: string;
}
export declare class PineconeVectorStore implements VectorStore {
    readonly provider = "pinecone";
    private apiKey;
    private _environment;
    private _indexName;
    private baseUrl;
    private _initialized;
    constructor(config: PineconeConfig);
    initialize(): Promise<void>;
    upsert(vectors: Vector[], options?: VectorUpsertOptions): Promise<void>;
    query(query: VectorQuery): Promise<VectorMatch[]>;
    delete(ids: string[], namespace?: string): Promise<void>;
    deleteNamespace(namespace: string): Promise<void>;
    getStats(): Promise<VectorStats>;
    fetch(ids: string[], namespace?: string): Promise<Vector[]>;
    list(namespace?: string, limit?: number, paginationToken?: string): Promise<{
        ids: string[];
        nextToken?: string;
    }>;
    close(): Promise<void>;
}
//# sourceMappingURL=pinecone.d.ts.map