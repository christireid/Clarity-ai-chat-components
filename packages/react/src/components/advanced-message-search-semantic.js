'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Badge, cn, } from '@clarity-chat/primitives';
const defaultConfig = {
    embeddings: {
        type: 'openai',
        model: 'text-embedding-3-small',
    },
    hybrid: {
        enabled: true,
        semanticWeight: 0.7, // 70% semantic, 30% keyword
    },
    reranking: {
        enabled: false,
        provider: 'cohere',
    },
    multiLanguage: true,
    queryExpansion: true,
    maxResults: 10,
    similarityThreshold: 0.6,
};
/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a, b) {
    if (a.length !== b.length)
        return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        const ai = a[i];
        const bi = b[i];
        dotProduct += ai * bi;
        normA += ai * ai;
        normB += bi * bi;
    }
    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
}
/**
 * Simple keyword search with TF-IDF-like scoring
 */
function keywordSearch(query, messages) {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    const scores = new Map();
    messages.forEach((message) => {
        const content = message.content.toLowerCase();
        let score = 0;
        queryTerms.forEach((term) => {
            // Count term frequency
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            const matches = content.match(regex);
            if (matches) {
                // TF-IDF approximation: more matches = higher score, but with diminishing returns
                score += Math.log(1 + matches.length);
            }
            // Boost exact phrase matches
            if (content.includes(query.toLowerCase())) {
                score += 5;
            }
        });
        if (score > 0) {
            scores.set(message.id, score);
        }
    });
    return scores;
}
/**
 * Expand query with synonyms and related terms
 */
function expandQuery(query) {
    // Simple synonym expansion (in production, use a proper synonym API)
    const synonyms = {
        error: ['bug', 'issue', 'problem', 'failure'],
        fix: ['solve', 'repair', 'correct', 'patch'],
        code: ['function', 'script', 'program', 'implementation'],
        explain: ['describe', 'clarify', 'elaborate', 'detail'],
        help: ['assist', 'support', 'aid', 'guide'],
    };
    const expansions = [query];
    const terms = query.toLowerCase().split(/\s+/);
    terms.forEach((term) => {
        if (synonyms[term]) {
            expansions.push(...synonyms[term]);
        }
    });
    return expansions;
}
/**
 * SemanticMessageSearch Component
 *
 * Advanced message search with vector embeddings for semantic similarity.
 * Supports hybrid search (semantic + keyword), query expansion, and reranking.
 *
 * Features:
 * - Vector-based semantic search
 * - Hybrid search (keyword + semantic)
 * - Query expansion with synonyms
 * - Multi-language support
 * - Relevance scoring
 * - Search history
 * - Reranking support
 *
 * @example
 * ```tsx
 * <SemanticMessageSearch
 *   messages={messages}
 *   config={{
 *     embeddings: {
 *       type: 'openai',
 *       model: 'text-embedding-3-small',
 *     },
 *     hybrid: {
 *       enabled: true,
 *       semanticWeight: 0.7,
 *     },
 *     reranking: {
 *       enabled: true,
 *       provider: 'cohere',
 *     },
 *   }}
 *   onGenerateEmbedding={async (text) => {
 *     const response = await fetch('/api/embed', {
 *       method: 'POST',
 *       body: JSON.stringify({ text }),
 *     })
 *     const { embedding } = await response.json()
 *     return embedding
 *   }}
 * />
 * ```
 */
export function SemanticMessageSearch({ messages, config: userConfig, onResultsFound, onGenerateEmbedding, onRerank, showHistory = true, placeholder = 'Search messages semantically...', className, }) {
    const config = { ...defaultConfig, ...userConfig };
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState([]);
    const [isSearching, setIsSearching] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [searchHistory, setSearchHistory] = React.useState([]);
    const [expandedQueries, setExpandedQueries] = React.useState([]);
    // Cache for message embeddings
    const embeddingsCache = React.useRef(new Map());
    /**
     * Generate embedding for text
     */
    const generateEmbedding = React.useCallback(async (text) => {
        // Check cache first
        if (embeddingsCache.current.has(text)) {
            return embeddingsCache.current.get(text);
        }
        // Use custom embedding generator if provided
        if (onGenerateEmbedding) {
            const embedding = await onGenerateEmbedding(text);
            embeddingsCache.current.set(text, embedding);
            return embedding;
        }
        // Fallback: generate simple bag-of-words embedding
        // In production, this should call an actual embedding API
        const words = text.toLowerCase().split(/\s+/);
        const embedding = new Array(384).fill(0); // Standard embedding dimension
        words.forEach((word, index) => {
            // Simple hash-based embedding (not real, just for fallback)
            const hash = word.split('').reduce((acc, char) => {
                return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
            }, 0);
            const position = Math.abs(hash) % embedding.length;
            embedding[position] += 1;
        });
        // Normalize
        const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
        const normalized = embedding.map(val => val / (norm || 1));
        embeddingsCache.current.set(text, normalized);
        return normalized;
    }, [onGenerateEmbedding]);
    /**
     * Perform semantic search
     */
    const performSemanticSearch = React.useCallback(async (searchQuery) => {
        // Expand query if enabled
        const queries = config.queryExpansion
            ? expandQuery(searchQuery)
            : [searchQuery];
        setExpandedQueries(queries);
        // Generate embedding for query
        const primaryQuery = queries[0] ?? searchQuery;
        const queryEmbedding = await generateEmbedding(primaryQuery);
        // Calculate semantic similarity for each message
        const semanticScores = new Map();
        for (const message of messages) {
            const messageEmbedding = await generateEmbedding(message.content);
            const similarity = cosineSimilarity(queryEmbedding, messageEmbedding);
            semanticScores.set(message.id, similarity);
        }
        // Get keyword scores
        const keywordScores = keywordSearch(searchQuery, messages);
        // Combine scores based on hybrid configuration
        const combinedResults = [];
        messages.forEach((message) => {
            const semanticScore = semanticScores.get(message.id) || 0;
            const keywordScore = keywordScores.get(message.id) || 0;
            let finalScore = 0;
            let matchType = 'semantic';
            if (config.hybrid.enabled) {
                // Normalize keyword score to 0-1 range (assuming max keyword score is ~10)
                const normalizedKeywordScore = Math.min(keywordScore / 10, 1);
                finalScore =
                    config.hybrid.semanticWeight * semanticScore +
                        (1 - config.hybrid.semanticWeight) * normalizedKeywordScore;
                matchType = 'hybrid';
            }
            else {
                finalScore = semanticScore;
            }
            // Only include results above threshold
            if (finalScore >= (config.similarityThreshold || 0.6)) {
                // Extract highlights (simple implementation)
                const highlights = [];
                const content = message.content;
                const queryTerms = searchQuery.toLowerCase().split(/\s+/);
                queryTerms.forEach((term) => {
                    const regex = new RegExp(`(.{0,30})(${term})(.{0,30})`, 'gi');
                    const match = content.match(regex);
                    if (match && match[0]) {
                        highlights.push(match[0]);
                    }
                });
                combinedResults.push({
                    message,
                    score: finalScore,
                    highlights: highlights.slice(0, 3), // Top 3 highlights
                    matchType,
                    explanation: `${Math.round(finalScore * 100)}% match (${matchType})`,
                });
            }
        });
        // Sort by score
        combinedResults.sort((a, b) => b.score - a.score);
        // Limit results
        return combinedResults.slice(0, config.maxResults || 10);
    }, [
        messages,
        config.queryExpansion,
        config.hybrid,
        config.similarityThreshold,
        config.maxResults,
        generateEmbedding,
    ]);
    /**
     * Handle search
     */
    const handleSearch = React.useCallback(async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }
        setIsSearching(true);
        setError(null);
        try {
            let searchResults = await performSemanticSearch(searchQuery);
            // Apply reranking if enabled
            if (config.reranking?.enabled && onRerank) {
                searchResults = await onRerank(searchQuery, searchResults);
            }
            setResults(searchResults);
            onResultsFound?.(searchResults);
            // Add to search history
            setSearchHistory((prev) => [
                {
                    query: searchQuery,
                    timestamp: Date.now(),
                    resultCount: searchResults.length,
                },
                ...prev.slice(0, 9), // Keep last 10
            ]);
        }
        catch (err) {
            console.error('Search error:', err);
            setError(err instanceof Error ? err.message : 'Search failed');
        }
        finally {
            setIsSearching(false);
        }
    }, [performSemanticSearch, config.reranking, onRerank, onResultsFound]);
    // Debounced search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (query) {
                handleSearch(query);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query, handleSearch]);
    return (_jsxs("div", { className: cn('space-y-4', className), children: [_jsxs(Card, { className: "shadow-sm", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary", children: _jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }) }), _jsxs("div", { className: "flex-1", children: [_jsx(CardTitle, { className: "text-base", children: "Semantic Search" }), _jsxs("div", { className: "text-xs text-muted-foreground flex gap-2 mt-1", children: [config.hybrid.enabled && (_jsxs(Badge, { variant: "secondary", className: "text-xs", children: ["Hybrid (", Math.round(config.hybrid.semanticWeight * 100), "% semantic)"] })), config.reranking?.enabled && (_jsx(Badge, { variant: "secondary", className: "text-xs", children: "Reranking" })), config.queryExpansion && (_jsx(Badge, { variant: "secondary", className: "text-xs", children: "Query Expansion" }))] })] })] }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: placeholder, className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent", disabled: isSearching }), config.queryExpansion && expandedQueries.length > 1 && (_jsxs("div", { className: "text-xs text-muted-foreground", children: ["Also searching: ", expandedQueries.slice(1).join(', ')] })), error && (_jsx("div", { className: "text-sm text-destructive", children: error }))] })] }), _jsx(AnimatePresence, { mode: "wait", children: isSearching ? (_jsx(Card, { className: "shadow-sm", children: _jsxs(CardContent, { className: "p-6 text-center text-muted-foreground", children: [_jsx(motion.div, { className: "inline-block h-5 w-5 rounded-full border-2 border-primary border-t-transparent", animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: 'linear' } }), _jsx("div", { className: "mt-2 text-sm", children: "Searching semantically..." })] }) }, "loading")) : results.length > 0 ? (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "space-y-3", children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: ["Found ", results.length, " ", results.length === 1 ? 'result' : 'results'] }), results.map((result, index) => (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, children: _jsx(Card, { className: cn('shadow-sm hover:shadow-md transition-shadow cursor-pointer', 'border-l-4', result.score >= 0.9
                                    ? 'border-l-green-500'
                                    : result.score >= 0.75
                                        ? 'border-l-blue-500'
                                        : 'border-l-yellow-500'), children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { variant: result.score >= 0.9
                                                                ? 'success'
                                                                : result.score >= 0.75
                                                                    ? 'default'
                                                                    : 'warning', className: "text-xs", children: [Math.round(result.score * 100), "% match"] }), _jsx(Badge, { variant: "outline", className: "text-xs", children: result.matchType })] }), _jsx("div", { className: "text-xs text-muted-foreground", children: result.message.role })] }), _jsx("div", { className: "text-sm mb-2 line-clamp-3", children: result.message.content }), result.highlights && result.highlights.length > 0 && (_jsx("div", { className: "space-y-1", children: result.highlights.map((highlight, i) => (_jsxs("div", { className: "text-xs bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded", children: ["...", highlight, "..."] }, i))) })), result.explanation && (_jsx("div", { className: "text-xs text-muted-foreground mt-2", children: result.explanation }))] }) }) }, result.message.id)))] }, "results")) : query && !isSearching ? (_jsx(Card, { className: "shadow-sm", children: _jsxs(CardContent, { className: "p-6 text-center text-muted-foreground", children: ["No results found for \"", query, "\""] }) }, "no-results")) : null }), showHistory && searchHistory.length > 0 && (_jsxs(Card, { className: "shadow-sm", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Recent Searches" }) }), _jsx(CardContent, { className: "space-y-2", children: searchHistory.slice(0, 5).map((entry, index) => (_jsx("button", { onClick: () => setQuery(entry.query), className: "w-full text-left px-3 py-2 rounded-lg hover:bg-accent transition-colors", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm", children: entry.query }), _jsx(Badge, { variant: "secondary", className: "text-xs", children: entry.resultCount })] }) }, index))) })] }))] }));
}
SemanticMessageSearch.displayName = 'SemanticMessageSearch';
//# sourceMappingURL=advanced-message-search-semantic.js.map