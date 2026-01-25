'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, type ButtonProps, cn, Tooltip } from '@clarity-chat/primitives'
import { useClipboard } from '../../hooks/ui/use-clipboard'
import { CopyIcon, CheckIcon } from '../ui/icons'
import { useToast } from '../ui/toast'
import { useReducedMotion } from '@clarity-chat/primitives'
import { getSpring } from '../../animations/spring-presets'
import { DURATION_SECONDS as durations, ANIMATION_PRESETS } from '../../animations/constants'

// Celebration particle animation
const CELEBRATION_PARTICLE_ANIMATION = {
  scale: [0, 1, 0],
  opacity: [1, 1, 0],
}

// Check icon pulse animation
const CHECK_ICON_PULSE = {
  scale: [1, 1.2, 1],
}

// Copy button final state (override animate for completion)
const COPY_BUTTON_FINAL = {
  scale: 1,
  opacity: 1,
}

export interface CopyButtonProps extends Omit<
  ButtonProps,
  'onClick' | 'state' | 'onError'
> {
  text: string
  /** Callback fired after successful copy */
  onCopy?: () => void
  /** Callback fired when copy fails */
  onCopyError?: (error: Error) => void
  /** Show icon only (no text) */
  iconOnly?: boolean
  /** Custom copy text */
  copyText?: string
  /** Custom copied text */
  copiedText?: string
  /** Show toast confirmation (default: false for backward compatibility) */
  showToast?: boolean
  /** Custom toast message */
  toastMessage?: string
  /** Custom error toast message (default: "Failed to copy") */
  errorToastMessage?: string
  /** Show tooltip (default: false) */
  showTooltip?: boolean
  /** Custom tooltip text */
  tooltipText?: string
}

/**
 * CopyButton - Button with copy-to-clipboard functionality
 *
 * A polished copy button with celebratory feedback animations. Uses spring
 * physics for natural motion and respects user's reduced motion preferences.
 *
 * @param props - CopyButton configuration
 * @param props.text - The text to copy to clipboard (required)
 * @param props.onCopy - Callback fired after successful copy
 * @param props.onCopyError - Callback fired when copy fails
 * @param props.iconOnly - Show only the icon, no text label (default: false)
 * @param props.copyText - Label shown in idle state (default: "Copy")
 * @param props.copiedText - Label shown after copying (default: "Copied!")
 * @param props.showToast - Show toast notification on copy (default: false)
 * @param props.toastMessage - Custom toast message (default: "Copied to clipboard!")
 * @param props.errorToastMessage - Custom error toast message (default: "Failed to copy")
 *
 * @example Basic usage
 * ```tsx
 * <CopyButton text={codeSnippet} />
 * ```
 *
 * @example Icon-only in a toolbar
 * ```tsx
 * <CopyButton text={content} iconOnly className="h-8 w-8" />
 * ```
 *
 * @example With toast notification
 * ```tsx
 * <CopyButton
 *   text={shareableLink}
 *   showToast
 *   toastMessage="Link copied!"
 *   onCopy={() => analytics.track('link_copied')}
 * />
 * ```
 *
 * @enhanced Framer Motion 12: Spring physics for celebration animation
 * - Bouncy spring for check icon (celebratory feel)
 * - Smooth spring for copy icon (professional entrance)
 * - Respects prefers-reduced-motion
 */
export function CopyButton({
  text,
  onCopy,
  onCopyError,
  iconOnly = false,
  copyText = 'Copy',
  copiedText = 'Copied!',
  showToast = false,
  toastMessage = 'Copied to clipboard!',
  errorToastMessage = 'Failed to copy',
  showTooltip = false,
  tooltipText = 'Copy to clipboard',
  children,
  ...props
}: CopyButtonProps) {
  const toast = useToast()
  const prefersReducedMotion = useReducedMotion()
  const { copy, copied } = useClipboard({
    timeout: 2000,
    onSuccess: () => {
      onCopy?.()
      if (showToast && toast) {
        toast.success(toastMessage)
      }
    },
    onError: (error) => {
      onCopyError?.(error)
      if (showToast && toast) {
        toast.error(errorToastMessage)
      }
    },
  })

  // Memoize copy handler to prevent recreation on every render
  const handleCopy = React.useCallback(async () => {
    await copy(text)
  }, [copy, text])

  // Track copy status for screen reader announcement
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null)
  // Track celebration animation
  const [showCelebration, setShowCelebration] = React.useState(false)

  // Clear status after announcement
  React.useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 2000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [statusMessage])

  // Celebration effect on successful copy
  React.useEffect(() => {
    if (copied && !prefersReducedMotion) {
      setShowCelebration(true)
      const timer = setTimeout(() => setShowCelebration(false), 600)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [copied, prefersReducedMotion])

  // Enhanced copy handler with status announcement
  const handleCopyWithAnnouncement = React.useCallback(async () => {
    try {
      await handleCopy()
      setStatusMessage(toastMessage)
    } catch {
      setStatusMessage(errorToastMessage)
    }
  }, [handleCopy, toastMessage, errorToastMessage])

  const button = (
    <Button
      variant="ghost"
      size="sm"
      // Don't use state prop - causes double checkmark (Button shows its own + our CheckIcon)
      onClick={handleCopyWithAnnouncement}
      aria-label={copied ? copiedText : copyText}
      className={cn(
        'relative transition-all duration-200',
        copied && 'text-success bg-success/10',
        props.className
      )}
      {...props}
    >
      {/* Celebration particles */}
      {showCelebration && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-success rounded-full"
              {...ANIMATION_PRESETS.scale}
              animate={{
                ...ANIMATION_PRESETS.scale.animate,
                ...CELEBRATION_PARTICLE_ANIMATION,
                x: [0, Math.cos((i * Math.PI) / 3) * 20],
                y: [0, Math.sin((i * Math.PI) / 3) * 20],
              }}
              transition={{
                duration: durations.slower,
                ease: 'easeOut',
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.div
            key="check"
            {...ANIMATION_PRESETS.scaleRotate}
            // eslint-disable-next-line clarity-animations/prefer-animation-library
            animate={{ ...ANIMATION_PRESETS.scaleRotate.animate, scale: 1, opacity: 1, rotate: 0 }}
            exit={{ ...ANIMATION_PRESETS.scaleRotate.exit, scale: 0.5, opacity: 0 }}
            transition={getSpring('bouncy', prefersReducedMotion)}
            className="flex items-center gap-1.5"
          >
            <motion.div
              {...ANIMATION_PRESETS.scale}
              animate={{ ...ANIMATION_PRESETS.scale.animate, ...CHECK_ICON_PULSE }}
              transition={{
                duration: durations.moderate,
                ease: 'easeOut',
              }}
            >
              <CheckIcon size={14} />
            </motion.div>
            {!iconOnly && (
              <motion.span
                {...ANIMATION_PRESETS.slideRight}
                transition={getSpring('quick', prefersReducedMotion, {
                  delay: 0.05,
                })}
              >
                {children || copiedText}
              </motion.span>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            {...ANIMATION_PRESETS.scale}
            // eslint-disable-next-line clarity-animations/prefer-animation-library
            animate={{ ...ANIMATION_PRESETS.scale.animate, scale: 1, opacity: 1 }}
            exit={{ ...ANIMATION_PRESETS.scale.exit, scale: 0.8, opacity: 0 }}
            transition={getSpring('smooth', prefersReducedMotion)}
            className="flex items-center gap-1.5"
          >
            <CopyIcon size={14} />
            {!iconOnly && (children || copyText)}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Screen reader announcement */}
      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusMessage}
      </span>
    </Button>
  )

  if (showTooltip) {
    return (
      <Tooltip
        content={copied ? 'Copied!' : tooltipText}
        side="top"
        delay={300}
      >
        {button}
      </Tooltip>
    )
  }

  return button
}

CopyButton.displayName = 'CopyButton'
