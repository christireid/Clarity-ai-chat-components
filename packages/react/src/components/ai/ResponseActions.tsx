'use client'

/**
 * ResponseActions Component
 *
 * A component for displaying action buttons/icons on AI responses.
 * Includes copy, regenerate, feedback, and custom actions.
 *
 * Features:
 * - Multiple layout variants (inline, toolbar, floating)
 * - Built-in actions (copy, regenerate, like, dislike)
 * - Custom action support
 * - Tooltip support
 * - Loading states
 * - Keyboard shortcuts
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * <ResponseActions
 *   onCopy={() => copyToClipboard(content)}
 *   onRegenerate={() => regenerateResponse()}
 *   onLike={() => sendFeedback('like')}
 *   onDislike={() => sendFeedback('dislike')}
 * />
 * ```
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { durations } from '../../animations/zero-dependency'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type ResponseActionsVariant =
  | 'inline'
  | 'toolbar'
  | 'floating'
  | 'minimal'
export type ResponseActionsSize = 'sm' | 'md' | 'lg'

export interface ResponseAction {
  /** Unique identifier */
  id: string
  /** Action label */
  label: string
  /** Icon */
  icon: React.ReactNode
  /** Tooltip text */
  tooltip?: string
  /** Keyboard shortcut */
  shortcut?: string
  /** Whether action is loading */
  isLoading?: boolean
  /** Whether action is disabled */
  isDisabled?: boolean
  /** Whether action is active/selected */
  isActive?: boolean
  /** Click handler */
  onClick?: () => void
}

export interface ResponseActionsProps {
  /** Visual variant */
  variant?: ResponseActionsVariant
  /** Size preset */
  size?: ResponseActionsSize
  /** Custom actions (replaces built-in) */
  actions?: ResponseAction[]
  /** Show copy action */
  showCopy?: boolean
  /** Show regenerate action */
  showRegenerate?: boolean
  /** Show like action */
  showLike?: boolean
  /** Show dislike action */
  showDislike?: boolean
  /** Copy handler */
  onCopy?: () => void
  /** Regenerate handler */
  onRegenerate?: () => void
  /** Like handler */
  onLike?: () => void
  /** Dislike handler */
  onDislike?: () => void
  /** Current feedback state */
  feedback?: 'like' | 'dislike' | null
  /** Whether copy succeeded */
  copied?: boolean
  /** Whether regenerating */
  isRegenerating?: boolean
  /** Additional class names */
  className?: string
}

// ============================================================================
// Icons
// ============================================================================

const CopyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const RefreshIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M3 22v-6h6" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
  </svg>
)

const ThumbsUpIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
)

const ThumbsDownIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 14V2" />
    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
  </svg>
)

// ============================================================================
// ActionButton Component
// ============================================================================

interface ActionButtonProps {
  action: ResponseAction
  size: ResponseActionsSize
  variant: ResponseActionsVariant
}

function ActionButton({ action, size, variant }: ActionButtonProps) {
  const prefersReducedMotion = useReducedMotion()

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  return (
    <motion.button
      type="button"
      className={cn(
        'response-action-btn',
        sizeClasses[size],
        action.isActive && 'response-action-btn-active',
        action.isDisabled && 'response-action-btn-disabled',
        action.isLoading && 'response-action-btn-loading'
      )}
      onClick={action.onClick}
      disabled={action.isDisabled || action.isLoading}
      title={action.tooltip || action.label}
      aria-label={action.label}
      whileHover={
        !action.isDisabled && !prefersReducedMotion ? { scale: 1.1 } : {}
      }
      whileTap={
        !action.isDisabled && !prefersReducedMotion ? { scale: 0.95 } : {}
      }
    >
      {action.isLoading ? (
        <motion.span
          className="response-action-spinner"
          animate={{ rotate: 360 }}
          transition={{
            duration: durations.slower,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
        </motion.span>
      ) : (
        action.icon
      )}
      {variant === 'toolbar' && (
        <span className="response-action-label">{action.label}</span>
      )}
      {action.shortcut && variant === 'toolbar' && (
        <kbd className="response-action-shortcut">{action.shortcut}</kbd>
      )}
    </motion.button>
  )
}

// ============================================================================
// ResponseActions Component
// ============================================================================

export function ResponseActions({
  variant = 'inline',
  size = 'sm',
  actions: customActions,
  showCopy = true,
  showRegenerate = true,
  showLike = true,
  showDislike = true,
  onCopy,
  onRegenerate,
  onLike,
  onDislike,
  feedback,
  copied = false,
  isRegenerating = false,
  className,
}: ResponseActionsProps) {
  const prefersReducedMotion = useReducedMotion()

  // Build default actions if no custom actions provided
  const defaultActions: ResponseAction[] = React.useMemo(() => {
    const actions: ResponseAction[] = []

    if (showCopy && onCopy) {
      actions.push({
        id: 'copy',
        label: copied ? 'Copied!' : 'Copy',
        icon: copied ? <CheckIcon /> : <CopyIcon />,
        tooltip: copied ? 'Copied to clipboard' : 'Copy to clipboard',
        shortcut: '⌘C',
        isActive: copied,
        onClick: onCopy,
      })
    }

    if (showRegenerate && onRegenerate) {
      actions.push({
        id: 'regenerate',
        label: 'Regenerate',
        icon: <RefreshIcon />,
        tooltip: 'Regenerate response',
        shortcut: '⌘R',
        isLoading: isRegenerating,
        onClick: onRegenerate,
      })
    }

    if (showLike && onLike) {
      actions.push({
        id: 'like',
        label: 'Like',
        icon: <ThumbsUpIcon filled={feedback === 'like'} />,
        tooltip: 'Good response',
        isActive: feedback === 'like',
        onClick: onLike,
      })
    }

    if (showDislike && onDislike) {
      actions.push({
        id: 'dislike',
        label: 'Dislike',
        icon: <ThumbsDownIcon filled={feedback === 'dislike'} />,
        tooltip: 'Bad response',
        isActive: feedback === 'dislike',
        onClick: onDislike,
      })
    }

    return actions
  }, [
    showCopy,
    showRegenerate,
    showLike,
    showDislike,
    onCopy,
    onRegenerate,
    onLike,
    onDislike,
    feedback,
    copied,
    isRegenerating,
  ])

  const actions = customActions || defaultActions

  if (actions.length === 0) return null

  return (
    <motion.div
      className={cn(
        'response-actions',
        `response-actions-${variant}`,
        `response-actions-${size}`,
        className
      )}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: DURATION_SECONDS.fast,
        ease: EASING_FRAMER.standard,
      }}
      role="toolbar"
      aria-label="Response actions"
    >
      {actions.map((action) => (
        <ActionButton
          key={action.id}
          action={action}
          size={size}
          variant={variant}
        />
      ))}
    </motion.div>
  )
}

// ============================================================================
// useResponseActions Hook
// ============================================================================

export interface UseResponseActionsOptions {
  /** Content to copy */
  content?: string
  /** Regenerate callback */
  onRegenerate?: () => Promise<void>
  /** Feedback callback */
  onFeedback?: (type: 'like' | 'dislike') => Promise<void>
}

export interface UseResponseActionsReturn {
  /** Whether content was copied */
  copied: boolean
  /** Current feedback state */
  feedback: 'like' | 'dislike' | null
  /** Whether regenerating */
  isRegenerating: boolean
  /** Copy handler */
  handleCopy: () => void
  /** Regenerate handler */
  handleRegenerate: () => void
  /** Like handler */
  handleLike: () => void
  /** Dislike handler */
  handleDislike: () => void
}

export function useResponseActions(
  options: UseResponseActionsOptions = {}
): UseResponseActionsReturn {
  const { content, onRegenerate, onFeedback } = options
  const [copied, setCopied] = React.useState(false)
  const [feedback, setFeedback] = React.useState<'like' | 'dislike' | null>(
    null
  )
  const [isRegenerating, setIsRegenerating] = React.useState(false)

  const handleCopy = React.useCallback(async () => {
    if (!content) return
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [content])

  const handleRegenerate = React.useCallback(async () => {
    if (!onRegenerate || isRegenerating) return
    setIsRegenerating(true)
    try {
      await onRegenerate()
    } finally {
      setIsRegenerating(false)
    }
  }, [onRegenerate, isRegenerating])

  const handleLike = React.useCallback(async () => {
    const newFeedback = feedback === 'like' ? null : 'like'
    setFeedback(newFeedback)
    if (newFeedback && onFeedback) {
      await onFeedback('like')
    }
  }, [feedback, onFeedback])

  const handleDislike = React.useCallback(async () => {
    const newFeedback = feedback === 'dislike' ? null : 'dislike'
    setFeedback(newFeedback)
    if (newFeedback && onFeedback) {
      await onFeedback('dislike')
    }
  }, [feedback, onFeedback])

  return {
    copied,
    feedback,
    isRegenerating,
    handleCopy,
    handleRegenerate,
    handleLike,
    handleDislike,
  }
}

export default ResponseActions
