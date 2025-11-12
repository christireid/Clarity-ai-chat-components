'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'
import { ErrorMessage } from './error-message'

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:border-primary focus-visible:shadow-xs hover:border-accent-foreground/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted transition-all duration-200 resize-none',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50',
        success: 'border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'minRows'>,
    VariantProps<typeof textareaVariants> {
  error?: string
  autoResize?: boolean
  maxRows?: number
  minRows?: number
  ref?: React.Ref<HTMLTextAreaElement>
}

const Textarea = ({ className, variant, error, autoResize = false, maxRows, minRows, onChange, ref, ...props }: TextareaProps) => {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
  const hasError = error || variant === 'error'

  // React Compiler will optimize this automatically
  const adjustHeight = React.useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea || !autoResize) return

    textarea.style.height = 'auto'
    const scrollHeight = textarea.scrollHeight
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20
    
    if (minRows) {
      const minHeight = lineHeight * minRows
      textarea.style.height = `${Math.max(scrollHeight, minHeight)}px`
    }
    
    if (maxRows) {
      const maxHeight = lineHeight * maxRows
      const currentHeight = minRows ? Math.max(scrollHeight, lineHeight * minRows) : scrollHeight
      textarea.style.height = `${Math.min(currentHeight, maxHeight)}px`
    } else if (!minRows) {
      textarea.style.height = `${scrollHeight}px`
    }
  }, [autoResize, maxRows, minRows])

  React.useEffect(() => {
    adjustHeight()
  }, [adjustHeight])

  // React Compiler will optimize this automatically
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustHeight()
    onChange?.(e)
  }

  return (
    <div>
      <textarea
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
      <ErrorMessage error={error} />
    </div>
  )
}

Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
