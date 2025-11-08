import * as React from 'react'
import { cn } from '../lib/utils'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'h-4 w-4 rounded-sm ring-1 ring-border text-primary transition-all duration-200 shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 hover:ring-border/70',
          className,
        )}
        {...props}
      />
    )
  },
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
