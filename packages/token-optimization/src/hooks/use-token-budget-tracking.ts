'use client'

/**
 * useTokenBudgetTracking - Token budget monitoring and analytics
 *
 * This is the new canonical name for token budget monitoring.
 * The hook tracks token usage across messages, provides threshold-based warnings,
 * and supports automatic trimming to prevent context overflow.
 *
 * This hook is for MONITORING and TRACKING purposes (analytics, warnings, auto-trim).
 * For component-specific budget UI (TokenBudgetBar), use useTokenBudgetBar from react package.
 *
 * @example
 * ```tsx
 * function ChatMonitor() {
 *   const { usage, isWarning, updateMessages } = useTokenBudgetTracking({
 *     maxInputTokens: 128000,
 *     reservedForOutput: 4096,
 *     onWarning: (usage) => toast.warning('Token budget at 80%'),
 *     autoTrim: true,
 *   })
 *
 *   useEffect(() => {
 *     updateMessages(messages)
 *   }, [messages])
 *
 *   return <TokenAnalyticsDashboard usage={usage} />
 * }
 * ```
 */

// Re-export everything from the original implementation
export {
  useTokenBudgetMonitor as useTokenBudgetTracking,
  getStatusColor,
  formatTokenUsage,
  createModelBudgetMonitor,
  isValidBudgetMonitorModel,
  estimateTokenCost,
  type TokenUsageStatus,
  type TokenBudgetUsage,
  type TokenUsage,
  type TrimResult,
  type BudgetMessage,
  type TokenBudgetConfig,
  type TokenBudgetMonitorReturn as TokenBudgetTrackingReturn,
  type BudgetMonitorModel,
  type TokenCostEstimate,
  type ModelName,
} from './use-token-budget-monitor'
