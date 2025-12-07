'use client'

import React, { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, type ButtonProps, cn } from '@clarity-chat/primitives'
import { useClipboard } from '../hooks/use-clipboard'
import { CopyIcon, CheckIcon } from './icons'
import { useToast } from './toast'

export interface CopyButtonProps
  extends Omit<ButtonProps, 'onClick' | 'state'> {
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
}

export function CopyButton({
  text,
  onCopy,
  iconOnly = false,
  copyText = 'Copy',
  copiedText = 'Copied!',
  showToast = false,
  toastMessage = 'Copied to clipboard!',
  children,
  ...props
}: CopyButtonProps) {
  const toast = useToast()
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

  return (
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
            transition={{ 
              // Framer Motion 12: Spring check icon celebration
              type: 'spring',
              damping: 15,
              stiffness: 300,
            }}
            className="flex items-center gap-1.5"
          >
            <CheckIcon size={14} />
            {!iconOnly && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
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
            transition={{ 
              // Framer Motion 12: Spring copy icon entrance
              type: 'spring',
              damping: 18,
              stiffness: 280,
            }}
            className="flex items-center gap-1.5"
          >
            <CopyIcon size={14} />
            {!iconOnly && (children || copyText)}
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}

CopyButton.displayName = 'CopyButton'
