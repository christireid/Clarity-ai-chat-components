/**
 * React Entry Point for Token Optimization
 *
 * Import from '@clarity-chat/token-optimization/react' for React-specific features.
 * This keeps bundle size smaller for non-React users.
 *
 * @module react
 */

// React Hooks
export {
  useTieredCache,
  useModelRouter,
  useOptimizationPipeline,
} from './hooks'

export type {
  UseTieredCacheConfig,
  UseTieredCacheReturn,
  UseModelRouterConfig,
  UseModelRouterReturn,
  OptimizationPipelineConfig,
  PipelineResult,
  PipelineStats,
  UseOptimizationPipelineReturn,
} from './hooks'

// React Components
export { TokenBudgetBar, useTokenBudget } from './components'

export type {
  BudgetStatus as TokenBudgetStatus,
  TokenBudgetTheme,
  TokenBudgetBarProps,
  UseTokenBudgetConfig,
  UseTokenBudgetReturn,
} from './components'

// Accessibility Hooks (React-specific)
export {
  useTokenAnnouncer,
  useTokenKeyboardShortcuts,
  usePrefersReducedMotion,
  usePrefersHighContrast,
  AccessibleTokenDisplay,
  MemoizedAccessibleTokenDisplay,
  useTokenDisplayState,
} from './accessibility'

export type {
  TokenAnnouncerOptions,
  UseTokenAnnouncerReturn,
  KeyboardShortcutOptions,
  ReducedMotionOptions,
  AccessibleTokenDisplayProps,
  TokenDisplayState,
} from './accessibility'

// Unified hook for simple usage
export { useTokenOptimization } from './hooks/use-token-optimization'
export type {
  UseTokenOptimizationConfig,
  UseTokenOptimizationReturn,
  TokenOptimizationPreset,
} from './hooks/use-token-optimization'
