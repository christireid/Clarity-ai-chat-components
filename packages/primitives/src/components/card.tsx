'use client'

import * as React from 'react'
import { cn } from '../lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  bordered?: boolean
  ref?: React.Ref<HTMLDivElement>
}

const Card = ({ className, hoverable = false, bordered = true, ref, ...props }: CardProps) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl bg-card text-card-foreground shadow-xs transition-all duration-200',
      bordered && 'border border-border',
      hoverable && 'hover:shadow-sm hover:-translate-y-[1px] cursor-pointer',
      className
    )}
    {...props}
  />
)
Card.displayName = 'Card'

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

const CardHeader = ({ className, ref, ...props }: CardHeaderProps) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
)
CardHeader.displayName = 'CardHeader'

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  ref?: React.Ref<HTMLHeadingElement>
}

const CardTitle = ({ className, ref, ...props }: CardTitleProps) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-[0.13px]', className)}
    {...props}
  />
)
CardTitle.displayName = 'CardTitle'

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  ref?: React.Ref<HTMLParagraphElement>
}

const CardDescription = ({ className, ref, ...props }: CardDescriptionProps) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
)
CardDescription.displayName = 'CardDescription'

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

const CardContent = ({ className, ref, ...props }: CardContentProps) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
)
CardContent.displayName = 'CardContent'

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

const CardFooter = ({ className, ref, ...props }: CardFooterProps) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
