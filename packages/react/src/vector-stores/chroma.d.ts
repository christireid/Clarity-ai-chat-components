/**
 * Chroma Vector Store Implementation
 *
 * Open-source embedding database with excellent developer experience.
 * Perfect for prototyping and can be self-hosted.
 */
import type { VectorStore, VectorStoreConfig, Vector, VectorQuery, VectorMatch, VectorUpsertOptions, VectorStats } from './types';
export interface ChromaConfig extends VectorStoreConfig {
    provider: 'chroma';
    endpoint?: string;
    tenant?: string;
    database?: string;
}
export declare class ChromaVectorStore implements VectorStore {
    readonly provider = "chroma";
    private endpoint;
    private collectionName;
    private tenant;
    private database;
    private collectionId?;
    private initialized;
    constructor(config: ChromaConfig);
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
//# sourceMappingURL=chroma.d.ts.map