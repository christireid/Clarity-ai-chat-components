/**
 * Weaviate Vector Store Implementation
 *
 * GraphQL-based vector database with strong semantic search.
 * Excellent for complex filtering and schema management.
 */
import type { VectorStore, VectorStoreConfig, Vector, VectorQuery, VectorMatch, VectorUpsertOptions, VectorStats } from './types';
export interface WeaviateConfig extends VectorStoreConfig {
    provider: 'weaviate';
    endpoint: string;
    className?: string;
}
export declare class WeaviateVectorStore implements VectorStore {
    readonly provider = "weaviate";
    private apiKey?;
    private endpoint;
    private className;
    private _initialized;
    constructor(config: WeaviateConfig);
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
//# sourceMappingURL=weaviate.d.ts.map