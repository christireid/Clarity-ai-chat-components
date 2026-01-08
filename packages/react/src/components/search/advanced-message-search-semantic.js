'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { DURATION_SECONDS as durations } from '../../animations/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, cn, Popover, PopoverContent, PopoverTrigger, } from '@clarity-chat/primitives';
import { Search, Sparkles, Brain, Zap, Clock, X, ChevronDown, ChevronUp, RefreshCw, Copy, Check, ExternalLink, Lightbulb, TrendingUp, Eye, EyeOff, Settings2, Sliders, Target, Wand2, } from 'lucide-react';
// Type assertions for icons
const SearchIcon = Search;
const SparklesIcon = Sparkles;
const BrainIcon = Brain;
const ZapIcon = Zap;
const ClockIcon = Clock;
const XIcon = X;
const ChevronDownIcon = ChevronDown;
const ChevronUpIcon = ChevronUp;
const RefreshIcon = RefreshCw;
const CopyIcon = Copy;
const CheckIcon = Check;
const ExternalLinkIcon = ExternalLink;
const LightbulbIcon = Lightbulb;
const TrendingIcon = TrendingUp;
const EyeIcon = Eye;
const EyeOffIcon = EyeOff;
const SettingsIcon = Settings2;
const SlidersIcon = Sliders;
const TargetIcon = Target;
const WandIcon = Wand2;
const defaultConfig = {
    embeddings: {
        type: 'openai',
        model: 'text-embedding-3-small',
    },
    hybrid: {
        enabled: true,
        semanticWeight: 0.7,
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
 * Escape special regex characters to prevent ReDoS
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
/**
 * Simple keyword search with TF-IDF-like scoring
 */
function keywordSearch(query, messages) {
    const queryTerms = query
        .toLowerCase()
        .split(/\s+/)
        .filter((t) => t.length > 2);
    const scores = new Map();
    const queryLower = query.toLowerCase();
    messages.forEach((message) => {
        const content = message.content.toLowerCase();
        let score = 0;
        queryTerms.forEach((term) => {
            // Escape special regex characters to prevent ReDoS
            const escapedTerm = escapeRegex(term);
            const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
            const matches = content.match(regex);
            if (matches) {
                score += Math.log(1 + matches.length);
            }
            if (content.includes(queryLower)) {
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
    const synonyms = {
        error: ['bug', 'issue', 'problem', 'failure', 'exception', 'crash'],
        fix: ['solve', 'repair', 'correct', 'patch', 'resolve', 'debug'],
        code: ['function', 'script', 'program', 'implementation', 'snippet'],
        explain: ['describe', 'clarify', 'elaborate', 'detail', 'break down'],
        help: ['assist', 'support', 'aid', 'guide', 'show'],
        create: ['make', 'build', 'generate', 'construct', 'develop'],
        improve: ['enhance', 'optimize', 'refactor', 'upgrade', 'better'],
        remove: ['delete', 'eliminate', 'drop', 'clear', 'purge'],
        add: ['include', 'insert', 'append', 'attach', 'incorporate'],
        update: ['modify', 'change', 'edit', 'alter', 'revise'],
    };
    const expansions = [query];
    const terms = query.toLowerCase().split(/\s+/);
    terms.forEach((term) => {
        if (synonyms[term]) {
            expansions.push(...synonyms[term]);
        }
    });
    return [...new Set(expansions)];
}
/**
 * Get match quality label
 */
function getMatchQuality(score) {
    if (score >= 0.9) {
        return {
            label: 'Excellent',
            color: 'bg-green-500',
            icon: _jsx(TargetIcon, { className: "h-3 w-3" }),
        };
    }
    else if (score >= 0.8) {
        return {
            label: 'Very Good',
            color: 'bg-emerald-500',
            icon: _jsx(TrendingIcon, { className: "h-3 w-3" }),
        };
    }
    else if (score >= 0.7) {
        return {
            label: 'Good',
            color: 'bg-blue-500',
            icon: _jsx(CheckIcon, { className: "h-3 w-3" }),
        };
    }
    else if (score >= 0.6) {
        return {
            label: 'Fair',
            color: 'bg-yellow-500',
            icon: _jsx(LightbulbIcon, { className: "h-3 w-3" }),
        };
    }
    return {
        label: 'Partial',
        color: 'bg-orange-500',
        icon: _jsx(SearchIcon, { className: "h-3 w-3" }),
    };
}
/**
 * SemanticMessageSearch Component
 *
 * A premium semantic search experience with:
 * - Vector-based semantic similarity matching
 * - Hybrid search combining semantic + keyword
 * - Intelligent query expansion with synonyms
 * - Real-time relevance scoring
 * - Beautiful result cards with match indicators
 * - Search history with quick access
 * - Configurable search parameters
 * - Smooth animations and transitions
 * - Accessibility-first design
 *
 * @example
 * ```tsx
 * <SemanticMessageSearch
 *   messages={messages}
 *   onResultSelect={(result) => scrollToMessage(result.message)}
 *   onGenerateEmbedding={async (text) => {
 *     const response = await fetch('/api/embed', {
 *       method: 'POST',
 *       body: JSON.stringify({ text }),
 *     })
 *     return response.json()
 *   }}
 * />
 * ```
 */
export function SemanticMessageSearch({ messages, config: userConfig, onResultsFound, onResultSelect, onGenerateEmbedding, onRerank, showHistory = true, showConfig = true, placeholder = 'Search semantically...', compact = false, className, }) {
    const config = React.useMemo(() => ({ ...defaultConfig, ...userConfig }), [userConfig]);
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState([]);
    const [isSearching, setIsSearching] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [searchHistory, setSearchHistory] = React.useState([]);
    const [expandedQueries, setExpandedQueries] = React.useState([]);
    const [showExpansions, setShowExpansions] = React.useState(false);
    const [showHistoryPanel, setShowHistoryPanel] = React.useState(false);
    const [showConfigPanel, setShowConfigPanel] = React.useState(false);
    const [copiedId, setCopiedId] = React.useState(null);
    const [expandedResults, setExpandedResults] = React.useState(new Set());
    const [localConfig, setLocalConfig] = React.useState(config);
    const inputRef = React.useRef(null);
    const copyTimeoutRef = React.useRef(null);
    const searchAbortRef = React.useRef(null);
    const isMountedRef = React.useRef(true);
    const onResultsFoundRef = React.useRef(onResultsFound);
    // Keep callback refs updated
    React.useEffect(() => {
        onResultsFoundRef.current = onResultsFound;
    });
    // Cleanup on unmount
    React.useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
            if (searchAbortRef.current) {
                searchAbortRef.current.abort();
            }
        };
    }, []);
    // Cache for message embeddings
    const embeddingsCache = React.useRef(new Map());
    // Load history from localStorage with validation
    React.useEffect(() => {
        if (typeof window === 'undefined')
            return;
        try {
            const history = localStorage.getItem('clarity-semantic-search-history');
            if (history) {
                const parsed = JSON.parse(history);
                // Validate history structure
                if (Array.isArray(parsed) &&
                    parsed.every((h) => typeof h === 'object' &&
                        h !== null &&
                        'query' in h &&
                        'timestamp' in h &&
                        'resultCount' in h &&
                        typeof h.query === 'string' &&
                        typeof h.timestamp === 'number' &&
                        typeof h.resultCount === 'number')) {
                    setSearchHistory(parsed);
                }
            }
        }
        catch {
            // Silently fail - invalid data will use defaults
        }
    }, []);
    /**
     * Generate embedding for text
     */
    const generateEmbedding = React.useCallback(async (text) => {
        if (embeddingsCache.current.has(text)) {
            return embeddingsCache.current.get(text);
        }
        if (onGenerateEmbedding) {
            const embedding = await onGenerateEmbedding(text);
            embeddingsCache.current.set(text, embedding);
            return embedding;
        }
        // Fallback: generate simple bag-of-words embedding
        const words = text.toLowerCase().split(/\s+/);
        const embedding = new Array(384).fill(0);
        words.forEach((word) => {
            const hash = word.split('').reduce((acc, char) => {
                return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
            }, 0);
            const position = Math.abs(hash) % embedding.length;
            embedding[position] += 1;
        });
        const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
        const normalized = embedding.map((val) => val / (norm || 1));
        embeddingsCache.current.set(text, normalized);
        return normalized;
    }, [onGenerateEmbedding]);
    /**
     * Perform semantic search
     */
    const performSemanticSearch = React.useCallback(async (searchQuery) => {
        const queries = localConfig.queryExpansion
            ? expandQuery(searchQuery)
            : [searchQuery];
        setExpandedQueries(queries);
        const primaryQuery = queries[0] ?? searchQuery;
        const queryEmbedding = await generateEmbedding(primaryQuery);
        const semanticScores = new Map();
        for (const message of messages) {
            const messageEmbedding = await generateEmbedding(message.content);
            const similarity = cosineSimilarity(queryEmbedding, messageEmbedding);
            semanticScores.set(message.id, similarity);
        }
        const keywordScores = keywordSearch(searchQuery, messages);
        const combinedResults = [];
        messages.forEach((message) => {
            const semanticScore = semanticScores.get(message.id) || 0;
            const keywordScore = keywordScores.get(message.id) || 0;
            let finalScore = 0;
            let matchType = 'semantic';
            if (localConfig.hybrid.enabled) {
                const normalizedKeywordScore = Math.min(keywordScore / 10, 1);
                finalScore =
                    localConfig.hybrid.semanticWeight * semanticScore +
                        (1 - localConfig.hybrid.semanticWeight) * normalizedKeywordScore;
                matchType = 'hybrid';
            }
            else {
                finalScore = semanticScore;
            }
            if (finalScore >= (localConfig.similarityThreshold || 0.6)) {
                const highlights = [];
                const content = message.content;
                const queryTerms = searchQuery.toLowerCase().split(/\s+/);
                queryTerms.forEach((term) => {
                    if (term.length < 3)
                        return;
                    // Escape special regex characters to prevent ReDoS
                    const escapedTerm = escapeRegex(term);
                    const regex = new RegExp(`(.{0,40})(${escapedTerm})(.{0,40})`, 'gi');
                    const match = content.match(regex);
                    if (match && match[0]) {
                        highlights.push(match[0]);
                    }
                });
                combinedResults.push({
                    message,
                    score: finalScore,
                    highlights: highlights.slice(0, 3),
                    matchType,
                    explanation: `${Math.round(finalScore * 100)}% relevance`,
                });
            }
        });
        combinedResults.sort((a, b) => b.score - a.score);
        return combinedResults.slice(0, localConfig.maxResults || 10);
    }, [messages, localConfig, generateEmbedding]);
    /**
     * Handle search with proper cleanup
     */
    const handleSearch = React.useCallback(async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }
        // Abort any in-flight search
        if (searchAbortRef.current) {
            searchAbortRef.current.abort();
        }
        searchAbortRef.current = new AbortController();
        setIsSearching(true);
        setError(null);
        try {
            let searchResults = await performSemanticSearch(searchQuery);
            // Check if component is still mounted and search wasn't aborted
            if (!isMountedRef.current || searchAbortRef.current?.signal.aborted) {
                return;
            }
            if (localConfig.reranking?.enabled && onRerank) {
                searchResults = await onRerank(searchQuery, searchResults);
                // Check again after reranking
                if (!isMountedRef.current || searchAbortRef.current?.signal.aborted) {
                    return;
                }
            }
            setResults(searchResults);
            onResultsFoundRef.current?.(searchResults);
            // Add to search history
            setSearchHistory((prev) => {
                const newHistory = [
                    {
                        query: searchQuery,
                        timestamp: Date.now(),
                        resultCount: searchResults.length,
                    },
                    ...prev.filter((h) => h.query !== searchQuery).slice(0, 9),
                ];
                try {
                    localStorage.setItem('clarity-semantic-search-history', JSON.stringify(newHistory));
                }
                catch {
                    // Silently fail
                }
                return newHistory;
            });
        }
        catch (err) {
            // Don't show error if aborted or unmounted
            if (!isMountedRef.current)
                return;
            if (err instanceof Error && err.name === 'AbortError')
                return;
            console.error('Search error:', err);
            setError(err instanceof Error ? err.message : 'Search failed');
        }
        finally {
            if (isMountedRef.current) {
                setIsSearching(false);
            }
        }
    }, [performSemanticSearch, localConfig.reranking, onRerank]);
    // Debounced search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (query) {
                handleSearch(query);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query, handleSearch]);
    // Copy result content with timeout cleanup
    const handleCopy = React.useCallback(async (result) => {
        try {
            await navigator.clipboard.writeText(result.message.content);
            setCopiedId(result.message.id);
            // Clear any existing timeout
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
            copyTimeoutRef.current = setTimeout(() => {
                if (isMountedRef.current) {
                    setCopiedId(null);
                }
                copyTimeoutRef.current = null;
            }, 2000);
        }
        catch {
            // Silently fail
        }
    }, []);
    // Toggle result expansion
    const toggleExpanded = React.useCallback((id) => {
        setExpandedResults((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            }
            else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);
    // Clear history
    const clearHistory = React.useCallback(() => {
        setSearchHistory([]);
        try {
            localStorage.removeItem('clarity-semantic-search-history');
        }
        catch {
            // Silently fail
        }
    }, []);
    return (_jsxs("div", { className: cn('space-y-4', className), children: [_jsxs(Card, { className: cn('shadow-sm overflow-hidden', compact && 'shadow-none border-0'), children: [!compact && (_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25", children: _jsx(BrainIcon, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx(CardTitle, { className: "text-lg font-semibold", children: "Semantic Search" }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "AI-powered understanding of your queries" })] })] }), _jsxs("div", { className: "hidden sm:flex items-center gap-1.5", children: [localConfig.hybrid.enabled && (_jsxs(Badge, { variant: "secondary", className: "text-xs gap-1", children: [_jsx(ZapIcon, { className: "h-3 w-3" }), "Hybrid"] })), localConfig.queryExpansion && (_jsxs(Badge, { variant: "secondary", className: "text-xs gap-1", children: [_jsx(WandIcon, { className: "h-3 w-3" }), "Expansion"] })), localConfig.reranking?.enabled && (_jsxs(Badge, { variant: "secondary", className: "text-xs gap-1", children: [_jsx(TrendingIcon, { className: "h-3 w-3" }), "Reranking"] }))] })] }) })), _jsxs(CardContent, { className: cn('space-y-3', compact && 'p-0'), children: [_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "relative group", children: [_jsx(motion.div, { className: cn('absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors z-10', query && 'text-violet-500'), animate: isSearching ? { scale: [1, 1.1, 1] } : {}, transition: {
                                                    duration: durations.slower,
                                                    repeat: isSearching ? Infinity : 0,
                                                }, children: _jsx(SearchIcon, { className: "h-4 w-4" }) }), _jsx(Input, { ref: inputRef, type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: placeholder, className: cn('pl-9 pr-24 h-11 transition-all duration-200 border-2', 'focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20', 'bg-gradient-to-r from-background to-muted/30'), disabled: isSearching, onKeyDown: (e) => {
                                                    if (e.key === 'Escape') {
                                                        setQuery('');
                                                        inputRef.current?.blur();
                                                    }
                                                } }), _jsxs("div", { className: "absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1", children: [_jsx(AnimatePresence, { children: isSearching && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, className: "h-4 w-4 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" })) }), _jsx(AnimatePresence, { children: query && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
                                                                    setQuery('');
                                                                    setResults([]);
                                                                }, className: "h-6 w-6 p-0 hover:bg-transparent hover:text-destructive", children: _jsx(XIcon, { className: "h-3.5 w-3.5" }) }) })) }), showHistory && (_jsxs(Popover, { open: showHistoryPanel, onOpenChange: setShowHistoryPanel, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "sm", className: cn('h-7 w-7 p-0', searchHistory.length > 0 && 'text-violet-500'), children: _jsx(ClockIcon, { className: "h-4 w-4" }) }) }), _jsx(PopoverContent, { className: "w-72", align: "end", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "text-sm font-medium", children: "Recent Searches" }), searchHistory.length > 0 && (_jsx(Button, { variant: "ghost", size: "sm", onClick: clearHistory, className: "h-6 text-xs text-muted-foreground hover:text-destructive", children: "Clear" }))] }), searchHistory.length > 0 ? (_jsx("div", { className: "space-y-1 max-h-48 overflow-y-auto", children: searchHistory.map((entry, index) => (_jsxs(motion.button, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.03 }, onClick: () => {
                                                                                    setQuery(entry.query);
                                                                                    setShowHistoryPanel(false);
                                                                                }, className: "w-full text-left px-2 py-1.5 rounded hover:bg-accent flex items-center justify-between", children: [_jsx("span", { className: "text-sm truncate", children: entry.query }), _jsx(Badge, { variant: "secondary", className: "text-xs", children: entry.resultCount })] }, index))) })) : (_jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "No recent searches" }))] }) })] })), showConfig && (_jsxs(Popover, { open: showConfigPanel, onOpenChange: setShowConfigPanel, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "sm", className: "h-7 w-7 p-0", children: _jsx(SlidersIcon, { className: "h-4 w-4" }) }) }), _jsx(PopoverContent, { className: "w-80", align: "end", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("h4", { className: "text-sm font-medium flex items-center gap-2", children: [_jsx(SettingsIcon, { className: "h-4 w-4" }), "Search Settings"] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-sm text-muted-foreground", children: "Semantic Weight" }), _jsxs("span", { className: "text-sm font-medium", children: [Math.round(localConfig.hybrid.semanticWeight * 100), "%"] })] }), _jsx("input", { type: "range", min: "0", max: "100", value: localConfig.hybrid.semanticWeight * 100, onChange: (e) => setLocalConfig((prev) => ({
                                                                                        ...prev,
                                                                                        hybrid: {
                                                                                            ...prev.hybrid,
                                                                                            semanticWeight: parseInt(e.target.value, 10) / 100,
                                                                                        },
                                                                                    })), className: "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500" }), _jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [_jsx("span", { children: "Keyword" }), _jsx("span", { children: "Semantic" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-sm text-muted-foreground", children: "Min Similarity" }), _jsxs("span", { className: "text-sm font-medium", children: [Math.round((localConfig.similarityThreshold || 0.6) * 100), "%"] })] }), _jsx("input", { type: "range", min: "0", max: "100", value: (localConfig.similarityThreshold || 0.6) * 100, onChange: (e) => setLocalConfig((prev) => ({
                                                                                        ...prev,
                                                                                        similarityThreshold: parseInt(e.target.value, 10) / 100,
                                                                                    })), className: "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm text-muted-foreground", children: "Max Results" }), _jsx(Input, { type: "number", min: "1", max: "50", value: localConfig.maxResults || 10, onChange: (e) => setLocalConfig((prev) => ({
                                                                                        ...prev,
                                                                                        maxResults: parseInt(e.target.value, 10) || 10,
                                                                                    })), className: "h-8" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: localConfig.queryExpansion, onChange: (e) => setLocalConfig((prev) => ({
                                                                                                ...prev,
                                                                                                queryExpansion: e.target.checked,
                                                                                            })), className: "rounded" }), _jsx("span", { className: "text-sm", children: "Query Expansion" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: localConfig.hybrid.enabled, onChange: (e) => setLocalConfig((prev) => ({
                                                                                                ...prev,
                                                                                                hybrid: {
                                                                                                    ...prev.hybrid,
                                                                                                    enabled: e.target.checked,
                                                                                                },
                                                                                            })), className: "rounded" }), _jsx("span", { className: "text-sm", children: "Hybrid Search" })] })] })] }) })] }))] })] }), _jsx(AnimatePresence, { children: isSearching && (_jsx(motion.div, { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-muted overflow-hidden rounded-b-md", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(motion.div, { className: "h-full bg-gradient-to-r from-violet-500 to-purple-500", initial: { x: '-100%' }, animate: { x: '100%' }, transition: {
                                                    duration: durations.slower,
                                                    repeat: Infinity,
                                                    ease: 'linear',
                                                } }) })) })] }), _jsx(AnimatePresence, { children: localConfig.queryExpansion &&
                                    expandedQueries.length > 1 &&
                                    query && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, children: [_jsxs("button", { onClick: () => setShowExpansions(!showExpansions), className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors", children: [_jsx(WandIcon, { className: "h-3 w-3" }), showExpansions ? 'Hide' : 'Show', " related terms (", expandedQueries.length - 1, ")", showExpansions ? (_jsx(ChevronUpIcon, { className: "h-3 w-3" })) : (_jsx(ChevronDownIcon, { className: "h-3 w-3" }))] }), _jsx(AnimatePresence, { children: showExpansions && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "mt-2 flex flex-wrap gap-1", children: expandedQueries.slice(1).map((term, i) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: term }, i))) })) })] })) }), error && (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "text-sm text-destructive flex items-center gap-2", children: [_jsx(XIcon, { className: "h-4 w-4" }), error] }))] })] }), _jsx(AnimatePresence, { mode: "wait", children: isSearching ? (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, children: _jsx(Card, { className: "shadow-sm", children: _jsxs(CardContent, { className: "p-8 flex flex-col items-center justify-center", children: [_jsx(motion.div, { className: "h-12 w-12 rounded-full border-3 border-violet-500/30 border-t-violet-500", animate: { rotate: 360 }, transition: {
                                        duration: durations.slower,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    } }), _jsx(motion.p, { className: "mt-4 text-sm text-muted-foreground", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.3 }, children: "Analyzing semantic meaning..." })] }) }) }, "loading")) : results.length > 0 ? (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "space-y-3", children: [_jsx("div", { className: "flex items-center justify-between text-sm", children: _jsxs("span", { className: "text-muted-foreground flex items-center gap-2", children: [_jsx(motion.span, { className: "inline-block w-2 h-2 rounded-full bg-green-500", animate: { scale: [1, 1.2, 1] }, transition: { duration: durations.slower, repeat: Infinity } }), "Found", ' ', _jsx("span", { className: "font-semibold text-foreground", children: results.length }), ' ', "semantically relevant messages"] }) }), results.map((result, index) => {
                            const quality = getMatchQuality(result.score);
                            const isExpanded = expandedResults.has(result.message.id);
                            return (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, children: _jsx(Card, { className: cn('shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden', 'border-l-4', result.score >= 0.9
                                        ? 'border-l-green-500'
                                        : result.score >= 0.8
                                            ? 'border-l-emerald-500'
                                            : result.score >= 0.7
                                                ? 'border-l-blue-500'
                                                : result.score >= 0.6
                                                    ? 'border-l-yellow-500'
                                                    : 'border-l-orange-500'), onClick: () => onResultSelect?.(result), children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-2 mb-3", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsxs(Badge, { className: cn('text-xs gap-1 text-white', quality.color), children: [quality.icon, Math.round(result.score * 100), "%"] }), _jsxs(Badge, { variant: "outline", className: "text-xs gap-1", children: [result.matchType === 'semantic' && (_jsx(BrainIcon, { className: "h-3 w-3" })), result.matchType === 'keyword' && (_jsx(SearchIcon, { className: "h-3 w-3" })), result.matchType === 'hybrid' && (_jsx(ZapIcon, { className: "h-3 w-3" })), result.matchType] }), _jsx(Badge, { variant: "secondary", className: "text-xs", children: result.message.role })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                    e.stopPropagation();
                                                                    handleCopy(result);
                                                                }, className: "h-7 w-7 p-0", children: copiedId === result.message.id ? (_jsx(CheckIcon, { className: "h-3.5 w-3.5 text-green-500" })) : (_jsx(CopyIcon, { className: "h-3.5 w-3.5" })) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                    e.stopPropagation();
                                                                    toggleExpanded(result.message.id);
                                                                }, className: "h-7 w-7 p-0", children: isExpanded ? (_jsx(EyeOffIcon, { className: "h-3.5 w-3.5" })) : (_jsx(EyeIcon, { className: "h-3.5 w-3.5" })) })] })] }), _jsx("div", { className: cn('text-sm mb-2', !isExpanded && 'line-clamp-2'), children: result.message.content }), result.highlights && result.highlights.length > 0 && (_jsx("div", { className: "space-y-1 mt-3", children: result.highlights.map((highlight, i) => (_jsxs("div", { className: "text-xs bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded", children: ["...", highlight, "..."] }, i))) })), _jsxs("div", { className: "mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1", children: [quality.icon, quality.label, " match"] }), _jsx("span", { children: result.explanation })] })] }) }) }, result.message.id));
                        })] }, "results")) : query && !isSearching ? (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, children: _jsx(Card, { className: "shadow-sm", children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx("div", { className: "flex justify-center mb-4", children: _jsx("div", { className: "h-12 w-12 rounded-full bg-muted flex items-center justify-center", children: _jsx(SearchIcon, { className: "h-6 w-6 text-muted-foreground" }) }) }), _jsx("h3", { className: "text-lg font-medium mb-2", children: "No Results Found" }), _jsxs("p", { className: "text-sm text-muted-foreground mb-4", children: ["No messages match your search \"", query, "\""] }), _jsxs("div", { className: "flex justify-center gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setQuery(''), children: "Clear Search" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setLocalConfig((prev) => ({
                                                ...prev,
                                                similarityThreshold: Math.max(0.3, (prev.similarityThreshold || 0.6) - 0.1),
                                            })), children: "Lower Threshold" })] })] }) }) }, "no-results")) : null })] }));
}
SemanticMessageSearch.displayName = 'SemanticMessageSearch';
//# sourceMappingURL=advanced-message-search-semantic.js.map