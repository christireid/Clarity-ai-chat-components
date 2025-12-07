'use client'

import * as React from 'react'
import { cn } from '../lib/utils'
import {
  Card as BaseCard,
  CardHeader as BaseCardHeader,
  CardFooter as BaseCardFooter,
  CardContent as BaseCardContent,
} from './ui/card'

export interface CardProps extends React.ComponentProps<typeof BaseCard> {
  hoverable?: boolean
  bordered?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, bordered = true, ...props }, ref) => {
    return (
      <BaseCard
        ref={ref}
        className={cn(
          'shadow-xs transition-all duration-200',
          bordered ? 'border border-border' : 'border border-transparent shadow-none',
          hoverable && 'cursor-pointer hover:-translate-y-[1px] hover:shadow-sm',
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

const CardHeader = BaseCardHeader
const CardFooter = BaseCardFooter
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-[0.13px]', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = BaseCardContent

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
