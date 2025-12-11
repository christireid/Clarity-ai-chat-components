'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'
import { ErrorMessage } from './error-message'
import { Textarea as ShadcnTextarea } from './ui/textarea'

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:border-primary focus-visible:shadow-xs hover:border-accent-foreground/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted transition-all duration-200 resize-none',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50',
        success: 'border-success focus-visible:border-success focus-visible:ring-success/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface TextareaProps
  extends React.ComponentProps<typeof ShadcnTextarea>,
    VariantProps<typeof textareaVariants> {
  error?: string
  autoResize?: boolean
  maxRows?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, error, autoResize = false, maxRows, onChange, id, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
    const hasError = error || variant === 'error'
    const generatedId = React.useId()
    const textareaId = id || generatedId
    const errorId = error ? `${textareaId}-error` : undefined

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea || !autoResize) return

      // SSR safety check
      if (typeof window === 'undefined' || !window.getComputedStyle) {
        return
      }

      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight

      if (maxRows && maxRows > 0) {
        const computedStyle = getComputedStyle(textarea)
        const lineHeightStr = computedStyle.lineHeight
        // Parse lineHeight, fallback to 1.2em (typical default) if invalid
        const lineHeight = lineHeightStr === 'normal' 
          ? parseFloat(computedStyle.fontSize) * 1.2
          : parseFloat(lineHeightStr) || parseFloat(computedStyle.fontSize) * 1.2
        
        if (isNaN(lineHeight) || lineHeight <= 0) {
          // Fallback: use fontSize * 1.2 if lineHeight is invalid
          const fontSize = parseFloat(computedStyle.fontSize) || 16
          const fallbackLineHeight = fontSize * 1.2
          const maxHeight = fallbackLineHeight * maxRows
          textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
        } else {
          const maxHeight = lineHeight * maxRows
          textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
        }
      } else {
        textarea.style.height = `${scrollHeight}px`
      }
    }, [autoResize, maxRows])

    React.useEffect(() => {
      adjustHeight()
    }, [adjustHeight])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      adjustHeight()
      onChange?.(e)
    }

    return (
      <div>
        <ShadcnTextarea
          id={textareaId}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            textareaVariants({ variant: hasError ? 'error' : variant }),
            className
          )}
          ref={(node) => {
            textareaRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
            }
          }}
          onChange={handleChange}
          {...props}
        />
        <ErrorMessage error={error} id={errorId} />
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
