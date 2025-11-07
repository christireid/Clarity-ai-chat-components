import { useState, useEffect, useRef, useMemo, useCallback, forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm shadow-sm',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm shadow-sm',
        outline:
          'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20 hover:shadow-sm',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm shadow-sm',
        ghost: 'hover:bg-accent hover:text-accent-foreground hover:shadow-sm',
        link: 'text-primary underline-offset-4 hover:underline',
        success:
          'bg-green-600 text-white hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm shadow-sm',
        error:
          'bg-red-600 text-white hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm shadow-sm',
        surface:
          'bg-surface text-surface-foreground hover:bg-surface/80 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm shadow-sm border border-border',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type ButtonState = 'idle' | 'loading' | 'success' | 'error'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  state?: ButtonState
  /** Show ripple effect on click (default: true for non-link variants) */
  ripple?: boolean
  /** Ripple color (default: based on variant) */
  rippleColor?: string
  /** Success message to show (default: checkmark icon) */
  successMessage?: React.ReactNode
  /** Error message to show (default: X icon) */
  errorMessage?: React.ReactNode
  /** Duration for success/error state before returning to idle (ms, default: 2000) */
  stateDuration?: number
}

interface RippleType {
  id: number
  x: number
  y: number
  size: number
}

// Ripple color palette - memoized outside component to avoid recreation
const RIPPLE_COLORS: Record<string, string> = {
  default: 'rgba(255, 255, 255, 0.35)',
  surface: 'rgba(22, 119, 255, 0.25)',
  secondary: 'rgba(22, 119, 255, 0.18)',
  dashed: 'rgba(22, 119, 255, 0.18)',
  outline: 'rgba(22, 119, 255, 0.18)',
  ghost: 'rgba(22, 119, 255, 0.14)',
  link: 'rgba(22, 119, 255, 0.12)',
  destructive: 'rgba(255, 77, 79, 0.35)',
  success: 'rgba(34, 197, 94, 0.32)',
  error: 'rgba(255, 77, 79, 0.35)',
} as const

// Loading spinner icon component - extracted for reuse
const LoadingSpinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

// Success icon component - extracted for reuse
const SuccessIcon = () => (
  <svg
    className="h-4 w-4 animate-[scale-in_0.2s_ease-out]"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="3"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// Error icon component - extracted for reuse
const ErrorIcon = () => (
  <svg
    className="h-4 w-4 animate-[shake_0.4s_ease-in-out]"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="3"
    aria-hidden="true"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      state: controlledState,
      ripple = true,
      rippleColor,
      successMessage,
      errorMessage,
      stateDuration = 2000,
      disabled,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = (asChild ? Slot : 'button') as 'button'
    const [internalState, setInternalState] = useState<ButtonState>('idle')
    const [ripples, setRipples] = useState<RippleType[]>([])
    const rippleIdRef = useRef(0)
    const stateTimeoutRef = useRef<NodeJS.Timeout>()

    const currentState = useMemo(
      () => controlledState || (loading ? 'loading' : internalState),
      [controlledState, loading, internalState]
    )

    const shouldShowRipple = useMemo(
      () => ripple && variant !== 'link' && !disabled && currentState === 'idle',
      [ripple, variant, disabled, currentState]
    )

    // Auto-reset state after duration
    useEffect(() => {
      if (
        (currentState === 'success' || currentState === 'error') &&
        !controlledState
      ) {
        stateTimeoutRef.current = setTimeout(() => {
          setInternalState('idle')
        }, stateDuration)
      }

      return () => {
        if (stateTimeoutRef.current) {
          clearTimeout(stateTimeoutRef.current)
        }
      }
    }, [currentState, controlledState, stateDuration])

    // Memoized ripple color calculation
    const rippleColorValue = useMemo(() => {
      if (rippleColor) return rippleColor
      return RIPPLE_COLORS[variant ?? 'default'] ?? 'rgba(22, 119, 255, 0.22)'
    }, [rippleColor, variant])

    // Memoized state content
    const stateContent = useMemo(() => {
      switch (currentState) {
        case 'loading':
          return <LoadingSpinner />
        case 'success':
          return successMessage || <SuccessIcon />
        case 'error':
          return errorMessage || <ErrorIcon />
        default:
          return null
      }
    }, [currentState, successMessage, errorMessage])

    // Memoized effective variant
    const effectiveVariant = useMemo(() => {
      if (currentState === 'success') return 'success'
      if (currentState === 'error') return 'error'
      return variant
    }, [currentState, variant])

    const isDisabled = disabled || currentState === 'loading'

    // Optimized click handler with useCallback
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        // Add ripple effect
        if (shouldShowRipple) {
          const button = e.currentTarget
          const rect = button.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const size = Math.max(rect.width, rect.height) * 2

          const newRipple: RippleType = {
            id: rippleIdRef.current++,
            x,
            y,
            size,
          }

          setRipples((prev) => [...prev, newRipple])

          // Remove ripple after animation
          setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
          }, 600)
        }

        onClick?.(e)
      },
      [shouldShowRipple, onClick]
    )

    return (
      <Comp
        className={cn(
          buttonVariants({ variant: effectiveVariant, size, className }),
          currentState === 'success' &&
            'after:absolute after:inset-0 after:rounded-inherit after:border-2 after:border-success/40 after:animate-[pulse_0.8s_ease-out_2] after:content-[""]',
          currentState === 'error' && 'animate-[error-shake_0.4s_ease-in-out]'
        )}
        ref={ref}
        disabled={isDisabled}
        data-variant={effectiveVariant}
        onClick={handleClick}
        aria-busy={currentState === 'loading'}
        {...props}
      >
        {/* Ripple effect */}
        {shouldShowRipple &&
          ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-[ripple_0.6s_ease-out]"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
                backgroundColor: rippleColorValue,
              }}
              aria-hidden="true"
            />
          ))}

        {/* Button content */}
        {stateContent}
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
export type { ButtonState }
