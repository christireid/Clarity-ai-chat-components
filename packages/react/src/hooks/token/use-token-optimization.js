/**
 * Token Optimization Hook (Legacy)
 *
 * @deprecated Use `useTokenOptimizationEnhanced` instead. This hook is maintained
 * for backward compatibility only. The enhanced hook includes all features from
 * this hook plus TOON encoding, accurate tokenization, prompt caching, and more.
 *
 * Migration guide:
 * ```tsx
 * // Before (deprecated)
 * import { useTokenOptimization } from '@clarity-chat/react'
 * const { optimizePrompt } = useTokenOptimization({ enablePromptShortening: true })
 *
 * // After (recommended)
 * import { useTokenOptimizationEnhanced } from '@clarity-chat/react'
 * const { optimizePrompt } = useTokenOptimizationEnhanced({
 *   preset: 'balanced',  // or customize individual options
 *   enablePromptCompression: true,
 * })
 * ```
 *
 * @see useTokenOptimizationEnhanced for the unified hook with all features
 */
'use client';
import * as React from 'react';
import { shortenPrompt, calculateTokenSavings, limitHistory, createCache, generateCacheKey, createThrottler, routeToModel, estimateRoutingSavings, createReference, shouldUseReference, enforceOutputLimit, createBatcher, findSimilarCached, calculateSimilarity, estimateTokens, } from '../../utils/optimization/token-optimization';
/**
 * Hook for token optimization
 *
 * @deprecated Use `useTokenOptimizationEnhanced` instead for all new development.
 *
 * @example
 * ```tsx
 * const {
 *   optimizePrompt,
 *   optimizeHistory,
 *   getCachedResponse,
 *   routeQuery,
 *   stats,
 * } = useTokenOptimization({
 *   enablePromptShortening: true,
 *   enableHistoryLimiting: true,
 *   enableCaching: true,
 *   enableModelRouting: true,
 * })
 *
 * // Optimize prompt before sending
 * const { optimized, savings } = optimizePrompt(userInput)
 * console.log(`Saved ${savings.tokensSaved} tokens (${savings.percentage.toFixed(1)}%)`)
 *
 * // Limit history
 * const limitedMessages = optimizeHistory(messages)
 *
 * // Check cache
 * const cached = getCachedResponse(optimized)
 * if (cached) {
 *   return cached
 * }
 *
 * // Route to appropriate model
 * const model = routeQuery(optimized)
 * ```
 */
export function useTokenOptimization(options = {}) {
    // Emit deprecation warning in development
    React.useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.warn('[useTokenOptimization] DEPRECATED: useTokenOptimization is deprecated. ' +
                'Please migrate to useTokenOptimizationEnhanced for additional features including ' +
                'TOON encoding, accurate tokenization, prompt caching, presets, and more. ' +
                'See documentation for migration guide.');
        }
    }, []);
    const { enablePromptShortening = false, enableHistoryLimiting = false, enableCaching = false, enableThrottling = false, enableModelRouting = false, enableSimilarityCaching = false, enableReferences = false, enableOutputLimits = false, enableBatching = false, promptShortening = {}, historyLimiting = {}, caching = {}, similarityCaching = {}, throttling = {}, modelRouting = {}, references = {}, outputLimits = {}, batching = {}, } = options;
    // Initialize caches
    const cache = React.useMemo(() => (enableCaching ? createCache(caching) : null), [enableCaching, caching]);
    const similarityCache = React.useMemo(() => {
        if (!enableSimilarityCaching)
            return null;
        return new Map();
    }, [enableSimilarityCaching]);
    // Initialize throttler
    const throttler = React.useMemo(() => (enableThrottling ? createThrottler(throttling) : null), [enableThrottling, throttling]);
    // Initialize batcher
    const batcher = React.useMemo(() => (enableBatching ? createBatcher(batching) : null), [enableBatching, batching]);
    // Statistics
    const [stats, setStats] = React.useState({
        tokensSaved: 0,
        percentageSaved: 0,
        cacheHits: 0,
        cacheMisses: 0,
        requestsThrottled: 0,
        simpleModelRoutes: 0,
        complexModelRoutes: 0,
        costSavings: 0,
    });
    /**
     * Optimize prompt
     */
    const optimizePrompt = React.useCallback((prompt) => {
        if (!enablePromptShortening) {
            return {
                optimized: prompt,
                savings: {
                    tokensSaved: 0,
                    percentage: 0,
                    originalTokens: estimateTokens(prompt),
                    shortenedTokens: estimateTokens(prompt),
                },
            };
        }
        const optimized = shortenPrompt(prompt, promptShortening);
        const savings = calculateTokenSavings(prompt, optimized);
        setStats((prev) => ({
            ...prev,
            tokensSaved: prev.tokensSaved + savings.tokensSaved,
            percentageSaved: prev.tokensSaved > 0
                ? ((prev.tokensSaved + savings.tokensSaved) /
                    (prev.tokensSaved / (prev.percentageSaved / 100) +
                        savings.originalTokens)) *
                    100
                : savings.percentage,
        }));
        return { optimized, savings };
    }, [enablePromptShortening, promptShortening]);
    /**
     * Optimize history
     */
    const optimizeHistory = React.useCallback((messages) => {
        if (!enableHistoryLimiting) {
            return messages;
        }
        return limitHistory(messages, historyLimiting);
    }, [enableHistoryLimiting, historyLimiting]);
    /**
     * Get cached response
     */
    const getCachedResponse = React.useCallback((query) => {
        if (!enableCaching && !enableSimilarityCaching) {
            return null;
        }
        // Try exact cache first
        if (enableCaching && cache) {
            const key = generateCacheKey(query);
            const cached = cache.get(key);
            if (cached) {
                setStats((prev) => ({ ...prev, cacheHits: prev.cacheHits + 1 }));
                return cached;
            }
        }
        // Try similarity cache
        if (enableSimilarityCaching && similarityCache) {
            const threshold = similarityCaching.similarityThreshold ?? 0.7;
            const cached = findSimilarCached(query, similarityCache, threshold);
            if (cached) {
                setStats((prev) => ({ ...prev, cacheHits: prev.cacheHits + 1 }));
                return cached;
            }
        }
        setStats((prev) => ({ ...prev, cacheMisses: prev.cacheMisses + 1 }));
        return null;
    }, [enableCaching, enableSimilarityCaching, cache, similarityCache]);
    /**
     * Set cached response
     */
    const setCachedResponse = React.useCallback((query, response, ttl) => {
        if (!enableCaching && !enableSimilarityCaching) {
            return;
        }
        if (enableCaching && cache) {
            const key = generateCacheKey(query);
            cache.set(key, response, ttl ?? caching.ttl);
        }
        if (enableSimilarityCaching && similarityCache) {
            const key = generateCacheKey(query);
            similarityCache.set(key, {
                query,
                response,
                timestamp: Date.now(),
            });
        }
    }, [enableCaching, enableSimilarityCaching, cache, similarityCache, caching]);
    /**
     * Check if can make request
     */
    const canMakeRequest = React.useCallback(() => {
        if (!enableThrottling || !throttler) {
            return true;
        }
        const canMake = throttler.canMakeRequest();
        if (!canMake) {
            setStats((prev) => ({
                ...prev,
                requestsThrottled: prev.requestsThrottled + 1,
            }));
        }
        return canMake;
    }, [enableThrottling, throttler]);
    /**
     * Record request
     */
    const recordRequest = React.useCallback(() => {
        if (enableThrottling && throttler) {
            throttler.recordRequest();
        }
    }, [enableThrottling, throttler]);
    /**
     * Route query to model
     */
    const routeQuery = React.useCallback((query) => {
        if (!enableModelRouting) {
            return modelRouting.complexModel ?? 'gpt-4';
        }
        const model = routeToModel(query, modelRouting);
        const savings = estimateRoutingSavings(query, modelRouting);
        setStats((prev) => ({
            ...prev,
            simpleModelRoutes: prev.simpleModelRoutes + (model === modelRouting.simpleModel ? 1 : 0),
            complexModelRoutes: prev.complexModelRoutes +
                (model === modelRouting.complexModel ? 1 : 0),
            costSavings: prev.costSavings + savings.saved,
        }));
        return model;
    }, [enableModelRouting, modelRouting]);
    /**
     * Create data reference
     */
    const createDataReference = React.useCallback((data) => {
        if (!enableReferences) {
            return { type: 'data', data };
        }
        return createReference(data, references);
    }, [enableReferences, references]);
    /**
     * Limit output
     */
    const limitOutput = React.useCallback((output) => {
        if (!enableOutputLimits) {
            return output;
        }
        return enforceOutputLimit(output, outputLimits);
    }, [enableOutputLimits, outputLimits]);
    /**
     * Batch request
     */
    const batchRequest = React.useCallback(async (request) => {
        if (!enableBatching || !batcher) {
            return request();
        }
        return batcher.add(request);
    }, [enableBatching, batcher]);
    /**
     * Reset statistics
     */
    const resetStats = React.useCallback(() => {
        setStats({
            tokensSaved: 0,
            percentageSaved: 0,
            cacheHits: 0,
            cacheMisses: 0,
            requestsThrottled: 0,
            simpleModelRoutes: 0,
            complexModelRoutes: 0,
            costSavings: 0,
        });
    }, []);
    return {
        optimizePrompt,
        optimizeHistory,
        getCachedResponse,
        setCachedResponse,
        canMakeRequest,
        recordRequest,
        routeQuery,
        createDataReference,
        limitOutput,
        batchRequest,
        stats,
        resetStats,
    };
}
//# sourceMappingURL=use-token-optimization.js.map