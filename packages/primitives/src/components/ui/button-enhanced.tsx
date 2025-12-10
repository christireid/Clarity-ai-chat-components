/**
 * Enhanced Button - shadcn/ui Button with loading state and additional variants
 *
 * This wraps the shadcn Button component and adds:
 * - Loading state functionality with spinner
 * - Additional variants: surface, success, error
 * - State prop for controlled loading/success/error states
 */

import * as React from 'react'
import { Loader2, Check, X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/utils'

/**
 * Button state for visual feedback
 */
export type ButtonState = 'idle' | 'loading' | 'success' | 'error'

// Extended button variants including surface, success, error
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // Additional variants
        surface:
          'bg-muted text-muted-foreground border border-border/60 hover:bg-muted/80',
        success: 'bg-green-600 text-white hover:bg-green-700',
        error: 'bg-red-600 text-white hover:bg-red-700',
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

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render as a child component using Radix Slot
   */
  asChild?: boolean

  /**
   * Whether the button is in a loading state
   * When true, shows a spinner and disables the button
   */
  loading?: boolean

  /**
   * Controlled state for the button
   * - idle: normal state
   * - loading: shows spinner
   * - success: shows checkmark
   * - error: shows X icon
   */
  state?: ButtonState

  /**
   * @deprecated Ripple effect is not available in the shadcn Button.
   * This prop is accepted for backward compatibility but has no effect.
   */
  ripple?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      loading,
      state,
      ripple: _ripple,
      disabled,
      className,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref
  ) => {
    // Determine effective state
    const isLoading = state === 'loading' || loading
    const isSuccess = state === 'success'
    const isError = state === 'error'

    const Comp = asChild ? Slot : 'button'

    // Render state icon
    const stateIcon = isLoading ? (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    ) : isSuccess ? (
      <Check className="mr-2 h-4 w-4" />
    ) : isError ? (
      <X className="mr-2 h-4 w-4" />
    ) : null

    return (
      <Comp
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {stateIcon}
        {children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { buttonVariants }
