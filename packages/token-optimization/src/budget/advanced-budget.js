/**
 * Advanced Token Budget Manager
 *
 * Sophisticated budget management with dynamic allocation
 */
export class AdvancedTokenBudgetManager {
    strategies;
    config;
    constructor(config = {}) {
        this.config = {
            maxTokens: 128000,
            reserveTokens: 1000,
            minQualityThreshold: 0.8,
            enableDynamicAllocation: true,
            enableCompression: true,
            enableCaching: true,
            priorityWeights: {
                system: 0.2,
                user: 0.3,
                context: 0.3,
                response: 0.2
            },
            ...config
        };
        this.strategies = new Map();
        this.initializeStrategies();
    }
    async optimizeTokenBudget(requirements, context) {
        const availableBudget = this.config.maxTokens - this.config.reserveTokens;
        // Select optimal strategy
        const strategy = this.selectStrategy(requirements, context);
        // Allocate tokens
        const allocation = strategy.allocate(availableBudget, requirements);
        // Apply dynamic adjustments
        if (this.config.enableDynamicAllocation) {
            await this.applyDynamicAdjustments(allocation, context);
        }
        // Calculate quality score
        const qualityScore = this.calculateQualityScore(allocation, context);
        // Calculate cost estimate
        const costEstimate = this.estimateCost(allocation);
        // Generate recommendations
        const recommendations = this.generateRecommendations(allocation, context);
        return {
            allocation,
            strategy: strategy.name,
            qualityScore,
            costEstimate,
            recommendations
        };
    }
    selectStrategy(_requirements, _context) {
        // Simple strategy selection based on requirements
        return this.strategies.get('balanced');
    }
    initializeStrategies() {
        this.strategies.set('balanced', {
            name: 'balanced',
            allocate: (_budget, _requirements) => {
                const weights = this.config.priorityWeights;
                return {
                    system: Math.floor(_budget * weights.system),
                    user: Math.floor(_budget * weights.user),
                    context: Math.floor(_budget * weights.context),
                    response: Math.floor(_budget * weights.response),
                    available: _budget - Math.floor(_budget * (weights.system + weights.user + weights.context + weights.response))
                };
            },
            priority: 1
        });
    }
    async applyDynamicAdjustments(allocation, context) {
        // Adjust based on conversation length
        if (context.conversationLength > 1000) {
            allocation.context = Math.floor(allocation.context * 0.8);
            allocation.available += Math.floor(allocation.context * 0.2);
        }
        // Adjust based on memory richness
        if (context.memoryRichness > 0.8) {
            allocation.context = Math.floor(allocation.context * 1.2);
            allocation.available = Math.max(0, allocation.available - Math.floor(allocation.context * 0.2));
        }
        // Adjust based on response complexity
        const complexityMultipliers = {
            simple: 0.7,
            moderate: 1.0,
            complex: 1.5
        };
        const multiplier = complexityMultipliers[context.responseComplexity];
        allocation.response = Math.floor(allocation.response * multiplier);
        allocation.available = Math.max(0, allocation.available - Math.floor(allocation.response * (multiplier - 1)));
    }
    calculateQualityScore(allocation, context) {
        let score = 0.8; // Base score
        // Adjust based on allocation balance
        const totalAllocated = allocation.system + allocation.user + allocation.context + allocation.response;
        const utilization = totalAllocated / (this.config.maxTokens - this.config.reserveTokens);
        if (utilization > 0.9)
            score += 0.1;
        if (utilization < 0.5)
            score -= 0.2;
        // Adjust based on context factors
        if (context.memoryRichness > 0.8)
            score += 0.05;
        if (context.conversationLength < 500)
            score += 0.05;
        return Math.max(0, Math.min(1, score));
    }
    estimateCost(allocation) {
        const totalTokens = allocation.system + allocation.user + allocation.context + allocation.response;
        return totalTokens * 0.000001; // Assume $0.001 per 1K tokens
    }
    generateRecommendations(allocation, context) {
        const recommendations = [];
        if (allocation.available < 100) {
            recommendations.push('Consider increasing token budget');
        }
        if (context.conversationLength > 2000) {
            recommendations.push('Consider summarizing conversation history');
        }
        if (context.responseComplexity === 'complex') {
            recommendations.push('Consider breaking complex responses into chunks');
        }
        return recommendations;
    }
}
export async function optimizeTokenBudget(budget, requirements, context, config) {
    const manager = new AdvancedTokenBudgetManager({
        maxTokens: budget,
        ...config
    });
    return await manager.optimizeTokenBudget(requirements, context);
}
export async function optimizeTokensWithCompression(content, maxTokens, enableCompression = true) {
    if (!enableCompression || content.length <= maxTokens * 4) {
        return {
            content,
            tokens: Math.ceil(content.length / 4),
            compressionRatio: 1.0
        };
    }
    // Simple compression for demonstration
    const compressed = content
        .replace(/\s+/g, ' ')
        .replace(/[.]{2,}/g, '.')
        .trim();
    const compressedTokens = Math.ceil(compressed.length / 4);
    const compressionRatio = compressed.length / content.length;
    return {
        content: compressedTokens <= maxTokens ? compressed : content.substring(0, maxTokens * 4),
        tokens: Math.min(compressedTokens, maxTokens),
        compressionRatio
    };
}
//# sourceMappingURL=advanced-budget.js.map