/**
 * Hybrid Search Utilities
 *
 * Combine keyword (BM25) and semantic (vector) search for better results.
 * Flexible and composable - bring your own search implementations.
 */
/**
 * Hybrid search - combines keyword and vector search
 *
 * @example
 * ```tsx
 * const hybrid = new HybridSearch({
 *   keywordSearcher: bm25,
 *   vectorSearcher: vectorStore,
 *   keywordWeight: 0.3,
 *   vectorWeight: 0.7,
 * })
 *
 * const results = await hybrid.search('machine learning', 10)
 * ```
 */
export class HybridSearch {
    options;
    constructor(options) {
        this.options = {
            keywordWeight: 0.5,
            vectorWeight: 0.5,
            fusionMethod: 'rrf',
            customFusion: () => [],
            ...options,
        };
    }
    /**
     * Perform hybrid search
     */
    async search(query, topK = 10) {
        // Run both searches in parallel
        const [keywordResults, vectorResults] = await Promise.all([
            Promise.resolve(this.options.keywordSearcher.search(query, topK * 2)),
            this.options.vectorSearcher.search(query, topK * 2),
        ]);
        // Fuse results
        let fusedResults;
        if (this.options.fusionMethod === 'rrf') {
            fusedResults = this.reciprocalRankFusion(keywordResults, vectorResults);
        }
        else if (this.options.fusionMethod === 'weighted') {
            fusedResults = this.weightedFusion(keywordResults, vectorResults);
        }
        else if (this.options.customFusion) {
            fusedResults = this.options.customFusion(keywordResults, vectorResults);
        }
        else {
            fusedResults = this.reciprocalRankFusion(keywordResults, vectorResults);
        }
        return fusedResults.slice(0, topK);
    }
    /**
     * Reciprocal Rank Fusion (RRF)
     *
     * Combines rankings without needing score normalization.
     * More robust when search scores are in different ranges.
     */
    reciprocalRankFusion(keywordResults, vectorResults) {
        const k = 60; // RRF constant
        const scores = new Map();
        const docs = new Map();
        // Add keyword results
        keywordResults.forEach((result, rank) => {
            const score = 1 / (k + rank + 1);
            scores.set(result.id, (scores.get(result.id) || 0) + score * this.options.keywordWeight);
            docs.set(result.id, result);
        });
        // Add vector results
        vectorResults.forEach((result, rank) => {
            const score = 1 / (k + rank + 1);
            scores.set(result.id, (scores.get(result.id) || 0) + score * this.options.vectorWeight);
            if (!docs.has(result.id)) {
                docs.set(result.id, result);
            }
        });
        // Sort by fused score
        return Array.from(docs.values())
            .map(doc => ({
            ...doc,
            score: scores.get(doc.id) || 0,
        }))
            .sort((a, b) => b.score - a.score);
    }
    /**
     * Weighted score fusion
     *
     * Combines normalized scores with weights.
     * Requires score normalization.
     */
    weightedFusion(keywordResults, vectorResults) {
        // Normalize scores
        const normalizedKeyword = this.normalizeScores(keywordResults);
        const normalizedVector = this.normalizeScores(vectorResults);
        // Create doc map
        const docs = new Map();
        const scores = new Map();
        // Add keyword scores
        normalizedKeyword.forEach(result => {
            const score = result.score * this.options.keywordWeight;
            scores.set(result.id, score);
            docs.set(result.id, result);
        });
        // Add vector scores
        normalizedVector.forEach(result => {
            const score = result.score * this.options.vectorWeight;
            scores.set(result.id, (scores.get(result.id) || 0) + score);
            if (!docs.has(result.id)) {
                docs.set(result.id, result);
            }
        });
        // Sort by fused score
        return Array.from(docs.values())
            .map(doc => ({
            ...doc,
            score: scores.get(doc.id) || 0,
        }))
            .sort((a, b) => b.score - a.score);
    }
    /**
     * Normalize scores to 0-1 range
     */
    normalizeScores(results) {
        if (results.length === 0)
            return [];
        const scores = results.map(r => r.score);
        const minScore = Math.min(...scores);
        const maxScore = Math.max(...scores);
        const range = maxScore - minScore;
        if (range === 0) {
            return results.map(r => ({ ...r, score: 1 }));
        }
        return results.map(r => ({
            ...r,
            score: (r.score - minScore) / range,
        }));
    }
}
/**
 * Simple BM25 keyword searcher (in-memory)
 *
 * For production, use a proper search engine like Elasticsearch or Typesense.
 */
export class SimpleBM25Searcher {
    documents;
    index = new Map();
    idf = new Map();
    constructor(documents) {
        this.documents = documents;
        this.buildIndex();
    }
    buildIndex() {
        const docFreq = new Map();
        // Build inverted index
        this.documents.forEach((doc, docIdx) => {
            const terms = this.tokenize(doc.content);
            const uniqueTerms = new Set(terms);
            uniqueTerms.forEach(term => {
                if (!this.index.has(term)) {
                    this.index.set(term, new Set());
                }
                this.index.get(term).add(docIdx);
                docFreq.set(term, (docFreq.get(term) || 0) + 1);
            });
        });
        // Calculate IDF
        const N = this.documents.length;
        const docFreqEntries = Array.from(docFreq.entries());
        for (const [term, df] of docFreqEntries) {
            this.idf.set(term, Math.log((N - df + 0.5) / (df + 0.5) + 1));
        }
    }
    search(query, topK = 10) {
        const queryTerms = this.tokenize(query);
        const scores = new Map();
        // Calculate BM25 scores
        queryTerms.forEach(term => {
            const docIndices = this.index.get(term);
            if (!docIndices)
                return;
            const idf = this.idf.get(term) || 0;
            docIndices.forEach(docIdx => {
                const doc = this.documents[docIdx];
                if (!doc)
                    return;
                const termFreq = this.getTermFrequency(term, doc.content);
                const docLength = this.tokenize(doc.content).length;
                const avgDocLength = this.documents.reduce((sum, d) => sum + this.tokenize(d.content).length, 0) / this.documents.length;
                const k1 = 1.5;
                const b = 0.75;
                const score = idf * (termFreq * (k1 + 1)) /
                    (termFreq + k1 * (1 - b + b * docLength / avgDocLength));
                scores.set(docIdx, (scores.get(docIdx) || 0) + score);
            });
        });
        // Sort and return top K
        return Array.from(scores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, topK)
            .map(([docIdx, score]) => {
            const doc = this.documents[docIdx];
            if (!doc) {
                return { id: '', score, content: '', metadata: {} };
            }
            return {
                id: doc.id,
                score,
                content: doc.content,
                metadata: doc.metadata,
            };
        });
    }
    tokenize(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(t => t.length > 0);
    }
    getTermFrequency(term, text) {
        const tokens = this.tokenize(text);
        return tokens.filter(t => t === term).length;
    }
}
//# sourceMappingURL=hybrid-search.js.map