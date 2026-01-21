'use client'

import * as React from 'react'
import { cn } from '../lib/cn'
import {
  Card as ShadcnCard,
  CardHeader as ShadcnCardHeader,
  CardContent as ShadcnCardContent,
  CardFooter as ShadcnCardFooter,
} from './ui/card'
import { glassVariants, type GlassVariants } from '../lib/glass-variants'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  bordered?: boolean

  // Glassmorphism support
  /** Enable glassmorphism styling */
  glass?: boolean
  /** Glass intensity level */
  glassIntensity?: GlassVariants['intensity']
  /** Glass gradient overlay */
  glassGradient?: GlassVariants['gradient']
  /** Glass border style */
  glassBorder?: GlassVariants['border']
  /** Glass animation effects */
  glassAnimated?: GlassVariants['animated']
  /** Glass hover interaction */
  glassHover?: GlassVariants['hover']
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      hoverable = false,
      bordered = true,
      glass = false,
      glassIntensity,
      glassGradient,
      glassBorder,
      glassAnimated,
      glassHover,
      ...props
    },
    ref
  ) => {
    // If glass is enabled, use glassVariants
    if (glass) {
      return (
        <ShadcnCard
          ref={ref}
          className={cn(
            glassVariants({
              intensity: glassIntensity ?? 'medium',
              gradient: glassGradient ?? 'none',
              border: glassBorder ?? (bordered ? 'light' : 'none'),
              animated: glassAnimated ?? 'none',
              hover: glassHover ?? (hoverable ? 'lift' : 'none'),
            }),
            'rounded-xl',
            className
          )}
          {...props}
        />
      )
    }

    // Default non-glass Card
    return (
      <ShadcnCard
        ref={ref}
        className={cn(
          'rounded-xl shadow-xs transition-all duration-200',
          !bordered && 'border-0',
          hoverable && 'hover:shadow-sm hover:-translate-y-[1px] cursor-pointer',
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

// Re-export shadcn/ui components with custom styling where needed
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <ShadcnCardHeader ref={ref} className={className} {...props} />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-[0.13px]',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <ShadcnCardContent ref={ref} className={className} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <ShadcnCardFooter ref={ref} className={className} {...props} />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
