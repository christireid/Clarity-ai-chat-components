import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'
import { ErrorMessage } from './error-message'

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-lg border border-input/40 bg-background px-3.5 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:ring-offset-1 focus-visible:border-input focus-visible:shadow-focus-primary hover:border-input/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted transition-all duration-150 resize-y',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-destructive/60 focus-visible:border-destructive focus-visible:ring-destructive/20 focus-visible:shadow-focus-destructive',
        success: 'border-green-500/60 focus-visible:border-green-500 focus-visible:ring-green-500/20 focus-visible:shadow-focus-success',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: string
  autoResize?: boolean
  maxRows?: number
  /** React 19: ref is now a regular prop! */
  ref?: React.Ref<HTMLTextAreaElement>
}

function Textarea({ className, variant, error, autoResize = false, maxRows, onChange, ref, ...props }: TextareaProps) {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
    const hasError = error || variant === 'error'

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea || !autoResize) return

      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      
      if (maxRows) {
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight)
        const maxHeight = lineHeight * maxRows
        textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
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
              ref.current = node
            }
          }}
          onChange={handleChange}
          {...props}
        />
        <ErrorMessage error={error} />
      </div>
    )
  }
}

export { Textarea, textareaVariants }
