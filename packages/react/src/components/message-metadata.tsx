import * as React from 'react'
import { motion } from 'framer-motion'
import { Badge, Tooltip, cn } from '@clarity-chat/primitives'
import type { Message } from '@clarity-chat/types'
import { Clock as ClockIcon, DollarSign as DollarSignIcon, TrendingUp as TrendingUpIcon, Shield as ShieldIcon } from 'lucide-react'

// Type assertions to fix React 18/19 compatibility
const ClockIconComponent = ClockIcon as React.ComponentType<{ className?: string }>
const DollarSignIconComponent = DollarSignIcon as React.ComponentType<{ className?: string }>
const TrendingUpIconComponent = TrendingUpIcon as React.ComponentType<{ className?: string }>
const ShieldIconComponent = ShieldIcon as React.ComponentType<{ className?: string }>

/**
 * Enhanced message metadata display
 */
export interface MessageMetadataProps {
  /** Message to display metadata for */
  message: Message
  /** Show cost information */
  showCost?: boolean
  /** Show response time */
  showResponseTime?: boolean
  /** Show confidence score */
  showConfidence?: boolean
  /** Show token count */
  showTokens?: boolean
  /** Show model information */
  showModel?: boolean
  /** Show source attribution (for RAG) */
  showSources?: boolean
  /** Compact display mode */
  compact?: boolean
  className?: string
}

/**
 * Message Metadata Component
 * 
 * Displays comprehensive metadata about a message including:
 * - Token usage and cost
 * - Response time metrics
 * - Confidence scores
 * - Model information
 * - Source attribution
 * 
 * @example
 * ```tsx
 * <MessageMetadata
 *   message={message}
 *   showCost
 *   showResponseTime
 *   showConfidence
 * />
 * ```
 */
export function MessageMetadata({
  message,
  showCost = true,
  showResponseTime = true,
  showConfidence = false,
  showTokens = true,
  showModel = true,
  showSources = false,
  compact = false,
  className,
}: MessageMetadataProps) {
  const metadata = (message as any).metadata || {}
  const [expanded, setExpanded] = React.useState(!compact)

  // Extract metadata values
  const tokens = metadata.tokens || metadata.tokenCount
  const inputTokens = metadata.inputTokens
  const outputTokens = metadata.outputTokens
  const cost = metadata.cost || metadata.estimatedCost
  const responseTime = metadata.responseTime || metadata.processingTime
  const model = metadata.model
  const confidence = metadata.confidence || metadata.confidenceScore
  const sources = metadata.sources || metadata.attributions

  // Calculate cost if we have tokens and model
  const calculatedCost = React.useMemo(() => {
    if (cost !== undefined) return cost
    if (!tokens || !model) return undefined

    // Rough cost estimates per 1K tokens (as of 2024)
    const costPer1K: Record<string, { input: number; output: number }> = {
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
      'claude-3-opus': { input: 0.015, output: 0.075 },
      'claude-3-sonnet': { input: 0.003, output: 0.015 },
      'claude-3-haiku': { input: 0.00025, output: 0.00125 },
    }

    const modelCost = costPer1K[model.toLowerCase()]
    if (!modelCost) return undefined

    const inputCost = ((inputTokens || tokens * 0.7) / 1000) * modelCost.input
    const outputCost = ((outputTokens || tokens * 0.3) / 1000) * modelCost.output
    return inputCost + outputCost
  }, [cost, tokens, inputTokens, outputTokens, model])

  // Format response time
  const formattedResponseTime = React.useMemo(() => {
    if (!responseTime) return null
    if (responseTime < 1000) return `${Math.round(responseTime)}ms`
    return `${(responseTime / 1000).toFixed(1)}s`
  }, [responseTime])

  // Format cost
  const formattedCost = React.useMemo(() => {
    if (calculatedCost === undefined) return null
    if (calculatedCost < 0.01) return `$${(calculatedCost * 1000).toFixed(2)}¢`
    return `$${calculatedCost.toFixed(4)}`
  }, [calculatedCost])

  // Confidence score color
  const confidenceColor = React.useMemo(() => {
    if (confidence === undefined) return 'default'
    if (confidence >= 0.8) return 'success'
    if (confidence >= 0.6) return 'warning'
    return 'destructive'
  }, [confidence])

  if (compact && !expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className={cn(
          'text-xs text-muted-foreground hover:text-foreground transition-colors',
          className
        )}
      >
        Show details
      </button>
    )
  }

  const hasAnyMetadata =
    tokens || responseTime || calculatedCost || model || confidence || sources

  if (!hasAnyMetadata) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={cn(
        'flex flex-wrap items-center gap-2 pt-2 border-t text-xs',
        className
      )}
    >
      {/* Token Count */}
      {showTokens && tokens && (
        <Tooltip content={`Total tokens: ${tokens.toLocaleString()}`}>
          <Badge variant="secondary" className="gap-1">
            <span>🔢</span>
            <span>
              {tokens.toLocaleString()}
              {inputTokens && outputTokens && (
                <span className="text-muted-foreground">
                  {' '}
                  ({inputTokens.toLocaleString()}/{outputTokens.toLocaleString()})
                </span>
              )}
            </span>
          </Badge>
        </Tooltip>
      )}

      {/* Cost */}
      {showCost && formattedCost && (
        <Tooltip content={`Estimated cost: ${formattedCost}`}>
          <Badge variant="secondary" className="gap-1">
            <DollarSignIconComponent className="h-3 w-3" />
            <span>{formattedCost}</span>
          </Badge>
        </Tooltip>
      )}

      {/* Response Time */}
      {showResponseTime && formattedResponseTime && (
        <Tooltip content={`Response time: ${formattedResponseTime}`}>
          <Badge variant="secondary" className="gap-1">
            <ClockIconComponent className="h-3 w-3" />
            <span>{formattedResponseTime}</span>
          </Badge>
        </Tooltip>
      )}

      {/* Model */}
      {showModel && model && (
        <Tooltip content={`Model: ${model}`}>
          <Badge variant="outline" className="gap-1">
            <span>🤖</span>
            <span className="font-mono text-xs">{model}</span>
          </Badge>
        </Tooltip>
      )}

      {/* Confidence Score */}
      {showConfidence && confidence !== undefined && (
        <Tooltip content={`Confidence: ${(confidence * 100).toFixed(1)}%`}>
          <Badge variant={confidenceColor} className="gap-1">
            <TrendingUpIconComponent className="h-3 w-3" />
            <span>{(confidence * 100).toFixed(0)}%</span>
          </Badge>
        </Tooltip>
      )}

      {/* Sources (RAG) */}
      {showSources && sources && sources.length > 0 && (
        <Tooltip
          content={`${sources.length} source${sources.length !== 1 ? 's' : ''} referenced`}
        >
          <Badge variant="secondary" className="gap-1">
            <ShieldIconComponent className="h-3 w-3" />
            <span>{sources.length} source{sources.length !== 1 ? 's' : ''}</span>
          </Badge>
        </Tooltip>
      )}

      {/* Expand/Collapse */}
      {compact && expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Hide
        </button>
      )}
    </motion.div>
  )
}

MessageMetadata.displayName = 'MessageMetadata'
