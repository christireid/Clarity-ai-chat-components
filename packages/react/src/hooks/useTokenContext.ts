import { useState, useCallback } from 'react'
import { estimateTokens, countMessageTokens } from '../utils/token-counting'

export interface TokenContextConfig {
  /** The model identifier to use for pricing and context window */
  model: 'claude-opus-4-5-20251101' | 'gpt-4o' | 'gemini-2.0-flash' | string
  /** Maximum context window size in tokens */
  maxTokens: number
  /** Threshold (0-1) at which to trigger budget warnings */
  budgetThreshold: number
  /** Cost per 1k input tokens */
  costPer1kInput: number
  /** Cost per 1k output tokens */
  costPer1kOutput: number
}

export interface TokenUsage {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  budgetUsed: number
  estimatedCost: number
  isOverBudget: boolean
}

export function useTokenContext(config: TokenContextConfig) {
  const [usage, setUsage] = useState<TokenUsage>({
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    budgetUsed: 0,
    estimatedCost: 0,
    isOverBudget: false,
  })

  const updateUsage = useCallback(
    (messages: any[], completion: string = '') => {
      const input = countMessageTokens(messages)
      const output = estimateTokens(completion)
      const total = input + output

      const budgetUsed = total / config.maxTokens
      const isOverBudget = budgetUsed > config.budgetThreshold

      // Calculate cost (using per 1k pricing)
      const cost =
        (input / 1000) * config.costPer1kInput +
        (output / 1000) * config.costPer1kOutput

      setUsage({
        inputTokens: input,
        outputTokens: output,
        totalTokens: total,
        budgetUsed,
        estimatedCost: cost,
        isOverBudget,
      })
    },
    [config]
  )

  return {
    usage,
    updateUsage,
  }
}
