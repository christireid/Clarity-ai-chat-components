'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import { Check, Copy, Clipboard, ClipboardCheck } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export type CopyStatus = 'idle' | 'copying' | 'copied' | 'error'

export interface CopyButtonProps {
  /** Text to copy */
  text: string
  /** Custom icon for idle state */
  icon?: React.ReactNode
  /** Custom icon for copied state */
  copiedIcon?: React.ReactNode
  /** Duration to show copied state (ms) */
  copiedDuration?: number
  /** Callback when copy succeeds */
  onCopy?: (text: string) => void
  /** Callback when copy fails */
  onError?: (error: Error) => void
  /** Visual variant */
  variant?: 'default' | 'ghost' | 'outline' | 'minimal'
  /** Size */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /** Show tooltip */
  showTooltip?: boolean
  /** Tooltip text */
  tooltipText?: string
  /** Copied tooltip text */
  copiedTooltipText?: string
  /** Show label */
  showLabel?: boolean
  /** Label text */
  label?: string
  /** Copied label text */
  copiedLabel?: string
  /** Disabled state */
  disabled?: boolean
  /** Additional class name */
  className?: string
}

// ============================================================================
// COPY BUTTON
// ============================================================================

export function CopyButton({
  text,
  icon,
  copiedIcon,
  copiedDuration = 2000,
  onCopy,
  onError,
  variant = 'ghost',
  size = 'sm',
  showTooltip = true,
  tooltipText = 'Copy to clipboard',
  copiedTooltipText = 'Copied!',
  showLabel = false,
  label = 'Copy',
  copiedLabel = 'Copied',
  disabled = false,
  className,
}: CopyButtonProps) {
  const [status, setStatus] = React.useState<CopyStatus>('idle')

  const handleCopy = async () => {
    if (disabled || status === 'copying') return

    setStatus('copying')

    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
      onCopy?.(text)

      setTimeout(() => {
        setStatus('idle')
      }, copiedDuration)
    } catch (error) {
      setStatus('error')
      onError?.(error as Error)

      setTimeout(() => {
        setStatus('idle')
      }, copiedDuration)
    }
  }

  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-9 w-9',
  }

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const isCopied = status === 'copied'
  const defaultIcon = icon || <Copy className={iconSizes[size]} />
  const defaultCopiedIcon = copiedIcon || (
    <Check className={cn(iconSizes[size], 'text-green-500')} />
  )

  const buttonContent = (
    <>
      <span
        className={cn(
          'transition-all duration-200',
          isCopied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        )}
      >
        {defaultIcon}
      </span>
      <span
        className={cn(
          'absolute transition-all duration-200',
          isCopied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        )}
      >
        {defaultCopiedIcon}
      </span>
      {showLabel && (
        <span className="ml-1.5">{isCopied ? copiedLabel : label}</span>
      )}
    </>
  )

  if (variant === 'minimal') {
    const button = (
      <button
        onClick={handleCopy}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center relative',
          'text-muted-foreground hover:text-foreground transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {buttonContent}
      </button>
    )

    if (!showTooltip) return button

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            {isCopied ? copiedTooltipText : tooltipText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const button = (
    <Button
      onClick={handleCopy}
      disabled={disabled}
      variant={variant === 'default' ? 'secondary' : variant}
      size="icon"
      className={cn(
        sizeClasses[size],
        'relative',
        showLabel && 'w-auto px-2',
        className
      )}
    >
      {buttonContent}
    </Button>
  )

  if (!showTooltip) return button

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>
          {isCopied ? copiedTooltipText : tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ============================================================================
// COPY TO CLIPBOARD - Text with copy button
// ============================================================================

export interface CopyToClipboardProps {
  text: string
  displayText?: string
  truncate?: boolean
  maxLength?: number
  onCopy?: (text: string) => void
  className?: string
  textClassName?: string
}

export function CopyToClipboard({
  text,
  displayText,
  truncate = false,
  maxLength = 50,
  onCopy,
  className,
  textClassName,
}: CopyToClipboardProps) {
  const display = displayText || text
  const truncatedText =
    truncate && display.length > maxLength
      ? `${display.slice(0, maxLength)}...`
      : display

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-md',
        'bg-muted/50 border border-border',
        className
      )}
    >
      <code
        className={cn(
          'text-sm font-mono',
          truncate && 'truncate',
          textClassName
        )}
        title={truncate ? display : undefined}
      >
        {truncatedText}
      </code>
      <CopyButton text={text} size="xs" onCopy={onCopy} />
    </div>
  )
}

// ============================================================================
// COPY CODE BLOCK - For code snippets
// ============================================================================

export interface CopyCodeBlockProps {
  code: string
  language?: string
  showLanguage?: boolean
  onCopy?: (code: string) => void
  className?: string
}

export function CopyCodeBlock({
  code,
  language,
  showLanguage = true,
  onCopy,
  className,
}: CopyCodeBlockProps) {
  return (
    <div
      className={cn(
        'relative group rounded-lg overflow-hidden',
        'bg-muted/50 border border-border',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        {showLanguage && language && (
          <span className="text-xs font-medium text-muted-foreground uppercase">
            {language}
          </span>
        )}
        <CopyButton
          text={code}
          size="xs"
          onCopy={onCopy}
          tooltipText="Copy code"
        />
      </div>

      {/* Code */}
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono">{code}</code>
      </pre>
    </div>
  )
}

// ============================================================================
// USE COPY - Hook for copy functionality
// ============================================================================

export interface UseCopyOptions {
  timeout?: number
  onSuccess?: (text: string) => void
  onError?: (error: Error) => void
}

export interface UseCopyReturn {
  copy: (text: string) => Promise<void>
  status: CopyStatus
  isCopied: boolean
  isError: boolean
  reset: () => void
}

export function useCopy(options: UseCopyOptions = {}): UseCopyReturn {
  const { timeout = 2000, onSuccess, onError } = options
  const [status, setStatus] = React.useState<CopyStatus>('idle')
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const reset = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setStatus('idle')
  }, [])

  const copy = React.useCallback(
    async (text: string) => {
      if (status === 'copying') return

      setStatus('copying')

      try {
        await navigator.clipboard.writeText(text)
        setStatus('copied')
        onSuccess?.(text)

        timeoutRef.current = setTimeout(() => {
          setStatus('idle')
        }, timeout)
      } catch (error) {
        setStatus('error')
        onError?.(error as Error)

        timeoutRef.current = setTimeout(() => {
          setStatus('idle')
        }, timeout)
      }
    },
    [status, timeout, onSuccess, onError]
  )

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    copy,
    status,
    isCopied: status === 'copied',
    isError: status === 'error',
    reset,
  }
}

// ============================================================================
// CLIPBOARD PASTE BUTTON
// ============================================================================

export interface PasteButtonProps {
  onPaste: (text: string) => void
  onError?: (error: Error) => void
  variant?: 'default' | 'ghost' | 'outline' | 'minimal'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showTooltip?: boolean
  tooltipText?: string
  disabled?: boolean
  className?: string
}

export function PasteButton({
  onPaste,
  onError,
  variant = 'ghost',
  size = 'sm',
  showTooltip = true,
  tooltipText = 'Paste from clipboard',
  disabled = false,
  className,
}: PasteButtonProps) {
  const [isPasting, setIsPasting] = React.useState(false)

  const handlePaste = async () => {
    if (disabled || isPasting) return

    setIsPasting(true)

    try {
      const text = await navigator.clipboard.readText()
      onPaste(text)
    } catch (error) {
      onError?.(error as Error)
    } finally {
      setIsPasting(false)
    }
  }

  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-9 w-9',
  }

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  if (variant === 'minimal') {
    const button = (
      <button
        onClick={handlePaste}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center',
          'text-muted-foreground hover:text-foreground transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <Clipboard className={iconSizes[size]} />
      </button>
    )

    if (!showTooltip) return button

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>{tooltipText}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const button = (
    <Button
      onClick={handlePaste}
      disabled={disabled}
      variant={variant === 'default' ? 'secondary' : variant}
      size="icon"
      className={cn(sizeClasses[size], className)}
    >
      <Clipboard className={iconSizes[size]} />
    </Button>
  )

  if (!showTooltip) return button

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export default CopyButton
