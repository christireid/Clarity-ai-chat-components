/**
 * Interactive Card Component
 *
 * Enhanced card component with hover states, focus rings, and visual transitions.
 * Demonstrates best practices for interactive elements.
 */

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import {
  INTERACTION_VARIANTS,
  DURATION_SECONDS as durations,
} from '../../animations'
import { useGlassVariant } from '../../lib/with-glass'

export interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether card is clickable */
  interactive?: boolean
  /** Whether card is selected */
  selected?: boolean
  /** Whether card is disabled */
  disabled?: boolean
  /** Hover effect intensity */
  hoverIntensity?: 'none' | 'subtle' | 'medium' | 'strong'
  /** Show focus ring */
  showFocusRing?: boolean
  /** Show ripple effect on click */
  showRipple?: boolean
  /** Callback when card is clicked */
  onCardClick?: () => void
  /** Children */
  children: React.ReactNode
  /** Ref forwarding */
  ref?: React.Ref<HTMLDivElement>
}

/**
 * Card with enhanced interactivity
 */
export const InteractiveCard = React.memo(function InteractiveCard({
  interactive = false,
  selected = false,
  disabled = false,
  hoverIntensity = 'medium',
  showFocusRing = true,
  showRipple = false,
  onCardClick,
  className,
  children,
  ref,
  ...props
}: InteractiveCardProps) {
  // Accessibility: Respect user's reduced motion preference
  const prefersReducedMotion = useReducedMotion()

  // Apply glass effect if enabled in context
  const glassClass = useGlassVariant({
    intensity: 'medium',
    border: 'light',
    hover: 'lift',
  })

  const [isHovered, setIsHovered] = React.useState(false)
  const [ripples, setRipples] = React.useState<
    { x: number; y: number; id: number }[]
  >([])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return

    if (showRipple) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()

      setRipples((prev) => [...prev, { x, y, id }])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 600)
    }

    onCardClick?.()
  }

  // Accessibility: Use minimal animations when reduced motion is preferred
  const hoverVariants = prefersReducedMotion
    ? {
        none: {},
        subtle: { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
        medium: { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },
        strong: { boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
      }
    : {
        none: {},
        subtle: {
          y: -2,
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: { duration: durations.normal, ease: [0.4, 0, 0.2, 1] },
        },
        medium: {
          y: -4,
          boxShadow:
            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          transition: { duration: durations.normal, ease: [0.4, 0, 0.2, 1] },
        },
        strong: {
          y: -8,
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          transition: { duration: durations.normal, ease: [0.4, 0, 0.2, 1] },
        },
      }

  // Extract HTML event handlers that conflict with Framer Motion props
  const {
    onDrag: _onDrag,
    onDragStart: _onDragStart,
    onDragEnd: _onDragEnd,
    onDragOver: _onDragOver,
    onDragEnter: _onDragEnter,
    onDragLeave: _onDragLeave,
    onDrop: _onDrop,
    animate: _animate,
    onAnimationStart: _onAnimationStart,
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    ...motionProps
  } = props as InteractiveCardProps & {
    onDrag?: React.DragEventHandler<HTMLDivElement>
    onDragStart?: React.DragEventHandler<HTMLDivElement>
    onDragEnd?: React.DragEventHandler<HTMLDivElement>
    onDragOver?: React.DragEventHandler<HTMLDivElement>
    onDragEnter?: React.DragEventHandler<HTMLDivElement>
    onDragLeave?: React.DragEventHandler<HTMLDivElement>
    onDrop?: React.DragEventHandler<HTMLDivElement>
    animate?: unknown
    onAnimationStart?: React.AnimationEventHandler<HTMLDivElement>
    onAnimationEnd?: React.AnimationEventHandler<HTMLDivElement>
    onAnimationIteration?: React.AnimationEventHandler<HTMLDivElement>
  }

  // Leveraging Framer Motion v12's improved type inference
  // Determine animate prop - use custom hover animation if hovered, otherwise use prop or undefined
  // Accessibility: Disable scale transform when reduced motion is preferred
  const animateValue: import('framer-motion').TargetAndTransition | undefined =
    isHovered && !disabled && interactive
      ? ({
          ...hoverVariants[hoverIntensity],
          scale: prefersReducedMotion
            ? 1
            : hoverIntensity !== 'none'
              ? 1.02
              : 1,
        } as import('framer-motion').TargetAndTransition)
      : (_animate as import('framer-motion').TargetAndTransition | undefined)

  return (
    <motion.div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-lg border bg-card transition-all duration-150 ease-out shadow-xs',
        glassClass,
        interactive &&
          'cursor-pointer hover:shadow-md',
        disabled && 'opacity-50 cursor-not-allowed',
        selected &&
          'ring-2 ring-primary/50 ring-offset-2 shadow-md',
        showFocusRing &&
          'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1',
        className
      )}
      tabIndex={interactive && !disabled ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      aria-disabled={disabled}
      aria-pressed={selected}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (interactive && !disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onCardClick?.()
        }
      }}
      animate={animateValue}
      // Accessibility: Disable tap scale when reduced motion is preferred
      whileTap={
        !disabled && interactive && !prefersReducedMotion
          ? { scale: 0.98, transition: { duration: durations.fast } }
          : undefined
      }
      {...motionProps}
    >
      {/* Ripple effects - Accessibility: Use fade only when reduced motion */}
      {showRipple && !prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: durations.slower }}
              className="absolute w-20 h-20 -ml-10 -mt-10 rounded-full bg-primary/20"
              style={{ left: ripple.x, top: ripple.y }}
            />
          ))}
        </div>
      )}
      {/* Accessibility: Simple opacity fade for ripple when reduced motion is preferred */}
      {showRipple && prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0 }}
              transition={{ duration: durations.normal }}
              className="absolute inset-0 bg-primary/10"
            />
          ))}
        </div>
      )}

      {/* Content */}
      {children}

      {/* Selected indicator - Accessibility: instant appearance when reduced motion */}
      {selected && (
        <motion.div
          initial={prefersReducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute top-0 left-0 right-0 h-1 bg-primary origin-left"
        />
      )}
    </motion.div>
  )
})

InteractiveCard.displayName = 'InteractiveCard'

/**
 * Interactive button with enhanced states
 */
export interface InteractiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: 'default' | 'primary' | 'success' | 'destructive' | 'ghost'
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Loading state */
  loading?: boolean
  /** Icon before text */
  icon?: React.ReactNode
  /** Icon after text */
  iconRight?: React.ReactNode
  /** Children */
  children?: React.ReactNode
  /** Ref forwarding */
  ref?: React.Ref<HTMLButtonElement>
}

export function InteractiveButton({
  variant = 'default',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  disabled,
  className,
  children,
  ref,
  ...props
}: InteractiveButtonProps) {
  const variantClasses = {
    default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    success: 'bg-success text-success-foreground hover:bg-success/90',
    destructive:
      'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  }

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg',
  }

  // Extract HTML drag event handlers to avoid conflicts with Framer Motion
  const {
    onDrag: _onDrag,
    onDragStart: _onDragStart,
    onDragEnd: _onDragEnd,
    onDragOver: _onDragOver,
    onDragEnter: _onDragEnter,
    onDragLeave: _onDragLeave,
    onDrop: _onDrop,
    ...motionButtonProps
  } = props as React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onDrag?: React.DragEventHandler<HTMLButtonElement>
    onDragStart?: React.DragEventHandler<HTMLButtonElement>
    onDragEnd?: React.DragEventHandler<HTMLButtonElement>
    onDragOver?: React.DragEventHandler<HTMLButtonElement>
    onDragEnter?: React.DragEventHandler<HTMLButtonElement>
    onDragLeave?: React.DragEventHandler<HTMLButtonElement>
    onDrop?: React.DragEventHandler<HTMLButtonElement>
  }

  return (
    // @ts-expect-error - framer-motion HTMLMotionProps type complexity issue
    <motion.button
      ref={ref}
      whileHover={
        !disabled && !loading ? INTERACTION_VARIANTS.button.hover : undefined
      }
      whileTap={
        !disabled && !loading ? INTERACTION_VARIANTS.button.tap : undefined
      }
      transition={INTERACTION_VARIANTS.button.transition}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 ease-out shadow-xs',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        'hover:shadow-md hover:-translate-y-px',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...motionButtonProps}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: durations.slower,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      )}
      {!loading && icon}
      {children}
      {!loading && iconRight}
    </motion.button>
  )
}

InteractiveButton.displayName = 'InteractiveButton'

/**
 * Interactive list item
 */
export interface InteractiveListItemProps {
  /** Whether item is selected */
  selected?: boolean
  /** Whether item is disabled */
  disabled?: boolean
  /** Icon */
  icon?: React.ReactNode
  /** Title */
  title: string
  /** Description */
  description?: string
  /** Badge */
  badge?: React.ReactNode
  /** onClick handler */
  onClick?: () => void
  /** Additional className */
  className?: string
}

export const InteractiveListItem: React.FC<InteractiveListItemProps> = ({
  selected = false,
  disabled = false,
  icon,
  title,
  description,
  badge,
  onClick,
  className,
}) => {
  return (
    <motion.div
      whileHover={
        !disabled ? { x: 4, backgroundColor: 'hsl(var(--accent) / 0.5)' } : {}
      }
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={!disabled ? onClick : undefined}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150 ease-out',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1',
        'hover:bg-accent/50 hover:shadow-[0_2px_8px_rgba(15,23,42,0.08)]',
        selected && 'bg-accent shadow-sm',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      tabIndex={!disabled ? 0 : undefined}
      role="button"
      aria-selected={selected}
      aria-disabled={disabled}
    >
      {icon && (
        <div className="flex-shrink-0 text-muted-foreground">{icon}</div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{title}</span>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground truncate">
            {description}
          </p>
        )}
      </div>

      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex-shrink-0 w-2 h-2 rounded-full bg-primary"
        />
      )}
    </motion.div>
  )
}

InteractiveListItem.displayName = 'InteractiveListItem'
