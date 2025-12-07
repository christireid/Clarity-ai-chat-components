/**
 * Vector Store
 *
 * Handles storing and retrieving document embeddings for semantic search.
 * Supports both Pinecone (production) and local storage (development).
 */
import { Pinecone } from '@pinecone-database/pinecone';
import fs from 'fs/promises';
import path from 'path';
import { cosineSimilarity } from './embeddings';
/**
 * Pinecone Vector Store (Production)
 */
export class PineconeVectorStore {
    client = null;
    indexName;
    namespace;
    constructor(namespace = 'default') {
        this.indexName = process.env.PINECONE_INDEX_NAME || 'clarity-docs';
        this.namespace = namespace;
    }
    getClient() {
        if (!this.client) {
            const apiKey = process.env.PINECONE_API_KEY;
            if (!apiKey) {
                throw new Error('PINECONE_API_KEY environment variable is not set. ' +
                    'Please add it to your .env.local file or use LocalVectorStore for development.');
            }
            this.client = new Pinecone({ apiKey });
        }
        return this.client;
    }
    async initialize() {
        const client = this.getClient();
        try {
            // Check if index exists
            const indexes = await client.listIndexes();
            const indexExists = indexes.indexes?.some(index => index.name === this.indexName);
            if (!indexExists) {
                console.log(`Creating Pinecone index: ${this.indexName}`);
                await client.createIndex({
                    name: this.indexName,
                    dimension: 1536, // text-embedding-3-small default
                    metric: 'cosine',
                    spec: {
                        serverless: {
                            cloud: 'aws',
                            region: process.env.PINECONE_ENVIRONMENT || 'us-east-1',
                        },
                    },
                });
                // Wait for index to be ready
                console.log('Waiting for index to be ready...');
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
            console.log(`Pinecone index ready: ${this.indexName}`);
        }
        catch (error) {
            console.error('Error initializing Pinecone:', error);
            throw error;
        }
    }
    async upsert(chunk) {
        const client = this.getClient();
        const index = client.index(this.indexName);
        await index.namespace(this.namespace).upsert([
            {
                id: chunk.id,
                values: chunk.embedding,
                metadata: {
                    title: chunk.title,
                    content: chunk.content,
                    url: chunk.url,
                    category: chunk.category,
                    lastUpdated: chunk.metadata.lastUpdated,
                    tags: chunk.metadata.tags.join(','),
                    section: chunk.metadata.section || '',
                    headings: chunk.metadata.headings?.join(',') || '',
                },
            },
        ]);
    }
    async upsertBatch(chunks) {
        const client = this.getClient();
        const index = client.index(this.indexName);
        // Pinecone batch limit is 100 vectors
        const batchSize = 100;
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);
            await index.namespace(this.namespace).upsert(batch.map((chunk) => ({
                id: chunk.id,
                values: chunk.embedding,
                metadata: {
                    title: chunk.title,
                    content: chunk.content,
                    url: chunk.url,
                    category: chunk.category,
                    lastUpdated: chunk.metadata.lastUpdated,
                    tags: chunk.metadata.tags.join(','),
                    section: chunk.metadata.section || '',
                    headings: chunk.metadata.headings?.join(',') || '',
                },
            })));
            console.log(`Uploaded batch ${i / batchSize + 1} (${batch.length} chunks)`);
        }
    }
    async search(embedding, topK = 5) {
        const client = this.getClient();
        const index = client.index(this.indexName);
        const results = await index.namespace(this.namespace).query({
            vector: embedding,
            topK,
            includeMetadata: true,
        });
        return results.matches.map((match) => ({
            id: match.id,
            title: match.metadata?.title || '',
            content: match.metadata?.content || '',
            url: match.metadata?.url || '',
            category: match.metadata?.category || '',
            score: match.score || 0,
            metadata: {
                lastUpdated: match.metadata?.lastUpdated || '',
                tags: (match.metadata?.tags || '').split(',').filter(Boolean),
                section: match.metadata?.section || undefined,
                headings: (match.metadata?.headings || '')
                    .split(',')
                    .filter(Boolean),
            },
        }));
    }
    async delete(id) {
        const client = this.getClient();
        const index = client.index(this.indexName);
        await index.namespace(this.namespace).deleteOne(id);
    }
    async clear() {
        const client = this.getClient();
        const index = client.index(this.indexName);
        await index.namespace(this.namespace).deleteAll();
    }
    async getStats() {
        const client = this.getClient();
        const index = client.index(this.indexName);
        const stats = await index.describeIndexStats();
        return {
            count: stats.namespaces?.[this.namespace]?.recordCount || 0,
            dimensions: stats.dimension || 1536,
        };
    }
}
/**
 * Local Vector Store (Development)
 * Stores embeddings in a JSON file for development without Pinecone
 */
export class LocalVectorStore {
    filePath;
    chunks = new Map();
    constructor(filePath = '.vector-store.json') {
        this.filePath = path.resolve(process.cwd(), filePath);
    }
    async initialize() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            const parsed = JSON.parse(data);
            this.chunks = new Map(Object.entries(parsed));
            console.log(`Loaded ${this.chunks.size} chunks from ${this.filePath}`);
        }
        catch (error) {
            // File doesn't exist yet, start with empty store
            console.log('Initializing new local vector store');
            this.chunks = new Map();
        }
    }
    async persist() {
        const data = Object.fromEntries(this.chunks);
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    }
    async upsert(chunk) {
        this.chunks.set(chunk.id, chunk);
        await this.persist();
    }
    async upsertBatch(chunks) {
        for (const chunk of chunks) {
            this.chunks.set(chunk.id, chunk);
        }
        await this.persist();
        console.log(`Stored ${chunks.length} chunks locally`);
    }
    async search(embedding, topK = 5) {
        const results = [];
        // Calculate similarity for all chunks
        for (const [id, chunk] of this.chunks) {
            const score = cosineSimilarity(embedding, chunk.embedding);
            results.push({
                id,
                title: chunk.title,
                content: chunk.content,
                url: chunk.url,
                category: chunk.category,
                score,
                metadata: chunk.metadata,
            });
        }
        // Sort by score (descending) and take top K
        return results.sort((a, b) => b.score - a.score).slice(0, topK);
    }
    async delete(id) {
        this.chunks.delete(id);
        await this.persist();
    }
    async clear() {
        this.chunks.clear();
        await this.persist();
    }
    async getStats() {
        const firstChunk = this.chunks.values().next().value;
        return {
            count: this.chunks.size,
            dimensions: firstChunk?.embedding.length || 1536,
        };
    }
}
/**
 * Get the appropriate vector store based on environment
 */
export function getVectorStore() {
    const usePinecone = process.env.PINECONE_API_KEY && process.env.NODE_ENV === 'production';
    if (usePinecone) {
        console.log('Using Pinecone vector store');
        return new PineconeVectorStore();
    }
    else {
        console.log('Using local vector store (development mode)');
        return new LocalVectorStore();
    }
}
//# sourceMappingURL=vectorStore.js.map