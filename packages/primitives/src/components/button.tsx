import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const buttonVariants = cva(
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-60 select-none overflow-hidden will-change-transform',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-gradient-to-r from-primary to-[hsl(var(--primary))] text-primary-foreground shadow-[0_14px_34px_rgba(22,119,255,0.32)] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(22,119,255,0.28)] active:translate-y-0 active:shadow-[0_10px_26px_rgba(22,119,255,0.25)]',
        surface:
          'bg-card text-foreground border border-border/70 shadow-[0_6px_18px_rgba(15,23,42,0.12)] hover:border-primary/45 hover:-translate-y-0.5 hover:text-primary hover:shadow-[0_16px_32px_rgba(15,23,42,0.16)] active:translate-y-0 active:shadow-[0_8px_20px_rgba(15,23,42,0.14)]',
        secondary:
          'bg-secondary text-secondary-foreground border border-secondary/70 shadow-none hover:border-primary/40 hover:bg-secondary/80 hover:text-primary',
        outline:
          'border border-border/70 bg-transparent text-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5',
        ghost:
          'border-transparent bg-transparent text-foreground hover:bg-primary/10 hover:text-primary',
        link:
          'border-transparent bg-transparent text-primary underline-offset-4 hover:underline focus-visible:ring-0 focus-visible:ring-offset-0',
        dashed:
          'border border-dashed border-border/60 bg-transparent text-foreground hover:border-primary/60 hover:text-primary hover:bg-primary/5',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow-[0_16px_38px_rgba(255,77,79,0.32)] hover:bg-destructive/90',
        success:
          'border-transparent bg-success text-success-foreground shadow-[0_16px_36px_rgba(34,197,94,0.28)] hover:bg-success/90',
        error:
          'border-transparent bg-destructive text-destructive-foreground shadow-[0_16px_38px_rgba(255,77,79,0.32)] hover:bg-destructive/90',
      },
      size: {
        default: 'h-11 px-5 text-sm',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-6 text-base',
        xl: 'h-14 rounded-xl px-7 text-base',
        icon: 'h-11 w-11',
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
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
  }, ref) => {
    const Comp = asChild ? Slot : 'button'
    const [internalState, setInternalState] = React.useState<ButtonState>('idle')
    const [ripples, setRipples] = React.useState<RippleType[]>([])
    const rippleIdRef = React.useRef(0)
    const stateTimeoutRef = React.useRef<NodeJS.Timeout>()
    
    const currentState = controlledState || (loading ? 'loading' : internalState)
    const shouldShowRipple = ripple && variant !== 'link' && !disabled && currentState === 'idle'
    
    // Auto-reset state after duration
    React.useEffect(() => {
      if ((currentState === 'success' || currentState === 'error') && !controlledState) {
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
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Add ripple effect
      if (shouldShowRipple) {
        const button = e.currentTarget
        const rect = button.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const size = Math.max(rect.width, rect.height) * 2
        
        const ripple: RippleType = {
          id: rippleIdRef.current++,
          x,
          y,
          size,
        }
        
        setRipples(prev => [...prev, ripple])
        
        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== ripple.id))
        }, 600)
      }
      
      onClick?.(e)
    }
    
    // Get ripple color based on variant
    const getRippleColor = () => {
      if (rippleColor) return rippleColor

      const palette = {
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

      return palette[variant ?? 'default'] ?? 'rgba(22, 119, 255, 0.22)'
    }
    
    // Get state content
    const getStateContent = () => {
      switch (currentState) {
        case 'loading':
          return (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
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
        
        case 'success':
          return successMessage || (
            <svg
              className="h-4 w-4 animate-[scale-in_0.2s_ease-out]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )
        
        case 'error':
          return errorMessage || (
            <svg
              className="h-4 w-4 animate-[shake_0.4s_ease-in-out]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          )
        
        default:
          return null
      }
    }
    
    const stateContent = getStateContent()
    const isDisabled = disabled || currentState === 'loading'
    
    // Apply state-specific variant
    const effectiveVariant = currentState === 'success' ? 'success'
      : currentState === 'error' ? 'error'
      : variant
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant: effectiveVariant, size, className }),
          currentState === 'success' && 'after:absolute after:inset-0 after:rounded-inherit after:border-2 after:border-success/40 after:animate-[pulse_0.8s_ease-out_2] after:content-[""]',
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
        {shouldShowRipple && ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-[ripple_0.6s_ease-out]"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: getRippleColor(),
            }}
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
