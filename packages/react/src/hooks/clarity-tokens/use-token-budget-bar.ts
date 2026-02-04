'use client'

/**
 * useTokenBudgetBar - Session token budget management for UI components
 *
 * This is the new canonical name for component-specific token budget tracking.
 * Designed to work with TokenBudgetBar and other UI components that display
 * session-level token usage and enforce spending limits.
 *
 * This hook is for COMPONENT/UI purposes (visual budget bars, session limits).
 * For monitoring/analytics/auto-trim, use useTokenBudgetTracking from token-optimization package.
 *
 * Key features:
 * - Session-level budget tracking
 * - Usage history with persistence
 * - Pre-spend validation (assertCanSpend, canSpend)
 * - Token reservation for planned operations
 * - Alert thresholds with callbacks
 *
 * @example
 * ```tsx
 * function ChatWithBudget() {
 *   const budget = useTokenBudgetBar({
 *     sessionBudgetTokens: 200000,
 *     alertThresholds: { warning: 0.8, critical: 0.95 },
 *     persist: true,
 *   })
 *
 *   return (
 *     <div>
 *       <TokenBudgetBar
 *         current={budget.usedTokens}
 *         max={budget.config.sessionBudgetTokens}
 *       />
 *       <ChatInterface
 *         onSend={async (message) => {
 *           budget.assertCanSpend(estimateTokens(message))
 *           const response = await sendMessage(message)
 *           budget.registerUsage(response.usage)
 *         }}
 *       />
 *     </div>
 *   )
 * }
 * ```
 */

// Re-export everything from the original implementation
export {
  useTokenBudget as useTokenBudgetBar,
  BudgetExceededError,
  type UseTokenBudgetConfig as UseTokenBudgetBarConfig,
  type UseTokenBudgetReturn as UseTokenBudgetBarReturn,
  type TokenUsageRecord,
  type TokenBudgetStatus,
} from './use-token-budget'
