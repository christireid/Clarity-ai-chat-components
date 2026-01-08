/**
 * useQuickOptimize Hook
 *
 * Simplest possible hook for prompt optimization - zero configuration needed
 */
import { useState, useEffect, useCallback } from 'react';
import { quickOptimizeMessages, needsOptimization } from '../core/quick-start';
/**
 * Simplest hook for prompt optimization
 *
 * @example
 * ```tsx
 * const { optimizedMessages } = useQuickOptimize({
 *   messages: chatMessages,
 *   model: 'gpt-4',
 * })
 * ```
 */
export function useQuickOptimize(options) {
    const { messages, model = 'gpt-4', targetTokens, preset = 'balanced', autoOptimize = true, summarizeFn, } = options;
    const [optimizedMessages, setOptimizedMessages] = useState(messages);
    const [wasOptimized, setWasOptimized] = useState(false);
    const [tokenStats, setTokenStats] = useState({
        original: 0,
        optimized: 0,
        saved: 0,
    });
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [error, setError] = useState(null);
    const optimize = useCallback(async () => {
        if (messages.length === 0) {
            setOptimizedMessages([]);
            setWasOptimized(false);
            return;
        }
        // Check if optimization is needed
        const needsOpt = needsOptimization(messages, model, targetTokens);
        if (!needsOpt) {
            setOptimizedMessages(messages);
            setWasOptimized(false);
            setTokenStats({
                original: 0,
                optimized: 0,
                saved: 0,
            });
            return;
        }
        setIsOptimizing(true);
        setError(null);
        try {
            const result = await quickOptimizeMessages(messages, model, {
                targetTokens,
                preset,
                summarizeFn,
            });
            setOptimizedMessages(result.messages);
            setWasOptimized(true);
            setTokenStats({
                original: result.tokenStats.original,
                optimized: result.tokenStats.optimized,
                saved: result.tokenStats.saved,
            });
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            // Only log in development
            if (process.env.NODE_ENV === 'development') {
                logger.logger.error('[useQuickOptimize] Optimization failed:', error);
            }
            // Fallback to original messages
            setOptimizedMessages(messages);
            setWasOptimized(false);
        }
        finally {
            setIsOptimizing(false);
        }
    }, [messages, model, targetTokens, preset, summarizeFn]);
    // Auto-optimize when messages change
    useEffect(() => {
        if (autoOptimize) {
            optimize();
        }
    }, [autoOptimize, optimize]);
    return {
        optimizedMessages,
        wasOptimized,
        tokenStats,
        isOptimizing,
        error,
        optimize,
    };
}
//# sourceMappingURL=use-quick-optimize.js.map