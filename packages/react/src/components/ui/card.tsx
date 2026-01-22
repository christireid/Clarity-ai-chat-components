import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'rounded-lg border bg-card text-card-foreground shadow-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

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
