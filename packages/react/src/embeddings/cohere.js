/**
 * Cohere Embeddings Provider
 *
 * High-quality multilingual embeddings with excellent performance.
 * Supports both English and multilingual models.
 */
export const COHERE_EMBEDDING_MODELS = [
    {
        id: 'embed-english-v3.0',
        name: 'English v3',
        dimension: 1024,
        maxTokens: 512,
        costPer1M: 0.10,
        performance: 'balanced',
        useCase: 'English text, high quality',
    },
    {
        id: 'embed-multilingual-v3.0',
        name: 'Multilingual v3',
        dimension: 1024,
        maxTokens: 512,
        costPer1M: 0.10,
        performance: 'balanced',
        useCase: '100+ languages, semantic search',
    },
    {
        id: 'embed-english-light-v3.0',
        name: 'English Light v3',
        dimension: 384,
        maxTokens: 512,
        costPer1M: 0.10,
        performance: 'fast',
        useCase: 'Fast, cost-effective English',
    },
    {
        id: 'embed-multilingual-light-v3.0',
        name: 'Multilingual Light v3',
        dimension: 384,
        maxTokens: 512,
        costPer1M: 0.10,
        performance: 'fast',
        useCase: 'Fast, multilingual',
    },
];
export class CohereEmbeddingProvider {
    name = 'cohere';
    defaultModel = 'embed-english-v3.0';
    models = COHERE_EMBEDDING_MODELS;
    apiKey;
    endpoint;
    batchSize;
    constructor(config) {
        if (!config.apiKey) {
            throw new Error('Cohere API key is required');
        }
        this.apiKey = config.apiKey;
        this.endpoint = config.endpoint || 'https://api.cohere.ai/v1';
        this.batchSize = config.batchSize || 96; // Cohere limit
    }
    async embed(request) {
        const model = request.model || this.defaultModel;
        const texts = Array.isArray(request.input) ? request.input : [request.input];
        const response = await fetch(`${this.endpoint}/embed`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                texts,
                model,
                input_type: 'search_document', // or 'search_query', 'classification', 'clustering'
                truncate: 'END',
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Cohere embedding failed: ${error}`);
        }
        const data = await response.json();
        return {
            embeddings: data.embeddings,
            model,
            usage: {
                promptTokens: data.meta?.billed_units?.input_tokens || 0,
                totalTokens: data.meta?.billed_units?.input_tokens || 0,
            },
            dimension: data.embeddings[0].length,
        };
    }
    async embedText(text, model) {
        const response = await this.embed({
            input: text,
            model,
        });
        const embedding = response.embeddings[0];
        if (!embedding)
            throw new Error('No embedding returned');
        return embedding;
    }
    async embedBatch(texts, model) {
        const allEmbeddings = [];
        for (let i = 0; i < texts.length; i += this.batchSize) {
            const batch = texts.slice(i, i + this.batchSize);
            const response = await this.embed({
                input: batch,
                model,
            });
            allEmbeddings.push(...response.embeddings);
        }
        return allEmbeddings;
    }
    getDimension(model) {
        const modelId = model || this.defaultModel;
        const modelInfo = this.models.find(m => m.id === modelId);
        return modelInfo?.dimension || 1024;
    }
}
//# sourceMappingURL=cohere.js.map