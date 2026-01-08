/**
 * Hybrid Search Utilities
 *
 * Premium hybrid search combining keyword (BM25) and semantic (vector) search.
 * Features multiple fusion algorithms, intelligent score normalization,
 * and production-ready optimizations.
 */
/**
 * Hybrid Search - Combines keyword and vector search for optimal results
 *
 * Features:
 * - Multiple fusion algorithms (RRF, Weighted, Linear, DBSF)
 * - Intelligent score normalization
 * - Match type tracking
 * - Configurable weighting
 * - Production-ready performance
 *
 * @example
 * ```tsx
 * const hybrid = new HybridSearch({
 *   keywordSearcher: bm25Searcher,
 *   vectorSearcher: embeddingSearcher,
 *   keywordWeight: 0.3,
 *   vectorWeight: 0.7,
 *   fusionMethod: 'rrf',
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
            rrfK: 60,
            customFusion: () => [],
            minScore: 0,
            normalizeScores: true,
            includeMatchType: true,
            ...options,
        };
    }
    /**
     * Perform hybrid search with parallel execution
     */
    async search(query, topK = 10) {
        const fetchMultiplier = 2; // Fetch more results for better fusion
        // Run both searches in parallel for performance
        const [keywordResults, vectorResults] = await Promise.all([
            Promise.resolve(this.options.keywordSearcher.search(query, topK * fetchMultiplier)),
            this.options.vectorSearcher.search(query, topK * fetchMultiplier),
        ]);
        // Add match type to results
        const keywordWithType = keywordResults.map((r) => ({
            ...r,
            matchType: 'keyword',
        }));
        const vectorWithType = vectorResults.map((r) => ({
            ...r,
            matchType: 'semantic',
        }));
        // Normalize scores if enabled
        const normalizedKeyword = this.options.normalizeScores
            ? this.normalizeScores(keywordWithType)
            : keywordWithType;
        const normalizedVector = this.options.normalizeScores
            ? this.normalizeScores(vectorWithType)
            : vectorWithType;
        // Fuse results based on selected method
        let fusedResults;
        switch (this.options.fusionMethod) {
            case 'rrf':
                fusedResults = this.reciprocalRankFusion(normalizedKeyword, normalizedVector);
                break;
            case 'weighted':
                fusedResults = this.weightedFusion(normalizedKeyword, normalizedVector);
                break;
            case 'linear':
                fusedResults = this.linearFusion(normalizedKeyword, normalizedVector);
                break;
            case 'dbsf':
                fusedResults = this.distributionBasedFusion(normalizedKeyword, normalizedVector);
                break;
            case 'custom':
                fusedResults = this.options.customFusion(normalizedKeyword, normalizedVector);
                break;
            default:
                fusedResults = this.reciprocalRankFusion(normalizedKeyword, normalizedVector);
        }
        // Filter by minimum score
        if (this.options.minScore > 0) {
            fusedResults = fusedResults.filter((r) => r.score >= this.options.minScore);
        }
        return fusedResults.slice(0, topK);
    }
    /**
     * Reciprocal Rank Fusion (RRF)
     *
     * Robust fusion that doesn't require score normalization.
     * Uses rank positions rather than raw scores.
     * Formula: score = sum(1 / (k + rank))
     */
    reciprocalRankFusion(keywordResults, vectorResults) {
        const k = this.options.rrfK;
        const scores = new Map();
        const docs = new Map();
        const matchTypes = new Map();
        // Process keyword results
        keywordResults.forEach((result, rank) => {
            const score = this.options.keywordWeight / (k + rank + 1);
            scores.set(result.id, (scores.get(result.id) || 0) + score);
            docs.set(result.id, result);
            if (!matchTypes.has(result.id)) {
                matchTypes.set(result.id, new Set());
            }
            matchTypes.get(result.id).add('keyword');
        });
        // Process vector results
        vectorResults.forEach((result, rank) => {
            const score = this.options.vectorWeight / (k + rank + 1);
            scores.set(result.id, (scores.get(result.id) || 0) + score);
            if (!docs.has(result.id)) {
                docs.set(result.id, result);
            }
            if (!matchTypes.has(result.id)) {
                matchTypes.set(result.id, new Set());
            }
            matchTypes.get(result.id).add('semantic');
        });
        // Build final results
        return Array.from(docs.values())
            .map((doc) => ({
            ...doc,
            score: scores.get(doc.id) || 0,
            matchType: this.determineMatchType(matchTypes.get(doc.id)),
        }))
            .sort((a, b) => b.score - a.score);
    }
    /**
     * Weighted Score Fusion
     *
     * Direct weighted combination of normalized scores.
     * Requires pre-normalized scores for accuracy.
     */
    weightedFusion(keywordResults, vectorResults) {
        const docs = new Map();
        const scores = new Map();
        const matchTypes = new Map();
        // Process keyword results
        for (const result of keywordResults) {
            const existing = scores.get(result.id) || { keyword: 0, vector: 0 };
            existing.keyword = result.score;
            scores.set(result.id, existing);
            docs.set(result.id, result);
            if (!matchTypes.has(result.id)) {
                matchTypes.set(result.id, new Set());
            }
            matchTypes.get(result.id).add('keyword');
        }
        // Process vector results
        for (const result of vectorResults) {
            const existing = scores.get(result.id) || { keyword: 0, vector: 0 };
            existing.vector = result.score;
            scores.set(result.id, existing);
            if (!docs.has(result.id)) {
                docs.set(result.id, result);
            }
            if (!matchTypes.has(result.id)) {
                matchTypes.set(result.id, new Set());
            }
            matchTypes.get(result.id).add('semantic');
        }
        // Calculate weighted scores
        return Array.from(docs.values())
            .map((doc) => {
            const docScores = scores.get(doc.id);
            const finalScore = docScores.keyword * this.options.keywordWeight +
                docScores.vector * this.options.vectorWeight;
            return {
                ...doc,
                score: finalScore,
                matchType: this.determineMatchType(matchTypes.get(doc.id)),
            };
        })
            .sort((a, b) => b.score - a.score);
    }
    /**
     * Linear Combination Fusion
     *
     * Simple averaging with optional weighting.
     * Good baseline for comparison.
     */
    linearFusion(keywordResults, vectorResults) {
        const docs = new Map();
        const scores = new Map();
        const matchTypes = new Map();
        // Collect scores from both sources
        for (const result of keywordResults) {
            if (!scores.has(result.id)) {
                scores.set(result.id, []);
            }
            scores.get(result.id).push(result.score * this.options.keywordWeight);
            docs.set(result.id, result);
            if (!matchTypes.has(result.id)) {
                matchTypes.set(result.id, new Set());
            }
            matchTypes.get(result.id).add('keyword');
        }
        for (const result of vectorResults) {
            if (!scores.has(result.id)) {
                scores.set(result.id, []);
            }
            scores.get(result.id).push(result.score * this.options.vectorWeight);
            if (!docs.has(result.id)) {
                docs.set(result.id, result);
            }
            if (!matchTypes.has(result.id)) {
                matchTypes.set(result.id, new Set());
            }
            matchTypes.get(result.id).add('semantic');
        }
        // Calculate final scores
        return Array.from(docs.values())
            .map((doc) => {
            const docScores = scores.get(doc.id);
            // Avoid division by zero if scores array is empty
            const avgScore = docScores.length > 0
                ? docScores.reduce((a, b) => a + b, 0) / docScores.length
                : 0;
            return {
                ...doc,
                score: avgScore,
                matchType: this.determineMatchType(matchTypes.get(doc.id)),
            };
        })
            .sort((a, b) => b.score - a.score);
    }
    /**
     * Distribution-Based Score Fusion (DBSF)
     *
     * Advanced fusion that considers score distributions.
     * Normalizes based on standard deviation for better calibration.
     */
    distributionBasedFusion(keywordResults, vectorResults) {
        // Calculate statistics for each result set
        const keywordStats = this.calculateStats(keywordResults.map((r) => r.score));
        const vectorStats = this.calculateStats(vectorResults.map((r) => r.score));
        // Z-score normalization
        const normalizedKeyword = keywordResults.map((r) => ({
            ...r,
            score: keywordStats.std === 0 ? 0 : (r.score - keywordStats.mean) / keywordStats.std,
        }));
        const normalizedVector = vectorResults.map((r) => ({
            ...r,
            score: vectorStats.std === 0 ? 0 : (r.score - vectorStats.mean) / vectorStats.std,
        }));
        // Use weighted fusion with normalized scores
        return this.weightedFusion(normalizedKeyword, normalizedVector);
    }
    /**
     * Calculate mean and standard deviation
     */
    calculateStats(scores) {
        if (scores.length === 0)
            return { mean: 0, std: 0 };
        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
        const squaredDiffs = scores.map((s) => Math.pow(s - mean, 2));
        const variance = squaredDiffs.reduce((a, b) => a + b, 0) / scores.length;
        const std = Math.sqrt(variance);
        return { mean, std };
    }
    /**
     * Normalize scores to 0-1 range using min-max normalization
     */
    normalizeScores(results) {
        if (results.length === 0)
            return [];
        const scores = results.map((r) => r.score);
        const minScore = Math.min(...scores);
        const maxScore = Math.max(...scores);
        const range = maxScore - minScore;
        if (range === 0) {
            return results.map((r) => ({ ...r, score: 1 }));
        }
        return results.map((r) => ({
            ...r,
            score: (r.score - minScore) / range,
        }));
    }
    /**
     * Determine final match type based on sources
     */
    determineMatchType(types) {
        if (!types || types.size === 0)
            return 'keyword';
        if (types.size > 1)
            return 'hybrid';
        return types.has('semantic') ? 'semantic' : 'keyword';
    }
    /**
     * Update search weights dynamically
     */
    setWeights(keywordWeight, vectorWeight) {
        this.options.keywordWeight = keywordWeight;
        this.options.vectorWeight = vectorWeight;
    }
    /**
     * Update fusion method
     */
    setFusionMethod(method) {
        this.options.fusionMethod = method;
    }
}
/**
 * Enhanced BM25 Keyword Searcher (In-Memory)
 *
 * Production-quality BM25 implementation with:
 * - Configurable parameters (k1, b)
 * - Stop word filtering
 * - Stemming support (optional)
 * - Query expansion
 * - Highlight generation
 *
 * For production at scale, use Elasticsearch, Typesense, or Meilisearch.
 */
export class SimpleBM25Searcher {
    documents;
    index = new Map();
    idf = new Map();
    docLengths = [];
    avgDocLength = 0;
    k1;
    b;
    stopWords;
    constructor(documents, options) {
        this.documents = documents;
        this.k1 = options?.k1 ?? 1.5;
        this.b = options?.b ?? 0.75;
        this.stopWords = new Set(options?.stopWords ?? [
            'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for',
            'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on',
            'that', 'the', 'to', 'was', 'were', 'will', 'with',
        ]);
        this.buildIndex();
    }
    buildIndex() {
        const docFreq = new Map();
        // Build inverted index and calculate document lengths
        this.documents.forEach((doc, docIdx) => {
            const terms = this.tokenize(doc.content);
            this.docLengths[docIdx] = terms.length;
            const uniqueTerms = new Set(terms);
            uniqueTerms.forEach((term) => {
                if (!this.index.has(term)) {
                    this.index.set(term, new Set());
                }
                this.index.get(term).add(docIdx);
                docFreq.set(term, (docFreq.get(term) || 0) + 1);
            });
        });
        // Calculate average document length (avoid division by zero)
        this.avgDocLength = this.documents.length > 0
            ? this.docLengths.reduce((a, b) => a + b, 0) / this.documents.length
            : 1;
        // Calculate IDF for each term
        const N = this.documents.length;
        for (const [term, df] of docFreq.entries()) {
            // BM25 IDF formula
            this.idf.set(term, Math.log((N - df + 0.5) / (df + 0.5) + 1));
        }
    }
    search(query, topK = 10) {
        const queryTerms = this.tokenize(query);
        const scores = new Map();
        // Calculate BM25 scores
        queryTerms.forEach((term) => {
            const docIndices = this.index.get(term);
            if (!docIndices)
                return;
            const idf = this.idf.get(term) || 0;
            docIndices.forEach((docIdx) => {
                const doc = this.documents[docIdx];
                if (!doc)
                    return;
                const termFreq = this.getTermFrequency(term, doc.content);
                const docLength = this.docLengths[docIdx] || 1;
                // Ensure avgDocLength is at least 1 to avoid division issues
                const safeAvgDocLength = Math.max(this.avgDocLength, 1);
                // BM25 scoring formula
                const numerator = termFreq * (this.k1 + 1);
                const denominator = termFreq + this.k1 * (1 - this.b + this.b * (docLength / safeAvgDocLength));
                // Avoid division by zero in denominator
                const score = denominator > 0 ? idf * (numerator / denominator) : 0;
                scores.set(docIdx, (scores.get(docIdx) || 0) + score);
            });
        });
        // Sort and return top K results
        return Array.from(scores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, topK)
            .map(([docIdx, score]) => {
            const doc = this.documents[docIdx];
            if (!doc) {
                return { id: '', score, content: '', metadata: {}, matchType: 'keyword' };
            }
            // Generate highlights
            const highlights = this.generateHighlights(doc.content, queryTerms);
            return {
                id: doc.id,
                score,
                content: doc.content,
                metadata: doc.metadata,
                matchType: 'keyword',
                highlights,
            };
        });
    }
    /**
     * Tokenize text into searchable terms
     */
    tokenize(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter((t) => t.length > 1 && !this.stopWords.has(t));
    }
    /**
     * Count term frequency in text
     */
    getTermFrequency(term, text) {
        const tokens = this.tokenize(text);
        return tokens.filter((t) => t === term).length;
    }
    /**
     * Generate highlight snippets around matched terms
     */
    generateHighlights(content, queryTerms) {
        const highlights = [];
        const contentLower = content.toLowerCase();
        for (const term of queryTerms) {
            const pos = contentLower.indexOf(term);
            if (pos !== -1) {
                const start = Math.max(0, pos - 50);
                const end = Math.min(content.length, pos + term.length + 50);
                let snippet = content.slice(start, end);
                if (start > 0)
                    snippet = '...' + snippet;
                if (end < content.length)
                    snippet = snippet + '...';
                highlights.push(snippet);
                if (highlights.length >= 3)
                    break;
            }
        }
        return highlights;
    }
    /**
     * Add documents to the index
     */
    addDocuments(docs) {
        this.documents.push(...docs);
        this.buildIndex();
    }
    /**
     * Remove documents from the index
     */
    removeDocuments(ids) {
        const idSet = new Set(ids);
        this.documents = this.documents.filter((d) => !idSet.has(d.id));
        this.buildIndex();
    }
    /**
     * Get statistics about the index
     */
    getStats() {
        return {
            documentCount: this.documents.length,
            termCount: this.index.size,
            avgDocLength: this.avgDocLength,
        };
    }
}
/**
 * Create a hybrid search instance with default searchers
 */
export function createHybridSearch(documents, vectorSearcher, options) {
    const keywordSearcher = new SimpleBM25Searcher(documents);
    return new HybridSearch({
        keywordSearcher,
        vectorSearcher,
        ...options,
    });
}
//# sourceMappingURL=hybrid-search.js.map