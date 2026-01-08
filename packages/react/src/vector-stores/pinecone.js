/**
 * Pinecone Vector Store Implementation
 *
 * Enterprise-grade vector database with excellent performance
 * and scalability. Ideal for production RAG systems.
 */
export class PineconeVectorStore {
    provider = 'pinecone';
    apiKey;
    _environment;
    _indexName;
    baseUrl;
    _initialized = false;
    constructor(config) {
        if (!config.apiKey) {
            throw new Error('Pinecone API key is required');
        }
        if (!config.environment) {
            throw new Error('Pinecone environment is required');
        }
        if (!config.indexName) {
            throw new Error('Index name is required');
        }
        this.apiKey = config.apiKey;
        this._environment = config.environment;
        this._indexName = config.indexName;
        this.baseUrl = `https://${config.indexName}-${config.projectId || ''}.svc.${config.environment}.pinecone.io`;
    }
    async initialize() {
        // Verify connection by fetching index stats
        await this.getStats();
        this._initialized = true;
    }
    async upsert(vectors, options) {
        const namespace = options?.namespace || '';
        const batchSize = options?.batchSize || 100;
        // Process in batches
        for (let i = 0; i < vectors.length; i += batchSize) {
            const batch = vectors.slice(i, i + batchSize);
            const response = await fetch(`${this.baseUrl}/vectors/upsert`, {
                method: 'POST',
                headers: {
                    'Api-Key': this.apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vectors: batch.map((v) => ({
                        id: v.id,
                        values: v.values,
                        metadata: v.metadata,
                        sparseValues: v.sparseValues,
                    })),
                    namespace,
                }),
            });
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Pinecone upsert failed: ${error}`);
            }
        }
    }
    async query(query) {
        if (!query.vector && !query.text) {
            throw new Error('Either vector or text query is required');
        }
        const response = await fetch(`${this.baseUrl}/query`, {
            method: 'POST',
            headers: {
                'Api-Key': this.apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                vector: query.vector,
                topK: query.topK || 10,
                filter: query.filter,
                includeValues: query.includeValues ?? false,
                includeMetadata: query.includeMetadata ?? true,
                namespace: query.namespace || '',
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Pinecone query failed: ${error}`);
        }
        const data = await response.json();
        return data.matches
            .filter((m) => !query.minScore || m.score >= query.minScore)
            .map((m) => ({
            id: m.id,
            score: m.score,
            values: m.values,
            metadata: m.metadata,
        }));
    }
    async delete(ids, namespace) {
        const response = await fetch(`${this.baseUrl}/vectors/delete`, {
            method: 'POST',
            headers: {
                'Api-Key': this.apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ids,
                namespace: namespace || '',
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Pinecone delete failed: ${error}`);
        }
    }
    async deleteNamespace(namespace) {
        const response = await fetch(`${this.baseUrl}/vectors/delete`, {
            method: 'POST',
            headers: {
                'Api-Key': this.apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                deleteAll: true,
                namespace,
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Pinecone deleteNamespace failed: ${error}`);
        }
    }
    async getStats() {
        const response = await fetch(`${this.baseUrl}/describe_index_stats`, {
            method: 'POST',
            headers: {
                'Api-Key': this.apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Pinecone getStats failed: ${error}`);
        }
        const data = await response.json();
        return {
            totalVectors: data.totalVectorCount || 0,
            dimension: data.dimension || 0,
            namespaces: Object.keys(data.namespaces || {}),
            status: 'ready',
        };
    }
    async fetch(ids, namespace) {
        const response = await fetch(`${this.baseUrl}/vectors/fetch`, {
            method: 'POST',
            headers: {
                'Api-Key': this.apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ids,
                namespace: namespace || '',
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Pinecone fetch failed: ${error}`);
        }
        const data = await response.json();
        return Object.entries(data.vectors || {}).map(([id, vec]) => ({
            id,
            values: vec.values,
            metadata: vec.metadata,
            sparseValues: vec.sparseValues,
        }));
    }
    async list(namespace, limit = 100, paginationToken) {
        const response = await fetch(`${this.baseUrl}/vectors/list`, {
            method: 'POST',
            headers: {
                'Api-Key': this.apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                namespace: namespace || '',
                limit,
                paginationToken,
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Pinecone list failed: ${error}`);
        }
        const data = await response.json();
        return {
            ids: data.vectors?.map((v) => v.id) || [],
            nextToken: data.pagination?.next,
        };
    }
    async close() {
        // Pinecone uses HTTP, no persistent connection to close
        this._initialized = false;
    }
}
//# sourceMappingURL=pinecone.js.map