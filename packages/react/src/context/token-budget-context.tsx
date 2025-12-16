import { logger } from '@clarity-chat/utils/logger';
'use client'

import * as React from 'react'
import {
  useTokenBudgetMonitor,
  type TokenBudgetConfig,
  type TokenBudgetMonitorReturn,
  type TokenUsage,
  type BudgetMessage,
  type BudgetMonitorModel,
  createModelBudgetMonitor,
  isValidBudgetMonitorModel,
} from '../hooks/use-token-budget-monitor'

/**
 * Context value for the TokenBudget provider
 */
export interface TokenBudgetContextValue extends TokenBudgetMonitorReturn {
  /** Current model being used */
  model: BudgetMonitorModel | undefined
  /** Change the model (will recreate budget config) */
  setModel: (model: BudgetMonitorModel) => void
  /** Update the budget configuration */
  updateConfig: (config: Partial<TokenBudgetConfig>) => void
  /** Current configuration */
  config: TokenBudgetConfig
}

/**
 * Props for the TokenBudgetProvider component
 */
export interface TokenBudgetProviderProps {
  /** Initial configuration for the budget monitor */
  config?: TokenBudgetConfig
  /** Initial model (alternative to config, uses model presets) */
  model?: BudgetMonitorModel
  /** Configuration overrides when using model preset */
  configOverrides?: Partial<TokenBudgetConfig>
  /** Children components */
  children: React.ReactNode
}

const TokenBudgetContext = React.createContext<TokenBudgetContextValue | null>(
  null
)

/**
 * TokenBudgetProvider - Provides token budget state to child components
 *
 * Use this provider to share token budget state across multiple components
 * without prop drilling. Components can access the budget via useTokenBudget().
 *
 * @example
 * ```tsx
 * // Using a model preset
 * <TokenBudgetProvider model="gpt-4o">
 *   <ChatInterface />
 * </TokenBudgetProvider>
 *
 * // Using custom configuration
 * <TokenBudgetProvider config={{ maxInputTokens: 128000, warningThreshold: 0.7 }}>
 *   <ChatInterface />
 * </TokenBudgetProvider>
 *
 * // Using model preset with overrides
 * <TokenBudgetProvider model="claude-sonnet-4" configOverrides={{ autoTrim: true }}>
 *   <ChatInterface />
 * </TokenBudgetProvider>
 * ```
 */
export function TokenBudgetProvider({
  config: initialConfig,
  model: initialModel,
  configOverrides,
  children,
}: TokenBudgetProviderProps) {
  // Track current model
  const [currentModel, setCurrentModel] = React.useState<
    BudgetMonitorModel | undefined
  >(initialModel)

  // Build configuration from model or use provided config
  const [config, setConfig] = React.useState<TokenBudgetConfig>(() => {
    if (initialModel && isValidBudgetMonitorModel(initialModel)) {
      return {
        ...createModelBudgetMonitor(initialModel),
        ...configOverrides,
      }
    }
    return (
      initialConfig ?? {
        maxInputTokens: 128000,
        reservedForOutput: 4096,
      }
    )
  })

  // Use the underlying hook
  const budgetMonitor = useTokenBudgetMonitor(config)

  // Handle model change
  const setModel = React.useCallback(
    (newModel: BudgetMonitorModel) => {
      if (!isValidBudgetMonitorModel(newModel)) {
        logger.warn(
          `[TokenBudgetProvider] Invalid model: "${newModel}". Ignoring.`
        )
        return
      }

      setCurrentModel(newModel)
      setConfig({
        ...createModelBudgetMonitor(newModel),
        ...configOverrides,
      })
    },
    [configOverrides]
  )

  // Handle config update
  const updateConfig = React.useCallback(
    (updates: Partial<TokenBudgetConfig>) => {
      setConfig((prev) => ({
        ...prev,
        ...updates,
      }))
    },
    []
  )

  // Memoize context value
  const contextValue = React.useMemo<TokenBudgetContextValue>(
    () => ({
      ...budgetMonitor,
      model: currentModel,
      setModel,
      updateConfig,
      config,
    }),
    [budgetMonitor, currentModel, setModel, updateConfig, config]
  )

  return (
    <TokenBudgetContext.Provider value={contextValue}>
      {children}
    </TokenBudgetContext.Provider>
  )
}

TokenBudgetProvider.displayName = 'TokenBudgetProvider'

/**
 * Hook to access token budget context
 *
 * Must be used within a TokenBudgetProvider.
 *
 * @example
 * ```tsx
 * function TokenDisplay() {
 *   const { usage, isWarning, model, setModel } = useTokenBudget()
 *
 *   return (
 *     <div>
 *       <p>{usage.current} / {usage.effectiveMax} tokens</p>
 *       {isWarning && <span>Warning!</span>}
 *       <select
 *         value={model}
 *         onChange={(e) => setModel(e.target.value as BudgetMonitorModel)}
 *       >
 *         <option value="gpt-4o">GPT-4o</option>
 *         <option value="claude-sonnet-4">Claude Sonnet 4</option>
 *       </select>
 *     </div>
 *   )
 * }
 * ```
 */
export function useTokenBudget(): TokenBudgetContextValue {
  const context = React.useContext(TokenBudgetContext)

  if (!context) {
    throw new Error(
      '[useTokenBudget] must be used within a TokenBudgetProvider. ' +
        'Wrap your component tree with <TokenBudgetProvider>.'
    )
  }

  return context
}

/**
 * Hook to access token budget context with a fallback
 *
 * Unlike useTokenBudget(), this hook won't throw if used outside a provider.
 * Returns null if no provider is found.
 *
 * @example
 * ```tsx
 * function OptionalTokenDisplay() {
 *   const budget = useTokenBudgetOptional()
 *
 *   if (!budget) {
 *     return null // No provider, component is optional
 *   }
 *
 *   return <TokenBudgetBar usage={budget.usage} />
 * }
 * ```
 */
export function useTokenBudgetOptional(): TokenBudgetContextValue | null {
  return React.useContext(TokenBudgetContext)
}

// Re-export types for convenience
export type {
  TokenUsage,
  BudgetMessage,
  TokenBudgetConfig,
  TokenBudgetMonitorReturn,
  BudgetMonitorModel,
}
