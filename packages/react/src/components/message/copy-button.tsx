'use client'

import React, { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, type ButtonProps, cn, Tooltip } from '@clarity-chat/primitives'
import { useClipboard } from '../hooks/use-clipboard'
import { CopyIcon, CheckIcon } from '../ui/icons'
import { useToast } from './toast'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { getSpring } from '../animations/spring-presets'

export interface CopyButtonProps extends Omit<
  ButtonProps,
  'onClick' | 'state'
> {
  text: string
  onCopy?: () => void
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
 * @param props.iconOnly - Show only the icon, no text label (default: false)
 * @param props.copyText - Label shown in idle state (default: "Copy")
 * @param props.copiedText - Label shown after copying (default: "Copied!")
 * @param props.showToast - Show toast notification on copy (default: false)
 * @param props.toastMessage - Custom toast message (default: "Copied to clipboard!")
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
  iconOnly = false,
  copyText = 'Copy',
  copiedText = 'Copied!',
  showToast = false,
  toastMessage = 'Copied to clipboard!',
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
  })

  // Memoize copy handler to prevent recreation on every render
  const handleCopy = React.useCallback(async () => {
    await copy(text)
  }, [copy, text])

  const button = (
    <Button
      variant="ghost"
      size="sm"
      // Don't use state prop - causes double checkmark (Button shows its own + our CheckIcon)
      onClick={handleCopy}
      aria-label={copied ? copiedText : copyText}
      className={cn(
        'transition-all duration-200',
        copied && 'text-success bg-success/10',
        props.className
      )}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={getSpring('bouncy', prefersReducedMotion)}
            className="flex items-center gap-1.5"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: durations.moderate, ease: 'easeOut' }}
            >
              <CheckIcon size={14} />
            </motion.div>
            {!iconOnly && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={getSpring('smooth', prefersReducedMotion)}
            className="flex items-center gap-1.5"
          >
            <CopyIcon size={14} />
            {!iconOnly && (children || copyText)}
          </motion.div>
        )}
      </AnimatePresence>
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
