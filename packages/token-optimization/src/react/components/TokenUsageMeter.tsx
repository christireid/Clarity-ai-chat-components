'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion, glassVariants, getSemanticGradient } from '@clarity-chat/primitives'
import { MODEL_PRICING } from '../../models/model-pricing'

/**
 * Token usage data for streaming responses
 */
export interface TokenUsage {
  /** Tokens used in the prompt/input */
  promptTokens: number
  /** Tokens generated in the response/output */
  completionTokens: number
  /** Total tokens (prompt + completion) */
  totalTokens: number
}

/**
 * Model pricing configuration
 */
export interface ModelPricing {
  /** Model identifier (e.g., 'gpt-4', 'gemini-pro') */
  modelId: string
  /** Cost per 1K input/prompt tokens in USD */
  inputCostPer1K: number
  /** Cost per 1K output/completion tokens in USD */
  outputCostPer1K: number
}

/**
 * Common model pricing presets - Re-exported from MODEL_PRICING
 * Use MODEL_PRICING directly for the full registry
 */
export const MODEL_PRICING_PRESETS: Record<string, ModelPricing> = Object.entries(
  MODEL_PRICING
).reduce(
  (acc, [key, value]) => {
    acc[key] = {
      modelId: key,
      inputCostPer1K: value.inputCostPer1M / 1000,
      outputCostPer1K: value.outputCostPer1M / 1000,
    }
    return acc
  },
  {} as Record<string, ModelPricing>
)

/**
 * TokenUsageMeter component props
 */
export interface TokenUsageMeterProps {
  /** Current token usage */
  usage: TokenUsage | null
  /** Whether currently streaming */
  isStreaming?: boolean
  /** Model pricing for cost calculation */
  pricing?: ModelPricing
  /** Show cost estimate (default: true) */
  showCost?: boolean
  /** Show detailed breakdown (default: true) */
  showBreakdown?: boolean
  /** Compact mode for inline display */
  compact?: boolean
  /** Custom className */
  className?: string
  /** Animation variant */
  variant?: 'minimal' | 'detailed' | 'inline'
}

// Animation constants
const DURATION_SECONDS = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 1.5,
}

/**
 * Format token count with animation-friendly display
 */
function formatTokens(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toLocaleString()
}

/**
 * Calculate cost from token usage and pricing
 */
function calculateCost(usage: TokenUsage, pricing: ModelPricing): number {
  const inputCost = (usage.promptTokens / 1000) * pricing.inputCostPer1K
  const outputCost = (usage.completionTokens / 1000) * pricing.outputCostPer1K
  return inputCost + outputCost
}

/**
 * Format cost in dollars
 */
function formatCost(cost: number): string {
  if (cost < 0.001) {
    return `<$0.001`
  }
  if (cost < 0.01) {
    return `$${cost.toFixed(4)}`
  }
  return `$${cost.toFixed(3)}`
}

/**
 * TokenUsageMeter - Real-time token usage display for streaming responses
 *
 * Shows live token consumption during AI streaming with optional cost estimation.
 * Perfect for cost-conscious AI applications that need transparency.
 *
 * **Features:**
 * - Real-time token count animation
 * - Input/output token breakdown
 * - Cost estimation with model pricing
 * - Multiple display variants
 * - Reduced motion support
 * - Accessible ARIA labels
 *
 * @example
 * ```tsx
 * // Basic usage during streaming
 * <TokenUsageMeter
 *   usage={{ promptTokens: 150, completionTokens: 47, totalTokens: 197 }}
 *   isStreaming={true}
 * />
 *
 * // With cost estimation
 * <TokenUsageMeter
 *   usage={tokenUsage}
 *   pricing={MODEL_PRICING_PRESETS['gpt-4o']}
 *   showCost={true}
 * />
 *
 * // Inline variant for headers
 * <TokenUsageMeter
 *   usage={usage}
 *   variant="inline"
 *   compact={true}
 * />
 * ```
 */
export function TokenUsageMeter({
  usage,
  isStreaming = false,
  pricing,
  showCost = true,
  showBreakdown = true,
  compact = false,
  className,
  variant = 'detailed',
}: TokenUsageMeterProps) {
  const prefersReducedMotion = useReducedMotion()

  // Calculate cost if pricing is provided
  const cost = usage && pricing ? calculateCost(usage, pricing) : null

  // Animation config
  const animationConfig = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, damping: 20, stiffness: 300 }

  if (!usage) {
    return null
  }

  // Inline variant - minimal display
  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 text-xs text-muted-foreground font-mono',
          className
        )}
        role="status"
        aria-label={`Token usage: ${usage.totalTokens} tokens`}
      >
        <span className="flex items-center gap-1">
          <TokenIcon className="w-3 h-3" />
          <AnimatePresence mode="popLayout">
            <motion.span
              key={usage.totalTokens}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={animationConfig}
            >
              {formatTokens(usage.totalTokens)}
            </motion.span>
          </AnimatePresence>
        </span>
        {showCost && cost !== null && (
          <span className="text-muted-foreground/60">{formatCost(cost)}</span>
        )}
        {isStreaming && (
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        )}
      </div>
    )
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          glassVariants({
            intensity: 'subtle',
            gradient: getSemanticGradient('analytics'),
            border: 'light',
            hover: 'glow',
          }),
          'flex items-center gap-3 px-3 py-2 rounded-lg',
          compact && 'px-2 py-1',
          className
        )}
        role="status"
        aria-label={`Token usage: ${usage.totalTokens} total tokens`}
      >
        <div className="flex items-center gap-2">
          <TokenIcon
            className={cn(
              'text-muted-foreground',
              compact ? 'w-3 h-3' : 'w-4 h-4'
            )}
          />
          <div className={cn('font-mono', compact ? 'text-xs' : 'text-sm')}>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={usage.totalTokens}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium"
              >
                {formatTokens(usage.totalTokens)}
              </motion.span>
            </AnimatePresence>
            <span className="text-muted-foreground ml-1">tokens</span>
          </div>
        </div>

        {showCost && cost !== null && (
          <div
            className={cn(
              'font-mono text-muted-foreground',
              compact ? 'text-xs' : 'text-sm'
            )}
          >
            {formatCost(cost)}
          </div>
        )}

        {isStreaming && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: DURATION_SECONDS.slower }}
            className="w-2 h-2 rounded-full bg-green-500"
          />
        )}
      </motion.div>
    )
  }

  // Detailed variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={animationConfig}
      className={cn(
        glassVariants({
          intensity: 'medium',
          gradient: getSemanticGradient('analytics'),
          border: 'light',
          animated: 'gradient',
          hover: 'lift',
        }),
        'flex flex-col gap-2 p-4 rounded-xl',
        compact && 'p-3 gap-1.5',
        className
      )}
      role="status"
      aria-label={`Token usage: ${usage.promptTokens} input, ${usage.completionTokens} output, ${usage.totalTokens} total`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TokenIcon
            className={cn(
              'text-muted-foreground',
              compact ? 'w-4 h-4' : 'w-5 h-5'
            )}
          />
          <span
            className={cn('font-medium', compact ? 'text-sm' : 'text-base')}
          >
            Token Usage
          </span>
          {isStreaming && (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{
                repeat: Infinity,
                duration: DURATION_SECONDS.slower,
              }}
              className="text-xs text-green-600 dark:text-green-400 font-medium"
            >
              Live
            </motion.span>
          )}
        </div>

        {showCost && cost !== null && (
          <div
            className={cn(
              'font-mono font-medium',
              compact ? 'text-sm' : 'text-base'
            )}
          >
            {formatCost(cost)}
          </div>
        )}
      </div>

      {/* Token breakdown */}
      {showBreakdown && (
        <div className={cn('grid grid-cols-3 gap-3', compact && 'gap-2')}>
          <TokenStat
            label="Input"
            value={usage.promptTokens}
            color="blue"
            compact={compact}
            prefersReducedMotion={prefersReducedMotion}
          />
          <TokenStat
            label="Output"
            value={usage.completionTokens}
            color="green"
            compact={compact}
            prefersReducedMotion={prefersReducedMotion}
          />
          <TokenStat
            label="Total"
            value={usage.totalTokens}
            color="purple"
            compact={compact}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>
      )}

      {/* Model info */}
      {pricing && (
        <div
          className={cn(
            'text-muted-foreground',
            compact ? 'text-xs' : 'text-sm'
          )}
        >
          Model: {pricing.modelId}
        </div>
      )}
    </motion.div>
  )
}

/**
 * Token statistic display
 */
function TokenStat({
  label,
  value,
  color,
  compact,
  prefersReducedMotion,
}: {
  label: string
  value: number
  color: 'blue' | 'green' | 'purple'
  compact?: boolean
  prefersReducedMotion: boolean
}) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
  }

  return (
    <div className={cn('flex flex-col', compact && 'gap-0')}>
      <span
        className={cn('text-muted-foreground', compact ? 'text-xs' : 'text-sm')}
      >
        {label}
      </span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={prefersReducedMotion ? false : { opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: 5 }}
          transition={{ duration: DURATION_SECONDS.fast }}
          className={cn(
            'font-mono font-semibold',
            compact ? 'text-sm' : 'text-lg',
            colorClasses[color]
          )}
        >
          {formatTokens(value)}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

/**
 * Token icon SVG
 */
function TokenIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      />
    </svg>
  )
}

TokenUsageMeter.displayName = 'TokenUsageMeter'
