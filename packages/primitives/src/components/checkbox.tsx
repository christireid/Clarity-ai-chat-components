import * as React from 'react'
import { cn } from '../lib/utils'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
<<<<<<< HEAD
          'h-4 w-4 rounded border border-input text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 ease-out',
=======
          'h-4 w-4 rounded border border-input/60 text-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:border-input/80 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_3px_rgba(var(--primary),0.1)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-out checked:bg-primary checked:border-primary',
>>>>>>> 1b21ed28486be701a6f841ef6ba6766ac5cf160d
          className
        )}
        {...props}
      />
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
