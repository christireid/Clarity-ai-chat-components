/**
 * Qdrant Vector Store Implementation
 *
 * High-performance vector database with excellent filtering capabilities.
 * Can be self-hosted or used via Qdrant Cloud.
 */
export class QdrantVectorStore {
    provider = 'qdrant';
    apiKey;
    endpoint;
    collectionName;
    _initialized = false;
    constructor(config) {
        if (!config.endpoint) {
            throw new Error('Qdrant endpoint is required');
        }
        this.apiKey = config.apiKey;
        this.endpoint = config.endpoint.replace(/\/$/, '');
        this.collectionName = config.collectionName || config.indexName;
    }
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.apiKey) {
            headers['api-key'] = this.apiKey;
        }
        return headers;
    }
    async initialize() {
        // Check if collection exists, create if not
        const response = await fetch(`${this.endpoint}/collections/${this.collectionName}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        if (response.status === 404) {
            // Collection doesn't exist, create it
            const createResponse = await fetch(`${this.endpoint}/collections/${this.collectionName}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    vectors: {
                        size: 1536, // Default to OpenAI embedding size
                        distance: 'Cosine',
                    },
                }),
            });
            if (!createResponse.ok) {
                throw new Error(`Failed to create Qdrant collection: ${await createResponse.text()}`);
            }
        }
        else if (!response.ok) {
            throw new Error(`Failed to verify Qdrant collection: ${await response.text()}`);
        }
        this._initialized = true;
    }
    async upsert(vectors, _options) {
        const response = await fetch(`${this.endpoint}/collections/${this.collectionName}/points`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify({
                points: vectors.map(v => ({
                    id: v.id,
                    vector: v.values,
                    payload: v.metadata || {},
                })),
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Qdrant upsert failed: ${error}`);
        }
    }
    async query(query) {
        if (!query.vector) {
            throw new Error('Vector query is required for Qdrant');
        }
        const response = await fetch(`${this.endpoint}/collections/${this.collectionName}/points/search`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                vector: query.vector,
                limit: query.topK || 10,
                filter: query.filter ? this.convertFilter(query.filter) : undefined,
                with_payload: query.includeMetadata ?? true,
                with_vector: query.includeValues ?? false,
                score_threshold: query.minScore,
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Qdrant query failed: ${error}`);
        }
        const data = await response.json();
        return data.result.map((r) => ({
            id: r.id,
            score: r.score,
            values: r.vector,
            metadata: r.payload,
        }));
    }
    convertFilter(filter) {
        // Convert simple filter to Qdrant filter format
        const must = [];
        for (const [key, value] of Object.entries(filter)) {
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                must.push({
                    key,
                    match: { value },
                });
            }
            else if (Array.isArray(value)) {
                must.push({
                    key,
                    match: { any: value },
                });
            }
        }
        return must.length > 0 ? { must } : undefined;
    }
    async delete(ids, _namespace) {
        const response = await fetch(`${this.endpoint}/collections/${this.collectionName}/points/delete`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                points: ids,
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Qdrant delete failed: ${error}`);
        }
    }
    async deleteNamespace(namespace) {
        // Qdrant doesn't have native namespace support
        // Delete all points with matching namespace in metadata
        const response = await fetch(`${this.endpoint}/collections/${this.collectionName}/points/delete`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                filter: {
                    must: [
                        {
                            key: 'namespace',
                            match: { value: namespace },
                        },
                    ],
                },
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Qdrant deleteNamespace failed: ${error}`);
        }
    }
    async getStats() {
        const response = await fetch(`${this.endpoint}/collections/${this.collectionName}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Qdrant getStats failed: ${error}`);
        }
        const data = await response.json();
        return {
            totalVectors: data.result.points_count || 0,
            dimension: data.result.config?.params?.vectors?.size || 0,
            status: data.result.status === 'green' ? 'ready' : 'initializing',
        };
    }
    async fetch(ids, _namespace) {
        const response = await fetch(`${this.endpoint}/collections/${this.collectionName}/points`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                ids,
                with_payload: true,
                with_vector: true,
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Qdrant fetch failed: ${error}`);
        }
        const data = await response.json();
        return data.result.map((r) => ({
            id: r.id,
            values: r.vector,
            metadata: r.payload,
        }));
    }
    async list(namespace, limit = 100, paginationToken) {
        const offset = paginationToken ? parseInt(paginationToken) : 0;
        const response = await fetch(`${this.endpoint}/collections/${this.collectionName}/points/scroll`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                limit,
                offset,
                with_payload: false,
                with_vector: false,
                filter: namespace ? {
                    must: [
                        {
                            key: 'namespace',
                            match: { value: namespace },
                        },
                    ],
                } : undefined,
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Qdrant list failed: ${error}`);
        }
        const data = await response.json();
        return {
            ids: data.result.points.map((p) => p.id),
            nextToken: data.result.next_page_offset ? String(data.result.next_page_offset) : undefined,
        };
    }
    async close() {
        this._initialized = false;
    }
}
//# sourceMappingURL=qdrant.js.map