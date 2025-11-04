/**
 * Simple Reranker
 *
 * Basic reranking using TF-IDF and query term overlap.
 * For production, integrate with Cohere Rerank, Voyage, or cross-encoder models.
 */
import type { Reranker, RerankRequest, RerankResponse } from './types';
export declare class SimpleReranker implements Reranker {
    readonly name = "simple";
    rerank(request: RerankRequest): Promise<RerankResponse>;
    private tokenize;
    private calculateOverlap;
    private calculatePositionalScore;
}
/**
 * Diversity Reranker
 *
 * Rerank to maximize diversity in results while maintaining relevance.
 * Useful for avoiding redundant information.
 */
export declare class DiversityReranker implements Reranker {
    readonly name = "diversity";
    private similarityThreshold;
    constructor(similarityThreshold?: number);
    rerank(request: RerankRequest): Promise<RerankResponse>;
    private isSimilar;
    private tokenize;
}
//# sourceMappingURL=simple-reranker.d.ts.map