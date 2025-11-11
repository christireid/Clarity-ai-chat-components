'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'
import { useRippleEffect } from '../hooks/use-ripple-effect'
import { LoadingIcon, SuccessIcon, ErrorIcon } from './button-state-icons'

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
        ghost: 'hover:bg-accent hover:text-accent-foreground transition-colors duration-200',
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
  ref?: React.Ref<HTMLButtonElement>
}

const Button = ({
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
  ref,
  ...props
}: ButtonProps) => {
    const Comp = (asChild ? Slot : 'button') as 'button'
    const [internalState, setInternalState] =
      React.useState<ButtonState>('idle')
    const stateTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>()

    const currentState =
      controlledState || (loading ? 'loading' : internalState)
    const shouldShowRipple =
      ripple && variant !== 'link' && !disabled && currentState === 'idle'

    // Use ripple effect hook
    const { ripples, addRipple } = useRippleEffect({
      enabled: shouldShowRipple,
    })

    // React Compiler will optimize this automatically
    const rippleColorValue = rippleColor || RIPPLE_COLORS[variant ?? 'default'] || 'rgba(22, 119, 255, 0.22)'

    // Auto-reset state after duration
    React.useEffect(() => {
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

    // React Compiler will optimize this automatically
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (shouldShowRipple) {
        addRipple(e)
      }
      onClick?.(e)
    }

    // React Compiler will optimize this automatically
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

    // Apply state-specific variant
    const effectiveVariant =
      currentState === 'success'
        ? 'success'
        : currentState === 'error'
          ? 'error'
          : variant

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

Button.displayName = 'Button'

export { Button, buttonVariants }
export type { ButtonState }
