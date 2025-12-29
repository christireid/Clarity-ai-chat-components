/**
 * Token Optimization Audit Harness
 *
 * Comprehensive instrumentation for measuring and validating token optimizations.
 */

// Types
export type {
  TokenMeasurement,
  PayloadSnapshot,
  OptimizationApplied,
  ProviderTokenUsage,
  EstimatedTokenUsage,
  TestScenario,
  MeasurementRunConfig,
  RunStatistics,
  RunComparison,
} from './types'

// Measurement Harness
export {
  TokenMeasurementHarness,
  createMeasurementHarness,
  parseProviderUsage,
  type HarnessConfig,
  type MeasurementContext,
} from './measurement-harness'

// Token Estimation
export {
  estimateTokens,
  estimateMessagesTokens,
  createPayloadSnapshot,
  calculateSavings,
  type TokenEstimate,
} from './token-estimator'

// Test Scenarios
export {
  ALL_SCENARIOS,
  SCENARIO_BY_ID,
  getScenariosByCategory,
  getDeterministicScenarios,
  getAdversarialScenarios,
  getReplayScenarios,
} from './scenarios'

// Test Runner
export {
  TokenOptimizationTestRunner,
  createTestRunner,
  type OptimizationConfig,
  type LLMProvider,
} from './test-runner'
