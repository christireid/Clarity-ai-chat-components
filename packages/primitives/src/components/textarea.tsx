import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'
import { ErrorMessage } from './error-message'

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1 focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_hsl(var(--ring)/0.1)] hover:border-input/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted transition-all duration-150 ease-out resize-none',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/40 focus-visible:shadow-[0_0_0_3px_hsl(var(--destructive)/0.1)]',
        success: 'border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/40 focus-visible:shadow-[0_0_0_3px_rgb(34_197_94_/_0.1)]',
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
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, error, autoResize = false, maxRows, onChange, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
    const hasError = error || variant === 'error'

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea || !autoResize) return

      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      
      if (maxRows) {
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20
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
)
Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
