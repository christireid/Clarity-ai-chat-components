import { forwardRef, useMemo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const inputVariants = cva(
  'flex w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:border-primary focus-visible:shadow-sm hover:border-input/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted transition-all duration-200',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 focus-visible:shadow-[var(--shadow-error)]',
        success: 'border-[hsl(var(--success))] focus-visible:border-[hsl(var(--success))] focus-visible:ring-[hsl(var(--success))]/20 focus-visible:shadow-[var(--shadow-success)]',
      },
      inputSize: {
        default: 'h-10',
        sm: 'h-8 text-xs px-2',
        lg: 'h-12 text-base px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
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

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, variant, inputSize, type, error, icon, iconPosition = 'left', id, ...props },
    ref
  ) => {
    const hasError = useMemo(() => error || variant === 'error', [error, variant])
    const errorId = useMemo(() => (id ? `${id}-error` : undefined), [id])
    const effectiveVariant = useMemo(
      () => (hasError ? 'error' : variant),
      [hasError, variant]
    )

    const inputElement = (
      <input
        type={type}
        id={id}
        className={cn(
          inputVariants({ variant: effectiveVariant, inputSize }),
          icon && iconPosition === 'left' && 'pl-10',
          icon && iconPosition === 'right' && 'pr-10',
          className
        )}
        ref={ref}
        aria-invalid={hasError}
        aria-describedby={errorId}
        {...props}
      />
    )

    if (icon) {
      return (
        <div className="relative">
          {iconPosition === 'left' && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          {inputElement}
          {iconPosition === 'right' && (
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          {error && <ErrorMessage error={error} id={errorId} />}
        </div>
      )
    }

    return (
      <div>
        {inputElement}
        {error && <ErrorMessage error={error} id={errorId} />}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
