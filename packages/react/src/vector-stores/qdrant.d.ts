/**
 * Qdrant Vector Store Implementation
 *
 * High-performance vector database with excellent filtering capabilities.
 * Can be self-hosted or used via Qdrant Cloud.
 */
import type { VectorStore, VectorStoreConfig, Vector, VectorQuery, VectorMatch, VectorUpsertOptions, VectorStats } from './types';
export interface QdrantConfig extends VectorStoreConfig {
    provider: 'qdrant';
    endpoint: string;
    collectionName?: string;
}
export declare class QdrantVectorStore implements VectorStore {
    readonly provider = "qdrant";
    private apiKey?;
    private endpoint;
    private collectionName;
    private _initialized;
    constructor(config: QdrantConfig);
    private getHeaders;
    initialize(): Promise<void>;
    upsert(vectors: Vector[], _options?: VectorUpsertOptions): Promise<void>;
    query(query: VectorQuery): Promise<VectorMatch[]>;
    private convertFilter;
    delete(ids: string[], _namespace?: string): Promise<void>;
    deleteNamespace(namespace: string): Promise<void>;
    getStats(): Promise<VectorStats>;
    fetch(ids: string[], _namespace?: string): Promise<Vector[]>;
    list(namespace?: string, limit?: number, paginationToken?: string): Promise<{
        ids: string[];
        nextToken?: string;
    }>;
    close(): Promise<void>;
}
//# sourceMappingURL=qdrant.d.ts.map