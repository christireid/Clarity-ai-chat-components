/**
 * Weaviate Vector Store Implementation
 *
 * GraphQL-based vector database with strong semantic search.
 * Excellent for complex filtering and schema management.
 */
export class WeaviateVectorStore {
    provider = 'weaviate';
    apiKey;
    endpoint;
    className;
    _initialized = false;
    constructor(config) {
        if (!config.endpoint) {
            throw new Error('Weaviate endpoint is required');
        }
        this.apiKey = config.apiKey;
        this.endpoint = config.endpoint.replace(/\/$/, '');
        this.className = config.className || config.indexName || 'Document';
    }
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.apiKey) {
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        }
        return headers;
    }
    async initialize() {
        // Check if class exists
        const response = await fetch(`${this.endpoint}/v1/schema/${this.className}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        if (response.status === 404) {
            // Create class
            const createResponse = await fetch(`${this.endpoint}/v1/schema`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    class: this.className,
                    vectorizer: 'none', // We provide vectors
                    properties: [
                        {
                            name: 'content',
                            dataType: ['text'],
                        },
                        {
                            name: 'metadata',
                            dataType: ['object'],
                        },
                    ],
                }),
            });
            if (!createResponse.ok) {
                throw new Error(`Failed to create Weaviate class: ${await createResponse.text()}`);
            }
        }
        else if (!response.ok) {
            throw new Error(`Failed to verify Weaviate class: ${await response.text()}`);
        }
        this._initialized = true;
    }
    async upsert(vectors, _options) {
        // Weaviate uses batch import
        const objects = vectors.map(v => ({
            class: this.className,
            id: v.id,
            vector: v.values,
            properties: v.metadata || {},
        }));
        const response = await fetch(`${this.endpoint}/v1/batch/objects`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                objects,
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Weaviate upsert failed: ${error}`);
        }
    }
    async query(query) {
        if (!query.vector) {
            throw new Error('Vector query is required for Weaviate');
        }
        // Build GraphQL query
        const gqlQuery = `
      {
        Get {
          ${this.className}(
            nearVector: {
              vector: [${query.vector.join(', ')}]
              certainty: ${query.minScore || 0.7}
            }
            limit: ${query.topK || 10}
            ${query.filter ? `where: ${JSON.stringify(this.convertFilter(query.filter))}` : ''}
          ) {
            _additional {
              id
              certainty
              ${query.includeValues ? 'vector' : ''}
            }
            ${query.includeMetadata !== false ? 'metadata' : ''}
          }
        }
      }
    `;
        const response = await fetch(`${this.endpoint}/v1/graphql`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: gqlQuery,
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Weaviate query failed: ${error}`);
        }
        const data = await response.json();
        const results = data.data?.Get?.[this.className] || [];
        return results.map((r) => ({
            id: r._additional.id,
            score: r._additional.certainty,
            values: r._additional.vector,
            metadata: r.metadata,
        }));
    }
    convertFilter(filter) {
        // Convert simple filter to Weaviate filter format
        const conditions = [];
        for (const [key, value] of Object.entries(filter)) {
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                conditions.push({
                    path: [key],
                    operator: 'Equal',
                    valueText: String(value),
                });
            }
        }
        return conditions.length === 1
            ? conditions[0]
            : conditions.length > 1
                ? { operator: 'And', operands: conditions }
                : undefined;
    }
    async delete(ids, _namespace) {
        // Weaviate requires deleting objects one by one or using where filter
        for (const id of ids) {
            const response = await fetch(`${this.endpoint}/v1/objects/${this.className}/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });
            if (!response.ok && response.status !== 404) {
                const error = await response.text();
                throw new Error(`Weaviate delete failed for ${id}: ${error}`);
            }
        }
    }
    async deleteNamespace(namespace) {
        // Delete all objects with matching namespace
        const response = await fetch(`${this.endpoint}/v1/batch/objects`, {
            method: 'DELETE',
            headers: this.getHeaders(),
            body: JSON.stringify({
                match: {
                    class: this.className,
                    where: {
                        path: ['namespace'],
                        operator: 'Equal',
                        valueText: namespace,
                    },
                },
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Weaviate deleteNamespace failed: ${error}`);
        }
    }
    async getStats() {
        const gqlQuery = `
      {
        Aggregate {
          ${this.className} {
            meta {
              count
            }
          }
        }
      }
    `;
        const response = await fetch(`${this.endpoint}/v1/graphql`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: gqlQuery,
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Weaviate getStats failed: ${error}`);
        }
        const data = await response.json();
        const count = data.data?.Aggregate?.[this.className]?.[0]?.meta?.count || 0;
        return {
            totalVectors: count,
            dimension: 0, // Would need to inspect schema
            status: 'ready',
        };
    }
    async fetch(ids, _namespace) {
        const vectors = [];
        for (const id of ids) {
            const response = await fetch(`${this.endpoint}/v1/objects/${this.className}/${id}?include=vector`, {
                method: 'GET',
                headers: this.getHeaders(),
            });
            if (response.ok) {
                const data = await response.json();
                vectors.push({
                    id: data.id,
                    values: data.vector || [],
                    metadata: data.properties || {},
                });
            }
        }
        return vectors;
    }
    async list(namespace, limit = 100, paginationToken) {
        const offset = paginationToken ? parseInt(paginationToken) : 0;
        const gqlQuery = `
      {
        Get {
          ${this.className}(
            limit: ${limit}
            offset: ${offset}
            ${namespace ? `where: { path: ["namespace"], operator: Equal, valueText: "${namespace}" }` : ''}
          ) {
            _additional {
              id
            }
          }
        }
      }
    `;
        const response = await fetch(`${this.endpoint}/v1/graphql`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: gqlQuery,
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Weaviate list failed: ${error}`);
        }
        const data = await response.json();
        const results = data.data?.Get?.[this.className] || [];
        return {
            ids: results.map((r) => r._additional.id),
            nextToken: results.length === limit ? String(offset + limit) : undefined,
        };
    }
    async close() {
        this._initialized = false;
    }
}
//# sourceMappingURL=weaviate.js.map