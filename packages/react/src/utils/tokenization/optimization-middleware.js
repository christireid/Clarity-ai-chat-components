/**
 * Automatic Token Optimization Middleware
 *
 * This module provides seamless token optimization through:
 * - Request/response interception and optimization
 * - Automatic model detection and optimization
 * - Real-time token usage monitoring
 * - Configurable optimization strategies
 * - Integration with existing APIs
 * - Performance tracking and analytics
 */
import { TokenCounter } from '@clarity-chat/token-optimization';
import { adaptiveOptimizer, optimizeTokensAdaptively, } from './adaptive-optimizer';
import { advancedCompressor, compressWithAdvanced, } from './advanced-compression';
import { semanticCache, getCachedTokenCount } from './intelligent-caching';
/**
 * Core token optimization middleware
 */
export class TokenOptimizationMiddleware {
    config;
    metrics;
    requestHistory;
    optimizationCache;
    activeConversations;
    constructor(config = {}) {
        this.config = {
            mode: 'automatic',
            target: 'both',
            priority: 'balanced',
            enabled: true,
            autoDetectModel: true,
            enableCaching: true,
            enableAnalytics: true,
            enableRealTimeOptimization: true,
            enableFallback: true,
            maxRetries: 3,
            timeout: 5000,
            qualityThreshold: 0.8,
            compressionRatio: 0.3,
            preserveContext: true,
            adaptiveLearning: true,
            ...config,
        };
        this.metrics = this.initializeMetrics();
        this.requestHistory = new Map();
        this.optimizationCache = new Map();
        this.activeConversations = new Map();
    }
    /**
     * Main optimization method - processes requests automatically
     */
    async optimize(text, context, options) {
        const startTime = performance.now();
        const config = { ...this.config, ...options };
        if (!config.enabled) {
            return this.createPassthroughResult(text, startTime);
        }
        try {
            // Check cache first
            if (config.enableCaching) {
                const cachedResult = await this.getCachedResult(text, context);
                if (cachedResult) {
                    return { ...cachedResult, cacheHit: true };
                }
            }
            // Auto-detect model if needed
            const model = config.autoDetectModel
                ? this.detectModel(text, context)
                : context.model;
            // Apply optimization based on mode
            let optimizedResult;
            switch (config.mode) {
                case 'automatic':
                    optimizedResult = await this.optimizeAutomatically(text, model, context, config);
                    break;
                case 'manual':
                    optimizedResult = await this.optimizeManually(text, model, context, config);
                    break;
                case 'adaptive':
                    optimizedResult = await this.optimizeAdaptively(text, model, context, config);
                    break;
                case 'budget-aware':
                    optimizedResult = await this.optimizeWithBudget(text, model, context, config);
                    break;
                default:
                    optimizedResult = await this.optimizeAutomatically(text, model, context, config);
            }
            // Update metrics
            this.updateMetrics(optimizedResult);
            // Cache result
            if (config.enableCaching) {
                await this.cacheResult(text, context, optimizedResult);
            }
            // Record history
            this.recordHistory(context, optimizedResult);
            return optimizedResult;
        }
        catch (error) {
            return this.handleOptimizationError(text, error, startTime);
        }
    }
    /**
     * Automatic optimization with intelligent defaults
     */
    async optimizeAutomatically(text, model, context, config) {
        const originalTokens = await TokenCounter.count(text);
        // Apply compression based on content analysis
        const compressionStrategy = this.selectCompressionStrategy(text, context);
        const compressionRatio = this.calculateOptimalCompressionRatio(text, model, context);
        const compressedText = await compressWithAdvanced(text, compressionStrategy, compressionRatio, config.qualityThreshold || 0.8);
        const compressedTokens = await TokenCounter.count(compressedText);
        const reductionRatio = 1 - compressedTokens / originalTokens;
        const estimatedQuality = this.estimateQuality(text, compressedText);
        const estimatedCost = this.estimateCost(compressedTokens, model);
        return {
            originalText: text,
            optimizedText: compressedText,
            originalTokens,
            optimizedTokens: compressedTokens,
            reductionRatio,
            estimatedQuality,
            estimatedCost,
            processingTime: performance.now() - context.timestamp,
            strategyUsed: compressionStrategy,
            cacheHit: false,
            fallbackUsed: false,
            errors: [],
            warnings: [],
            recommendations: this.generateRecommendations(text, compressedText, context),
        };
    }
    /**
     * Manual optimization with specific parameters
     */
    async optimizeManually(text, model, context, config) {
        const originalTokens = await TokenCounter.count(text);
        // Apply manual compression with specified parameters
        const compressionRatio = config.compressionRatio || 0.3;
        const qualityThreshold = config.qualityThreshold || 0.8;
        const compressedText = await compressWithAdvanced(text, 'adaptive', compressionRatio, qualityThreshold);
        const compressedTokens = await TokenCounter.count(compressedText);
        const reductionRatio = 1 - compressedTokens / originalTokens;
        const estimatedQuality = this.estimateQuality(text, compressedText);
        const estimatedCost = this.estimateCost(compressedTokens, model);
        return {
            originalText: text,
            optimizedText: compressedText,
            originalTokens,
            optimizedTokens: compressedTokens,
            reductionRatio,
            estimatedQuality,
            estimatedCost,
            processingTime: performance.now() - context.timestamp,
            strategyUsed: 'manual',
            cacheHit: false,
            fallbackUsed: false,
            errors: [],
            warnings: [],
            recommendations: [],
        };
    }
    /**
     * Adaptive optimization with learning
     */
    async optimizeAdaptively(text, model, context, config) {
        const adaptiveResult = await optimizeTokensAdaptively(text, model, {
            strategy: 'adaptive',
            targetReduction: config.compressionRatio,
            qualityThreshold: config.qualityThreshold,
            adaptiveLearning: config.adaptiveLearning,
            realTimeOptimization: config.enableRealTimeOptimization,
        }, context.conversationId);
        return {
            originalText: text,
            optimizedText: adaptiveResult.optimizedText,
            originalTokens: adaptiveResult.originalTokens,
            optimizedTokens: adaptiveResult.optimizedTokens,
            reductionRatio: adaptiveResult.reductionRatio,
            estimatedQuality: adaptiveResult.estimatedQuality,
            estimatedCost: adaptiveResult.estimatedCost,
            processingTime: performance.now() - context.timestamp,
            strategyUsed: 'adaptive',
            cacheHit: false,
            fallbackUsed: false,
            errors: [],
            warnings: [],
            recommendations: adaptiveResult.recommendations,
        };
    }
    /**
     * Budget-aware optimization
     */
    async optimizeWithBudget(text, model, context, config) {
        const originalTokens = await TokenCounter.count(text);
        const budgetTokens = config.budgetTokens;
        const budgetCost = config.budgetCost;
        let targetTokens = originalTokens;
        if (budgetTokens && originalTokens > budgetTokens) {
            targetTokens = budgetTokens;
        }
        else if (budgetCost) {
            const currentCost = this.estimateCost(originalTokens, model);
            if (currentCost > budgetCost) {
                targetTokens = Math.floor((budgetCost / currentCost) * originalTokens);
            }
        }
        const compressionRatio = targetTokens / originalTokens;
        const compressedText = await compressWithAdvanced(text, 'adaptive', compressionRatio, config.qualityThreshold || 0.7 // Lower quality for budget
        );
        const compressedTokens = await TokenCounter.count(compressedText);
        const reductionRatio = 1 - compressedTokens / originalTokens;
        const estimatedQuality = this.estimateQuality(text, compressedText);
        const estimatedCost = this.estimateCost(compressedTokens, model);
        return {
            originalText: text,
            optimizedText: compressedText,
            originalTokens,
            optimizedTokens: compressedTokens,
            reductionRatio,
            estimatedQuality,
            estimatedCost,
            processingTime: performance.now() - context.timestamp,
            strategyUsed: 'budget-aware',
            cacheHit: false,
            fallbackUsed: false,
            errors: [],
            warnings: budgetTokens ? [`Budget enforced: ${budgetTokens} tokens`] : [],
            recommendations: [],
        };
    }
    /**
     * Auto-detect model based on text characteristics
     */
    detectModel(text, context) {
        // Simple model detection based on context and text characteristics
        if (context.domain === 'code')
            return 'gpt-4';
        if (context.complexity === 'high')
            return 'claude-3-opus';
        if (text.length > 10000)
            return 'gpt-4-turbo';
        return context.model || 'gpt-3.5-turbo';
    }
    /**
     * Select optimal compression strategy
     */
    selectCompressionStrategy(text, context) {
        if (context.contextType === 'code')
            return 'structural';
        if (context.complexity === 'high')
            return 'semantic_pruning';
        if (text.length > 5000)
            return 'llmlingua';
        return 'adaptive';
    }
    /**
     * Calculate optimal compression ratio
     */
    calculateOptimalCompressionRatio(text, model, context) {
        let ratio = this.config.compressionRatio || 0.3;
        // Adjust based on model
        if (model.includes('gpt-4'))
            ratio = Math.min(ratio * 1.2, 0.6);
        if (model.includes('claude'))
            ratio = Math.min(ratio * 1.1, 0.5);
        // Adjust based on context
        if (context.contextType === 'code')
            ratio = Math.max(ratio * 0.5, 0.1);
        if (context.complexity === 'high')
            ratio = Math.max(ratio * 0.7, 0.15);
        return ratio;
    }
    /**
     * Estimate quality of compressed text
     */
    estimateQuality(originalText, compressedText) {
        const lengthRatio = compressedText.length / originalText.length;
        const wordRetention = this.calculateWordRetention(originalText, compressedText);
        return Math.min(1, wordRetention * 0.7 + lengthRatio * 0.3);
    }
    /**
     * Calculate word retention
     */
    calculateWordRetention(originalText, compressedText) {
        const originalWords = new Set(originalText.toLowerCase().split(/\s+/));
        const compressedWords = new Set(compressedText.toLowerCase().split(/\s+/));
        const retained = [...originalWords].filter((word) => compressedWords.has(word));
        return retained.length / originalWords.size;
    }
    /**
     * Estimate cost
     */
    estimateCost(tokens, model) {
        const costPer1k = model.includes('gpt-4') ? 0.03 : 0.001;
        return (tokens / 1000) * costPer1k;
    }
    /**
     * Get cached result
     */
    async getCachedResult(text, context) {
        const cacheKey = `middleware_${text.slice(0, 100)}_${context.model}`;
        return this.optimizationCache.get(cacheKey) || null;
    }
    /**
     * Cache result
     */
    async cacheResult(text, context, result) {
        const cacheKey = `middleware_${text.slice(0, 100)}_${context.model}`;
        this.optimizationCache.set(cacheKey, result);
        // Limit cache size
        if (this.optimizationCache.size > 1000) {
            const firstKey = this.optimizationCache.keys().next().value;
            if (firstKey !== undefined) {
                this.optimizationCache.delete(firstKey);
            }
        }
    }
    /**
     * Update metrics
     */
    updateMetrics(result) {
        this.metrics.totalInputTokens += result.originalTokens;
        this.metrics.totalOutputTokens += result.optimizedTokens;
        this.metrics.totalCost += result.estimatedCost;
        this.metrics.averageReduction =
            (this.metrics.averageReduction + (1 - result.reductionRatio)) / 2;
        this.metrics.cacheHitRate =
            this.metrics.cacheHitRate * 0.9 + (result.cacheHit ? 0.1 : 0);
        this.metrics.costSavings +=
            (result.originalTokens - result.optimizedTokens) * 0.001;
    }
    /**
     * Record history
     */
    recordHistory(context, result) {
        const key = context.conversationId || context.userId || 'global';
        const history = this.requestHistory.get(key) || [];
        history.push({
            timestamp: Date.now(),
            context,
            result,
            tokens: result.originalTokens,
        });
        // Keep only recent history
        if (history.length > 100) {
            history.shift();
        }
        this.requestHistory.set(key, history);
    }
    /**
     * Handle optimization errors
     */
    handleOptimizationError(text, error, startTime) {
        console.warn('Token optimization failed:', error);
        if (this.config.enableFallback) {
            return {
                originalText: text,
                optimizedText: text,
                originalTokens: 0,
                optimizedTokens: 0,
                reductionRatio: 0,
                estimatedQuality: 1,
                estimatedCost: 0,
                processingTime: performance.now() - startTime,
                strategyUsed: 'fallback',
                cacheHit: false,
                fallbackUsed: true,
                errors: [error instanceof Error ? error.message : String(error)],
                warnings: ['Optimization failed, using original text'],
                recommendations: ['Check optimization configuration'],
            };
        }
        throw error;
    }
    /**
     * Create passthrough result
     */
    createPassthroughResult(text, startTime) {
        return {
            originalText: text,
            optimizedText: text,
            originalTokens: 0,
            optimizedTokens: 0,
            reductionRatio: 0,
            estimatedQuality: 1,
            estimatedCost: 0,
            processingTime: performance.now() - startTime,
            strategyUsed: 'passthrough',
            cacheHit: false,
            fallbackUsed: false,
            errors: [],
            warnings: ['Optimization disabled'],
            recommendations: [],
        };
    }
    /**
     * Generate recommendations
     */
    generateRecommendations(originalText, compressedText, context) {
        const recommendations = [];
        const originalLength = originalText.length;
        const compressedLength = compressedText.length;
        const compressionRatio = 1 - compressedLength / originalLength;
        if (compressionRatio < 0.2) {
            recommendations.push('Low compression achieved - consider different optimization strategy');
        }
        if (context.contextType === 'code') {
            recommendations.push('Code content detected - ensure syntax integrity after compression');
        }
        return recommendations;
    }
    /**
     * Initialize metrics
     */
    initializeMetrics() {
        return {
            totalInputTokens: 0,
            totalOutputTokens: 0,
            totalCost: 0,
            averageReduction: 0,
            cacheHitRate: 0,
            optimizationRate: 0,
            performanceScore: 0,
            costSavings: 0,
        };
    }
    /**
     * Get metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }
    /**
     * Get history
     */
    getHistory(id) {
        const key = id || 'global';
        return this.requestHistory.get(key) || [];
    }
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    /**
     * Get configuration
     */
    getConfig() {
        return { ...this.config };
    }
}
/**
 * Request interceptor for automatic optimization
 */
export class TokenOptimizationInterceptor {
    middleware;
    enabled;
    constructor(middleware) {
        this.middleware = middleware;
        this.enabled = true;
    }
    /**
     * Intercept and optimize requests
     */
    async interceptRequest(request, options) {
        if (!this.enabled) {
            return {
                optimizedText: request.text,
                metrics: null,
                originalRequest: request,
            };
        }
        const reqContext = request.context || {};
        const context = {
            model: request.model || 'gpt-3.5-turbo',
            conversationId: request.conversationId,
            userId: request.userId,
            timestamp: Date.now(),
            contextType: typeof reqContext.type === 'string' ? reqContext.type : undefined,
            domain: typeof reqContext.domain === 'string' ? reqContext.domain : undefined,
            complexity: reqContext.complexity === 'low' ||
                reqContext.complexity === 'medium' ||
                reqContext.complexity === 'high'
                ? reqContext.complexity
                : undefined,
        };
        const result = await this.middleware.optimize(request.text, context, options);
        return {
            optimizedText: result.optimizedText,
            metrics: result,
            originalRequest: request,
        };
    }
    /**
     * Enable/disable interceptor
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
}
/**
 * API wrapper for seamless integration
 */
export class TokenOptimizedAPI {
    interceptor;
    constructor(middleware) {
        this.interceptor = new TokenOptimizationInterceptor(middleware);
    }
    /**
     * Create API request with automatic optimization
     */
    async createRequest(endpoint, payload, options) {
        // Extract text content from payload
        const text = this.extractTextFromPayload(payload);
        if (text) {
            const payloadObj = typeof payload === 'string' ? {} : payload;
            const intercepted = await this.interceptor.interceptRequest({
                text,
                model: payloadObj.model,
                conversationId: payloadObj.conversationId,
                userId: payloadObj.userId,
                context: payloadObj.context,
            }, options);
            // Replace text in payload with optimized version
            const optimizedPayload = this.replaceTextInPayload(payload, intercepted.optimizedText);
            if (typeof optimizedPayload === 'string') {
                return optimizedPayload;
            }
            return {
                ...optimizedPayload,
                _optimization: intercepted.metrics,
            };
        }
        return payload;
    }
    /**
     * Extract text from various payload formats
     */
    extractTextFromPayload(payload) {
        if (typeof payload === 'string')
            return payload;
        if (payload.text)
            return payload.text;
        if (payload.prompt)
            return payload.prompt;
        if (payload.messages) {
            return payload.messages.map((m) => m.content).join(' ');
        }
        return '';
    }
    /**
     * Replace text in payload
     */
    replaceTextInPayload(payload, newText) {
        if (typeof payload === 'string')
            return newText;
        if (payload.text)
            return { ...payload, text: newText };
        if (payload.prompt)
            return { ...payload, prompt: newText };
        return payload;
    }
}
// Export singleton instances
export const tokenMiddleware = new TokenOptimizationMiddleware({
    mode: 'automatic',
    target: 'both',
    priority: 'balanced',
    enabled: true,
    autoDetectModel: true,
    enableCaching: true,
    enableAnalytics: true,
    enableRealTimeOptimization: true,
    enableFallback: true,
    maxRetries: 3,
    timeout: 5000,
    qualityThreshold: 0.8,
    compressionRatio: 0.3,
    preserveContext: true,
    adaptiveLearning: true,
});
export const tokenInterceptor = new TokenOptimizationInterceptor(tokenMiddleware);
export const tokenOptimizedAPI = new TokenOptimizedAPI(tokenMiddleware);
// Convenience functions
export async function optimizeTokens(text, model = 'gpt-3.5-turbo', options) {
    const context = {
        model,
        timestamp: Date.now(),
    };
    const result = await tokenMiddleware.optimize(text, context, options);
    return result.optimizedText;
}
export function getOptimizationMetrics() {
    return tokenMiddleware.getMetrics();
}
export function getOptimizationHistory(id) {
    return tokenMiddleware.getHistory(id);
}
export function configureMiddleware(config) {
    tokenMiddleware.updateConfig(config);
}
//# sourceMappingURL=optimization-middleware.js.map