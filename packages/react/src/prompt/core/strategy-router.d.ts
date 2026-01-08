/**
 * Adaptive Strategy Routing
 *
 * Intelligently chooses optimization strategy based on:
 * - Current token usage vs budget
 * - Cost constraints
 * - Model capabilities
 */
import type { ModelProfile } from './model-profiles';
import type { OptimizationStrategy } from './optimizer';
import type { CompressionStrategy } from './compression-chain';
/**
 * Strategy selection result
 */
export interface StrategySelection {
    /** Primary optimization strategy */
    strategy: OptimizationStrategy;
    /** Additional compression strategies */
    compressionStrategies: CompressionStrategy[];
    /** Reasoning for selection */
    reasoning: string;
    /** Severity level (0-1) */
    severity: number;
}
/**
 * Model switch recommendation
 */
export interface ModelSwitchRecommendation {
    /** Should switch models */
    shouldSwitch: boolean;
    /** Recommended model name */
    recommendedModel?: string;
    /** Reasoning */
    reasoning: string;
    /** Estimated cost savings */
    costSavings?: number;
}
/**
 * Choose optimization strategy based on current state
 */
export declare function chooseOptimizationStrategy(currentTokens: number, targetTokens: number, modelProfile?: ModelProfile): StrategySelection;
/**
 * Determine if model should be switched (async version with optional API call)
 */
export declare function shouldSwitchModel(currentModel: ModelProfile | string, targetTokens: number, costBudget?: number, availableModels?: Record<string, ModelProfile>): Promise<ModelSwitchRecommendation>;
/**
 * Determine if model should be switched (sync version)
 */
export declare function shouldSwitchModelSync(currentModel: ModelProfile | string, targetTokens: number, costBudget?: number, availableModels?: Record<string, ModelProfile>): ModelSwitchRecommendation;
/**
 * Analyze token capacity for routing decisions
 */
export declare function analyzeTokenCapacity(currentTokens: number, modelProfile: ModelProfile): {
    utilization: number;
    headroom: number;
    canAcceptMore: boolean;
    recommendedMaxAddition: number;
};
/**
 * Get routing recommendation for a request
 */
export declare function getRoutingRecommendation(estimatedInputTokens: number, estimatedOutputTokens: number, currentModel: ModelProfile | string, preferences?: {
    preferSpeed?: boolean;
    preferCost?: boolean;
    preferQuality?: boolean;
}): {
    recommendedModel: string;
    reasoning: string;
    alternativeModels: string[];
};
//# sourceMappingURL=strategy-router.d.ts.map