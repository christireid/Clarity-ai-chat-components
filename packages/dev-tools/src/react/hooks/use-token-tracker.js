/**
 * React hook for AI Token Usage Tracking
 *
 * Track and monitor AI token usage, costs, and receive optimization recommendations.
 * Supports multiple providers (OpenAI, Anthropic, Google, Mistral) with accurate pricing.
 *
 * @module useTokenTracker
 *
 * @example
 * ```tsx
 * import { useTokenTracker } from '@clarity-chat/dev-tools'
 *
 * function ChatComponent() {
 *   const { stats, track, estimateCost } = useTokenTracker({
 *     budget: { daily: 10.00, warningThreshold: 0.8 },
 *     onBudgetWarning: (msg) => console.warn(msg)
 *   })
 *
 *   const handleResponse = (response) => {
 *     track({
 *       provider: 'openai',
 *       model: 'gpt-4o-mini',
 *       usage: response.usage
 *     })
 *   }
 *
 *   return <div>Total cost: ${stats.totalCost.toFixed(4)}</div>
 * }
 * ```
 */
'use client';
import * as React from 'react';
import { getTokenTracker, createTokenTracker, } from '../../debug/token-tracker';
/**
 * Hook to track AI token usage across multiple providers
 *
 * @param options - Configuration for token tracking and budget alerts
 * @returns Object with stats, tracking functions, and cost estimation
 *
 * @see {@link TokenTracker} for the underlying implementation
 */
export function useTokenTracker(options = {}) {
    const { enabled = process.env.NODE_ENV === 'development', customPricing, budget, onBudgetWarning, } = options;
    const tracker = React.useMemo(() => {
        if (customPricing || budget) {
            return createTokenTracker({ enabled, customPricing, budget });
        }
        return getTokenTracker();
    }, [enabled, customPricing, budget]);
    const [stats, setStats] = React.useState(() => tracker.getStats());
    const [events, setEvents] = React.useState([]);
    // Subscribe to token events
    React.useEffect(() => {
        const unsubscribe = tracker.addListener((event, newStats) => {
            setStats(newStats);
            setEvents(tracker.getEvents(50));
        });
        // Initial load
        setStats(tracker.getStats());
        setEvents(tracker.getEvents(50));
        return unsubscribe;
    }, [tracker]);
    const track = React.useCallback((trackOptions) => {
        return tracker.track(trackOptions);
    }, [tracker]);
    const estimateCost = React.useCallback((model, promptTokens, completionTokens) => {
        const cost = tracker.estimateCost(model, promptTokens, completionTokens);
        return {
            promptCost: cost.promptCost,
            completionCost: cost.completionCost,
            totalCost: cost.totalCost,
        };
    }, [tracker]);
    const getRecommendations = React.useCallback(() => {
        return tracker.getOptimizationRecommendations();
    }, [tracker]);
    const clear = React.useCallback(() => {
        tracker.clear();
        setStats(tracker.getStats());
        setEvents([]);
    }, [tracker]);
    const exportData = React.useCallback(() => {
        return tracker.export();
    }, [tracker]);
    return {
        stats,
        events,
        track,
        estimateCost,
        getRecommendations,
        clear,
        export: exportData,
    };
}
export default useTokenTracker;
//# sourceMappingURL=use-token-tracker.js.map