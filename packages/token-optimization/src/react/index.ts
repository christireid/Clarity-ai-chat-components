/**
 * React Components and Hooks for Token Optimization
 *
 * This module exports React-specific functionality from the token-optimization package.
 * All exports are tree-shakeable and optimized for client-side use.
 *
 * @module react
 */

// Token Cost Preview Component + Hook
export { TokenCostPreview, useTokenEstimate } from './components/TokenCostPreview'
export type {
  TokenCostPreviewProps,
  UseTokenEstimateOptions,
  TokenEstimate,
} from './components/TokenCostPreview'

// Token Usage Meter Component (Animated version with framer-motion)
export { TokenUsageMeter, MODEL_PRICING_PRESETS } from './components/TokenUsageMeter'
export type {
  TokenUsage,
  ModelPricing,
  TokenUsageMeterProps,
} from './components/TokenUsageMeter'

// Token Usage Meter (Static version without framer-motion)
export { TokenUsageMeter as TokenUsageMeterStatic } from './components/TokenUsageMeter.static'
export type {
  TokenUsage as TokenUsageStatic,
  ModelPricing as ModelPricingStatic,
  TokenUsageMeterProps as TokenUsageMeterStaticProps,
} from './components/TokenUsageMeter.static'

// Token Optimization Badge Component
export { TokenOptimizationBadge } from './components/TokenOptimizationBadge'
export type { TokenOptimizationBadgeProps } from './components/TokenOptimizationBadge'

// Token Optimization Panel Component
export { TokenOptimizationPanel } from './components/TokenOptimizationPanel'
export type { TokenOptimizationPanelProps } from './components/TokenOptimizationPanel'

// Token Optimization Dashboard Component
export { TokenOptimizationDashboard } from './components/TokenOptimizationDashboard'
export type {
  TokenOptimizationDashboardProps,
  OptimizationMetrics,
} from './components/TokenOptimizationDashboard'

// Shared Types for Token Optimization Statistics
export type { TokenOptimizationStats } from './types'
export { createEmptyStats } from './types'
