/**
 * Token Optimizer Barrel Export
 *
 * Re-exports TokenCounter and ContextOptimizer from their respective modules.
 * This file provides backward compatibility for imports using './token-optimizer'.
 */

export { TokenCounter } from './utils/token-counter'
export type {
  ModelFamily,
  ContentType,
  TokenCountResult,
} from './utils/token-counter'

export { ContextOptimizer } from './utils/context-optimizer'
export type {
  TokenBudgetAllocation,
  CompressedMemory,
  TokenOptimizationConfig,
} from './utils/context-optimizer'
