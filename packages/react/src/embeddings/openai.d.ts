/**
 * OpenAI Embeddings Provider
 *
 * High-quality embeddings with excellent semantic understanding.
 * text-embedding-3-small and text-embedding-3-large are recommended.
 */
import type { EmbeddingProvider, EmbeddingConfig, EmbeddingRequest, EmbeddingResponse, EmbeddingModel } from './types';
export declare const OPENAI_EMBEDDING_MODELS: EmbeddingModel[];
export declare class OpenAIEmbeddingProvider implements EmbeddingProvider {
    readonly name = "openai";
    readonly defaultModel = "text-embedding-3-small";
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
//# sourceMappingURL=openai.d.ts.map