/**
 * usePromptDebugger Hook
 *
 * Dev tool hook that provides:
 * - Step-by-step optimization history
 * - Before/after token counts per stage
 * - Compression logs
 * - Model routing decisions
 * - DSL transformations
 */

import { useMemo } from 'react'
import type { CoreMessage } from '../../internal/hooks/use-chat-enhanced'
import type { OptimizationStage, OptimizationDiagnostics } from '../core'
import type { ModelRoutingDecision } from './use-dynamic-model-routing'

/**
 * Extended message type with optional metadata
 */
interface MessageWithMetadata extends CoreMessage {
  metadata?: {
    compressed?: boolean
    originalTokens?: number
    originalLength?: number
    compressedTokens?: number
    compressionType?: string
    originalCount?: number
    styleTransformed?: string
  }
}

/**
 * Optimization history entry
 */
export interface OptimizationHistoryEntry {
  /** Timestamp */
  timestamp: number
  /** Stage name */
  stage: string
  /** Tokens before */
  tokensBefore: number
  /** Tokens after */
  tokensAfter: number
  /** Tokens saved */
  tokensSaved: number
  /** Details */
  details: string[]
  /** Duration in ms */
  duration?: number
}

/**
 * Compression log entry
 */
export interface CompressionLogEntry {
  /** Message ID */
  messageId: string
  /** Original content length */
  originalLength: number
  /** Compressed content length */
  compressedLength: number
  /** Compression ratio */
  compressionRatio: number
  /** Compression type */
  compressionType: string
  /** Original message count (if grouped) */
  originalCount?: number
}

/**
 * DSL transformation entry
 */
export interface DSLTransformationEntry {
  /** Transformation type */
  type: 'style' | 'structure' | 'metadata'
  /** Before */
  before: string
  /** After */
  after: string
  /** Description */
  description: string
}

/**
 * Options for usePromptDebugger
 */
export interface UsePromptDebuggerOptions {
  /** Optimization diagnostics */
  diagnostics?: OptimizationDiagnostics
  /** Model routing decision */
  routingDecision?: ModelRoutingDecision
  /** Messages before optimization */
  messagesBefore?: MessageWithMetadata[]
  /** Messages after optimization */
  messagesAfter?: MessageWithMetadata[]
  /** Whether to include detailed logs */
  detailed?: boolean
}

/**
 * Return value of usePromptDebugger
 */
export interface UsePromptDebuggerReturn {
  /** Optimization history */
  optimizationHistory: OptimizationHistoryEntry[]
  /** Compression logs */
  compressionLogs: CompressionLogEntry[]
  /** DSL transformations */
  dslTransformations: DSLTransformationEntry[]
  /** Model routing log */
  modelRoutingLog: {
    currentModel: string
    recommendedModel: string
    shouldSwitch: boolean
    reasoning: string
    timestamp: number
  } | null
  /** Token graph data */
  tokenGraph: Array<{
    stage: string
    tokens: number
    timestamp: number
  }>
  /** Summary statistics */
  summary: {
    totalStages: number
    totalTokensSaved: number
    compressionRatio: number
    optimizationDuration: number
    wasOptimized: boolean
  }
  /** Formatted debug view */
  formattedView: {
    summary: string
    stages: string[]
    compressionDetails: string[]
    routingDetails: string[]
  }
}

/**
 * Hook for prompt debugging
 */
export function usePromptDebugger(
  options: UsePromptDebuggerOptions
): UsePromptDebuggerReturn {
  const {
    diagnostics,
    routingDecision,
    messagesBefore = [],
    messagesAfter = [],
    detailed = true,
  } = options

  // Build optimization history from diagnostics
  const optimizationHistory = useMemo<OptimizationHistoryEntry[]>(() => {
    if (!diagnostics) {
      return []
    }

    return diagnostics.stages.map((stage: OptimizationStage) => ({
      timestamp: Date.now(),
      stage: stage.name,
      tokensBefore: stage.tokensBefore,
      tokensAfter: stage.tokensAfter,
      tokensSaved: stage.tokensSaved,
      details: stage.details,
      duration: stage.duration,
    }))
  }, [diagnostics])

  // Extract compression logs from messages
  const compressionLogs = useMemo<CompressionLogEntry[]>(() => {
    const logs: CompressionLogEntry[] = []

    for (const msg of messagesAfter) {
      if (msg.metadata?.compressed) {
        const originalLength =
          msg.metadata.originalTokens || msg.metadata.originalLength || 0
        const compressedLength =
          msg.metadata.compressedTokens ||
          (typeof msg.content === 'string' ? msg.content.length : 0)
        const compressionRatio =
          originalLength > 0 ? compressedLength / originalLength : 1

        logs.push({
          messageId: msg.id || 'unknown',
          originalLength,
          compressedLength,
          compressionRatio,
          compressionType: msg.metadata.compressionType || 'unknown',
          originalCount: msg.metadata.originalCount,
        })
      }
    }

    return logs
  }, [messagesAfter])

  // Extract DSL transformations
  const dslTransformations = useMemo<DSLTransformationEntry[]>(() => {
    const transformations: DSLTransformationEntry[] = []

    for (const msg of messagesAfter) {
      if (msg.metadata?.styleTransformed) {
        const beforeMsg = messagesBefore.find((m) => m.id === msg.id)
        const before = beforeMsg
          ? typeof beforeMsg.content === 'string'
            ? beforeMsg.content
            : JSON.stringify(beforeMsg.content)
          : ''
        const after =
          typeof msg.content === 'string'
            ? msg.content
            : JSON.stringify(msg.content)

        transformations.push({
          type: 'style',
          before: before.substring(0, 200) + (before.length > 200 ? '...' : ''),
          after: after.substring(0, 200) + (after.length > 200 ? '...' : ''),
          description: `Applied ${msg.metadata.styleTransformed} style transformation`,
        })
      }
    }

    return transformations
  }, [messagesBefore, messagesAfter])

  // Model routing log
  const modelRoutingLog = useMemo(() => {
    if (!routingDecision) {
      return null
    }

    return {
      currentModel: routingDecision.currentModel,
      recommendedModel: routingDecision.recommendedModel,
      shouldSwitch: routingDecision.shouldSwitch,
      reasoning: routingDecision.reasoning,
      timestamp: Date.now(),
    }
  }, [routingDecision])

  // Token graph data
  const tokenGraph = useMemo(() => {
    if (!diagnostics) {
      return []
    }

    let cumulativeTime = 0
    return diagnostics.stages.map((stage: OptimizationStage) => {
      cumulativeTime += stage.duration || 0
      return {
        stage: stage.name,
        tokens: stage.tokensAfter,
        timestamp: cumulativeTime,
      }
    })
  }, [diagnostics])

  // Summary statistics
  const summary = useMemo(() => {
    if (!diagnostics) {
      return {
        totalStages: 0,
        totalTokensSaved: 0,
        compressionRatio: 1,
        optimizationDuration: 0,
        wasOptimized: false,
      }
    }

    const totalDuration = diagnostics.stages.reduce(
      (sum: number, stage: OptimizationStage) => sum + (stage.duration || 0),
      0
    )
    const compressionRatio =
      diagnostics.originalTokens > 0
        ? diagnostics.finalTokens / diagnostics.originalTokens
        : 1

    return {
      totalStages: diagnostics.stages.length,
      totalTokensSaved: diagnostics.totalTokensSaved,
      compressionRatio,
      optimizationDuration: totalDuration,
      wasOptimized: diagnostics.wasOptimized,
    }
  }, [diagnostics])

  // Formatted view
  const formattedView = useMemo(() => {
    const summaryText = diagnostics
      ? `Optimization ${diagnostics.wasOptimized ? 'applied' : 'skipped'}. ` +
        `Tokens: ${diagnostics.originalTokens} → ${diagnostics.finalTokens} ` +
        `(${diagnostics.totalTokensSaved > 0 ? '-' : '+'}${Math.abs(diagnostics.totalTokensSaved)} tokens). ` +
        `Strategy: ${diagnostics.strategy}.`
      : 'No optimization data available.'

    const stages = diagnostics
      ? diagnostics.stages.map(
          (stage: OptimizationStage) =>
            `${stage.name}: ${stage.tokensBefore} → ${stage.tokensAfter} tokens ` +
            `(${stage.tokensSaved > 0 ? '-' : '+'}${Math.abs(stage.tokensSaved)} tokens) ` +
            `[${stage.duration || 0}ms]`
        )
      : []

    const compressionDetails = compressionLogs.map(
      (log) =>
        `Message ${log.messageId}: ${log.originalLength} → ${log.compressedLength} tokens ` +
        `(${(log.compressionRatio * 100).toFixed(1)}% ratio, ${log.compressionType})`
    )

    const routingDetails = routingDecision
      ? [
          `Current: ${routingDecision.currentModel}`,
          `Recommended: ${routingDecision.recommendedModel}`,
          `Switch: ${routingDecision.shouldSwitch ? 'Yes' : 'No'}`,
          `Reason: ${routingDecision.reasoning}`,
        ]
      : []

    return {
      summary: summaryText,
      stages,
      compressionDetails,
      routingDetails,
    }
  }, [diagnostics, compressionLogs, routingDecision])

  return {
    optimizationHistory,
    compressionLogs,
    dslTransformations,
    modelRoutingLog,
    tokenGraph,
    summary,
    formattedView,
  }
}
