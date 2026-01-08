'use client';
import * as React from 'react';
import { ModelRouter, COMMON_MODELS } from '../../utils/api/model-router';
/**
 * Hook for intelligent model routing
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const router = useModelRouter({
 *     availableModels: [
 *       { id: 'gpt-3.5-turbo', tier: 'simple', ... },
 *       { id: 'gpt-4', tier: 'advanced', ... },
 *     ],
 *     onRoute: (decision) => {
 *       console.log(`Using ${decision.model.name}`)
 *       console.log(`Estimated cost: $${decision.estimatedCost.toFixed(4)}`)
 *       console.log(`Savings: ${decision.savingsPercent.toFixed(1)}%`)
 *     }
 *   })
 *
 *   const handleQuery = async (query: string) => {
 *     // Route to best model
 *     const decision = router.route(query, conversationHistory)
 *
 *     // Use the selected model
 *     const response = await queryAPI(query, {
 *       model: decision.model.id
 *     })
 *
 *     return response
 *   }
 *
 *   return (
 *     <div>
 *       <div>Total Queries: {router.stats.totalQueries}</div>
 *       <div>Average Savings: {router.stats.averageSavings.toFixed(1)}%</div>
 *       <div>Total Cost: ${router.stats.totalEstimatedCost.toFixed(4)}</div>
 *     </div>
 *   )
 * }
 * ```
 */
export function useModelRouter(options = {}) {
    const { availableModels = COMMON_MODELS, preferProvider, maxCost, learningEnabled = false, onRoute, } = options;
    const [lastDecision, setLastDecision] = React.useState(null);
    const [stats, setStats] = React.useState({
        totalQueries: 0,
        totalEstimatedCost: 0,
        totalActualCost: 0,
        averageSavings: 0,
        modelUsage: {},
    });
    // Create router instance (memoized)
    const router = React.useMemo(() => new ModelRouter(availableModels, {
        preferProvider,
        maxCost,
        learningEnabled,
    }), [availableModels, preferProvider, maxCost, learningEnabled]);
    const route = React.useCallback((query, context) => {
        const decision = router.route(query, context);
        setLastDecision(decision);
        setStats(router.getStats());
        onRoute?.(decision);
        return decision;
    }, [router, onRoute]);
    const recordFeedback = React.useCallback((index, actualCost, satisfaction) => {
        router.recordFeedback(index, actualCost, satisfaction);
        setStats(router.getStats());
    }, [router]);
    const clearHistory = React.useCallback(() => {
        router.clearHistory();
        setStats(router.getStats());
        setLastDecision(null);
    }, [router]);
    return {
        route,
        recordFeedback,
        stats,
        history: router.getHistory(),
        clearHistory,
        lastDecision,
    };
}
//# sourceMappingURL=use-model-router.js.map