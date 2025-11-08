import * as React from 'react'
import { cn } from '../lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  hoverable?: boolean
  bordered?: boolean
  elevation?: 'flat' | 'sm' | 'md' | 'lg'
}>(({ className, hoverable = false, bordered = true, elevation = 'sm', ...props }, ref) => {
  const elevationClasses = {
    flat: '',
    sm: 'shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
    md: 'shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.03)]',
    lg: 'shadow-[0_12px_24px_rgba(0,0,0,0.12),0_4px_8px_rgba(0,0,0,0.04)]'
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl bg-card text-card-foreground transition-all duration-200 ease-out',
        bordered && 'border border-border/40',
        !hoverable && elevationClasses[elevation],
        hoverable && [
          'cursor-pointer',
          elevation === 'flat' ? 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]' : 
          elevation === 'sm' ? 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.03)]' :
          elevation === 'md' ? 'hover:shadow-[0_8px_16px_rgba(0,0,0,0.12),0_4px_8px_rgba(0,0,0,0.04)]' :
          'hover:shadow-[0_20px_40px_rgba(0,0,0,0.15),0_8px_16px_rgba(0,0,0,0.06)]',
          'hover:-translate-y-[2px] hover:border-border/60'
        ],
        className
      )}
      {...props}
    />
  )
})
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
