import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { withGlass, type GlassComponentProps } from '../../lib/with-glass'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardBase = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'rounded-lg text-card-foreground',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

CardBase.displayName = 'CardBase'

export const Card = withGlass(CardBase, {
  intensity: 'medium',
  border: 'light',
  hover: 'lift',
})

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        ref={ref}
        {...props}
      />
    )
  }
)

CardHeader.displayName = 'CardHeader'

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        className={cn(
          'text-2xl font-semibold leading-none tracking-tight',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

CardTitle.displayName = 'CardTitle'

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return <div className={cn('p-6 pt-0', className)} ref={ref} {...props} />
  }
)

CardContent.displayName = 'CardContent'
