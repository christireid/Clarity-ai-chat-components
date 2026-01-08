/**
 * Token Optimization Test Scenarios
 *
 * Comprehensive suite of 30 scenarios for rigorous token optimization testing.
 * - 20 deterministic scenarios
 * - 5 adversarial "token bomb" scenarios
 * - 5 replay/regression scenarios
 */
import type { TestScenario } from './types';
export declare const ALL_SCENARIOS: TestScenario[];
export declare const SCENARIO_BY_ID: Map<string, TestScenario>;
export declare function getScenariosByCategory(category: TestScenario['category']): TestScenario[];
export declare function getDeterministicScenarios(): TestScenario[];
export declare function getAdversarialScenarios(): TestScenario[];
export declare function getReplayScenarios(): TestScenario[];
//# sourceMappingURL=scenarios.d.ts.map