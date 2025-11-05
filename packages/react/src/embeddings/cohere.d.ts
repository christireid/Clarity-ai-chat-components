/**
 * Cohere Embeddings Provider
 *
 * High-quality multilingual embeddings with excellent performance.
 * Supports both English and multilingual models.
 */
import type { EmbeddingProvider, EmbeddingConfig, EmbeddingRequest, EmbeddingResponse, EmbeddingModel } from './types';
export declare const COHERE_EMBEDDING_MODELS: EmbeddingModel[];
export declare class CohereEmbeddingProvider implements EmbeddingProvider {
    readonly name = "cohere";
    readonly defaultModel = "embed-english-v3.0";
    readonly models: EmbeddingModel[];
    private apiKey;
    private endpoint;
    private batchSize;
    constructor(config: EmbeddingConfig);
    embed(request: EmbeddingRequest): Promise<EmbeddingResponse>;
    embedText(text: string, model?: string): Promise<number[]>;
    embedBatch(texts: string[], model?: string): Promise<number[][]>;
    getDimension(model?: string): number;
}
//# sourceMappingURL=cohere.d.ts.map