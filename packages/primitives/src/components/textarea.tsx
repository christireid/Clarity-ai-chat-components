import { forwardRef, useRef, useCallback, useEffect, useMemo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:border-primary focus-visible:shadow-sm hover:border-input/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted transition-all duration-200 resize-none',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 focus-visible:shadow-[var(--shadow-error)]',
        success: 'border-[hsl(var(--success))] focus-visible:border-[hsl(var(--success))] focus-visible:ring-[hsl(var(--success))]/20 focus-visible:shadow-[var(--shadow-success)]',
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

// Extracted error message component for reusability and consistency
interface ErrorMessageProps {
  error: string
  id?: string
}

const ErrorMessage = ({ error, id }: ErrorMessageProps) => (
  <p
    id={id}
    role="alert"
    className="mt-1.5 text-xs text-destructive flex items-center gap-1"
    aria-live="polite"
  >
    <svg
      className="h-3 w-3 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    {error}
  </p>
)

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, variant, error, autoResize = false, maxRows, onChange, id, ...props },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null)
    const hasError = useMemo(() => error || variant === 'error', [error, variant])
    const errorId = useMemo(() => (id ? `${id}-error` : undefined), [id])
    const effectiveVariant = useMemo(
      () => (hasError ? 'error' : variant),
      [hasError, variant]
    )

    // Combined ref callback to support both internal and external refs
    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref]
    )

    const adjustHeight = useCallback(() => {
      const textarea = internalRef.current
      if (!textarea || !autoResize) return

      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight

      if (maxRows) {
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10)
        const maxHeight = lineHeight * maxRows
        textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
      } else {
        textarea.style.height = `${scrollHeight}px`
      }
    }, [autoResize, maxRows])

    useEffect(() => {
      adjustHeight()
    }, [adjustHeight])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        adjustHeight()
        onChange?.(e)
      },
      [adjustHeight, onChange]
    )

    return (
      <div>
        <textarea
          id={id}
          className={cn(textareaVariants({ variant: effectiveVariant }), className)}
          ref={setRefs}
          onChange={handleChange}
          aria-invalid={hasError}
          aria-describedby={errorId}
          {...props}
        />
        {error && <ErrorMessage error={error} id={errorId} />}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
