/**
 * Adaptive Token Usage Strategies Based on Context and Model
 *
 * This module implements intelligent token optimization that adapts based on:
 * - Model-specific token efficiency patterns
 * - Content complexity and domain
 * - Conversation context and history
 * - Real-time performance feedback
 * - Cost-performance trade-offs
 * - User preferences and constraints
 *
 * @module
 */
import { TokenCounter } from '@clarity-chat/token-optimization';
import { AdvancedCompressionOrchestrator, compressWithAdvanced, } from './advanced-compression';
// Model efficiency profiles based on research data
const MODEL_EFFICIENCY_PROFILES = {
    'gpt-4': {
        family: 'openai',
        model: 'gpt-4',
        inputEfficiency: 0.85,
        outputEfficiency: 0.8,
        contextEfficiency: 0.75,
        reasoningEfficiency: 0.9,
        costPerInputToken: 0.03,
        costPerOutputToken: 0.06,
        maxContextWindow: 8192,
        optimalContextSize: 6000,
        compressionEfficiency: 0.85,
    },
    'gpt-4-turbo': {
        family: 'openai',
        model: 'gpt-4-turbo',
        inputEfficiency: 0.9,
        outputEfficiency: 0.85,
        contextEfficiency: 0.85,
        reasoningEfficiency: 0.92,
        costPerInputToken: 0.01,
        costPerOutputToken: 0.03,
        maxContextWindow: 128000,
        optimalContextSize: 100000,
        compressionEfficiency: 0.9,
    },
    'claude-3-opus': {
        family: 'anthropic',
        model: 'claude-3-opus',
        inputEfficiency: 0.88,
        outputEfficiency: 0.82,
        contextEfficiency: 0.88,
        reasoningEfficiency: 0.95,
        costPerInputToken: 0.015,
        costPerOutputToken: 0.075,
        maxContextWindow: 200000,
        optimalContextSize: 150000,
        compressionEfficiency: 0.88,
    },
    'claude-3-sonnet': {
        family: 'anthropic',
        model: 'claude-3-sonnet',
        inputEfficiency: 0.85,
        outputEfficiency: 0.8,
        contextEfficiency: 0.85,
        reasoningEfficiency: 0.88,
        costPerInputToken: 0.003,
        costPerOutputToken: 0.015,
        maxContextWindow: 200000,
        optimalContextSize: 150000,
        compressionEfficiency: 0.85,
    },
    'gemini-pro': {
        family: 'google',
        model: 'gemini-pro',
        inputEfficiency: 0.82,
        outputEfficiency: 0.78,
        contextEfficiency: 0.8,
        reasoningEfficiency: 0.85,
        costPerInputToken: 0.0005,
        costPerOutputToken: 0.0015,
        maxContextWindow: 1000000,
        optimalContextSize: 500000,
        compressionEfficiency: 0.8,
    },
};
/**
 * Adaptive Token Optimizer that learns from context and performance
 */
export class AdaptiveTokenOptimizer {
    tokenCounter;
    compressionOrchestrator;
    performanceHistory;
    contextProfiles;
    conversationStates;
    learningRate;
    constructor(learningRate = 0.01) {
        this.tokenCounter = new TokenCounter();
        this.compressionOrchestrator = new AdvancedCompressionOrchestrator();
        this.performanceHistory = new Map();
        this.contextProfiles = new Map();
        this.conversationStates = new Map();
        this.learningRate = learningRate;
    }
    /**
     * Optimize tokens adaptively based on context and model
     */
    async optimizeTokensAdaptively(text, model, config, conversationId) {
        const startTime = performance.now();
        // Analyze context and content
        const contextProfile = await this.analyzeContext(text);
        const modelProfile = MODEL_EFFICIENCY_PROFILES[model] || this.createDefaultModelProfile(model);
        const conversationState = conversationId
            ? this.conversationStates.get(conversationId)
            : undefined;
        // Generate adaptive optimization strategy
        const strategy = this.generateAdaptiveStrategy(contextProfile, modelProfile, config, conversationState);
        // Apply optimization
        const optimizedResult = await this.applyAdaptiveOptimization(text, strategy, modelProfile, config);
        const processingTime = performance.now() - startTime;
        // Calculate metrics
        const metrics = await this.calculateOptimizationMetrics(text, optimizedResult.compressedText, modelProfile, processingTime);
        // Update learning if enabled
        if (config.adaptiveLearning) {
            this.updateLearning(contextProfile, modelProfile, metrics, strategy);
        }
        // Generate recommendations
        const recommendations = await this.generateRecommendations(contextProfile, modelProfile, metrics, strategy);
        return {
            optimizedText: optimizedResult.compressedText,
            originalTokens: await TokenCounter.count(text),
            optimizedTokens: optimizedResult.compressedTokens,
            reductionRatio: optimizedResult.compressionRatio,
            estimatedQuality: optimizedResult.estimatedQuality,
            estimatedCost: metrics.estimatedCost,
            estimatedLatency: metrics.estimatedLatency,
            strategyUsed: strategy.name,
            confidence: strategy.confidence,
            recommendations,
            alternativeStrategies: await this.generateAlternativeStrategies(text, contextProfile, modelProfile, config),
        };
    }
    /**
     * Analyze content and create context profile
     */
    async analyzeContext(text) {
        const words = text.split(/\s+/).length;
        const characters = text.length;
        const tokenDensity = (await TokenCounter.count(text)) / Math.max(characters, 1);
        const domain = this.detectDomain(text);
        const complexity = this.assessComplexity(text);
        const language = this.detectLanguage(text);
        const hasCode = this.containsCode(text);
        const hasStructuredData = this.containsStructuredData(text);
        const hasMultilingual = this.containsMultipleLanguages(text);
        const hasTechnicalTerms = this.containsTechnicalTerms(text);
        return {
            type: this.categorizeContextType(text),
            domain,
            complexity,
            language,
            hasCode,
            hasStructuredData,
            hasMultilingual,
            hasTechnicalTerms,
            estimatedTokenDensity: tokenDensity,
        };
    }
    /**
     * Generate adaptive optimization strategy
     */
    generateAdaptiveStrategy(contextProfile, modelProfile, config, conversationState) {
        let strategyName = 'adaptive';
        let compressionRatio = config.targetReduction || 0.3;
        let qualityThreshold = config.qualityThreshold || 0.8;
        let compressionStrategy = 'llmlingua';
        let confidence = 0.7;
        // Adjust based on model efficiency
        if (modelProfile.compressionEfficiency > 0.85) {
            compressionRatio = Math.min(compressionRatio * 1.2, 0.6);
            confidence += 0.1;
        }
        else if (modelProfile.compressionEfficiency < 0.7) {
            compressionRatio = Math.max(compressionRatio * 0.7, 0.1);
            confidence -= 0.1;
        }
        // Adjust based on context complexity
        switch (contextProfile.complexity) {
            case 'low':
                compressionRatio = Math.min(compressionRatio * 1.3, 0.7);
                qualityThreshold = Math.max(qualityThreshold - 0.1, 0.7);
                compressionStrategy = 'llmlingua';
                confidence += 0.15;
                break;
            case 'medium':
                // Keep default compressionRatio for medium complexity
                compressionStrategy = 'selective_context';
                confidence += 0.1;
                break;
            case 'high':
                compressionRatio = Math.max(compressionRatio * 0.7, 0.15);
                qualityThreshold = Math.min(qualityThreshold + 0.1, 0.95);
                compressionStrategy = 'semantic_pruning';
                confidence -= 0.1;
                break;
        }
        // Adjust based on content type
        if (contextProfile.hasCode) {
            compressionRatio = Math.max(compressionRatio * 0.6, 0.1);
            compressionStrategy = 'structural';
            confidence -= 0.15;
        }
        else if (contextProfile.hasTechnicalTerms) {
            qualityThreshold = Math.min(qualityThreshold + 0.05, 0.9);
            confidence -= 0.05;
        }
        // Adjust based on conversation state
        if (conversationState) {
            if (conversationState.contextWindowUsage > 0.8) {
                compressionRatio = Math.min(compressionRatio * 1.2, 0.6);
                qualityThreshold = Math.max(qualityThreshold - 0.05, 0.75);
                confidence += 0.1;
            }
            if (conversationState.historicalCompression.qualityRetention > 0.9) {
                compressionRatio = Math.min(compressionRatio * 1.1, 0.5);
                confidence += 0.1;
            }
        }
        // Adjust based on strategy
        switch (config.strategy) {
            case 'conservative':
                compressionRatio = Math.max(compressionRatio * 0.6, 0.1);
                qualityThreshold = Math.min(qualityThreshold + 0.1, 0.95);
                confidence += 0.1;
                break;
            case 'aggressive':
                compressionRatio = Math.min(compressionRatio * 1.4, 0.8);
                qualityThreshold = Math.max(qualityThreshold - 0.15, 0.65);
                confidence -= 0.1;
                break;
            case 'moderate':
                // Keep current settings
                break;
        }
        return {
            name: strategyName,
            compressionRatio,
            qualityThreshold,
            compressionStrategy,
            confidence,
        };
    }
    /**
     * Apply adaptive optimization
     */
    async applyAdaptiveOptimization(text, strategy, modelProfile, config) {
        const compressionConfig = {
            strategy: strategy.compressionStrategy,
            compressionRatio: strategy.compressionRatio,
            qualityThreshold: strategy.qualityThreshold,
            preserveCode: true,
            adaptive: true,
        };
        return await compressWithAdvanced(text, strategy.compressionStrategy, compressionConfig.compressionRatio, compressionConfig.qualityThreshold).then((compressedText) => ({
            compressedText,
            compressedTokens: 0, // Will be calculated later
        }));
    }
    /**
     * Calculate optimization metrics
     */
    async calculateOptimizationMetrics(originalText, optimizedText, modelProfile, processingTime) {
        const originalTokens = await TokenCounter.count(originalText);
        const optimizedTokens = await TokenCounter.count(optimizedText);
        const inputCost = (originalTokens / 1000) * modelProfile.costPerInputToken;
        const optimizedInputCost = (optimizedTokens / 1000) * modelProfile.costPerInputToken;
        const costSavings = inputCost - optimizedInputCost;
        // Estimate latency based on token count and model characteristics
        const baseLatency = modelProfile.contextEfficiency * 100; // ms per 1K tokens
        const estimatedLatency = (optimizedTokens / 1000) * baseLatency;
        // Calculate performance score
        const compressionEfficiency = 1 - optimizedTokens / originalTokens;
        const qualityScore = modelProfile.compressionEfficiency;
        const performanceScore = compressionEfficiency * 0.6 + qualityScore * 0.4;
        return {
            estimatedCost: optimizedInputCost,
            estimatedLatency,
            costSavings,
            performanceScore,
        };
    }
    /**
     * Update learning based on results
     */
    updateLearning(contextProfile, modelProfile, metrics, strategy) {
        const learningKey = `${contextProfile.domain}-${modelProfile.family}`;
        const history = this.performanceHistory.get(learningKey) || [];
        history.push({
            timestamp: Date.now(),
            contextProfile,
            modelProfile,
            metrics,
            strategy,
            success: metrics.performanceScore > 0.7,
        });
        // Keep only recent history
        if (history.length > 50) {
            history.shift();
        }
        this.performanceHistory.set(learningKey, history);
        // Update learning rate based on success rate
        const successRate = history.filter((h) => h.success).length / history.length;
        this.learningRate = Math.max(0.001, Math.min(0.1, this.learningRate * (successRate > 0.7 ? 1.01 : 0.99)));
    }
    /**
     * Generate recommendations
     */
    async generateRecommendations(contextProfile, modelProfile, metrics, strategy) {
        const recommendations = [];
        if (metrics.estimatedCost > 0.1) {
            recommendations.push('Consider using a more cost-effective model for this type of content');
        }
        if (contextProfile.hasCode && strategy.compressionRatio > 0.4) {
            recommendations.push('Code content detected - consider using structural compression');
        }
        if (contextProfile.complexity === 'high' && strategy.confidence < 0.7) {
            recommendations.push('High complexity content - consider manual review of compressed output');
        }
        if (modelProfile.compressionEfficiency < 0.8) {
            recommendations.push('This model has lower compression efficiency - consider switching models');
        }
        return recommendations;
    }
    /**
     * Generate alternative strategies
     */
    async generateAlternativeStrategies(text, contextProfile, modelProfile, config) {
        const strategies = [
            { name: 'conservative', compressionRatio: 0.2, qualityThreshold: 0.9 },
            { name: 'moderate', compressionRatio: 0.4, qualityThreshold: 0.8 },
            { name: 'aggressive', compressionRatio: 0.6, qualityThreshold: 0.7 },
        ];
        const alternatives = await Promise.all(strategies.map(async (strategy) => {
            const compressedText = await compressWithAdvanced(text, 'adaptive', strategy.compressionRatio, strategy.qualityThreshold);
            const tokens = await TokenCounter.count(compressedText);
            const cost = (tokens / 1000) * modelProfile.costPerInputToken;
            return {
                strategy: strategy.name,
                tokens,
                quality: strategy.qualityThreshold,
                cost,
            };
        }));
        return alternatives;
    }
    // Helper methods
    createDefaultModelProfile(model) {
        return {
            family: 'unknown',
            model,
            inputEfficiency: 0.8,
            outputEfficiency: 0.75,
            contextEfficiency: 0.7,
            reasoningEfficiency: 0.8,
            costPerInputToken: 0.01,
            costPerOutputToken: 0.03,
            maxContextWindow: 8000,
            optimalContextSize: 6000,
            compressionEfficiency: 0.8,
        };
    }
    detectDomain(text) {
        if (/\b(function|class|import|export|const|let|var)\b/.test(text))
            return 'programming';
        if (/\b(medical|health|patient|diagnosis|treatment)\b/.test(text))
            return 'medical';
        if (/\b(legal|law|court|contract|regulation)\b/.test(text))
            return 'legal';
        if (/\b(financial|investment|market|trading|economy)\b/.test(text))
            return 'financial';
        return 'general';
    }
    assessComplexity(text) {
        const sentences = text.split(/[.!?]+/).length;
        const avgWordsPerSentence = text.split(/\s+/).length / Math.max(sentences, 1);
        const technicalTerms = (text.match(/\b(algorithm|methodology|framework|architecture)\b/g) || []).length;
        if (avgWordsPerSentence > 20 || technicalTerms > 3)
            return 'high';
        if (avgWordsPerSentence > 12 || technicalTerms > 1)
            return 'medium';
        return 'low';
    }
    detectLanguage(text) {
        if (/[\u4e00-\u9fff]/.test(text))
            return 'chinese';
        if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text))
            return 'japanese';
        if (/[\uac00-\ud7af]/.test(text))
            return 'korean';
        if (/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/.test(text))
            return 'european';
        return 'english';
    }
    containsCode(text) {
        return (/\b(function|class|import|export|const|let|var|def|class)\b/.test(text) ||
            /[<>{}()[\];]/.test(text));
    }
    containsStructuredData(text) {
        return /\{.*\}/.test(text) || /\[.*\]/.test(text) || /<.*>/.test(text);
    }
    containsMultipleLanguages(text) {
        const languages = [
            /[a-z]/i,
            /[\u4e00-\u9fff]/,
            /[\u3040-\u309f\u30a0-\u30ff]/,
            /[\uac00-\ud7af]/,
        ];
        const detected = languages.filter((lang) => lang.test(text)).length;
        return detected > 1;
    }
    containsTechnicalTerms(text) {
        return /\b(algorithm|methodology|framework|architecture|protocol|standard)\b/.test(text);
    }
    categorizeContextType(text) {
        if (this.containsCode(text))
            return 'code';
        if (this.containsStructuredData(text))
            return 'structured';
        if (this.containsTechnicalTerms(text))
            return 'technical';
        if (this.containsMultipleLanguages(text))
            return 'multilingual';
        return 'conversation';
    }
    // Public methods for conversation management
    updateConversationState(conversationId, update) {
        const currentState = this.conversationStates.get(conversationId) || {
            turnCount: 0,
            averageTokensPerTurn: 0,
            contextWindowUsage: 0,
            repetitionPatterns: [],
            topicDrift: 0,
            userFeedback: { quality: 0, relevance: 0, satisfaction: 0 },
            historicalCompression: {
                averageRatio: 0,
                qualityRetention: 0,
                userAcceptance: 0,
            },
        };
        const updatedState = { ...currentState, ...update };
        this.conversationStates.set(conversationId, updatedState);
    }
    getPerformanceAnalytics(model, domain) {
        const key = model || domain || 'global';
        const history = this.performanceHistory.get(key);
        if (!history || history.length === 0) {
            return {
                totalOptimizations: 0,
                averageReduction: 0,
                averageQuality: 0,
                learningRate: this.learningRate,
            };
        }
        const totalOptimizations = history.length;
        const averageReduction = history.reduce((sum, h) => sum + (1 - h.metrics.compressionEfficiency), 0) / totalOptimizations;
        const averageQuality = history.reduce((sum, h) => sum + h.strategy.qualityThreshold, 0) /
            totalOptimizations;
        return {
            totalOptimizations,
            averageReduction,
            averageQuality,
            learningRate: this.learningRate,
            recentPerformance: history.slice(-5),
        };
    }
}
// Export singleton instance
export const adaptiveOptimizer = new AdaptiveTokenOptimizer();
// Convenience functions
export async function optimizeTokensAdaptively(text, model, config, conversationId) {
    const fullConfig = {
        strategy: 'adaptive',
        targetReduction: 0.3,
        qualityThreshold: 0.8,
        adaptiveLearning: true,
        realTimeOptimization: true,
        multiObjective: true,
        ...config,
    };
    return adaptiveOptimizer.optimizeTokensAdaptively(text, model, fullConfig, conversationId);
}
export function updateConversationState(conversationId, update) {
    adaptiveOptimizer.updateConversationState(conversationId, update);
}
export function getAdaptiveAnalytics(model, domain) {
    return adaptiveOptimizer.getPerformanceAnalytics(model, domain);
}
//# sourceMappingURL=adaptive-optimizer.js.map