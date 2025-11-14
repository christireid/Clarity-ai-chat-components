/**
 * usePromptDebugger Hook
 * 
 * Dev tool for inspecting prompt optimization pipeline
 */

import { useState, useCallback, useMemo } from 'react'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import type {
  PromptDebugInfo,
  OptimizationEngineResult,
} from '../core/advanced-types'
import { optimizePrompt, type PromptOptimizationOptions } from '../core/engine'
import type { ModelProfile } from '../core/model-profiles'

export interface UsePromptDebuggerOptions {
  /** Messages to debug */
  messages: CoreMessage[]
  /** Model profile */
  model: ModelProfile
  /** Target tokens */
  targetTokens: number
  /** Optimization options */
  options?: Partial<PromptOptimizationOptions>
  /** Whether debug mode is enabled */
  enabled?: boolean
}

export interface UsePromptDebuggerReturn {
  /** Debug information */
  debugInfo: PromptDebugInfo | null
  /** Full optimization result */
  optimizationResult: OptimizationEngineResult | null
  /** Whether debugging is in progress */
  isDebugging: boolean
  /** Error if debugging failed */
  error: Error | null
  /** Manually trigger debug */
  debug: () => Promise<void>
  /** Clear debug info */
  clear: () => void
}

/**
 * Hook for debugging prompt optimization
 */
export function usePromptDebugger(
  options: UsePromptDebuggerOptions
): UsePromptDebuggerReturn {
  const {
    messages,
    model,
    targetTokens,
    options: optimizationOptions,
    enabled = true,
  } = options

  const [optimizationResult, setOptimizationResult] =
    useState<OptimizationEngineResult | null>(null)
  const [isDebugging, setIsDebugging] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const debug = useCallback(async () => {
    if (!enabled) return

    setIsDebugging(true)
    setError(null)

    try {
      const result = await optimizePrompt({
        messages,
        modelProfile: model,
        targetTokens,
        debug: true,
        enableSemanticPrioritization: true,
        enableCompression: true,
        ...optimizationOptions,
      })

      setOptimizationResult(result)

      // Build debug info from result
      const debugInfo: PromptDebugInfo = {
        history: result.diagnostics.stages.map((stage, index) => ({
          timestamp: Date.now() - (result.diagnostics.stages.length - index) * 100,
          stage: stage.stage,
          action: `Optimized from ${stage.tokensBefore} to ${stage.tokensAfter} tokens`,
          tokensBefore: stage.tokensBefore,
          tokensAfter: stage.tokensAfter,
          details: {
            duration: stage.duration,
          },
        })),
        tokenCounts: result.diagnostics.stages.map((stage) => ({
          stage: stage.stage,
          tokens: stage.tokensAfter,
          breakdown: {
            total: stage.tokensAfter,
          },
        })),
        compressionLogs: result.diagnostics.compression
          ? [
              {
                strategy: 'compression',
                inputMessages: messages.length,
                outputMessages: result.messages.length,
                tokensSaved:
                  result.diagnostics.compression.stats.originalTokens -
                  result.diagnostics.compression.stats.compressedTokens,
              },
            ]
          : [],
        routingDecisions: result.diagnostics.routing
          ? [
              {
                timestamp: Date.now(),
                toModel: model.model,
                reason: result.diagnostics.routing.strategy,
              },
            ]
          : [],
      }

      // Store debug info in result for access
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(result as any).debugInfo = debugInfo
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      if (process.env.NODE_ENV === 'development') {
        console.error('[usePromptDebugger] Debugging failed:', error)
      }
    } finally {
      setIsDebugging(false)
    }
  }, [enabled, messages, model, targetTokens, optimizationOptions])

  const clear = useCallback(() => {
    setOptimizationResult(null)
    setError(null)
  }, [])

  const debugInfo = useMemo(() => {
    if (!optimizationResult) return null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (optimizationResult as any).debugInfo as PromptDebugInfo | null
  }, [optimizationResult])

  return {
    debugInfo,
    optimizationResult,
    isDebugging,
    error,
    debug,
    clear,
  }
}
