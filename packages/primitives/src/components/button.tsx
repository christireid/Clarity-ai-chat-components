'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'
import { useRippleEffect } from '../hooks/use-ripple-effect'
import { LoadingIcon, SuccessIcon, ErrorIcon } from './button-state-icons'
import { Button as ShadcnButton } from './ui/button'

// Extended button variants that include custom variants
const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-[0.13px] ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-sm hover:-translate-y-[1px] active:translate-y-0 active:shadow-xs',
        destructive:
          'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 hover:shadow-sm hover:-translate-y-[1px] active:translate-y-0 active:shadow-xs',
        outline:
          'border ring-1 ring-border bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/40 hover:shadow-xs transition-colors duration-200',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 hover:shadow-sm hover:-translate-y-[1px] active:translate-y-0 active:shadow-xs',
        ghost:
          'hover:bg-accent hover:text-accent-foreground transition-colors duration-200',
        link: 'text-primary underline-offset-4 hover:underline transition-colors duration-200',
        success:
          'bg-green-600 text-white shadow-xs hover:bg-green-700 hover:shadow-sm hover:-translate-y-[1px] active:translate-y-0 active:shadow-xs',
        error:
          'bg-red-600 text-white shadow-xs hover:bg-red-700 hover:shadow-sm hover:-translate-y-[1px] active:translate-y-0 active:shadow-xs',
        surface:
          'bg-surface text-surface-foreground border border-border/60 shadow-xs hover:bg-surface/80 hover:shadow-sm hover:-translate-y-[1px] active:translate-y-0 active:shadow-xs',
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md px-3 text-xs has-[>svg]:px-2.5',
        lg: 'h-12 rounded-md px-8 text-base has-[>svg]:px-6',
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

// Ripple color palette based on variant
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

export interface ButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>,
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
    const [internalState, setInternalState] =
      React.useState<ButtonState>('idle')
    const stateTimeoutRef = React.useRef<
      ReturnType<typeof setTimeout> | undefined
    >(undefined)

    // Determine current state: controlled state takes precedence, then loading, then internal
    // Use explicit null check since 'idle' is falsy but valid
    const currentState =
      controlledState !== undefined
        ? controlledState
        : loading
          ? 'loading'
          : internalState
    const shouldShowRipple =
      ripple && variant !== 'link' && !disabled && currentState === 'idle'

    // Use ripple effect hook
    const { ripples, addRipple } = useRippleEffect({
      enabled: shouldShowRipple,
    })

    // Ripple color
    const rippleColorValue =
      rippleColor ||
      RIPPLE_COLORS[variant ?? 'default'] ||
      'rgba(22, 119, 255, 0.22)'

    // Auto-reset state after duration
    React.useEffect(() => {
      if (
        (currentState === 'success' || currentState === 'error') &&
        !controlledState
      ) {
        // Validate stateDuration to prevent issues with invalid values
        const duration = Math.max(0, stateDuration || 2000)

        stateTimeoutRef.current = setTimeout(() => {
          setInternalState('idle')
        }, duration)
      } else {
        // Clear timeout if state changes before duration completes
        if (stateTimeoutRef.current) {
          clearTimeout(stateTimeoutRef.current)
          stateTimeoutRef.current = undefined
        }
      }

      return () => {
        if (stateTimeoutRef.current) {
          clearTimeout(stateTimeoutRef.current)
          stateTimeoutRef.current = undefined
        }
      }
    }, [currentState, controlledState, stateDuration])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (shouldShowRipple) {
        addRipple(e)
      }
      onClick?.(e)
    }

    // State content
    let stateContent = null
    switch (currentState) {
      case 'loading':
        stateContent = <LoadingIcon />
        break
      case 'success':
        stateContent = successMessage || <SuccessIcon />
        break
      case 'error':
        stateContent = errorMessage || <ErrorIcon />
        break
    }
    const isDisabled = disabled || currentState === 'loading'

    // Map custom variants to shadcn variants where possible
    // For custom variants (success, error, surface), don't pass variant to shadcn
    // and rely on our custom buttonVariants classes
    const shadcnVariant =
      variant === 'default' ||
      variant === 'secondary' ||
      variant === 'destructive' ||
      variant === 'outline' ||
      variant === 'ghost' ||
      variant === 'link'
        ? variant
        : undefined

    // Apply state-specific variant
    const effectiveVariant =
      currentState === 'success'
        ? 'success'
        : currentState === 'error'
          ? 'error'
          : variant

    return (
      <ShadcnButton
        className={cn(
          buttonVariants({ variant: effectiveVariant, size }),
          currentState === 'success' &&
            'after:absolute after:inset-0 after:rounded-inherit after:border-2 after:border-success/40 after:animate-[pulse_0.8s_ease-out_2] after:content-[""]',
          currentState === 'error' && 'animate-[error-shake_0.4s_ease-in-out]',
          className
        )}
        variant={shadcnVariant}
        size={shadcnVariant ? size : undefined}
        asChild={asChild}
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
      </ShadcnButton>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
export type { ButtonState }
