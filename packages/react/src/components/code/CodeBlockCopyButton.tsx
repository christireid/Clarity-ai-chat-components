'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'
import { useClipboard } from '../../hooks/use-clipboard'
import { useReducedMotion } from '../../hooks/use-reduced-motion'
import { getSpring } from '../../animations/spring-presets'
import { CopyIcon, CheckIcon, AlertCircleIcon } from '../icons'

/**
 * Copy state for the button
 */
type CopyState = 'idle' | 'copied' | 'error'

/**
 * CodeBlockCopyButton Component Props
 */
export interface CodeBlockCopyButtonProps {
  /** Content to copy to clipboard */
  content: string
  /** Callback when copy succeeds */
  onCopy?: () => void
  /** Callback when copy fails */
  onError?: (error: Error) => void
  /** Duration to show success state in ms (default: 2000) */
  feedbackDuration?: number
  /** Additional CSS class */
  className?: string
  /** Accessible label */
  'aria-label'?: string
  /** Whether the button is disabled */
  disabled?: boolean
}

/**
 * CodeBlockCopyButton Component
 *
 * Premium copy-to-clipboard button with smooth icon morphing animation.
 * Uses spring physics for a satisfying, bouncy feedback.
 *
 * Features:
 * - Smooth icon transition (copy → checkmark)
 * - Auto-resets after configurable duration
 * - Handles clipboard API failures gracefully
 * - Screen reader announcements
 * - Respects prefers-reduced-motion
 *
 * @example
 * ```tsx
 * <CodeBlockCopyButton
 *   content={codeString}
 *   onCopy={() => logger.debug('Copied!')}
 * />
 * ```
 */
export const CodeBlockCopyButton = React.memo<CodeBlockCopyButtonProps>(
  function CodeBlockCopyButton({
    content,
    onCopy,
    onError,
    feedbackDuration = 2000,
    className,
    'aria-label': ariaLabel = 'Copy code to clipboard',
    disabled = false,
  }) {
    const [state, setState] = React.useState<CopyState>('idle')
    const prefersReducedMotion = useReducedMotion()

    const { copy } = useClipboard({
      timeout: feedbackDuration,
      onSuccess: () => {
        setState('copied')
        onCopy?.()
        setTimeout(() => setState('idle'), feedbackDuration)
      },
      onError: (error) => {
        setState('error')
        onError?.(error)
        setTimeout(() => setState('idle'), feedbackDuration)
      },
    })

    const handleCopy = React.useCallback(async () => {
      if (disabled || state !== 'idle') return
      await copy(content)
    }, [copy, content, disabled, state])

    // Animation variants
    const iconVariants = {
      initial: { scale: 0.5, opacity: 0, rotate: -45 },
      animate: { scale: 1, opacity: 1, rotate: 0 },
      exit: { scale: 0.5, opacity: 0, rotate: 45 },
    }

    // Get the appropriate icon and color for current state
    const Icon = {
      idle: CopyIcon,
      copied: CheckIcon,
      error: AlertCircleIcon,
    }[state]

    const iconColorClass = {
      idle: 'text-muted-foreground',
      copied: 'text-green-500',
      error: 'text-red-500',
    }[state]

    const buttonColorClass = {
      idle: 'hover:bg-muted/80',
      copied: 'bg-green-500/10',
      error: 'bg-red-500/10',
    }[state]

    return (
      <button
        type="button"
        onClick={handleCopy}
        disabled={disabled || state !== 'idle'}
        className={cn(
          // Base styles
          'relative p-2 rounded-md transition-colors',
          // Focus styles
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          // Disabled styles
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // State-based colors
          buttonColorClass,
          className
        )}
        aria-label={ariaLabel}
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={state}
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={getSpring('bouncy', prefersReducedMotion)}
            className="block"
          >
            <Icon className={cn('h-4 w-4', iconColorClass)} size={16} />
          </motion.span>
        </AnimatePresence>

        {/* Screen reader announcement */}
        <span className="sr-only">
          {state === 'copied' && 'Copied to clipboard'}
          {state === 'error' && 'Failed to copy'}
          {state === 'idle' && ariaLabel}
        </span>
      </button>
    )
  }
)

CodeBlockCopyButton.displayName = 'CodeBlockCopyButton'

export default CodeBlockCopyButton
