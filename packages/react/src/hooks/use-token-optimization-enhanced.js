/**
 * Enhanced Token Optimization Hook (Unified)
 *
 * Comprehensive token optimization with all features:
 * - TOON support (30-60% savings on structured data)
 * - Accurate tokenization (tiktoken)
 * - Prompt caching (50-90% savings)
 * - Advanced semantic caching
 * - Real-time cost tracking
 * - History limiting and throttling
 * - Model routing
 * - Reference system for large data
 * - Output limits and batching
 * - Response prefilling
 * - Context ordering
 *
 * This is the unified hook that combines all features from
 * useTokenOptimization (basic) and useTokenOptimizationEnhanced.
 *
 * @since 2.0.0
 */
'use client';
import * as React from 'react';
// Import new utilities
import { autoOptimize, parseFlexible } from '../utils/toon';
import { countTokens } from '../utils/tokenization';
import { calculateCost } from '../utils/tokenization/model-pricing';
import { PromptCacheManager, createAnthropicCachedMessages } from '../utils/prompt-caching';
// Import existing utilities
import { compressPrompt } from '../utils/prompt-compression';
import { SmartCache } from '../utils/smart-cache';
// Import utilities from token-optimization for unified API
import { limitHistory, createThrottler, routeToModel, estimateRoutingSavings, createReference, enforceOutputLimit, createBatcher, } from '../utils/token-optimization';
// Import new optimization utilities
import { PREFILL_TEMPLATES } from '../utils/response-prefilling';
import { restructurePrompt as restructurePromptUtil } from '../utils/prompt-structure';
/**
 * Get configuration from preset
 */
function getPresetConfig(preset) {
    switch (preset) {
        case 'aggressive':
            return {
                enableToon: true,
                enablePromptCaching: true,
                enableSemanticCaching: true,
                enablePromptCompression: true,
                compressionLevel: 'aggressive',
                enableHistoryLimiting: true,
                enableModelRouting: true,
                enablePrefilling: true,
                enablePromptStructure: true,
            };
        case 'balanced':
            return {
                enableToon: true,
                enablePromptCaching: true,
                enablePromptCompression: true,
                compressionLevel: 'balanced',
                enableHistoryLimiting: true,
                enablePrefilling: true,
            };
        case 'conservative':
            return {
                enableToon: true,
                enablePromptCompression: true,
                compressionLevel: 'conservative',
            };
        case 'realtime':
            return {
                enableToon: true,
                enableSemanticCaching: true,
                enablePromptCompression: true,
                compressionLevel: 'conservative',
                // Skip caching for lowest latency
                enablePromptCaching: false,
            };
        default:
            return {};
    }
}
/**
 * Enhanced Token Optimization Hook (Unified)
 *
 * @example
 * ```tsx
 * // Using a preset for quick setup
 * const optimizer = useTokenOptimizationEnhanced({ preset: 'balanced' })
 *
 * // Or customize individual options
 * const {
 *   optimizeData,
 *   optimizePrompt,
 *   prepareMessages,
 *   optimizeHistory,
 *   routeQuery,
 *   getPrefill,
 *   stats,
 *   resetStats
 * } = useTokenOptimizationEnhanced({
 *   model: 'claude-3-5-sonnet',
 *   enableToon: true,
 *   enablePromptCaching: true,
 *   enableSemanticCaching: true,
 *   enableHistoryLimiting: true,
 *   enableModelRouting: true,
 *   enablePrefilling: true
 * })
 *
 * // Optimize structured data (uses TOON if beneficial)
 * const optimized = await optimizeData(myData)
 * console.log(`Saved ${optimized.optimizations.toon?.savingsPercent}%`)
 *
 * // Prepare messages with cache control
 * const messages = prepareMessages(conversationMessages)
 *
 * // Route to appropriate model
 * const model = routeQuery(userQuery)
 *
 * // Get prefill for JSON response
 * const prefill = getPrefill('json') // returns '{'
 *
 * // Track total savings
 * console.log(`Total saved: $${stats.overall.totalCostSaved.toFixed(4)}`)
 * ```
 */
export function useTokenOptimizationEnhanced(options = {}) {
    // Apply presets
    const presetConfig = getPresetConfig(options.preset);
    const { model = 'gpt-4', enableToon = presetConfig.enableToon ?? true, toonMinSavings = 20, enableAccurateTokenization = true, enablePromptCaching = presetConfig.enablePromptCaching ?? false, cachingProvider = 'auto', enableSemanticCaching = presetConfig.enableSemanticCaching ?? false, similarityThreshold = 0.85, enablePromptCompression = presetConfig.enablePromptCompression ?? true, compressionLevel = presetConfig.compressionLevel ?? 'balanced', enableCostTracking = true, enableStats = true, 
    // From basic hook
    enableHistoryLimiting = presetConfig.enableHistoryLimiting ?? false, historyLimiting = {}, enableThrottling = false, throttling = {}, enableModelRouting = presetConfig.enableModelRouting ?? false, modelRouting = {}, enableReferences = false, references = {}, enableOutputLimits = false, outputLimits = {}, enableBatching = false, batching = {}, 
    // New optimizations
    enablePrefilling = presetConfig.enablePrefilling ?? false, prefillConfig = {}, enablePromptStructure = presetConfig.enablePromptStructure ?? false, promptStructureOptions = {}, } = options;
    // Initialize managers
    const promptCacheManager = React.useMemo(() => new PromptCacheManager({
        provider: cachingProvider,
        model,
        trackStats: enableStats,
    }), [cachingProvider, model, enableStats]);
    const semanticCache = React.useMemo(() => enableSemanticCaching
        ? new SmartCache({
            maxSize: 100,
            enableSemanticMatching: true,
            similarityThreshold,
        })
        : null, [enableSemanticCaching, similarityThreshold]);
    // Initialize throttler (from basic hook)
    const throttler = React.useMemo(() => (enableThrottling ? createThrottler(throttling) : null), [enableThrottling, throttling]);
    // Initialize batcher (from basic hook)
    const batcher = React.useMemo(() => (enableBatching ? createBatcher(batching) : null), [enableBatching, batching]);
    // Statistics
    const [stats, setStats] = React.useState({
        toon: {
            conversions: 0,
            totalTokensSaved: 0,
            averageSavingsPercent: 0,
        },
        compression: {
            compressions: 0,
            totalTokensSaved: 0,
            averageSavingsPercent: 0,
        },
        cache: promptCacheManager.getStats(),
        semanticCache: {
            hits: 0,
            misses: 0,
            hitRate: 0,
            tokensSaved: 0,
        },
        tokenization: {
            accurateCount: 0,
            estimatedCount: 0,
            accuracyRate: 0,
        },
        costs: {
            totalCost: 0,
            inputCost: 0,
            outputCost: 0,
            cachedCost: 0,
            savingsFromOptimization: 0,
        },
        historyLimiting: {
            messagesRemoved: 0,
            tokensSaved: 0,
        },
        throttling: {
            requestsThrottled: 0,
        },
        modelRouting: {
            simpleModelRoutes: 0,
            complexModelRoutes: 0,
            routingCostSaved: 0,
        },
        prefilling: {
            prefilledResponses: 0,
            preambleTokensSaved: 0,
        },
        promptStructure: {
            restructuredPrompts: 0,
            questionsMovedToEnd: 0,
        },
        overall: {
            totalTokensSaved: 0,
            totalCostSaved: 0,
            averageSavingsPercent: 0,
        },
    });
    /**
     * Optimize structured data
     */
    const optimizeData = React.useCallback(async (data) => {
        // Apply TOON optimization
        let content;
        let format = 'json';
        let toonResult;
        if (enableToon) {
            const result = autoOptimize(data, { minSavingsPercent: toonMinSavings });
            content = result.data;
            format = result.format;
            toonResult = result;
            // Update stats
            if (enableStats && result.format === 'toon') {
                setStats(prev => ({
                    ...prev,
                    toon: {
                        conversions: prev.toon.conversions + 1,
                        totalTokensSaved: prev.toon.totalTokensSaved + result.tokensSaved,
                        averageSavingsPercent: (prev.toon.averageSavingsPercent * prev.toon.conversions + result.savingsPercent) /
                            (prev.toon.conversions + 1),
                    },
                }));
            }
        }
        else {
            content = JSON.stringify(data);
        }
        // Count tokens
        const tokens = await countTokens(content, {
            model,
            preferAccurate: enableAccurateTokenization,
        });
        // Update tokenization stats
        if (enableStats) {
            setStats(prev => ({
                ...prev,
                tokenization: {
                    accurateCount: prev.tokenization.accurateCount + (tokens.method === 'accurate' ? 1 : 0),
                    estimatedCount: prev.tokenization.estimatedCount + (tokens.method === 'estimated' ? 1 : 0),
                    accuracyRate: ((prev.tokenization.accurateCount + (tokens.method === 'accurate' ? 1 : 0)) /
                        (prev.tokenization.accurateCount +
                            prev.tokenization.estimatedCount +
                            1)) *
                        100,
                },
            }));
        }
        // Calculate cost
        let cost;
        if (enableCostTracking) {
            cost = calculateCost({
                model,
                inputTokens: tokens.total,
                outputTokens: 0,
            });
            setStats(prev => ({
                ...prev,
                costs: {
                    ...prev.costs,
                    inputCost: prev.costs.inputCost + cost.inputCost,
                    totalCost: prev.costs.totalCost + cost.totalCost,
                },
            }));
        }
        return {
            content,
            format,
            tokens,
            cost,
            optimizations: {
                toon: toonResult,
            },
        };
    }, [
        enableToon,
        toonMinSavings,
        model,
        enableAccurateTokenization,
        enableCostTracking,
        enableStats,
    ]);
    /**
     * Optimize text prompt
     */
    const optimizePrompt = React.useCallback(async (prompt) => {
        let content = prompt;
        let compressionResult;
        // Apply compression
        if (enablePromptCompression) {
            const options = compressionLevel === 'aggressive'
                ? { removeFillers: true, useAbbreviations: true, reducePunctuation: true }
                : compressionLevel === 'conservative'
                    ? { removeFillers: false, useAbbreviations: false, reducePunctuation: true }
                    : { removeFillers: true, useAbbreviations: false, reducePunctuation: true };
            compressionResult = compressPrompt(prompt, options);
            content = compressionResult.compressed;
            // Update stats
            if (enableStats) {
                setStats(prev => ({
                    ...prev,
                    compression: {
                        compressions: prev.compression.compressions + 1,
                        totalTokensSaved: prev.compression.totalTokensSaved + compressionResult.tokenSavings,
                        averageSavingsPercent: (prev.compression.averageSavingsPercent * prev.compression.compressions +
                            compressionResult.savingsPercent) /
                            (prev.compression.compressions + 1),
                    },
                }));
            }
        }
        // Count tokens
        const tokens = await countTokens(content, {
            model,
            preferAccurate: enableAccurateTokenization,
        });
        // Calculate cost
        let cost;
        if (enableCostTracking) {
            cost = calculateCost({
                model,
                inputTokens: tokens.total,
                outputTokens: 0,
            });
            setStats(prev => ({
                ...prev,
                costs: {
                    ...prev.costs,
                    inputCost: prev.costs.inputCost + cost.inputCost,
                    totalCost: prev.costs.totalCost + cost.totalCost,
                },
            }));
        }
        return {
            content,
            format: 'text',
            tokens,
            cost,
            optimizations: {
                compression: compressionResult,
            },
        };
    }, [
        enablePromptCompression,
        compressionLevel,
        model,
        enableAccurateTokenization,
        enableCostTracking,
        enableStats,
    ]);
    /**
     * Prepare messages with caching
     */
    const prepareMessages = React.useCallback((messages) => {
        if (!enablePromptCaching) {
            return messages;
        }
        // Extract system prompt
        const systemMessage = messages.find(m => m.role === 'system');
        const conversationMessages = messages.filter(m => m.role !== 'system');
        const systemPrompt = systemMessage
            ? typeof systemMessage.content === 'string'
                ? systemMessage.content
                : JSON.stringify(systemMessage.content)
            : '';
        // Prepare with cache control
        if (cachingProvider === 'anthropic' || cachingProvider === 'auto') {
            return createAnthropicCachedMessages(systemPrompt, conversationMessages.map(m => ({
                role: m.role,
                content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
            })));
        }
        return messages;
    }, [enablePromptCaching, cachingProvider]);
    /**
     * Parse response
     */
    const parseResponse = React.useCallback((response) => {
        return parseFlexible(response);
    }, []);
    /**
     * Count tokens wrapper
     */
    const countTokensWrapper = React.useCallback(async (text) => {
        return countTokens(text, {
            model,
            preferAccurate: enableAccurateTokenization,
        });
    }, [model, enableAccurateTokenization]);
    /**
     * Calculate cost wrapper
     */
    const calculateCostWrapper = React.useCallback((params) => {
        return calculateCost({
            model,
            ...params,
        });
    }, [model]);
    /**
     * Reset statistics
     */
    const resetStats = React.useCallback(() => {
        setStats({
            toon: {
                conversions: 0,
                totalTokensSaved: 0,
                averageSavingsPercent: 0,
            },
            compression: {
                compressions: 0,
                totalTokensSaved: 0,
                averageSavingsPercent: 0,
            },
            cache: promptCacheManager.getStats(),
            semanticCache: {
                hits: 0,
                misses: 0,
                hitRate: 0,
                tokensSaved: 0,
            },
            tokenization: {
                accurateCount: 0,
                estimatedCount: 0,
                accuracyRate: 0,
            },
            costs: {
                totalCost: 0,
                inputCost: 0,
                outputCost: 0,
                cachedCost: 0,
                savingsFromOptimization: 0,
            },
            historyLimiting: {
                messagesRemoved: 0,
                tokensSaved: 0,
            },
            throttling: {
                requestsThrottled: 0,
            },
            modelRouting: {
                simpleModelRoutes: 0,
                complexModelRoutes: 0,
                routingCostSaved: 0,
            },
            prefilling: {
                prefilledResponses: 0,
                preambleTokensSaved: 0,
            },
            promptStructure: {
                restructuredPrompts: 0,
                questionsMovedToEnd: 0,
            },
            overall: {
                totalTokensSaved: 0,
                totalCostSaved: 0,
                averageSavingsPercent: 0,
            },
        });
        promptCacheManager.resetStats();
    }, [promptCacheManager]);
    // ========== Methods from basic hook ==========
    /**
     * Optimize history (limit conversation messages)
     */
    const optimizeHistory = React.useCallback((messages) => {
        if (!enableHistoryLimiting) {
            return messages;
        }
        const originalLength = messages.length;
        const limited = limitHistory(messages, historyLimiting);
        // Track stats
        if (enableStats && limited.length < originalLength) {
            setStats(prev => ({
                ...prev,
                historyLimiting: {
                    messagesRemoved: prev.historyLimiting.messagesRemoved + (originalLength - limited.length),
                    tokensSaved: prev.historyLimiting.tokensSaved, // Would need token counting for accurate tracking
                },
            }));
        }
        return limited;
    }, [enableHistoryLimiting, historyLimiting, enableStats]);
    /**
     * Check if request can be made (throttling)
     */
    const canMakeRequest = React.useCallback(() => {
        if (!enableThrottling || !throttler) {
            return true;
        }
        const canMake = throttler.canMakeRequest();
        if (!canMake && enableStats) {
            setStats(prev => ({
                ...prev,
                throttling: {
                    requestsThrottled: prev.throttling.requestsThrottled + 1,
                },
            }));
        }
        return canMake;
    }, [enableThrottling, throttler, enableStats]);
    /**
     * Record request (for throttling)
     */
    const recordRequest = React.useCallback(() => {
        if (enableThrottling && throttler) {
            throttler.recordRequest();
        }
    }, [enableThrottling, throttler]);
    /**
     * Route query to appropriate model
     */
    const routeQuery = React.useCallback((query) => {
        if (!enableModelRouting) {
            return modelRouting.complexModel ?? model ?? 'gpt-4';
        }
        const routedModel = routeToModel(query, modelRouting);
        const savings = estimateRoutingSavings(query, modelRouting);
        if (enableStats) {
            setStats(prev => ({
                ...prev,
                modelRouting: {
                    simpleModelRoutes: prev.modelRouting.simpleModelRoutes + (routedModel === modelRouting.simpleModel ? 1 : 0),
                    complexModelRoutes: prev.modelRouting.complexModelRoutes + (routedModel === modelRouting.complexModel ? 1 : 0),
                    routingCostSaved: prev.modelRouting.routingCostSaved + savings.saved,
                },
            }));
        }
        return routedModel;
    }, [enableModelRouting, modelRouting, model, enableStats]);
    /**
     * Create data reference for large data
     */
    const createDataReference = React.useCallback((data) => {
        if (!enableReferences) {
            return { type: 'data', data };
        }
        return createReference(data, references);
    }, [enableReferences, references]);
    /**
     * Enforce output limits
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
    // ========== New optimization methods ==========
    /**
     * Get prefill string for response format
     */
    const getPrefill = React.useCallback((format) => {
        if (!enablePrefilling) {
            return '';
        }
        // Map format to template
        let template;
        switch (format) {
            case 'json':
                template = PREFILL_TEMPLATES.json;
                break;
            case 'xml':
                // No XML template, use custom
                template = undefined;
                break;
            case 'code':
                template = PREFILL_TEMPLATES.javascript;
                break;
            case 'markdown':
                template = PREFILL_TEMPLATES.analysis;
                break;
        }
        const prefill = template?.config.prefill ?? (format === 'xml' ? '<response>' : '');
        if (enableStats && prefill) {
            setStats(prev => ({
                ...prev,
                prefilling: {
                    prefilledResponses: prev.prefilling.prefilledResponses + 1,
                    preambleTokensSaved: prev.prefilling.preambleTokensSaved + 10, // Estimated average preamble tokens
                },
            }));
        }
        return prefill;
    }, [enablePrefilling, enableStats]);
    /**
     * Restructure prompt for optimal attention (question at end)
     *
     * If context is provided, it will be placed at the beginning of the prompt
     * while the question/instruction stays at the end (following "lost in the middle" research).
     */
    const restructurePrompt = React.useCallback((prompt, context) => {
        if (!enablePromptStructure) {
            return { restructured: prompt, wasRestructured: false };
        }
        // If context is provided, structure as: context at beginning, prompt at end
        let inputForRestructure = prompt;
        if (context) {
            // Prepend context - the restructurePromptUtil will detect
            // and place the actual question at the end
            inputForRestructure = `${context}\n\n${prompt}`;
        }
        const result = restructurePromptUtil(inputForRestructure, promptStructureOptions);
        const restructured = result.user;
        const wasRestructured = restructured !== inputForRestructure;
        if (enableStats && wasRestructured) {
            setStats(prev => ({
                ...prev,
                promptStructure: {
                    restructuredPrompts: prev.promptStructure.restructuredPrompts + 1,
                    questionsMovedToEnd: prev.promptStructure.questionsMovedToEnd + 1,
                },
            }));
        }
        return {
            restructured,
            wasRestructured,
            questionPosition: 'end',
        };
    }, [enablePromptStructure, promptStructureOptions, enableStats]);
    // Update overall stats periodically
    React.useEffect(() => {
        if (!enableStats)
            return;
        const totalTokensSaved = stats.toon.totalTokensSaved +
            stats.compression.totalTokensSaved +
            stats.cache.tokensSaved +
            stats.semanticCache.tokensSaved;
        const totalCostSaved = stats.costs.savingsFromOptimization + stats.cache.costSaved;
        setStats(prev => ({
            ...prev,
            overall: {
                totalTokensSaved,
                totalCostSaved,
                averageSavingsPercent: (stats.toon.averageSavingsPercent + stats.compression.averageSavingsPercent) / 2,
            },
        }));
    }, [
        stats.toon,
        stats.compression,
        stats.cache,
        stats.semanticCache,
        stats.costs,
        enableStats,
    ]);
    return {
        // Original enhanced methods
        optimizeData,
        optimizePrompt,
        prepareMessages,
        parseResponse,
        countTokens: countTokensWrapper,
        calculateCost: calculateCostWrapper,
        // From basic hook
        optimizeHistory,
        canMakeRequest,
        recordRequest,
        routeQuery,
        createDataReference,
        limitOutput,
        batchRequest,
        // New optimizations
        getPrefill,
        restructurePrompt,
        // Stats
        stats,
        resetStats,
    };
}
//# sourceMappingURL=use-token-optimization-enhanced.js.map