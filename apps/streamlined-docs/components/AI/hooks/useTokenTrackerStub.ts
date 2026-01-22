/**
 * Token Tracker Stub for Docs Site
 *
 * A simple stub implementation that mimics useTokenTracker without
 * requiring tiktoken's WASM file which doesn't work with Turbopack.
 * Uses simple character-based estimation instead.
 */

import { useState, useCallback } from 'react'

interface TokenTrackerOptions {
  modelName?: string
  maxTokens?: number
  warningThreshold?: number
  criticalThreshold?: number
  onWarning?: () => void
  onCritical?: () => void
}

interface TokenTrackerMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * Simple stub for token tracking that doesn't use tiktoken
 * Uses ~4 characters per token estimation
 */
export function useTokenTrackerStub(options: TokenTrackerOptions = {}) {
  const {
    maxTokens = 200000,
    warningThreshold = 0.8,
    criticalThreshold = 0.95,
    onWarning,
    onCritical,
  } = options

  const [tokenCount, setTokenCount] = useState(0)

  // Simple estimation: ~4 characters per token
  const estimateTokens = (text: string): number => {
    return Math.ceil(text.length / 4)
  }

  const addMessage = useCallback(
    (message: TokenTrackerMessage) => {
      const tokens = estimateTokens(message.content)
      setTokenCount((prev) => {
        const newCount = prev + tokens
        const ratio = newCount / maxTokens

        if (ratio >= criticalThreshold && onCritical) {
          onCritical()
        } else if (ratio >= warningThreshold && onWarning) {
          onWarning()
        }

        return newCount
      })
    },
    [maxTokens, warningThreshold, criticalThreshold, onWarning, onCritical]
  )

  const clear = useCallback(() => {
    setTokenCount(0)
  }, [])

  return {
    tokenCount,
    maxTokens,
    percentage: (tokenCount / maxTokens) * 100,
    isWarning: tokenCount / maxTokens >= warningThreshold,
    isCritical: tokenCount / maxTokens >= criticalThreshold,
    addMessage,
    clear,
  }
}
