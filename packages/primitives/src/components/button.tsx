import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        success: 'bg-green-600 text-white hover:bg-green-700 active:scale-95',
        error: 'bg-red-600 text-white hover:bg-red-700 active:scale-95',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
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
      
      switch (variant) {
        case 'default':
        case 'secondary':
          return 'rgba(255, 255, 255, 0.3)'
        case 'destructive':
        case 'error':
          return 'rgba(255, 255, 255, 0.3)'
        case 'success':
          return 'rgba(255, 255, 255, 0.3)'
        case 'ghost':
        case 'outline':
          return 'rgba(0, 0, 0, 0.1)'
        default:
          return 'rgba(255, 255, 255, 0.3)'
      }
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
          currentState === 'success' && 'animate-[success-glow_0.6s_ease-out]',
          currentState === 'error' && 'animate-[error-shake_0.4s_ease-in-out]'
        )}
        ref={ref}
        disabled={isDisabled}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple effect */}
        {shouldShowRipple && ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full animate-[ripple_0.6s_ease-out] pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              transform: 'translate(-50%, -50%) scale(0)',
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
