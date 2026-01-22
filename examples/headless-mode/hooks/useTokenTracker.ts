import { useState, useCallback } from 'react'

/**
 * Token estimation constants for different models.
 * Adjust based on actual tokenizer behavior.
 */
const CHARS_PER_TOKEN = 4 // Rough estimate: ~4 characters per token

/**
 * Pricing per 1K tokens (as of Dec 2024)
 */
const MODEL_PRICING = {
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-4o': { input: 0.0025, output: 0.01 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  claude: { input: 0.008, output: 0.024 },
} as const

export type ModelKey = keyof typeof MODEL_PRICING

/**
 * Simple token estimation based on character count.
 * For production, use @clarity-chat/token-optimization for accurate counting.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN)
}

/**
 * Custom hook for tracking token usage and estimating costs.
 *
 * @example
 * ```tsx
 * const { totalTokens, estimatedCost, trackTokens } = useTokenTracker('gpt-4-turbo')
 *
 * // Track user message
 * const userTokens = estimateTokens(input)
 * trackTokens(userTokens, 'input')
 *
 * // Track AI response
 * const responseTokens = estimateTokens(response)
 * trackTokens(responseTokens, 'output')
 * ```
 */
export function useTokenTracker(model: ModelKey = 'gpt-4-turbo') {
  const [totalTokens, setTotalTokens] = useState({ input: 0, output: 0 })

  const trackTokens = useCallback(
    (tokens: number, type: 'input' | 'output') => {
      setTotalTokens((prev) => ({
        ...prev,
        [type]: prev[type] + tokens,
      }))
    },
    []
  )

  const resetTokens = useCallback(() => {
    setTotalTokens({ input: 0, output: 0 })
  }, [])

  const estimatedCost = (() => {
    const pricing = MODEL_PRICING[model]
    const inputCost = (totalTokens.input / 1000) * pricing.input
    const outputCost = (totalTokens.output / 1000) * pricing.output
    return inputCost + outputCost
  })()

  return {
    totalTokens,
    estimatedCost,
    trackTokens,
    resetTokens,
    total: totalTokens.input + totalTokens.output,
  }
}
