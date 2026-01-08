/**
 * AI Token Usage Tracker for Clarity Chat Developer Tools
 *
 * Comprehensive token usage tracking and cost estimation:
 * - Real-time token counting
 * - Cost estimation per provider/model
 * - Usage trends and analytics
 * - Budget alerts and limits
 * - Token optimization recommendations
 * - Session and conversation tracking
 */
import chalk from 'chalk';
import { infoBox, warningBox, successBox, errorBox } from '../ui/box';
import { table, keyValueTable } from '../ui/table';
// Default pricing for common models (as of late 2024)
const DEFAULT_PRICING = {
    // OpenAI
    'gpt-4o': { promptPricePerMillion: 2.5, completionPricePerMillion: 10, currency: 'USD' },
    'gpt-4o-mini': { promptPricePerMillion: 0.15, completionPricePerMillion: 0.6, currency: 'USD' },
    'gpt-4-turbo': { promptPricePerMillion: 10, completionPricePerMillion: 30, currency: 'USD' },
    'gpt-4': { promptPricePerMillion: 30, completionPricePerMillion: 60, currency: 'USD' },
    'gpt-3.5-turbo': { promptPricePerMillion: 0.5, completionPricePerMillion: 1.5, currency: 'USD' },
    // Anthropic
    'claude-3-5-sonnet-20241022': { promptPricePerMillion: 3, completionPricePerMillion: 15, currency: 'USD' },
    'claude-3-opus-20240229': { promptPricePerMillion: 15, completionPricePerMillion: 75, currency: 'USD' },
    'claude-3-sonnet-20240229': { promptPricePerMillion: 3, completionPricePerMillion: 15, currency: 'USD' },
    'claude-3-haiku-20240307': { promptPricePerMillion: 0.25, completionPricePerMillion: 1.25, currency: 'USD' },
    // Google
    'gemini-1.5-pro': { promptPricePerMillion: 1.25, completionPricePerMillion: 5, currency: 'USD' },
    'gemini-1.5-flash': { promptPricePerMillion: 0.075, completionPricePerMillion: 0.3, currency: 'USD' },
    // Mistral
    'mistral-large': { promptPricePerMillion: 2, completionPricePerMillion: 6, currency: 'USD' },
    'mistral-small': { promptPricePerMillion: 0.2, completionPricePerMillion: 0.6, currency: 'USD' },
    // Default fallback
    'default': { promptPricePerMillion: 1, completionPricePerMillion: 3, currency: 'USD' },
};
/**
 * Token Usage Tracker
 * Track and analyze AI token usage and costs
 */
export class TokenTracker {
    events = [];
    maxEvents = 10000;
    enabled = true;
    pricing = { ...DEFAULT_PRICING };
    budget = { currency: 'USD' };
    listeners = new Set();
    dailyUsage = new Map(); // date -> cost
    monthlyUsage = new Map(); // month -> cost
    constructor(options = {}) {
        this.enabled = options.enabled ?? true;
        this.maxEvents = options.maxEvents ?? 10000;
        if (options.customPricing) {
            this.pricing = { ...this.pricing, ...options.customPricing };
        }
        if (options.budget) {
            this.budget = { ...this.budget, ...options.budget };
        }
    }
    /**
     * Track token usage
     */
    track(options) {
        const cost = this.calculateCost(options.model, options.usage);
        const event = {
            id: this.generateId(),
            timestamp: new Date(),
            provider: options.provider,
            model: options.model,
            operation: options.operation ?? 'chat',
            usage: options.usage,
            cost,
            conversationId: options.conversationId,
            metadata: options.metadata,
        };
        if (this.enabled) {
            this.events.push(event);
            this.updateUsageTracking(event);
            // Maintain max events
            if (this.events.length > this.maxEvents) {
                this.events.shift();
            }
            // Check budget and notify
            this.checkBudget(event);
            // Notify listeners
            const stats = this.getStats();
            this.listeners.forEach(listener => listener(event, stats));
        }
        return event;
    }
    /**
     * Calculate cost for token usage
     */
    calculateCost(model, usage) {
        const pricing = this.pricing[model] ?? this.pricing['default'];
        const promptCost = (usage.promptTokens / 1_000_000) * pricing.promptPricePerMillion;
        const completionCost = (usage.completionTokens / 1_000_000) * pricing.completionPricePerMillion;
        return {
            promptCost,
            completionCost,
            totalCost: promptCost + completionCost,
            currency: pricing.currency,
        };
    }
    /**
     * Estimate cost for a request before sending
     */
    estimateCost(model, estimatedPromptTokens, estimatedCompletionTokens) {
        return this.calculateCost(model, {
            promptTokens: estimatedPromptTokens,
            completionTokens: estimatedCompletionTokens,
            totalTokens: estimatedPromptTokens + estimatedCompletionTokens,
        });
    }
    /**
     * Update daily/monthly tracking
     */
    updateUsageTracking(event) {
        const dateKey = event.timestamp.toISOString().split('T')[0];
        const monthKey = event.timestamp.toISOString().slice(0, 7);
        this.dailyUsage.set(dateKey, (this.dailyUsage.get(dateKey) ?? 0) + event.cost.totalCost);
        this.monthlyUsage.set(monthKey, (this.monthlyUsage.get(monthKey) ?? 0) + event.cost.totalCost);
    }
    /**
     * Check budget limits
     */
    checkBudget(event) {
        const dateKey = event.timestamp.toISOString().split('T')[0];
        const monthKey = event.timestamp.toISOString().slice(0, 7);
        // Check per-request limit
        if (this.budget.perRequestLimit && event.cost.totalCost > this.budget.perRequestLimit) {
            console.warn(chalk.yellow(`⚠️ Request cost (${this.formatCost(event.cost.totalCost)}) exceeds per-request limit (${this.formatCost(this.budget.perRequestLimit)})`));
        }
        // Check daily limit
        if (this.budget.dailyLimit) {
            const dailyCost = this.dailyUsage.get(dateKey) ?? 0;
            const threshold = this.budget.warningThreshold ?? 0.8;
            if (dailyCost > this.budget.dailyLimit) {
                console.warn(chalk.red(`🚨 Daily budget exceeded! Used: ${this.formatCost(dailyCost)}, Limit: ${this.formatCost(this.budget.dailyLimit)}`));
            }
            else if (dailyCost > this.budget.dailyLimit * threshold) {
                console.warn(chalk.yellow(`⚠️ Approaching daily budget limit. Used: ${this.formatCost(dailyCost)} (${((dailyCost / this.budget.dailyLimit) * 100).toFixed(1)}%)`));
            }
        }
        // Check monthly limit
        if (this.budget.monthlyLimit) {
            const monthlyCost = this.monthlyUsage.get(monthKey) ?? 0;
            const threshold = this.budget.warningThreshold ?? 0.8;
            if (monthlyCost > this.budget.monthlyLimit) {
                console.warn(chalk.red(`🚨 Monthly budget exceeded! Used: ${this.formatCost(monthlyCost)}, Limit: ${this.formatCost(this.budget.monthlyLimit)}`));
            }
            else if (monthlyCost > this.budget.monthlyLimit * threshold) {
                console.warn(chalk.yellow(`⚠️ Approaching monthly budget limit. Used: ${this.formatCost(monthlyCost)} (${((monthlyCost / this.budget.monthlyLimit) * 100).toFixed(1)}%)`));
            }
        }
    }
    /**
     * Get usage statistics
     */
    getStats(filter) {
        let events = [...this.events];
        if (filter) {
            if (filter.startDate) {
                events = events.filter(e => e.timestamp >= filter.startDate);
            }
            if (filter.endDate) {
                events = events.filter(e => e.timestamp <= filter.endDate);
            }
            if (filter.provider) {
                events = events.filter(e => e.provider === filter.provider);
            }
            if (filter.model) {
                events = events.filter(e => e.model === filter.model);
            }
            if (filter.conversationId) {
                events = events.filter(e => e.conversationId === filter.conversationId);
            }
        }
        const tokensByProvider = {};
        const tokensByModel = {};
        const costByProvider = {};
        const costByModel = {};
        let totalPromptTokens = 0;
        let totalCompletionTokens = 0;
        let totalCost = 0;
        events.forEach(event => {
            totalPromptTokens += event.usage.promptTokens;
            totalCompletionTokens += event.usage.completionTokens;
            totalCost += event.cost.totalCost;
            tokensByProvider[event.provider] = (tokensByProvider[event.provider] ?? 0) + event.usage.totalTokens;
            tokensByModel[event.model] = (tokensByModel[event.model] ?? 0) + event.usage.totalTokens;
            costByProvider[event.provider] = (costByProvider[event.provider] ?? 0) + event.cost.totalCost;
            costByModel[event.model] = (costByModel[event.model] ?? 0) + event.cost.totalCost;
        });
        return {
            totalPromptTokens,
            totalCompletionTokens,
            totalTokens: totalPromptTokens + totalCompletionTokens,
            totalCost,
            eventCount: events.length,
            avgTokensPerRequest: events.length > 0 ? (totalPromptTokens + totalCompletionTokens) / events.length : 0,
            avgCostPerRequest: events.length > 0 ? totalCost / events.length : 0,
            tokensByProvider,
            tokensByModel,
            costByProvider,
            costByModel,
        };
    }
    /**
     * Get daily usage for a date range
     */
    getDailyUsage(days = 30) {
        const result = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            const dayEvents = this.events.filter(e => e.timestamp.toISOString().split('T')[0] === dateKey);
            result.push({
                date: dateKey,
                tokens: dayEvents.reduce((sum, e) => sum + e.usage.totalTokens, 0),
                cost: this.dailyUsage.get(dateKey) ?? 0,
            });
        }
        return result;
    }
    /**
     * Get token optimization recommendations
     */
    getOptimizationRecommendations() {
        const recommendations = [];
        const stats = this.getStats();
        // Check if using expensive models for simple tasks
        const expensiveModelUsage = Object.entries(stats.costByModel)
            .filter(([model]) => model.includes('gpt-4') || model.includes('opus'))
            .reduce((sum, [, cost]) => sum + cost, 0);
        if (expensiveModelUsage > stats.totalCost * 0.8) {
            recommendations.push('Consider using smaller models (e.g., GPT-4o-mini, Claude 3 Haiku) for simpler tasks to reduce costs.');
        }
        // Check average tokens per request
        if (stats.avgTokensPerRequest > 5000) {
            recommendations.push('Average tokens per request is high. Consider summarizing context or implementing conversation memory management.');
        }
        // Check prompt to completion ratio
        const promptRatio = stats.totalPromptTokens / (stats.totalTokens || 1);
        if (promptRatio > 0.8) {
            recommendations.push('Prompts account for most of your token usage. Consider caching system prompts or using prompt compression techniques.');
        }
        // Check for provider diversity
        const providers = Object.keys(stats.tokensByProvider);
        if (providers.length === 1) {
            recommendations.push('Consider using multiple providers for redundancy and cost optimization.');
        }
        // Check for caching opportunities
        const recentEvents = this.events.slice(-100);
        const duplicatePromptRatio = this.detectDuplicatePrompts(recentEvents);
        if (duplicatePromptRatio > 0.2) {
            recommendations.push(`${(duplicatePromptRatio * 100).toFixed(0)}% of recent prompts appear similar. Implement response caching to reduce costs.`);
        }
        if (recommendations.length === 0) {
            recommendations.push('Token usage is optimized. Keep up the good work!');
        }
        return recommendations;
    }
    /**
     * Detect duplicate/similar prompts
     */
    detectDuplicatePrompts(events) {
        // Simple heuristic: check for similar token counts (within 10%)
        const tokenCounts = events.map(e => e.usage.promptTokens);
        let similarCount = 0;
        for (let i = 0; i < tokenCounts.length; i++) {
            for (let j = i + 1; j < tokenCounts.length; j++) {
                const diff = Math.abs(tokenCounts[i] - tokenCounts[j]);
                const avg = (tokenCounts[i] + tokenCounts[j]) / 2;
                if (diff / avg < 0.1) {
                    similarCount++;
                    break;
                }
            }
        }
        return events.length > 0 ? similarCount / events.length : 0;
    }
    /**
     * Add custom pricing
     */
    addPricing(model, pricing) {
        this.pricing[model] = pricing;
    }
    /**
     * Set budget configuration
     */
    setBudget(budget) {
        this.budget = { ...this.budget, ...budget };
    }
    /**
     * Add event listener
     */
    addListener(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    /**
     * Get all events
     */
    getEvents(limit) {
        return limit ? this.events.slice(-limit) : [...this.events];
    }
    /**
     * Clear all events
     */
    clear() {
        this.events = [];
        this.dailyUsage.clear();
        this.monthlyUsage.clear();
    }
    /**
     * Enable/disable tracking
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    /**
     * Export data
     */
    export() {
        return JSON.stringify({
            events: this.events,
            stats: this.getStats(),
            dailyUsage: Object.fromEntries(this.dailyUsage),
            monthlyUsage: Object.fromEntries(this.monthlyUsage),
            recommendations: this.getOptimizationRecommendations(),
            exportedAt: new Date().toISOString(),
        }, null, 2);
    }
    /**
     * Format cost for display
     */
    formatCost(cost) {
        return `$${cost.toFixed(4)}`;
    }
    /**
     * Format tokens for display
     */
    formatTokens(tokens) {
        if (tokens >= 1_000_000) {
            return `${(tokens / 1_000_000).toFixed(2)}M`;
        }
        if (tokens >= 1_000) {
            return `${(tokens / 1_000).toFixed(1)}K`;
        }
        return tokens.toString();
    }
    /**
     * Generate unique ID
     */
    generateId() {
        return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Print formatted report
     */
    printReport() {
        const stats = this.getStats();
        console.log('');
        console.log(infoBox('AI Token Usage Report', '🎯 Token Tracker'));
        console.log('');
        // Overall stats
        const overallData = {
            'Total Tokens': chalk.cyan(this.formatTokens(stats.totalTokens)),
            'Prompt Tokens': chalk.gray(this.formatTokens(stats.totalPromptTokens)),
            'Completion Tokens': chalk.gray(this.formatTokens(stats.totalCompletionTokens)),
            'Total Cost': chalk.green(this.formatCost(stats.totalCost)),
            'Total Requests': chalk.cyan(stats.eventCount.toString()),
            'Avg Tokens/Request': chalk.cyan(stats.avgTokensPerRequest.toFixed(0)),
            'Avg Cost/Request': chalk.cyan(this.formatCost(stats.avgCostPerRequest)),
        };
        console.log(keyValueTable(overallData));
        console.log('');
        // Cost by model
        if (Object.keys(stats.costByModel).length > 0) {
            console.log(infoBox('Cost Breakdown by Model', '💰 Model Costs'));
            console.log('');
            const columns = [
                { header: 'Model', width: 35, color: chalk.yellow },
                { header: 'Tokens', width: 12, align: 'right', color: chalk.cyan },
                { header: 'Cost', width: 12, align: 'right', color: chalk.green },
                { header: '% of Total', width: 12, align: 'right' },
            ];
            const tableData = Object.entries(stats.costByModel)
                .sort((a, b) => b[1] - a[1])
                .map(([model, cost]) => [
                model,
                this.formatTokens(stats.tokensByModel[model] ?? 0),
                this.formatCost(cost),
                ((cost / stats.totalCost) * 100).toFixed(1) + '%',
            ]);
            console.log(table(tableData, columns));
            console.log('');
        }
        // Budget status
        if (this.budget.dailyLimit || this.budget.monthlyLimit) {
            const today = new Date().toISOString().split('T')[0];
            const month = new Date().toISOString().slice(0, 7);
            const dailyCost = this.dailyUsage.get(today) ?? 0;
            const monthlyCost = this.monthlyUsage.get(month) ?? 0;
            const budgetData = {};
            if (this.budget.dailyLimit) {
                const dailyPercent = (dailyCost / this.budget.dailyLimit) * 100;
                budgetData['Daily Usage'] = dailyPercent > 100
                    ? chalk.red(`${this.formatCost(dailyCost)} / ${this.formatCost(this.budget.dailyLimit)} (${dailyPercent.toFixed(1)}%)`)
                    : dailyPercent > 80
                        ? chalk.yellow(`${this.formatCost(dailyCost)} / ${this.formatCost(this.budget.dailyLimit)} (${dailyPercent.toFixed(1)}%)`)
                        : chalk.green(`${this.formatCost(dailyCost)} / ${this.formatCost(this.budget.dailyLimit)} (${dailyPercent.toFixed(1)}%)`);
            }
            if (this.budget.monthlyLimit) {
                const monthlyPercent = (monthlyCost / this.budget.monthlyLimit) * 100;
                budgetData['Monthly Usage'] = monthlyPercent > 100
                    ? chalk.red(`${this.formatCost(monthlyCost)} / ${this.formatCost(this.budget.monthlyLimit)} (${monthlyPercent.toFixed(1)}%)`)
                    : monthlyPercent > 80
                        ? chalk.yellow(`${this.formatCost(monthlyCost)} / ${this.formatCost(this.budget.monthlyLimit)} (${monthlyPercent.toFixed(1)}%)`)
                        : chalk.green(`${this.formatCost(monthlyCost)} / ${this.formatCost(this.budget.monthlyLimit)} (${monthlyPercent.toFixed(1)}%)`);
            }
            console.log(infoBox('Budget Status', '📊 Budget'));
            console.log('');
            console.log(keyValueTable(budgetData));
            console.log('');
        }
        // Recommendations
        const recommendations = this.getOptimizationRecommendations();
        console.log(successBox('Optimization Recommendations', '💡 Tips'));
        console.log('');
        recommendations.forEach((rec, i) => {
            console.log(chalk.cyan(`  ${i + 1}. ${rec}`));
        });
        console.log('');
    }
}
// Global instance
let globalTracker = null;
/**
 * Get the global token tracker instance
 */
export function getTokenTracker() {
    if (!globalTracker) {
        globalTracker = new TokenTracker({
            enabled: process.env.NODE_ENV === 'development',
        });
    }
    return globalTracker;
}
/**
 * Create a new token tracker instance
 */
export function createTokenTracker(options) {
    return new TokenTracker(options);
}
export default TokenTracker;
//# sourceMappingURL=token-tracker.js.map