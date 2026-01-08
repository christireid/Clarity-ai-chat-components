/**
 * Dynamic Token Optimization Based on Model and Context
 *
 * This module implements adaptive optimization strategies that adjust based on:
 * - Model-specific token efficiency patterns
 * - Context window limitations and costs
 * - Real-time performance metrics
 * - Content complexity analysis
 * - Historical optimization data
 */
import { TokenCounter } from '@clarity-chat/token-optimization';
// Dynamic optimizer that adapts based on model and context
export class DynamicOptimizer {
    historicalData;
    modelRegistry;
    constructor() {
        this.historicalData = [];
        this.modelRegistry = new Map();
        this.initializeModelRegistry();
    }
    /**
     * Initialize model registry with known models
     */
    initializeModelRegistry() {
        const models = [
            // OpenAI Models
            {
                family: 'openai',
                modelName: 'gpt-4',
                maxContextWindow: 8192,
                inputTokenCost: 0.03,
                outputTokenCost: 0.06,
                efficiencyRating: 0.95,
                contextDegradation: 0.15,
            },
            {
                family: 'openai',
                modelName: 'gpt-4o',
                maxContextWindow: 128000,
                inputTokenCost: 0.005,
                outputTokenCost: 0.015,
                efficiencyRating: 0.98,
                contextDegradation: 0.1,
            },
            {
                family: 'openai',
                modelName: 'gpt-3.5-turbo',
                maxContextWindow: 16384,
                inputTokenCost: 0.0005,
                outputTokenCost: 0.0015,
                efficiencyRating: 0.85,
                contextDegradation: 0.25,
            },
            {
                family: 'openai',
                modelName: 'o1',
                maxContextWindow: 200000,
                inputTokenCost: 0.015,
                outputTokenCost: 0.06,
                efficiencyRating: 0.92,
                contextDegradation: 0.08,
            },
            // Anthropic Models
            {
                family: 'anthropic',
                modelName: 'claude-3-opus',
                maxContextWindow: 200000,
                inputTokenCost: 0.015,
                outputTokenCost: 0.075,
                efficiencyRating: 0.96,
                contextDegradation: 0.12,
            },
            {
                family: 'anthropic',
                modelName: 'claude-3.5-sonnet',
                maxContextWindow: 200000,
                inputTokenCost: 0.003,
                outputTokenCost: 0.015,
                efficiencyRating: 0.97,
                contextDegradation: 0.1,
            },
            {
                family: 'anthropic',
                modelName: 'claude-3-haiku',
                maxContextWindow: 200000,
                inputTokenCost: 0.00025,
                outputTokenCost: 0.00125,
                efficiencyRating: 0.9,
                contextDegradation: 0.18,
            },
            // Google Models
            {
                family: 'google',
                modelName: 'gemini-pro',
                maxContextWindow: 1000000,
                inputTokenCost: 0.0005,
                outputTokenCost: 0.0015,
                efficiencyRating: 0.93,
                contextDegradation: 0.2,
            },
            {
                family: 'google',
                modelName: 'gemini-1.5-pro',
                maxContextWindow: 2000000,
                inputTokenCost: 0.00125,
                outputTokenCost: 0.005,
                efficiencyRating: 0.95,
                contextDegradation: 0.15,
            },
            // Meta Models
            {
                family: 'meta',
                modelName: 'llama-3-70b',
                maxContextWindow: 8192,
                inputTokenCost: 0.0009,
                outputTokenCost: 0.0009,
                efficiencyRating: 0.88,
                contextDegradation: 0.22,
            },
            {
                family: 'meta',
                modelName: 'llama-3-8b',
                maxContextWindow: 8192,
                inputTokenCost: 0.0002,
                outputTokenCost: 0.0002,
                efficiencyRating: 0.82,
                contextDegradation: 0.28,
            },
        ];
        models.forEach((model) => {
            this.modelRegistry.set(model.modelName, model);
        });
    }
    /**
     * Optimize text dynamically based on model and content context
     */
    async optimize(text, modelName, contentContext, config = {}) {
        const startTime = Date.now();
        const modelContext = this.modelRegistry.get(modelName);
        if (!modelContext) {
            throw new Error(`Unknown model: ${modelName}`);
        }
        // Analyze current context
        const analysis = await this.analyzeContext(text, modelContext, contentContext);
        // Select optimal strategy
        const strategy = this.selectOptimalStrategy(modelContext, contentContext, analysis, config);
        // Apply optimization
        const optimizedText = await this.applyOptimization(text, strategy, config, modelContext, contentContext);
        // Calculate results
        const originalTokens = await TokenCounter.count(text);
        const optimizedTokens = await TokenCounter.count(optimizedText);
        const compressionRatio = optimizedTokens / originalTokens;
        const costSavings = this.calculateCostSavings(originalTokens, optimizedTokens, modelContext);
        const estimatedQuality = this.estimateQuality(compressionRatio, strategy, modelContext, contentContext);
        // Generate recommendations
        const recommendations = this.generateRecommendations(analysis, strategy, modelContext, contentContext);
        // Record historical data
        if (config.historical !== false) {
            this.recordHistoricalData({
                timestamp: Date.now(),
                model: modelContext,
                content: contentContext,
                originalTokens,
                optimizedTokens,
                qualityScore: estimatedQuality,
                performanceMetrics: {
                    latency: Date.now() - startTime,
                    accuracy: estimatedQuality,
                    userSatisfaction: 0, // Will be updated with feedback
                },
            });
        }
        return {
            optimizedText,
            originalTokens,
            optimizedTokens,
            compressionRatio,
            estimatedQuality,
            strategyUsed: strategy,
            modelUsed: modelName,
            costSavings,
            processingTime: Date.now() - startTime,
            recommendations,
        };
    }
    /**
     * Analyze content and context
     */
    async analyzeContext(text, modelContext, contentContext) {
        const tokens = await TokenCounter.count(text);
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).length;
        return {
            tokens,
            words,
            sentences,
            avgWordsPerSentence: words / sentences,
            complexity: this.calculateComplexity(text, contentContext),
            tokenDensity: tokens / words,
            contextUtilization: tokens / modelContext.maxContextWindow,
            estimatedCost: this.estimateCost(tokens, modelContext),
        };
    }
    /**
     * Select optimal optimization strategy
     */
    selectOptimalStrategy(modelContext, contentContext, analysis, config) {
        // Use historical data if available
        if (config.historical !== false && this.historicalData.length > 0) {
            const similarCase = this.findSimilarHistoricalCase(modelContext, contentContext, analysis);
            if (similarCase) {
                return this.strategyFromHistoricalData(similarCase);
            }
        }
        // Rule-based strategy selection
        return this.selectStrategyByRules(modelContext, contentContext, analysis, config);
    }
    /**
     * Apply optimization based on selected strategy
     */
    async applyOptimization(text, strategy, config, modelContext, contentContext) {
        switch (strategy) {
            case 'aggressive':
                return this.applyAggressiveOptimization(text, config, contentContext);
            case 'moderate':
                return this.applyModerateOptimization(text, config, contentContext);
            case 'conservative':
                return this.applyConservativeOptimization(text, config, contentContext);
            case 'budget-aware':
                return this.applyBudgetAwareOptimization(text, config, contentContext);
            case 'quality-first':
                return this.applyQualityFirstOptimization(text, config, contentContext);
            default:
                return this.applyAdaptiveOptimization(text, config, modelContext, contentContext);
        }
    }
    /**
     * Aggressive optimization for maximum token reduction
     */
    async applyAggressiveOptimization(text, config, contentContext) {
        // Multi-stage compression
        let optimized = text;
        // Remove redundant content
        optimized = await this.removeRedundantContent(optimized);
        // Aggressive compression
        optimized = await this.compressTextAggressively(optimized, contentContext);
        // Smart truncation
        const targetRatio = config.targetReduction || 0.2; // 80% reduction
        const maxTokens = Math.floor((await TokenCounter.count(text)) * targetRatio);
        // Use extractive summarization for aggressive reduction
        const { truncateText } = await import('./smart-truncation');
        optimized = await truncateText(optimized, maxTokens, 'extractive');
        return optimized;
    }
    /**
     * Moderate optimization for balanced reduction
     */
    async applyModerateOptimization(text, config, contentContext) {
        const targetRatio = config.targetReduction || 0.5; // 50% reduction
        const maxTokens = Math.floor((await TokenCounter.count(text)) * targetRatio);
        // Use semantic compression for moderate reduction
        const { compressText } = await import('./text-compression');
        const result = await compressText(text, {
            strategy: 'semantic',
            targetRatio,
            preserveKeyTerms: contentContext.keyTerms,
            qualityThreshold: config.qualityThreshold || 0.8,
        });
        return result.compressedText;
    }
    /**
     * Conservative optimization for minimal impact
     */
    async applyConservativeOptimization(text, config, contentContext) {
        // Lossless compression first
        const { compressText } = await import('./text-compression');
        const losslessResult = await compressText(text, {
            strategy: 'lossless',
            preserveKeyTerms: contentContext.keyTerms,
        });
        // If still over budget, apply gentle semantic compression
        if (config.budgetTokens &&
            losslessResult.compressedTokens > config.budgetTokens) {
            const semanticResult = await compressText(losslessResult.compressedText, {
                strategy: 'semantic',
                budgetTokens: config.budgetTokens,
                preserveKeyTerms: contentContext.keyTerms,
                qualityThreshold: config.qualityThreshold || 0.9,
            });
            return semanticResult.compressedText;
        }
        return losslessResult.compressedText;
    }
    /**
     * Budget-aware optimization with strict limits
     */
    async applyBudgetAwareOptimization(text, config, contentContext) {
        if (!config.budgetTokens) {
            return text;
        }
        // Use budget-controlled compression
        const { compressText } = await import('./text-compression');
        const result = await compressText(text, {
            strategy: 'budget-controlled',
            budgetTokens: config.budgetTokens,
            preserveKeyTerms: contentContext.keyTerms,
            preserveStructure: config.preserveStructure,
            qualityThreshold: config.qualityThreshold || 0.7,
        });
        return result.compressedText;
    }
    /**
     * Quality-first optimization prioritizing content quality
     */
    async applyQualityFirstOptimization(text, config, contentContext) {
        // Start with conservative approach
        let optimized = await this.applyConservativeOptimization(text, config, contentContext);
        // If still over budget, apply gentle semantic compression
        const currentTokens = await TokenCounter.count(optimized);
        const targetTokens = config.budgetTokens || Math.floor((await TokenCounter.count(text)) * 0.8);
        if (currentTokens > targetTokens) {
            const { compressText } = await import('./text-compression');
            const result = await compressText(optimized, {
                strategy: 'semantic',
                budgetTokens: targetTokens,
                preserveKeyTerms: contentContext.keyTerms,
                qualityThreshold: config.qualityThreshold || 0.95,
            });
            optimized = result.compressedText;
        }
        return optimized;
    }
    /**
     * Adaptive optimization using machine learning
     */
    async applyAdaptiveOptimization(text, config, modelContext, contentContext) {
        // Use historical data to adapt strategy
        const similarCases = this.findSimilarHistoricalCases(modelContext, contentContext);
        if (similarCases.length > 0) {
            // Learn from similar cases
            const bestStrategy = this.learnBestStrategy(similarCases);
            return this.applyStrategyByName(text, bestStrategy, config, contentContext);
        }
        // Fallback to moderate optimization
        return this.applyModerateOptimization(text, config, contentContext);
    }
    /**
     * Calculate content complexity
     */
    calculateComplexity(text, contentContext) {
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).length;
        const avgWordsPerSentence = words / sentences;
        // Base complexity on sentence length
        let complexity = Math.min(avgWordsPerSentence / 25, 1.0);
        // Adjust for content type
        switch (contentContext.type) {
            case 'technical':
                complexity *= 1.2;
                break;
            case 'academic':
                complexity *= 1.3;
                break;
            case 'creative':
                complexity *= 0.9;
                break;
            default:
                complexity *= 1.0;
        }
        return Math.min(complexity, 1.0);
    }
    /**
     * Estimate cost for given token count
     */
    estimateCost(tokens, modelContext) {
        return (tokens / 1000) * modelContext.inputTokenCost;
    }
    /**
     * Calculate cost savings
     */
    calculateCostSavings(originalTokens, optimizedTokens, modelContext) {
        const originalCost = this.estimateCost(originalTokens, modelContext);
        const optimizedCost = this.estimateCost(optimizedTokens, modelContext);
        return originalCost - optimizedCost;
    }
    /**
     * Estimate quality retention
     */
    estimateQuality(compressionRatio, strategy, modelContext, contentContext) {
        // Base quality calculation
        let quality = 1 - compressionRatio * 0.3;
        // Adjust for strategy
        switch (strategy) {
            case 'aggressive':
                quality *= 0.7;
                break;
            case 'moderate':
                quality *= 0.85;
                break;
            case 'conservative':
                quality *= 0.95;
                break;
            case 'quality-first':
                quality *= 0.98;
                break;
            default:
                quality *= 0.9;
        }
        return Math.max(quality, 0.3);
    }
    /**
     * Find similar historical cases
     */
    findSimilarHistoricalCases(modelContext, contentContext, analysis) {
        return this.historicalData.filter((data) => data.model.family === modelContext.family &&
            data.content.type === contentContext.type &&
            Math.abs(data.content.complexity - contentContext.complexity) < 0.2);
    }
    /**
     * Select strategy based on rules
     */
    selectStrategyByRules(modelContext, contentContext, analysis, config) {
        // Budget-constrained scenarios
        if (config.budgetTokens && analysis.tokens > config.budgetTokens * 1.5) {
            return 'budget-aware';
        }
        // High-complexity content
        if (contentContext.complexity > 0.8) {
            return 'quality-first';
        }
        // Large context windows with expensive models
        if (modelContext.maxContextWindow > 100000 &&
            modelContext.inputTokenCost > 0.01) {
            return 'moderate';
        }
        // Default strategy
        return config.strategy || 'adaptive';
    }
    /**
     * Record historical data for learning
     */
    recordHistoricalData(data) {
        this.historicalData.push(data);
        // Keep only recent data (last 1000 entries)
        if (this.historicalData.length > 1000) {
            this.historicalData = this.historicalData.slice(-1000);
        }
    }
    /**
     * Generate optimization recommendations
     */
    generateRecommendations(analysis, strategy, modelContext, contentContext) {
        const recommendations = [];
        if (analysis.contextUtilization > 0.8) {
            recommendations.push('Consider using models with larger context windows');
        }
        if (contentContext.complexity > 0.7) {
            recommendations.push('High complexity content - consider quality-first approach');
        }
        if (modelContext.contextDegradation > 0.2) {
            recommendations.push('Model shows significant context degradation - consider shorter inputs');
        }
        return recommendations;
    }
    // Helper methods for specific optimization techniques
    async removeRedundantContent(text) {
        // Remove duplicate sentences, redundant phrases, etc.
        const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
        const uniqueSentences = Array.from(new Set(sentences.map((s) => s.trim())));
        return uniqueSentences.join('. ');
    }
    async compressTextAggressively(text, contentContext) {
        // Apply aggressive text compression
        const { compressText } = await import('./text-compression');
        const result = await compressText(text, {
            strategy: 'semantic',
            targetRatio: 0.3, // 70% reduction
            preserveKeyTerms: contentContext.keyTerms,
        });
        return result.compressedText;
    }
    findSimilarHistoricalCase(modelContext, contentContext, analysis) {
        // Find most similar historical case
        const similarCases = this.findSimilarHistoricalCases(modelContext, contentContext, analysis);
        return similarCases.sort((a, b) => b.qualityScore - a.qualityScore)[0];
    }
    strategyFromHistoricalData(data) {
        // Derive strategy from historical performance
        if (data.qualityScore > 0.9) {
            return 'quality-first';
        }
        else if (data.qualityScore > 0.8) {
            return 'moderate';
        }
        else {
            return 'conservative';
        }
    }
    learnBestStrategy(cases) {
        // Simple learning from historical data
        const strategyPerformance = new Map();
        cases.forEach((data) => {
            const strategy = this.strategyFromHistoricalData(data);
            const performance = strategyPerformance.get(strategy) || [];
            performance.push(data.qualityScore);
            strategyPerformance.set(strategy, performance);
        });
        // Find best performing strategy
        let bestStrategy = 'moderate';
        let bestAverageScore = 0;
        strategyPerformance.forEach((scores, strategy) => {
            const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
            if (averageScore > bestAverageScore) {
                bestAverageScore = averageScore;
                bestStrategy = strategy;
            }
        });
        return bestStrategy;
    }
    applyStrategyByName(text, strategyName, config, contentContext) {
        switch (strategyName) {
            case 'aggressive':
                return this.applyAggressiveOptimization(text, config, contentContext);
            case 'moderate':
                return this.applyModerateOptimization(text, config, contentContext);
            case 'conservative':
                return this.applyConservativeOptimization(text, config, contentContext);
            default:
                return this.applyModerateOptimization(text, config, contentContext);
        }
    }
}
// Convenience functions for dynamic optimization
export async function optimizeForModel(text, modelName, contentType = 'general', config) {
    const optimizer = new DynamicOptimizer();
    const contentContext = {
        type: contentType,
        complexity: 0.5,
        language: 'en',
        domain: 'general',
        structure: 'mixed',
        entities: [],
        keyTerms: [],
    };
    return optimizer.optimize(text, modelName, contentContext, config);
}
export async function optimizeForBudget(text, maxTokens, modelName, contentType = 'general') {
    const config = {
        strategy: 'budget-aware',
        budgetTokens: maxTokens,
        qualityThreshold: 0.7,
    };
    return optimizeForModel(text, modelName, contentType, config);
}
export async function optimizeForCost(text, targetCost, modelName, contentType = 'general') {
    const optimizer = new DynamicOptimizer();
    const modelContext = optimizer['modelRegistry'].get(modelName);
    if (!modelContext) {
        throw new Error(`Unknown model: ${modelName}`);
    }
    const tokens = await TokenCounter.count(text);
    const currentCost = (tokens / 1000) * modelContext.inputTokenCost;
    const targetRatio = targetCost / currentCost;
    const config = {
        strategy: 'moderate',
        targetReduction: 1 - targetRatio,
        qualityThreshold: 0.8,
    };
    return optimizeForModel(text, modelName, contentType, config);
}
//# sourceMappingURL=dynamic-optimization.js.map