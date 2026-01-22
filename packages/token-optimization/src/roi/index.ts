/**
 * ROI Calculator Module
 *
 * Calculate and track return on investment from token optimization.
 */

export {
  ROICalculator,
  calculateQuickROI,
  estimateMonthlySavings,
  compareModels,
  calculateBreakEven,
  MODEL_PRICING,
} from './roi-calculator'

export type {
  ModelPricing,
  OptimizationSavings,
  UsageStats,
  ROIResult,
  ROIPeriod,
} from './roi-calculator'
