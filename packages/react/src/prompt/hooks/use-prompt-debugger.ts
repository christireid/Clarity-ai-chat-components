/**
 * usePromptDebugger Hook
 * 
 * Provides step-by-step optimization history, token breakdowns,
 * compression logs, model routing decisions, and DSL transformations
 */

import { useState, useMemo, useCallback } from 'react'
import type { OptimizedPromptResult } from '../core/prompt-optimizer'
import type { OptimizationStage } from '../core/prompt-optimizer'
import type { ModelMetadata } from '../core/types'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import { estimateMessageTokens } from '../core/token-estimation'

/**
 * Hook options
 */
export interface UsePromptDebuggerOptions {
  /** Optimization result to debug */
  result?: OptimizedPromptResult | null
  /** Original messages */
  originalMessages?: CoreMessage[]
  /** Model metadata */
  model?: ModelMetadata
  /** Enable debug mode */
  enabled?: boolean
}

/**
 * Message token breakdown
 */
export interface MessageTokenBreakdown {
  /** Message index */
  index: number
  /** Message role */
  role: string
  /** Message content preview */
  contentPreview: string
  /** Token count */
  tokens: number
  /** Whether message was modified */
  modified?: boolean
  /** Modification details */
  modificationDetails?: string
}

/**
 * Debug information
 */
export interface PromptDebugInfo {
  /** Optimization stages */
  stages: OptimizationStage[]
  /** Token breakdown by message */
  messageBreakdown: MessageTokenBreakdown[]
  /** Compression logs */
  compressionLogs: string[]
  /** Model routing decisions */
  routingDecisions: string[]
  /** DSL transformations */
  dslTransformations: string[]
  /** Total original tokens */
  totalOriginalTokens: number
  /** Total optimized tokens */
  totalOptimizedTokens: number
  /** Token savings */
  tokenSavings: number
  /** Cost savings */
  costSavings: number
}

/**
 * Hook return value
 */
export interface UsePromptDebuggerReturn {
  /** Debug information */
  debugInfo: PromptDebugInfo
  /** Whether debugger is enabled */
  enabled: boolean
  /** Toggle debugger */
  toggle: () => void
  /** Refresh debug info */
  refresh: () => void
  /** Export debug info as JSON */
  exportDebugInfo: () => string
}

/**
 * Hook for prompt debugging
 * 
 * @example
 * ```tsx
 * const { debugInfo, exportDebugInfo } = usePromptDebugger({
 *   result: optimizationResult,
 *   originalMessages: messages,
 *   model: { id: 'gpt-4', maxTokens: 8192 },
 *   enabled: true,
 * })
 * ```
 */
export function usePromptDebugger(
  options: UsePromptDebuggerOptions
): UsePromptDebuggerReturn {
  const {
    result,
    originalMessages = [],
    model,
    enabled: initialEnabled = false,
  } = options

  const [enabled, setEnabled] = useState(initialEnabled)

  const toggle = useCallback(() => {
    setEnabled(prev => !prev)
  }, [])

  const refresh = useCallback(() => {
    // Force re-computation by toggling
    setEnabled(prev => {
      setEnabled(!prev)
      return !prev
    })
  }, [])

  // Build debug info
  const debugInfo = useMemo((): PromptDebugInfo => {
    if (!result || !enabled) {
      return {
        stages: [],
        messageBreakdown: [],
        compressionLogs: [],
        routingDecisions: [],
        dslTransformations: [],
        totalOriginalTokens: 0,
        totalOptimizedTokens: 0,
        tokenSavings: 0,
        costSavings: 0,
      }
    }

    // Extract stages
    const stages = result.diagnostics.stages || []

    // Build message breakdown
    const messageBreakdown: MessageTokenBreakdown[] = result.messages.map(
      (msg, index) => {
        const tokens = estimateMessageTokens(msg, { model: model?.id })
        const content =
          typeof msg.content === 'string'
            ? msg.content
            : JSON.stringify(msg.content)
        const contentPreview =
          content.length > 100 ? content.slice(0, 100) + '...' : content

        // Check if message was modified
        const originalMsg = originalMessages[index]
        const modified = originalMsg
          ? JSON.stringify(originalMsg) !== JSON.stringify(msg)
          : false

        // Check for compression tags
        const tags = 'tags' in msg ? msg.tags || [] : []
        const isCompressed = tags.includes('compressed-context')
        const modificationDetails = isCompressed
          ? `Compressed (${tags.join(', ')})`
          : modified
            ? 'Modified during optimization'
            : undefined

        return {
          index,
          role: msg.role,
          contentPreview,
          tokens,
          modified,
          modificationDetails,
        }
      }
    )

    // Extract compression logs
    const compressionLogs: string[] = []
    if (result.diagnostics.compressionStats) {
      const stats = result.diagnostics.compressionStats
      compressionLogs.push(
        `Compression ratio: ${stats.compressionRatio.toFixed(2)}`,
        `Original messages: ${stats.originalCount}`,
        `Compressed messages: ${stats.compressedCount}`,
        `Token savings: ${stats.tokenSavings}`
      )
    }

    // Extract routing decisions
    const routingDecisions: string[] = []
    if (result.strategy) {
      routingDecisions.push(`Strategy: ${result.strategy}`)
    }
    routingDecisions.push(
      `Original tokens: ${result.tokenStats.originalTokens}`,
      `Optimized tokens: ${result.tokenStats.optimizedTokens}`,
      `Savings: ${result.tokenStats.savings} tokens (${result.tokenStats.savingsPercent.toFixed(1)}%)`
    )

    // Extract DSL transformations
    const dslTransformations: string[] = []
    for (const stage of stages) {
      if (stage.name === 'toon-composition' || stage.name === 'style-transformation') {
        dslTransformations.push(
          `${stage.name}: ${stage.details?.join(', ') || 'N/A'}`
        )
      }
    }

    return {
      stages,
      messageBreakdown,
      compressionLogs,
      routingDecisions,
      dslTransformations,
      totalOriginalTokens: result.tokenStats.originalTokens,
      totalOptimizedTokens: result.tokenStats.optimizedTokens,
      tokenSavings: result.tokenStats.savings,
      costSavings: result.costEstimate.savings,
    }
  }, [result, enabled, originalMessages, model])

  const exportDebugInfo = useCallback((): string => {
    return JSON.stringify(debugInfo, null, 2)
  }, [debugInfo])

  return {
    debugInfo,
    enabled,
    toggle,
    refresh,
    exportDebugInfo,
  }
}
