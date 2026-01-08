/**
 * Token Optimization Audit Harness
 *
 * Comprehensive instrumentation for measuring and validating token optimizations.
 */
export type { TokenMeasurement, PayloadSnapshot, OptimizationApplied, ProviderTokenUsage, EstimatedTokenUsage, TestScenario, MeasurementRunConfig, RunStatistics, RunComparison, } from './types';
export { TokenMeasurementHarness, createMeasurementHarness, parseProviderUsage, type HarnessConfig, type MeasurementContext, } from './measurement-harness';
export { estimateTokens, estimateMessagesTokens, createPayloadSnapshot, calculateSavings, type TokenEstimate, } from './token-estimator';
export { ALL_SCENARIOS, SCENARIO_BY_ID, getScenariosByCategory, getDeterministicScenarios, getAdversarialScenarios, getReplayScenarios, } from './scenarios';
export { TokenOptimizationTestRunner, createTestRunner, type OptimizationConfig, type LLMProvider, } from './test-runner';
//# sourceMappingURL=index.d.ts.map