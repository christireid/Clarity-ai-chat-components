/**
 * Simple Reranker
 *
 * Basic reranking using TF-IDF and query term overlap.
 * For production, integrate with Cohere Rerank, Voyage, or cross-encoder models.
 */
export class SimpleReranker {
    constructor() {
        this.name = 'simple';
    }
    async rerank(request) {
        const queryTerms = this.tokenize(request.query);
        // Calculate relevance scores
        const scored = request.documents.map((doc, index) => {
            const docTerms = this.tokenize(doc.content);
            // Calculate term overlap
            const overlap = this.calculateOverlap(queryTerms, docTerms);
            // Calculate positional relevance
            const positionalScore = this.calculatePositionalScore(request.query, doc.content);
            // Combine scores
            const rerankScore = overlap * 0.6 + positionalScore * 0.4;
            return {
                id: doc.id,
                originalScore: doc.score || 0,
                rerankScore,
                content: doc.content,
                metadata: doc.metadata,
                rank: index,
            };
        });
        // Sort by rerank score
        const results = scored
            .sort((a, b) => b.rerankScore - a.rerankScore)
            .map((item, index) => ({
            ...item,
            rank: index,
        }))
            .slice(0, request.topK || scored.length);
        return {
            results,
            model: 'simple-reranker',
        };
    }
    tokenize(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter((t) => t.length > 0);
    }
    calculateOverlap(queryTerms, docTerms) {
        const querySet = new Set(queryTerms);
        const docSet = new Set(docTerms);
        let overlap = 0;
        queryTerms.forEach((term) => {
            if (querySet.has(term) && docSet.has(term)) {
                overlap++;
            }
        });
        return querySet.size > 0 ? overlap / querySet.size : 0;
    }
    calculatePositionalScore(query, content) {
        const lowerQuery = query.toLowerCase();
        const lowerContent = content.toLowerCase();
        // Check if query appears early in content (higher relevance)
        const index = lowerContent.indexOf(lowerQuery);
        if (index === -1)
            return 0;
        // Score based on position (earlier = better)
        const normalizedPosition = index / lowerContent.length;
        return 1 - normalizedPosition;
    }
}
/**
 * Diversity Reranker
 *
 * Rerank to maximize diversity in results while maintaining relevance.
 * Useful for avoiding redundant information.
 */
export class DiversityReranker {
    constructor(similarityThreshold = 0.8) {
        this.name = 'diversity';
        this.similarityThreshold = similarityThreshold;
    }
    async rerank(request) {
        const results = [];
        const remaining = [...request.documents];
        // Start with highest scoring document
        remaining.sort((a, b) => (b.score || 0) - (a.score || 0));
        while (results.length < (request.topK || remaining.length) && remaining.length > 0) {
            const next = remaining.shift();
            // Check if too similar to existing results
            const tooSimilar = results.some((r) => this.isSimilar(next.content, r.content));
            if (!tooSimilar || results.length === 0) {
                results.push({
                    id: next.id,
                    originalScore: next.score || 0,
                    rerankScore: next.score || 0,
                    content: next.content,
                    metadata: next.metadata,
                    rank: results.length,
                });
            }
        }
        return {
            results,
            model: 'diversity-reranker',
        };
    }
    isSimilar(text1, text2) {
        const tokens1 = new Set(this.tokenize(text1));
        const tokens2 = new Set(this.tokenize(text2));
        let intersection = 0;
        this.tokenize(text1).forEach((token) => {
            if (tokens1.has(token) && tokens2.has(token)) {
                intersection++;
            }
        });
        const union = tokens1.size + tokens2.size - intersection;
        return union > 0 ? intersection / union : 0;
    }
    tokenize(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter((t) => t.length > 0);
    }
}
//# sourceMappingURL=simple-reranker.js.map