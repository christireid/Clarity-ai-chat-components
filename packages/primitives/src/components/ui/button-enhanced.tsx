/**
 * Enhanced Button - shadcn/ui Button with loading state
 *
 * This wraps the shadcn Button component and adds the loading state functionality
 * from our custom Button, providing the best of both worlds:
 * - shadcn's excellent accessibility and keyboard navigation
 * - Our custom loading state with spinner
 */

import * as React from 'react'
import { Loader2, Check, X } from 'lucide-react'
import {
  Button as ShadcnButton,
  type ButtonProps as ShadcnButtonProps,
} from './button'
import { cn } from '../../lib/utils'

/**
 * Button state for loading/success/error indicators
 */
export type ButtonState = 'idle' | 'loading' | 'success' | 'error'

export interface ButtonProps extends ShadcnButtonProps {
  /**
   * Whether the button is in a loading state
   * When true, shows a spinner and disables the button
   */
  loading?: boolean

  /**
   * Button state for more fine-grained control
   * - 'idle': Normal button state
   * - 'loading': Shows spinner and disables button
   * - 'success': Shows checkmark icon
   * - 'error': Shows X icon
   */
  state?: ButtonState

  /**
   * @deprecated Ripple effect is not available in the shadcn Button.
   * This prop is accepted for backward compatibility but has no effect.
   * Remove this prop from your code - it does nothing.
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
      ...props
    },
    ref
  ) => {
    // Determine if button should show loading state (from either loading prop or state prop)
    const isLoading = loading || state === 'loading'
    const isSuccess = state === 'success'
    const isError = state === 'error'

    return (
      <ShadcnButton
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSuccess && <Check className="mr-2 h-4 w-4" />}
        {isError && <X className="mr-2 h-4 w-4" />}
        {children}
      </ShadcnButton>
    )
  }
)

Button.displayName = 'Button'

// Re-export buttonVariants for backward compatibility
export { buttonVariants } from './button'
