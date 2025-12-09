/**
 * Enhanced Button - shadcn/ui Button with loading state
 *
 * This wraps the shadcn Button component and adds the loading state functionality
 * from our custom Button, providing the best of both worlds:
 * - shadcn's excellent accessibility and keyboard navigation
 * - Our custom loading state with spinner
 */

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import {
  Button as ShadcnButton,
  ButtonProps as ShadcnButtonProps,
} from './button'
import { cn } from '../../lib/utils'

/**
 * Button state for visual feedback
 */
export type ButtonState = 'idle' | 'loading' | 'success' | 'error'

export interface ButtonProps extends ShadcnButtonProps {
  /**
   * Whether the button is in a loading state
   * When true, shows a spinner and disables the button
   */
  loading?: boolean

  /**
   * Button state for visual feedback
   * When 'loading', shows a spinner
   * @deprecated Use `loading` prop instead
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
    // Support both loading prop and state prop for backward compatibility
    const isLoading = loading || state === 'loading'

    return (
      <ShadcnButton
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </ShadcnButton>
    )
  }
)

Button.displayName = 'Button'

// Re-export buttonVariants for backward compatibility
export { buttonVariants } from './button'
