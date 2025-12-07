'use client';
import * as React from 'react';
import { countTokens } from '../utils/tokenization';
import { estimateTokens } from '../utils/tokenization/estimator';
/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
    maxInputTokens: 128000,
    warningThreshold: 0.8,
    criticalThreshold: 0.95,
    reservedForOutput: 4096,
    autoTrim: false,
    debounceMs: 300,
    useAccurateTokenization: false,
};
/**
 * Calculate status based on utilization and thresholds
 */
function calculateStatus(utilizationPercent, warningThreshold, criticalThreshold) {
    const utilization = utilizationPercent / 100;
    if (utilization >= 1)
        return 'exceeded';
    if (utilization >= criticalThreshold)
        return 'critical';
    if (utilization >= warningThreshold)
        return 'warning';
    return 'safe';
}
/**
 * Create initial usage state
 */
function createInitialUsage(config) {
    const effectiveMax = config.maxInputTokens - (config.reservedForOutput ?? DEFAULT_CONFIG.reservedForOutput);
    return {
        current: 0,
        max: config.maxInputTokens,
        available: effectiveMax,
        utilizationPercent: 0,
        status: 'safe',
        reservedForOutput: config.reservedForOutput ?? DEFAULT_CONFIG.reservedForOutput,
        effectiveMax,
    };
}
/**
 * Hook for monitoring token budget in real-time
 *
 * Provides threshold-based warnings and automatic trimming to prevent
 * context overflow and provide immediate cost awareness.
 *
 * @example
 * ```tsx
 * function ChatInput() {
 *   const { usage, isWarning, isCritical, updateMessages } = useTokenBudgetMonitor({
 *     maxInputTokens: 128000,
 *     reservedForOutput: 4096,
 *     onWarning: (usage) => console.log('Warning:', usage.utilizationPercent),
 *     onCritical: (usage) => console.log('Critical:', usage.utilizationPercent),
 *     autoTrim: true,
 *   })
 *
 *   useEffect(() => {
 *     updateMessages(messages)
 *   }, [messages])
 *
 *   return (
 *     <div>
 *       <TokenBar usage={usage} />
 *       {isWarning && <Warning>Context at {usage.utilizationPercent}%</Warning>}
 *       {isCritical && <Alert>Critical: Consider trimming history</Alert>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useTokenBudgetMonitor(config) {
    // Validate config in development
    if (process.env['NODE_ENV'] !== 'production') {
        if (config.maxInputTokens <= 0) {
            console.warn('[useTokenBudgetMonitor] maxInputTokens must be positive');
        }
        const reserved = config.reservedForOutput ?? DEFAULT_CONFIG.reservedForOutput;
        if (reserved >= config.maxInputTokens) {
            console.warn('[useTokenBudgetMonitor] reservedForOutput should be less than maxInputTokens');
        }
        const warning = config.warningThreshold ?? DEFAULT_CONFIG.warningThreshold;
        const critical = config.criticalThreshold ?? DEFAULT_CONFIG.criticalThreshold;
        if (warning >= critical) {
            console.warn('[useTokenBudgetMonitor] warningThreshold should be less than criticalThreshold');
        }
        if (warning < 0 || warning > 1 || critical < 0 || critical > 1) {
            console.warn('[useTokenBudgetMonitor] thresholds should be between 0 and 1');
        }
    }
    // Merge config with defaults
    const resolvedConfig = React.useMemo(() => ({
        ...DEFAULT_CONFIG,
        ...config,
    }), [
        config.maxInputTokens,
        config.warningThreshold,
        config.criticalThreshold,
        config.reservedForOutput,
        config.autoTrim,
        config.debounceMs,
        config.useAccurateTokenization,
        config.model,
    ]);
    // State
    const [usage, setUsage] = React.useState(() => createInitialUsage(config));
    const [lastTrimResult, setLastTrimResult] = React.useState(null);
    const [isCalculating, setIsCalculating] = React.useState(false);
    // Refs for callbacks and messages (to avoid stale closures)
    const callbacksRef = React.useRef({
        onWarning: config.onWarning,
        onCritical: config.onCritical,
        onExceeded: config.onExceeded,
        onAutoTrim: config.onAutoTrim,
    });
    const messagesRef = React.useRef([]);
    const previousStatusRef = React.useRef('safe');
    const debounceTimerRef = React.useRef(null);
    // Update callback refs
    React.useEffect(() => {
        callbacksRef.current = {
            onWarning: config.onWarning,
            onCritical: config.onCritical,
            onExceeded: config.onExceeded,
            onAutoTrim: config.onAutoTrim,
        };
    }, [config.onWarning, config.onCritical, config.onExceeded, config.onAutoTrim]);
    /**
     * Calculate tokens for a single text
     */
    const calculateTokens = React.useCallback(async (text) => {
        if (!text)
            return 0;
        if (resolvedConfig.useAccurateTokenization) {
            try {
                const result = await countTokens(text, { model: config.model });
                return result.total;
            }
            catch {
                // Fall back to estimation
                return estimateTokens(text, config.model);
            }
        }
        return estimateTokens(text, config.model);
    }, [resolvedConfig.useAccurateTokenization, config.model]);
    /**
     * Calculate total tokens for messages
     */
    const calculateTotalTokens = React.useCallback(async (messages) => {
        if (messages.length === 0)
            return 0;
        // Use pre-computed tokens where available
        let total = 0;
        const TOKENS_PER_MESSAGE = 4; // Overhead per message
        for (const msg of messages) {
            if (msg.tokens !== undefined) {
                total += msg.tokens;
            }
            else {
                total += await calculateTokens(msg.content);
            }
            total += TOKENS_PER_MESSAGE;
        }
        // Add priming tokens
        total += 2;
        return total;
    }, [calculateTokens]);
    /**
     * Perform trimming to get below critical threshold
     */
    const performTrim = React.useCallback((messages, targetTokens, reason) => {
        const trimmableMessages = messages
            .map((msg, index) => ({ msg, index }))
            .filter(({ msg }) => msg.trimmable !== false && msg.role !== 'system')
            .sort((a, b) => (a.msg.priority ?? 0) - (b.msg.priority ?? 0));
        if (trimmableMessages.length === 0)
            return null;
        const removedItems = [];
        let currentTokens = 0;
        // Calculate current total
        for (const msg of messages) {
            currentTokens += msg.tokens ?? estimateTokens(msg.content, config.model);
        }
        // Keep removing until we're below target
        const indicesToRemove = new Set();
        for (const { msg, index } of trimmableMessages) {
            if (currentTokens <= targetTokens)
                break;
            const msgTokens = msg.tokens ?? estimateTokens(msg.content, config.model);
            indicesToRemove.add(index);
            currentTokens -= msgTokens;
            removedItems.push({
                index,
                preview: msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : ''),
                tokens: msgTokens,
            });
        }
        if (removedItems.length === 0)
            return null;
        const originalContent = messages.map(m => m.content);
        const trimmedContent = messages
            .filter((_, index) => !indicesToRemove.has(index))
            .map(m => m.content);
        return {
            originalContent,
            trimmedContent,
            tokensRemoved: removedItems.reduce((sum, item) => sum + item.tokens, 0),
            removedItems,
            reason,
        };
    }, [config.model]);
    /**
     * Update usage state and trigger callbacks
     */
    const updateUsageState = React.useCallback((currentTokens) => {
        const effectiveMax = resolvedConfig.maxInputTokens - resolvedConfig.reservedForOutput;
        const utilizationPercent = effectiveMax > 0 ? (currentTokens / effectiveMax) * 100 : 0;
        const status = calculateStatus(utilizationPercent, resolvedConfig.warningThreshold, resolvedConfig.criticalThreshold);
        const available = Math.max(0, effectiveMax - currentTokens);
        const newUsage = {
            current: currentTokens,
            max: resolvedConfig.maxInputTokens,
            available,
            utilizationPercent: Math.min(utilizationPercent, 100),
            status,
            reservedForOutput: resolvedConfig.reservedForOutput,
            effectiveMax,
        };
        setUsage(newUsage);
        // Trigger callbacks only on status change
        const previousStatus = previousStatusRef.current;
        if (status !== previousStatus) {
            if (status === 'warning' && previousStatus === 'safe') {
                callbacksRef.current.onWarning?.(newUsage);
            }
            else if (status === 'critical' && (previousStatus === 'safe' || previousStatus === 'warning')) {
                callbacksRef.current.onCritical?.(newUsage);
            }
            else if (status === 'exceeded') {
                callbacksRef.current.onExceeded?.(newUsage);
            }
            previousStatusRef.current = status;
        }
        return { newUsage, status };
    }, [resolvedConfig]);
    /**
     * Update messages and recalculate usage (debounced)
     */
    const updateMessages = React.useCallback((messages) => {
        messagesRef.current = messages;
        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        // Debounce the calculation
        debounceTimerRef.current = setTimeout(async () => {
            setIsCalculating(true);
            try {
                const totalTokens = await calculateTotalTokens(messages);
                const { newUsage, status } = updateUsageState(totalTokens);
                // Auto-trim if enabled and critical
                if (resolvedConfig.autoTrim && (status === 'critical' || status === 'exceeded')) {
                    const effectiveMax = resolvedConfig.maxInputTokens - resolvedConfig.reservedForOutput;
                    const targetTokens = effectiveMax * resolvedConfig.criticalThreshold * 0.9; // Trim to 90% of critical
                    const trimResult = performTrim(messages, targetTokens, status === 'exceeded' ? 'exceeded' : 'critical');
                    if (trimResult) {
                        setLastTrimResult(trimResult);
                        callbacksRef.current.onAutoTrim?.(trimResult);
                    }
                }
            }
            finally {
                setIsCalculating(false);
            }
        }, resolvedConfig.debounceMs);
    }, [calculateTotalTokens, updateUsageState, resolvedConfig, performTrim]);
    /**
     * Check if adding tokens would exceed budget
     */
    const wouldExceed = React.useCallback((additionalTokens) => {
        const projectedTotal = usage.current + additionalTokens;
        return projectedTotal > usage.effectiveMax;
    }, [usage]);
    /**
     * Manually trigger trim to get below critical
     */
    const trimToCritical = React.useCallback(() => {
        const effectiveMax = resolvedConfig.maxInputTokens - resolvedConfig.reservedForOutput;
        const targetTokens = effectiveMax * resolvedConfig.criticalThreshold * 0.9;
        const result = performTrim(messagesRef.current, targetTokens, 'manual');
        if (result) {
            setLastTrimResult(result);
        }
        return result;
    }, [resolvedConfig, performTrim]);
    /**
     * Reset monitor state
     */
    const reset = React.useCallback(() => {
        setUsage(createInitialUsage(config));
        setLastTrimResult(null);
        previousStatusRef.current = 'safe';
        messagesRef.current = [];
    }, [config]);
    // Cleanup debounce timer on unmount
    React.useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);
    // Derived state
    const isWarning = usage.status === 'warning';
    const isCritical = usage.status === 'critical';
    const isExceeded = usage.status === 'exceeded';
    return {
        usage,
        isWarning,
        isCritical,
        isExceeded,
        wouldExceed,
        calculateTokens,
        updateMessages,
        trimToCritical,
        reset,
        lastTrimResult,
        isCalculating,
    };
}
/**
 * Get color for status (for UI integration)
 */
export function getStatusColor(status) {
    switch (status) {
        case 'safe':
            return 'green';
        case 'warning':
            return 'yellow';
        case 'critical':
            return 'orange';
        case 'exceeded':
            return 'red';
    }
}
/**
 * Format usage for display
 */
export function formatTokenUsage(usage) {
    const current = usage.current.toLocaleString();
    const max = usage.effectiveMax.toLocaleString();
    const percent = usage.utilizationPercent.toFixed(1);
    return `${current} / ${max} tokens (${percent}%)`;
}
/**
 * Create a pre-configured monitor for common models
 */
export function createModelBudgetMonitor(model, overrides) {
    const modelConfigs = {
        'gpt-4': { maxInputTokens: 8192, reservedForOutput: 2048 },
        'gpt-4-turbo': { maxInputTokens: 128000, reservedForOutput: 4096 },
        'gpt-4o': { maxInputTokens: 128000, reservedForOutput: 16384 },
        'claude-3-opus': { maxInputTokens: 200000, reservedForOutput: 4096 },
        'claude-3-5-sonnet': { maxInputTokens: 200000, reservedForOutput: 8192 },
    };
    return {
        ...modelConfigs[model],
        model: model,
        ...overrides,
    };
}
//# sourceMappingURL=use-token-budget-monitor.js.map