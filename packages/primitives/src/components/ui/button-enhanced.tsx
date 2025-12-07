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
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from './button'
import { cn } from '../../lib/utils'

export interface ButtonProps extends ShadcnButtonProps {
  /**
   * Whether the button is in a loading state
   * When true, shows a spinner and disables the button
   */
  loading?: boolean
  
  /**
   * @deprecated Ripple effect is not available in the shadcn Button.
   * This prop is accepted for backward compatibility but has no effect.
   * Remove this prop from your code - it does nothing.
   */
  ripple?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, ripple: _ripple, disabled, className, ...props }, ref) => {
    // Note: ripple is accepted but not yet implemented
    // This maintains API compatibility with the legacy button
    
    return (
      <ShadcnButton
        ref={ref}
        disabled={disabled || loading}
        className={cn(className)}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </ShadcnButton>
    )
  }
)

Button.displayName = 'Button'

// Re-export buttonVariants for backward compatibility
export { buttonVariants } from './button'
