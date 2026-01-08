import { TokenCounter } from '@clarity-chat/token-optimization';
/**
 * Token budget validation and management
 */
export class TokenBudgetValidator {
    budgets = new Map();
    configs = new Map();
    /**
     * Create a new token budget
     */
    createBudget(id, config) {
        const budget = {
            total: config.maxTokens,
            used: 0,
            remaining: config.maxTokens,
            percentage: 0,
            isExceeded: false
        };
        this.budgets.set(id, budget);
        this.configs.set(id, {
            warningThreshold: 0.8,
            criticalThreshold: 0.95,
            autoTruncate: false,
            preserveContext: true,
            truncationStrategy: 'truncate',
            ...config
        });
        return { ...budget };
    }
    /**
     * Validate text against budget
     */
    validateText(budgetId, text, options = {}) {
        const budget = this.budgets.get(budgetId);
        const config = this.configs.get(budgetId);
        if (!budget || !config) {
            throw new Error(`Budget '${budgetId}' not found`);
        }
        const tokenCount = TokenCounter.count(text);
        const projectedUsed = budget.used + tokenCount;
        const projectedPercentage = projectedUsed / budget.total;
        const violations = [];
        const suggestions = [];
        // Check if text exceeds total budget
        if (tokenCount > budget.total) {
            violations.push({
                type: 'exceeds_total',
                message: `Text requires ${tokenCount} tokens, but total budget is ${budget.total}`,
                severity: 'error',
                suggestedAction: 'Reduce text size or increase budget'
            });
        }
        // Check if text exceeds remaining budget
        if (projectedUsed > budget.total) {
            violations.push({
                type: 'exceeds_remaining',
                message: `Text would exceed remaining budget (${budget.remaining} tokens remaining)`,
                severity: 'error',
                suggestedAction: 'Truncate text or clear budget'
            });
        }
        // Check warning threshold
        if (projectedPercentage > config.warningThreshold) {
            violations.push({
                type: 'warning_threshold',
                message: `Projected usage (${(projectedPercentage * 100).toFixed(1)}%) exceeds warning threshold (${(config.warningThreshold * 100).toFixed(1)}%)`,
                severity: 'warning',
                suggestedAction: 'Consider reducing text size or clearing budget'
            });
        }
        // Check critical threshold
        if (projectedPercentage > config.criticalThreshold) {
            violations.push({
                type: 'critical_threshold',
                message: `Projected usage (${(projectedPercentage * 100).toFixed(1)}%) exceeds critical threshold (${(config.criticalThreshold * 100).toFixed(1)}%)`,
                severity: 'critical',
                suggestedAction: 'Immediate action required to prevent budget exhaustion'
            });
        }
        // Generate suggestions
        if (violations.length > 0 && options.allowTruncation) {
            suggestions.push(...this.generateTruncationSuggestions(text, budget, config));
        }
        if (projectedPercentage > 0.9) {
            suggestions.push('Consider increasing the token budget');
            suggestions.push('Implement text truncation or summarization');
            suggestions.push('Clear budget periodically');
        }
        return {
            isValid: violations.filter(v => v.severity === 'error').length === 0,
            budget: { ...budget },
            violations,
            suggestions
        };
    }
    /**
     * Validate conversation against budget
     */
    validateConversation(budgetId, messages, options = {}) {
        const budget = this.budgets.get(budgetId);
        const config = this.configs.get(budgetId);
        if (!budget || !config) {
            throw new Error(`Budget '${budgetId}' not found`);
        }
        let totalTokens = 0;
        const messageTokens = [];
        // Count system message if provided
        if (options.systemMessage) {
            const systemTokens = TokenCounter.count(options.systemMessage);
            totalTokens += systemTokens;
            messageTokens.push(systemTokens);
        }
        // Count all messages
        messages.forEach((message, index) => {
            const messageContent = `${message.role}: ${message.content}`;
            const tokens = TokenCounter.count(messageContent);
            totalTokens += tokens;
            messageTokens.push(tokens);
        });
        const projectedUsed = budget.used + totalTokens;
        const projectedPercentage = projectedUsed / budget.total;
        const violations = [];
        const suggestions = [];
        // Check if conversation exceeds total budget
        if (totalTokens > budget.total) {
            violations.push({
                type: 'exceeds_total',
                message: `Conversation requires ${totalTokens} tokens, but total budget is ${budget.total}`,
                severity: 'error',
                suggestedAction: 'Reduce number of messages or increase budget'
            });
        }
        // Check if conversation exceeds remaining budget
        if (projectedUsed > budget.total) {
            violations.push({
                type: 'exceeds_remaining',
                message: `Conversation would exceed remaining budget (${budget.remaining} tokens remaining)`,
                severity: 'error',
                suggestedAction: 'Truncate messages or clear budget'
            });
        }
        // Check thresholds
        if (projectedPercentage > config.warningThreshold) {
            violations.push({
                type: 'warning_threshold',
                message: `Projected usage (${(projectedPercentage * 100).toFixed(1)}%) exceeds warning threshold`,
                severity: 'warning',
                suggestedAction: 'Consider reducing conversation length'
            });
        }
        if (projectedPercentage > config.criticalThreshold) {
            violations.push({
                type: 'critical_threshold',
                message: `Projected usage (${(projectedPercentage * 100).toFixed(1)}%) exceeds critical threshold`,
                severity: 'critical',
                suggestedAction: 'Immediate action required'
            });
        }
        return {
            isValid: violations.filter(v => v.severity === 'error').length === 0,
            budget: { ...budget },
            violations,
            suggestions
        };
    }
    /**
     * Use tokens from budget
     */
    useTokens(budgetId, tokenCount) {
        const budget = this.budgets.get(budgetId);
        const config = this.configs.get(budgetId);
        if (!budget || !config) {
            throw new Error(`Budget '${budgetId}' not found`);
        }
        budget.used += tokenCount;
        budget.remaining = Math.max(0, budget.total - budget.used);
        budget.percentage = budget.used / budget.total;
        budget.isExceeded = budget.used > budget.total;
        return { ...budget };
    }
    /**
     * Auto-truncate text to fit budget
     */
    autoTruncate(text, maxTokens, options = {}) {
        const originalTokens = TokenCounter.count(text);
        if (originalTokens <= maxTokens) {
            return { text, originalTokens, truncatedTokens: originalTokens };
        }
        const strategy = options.strategy || 'truncate';
        let truncatedText = text;
        switch (strategy) {
            case 'truncate':
                truncatedText = this.truncateText(text, maxTokens, options);
                break;
            case 'remove':
                truncatedText = this.removeContent(text, maxTokens, options);
                break;
            case 'summarize':
                truncatedText = this.summarizeText(text, maxTokens, options);
                break;
            default:
                truncatedText = this.truncateText(text, maxTokens, options);
        }
        const truncatedTokens = TokenCounter.count(truncatedText);
        return { text: truncatedText, originalTokens, truncatedTokens };
    }
    /**
     * Truncate text to fit token limit
     */
    truncateText(text, maxTokens, options) {
        if (options.preserveContext) {
            return this.truncatePreserveContext(text, maxTokens);
        }
        // Binary search for optimal truncation point
        let left = 0;
        let right = text.length;
        let bestLength = 0;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const truncated = text.substring(0, mid);
            const tokens = TokenCounter.count(truncated);
            if (tokens <= maxTokens) {
                bestLength = mid;
                left = mid + 1;
            }
            else {
                right = mid - 1;
            }
        }
        return text.substring(0, bestLength);
    }
    /**
     * Truncate while preserving important context
     */
    truncatePreserveContext(text, maxTokens) {
        // Keep first and last parts, truncate middle
        const tokens = TokenCounter.count(text);
        if (tokens <= maxTokens)
            return text;
        const keepRatio = 0.3; // Keep 30% from beginning and end
        const keepLength = Math.floor(text.length * keepRatio);
        const beginning = text.substring(0, keepLength);
        const end = text.substring(text.length - keepLength);
        return `${beginning}\n[... truncated ...]\n${end}`;
    }
    /**
     * Remove less important content
     */
    removeContent(text, maxTokens, options) {
        // Remove examples, explanations, or redundant content
        const lines = text.split('\n');
        let currentText = text;
        let currentTokens = TokenCounter.count(currentText);
        // Remove lines from the end first
        while (currentTokens > maxTokens && lines.length > 1) {
            lines.pop();
            currentText = lines.join('\n');
            currentTokens = TokenCounter.count(currentText);
        }
        return currentText;
    }
    /**
     * Summarize text to fit token limit
     */
    summarizeText(text, maxTokens, options) {
        // Simple summarization - keep first and last sentences
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        if (sentences.length <= 2) {
            return this.truncateText(text, maxTokens, options);
        }
        const summary = `${sentences[0].trim()} ${sentences[sentences.length - 1].trim()}`;
        const summaryTokens = TokenCounter.count(summary);
        if (summaryTokens <= maxTokens) {
            return summary;
        }
        return this.truncateText(summary, maxTokens, options);
    }
    /**
     * Generate truncation suggestions
     */
    generateTruncationSuggestions(text, budget, config) {
        const suggestions = [];
        const maxTokens = budget.remaining;
        suggestions.push('Enable auto-truncation to automatically fit text to budget');
        suggestions.push(`Consider using 'summarize' strategy for long text`);
        suggestions.push(`Current text could be truncated to ${maxTokens} tokens`);
        if (text.length > 1000) {
            suggestions.push('Break long text into smaller chunks');
            suggestions.push('Use progressive loading for large documents');
        }
        return suggestions;
    }
    /**
     * Get budget status
     */
    getBudget(id) {
        const budget = this.budgets.get(id);
        return budget ? { ...budget } : undefined;
    }
    /**
     * Get all budgets
     */
    getAllBudgets() {
        const result = {};
        this.budgets.forEach((budget, id) => {
            result[id] = { ...budget };
        });
        return result;
    }
    /**
     * Clear budget
     */
    clearBudget(id) {
        const budget = this.budgets.get(id);
        const config = this.configs.get(id);
        if (budget && config) {
            budget.used = 0;
            budget.remaining = budget.total;
            budget.percentage = 0;
            budget.isExceeded = false;
        }
    }
    /**
     * Remove budget
     */
    removeBudget(id) {
        this.budgets.delete(id);
        this.configs.delete(id);
    }
    /**
     * Calculate optimal budget
     */
    calculateOptimalBudget(text, conversation) {
        let totalTokens = TokenCounter.count(text);
        if (conversation) {
            conversation.forEach(message => {
                totalTokens += TokenCounter.count(`${message.role}: ${message.content}`);
            });
        }
        // Add 20% buffer for safety
        return Math.ceil(totalTokens * 1.2);
    }
}
// Export singleton instance
export const tokenBudgetValidator = new TokenBudgetValidator();
// Convenience functions
export function validateTokenBudget(budgetId, text, options) {
    return tokenBudgetValidator.validateText(budgetId, text, options);
}
export function createTokenBudget(id, maxTokens, options) {
    return tokenBudgetValidator.createBudget(id, { maxTokens, ...options });
}
//# sourceMappingURL=token-budget-validator.js.map