import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-lg border border-border/60 bg-[hsl(var(--surface-elevated))] px-4 py-2.5 text-sm shadow-[0_1px_0_rgba(15,23,42,0.04)] placeholder:text-muted-foreground/70 transition-all duration-200 focus-visible:outline-none focus-visible:border-transparent focus-visible:ring-4 focus-visible:ring-ring/25 focus-visible:shadow-[0_0_0_4px_rgba(22,119,255,0.12)] disabled:cursor-not-allowed disabled:bg-[hsl(var(--surface-muted))] disabled:text-muted-foreground/60 resize-none',
  {
    variants: {
      variant: {
        default: '',
        surface: 'bg-[hsl(var(--surface-muted))] border-transparent shadow-none focus-visible:border-primary/60',
        error: 'border-destructive focus-visible:ring-destructive/25 focus-visible:shadow-[0_0_0_4px_rgba(255,77,79,0.16)] text-destructive placeholder:text-destructive/60',
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
        {error && (
          <p className="mt-1 text-xs font-medium text-destructive">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
