'use client'

/**
 * CopyButton - Copy text to clipboard with feedback
 *
 * Features:
 * - Copy to clipboard
 * - Visual feedback (icon change)
 * - Toast notification (optional)
 * - Multiple sizes
 * - Dark mode support
 * - Fully accessible
 */

import * as React from 'react'
import { Check, Copy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface CopyButtonProps {
  /** Text to copy */
  text: string
  /** Button label (for screen readers) */
  label?: string
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Button variant */
  variant?: 'ghost' | 'outline' | 'solid'
  /** Show tooltip */
  showTooltip?: boolean
  /** Tooltip text */
  tooltipText?: string
  /** Success tooltip text */
  successTooltipText?: string
  /** Additional CSS classes */
  className?: string
  /** Callback on copy */
  onCopy?: () => void
}

export function CopyButton({
  text,
  label = 'Copy to clipboard',
  size = 'md',
  variant = 'ghost',
  showTooltip = true,
  tooltipText = 'Copy',
  successTooltipText = 'Copied!',
  className,
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)
  const [showTooltipState, setShowTooltipState] = React.useState(false)

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [text, onCopy])

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  }

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const variantClasses = {
    ghost: 'hover:bg-muted',
    outline: 'border border-border hover:bg-muted',
    solid: 'bg-brand-500 text-white hover:bg-brand-600',
  }

  return (
    <div className="relative inline-flex">
      <button
        onClick={handleCopy}
        onMouseEnter={() => setShowTooltipState(true)}
        onMouseLeave={() => setShowTooltipState(false)}
        className={cn(
          'rounded-md transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        aria-label={copied ? successTooltipText : label}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <Check className={cn(iconSizes[size], 'text-emerald-500')} />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ duration: 0.2 }}
            >
              <Copy className={cn(iconSizes[size], 'text-muted-foreground')} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <AnimatePresence>
          {showTooltipState && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
                'px-2 py-1 rounded text-xs font-medium',
                'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900',
                'whitespace-nowrap pointer-events-none z-50'
              )}
              role="tooltip"
            >
              {copied ? successTooltipText : tooltipText}
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100"
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

/**
 * CopyButtonWithContent - Copy button with content display
 */
export interface CopyButtonWithContentProps extends Omit<CopyButtonProps, 'text'> {
  /** Content to display and copy */
  children: React.ReactNode
  /** Text to copy (if different from display) */
  copyText?: string
}

export function CopyButtonWithContent({
  children,
  copyText,
  className,
  ...props
}: CopyButtonWithContentProps) {
  const textToCopy = React.useMemo(() => {
    if (copyText) return copyText

    // Extract text from children if it's a string or element
    if (typeof children === 'string') return children
    if (React.isValidElement(children)) {
      const extractText = (node: React.ReactNode): string => {
        if (typeof node === 'string') return node
        if (Array.isArray(node)) return node.map(extractText).join('')
        if (React.isValidElement(node) && node.props.children) {
          return extractText(node.props.children)
        }
        return ''
      }
      return extractText(children)
    }

    return ''
  }, [children, copyText])

  return (
    <div className={cn('group relative inline-flex items-center gap-2', className)}>
      {children}
      <CopyButton
        text={textToCopy}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        {...props}
      />
    </div>
  )
}
