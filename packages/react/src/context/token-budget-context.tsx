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
} from '../hooks/token/use-token-budget-monitor'

/**
 * Configuration context value (Stable)
 */
export interface TokenConfigContextValue {
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
 * State context value (Volatile - updates on every keypress/token change)
 */
export interface TokenStateContextValue extends TokenBudgetMonitorReturn {}

/**
 * Combined context value (Legacy)
 */
export interface TokenBudgetContextValue
  extends TokenStateContextValue, TokenConfigContextValue {}

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

// Split contexts to prevent re-renders
const TokenConfigContext = React.createContext<TokenConfigContextValue | null>(
  null
)
const TokenStateContext = React.createContext<TokenStateContextValue | null>(
  null
)

/**
 * TokenBudgetProvider - Provides token budget state to child components
 *
 * Use this provider to share token budget state across multiple components
 * without prop drilling.
 *
 * **Performance Note**: This provider splits state and configuration internally.
 * Use `useTokenConfig()` for stable setters and `useTokenState()` for volatile usage data.
 *
 * @example
 * ```tsx
 * <TokenBudgetProvider model="gpt-4o">
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
        console.warn(
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

  // Memoize config context (Stable)
  const configContextValue = React.useMemo<TokenConfigContextValue>(
    () => ({
      model: currentModel,
      setModel,
      updateConfig,
      config,
    }),
    [currentModel, setModel, updateConfig, config]
  )

  // Memoize state context (Volatile)
  const stateContextValue = React.useMemo<TokenStateContextValue>(
    () => ({
      ...budgetMonitor,
    }),
    [budgetMonitor]
  )

  return (
    <TokenConfigContext.Provider value={configContextValue}>
      <TokenStateContext.Provider value={stateContextValue}>
        {children}
      </TokenStateContext.Provider>
    </TokenConfigContext.Provider>
  )
}

TokenBudgetProvider.displayName = 'TokenBudgetProvider'

/**
 * Hook to access token budget configuration and setters.
 * This hook is STABLE and will not re-render when token usage changes.
 */
export function useTokenConfig(): TokenConfigContextValue {
  const context = React.useContext(TokenConfigContext)
  if (!context) {
    throw new Error(
      '[useTokenConfig] must be used within a TokenBudgetProvider'
    )
  }
  return context
}

/**
 * Hook to access token usage statistics.
 * This hook is VOLATILE and will re-render whenever token counts update.
 */
export function useTokenState(): TokenStateContextValue {
  const context = React.useContext(TokenStateContext)
  if (!context) {
    throw new Error('[useTokenState] must be used within a TokenBudgetProvider')
  }
  return context
}

/**
 * Legacy hook to access all token budget context.
 * **Warning**: Using this hook will cause re-renders on every token update.
 * Prefer `useTokenConfig()` or `useTokenState()` for better performance.
 */
export function useTokenBudget(): TokenBudgetContextValue {
  const config = useTokenConfig()
  const state = useTokenState()

  return React.useMemo(
    () => ({
      ...config,
      ...state,
    }),
    [config, state]
  )
}

/**
 * Hook to access token budget context with a fallback
 */
export function useTokenBudgetOptional(): TokenBudgetContextValue | null {
  const config = React.useContext(TokenConfigContext)
  const state = React.useContext(TokenStateContext)

  if (!config || !state) return null

  return { ...config, ...state }
}

// Re-export types for convenience
export type {
  TokenUsage,
  BudgetMessage,
  TokenBudgetConfig,
  TokenBudgetMonitorReturn,
  BudgetMonitorModel,
}
